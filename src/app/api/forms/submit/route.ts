import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type FormFields = Record<string, unknown>;

interface FormSubmissionBody {
  projectCode?: string;
  formType?: string;
  fields?: FormFields;
  additionalTags?: unknown;
  dryRun?: boolean;
}

interface NormalizedFormSubmission {
  projectCode?: string;
  formType?: string;
  fields: FormFields;
  additionalTags: string[];
}

const SOURCE_SITE_TAG = 'act-regenerative-studio';

function normalizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];

  return tags
    .filter((tag): tag is string => typeof tag === 'string')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function hasContactPoint(fields: FormFields | undefined): boolean {
  if (!fields) return false;

  const email = fields.email;
  const phone = fields.phone;

  return (
    (typeof email === 'string' && email.trim().length > 0) ||
    (typeof phone === 'string' && phone.trim().length > 0)
  );
}

function buildSubmission(body: FormSubmissionBody): NormalizedFormSubmission {
  const additionalTags = normalizeTags(body.additionalTags);

  return {
    projectCode: body.projectCode,
    formType: body.formType,
    fields: body.fields || {},
    additionalTags: Array.from(new Set([...additionalTags, SOURCE_SITE_TAG])),
  };
}

/**
 * Form Submission API
 *
 * Forwards form submissions to the act-ecosystem Command Center API
 * which handles GHL integration and project code tagging.
 *
 * Usage:
 * POST /api/forms/submit
 * Body: {
 *   projectCode: 'ACT-HV',  // Optional - links to ACT project
 *   formType: 'newsletter', // Optional - 'contact', 'newsletter', 'csa', etc.
 *   fields: {
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     email: 'john@example.com',
 *     phone: '+61...',
 *     company: 'Acme Inc',
 *     message: 'Hello...'
 *   },
 *   additionalTags: ['Partner', 'Event']  // Optional extra tags
 * }
 */
export async function POST(request: NextRequest) {
  let body: FormSubmissionBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON payload' },
      { status: 400 }
    );
  }

  if (!hasContactPoint(body.fields)) {
    return NextResponse.json(
      { success: false, error: 'Email or phone required' },
      { status: 400 }
    );
  }

  const submission = buildSubmission(body);
  const apiUrl = process.env.ACT_ECOSYSTEM_API_URL || 'http://localhost:3456';

  if (body.dryRun === true) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'Dry run is unavailable in production' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      dryRun: true,
      message: 'Validated locally. No CRM submission was sent.',
      wouldForwardTo: `${apiUrl}/api/forms/submit`,
      submission,
    });
  }

  try {
    // Forward to act-ecosystem Command Center API
    console.log(`Forwarding form submission to ${apiUrl}/api/forms/submit`);
    console.log(`Project: ${submission.projectCode || 'none'}, Type: ${submission.formType || 'general'}`);

    const response = await fetch(`${apiUrl}/api/forms/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error: ${response.status}`, errorText);

      // If the ecosystem API is down, fall back to local storage
      return await handleFallback(submission);
    }

    const result = await response.json();
    console.log('Form submitted successfully:', result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Form submission error:', error);
    return await handleFallback(submission);
  }
}

// Live GHL pipeline + entry-stage IDs (ACT location). Maps a submission to where
// the lead enters for team tracking. Newsletter signups are subscribers, not
// pipeline leads, so they get no opportunity. See
// docs/strategy/act-forms-ghl-pipelines-messages.md.
// pipelineId is the GHL pipeline id (ghl_id), NOT the Supabase mirror row id.
// stageId values are the real GHL stage ids from the synced stages payload.
const GHL_PIPELINES = {
  universalInquiry: {
    pipelineId: 'ggQw10DuH0XRji6keimS',
    stageId: '2eded979-7439-407d-89b6-762499b56658', // New Inquiry
  },
  empathyLedger: {
    pipelineId: 'aRGmSaMh62wPO2R0Bt4g',
    stageId: '5c73d63e-619f-465a-90bb-151ea20351d7', // Identified
  },
  goodsBuyer: {
    pipelineId: 'FjMyJM3YzWQFmKqR9fur',
    stageId: '1fd317ec-f8f1-4837-b324-e48c22956cdd', // First Contact
  },
} as const;

function resolvePipelineRoute(
  body: NormalizedFormSubmission
): { pipelineId: string; stageId: string } | null {
  if (body.formType === 'newsletter') return null; // subscriber, not a pipeline lead
  switch (body.projectCode) {
    case 'ACT-EL':
      return GHL_PIPELINES.empathyLedger;
    case 'ACT-GD':
      return GHL_PIPELINES.goodsBuyer;
    default:
      return GHL_PIPELINES.universalInquiry; // catch-all (Universal Inquiry)
  }
}

/**
 * Direct GHL push (production path).
 *
 * The act-ecosystem Command Center normally owns the GHL integration, but it is a
 * localhost-only service, so in production we push to the SAME GHL location
 * directly via the shared client (reads GHL_API_KEY / GHL_LOCATION_ID). Best
 * effort: the contact is tagged with the project code, form type, and the form's
 * context tags so it matches the ecosystem's tagging. Returns true on upsert.
 *
 * When GHL_ENABLE_PIPELINES=true it also opens an opportunity in the mapped
 * pipeline/stage (non-fatal: a failed opportunity does not fail the contact).
 *
 * This only runs from the fallback path (Command Center unreachable), so in dev
 * (Command Center up) the contact is not double-created.
 */
type GHLPushResult = { contact: boolean; opportunity: 'created' | 'failed' | 'skipped' };

async function pushToGHL(body: NormalizedFormSubmission): Promise<GHLPushResult> {
  if (!process.env.GHL_API_KEY || !process.env.GHL_LOCATION_ID) {
    return { contact: false, opportunity: 'skipped' };
  }

  try {
    const { createGHLClient } = await import('@/lib/ghl/client');
    const client = createGHLClient();
    const fields = body.fields;
    const str = (value: unknown): string | undefined =>
      typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;

    // A newsletter signup is an explicit, express opt-in (email typed into a
    // clearly-labelled newsletter box). Stamp consent + belonging here, at the
    // source, so it never depends on a GHL workflow trigger firing on an
    // API-created contact (those are unreliable). newsletter_consent is the ONLY
    // legal send signal and is set HERE and nowhere else by inference. Field id =
    // the GHL custom field contact.newsletter_consent (SINGLE_OPTIONS Yes/No).
    const isNewsletter = body.formType === 'newsletter';
    const NEWSLETTER_CONSENT_FIELD_ID = 'aVnqmajnysMtGYhLD0oA';

    const tags = Array.from(
      new Set([
        ...body.additionalTags,
        ...(body.projectCode ? [body.projectCode] : []),
        ...(body.formType ? [body.formType] : []),
        ...(isNewsletter ? ['tier:connected', 'comms:act-newsletter'] : []),
      ])
    );

    const upserted = await client.contacts.upsert({
      email: str(fields.email),
      phone: str(fields.phone),
      firstName: str(fields.firstName),
      lastName: str(fields.lastName),
      name: str(fields.name) || str(fields.fullName),
      source: 'act-regenerative-studio',
      tags,
      ...(isNewsletter
        ? { customFields: [{ id: NEWSLETTER_CONSENT_FIELD_ID, field_value: 'Yes' }] }
        : {}),
    });

    // Open an opportunity in the mapped pipeline for team tracking. Off by
    // default; set GHL_ENABLE_PIPELINES=true once the routing is reviewed.
    let opportunity: GHLPushResult['opportunity'] = 'skipped';
    if (process.env.GHL_ENABLE_PIPELINES === 'true') {
      const result = upserted as { id?: string; contact?: { id?: string } };
      const contactId = result?.id || result?.contact?.id;
      const route = resolvePipelineRoute(body);
      if (contactId && route) {
        const displayName =
          str(fields.name) ||
          [str(fields.firstName), str(fields.lastName)].filter(Boolean).join(' ') ||
          str(fields.email) ||
          'Website inquiry';
        try {
          await client.opportunities.create({
            contactId,
            pipelineId: route.pipelineId,
            pipelineStageId: route.stageId,
            name: `${displayName} - ${body.formType || 'inquiry'}`,
            status: 'open',
            source: 'act-regenerative-studio',
          });
          opportunity = 'created';
        } catch (oppError) {
          // Non-fatal: the contact (lead) is captured regardless.
          console.error('GHL opportunity create failed (non-fatal):', oppError);
          opportunity = 'failed';
        }
      }
    }

    return { contact: true, opportunity };
  } catch (error) {
    console.error('GHL direct push failed:', error);
    return { contact: false, opportunity: 'skipped' };
  }
}

/**
 * Command-Center-unavailable path. Pushes the contact straight to GHL (the same
 * location the Command Center uses), then always records the full submission in
 * Supabase so the message body is never lost. The Supabase row is marked
 * synced=true when GHL already has the contact, so a later drain won't
 * double-create it. Succeeds if either GHL or Supabase accepted the submission.
 */
async function handleFallback(body: NormalizedFormSubmission): Promise<NextResponse> {
  const ghl = await pushToGHL(body);
  const ghlOk = ghl.contact;
  console.warn(
    `Command Center unavailable. GHL contact: ${ghlOk ? 'ok' : 'skipped/failed'}, opportunity: ${ghl.opportunity}. Recording submission.`
  );

  let stored = false;
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase.from('pending_form_submissions').insert({
      project_code: body.projectCode,
      form_type: body.formType,
      fields: body.fields,
      additional_tags: body.additionalTags,
      source: 'act-regenerative-studio',
      created_at: new Date().toISOString(),
      synced: ghlOk,
    });

    if (error) {
      console.error('Failed to store submission:', error);
    } else {
      stored = true;
    }
  } catch (error) {
    console.error('Supabase store error:', error);
  }

  if (ghlOk || stored) {
    return NextResponse.json({
      success: true,
      message: ghlOk
        ? 'Submitted to GHL'
        : 'Submission queued for processing',
      ghl: ghlOk,
      opportunity: ghl.opportunity,
      stored,
      fallback: true,
    });
  }

  return NextResponse.json(
    { success: false, error: 'Service temporarily unavailable' },
    { status: 503 }
  );
}
