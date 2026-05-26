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

/**
 * Fallback handler when act-ecosystem API is unavailable
 * Stores submission locally for later sync
 */
async function handleFallback(body: NormalizedFormSubmission): Promise<NextResponse> {
  console.warn('Using fallback. Storing submission locally.');

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Store in a pending submissions table
    const { error } = await supabase.from('pending_form_submissions').insert({
      project_code: body.projectCode,
      form_type: body.formType,
      fields: body.fields,
      additional_tags: body.additionalTags,
      source: 'act-regenerative-studio',
      created_at: new Date().toISOString(),
      synced: false,
    });

    if (error) {
      console.error('Failed to store fallback submission:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to store submission' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Submission queued for processing',
      fallback: true,
    });

  } catch (error) {
    console.error('Fallback storage error:', error);
    return NextResponse.json(
      { success: false, error: 'Service temporarily unavailable' },
      { status: 503 }
    );
  }
}
