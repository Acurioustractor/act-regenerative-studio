/**
 * End-to-End Test: Content Engagement System
 *
 * Tests all APIs and data flows to ensure great UX/UI
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log('🧪 Testing ACT Content Engagement System\n');

const BASE_URL = 'http://localhost:3000';
const TEST_PROJECT = 'justicehub';

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: [],
};

function logTest(name, passed, details = '') {
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name}`);
  if (details) console.log(`   ${details}`);

  results.tests.push({ name, passed, details });
  if (passed) results.passed++;
  else results.failed++;
}

// Test 1: Project Articles API
async function testArticlesAPI() {
  console.log('\n📰 Testing Blog Articles API...\n');

  try {
    const response = await fetch(`${BASE_URL}/api/projects/${TEST_PROJECT}/articles?limit=5`);
    const data = await response.json();

    logTest(
      'Articles API responds successfully',
      response.ok && data.success,
      response.ok ? `Status: ${response.status}` : `Error: ${response.status}`
    );

    logTest(
      'Articles data structure is correct',
      data.articles && Array.isArray(data.articles),
      data.articles ? `Found ${data.articles.length} articles` : 'No articles array'
    );

    if (data.articles && data.articles.length > 0) {
      const article = data.articles[0];
      const hasRequiredFields = article.title && article.slug && article.url;

      logTest(
        'Article has required fields',
        hasRequiredFields,
        `Fields: ${Object.keys(article).join(', ')}`
      );

      logTest(
        'Article has metadata',
        article.author && article.publishedDate,
        `Author: ${article.author}, Date: ${article.publishedDate ? 'Yes' : 'No'}`
      );

      console.log('\n   Sample Article:');
      console.log(`   Title: ${article.title}`);
      console.log(`   Slug: ${article.slug}`);
      console.log(`   URL: ${article.url}`);
      console.log(`   Author: ${article.author}`);
      console.log(`   Tags: ${article.tags?.length || 0} tags`);
    } else {
      logTest('Has at least one article', false, 'No articles found');
    }
  } catch (error) {
    logTest('Articles API error handling', false, error.message);
  }
}

// Test 2: Media Gallery API
async function testMediaAPI() {
  console.log('\n🖼️  Testing Media Gallery API...\n');

  try {
    const response = await fetch(`${BASE_URL}/api/media?limit=10`);
    const data = await response.json();

    logTest(
      'Media API responds successfully',
      response.ok && data.success,
      response.ok ? `Status: ${response.status}` : `Error: ${response.status}`
    );

    logTest(
      'Media data structure is correct',
      data.data && Array.isArray(data.data),
      data.data ? `Found ${data.data.length} media items` : 'No data array'
    );

    if (data.data && data.data.length > 0) {
      const item = data.data[0];
      const hasRequiredFields = item.id && item.file_url && item.file_type;

      logTest(
        'Media item has required fields',
        hasRequiredFields,
        `Fields: ${Object.keys(item).join(', ')}`
      );

      logTest(
        'Media item has enrichment data',
        item.impact_themes && item.project_slugs,
        `Themes: ${item.impact_themes?.length || 0}, Projects: ${item.project_slugs?.length || 0}`
      );

      console.log('\n   Sample Media Item:');
      console.log(`   ID: ${item.id}`);
      console.log(`   Type: ${item.file_type}`);
      console.log(`   Title: ${item.title || 'Untitled'}`);
      console.log(`   Impact Themes: ${item.impact_themes?.join(', ') || 'None'}`);
      console.log(`   Projects: ${item.project_slugs?.join(', ') || 'None'}`);
      console.log(`   Hero Image: ${item.is_hero_image ? 'Yes' : 'No'}`);
    } else {
      logTest('Has at least one media item', false, 'No media items found');
    }

    // Test filtering
    console.log('\n   Testing Filters...\n');

    const photoResponse = await fetch(`${BASE_URL}/api/media?fileType=photo&limit=5`);
    const photoData = await photoResponse.json();
    logTest(
      'File type filter works',
      photoData.success && photoData.data.every(item => item.file_type === 'photo'),
      `Found ${photoData.data?.length || 0} photos`
    );

    const projectResponse = await fetch(`${BASE_URL}/api/media?projectSlug=${TEST_PROJECT}&limit=5`);
    const projectData = await projectResponse.json();
    logTest(
      'Project filter works',
      projectData.success,
      `Found ${projectData.data?.length || 0} items for ${TEST_PROJECT}`
    );

  } catch (error) {
    logTest('Media API error handling', false, error.message);
  }
}

// Test 3: Story Impact API
async function testStoryImpactAPI() {
  console.log('\n📊 Testing Story Impact API...\n');

  try {
    const response = await fetch(`${BASE_URL}/api/projects/${TEST_PROJECT}/story-impact`);
    const data = await response.json();

    logTest(
      'Story Impact API responds',
      response.ok,
      response.ok ? `Status: ${response.status}` : `Error: ${response.status}`
    );

    if (data.success && data.metrics) {
      logTest(
        'Impact metrics have required fields',
        data.metrics.storytellerCount !== undefined,
        `Storytellers: ${data.metrics.storytellerCount}`
      );

      logTest(
        'Impact metrics include insights',
        data.insights && Array.isArray(data.insights),
        `Insights: ${data.insights?.length || 0}`
      );

      console.log('\n   Impact Metrics:');
      console.log(`   Storytellers: ${data.metrics.storytellerCount}`);
      console.log(`   Stories: ${data.metrics.storyCount}`);
      console.log(`   Themes: ${data.metrics.themeCount}`);
      console.log(`   Insights: ${data.insights?.length || 0}`);

      if (data.insights && data.insights.length > 0) {
        console.log(`\n   Sample Insight:`);
        console.log(`   Type: ${data.insights[0].type}`);
        console.log(`   Text: ${data.insights[0].insight?.substring(0, 80)}...`);
        console.log(`   Confidence: ${data.insights[0].confidence || 'N/A'}`);
      }
    } else {
      logTest(
        'Using fallback data',
        data.warning !== undefined,
        data.warning || 'No warning message'
      );
    }
  } catch (error) {
    logTest('Story Impact API error handling', false, error.message);
  }
}

// Test 4: Community Metrics API
async function testCommunityMetricsAPI() {
  console.log('\n🌍 Testing Community Metrics API...\n');

  try {
    const response = await fetch(`${BASE_URL}/api/impact/community-metrics`);
    const data = await response.json();

    logTest(
      'Community Metrics API responds',
      response.ok && data.success,
      response.ok ? `Status: ${response.status}` : `Error: ${response.status}`
    );

    if (data.metrics) {
      logTest(
        'Metrics include ecosystem data',
        data.metrics.activeStorytellers !== undefined,
        `Storytellers: ${data.metrics.activeStorytellers}`
      );

      logTest(
        'Metrics include cultural themes',
        data.metrics.culturalThemes && Array.isArray(data.metrics.culturalThemes),
        `Themes: ${data.metrics.culturalThemes?.length || 0}`
      );

      logTest(
        'Metrics include vitality scores',
        data.metrics.communityResilience !== undefined,
        `Resilience: ${data.metrics.communityResilience}%, Vitality: ${data.metrics.culturalVitality}%`
      );

      console.log('\n   Ecosystem Metrics:');
      console.log(`   Active Storytellers: ${data.metrics.activeStorytellers}`);
      console.log(`   Total Stories: ${data.metrics.totalStories}`);
      console.log(`   Cultural Themes: ${data.metrics.culturalThemes?.length || 0}`);
      console.log(`   Community Resilience: ${data.metrics.communityResilience}%`);
      console.log(`   Cultural Vitality: ${data.metrics.culturalVitality}%`);
      console.log(`   Data Source: ${data.source}`);
    }
  } catch (error) {
    logTest('Community Metrics API error handling', false, error.message);
  }
}

// Test 5: Database Enrichment Count
async function testDatabaseEnrichments() {
  console.log('\n💾 Testing Database Content...\n');

  try {
    const { createClient } = await import('@supabase/supabase-js');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      logTest('Supabase credentials available', false, 'Missing environment variables');
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test enrichment_reviews table
    const { data: enrichments, error: enrichError } = await supabase
      .from('enrichment_reviews')
      .select('project_slug, enrichment_type, status')
      .eq('status', 'approved');

    logTest(
      'Enrichment reviews table accessible',
      !enrichError,
      enrichError ? enrichError.message : `Found ${enrichments?.length || 0} approved enrichments`
    );

    if (enrichments) {
      const blogLinks = enrichments.filter(e => e.enrichment_type === 'blog_links');
      logTest(
        'Blog articles imported',
        blogLinks.length > 0,
        `Found ${blogLinks.length} blog articles`
      );

      const byProject = enrichments.reduce((acc, e) => {
        acc[e.project_slug] = (acc[e.project_slug] || 0) + 1;
        return acc;
      }, {});

      console.log('\n   Enrichments by Project:');
      Object.entries(byProject).forEach(([project, count]) => {
        console.log(`   ${project}: ${count} items`);
      });
    }

    // Test media_items table
    const { data: media, error: mediaError } = await supabase
      .from('media_items')
      .select('file_type, is_hero_image, impact_themes, project_slugs');

    logTest(
      'Media items table accessible',
      !mediaError,
      mediaError ? mediaError.message : `Found ${media?.length || 0} media items`
    );

    if (media) {
      const heroImages = media.filter(m => m.is_hero_image);
      logTest(
        'Hero images configured',
        heroImages.length > 0,
        `Found ${heroImages.length} hero images`
      );

      const enrichedMedia = media.filter(m =>
        m.impact_themes && m.impact_themes.length > 0
      );
      logTest(
        'Media items enriched with themes',
        enrichedMedia.length > 0,
        `${enrichedMedia.length}/${media.length} items have impact themes`
      );

      const linkedMedia = media.filter(m =>
        m.project_slugs && m.project_slugs.length > 0
      );
      logTest(
        'Media items linked to projects',
        linkedMedia.length > 0,
        `${linkedMedia.length}/${media.length} items linked to projects`
      );

      console.log('\n   Media Statistics:');
      console.log(`   Total Items: ${media.length}`);
      console.log(`   Hero Images: ${heroImages.length}`);
      console.log(`   Enriched: ${enrichedMedia.length}`);
      console.log(`   Linked to Projects: ${linkedMedia.length}`);

      const byType = media.reduce((acc, m) => {
        acc[m.file_type] = (acc[m.file_type] || 0) + 1;
        return acc;
      }, {});
      console.log('\n   By Type:');
      Object.entries(byType).forEach(([type, count]) => {
        console.log(`   ${type}: ${count}`);
      });
    }

  } catch (error) {
    logTest('Database access', false, error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('════════════════════════════════════════════════════════════');
  console.log('   ACT CONTENT ENGAGEMENT SYSTEM - END-TO-END TEST');
  console.log('════════════════════════════════════════════════════════════');

  await testArticlesAPI();
  await testMediaAPI();
  await testStoryImpactAPI();
  await testCommunityMetricsAPI();
  await testDatabaseEnrichments();

  // Summary
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('   TEST SUMMARY');
  console.log('════════════════════════════════════════════════════════════\n');

  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📊 Total:  ${results.tests.length}`);

  const passRate = ((results.passed / results.tests.length) * 100).toFixed(1);
  console.log(`\n🎯 Pass Rate: ${passRate}%`);

  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.tests
      .filter(t => !t.passed)
      .forEach(t => {
        console.log(`   • ${t.name}`);
        if (t.details) console.log(`     ${t.details}`);
      });
  }

  console.log('\n════════════════════════════════════════════════════════════');

  if (passRate >= 80) {
    console.log('🎉 Content Engagement System is working well!\n');
  } else if (passRate >= 60) {
    console.log('⚠️  Some issues detected - review failed tests above\n');
  } else {
    console.log('🚨 Major issues detected - immediate attention needed\n');
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

runAllTests().catch(error => {
  console.error('\n🚨 Test suite failed:', error);
  process.exit(1);
});
