import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const dynamic = "force-dynamic";

interface GHLWebhookPayload {
  type: string;
  formId: string;
  formName: string;
  submissionId: string;
  contactId: string;
  contact: {
    name?: string;
    firstName?: string;
    email?: string;
    phone?: string;
    [key: string]: any;
  };
  customFields?: Record<string, any>;
  submittedAt: string;
  location?: string;
}

/**
 * Verify webhook signature from GoHighLevel
 * Uses HMAC SHA-256 to validate the webhook is from GHL
 */
function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) {
    console.warn("⚠️ No signature provided in webhook");
    return false;
  }

  try {
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest("hex");

    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error("❌ Signature verification error:", error);
    return false;
  }
}

/**
 * GoHighLevel Webhook Handler
 *
 * This endpoint receives form submission webhooks from GoHighLevel
 * and processes them based on form type.
 *
 * Setup Instructions:
 * 1. In GoHighLevel, go to Settings → Integrations → Webhooks
 * 2. Create webhook pointing to: https://your-domain.com/api/webhooks/ghl
 * 3. Set webhook secret in GOHIGHLEVEL_WEBHOOK_SECRET env var
 * 4. Select "Form Submission" as trigger event
 * 5. Copy the webhook secret from GHL and add to your .env.local
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    const payload: GHLWebhookPayload = JSON.parse(rawBody);

    // Verify webhook signature (fixes issue #7)
    const webhookSecret = process.env.GOHIGHLEVEL_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = request.headers.get("x-ghl-signature");

      if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
        console.error("❌ Invalid webhook signature - possible unauthorized request");
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 401 }
        );
      }

      console.log("✅ Webhook signature verified");
    } else {
      console.warn("⚠️ GOHIGHLEVEL_WEBHOOK_SECRET not set - signature verification skipped");
    }

    console.log("Received GHL webhook:", {
      formId: payload.formId,
      formName: payload.formName,
      contactEmail: payload.contact.email,
    });

    // Route to appropriate handler based on form type
    const formType = determineFormType(payload.formId, payload.formName);

    switch (formType) {
      case "contact":
        await handleContactForm(payload);
        break;
      case "farm_stay":
        await handleFarmStayBooking(payload);
        break;
      case "csa":
        await handleCSAInterest(payload);
        break;
      case "art_residency":
        await handleArtResidency(payload);
        break;
      case "newsletter":
        await handleNewsletterSignup(payload);
        break;
      default:
        console.warn("Unknown form type:", payload.formId);
    }

    // Store submission in Supabase (fixes issue #8)
    const submissionId = await storeSubmission(payload, formType);

    // TODO: See issue #9 in act-regenerative-studio: Sync to Notion
    // await syncToNotion(payload, formType);

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
      formType,
      submissionId,
    });
  } catch (error) {
    console.error("GHL webhook error:", error);
    return NextResponse.json(
      {
        error: "Failed to process webhook",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Determine form type from GHL webhook payload
 * Fixes issue #10 - Uses form ID mapping with name-based fallback
 *
 * Setup: Add these to your .env.local:
 * - GHL_FORM_CONTACT=<form-id-from-ghl>
 * - GHL_FORM_FARM_STAY=<form-id-from-ghl>
 * - GHL_FORM_CSA=<form-id-from-ghl>
 * - GHL_FORM_ART_RESIDENCY=<form-id-from-ghl>
 * - GHL_FORM_NEWSLETTER=<form-id-from-ghl>
 *
 * To get form IDs: GHL → Settings → Forms → Copy form ID
 */
function determineFormType(
  formId: string,
  formName: string
): "contact" | "farm_stay" | "csa" | "art_residency" | "newsletter" | "unknown" {
  // Primary: Map by form ID (most reliable)
  const formMappings: Record<string, string> = {
    [process.env.GHL_FORM_CONTACT || ""]: "contact",
    [process.env.GHL_FORM_FARM_STAY || ""]: "farm_stay",
    [process.env.GHL_FORM_CSA || ""]: "csa",
    [process.env.GHL_FORM_ART_RESIDENCY || ""]: "art_residency",
    [process.env.GHL_FORM_NEWSLETTER || ""]: "newsletter",
  };

  // Check if we have a direct form ID match
  if (formId && formMappings[formId]) {
    const mappedType = formMappings[formId] as "contact" | "farm_stay" | "csa" | "art_residency" | "newsletter";
    console.log(`✅ Form matched by ID: ${formId} → ${mappedType}`);
    return mappedType;
  }

  // Fallback: Match by form name (less reliable but works without config)
  const nameLower = formName.toLowerCase();
  let detectedType: "contact" | "farm_stay" | "csa" | "art_residency" | "newsletter" | "unknown" = "unknown";

  if (nameLower.includes("contact")) detectedType = "contact";
  else if (nameLower.includes("farm") || nameLower.includes("stay") || nameLower.includes("booking")) detectedType = "farm_stay";
  else if (nameLower.includes("csa") || nameLower.includes("harvest")) detectedType = "csa";
  else if (nameLower.includes("art") || nameLower.includes("residency")) detectedType = "art_residency";
  else if (nameLower.includes("newsletter") || nameLower.includes("subscribe")) detectedType = "newsletter";

  if (detectedType !== "unknown") {
    console.log(`⚠️ Form matched by name fallback: "${formName}" → ${detectedType}`);
    console.log(`💡 Tip: Set GHL_FORM_${detectedType.toUpperCase()}=${formId} in .env.local for more reliable matching`);
  } else {
    console.warn(`❌ Unknown form type: ID="${formId}", Name="${formName}"`);
  }

  return detectedType;
}

async function handleContactForm(payload: GHLWebhookPayload) {
  console.log("Processing contact form submission:", payload.contact.email);
  // TODO: See issue #11 in act-regenerative-studio: Send notification email
  // TODO: See issue #12 in act-regenerative-studio: Create Notion entry in "Partnerships" database
  // TODO: See issue #13 in act-regenerative-studio: Add to CRM workflow
}

async function handleFarmStayBooking(payload: GHLWebhookPayload) {
  console.log("Processing farm stay booking:", payload.contact.email);

  // Send confirmation email (fixes issue #15)
  if (payload.contact.email && payload.contact.name) {
    try {
      const { sendBookingConfirmation } = await import('@/lib/email');
      await sendBookingConfirmation(
        payload.contact.email,
        payload.contact.name,
        {
          dates: payload.customFields?.dates || 'TBD',
          guests: payload.customFields?.guests || 1,
        }
      );
      console.log("✅ Booking confirmation sent to:", payload.contact.email);
    } catch (error) {
      console.error("❌ Failed to send booking confirmation:", error);
    }
  }

  // TODO: See issue #14 in act-regenerative-studio: Create Notion entry in "Bookings" database
  // TODO: See issue #16 in act-regenerative-studio: Add to calendar
}

async function handleCSAInterest(payload: GHLWebhookPayload) {
  console.log("Processing CSA interest:", payload.contact.email);

  // Send welcome email (fixes issue #19)
  if (payload.contact.email) {
    try {
      const { sendCSAWelcome } = await import('@/lib/email');
      await sendCSAWelcome(
        payload.contact.email,
        payload.contact.name
      );
      console.log("✅ CSA welcome email sent to:", payload.contact.email);
    } catch (error) {
      console.error("❌ Failed to send CSA welcome email:", error);
    }
  }

  // TODO: See issue #17 in act-regenerative-studio: Create Notion entry in "CSA Members" database
  // TODO: See issue #18 in act-regenerative-studio: Add to Harvest mailing list
}

async function handleArtResidency(payload: GHLWebhookPayload) {
  console.log("Processing art residency application:", payload.contact.email);

  // Send acknowledgment email (fixes issue #21)
  if (payload.contact.email && payload.contact.name) {
    try {
      const { sendResidencyAcknowledgment } = await import('@/lib/email');
      await sendResidencyAcknowledgment(
        payload.contact.email,
        payload.contact.name
      );
      console.log("✅ Residency acknowledgment sent to:", payload.contact.email);
    } catch (error) {
      console.error("❌ Failed to send residency acknowledgment:", error);
    }
  }

  // TODO: See issue #20 in act-regenerative-studio: Create Notion entry in "Residency Applications" database
  // TODO: See issue #22 in act-regenerative-studio: Notify residency coordinator (requires coordinator email setup)
}

async function handleNewsletterSignup(payload: GHLWebhookPayload) {
  console.log("Processing newsletter signup:", payload.contact.email);

  // Send welcome email (fixes issue #24)
  try {
    const { sendNewsletterWelcome } = await import('@/lib/email');
    await sendNewsletterWelcome(
      payload.contact.email!,
      payload.contact.name
    );
    console.log("✅ Newsletter welcome email sent to:", payload.contact.email);
  } catch (error) {
    console.error("❌ Failed to send newsletter welcome email:", error);
    // Don't fail the webhook if email fails
  }

  // TODO: See issue #23 in act-regenerative-studio: Add to newsletter list (requires email service provider integration)
}

/**
 * Store form submission in Supabase
 * Fixes issue #8
 */
async function storeSubmission(
  payload: GHLWebhookPayload,
  formType: string
): Promise<string | null> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const submissionData = {
      form_id: payload.formId,
      form_name: payload.formName,
      form_type: formType,
      submission_id: payload.submissionId,
      contact_id: payload.contactId,
      email: payload.contact.email,
      name: payload.contact.name,
      phone: payload.contact.phone,
      custom_fields: payload.customFields || {},
      submitted_at: payload.submittedAt || new Date().toISOString(),
      webhook_payload: payload,
      synced_to_notion: false,
    };

    const { data, error } = await supabase
      .from('ghl_submissions')
      .insert([submissionData])
      .select('id')
      .single();

    if (error) {
      console.error("Failed to store GHL submission:", error);
      return null;
    }

    console.log("GHL submission stored with ID:", data?.id);
    return data?.id || null;

  } catch (error) {
    console.error("Error storing submission:", error);
    return null;
  }
}
