
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '../../act-personal-ai/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials. Make sure you have loaded them or have a .env.local file.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ContextSeed {
    name: string;
    context_type: 'Bioregion' | 'First Nations Country' | 'Rural Community' | 'Urban Community' | 'Digital Community' | 'Organization/Institution';
    location_description?: string;
    bioregion?: string;
    cultural_authority: string;
    description?: string;
    ecological_features?: string;
}

const REAL_CONTEXTS: ContextSeed[] = [
    {
        name: 'Black Cockatoo Valley',
        context_type: 'Rural Community',
        cultural_authority: 'Jinibara',
        bioregion: 'South East Queensland',
        location_description: 'Running Creek',
        description: 'A regenerative living lab and home of the ACT Studio.',
        ecological_features: 'Wet sclerophyll forest, creek system, endangered species habitat.'
    },
    {
        name: 'Witta',
        context_type: 'Rural Community',
        cultural_authority: 'Jinibara',
        bioregion: 'South East Queensland',
        location_description: 'Maleny Plateau',
        description: 'Community node for regenerative agriculture and food systems.',
        ecological_features: 'High rainfall, volcanic soil, plateau ecosystem.'
    },
    {
        name: 'Minjerribah (North Stradbroke Island)',
        context_type: 'First Nations Country',
        cultural_authority: 'Quandamooka',
        bioregion: 'Moreton Bay',
        location_description: 'Island sand mass',
        description: 'Traditional Country of the Quandamooka people, site of justice reinvestment and aquaculture.',
        ecological_features: 'Sand island, wetlands, marine ecosystem, wallum heath.'
    },
    {
        name: 'Palm Island (Bwgcolman)',
        context_type: 'First Nations Country',
        cultural_authority: 'Bwgcolman',
        bioregion: 'Great Barrier Reef',
        location_description: 'Tropical Island',
        description: 'Aboriginal community with strong cultural governance and economic sovereignty initiatives.',
        ecological_features: 'Tropical island, reef, mountain.'
    },
    {
        name: 'Central Australia (Arrernte Country)',
        context_type: 'First Nations Country',
        cultural_authority: 'Arrernte',
        bioregion: 'Central Desert',
        location_description: 'Alice Springs / Surrounds',
        description: 'Site of Oonchiumpa Youth Services and deep cultural healing work.',
        ecological_features: 'Desert landscape, river red gums, ranges.'
    },
    {
        name: 'Mount Isa',
        context_type: 'Rural Community',
        cultural_authority: 'Kalkadoon',
        bioregion: 'North West Queensland',
        location_description: 'Mining Town',
        description: 'Regional hub for youth justice and wellbeing programs like BG Fit.',
        ecological_features: 'Semi-arid, mineral rich, ranges.'
    },
    {
        name: 'ACT Global Studio',
        context_type: 'Digital Community',
        cultural_authority: 'ACT Governance',
        bioregion: 'Global',
        description: 'The digital connective tissue and knowledge commons for the ecosystem.',
        ecological_features: 'Digital infrastructure, knowledge graph.'
    }
];

async function seedContexts() {
    console.log('🌱 Seeding ALMA Contexts...');

    let successCount = 0;
    let failCount = 0;

    for (const ctx of REAL_CONTEXTS) {
        const { data, error } = await supabase
            .from('alma_contexts')
            .upsert({
                name: ctx.name,
                context_type: ctx.context_type,
                cultural_authority: ctx.cultural_authority,
                location_description: ctx.location_description,
                bioregion: ctx.bioregion,
                description: ctx.description,
                ecological_features: ctx.ecological_features,
                updated_at: new Date().toISOString()
            }, { onConflict: 'name' }) // Assuming unique name constraint or similar logic
            .select();

        // Workaround if Unique Name constraint doesn't exist
        if (error && error.code === '23505') { // Unique violation
            // Update handling if needed, but upsert should handle it if constraint exists.
            // If constraint is missing, we might duplicate. 
            // Let's assume for now we might need to search first like before.
        }

        // Safer Manual Upsert
        const { data: existing } = await supabase.from('alma_contexts').select('id').eq('name', ctx.name).single();

        let op;
        if (existing) {
            op = await supabase.from('alma_contexts').update({
                context_type: ctx.context_type,
                cultural_authority: ctx.cultural_authority,
                description: ctx.description,
                updated_at: new Date().toISOString()
            }).eq('id', existing.id);
        } else {
            op = await supabase.from('alma_contexts').insert({
                name: ctx.name,
                context_type: ctx.context_type,
                cultural_authority: ctx.cultural_authority,
                location_description: ctx.location_description,
                bioregion: ctx.bioregion,
                description: ctx.description,
                ecological_features: ctx.ecological_features
            });
        }

        if (op.error) {
            console.error(`❌ Failed to seed ${ctx.name}:`, op.error.message);
            failCount++;
        } else {
            console.log(`✅ Seeded: ${ctx.name}`);
            successCount++;
        }
    }

    console.log(`\n✨ Context Seeding complete! Success: ${successCount}, Failed: ${failCount}`);
}

seedContexts();
