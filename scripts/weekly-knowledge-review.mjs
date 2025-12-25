/**
 * Weekly Knowledge Review Script
 *
 * This script runs automated weekly reviews of:
 * 1. AI content quality tracking
 * 2. Knowledge version status
 * 3. PMPP review schedule
 * 4. Elder review queue
 * 5. Community feedback summary
 *
 * Schedule with cron:
 * 0 9 * * 1 cd /path/to/act && node scripts/weekly-knowledge-review.mjs
 *
 * Run manually:
 * node scripts/weekly-knowledge-review.mjs
 */

import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { writeFile } from 'fs/promises';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('📊 ACT Weekly Knowledge Review');
console.log('='.repeat(80));
console.log(`Date: ${new Date().toISOString().split('T')[0]}\n`);

// ============================================================================
// 1. AI Content Quality Tracking
// ============================================================================

async function reviewContentQuality() {
  console.log('\n📈 AI CONTENT QUALITY REVIEW');
  console.log('─'.repeat(80));

  // Get all verifications from the past week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { data: verifications, error } = await supabase
    .from('ai_content_verifications')
    .select('*')
    .gte('verified_at', oneWeekAgo.toISOString());

  if (error) {
    console.error('Error fetching verifications:', error);
    return null;
  }

  if (!verifications || verifications.length === 0) {
    console.log('⚠️  No verifications found in the past week.\n');
    return { total: 0 };
  }

  // Calculate average scores
  const avgScores = {
    brandVoice: 0,
    culturalSafety: 0,
    factualAccuracy: 0,
    communityVoice: 0,
    overallQuality: 0,
  };

  let count = 0;
  verifications.forEach(v => {
    if (v.brand_voice_score) {
      avgScores.brandVoice += v.brand_voice_score;
      avgScores.culturalSafety += v.cultural_safety_score || 0;
      avgScores.factualAccuracy += v.factual_accuracy_score || 0;
      avgScores.communityVoice += v.community_voice_score || 0;
      avgScores.overallQuality += v.overall_quality_score || 0;
      count++;
    }
  });

  if (count > 0) {
    avgScores.brandVoice = (avgScores.brandVoice / count).toFixed(2);
    avgScores.culturalSafety = (avgScores.culturalSafety / count).toFixed(2);
    avgScores.factualAccuracy = (avgScores.factualAccuracy / count).toFixed(2);
    avgScores.communityVoice = (avgScores.communityVoice / count).toFixed(2);
    avgScores.overallQuality = (avgScores.overallQuality / count).toFixed(2);
  }

  // Status breakdown
  const statusCounts = {
    approved: 0,
    revised: 0,
    rejected: 0,
  };

  verifications.forEach(v => {
    statusCounts[v.status]++;
  });

  console.log(`Total Verifications: ${verifications.length}`);
  console.log(`\nStatus Breakdown:`);
  console.log(`  ✅ Approved: ${statusCounts.approved} (${((statusCounts.approved / verifications.length) * 100).toFixed(1)}%)`);
  console.log(`  ✏️  Revised: ${statusCounts.revised} (${((statusCounts.revised / verifications.length) * 100).toFixed(1)}%)`);
  console.log(`  ❌ Rejected: ${statusCounts.rejected} (${((statusCounts.rejected / verifications.length) * 100).toFixed(1)}%)`);

  console.log(`\nAverage Quality Scores (out of 5):`);
  console.log(`  Brand Voice:        ${avgScores.brandVoice}`);
  console.log(`  Cultural Safety:    ${avgScores.culturalSafety}`);
  console.log(`  Factual Accuracy:   ${avgScores.factualAccuracy}`);
  console.log(`  Community Voice:    ${avgScores.communityVoice}`);
  console.log(`  Overall Quality:    ${avgScores.overallQuality}`);

  // Identify areas for improvement
  console.log(`\n🎯 Recommendations:`);
  const threshold = 4.0;

  if (parseFloat(avgScores.brandVoice) < threshold) {
    console.log(`  ⚠️  Brand voice needs improvement (${avgScores.brandVoice}/5)`);
    console.log(`     → Consider adding more brand voice examples to training data`);
  }
  if (parseFloat(avgScores.culturalSafety) < threshold) {
    console.log(`  ⚠️  Cultural safety needs improvement (${avgScores.culturalSafety}/5)`);
    console.log(`     → Review cultural protocol training, consider more Elder review`);
  }
  if (parseFloat(avgScores.factualAccuracy) < threshold) {
    console.log(`  ⚠️  Factual accuracy needs improvement (${avgScores.factualAccuracy}/5)`);
    console.log(`     → Update knowledge base with recent project information`);
  }

  if (parseFloat(avgScores.overallQuality) >= threshold) {
    console.log(`  ✅ Overall quality is good! (${avgScores.overallQuality}/5)`);
  }

  return {
    total: verifications.length,
    statusCounts,
    avgScores,
  };
}

// ============================================================================
// 2. Knowledge Version Status
// ============================================================================

async function reviewKnowledgeVersions() {
  console.log('\n\n📚 KNOWLEDGE VERSION REVIEW');
  console.log('─'.repeat(80));

  const { data: versions, error } = await supabase
    .from('knowledge_versions')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching knowledge versions:', error);
    return null;
  }

  console.log(`\nRecent Knowledge Updates (Last 10):\n`);

  if (!versions || versions.length === 0) {
    console.log('⚠️  No knowledge versions found.\n');
    return { total: 0 };
  }

  versions.forEach((v, i) => {
    const date = new Date(v.updated_at).toLocaleDateString();
    console.log(`${i + 1}. ${v.knowledge_id} (v${v.version}) - ${v.status}`);
    console.log(`   Updated: ${date}`);
    console.log(`   Reason: ${v.reason_for_change || 'N/A'}`);
    console.log('');
  });

  // Count by status
  const { data: statusCounts, error: statusError } = await supabase
    .from('knowledge_versions')
    .select('status');

  if (!statusError && statusCounts) {
    const counts = {
      draft: 0,
      active: 0,
      archived: 0,
      deprecated: 0,
    };

    statusCounts.forEach(v => {
      counts[v.status]++;
    });

    console.log(`Status Summary:`);
    console.log(`  Draft: ${counts.draft}`);
    console.log(`  Active: ${counts.active}`);
    console.log(`  Archived: ${counts.archived}`);
    console.log(`  Deprecated: ${counts.deprecated}`);
  }

  return { total: versions.length };
}

// ============================================================================
// 3. PMPP Review Schedule
// ============================================================================

async function reviewPMPPSchedule() {
  console.log('\n\n🔄 PMPP REVIEW SCHEDULE');
  console.log('─'.repeat(80));

  const { data: schedule, error } = await supabase
    .from('knowledge_review_schedule')
    .select('*');

  if (error) {
    console.error('Error fetching review schedule:', error);
    return null;
  }

  if (!schedule || schedule.length === 0) {
    console.log('⚠️  No PMPP items found for review.\n');
    return { overdue: 0, dueSoon: 0, current: 0 };
  }

  const overdue = schedule.filter(s => s.review_status === 'overdue');
  const dueSoon = schedule.filter(s => s.review_status === 'due_soon');
  const current = schedule.filter(s => s.review_status === 'current');

  console.log(`\n📋 Review Status:`);
  console.log(`  ⚠️  Overdue: ${overdue.length}`);
  console.log(`  ⏰ Due Soon (next 7 days): ${dueSoon.length}`);
  console.log(`  ✅ Current: ${current.length}`);

  if (overdue.length > 0) {
    console.log(`\n🚨 OVERDUE REVIEWS:\n`);
    overdue.forEach((item, i) => {
      console.log(`${i + 1}. [${item.type.toUpperCase()}] ${item.title}`);
      console.log(`   Last reviewed: ${new Date(item.last_reviewed_at).toLocaleDateString()}`);
      console.log(`   Due: ${new Date(item.next_review_due).toLocaleDateString()}`);
      console.log('');
    });
  }

  if (dueSoon.length > 0) {
    console.log(`\n⏰ DUE SOON:\n`);
    dueSoon.forEach((item, i) => {
      console.log(`${i + 1}. [${item.type.toUpperCase()}] ${item.title}`);
      console.log(`   Due: ${new Date(item.next_review_due).toLocaleDateString()}`);
      console.log('');
    });
  }

  return {
    overdue: overdue.length,
    dueSoon: dueSoon.length,
    current: current.length,
  };
}

// ============================================================================
// 4. Elder Review Queue
// ============================================================================

async function reviewElderQueue() {
  console.log('\n\n👥 ELDER REVIEW QUEUE');
  console.log('─'.repeat(80));

  const { data: queue, error } = await supabase
    .from('pending_elder_reviews')
    .select('*');

  if (error) {
    console.error('Error fetching elder review queue:', error);
    return null;
  }

  if (!queue || queue.length === 0) {
    console.log('✅ No pending elder reviews.\n');
    return { pending: 0, inReview: 0 };
  }

  console.log(`\n📋 Pending Reviews: ${queue.length}\n`);

  queue.forEach((item, i) => {
    console.log(`${i + 1}. ${item.content_type} (${item.project_slug || 'N/A'})`);
    console.log(`   Sensitivity: ${item.sensitivity_level}`);
    console.log(`   Priority: ${item.priority}/5`);
    console.log(`   Submitted: ${new Date(item.submitted_at).toLocaleDateString()}`);
    if (item.assigned_to) {
      console.log(`   Assigned to: ${item.submitter_email || 'Unknown'}`);
    } else {
      console.log(`   ⚠️  Not yet assigned`);
    }
    console.log('');
  });

  return {
    pending: queue.length,
    inReview: queue.filter(q => q.assigned_to).length,
  };
}

// ============================================================================
// 5. Community Feedback Summary
// ============================================================================

async function reviewCommunityFeedback() {
  console.log('\n\n💬 COMMUNITY FEEDBACK SUMMARY');
  console.log('─'.repeat(80));

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { data: feedback, error } = await supabase
    .from('community_feedback')
    .select('*')
    .gte('created_at', oneWeekAgo.toISOString());

  if (error) {
    console.error('Error fetching community feedback:', error);
    return null;
  }

  if (!feedback || feedback.length === 0) {
    console.log('⚠️  No community feedback received this week.\n');
    return { total: 0 };
  }

  console.log(`\nTotal Feedback: ${feedback.length}\n`);

  const typeCounts = {
    correction: 0,
    suggestion: 0,
    appreciation: 0,
    concern: 0,
  };

  const severityCounts = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  };

  feedback.forEach(f => {
    typeCounts[f.feedback_type]++;
    if (f.severity) {
      severityCounts[f.severity]++;
    }
  });

  console.log(`By Type:`);
  console.log(`  ✏️  Corrections: ${typeCounts.correction}`);
  console.log(`  💡 Suggestions: ${typeCounts.suggestion}`);
  console.log(`  ❤️  Appreciation: ${typeCounts.appreciation}`);
  console.log(`  ⚠️  Concerns: ${typeCounts.concern}`);

  console.log(`\nBy Severity:`);
  console.log(`  🟢 Low: ${severityCounts.low}`);
  console.log(`  🟡 Medium: ${severityCounts.medium}`);
  console.log(`  🟠 High: ${severityCounts.high}`);
  console.log(`  🔴 Critical: ${severityCounts.critical}`);

  const unaddressed = feedback.filter(f => f.status === 'new');
  if (unaddressed.length > 0) {
    console.log(`\n🚨 ${unaddressed.length} feedback items need review`);
  }

  return {
    total: feedback.length,
    typeCounts,
    severityCounts,
    unaddressed: unaddressed.length,
  };
}

// ============================================================================
// 6. Generate Summary Report
// ============================================================================

async function generateReport() {
  const report = {
    date: new Date().toISOString().split('T')[0],
    contentQuality: await reviewContentQuality(),
    knowledgeVersions: await reviewKnowledgeVersions(),
    pmppSchedule: await reviewPMPPSchedule(),
    elderQueue: await reviewElderQueue(),
    communityFeedback: await reviewCommunityFeedback(),
  };

  // Save report
  const reportDir = './weekly-knowledge-reviews';
  const reportPath = path.join(reportDir, `review-${report.date}.json`);

  try {
    await writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n\n💾 Report saved to: ${reportPath}`);
  } catch (error) {
    console.error('Error saving report:', error);
  }

  // Summary recommendations
  console.log('\n\n' + '='.repeat(80));
  console.log('📝 WEEKLY RECOMMENDATIONS');
  console.log('='.repeat(80) + '\n');

  const recommendations = [];

  if (report.contentQuality?.avgScores?.overallQuality < 4.0) {
    recommendations.push('🔧 AI quality below threshold - consider fine-tuning with recent verifications');
  }

  if (report.pmppSchedule?.overdue > 0) {
    recommendations.push(`📅 ${report.pmppSchedule.overdue} PMPP items overdue for review`);
  }

  if (report.elderQueue?.pending > 5) {
    recommendations.push(`👥 ${report.elderQueue.pending} items in elder review queue - consider assigning more reviewers`);
  }

  if (report.communityFeedback?.severityCounts?.critical > 0) {
    recommendations.push(`🚨 ${report.communityFeedback.severityCounts.critical} critical feedback items require immediate attention`);
  }

  if (recommendations.length === 0) {
    console.log('✅ Everything looks good! No urgent actions needed.\n');
  } else {
    recommendations.forEach((rec, i) => {
      console.log(`${i + 1}. ${rec}`);
    });
    console.log('');
  }

  console.log('='.repeat(80) + '\n');

  return report;
}

// ============================================================================
// Run Review
// ============================================================================

generateReport()
  .then(() => {
    console.log('✅ Weekly knowledge review complete!\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error during weekly review:', error);
    process.exit(1);
  });
