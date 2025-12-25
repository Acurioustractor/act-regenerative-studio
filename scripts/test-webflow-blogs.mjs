/**
 * Test Webflow Blog Integration
 *
 * Fetches blog posts from Webflow CMS and tests the blog-linking algorithm.
 * Run with: node scripts/test-webflow-blogs.mjs
 */

import { fetchWebflowBlogPosts, normalizeWebflowPost } from '../src/lib/webflow/client.js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testWebflowBlogs() {
  console.log('🧪 Testing Webflow Blog Integration\n');

  const apiToken = process.env.WEBFLOW_API_TOKEN_JUSTICEHUB;
  const collectionId = process.env.WEBFLOW_JUSTICEHUB_BLOG_COLLECTION_ID;

  if (!apiToken || !collectionId) {
    console.error('❌ Missing Webflow credentials');
    console.log('   Required: WEBFLOW_API_TOKEN_JUSTICEHUB, WEBFLOW_JUSTICEHUB_BLOG_COLLECTION_ID');
    return;
  }

  console.log(`📡 Fetching from JusticeHub blog...`);
  console.log(`   Collection ID: ${collectionId}\n`);

  try {
    const posts = await fetchWebflowBlogPosts({
      apiToken,
      collectionId,
      limit: 10,
    });

    console.log(`✅ Fetched ${posts.length} blog posts\n`);

    if (posts.length === 0) {
      console.log('⚠️  No posts found. Collection may be empty.');
      return;
    }

    // Show first 3 posts
    console.log('📰 Sample Blog Posts:\n');
    for (const post of posts.slice(0, 3)) {
      const normalized = normalizeWebflowPost(post);

      console.log(`\n${'─'.repeat(60)}`);
      console.log(`📄 ${normalized.title}`);
      console.log(`   Slug: ${normalized.slug}`);
      console.log(`   Published: ${normalized.publishedAt || 'Not published'}`);
      console.log(`   Author: ${normalized.author || 'Unknown'}`);

      if (normalized.excerpt) {
        console.log(`   Excerpt: ${normalized.excerpt.substring(0, 100)}...`);
      }

      if (normalized.tags && normalized.tags.length > 0) {
        console.log(`   Tags: ${normalized.tags.join(', ')}`);
      }

      if (normalized.category) {
        console.log(`   Category: ${normalized.category}`);
      }

      if (normalized.featuredImage) {
        console.log(`   Image: ${normalized.featuredImage.substring(0, 60)}...`);
      }

      console.log(`   Raw fields: ${Object.keys(post.fieldData || {}).length} fields`);
    }

    console.log(`\n${'─'.repeat(60)}`);

    // Test blog linking algorithm
    console.log('\n🔗 Testing Blog Linking Algorithm\n');

    const testProject = {
      title: 'JusticeHub',
      slug: 'justicehub',
      organizationName: 'A Curious Tractor',
      focusAreas: ['youth justice', 'family support', 'service navigation'],
      themes: ['Indigenous justice', 'community connection', 'healing'],
      partners: ['SMART Recovery', 'diagrama'],
    };

    console.log(`Testing with project: ${testProject.title}`);
    console.log(`Focus areas: ${testProject.focusAreas.join(', ')}`);
    console.log(`Themes: ${testProject.themes.join(', ')}\n`);

    const scoredPosts = posts.map(post => {
      const normalized = normalizeWebflowPost(post);
      const analysisText = [
        normalized.title,
        normalized.excerpt || '',
        normalized.content || '',
        ...(normalized.tags || []),
      ].join(' ').toLowerCase();

      let score = 0;
      const matches = [];

      // Check project name
      if (analysisText.includes(testProject.title.toLowerCase())) {
        score += 0.4;
        matches.push('Project name match');
      }

      // Check focus areas
      for (const area of testProject.focusAreas) {
        if (analysisText.includes(area.toLowerCase())) {
          score += 0.15;
          matches.push(`Focus area: ${area}`);
        }
      }

      // Check themes
      for (const theme of testProject.themes) {
        if (analysisText.includes(theme.toLowerCase())) {
          score += 0.1;
          matches.push(`Theme: ${theme}`);
        }
      }

      // Check partners
      for (const partner of testProject.partners) {
        if (analysisText.includes(partner.toLowerCase())) {
          score += 0.15;
          matches.push(`Partner: ${partner}`);
        }
      }

      return {
        title: normalized.title,
        slug: normalized.slug,
        score: Math.min(1.0, score),
        matches,
      };
    });

    const relevantPosts = scoredPosts
      .filter(p => p.score >= 0.2)
      .sort((a, b) => b.score - a.score);

    console.log(`📊 Relevance Results: ${relevantPosts.length} posts above 20% threshold\n`);

    for (const post of relevantPosts.slice(0, 5)) {
      console.log(`   ${(post.score * 100).toFixed(0)}% - ${post.title}`);
      if (post.matches.length > 0) {
        console.log(`        Matches: ${post.matches.join(', ')}`);
      }
    }

    console.log('\n✅ Webflow blog integration test complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

testWebflowBlogs();
