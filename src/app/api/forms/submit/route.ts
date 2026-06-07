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

// projectCode → CRM identity. The namespaced `project:` tag and the newsletter
// comms-list slug BOTH derive from a form's projectCode — never hardcoded — so a
// newsletter embedded on any project's page seats to THAT project's list, not
// ACT-IN's. This is the "route by projectCode, never by formType" contract.
// Canonical taxonomy + tag scheme: act-global-infrastructure
// wiki/decisions/act-site-form-alignment.md (the VERIFIED registry, §4a).
// Slugs for ACT-BV / ACT-AS are provisional (not yet pinned in registry §4a).
const PROJECT_REGISTRY: Record<string, { tag: string; commsSlug: string }> = {
  'ACT-IN': { tag: 'project:act-in', commsSlug: 'act' },                     // ACT ecosystem (act.place default)
  'ACT-HV': { tag: 'project:act-hv', commsSlug: 'harvest' },                 // The Harvest
  'ACT-BV': { tag: 'project:act-bv', commsSlug: 'farm' },                    // Black Cockatoo Valley / Farm (provisional)
  'ACT-AS': { tag: 'project:act-as', commsSlug: 'art' },                     // Art / residency (provisional)
  'ACT-EL': { tag: 'project:empathy-ledger', commsSlug: 'empathy-ledger' },  // Empathy Ledger (OCAP-gated)
  'ACT-JH': { tag: 'project:justicehub', commsSlug: 'justicehub' },          // JusticeHub
  'ACT-GD': { tag: 'project:goods', commsSlug: 'goods' },                    // Goods
};
const DEFAULT_PROJECT = PROJECT_REGISTRY['ACT-IN'];

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
    const CONSENT_SOURCE_FIELD_ID = 'HdnMUyXkZRPZG7l7cygG';

    // Per-form namespaced tags so each submission seats the contact correctly for the
    // belonging journey: how they arrived (source:) + what they did (role:/action:).
    // A newsletter signup seeds the ENTRY rung tier:curious (see the tags block
    // below); the DATE fields and rung ADVANCEMENT (curious→connected→member) are
    // applied by the GHL intake workflow via native actions (reliable tag-added +
    // set-if-empty), per decision #7 in
    // act-global-infrastructure/thoughts/shared/plans/2026-06-02-harvest-ghl-tier1-build.md.
    //
    // Slug is source:website (channel) per the canonical taxonomy
    // (act-global-infrastructure wiki/concepts/ghl-audience-comms-automation.md
    // §"Forms → tag contract"). A newsletter signup is an express opt-in BY a
    // supporter, so it also seats role:supporter — the identity tag the
    // "Org supporters" smart-list (role:supporter AND newsletter_consent=Yes AND
    // NOT lane:community) queries on. Without it, signups are invisible to that
    // segment and to role-gated automations (e.g. the supporter onboarding drip).
    const FORM_RULES: Record<string, string[]> = {
      newsletter: ['source:website', 'role:supporter'],
      contact: ['source:website'],
      donation: ['source:website', 'role:supporter', 'action:contributed'],
      volunteer: ['source:website', 'role:volunteer'],
      event: ['source:event-signup', 'interest:events', 'action:attended'],
    };
    const formTags = FORM_RULES[body.formType ?? ''] ?? ['source:website'];

    // Derive the project's CRM identity from projectCode (default ACT-IN). The
    // namespaced project: tag and the newsletter comms list both come from here —
    // a newsletter on the Harvest page (ACT-HV) gets comms:harvest-newsletter,
    // NOT comms:act-newsletter. This closes the "newsletter == Harvest" bug class
    // by routing on projectCode rather than assuming the ACT-IN list.
    const project = PROJECT_REGISTRY[body.projectCode ?? ''] ?? DEFAULT_PROJECT;

    // Namespaced tags ONLY. The raw projectCode ("ACT-IN") and raw formType
    // ("newsletter") are intentionally NOT seated as flat tags — project.tag
    // (project:act-in) and the per-form rules carry the same meaning without
    // polluting the tag space the smart-lists query. body.additionalTags is the
    // form's own namespaced provenance (e.g. source:website-footer).
    const tags = Array.from(
      new Set([
        ...body.additionalTags,
        project.tag,
        ...formTags,
        ...(isNewsletter ? ['tier:curious', `comms:${project.commsSlug}-newsletter`] : []),
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
        ? {
            customFields: [
              { id: NEWSLETTER_CONSENT_FIELD_ID, field_value: 'Yes' },
              { id: CONSENT_SOURCE_FIELD_ID, field_value: 'act-regenerative-studio' },
            ],
          }
        : {}),
    });

    // Notify the GHL "ACT — Intake" workflow (Inbound Webhook trigger) so it seats the
    // contact on the Membership Journey via NATIVE actions (reliable trigger + tag-added),
    // per decision #7. Fire-and-forget — a webhook hiccup must never fail the signup.
    const INTAKE_WEBHOOK_URL = process.env.GHL_INTAKE_WEBHOOK_URL
      || 'https://services.leadconnectorhq.com/hooks/agzsSZWgovjwgpcoASWG/webhook-trigger/8432ee10-f5d5-4f72-a6fb-5f0829b937c6';
    try {
      await fetch(INTAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: str(fields.email),
          formType: body.formType || 'general',
          projectCode: body.projectCode || '',
          firstName: str(fields.firstName),
          lastName: str(fields.lastName),
          name: str(fields.name) || str(fields.fullName),
        }),
      });
    } catch (webhookError) {
      console.error('GHL intake webhook notify failed (non-fatal):', webhookError);
    }

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
