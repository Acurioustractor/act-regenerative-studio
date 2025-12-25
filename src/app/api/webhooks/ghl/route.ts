import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface GHLWebhookPayload {
  type: string;
  formId: string;
  formName: string;
  submissionId: string;
  contactId: string;
  contact: {
    name?: string;
    email?: string;
    phone?: string;
    [key: string]: any;
  };
  customFields: Record<string, any>;
  submittedAt: string;
  location?: string;
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
 */
export async function POST(request: NextRequest) {
  try {
    const payload: GHLWebhookPayload = await request.json();

    // Verify webhook signature (optional but recommended)
    const webhookSecret = process.env.GOHIGHLEVEL_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = request.headers.get("x-ghl-signature");
      // TODO: Implement signature verification
      // if (!verifySignature(payload, signature, webhookSecret)) {
      //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      // }
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

    // TODO: Store submission in Supabase
    // await storeSubmission(payload, formType);

    // TODO: Sync to Notion
    // await syncToNotion(payload, formType);

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
      formType,
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

function determineFormType(
  formId: string,
  formName: string
): "contact" | "farm_stay" | "csa" | "art_residency" | "newsletter" | "unknown" {
  // Map form IDs or names to types
  // TODO: Update these with actual GHL form IDs
  const formMappings: Record<string, any> = {
    [process.env.CONTACT_FORM_ID || ""]: "contact",
    [process.env.FARM_STAY_BOOKING || ""]: "farm_stay",
    [process.env.CSA_INTEREST || ""]: "csa",
    [process.env.ART_RESIDENCY || ""]: "art_residency",
    [process.env.NEWSLETTER_FORM_ID || ""]: "newsletter",
  };

  const mappedType = formMappings[formId];
  if (mappedType) return mappedType;

  // Fallback: match by form name
  const nameLower = formName.toLowerCase();
  if (nameLower.includes("contact")) return "contact";
  if (nameLower.includes("farm") || nameLower.includes("stay")) return "farm_stay";
  if (nameLower.includes("csa") || nameLower.includes("harvest")) return "csa";
  if (nameLower.includes("art") || nameLower.includes("residency")) return "art_residency";
  if (nameLower.includes("newsletter")) return "newsletter";

  return "unknown";
}

async function handleContactForm(payload: GHLWebhookPayload) {
  console.log("Processing contact form submission:", payload.contact.email);
  // TODO: Send notification email
  // TODO: Create Notion entry in "Partnerships" database
  // TODO: Add to CRM workflow
}

async function handleFarmStayBooking(payload: GHLWebhookPayload) {
  console.log("Processing farm stay booking:", payload.contact.email);
  // TODO: Create Notion entry in "Bookings" database
  // TODO: Send confirmation email
  // TODO: Add to calendar
}

async function handleCSAInterest(payload: GHLWebhookPayload) {
  console.log("Processing CSA interest:", payload.contact.email);
  // TODO: Create Notion entry in "CSA Members" database
  // TODO: Add to Harvest mailing list
  // TODO: Send welcome email with next steps
}

async function handleArtResidency(payload: GHLWebhookPayload) {
  console.log("Processing art residency application:", payload.contact.email);
  // TODO: Create Notion entry in "Residency Applications" database
  // TODO: Send acknowledgment email
  // TODO: Notify residency coordinator
}

async function handleNewsletterSignup(payload: GHLWebhookPayload) {
  console.log("Processing newsletter signup:", payload.contact.email);
  // TODO: Add to newsletter list
  // TODO: Send welcome email
}
