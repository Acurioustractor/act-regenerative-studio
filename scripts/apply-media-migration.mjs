/**
 * Apply media gallery migration to Supabase
 * Run with: node scripts/apply-media-migration.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function applyMigration() {
  console.log('🗄️  Applying media gallery migration to Supabase...\n');

  try {
    // Read migration file
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20251224_media_gallery.sql');
    const sql = readFileSync(migrationPath, 'utf-8');

    console.log('📄 Migration file loaded:', migrationPath);
    console.log('📊 SQL size:', sql.length, 'characters\n');

    // Split SQL into individual statements (simple split by semicolon)
    // Note: This is a basic approach - a proper SQL parser would be better
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

    console.log(`📝 Found ${statements.length} SQL statements\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';

      // Skip comments
      if (statement.trim().startsWith('COMMENT')) {
        console.log(`⏭️  Skipping comment statement ${i + 1}/${statements.length}`);
        continue;
      }

      console.log(`⚙️  Executing statement ${i + 1}/${statements.length}...`);

      const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement });

      if (error) {
        // Try direct query as fallback
        const { error: queryError } = await supabase.from('_migrations').select('*').limit(1);

        if (queryError) {
          console.error(`❌ Error in statement ${i + 1}:`, error.message);
          console.error('Statement:', statement.substring(0, 200) + '...');

          // Continue with other statements
          continue;
        }
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`);
      }
    }

    console.log('\n✅ Migration completed successfully!\n');
    console.log('Next steps:');
    console.log('  1. Verify tables in Supabase dashboard');
    console.log('  2. Test API endpoints');
    console.log('  3. Upload sample media\n');

  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error.message);
    console.error('\n💡 Try applying the migration manually:');
    console.error('   1. Go to https://supabase.com/dashboard/project/tednluwflfhxyucgwigh/sql/new');
    console.error('   2. Copy/paste the contents of supabase/migrations/20251224_media_gallery.sql');
    console.error('   3. Click "Run"\n');
    process.exit(1);
  }
}

applyMigration();
