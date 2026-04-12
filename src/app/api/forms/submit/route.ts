import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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
  try {
    const body = await request.json();
    const { projectCode, formType, fields, additionalTags } = body;

    // Validate required fields
    if (!fields?.email && !fields?.phone) {
      return NextResponse.json(
        { success: false, error: 'Email or phone required' },
        { status: 400 }
      );
    }

    // Forward to act-ecosystem Command Center API
    const apiUrl = process.env.ACT_ECOSYSTEM_API_URL || 'http://localhost:3456';

    console.log(`📝 Forwarding form submission to ${apiUrl}/api/forms/submit`);
    console.log(`   Project: ${projectCode || 'none'}, Type: ${formType || 'general'}`);

    const response = await fetch(`${apiUrl}/api/forms/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectCode,
        formType,
        fields,
        additionalTags: [
          ...(additionalTags || []),
          'act-regenerative-studio',  // Track source site
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API error: ${response.status}`, errorText);

      // If the ecosystem API is down, fall back to local storage
      return await handleFallback(body);
    }

    const result = await response.json();
    console.log(`✅ Form submitted successfully:`, result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Form submission error:', error);

    // Try fallback for network errors
    try {
      const body = await request.clone().json();
      return await handleFallback(body);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Failed to process form submission' },
        { status: 500 }
      );
    }
  }
}

/**
 * Fallback handler when act-ecosystem API is unavailable
 * Stores submission locally for later sync
 */
async function handleFallback(body: any): Promise<NextResponse> {
  console.warn('⚠️ Using fallback - storing submission locally');

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
