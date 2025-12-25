/**
 * Discover Webflow Site and Collection IDs
 *
 * Uses the Webflow API to list sites and collections for each API token.
 * Run with: node scripts/discover-webflow-sites.mjs
 */

import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const tokens = {
  'ACT Main': process.env.WEBFLOW_API_TOKEN,
  'JusticeHub': process.env.WEBFLOW_API_TOKEN_JUSTICEHUB,
};

async function discoverWebflowSites() {
  console.log('🔍 Discovering Webflow Sites and Collections...\n');

  for (const [name, token] of Object.entries(tokens)) {
    if (!token) {
      console.log(`⚠️  ${name}: No API token found\n`);
      continue;
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📱 ${name}`);
    console.log(`${'='.repeat(60)}\n`);

    try {
      // List sites
      console.log('Fetching sites...');
      const sitesRes = await fetch('https://api.webflow.com/v2/sites', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json',
        },
      });

      if (!sitesRes.ok) {
        const error = await sitesRes.text();
        console.error(`❌ Error fetching sites: ${sitesRes.status} - ${error}\n`);
        continue;
      }

      const sitesData = await sitesRes.json();
      const sites = sitesData.sites || [];

      console.log(`✅ Found ${sites.length} site(s)\n`);

      for (const site of sites) {
        console.log(`\n  📍 Site: ${site.displayName || site.name}`);
        console.log(`     ID: ${site.id}`);
        console.log(`     Shortname: ${site.shortName}`);
        if (site.customDomains && site.customDomains.length > 0) {
          console.log(`     Domains: ${site.customDomains.map(d => d.url).join(', ')}`);
        }

        // Fetch collections for this site
        console.log(`\n     Fetching collections...`);
        const collectionsRes = await fetch(`https://api.webflow.com/v2/sites/${site.id}/collections`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json',
          },
        });

        if (collectionsRes.ok) {
          const collectionsData = await collectionsRes.json();
          const collections = collectionsData.collections || [];

          console.log(`     ✅ Found ${collections.length} collection(s)\n`);

          for (const collection of collections) {
            console.log(`        📚 ${collection.displayName || collection.singularName}`);
            console.log(`           ID: ${collection.id}`);
            console.log(`           Slug: ${collection.slug}`);

            // Fetch a sample item to see structure
            const itemsRes = await fetch(`https://api.webflow.com/v2/collections/${collection.id}/items?limit=1`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json',
              },
            });

            if (itemsRes.ok) {
              const itemsData = await itemsRes.json();
              const items = itemsData.items || [];
              console.log(`           Items: ${itemsData.items?.length || 0} total`);

              if (items.length > 0) {
                console.log(`           Sample fields:`, Object.keys(items[0].fieldData || {}).join(', '));
              }
            }
            console.log('');
          }
        } else {
          const error = await collectionsRes.text();
          console.log(`     ❌ Error fetching collections: ${collectionsRes.status}`);
        }
      }

    } catch (error) {
      console.error(`❌ Error processing ${name}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Discovery complete!\n');
  console.log('💡 Add the Site IDs and Collection IDs to .env.local:');
  console.log('   WEBFLOW_SITE_ID=<main-site-id>');
  console.log('   WEBFLOW_BLOG_COLLECTION_ID=<main-blog-collection-id>');
  console.log('   WEBFLOW_JUSTICEHUB_SITE_ID=<justicehub-site-id>');
  console.log('   WEBFLOW_JUSTICEHUB_BLOG_COLLECTION_ID=<justicehub-blog-collection-id>\n');
}

discoverWebflowSites();
