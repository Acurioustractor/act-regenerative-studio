import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // TODO: Query Supabase for GHL webhook submissions
    // TODO: Calculate stats from stored webhook data

    const response = {
      submissions: [],
      stats: {
        total24h: 0,
        total7d: 0,
        byType: {},
      },
    };

    /* Example with Supabase integration:
    const { data: submissions } = await supabase
      .from('ghl_submissions')
      .select('*')
      .order('submitted_at', { ascending: false })
      .limit(50);

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    response.stats.total24h = submissions.filter(
      s => new Date(s.submitted_at) > oneDayAgo
    ).length;

    response.stats.total7d = submissions.filter(
      s => new Date(s.submitted_at) > sevenDaysAgo
    ).length;

    response.stats.byType = submissions.reduce((acc, s) => {
      acc[s.form_type] = (acc[s.form_type] || 0) + 1;
      return acc;
    }, {});

    response.submissions = submissions.map(s => ({
      id: s.id,
      formName: s.form_name,
      formType: s.form_type,
      submittedAt: s.submitted_at,
      contactName: s.contact_name,
      contactEmail: s.contact_email,
      synced: s.synced_to_notion,
    }));
    */

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to fetch form activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch form activity" },
      { status: 500 }
    );
  }
}
