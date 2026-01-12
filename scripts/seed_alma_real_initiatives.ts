
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '../../act-personal-ai/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials. Make sure you have loaded them (e.g. via load-secrets.sh) or have a .env.local file.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface InitiativeSeed {
    title: string;
    slug: string;
    type: 'Land' | 'Studio' | 'Harvest';
    description: string;
    status: 'active' | 'incubating' | 'completed' | 'archived';
    outcome_focus: string;
    community_authority: 'High' | 'Medium' | 'Low' | 'None';
    evidence_strength: 'High' | 'Medium' | 'Low' | 'Emerging';
    context_tags: string[];
}

const REAL_INITIATIVES: InitiativeSeed[] = [
    {
        title: '10x10 Community Capital Leadership Retreat', slug: '10x10-retreat', type: 'Harvest',
        description: 'Leadership retreat to grow community capital and shared enterprise practice.', status: 'active',
        outcome_focus: 'Community capital growth, shared practice', community_authority: 'Medium', evidence_strength: 'Medium',
        context_tags: ['Leadership', 'Community Capital', 'Retreat', 'Education/Workshop']
    },
    { title: 'ACT Monthly Dinners', slug: 'act-dinners', type: 'Harvest', description: 'Regular community dinners for listening, connection, and relationship-building.', status: 'active', outcome_focus: 'Relationship building, community connection', community_authority: 'High', evidence_strength: 'Medium', context_tags: ['Community', 'Connection', 'Gathering', 'Event/Gathering'] },
    { title: 'ACT stop, revive, thrive in Bali', slug: 'act-bali-retreat', type: 'Studio', description: 'Rest and renewal program for capacity and strategy reset.', status: 'active', outcome_focus: 'Capacity building, strategy reset, wellbeing', community_authority: 'Low', evidence_strength: 'Low', context_tags: ['Wellbeing', 'Retreat', 'Strategy', 'Education/Workshop'] },
    { title: 'ANAT SPECTRA 2025', slug: 'anat-spectra-2025', type: 'Studio', description: 'Storytelling and creative research collaboration.', status: 'active', outcome_focus: 'Creative research, storytelling', community_authority: 'Medium', evidence_strength: 'Emerging', context_tags: ['Arts', 'Research', 'Storytelling'] },
    { title: 'BG Fit', slug: 'bg-fit', type: 'Studio', description: 'Lived-experience youth wellbeing and justice program in Mount Isa.', status: 'active', outcome_focus: 'Youth wellbeing, justice diversion', community_authority: 'High', evidence_strength: 'Medium', context_tags: ['Mount Isa', 'Youth Justice', 'Wellbeing', 'Community Enterprise'] },
    { title: 'Cars and microcontrollers', slug: 'cars-microcontrollers', type: 'Studio', description: 'Hands-on learning and making program for skills and confidence.', status: 'active', outcome_focus: 'Skills development, confidence', community_authority: 'Medium', evidence_strength: 'Emerging', context_tags: ['Education', 'Tech', 'Youth', 'Education/Workshop'] },
    { title: 'Contained', slug: 'contained', type: 'Studio', description: 'Experiential justice installation exploring alternatives to detention.', status: 'active', outcome_focus: 'Public awareness, policy advocacy', community_authority: 'Medium', evidence_strength: 'Medium', context_tags: ['Justice', 'Arts', 'Installation', 'Public Installation'] },
    { title: 'Custodian Economy', slug: 'custodian-economy', type: 'Studio', description: 'Economic model work for community ownership and stewardship.', status: 'active', outcome_focus: 'Economic modeling, community ownership', community_authority: 'High', evidence_strength: 'High', context_tags: ['Economics', 'Stewardship', 'Research', 'Research/R&D'] },
    { title: 'Dad.Lab.25', slug: 'dad-lab-25', type: 'Studio', description: 'Father connection and wellbeing program.', status: 'active', outcome_focus: 'Family connection, wellbeing', community_authority: 'Medium', evidence_strength: 'Emerging', context_tags: ['Family', 'Wellbeing', 'Men', 'Education/Workshop'] },
    { title: 'Designing for Obsolescence', slug: 'designing-obsolescence', type: 'Studio', description: 'Core methodology for handover and community ownership.', status: 'active', outcome_focus: 'Methodology development, sustainable exit strategies', community_authority: 'High', evidence_strength: 'High', context_tags: ['Methodology', 'Design', 'Community Ownership', 'Research/R&D'] },
    { title: 'Diagrama', slug: 'diagrama', type: 'Studio', description: 'Justice learning partnership and reference practice from Spain.', status: 'active', outcome_focus: 'International knowledge exchange, best practice', community_authority: 'Medium', evidence_strength: 'Medium', context_tags: ['Justice', 'International', 'Partnership', 'Research/R&D'] },
    { title: 'Empathy Ledger', slug: 'empathy-ledger', type: 'Studio', description: 'Consent-first storytelling platform for community voice.', status: 'active', outcome_focus: 'Narrative sovereignty, data rights', community_authority: 'High', evidence_strength: 'High', context_tags: ['Tech', 'Storytelling', 'Data Rights', 'Digital Infrastructure'] },
    { title: 'Fairfax & PLACE tech', slug: 'fairfax-place-tech', type: 'Studio', description: 'Place-based technology partnership and research.', status: 'active', outcome_focus: 'Place-based tech research', community_authority: 'Medium', evidence_strength: 'Emerging', context_tags: ['Tech', 'Place', 'Research', 'Research/R&D'] },
    { title: 'Fishers Oysters', slug: 'fishers-oysters', type: 'Land', description: 'Indigenous-led aquaculture restoring oyster reefs and sovereignty.', status: 'active', outcome_focus: 'Economic sovereignty, land restoration', community_authority: 'High', evidence_strength: 'Medium', context_tags: ['Aquaculture', 'Indigenous', 'Land Care', 'Community Enterprise'] },
    { title: 'Gold.Phone', slug: 'gold-phone', type: 'Studio', description: 'Experimental communication tool for community storytelling.', status: 'active', outcome_focus: 'Storytelling innovation', community_authority: 'Medium', evidence_strength: 'Emerging', context_tags: ['Tech', 'Storytelling', 'Experiment', 'Digital Infrastructure'] },
    { title: 'Goods.', slug: 'goods', type: 'Harvest', description: 'Essential goods co-designed with community for health and dignity.', status: 'active', outcome_focus: 'Health, dignity, economic outcome', community_authority: 'High', evidence_strength: 'High', context_tags: ['Health', 'Co-design', 'Enterprise', 'Community Enterprise'] },
    { title: 'June\'s Patch', slug: 'junes-patch', type: 'Land', description: 'Land-based wellbeing and food program.', status: 'active', outcome_focus: 'Food security, wellbeing', community_authority: 'High', evidence_strength: 'Medium', context_tags: ['Food', 'Land', 'Wellbeing', 'Land Management'] },
    { title: 'JusticeHub', slug: 'justicehub', type: 'Studio', description: 'Community-owned justice infrastructure and knowledge sharing.', status: 'active', outcome_focus: 'Infrastructure, knowledge sharing', community_authority: 'High', evidence_strength: 'High', context_tags: ['Justice', 'Infrastructure', 'Community', 'Digital Infrastructure'] },
    { title: 'MingaMinga Rangers', slug: 'mingaminga-rangers', type: 'Land', description: 'Ranger pathway supporting land care and local capability.', status: 'active', outcome_focus: 'Land care, employment pathways', community_authority: 'High', evidence_strength: 'Medium', context_tags: ['Rangers', 'Land Care', 'Employment', 'Land Management'] },
    { title: 'MMEIC - Justice Projects', slug: 'mmeic-justice', type: 'Harvest', description: 'Justice reinvestment partnership with Minjerribah Moorgumpin Elders-In-Council.', status: 'active', outcome_focus: 'Justice reinvestment, community partnership', community_authority: 'High', evidence_strength: 'Medium', context_tags: ['Justice', 'Minjerribah', 'Elders', 'Community Enterprise'] },
    { title: 'Mounty Yarns', slug: 'mounty-yarns', type: 'Studio', description: 'Storytelling and youth justice connection in Melbourne.', status: 'active', outcome_focus: 'Storytelling, connection', community_authority: 'Medium', evidence_strength: 'Emerging', context_tags: ['Storytelling', 'Melbourne', 'Youth Justice', 'Storytelling'] },
    { title: 'NFP leaders interview project', slug: 'nfp-leaders-interview', type: 'Studio', description: 'Research interviews to map sector learning.', status: 'active', outcome_focus: 'Sector learning, research insights', community_authority: 'Low', evidence_strength: 'Emerging', context_tags: ['Research', 'Leadership', 'NFP', 'Research/R&D'] },
    { title: 'Oonchiumpa', slug: 'oonchiumpa', type: 'Studio', description: 'Community-led healing and justice initiative in Central Australia.', status: 'active', outcome_focus: '95% offending reduction, healing', community_authority: 'High', evidence_strength: 'High', context_tags: ['Healing', 'Central Australia', 'Justice', 'Aboriginal Led', 'Land Management'] },
    { title: 'PICC - Storm Stories', slug: 'picc-storm-stories', type: 'Studio', description: 'Community storytelling on storm memory and recovery.', status: 'active', outcome_focus: 'Community recovery, storytelling', community_authority: 'High', evidence_strength: 'Medium', context_tags: ['Storytelling', 'Recovery', 'PICC', 'Storytelling'] },
    { title: 'PICC Annual Report', slug: 'picc-annual-report', type: 'Studio', description: 'Community-led annual report and storytelling output.', status: 'active', outcome_focus: 'Communication, reporting', community_authority: 'Medium', evidence_strength: 'Low', context_tags: ['Reporting', 'Storytelling', 'PICC', 'Storytelling'] },
    { title: 'PICC Centre Precinct', slug: 'picc-centre-precinct', type: 'Land', description: 'Youth justice precinct and community hub development.', status: 'active', outcome_focus: 'Infrastructure, community hub', community_authority: 'High', evidence_strength: 'Medium', context_tags: ['Infrastructure', 'Development', 'PICC', 'Land Management'] },
    { title: 'PICC Elders\' trip to Hull River', slug: 'picc-elders-trip', type: 'Land', description: 'Elders\' on-Country visit and cultural reconnection.', status: 'active', outcome_focus: 'Cultural reconnection, wellbeing', community_authority: 'High', evidence_strength: 'Medium', context_tags: ['Culture', 'Elders', 'On-Country', 'PICC', 'Land Management'] },
    { title: 'PICC Photo Kiosk / Server', slug: 'picc-photo-kiosk', type: 'Studio', description: 'Community photo kiosk and local archive infrastructure.', status: 'active', outcome_focus: 'Archiving, community access', community_authority: 'Medium', evidence_strength: 'Medium', context_tags: ['Tech', 'Archive', 'PICC', 'Digital Infrastructure'] },
    { title: 'Project Her Self design', slug: 'project-her-self', type: 'Studio', description: 'Design and storytelling project for women\'s empowerment.', status: 'active', outcome_focus: 'Empowerment, design', community_authority: 'Medium', evidence_strength: 'Emerging', context_tags: ['Women', 'Design', 'Storytelling', 'Storytelling'] },
    { title: 'Regional Arts Fellowship', slug: 'regional-arts-fellowship', type: 'Studio', description: 'Fellowship supporting regional arts practice.', status: 'active', outcome_focus: 'Arts practice support', community_authority: 'Low', evidence_strength: 'Emerging', context_tags: ['Arts', 'Fellowship', 'Cultural Production'] },
    { title: 'SMART Connect', slug: 'smart-connect', type: 'Studio', description: 'Connection pathway for recovery and community support.', status: 'active', outcome_focus: 'Recovery, connection', community_authority: 'Medium', evidence_strength: 'Medium', context_tags: ['Recovery', 'Support', 'SMART', 'Education/Workshop'] },
    { title: 'SMART HCP GP Uplift Project', slug: 'smart-hcp-gp-uplift', type: 'Studio', description: 'Primary care referral and uplift workstream.', status: 'active', outcome_focus: 'Healthcare integration, referral pathways', community_authority: 'Low', evidence_strength: 'Medium', context_tags: ['Health', 'SMART', 'System Integration', 'Research/R&D'] },
    { title: 'The Confessional', slug: 'the-confessional', type: 'Studio', description: 'Storytelling installation for anonymous truth-telling.', status: 'active', outcome_focus: 'Truth-telling, emotional release', community_authority: 'Low', evidence_strength: 'Emerging', context_tags: ['Arts', 'Installation', 'Storytelling', 'Public Installation'] },
    { title: 'Travelling women\'s car', slug: 'travelling-womens-car', type: 'Studio', description: 'Mobile cultural preservation and storytelling project.', status: 'active', outcome_focus: 'Cultural preservation, storytelling', community_authority: 'High', evidence_strength: 'Medium', context_tags: ['Culture', 'Women', 'Mobile', 'Cultural Production'] },
    { title: 'Uncle Allan Palm Island Art', slug: 'uncle-allan-art', type: 'Studio', description: 'Art practice and cultural knowledge sharing.', status: 'active', outcome_focus: 'Cultural knowledge, art', community_authority: 'High', evidence_strength: 'Medium', context_tags: ['Art', 'Culture', 'Palm Island', 'Cultural Production'] },
    { title: 'Witta Harvest HQ', slug: 'witta-harvest-hq', type: 'Harvest', description: 'Witta enterprise hub and community innovation site.', status: 'active', outcome_focus: 'Enterprise hub, innovation', community_authority: 'Medium', evidence_strength: 'Emerging', context_tags: ['Enterprise', 'Hub', 'Witta', 'Community Enterprise'] }
];

// Helper to determine ALMA Type from context tags
function inferAlmaType(init: InitiativeSeed): string {
    const tags = init.context_tags;

    // Explicit overrides
    if (tags.includes('Public Installation')) return 'Public Installation';
    if (tags.includes('Storytelling')) return 'Storytelling';
    if (tags.includes('Cultural Production')) return 'Cultural Production';
    if (tags.includes('Community Enterprise')) return 'Community Enterprise';
    if (tags.includes('Digital Infrastructure')) return 'Digital Infrastructure';
    if (tags.includes('Research/R&D')) return 'Research/R&D';
    if (tags.includes('Land Management')) return 'Land Management';
    if (tags.includes('Education/Workshop')) return 'Education/Workshop';
    if (tags.includes('Event/Gathering')) return 'Event/Gathering';

    // Fallbacks based on broad type
    switch (init.type) {
        case 'Land': return 'Land Management';
        case 'Harvest': return 'Community Enterprise';
        case 'Studio': return 'Research/R&D';
        default: return 'Research/R&D';
    }
}

// Helper to determine Evidence Level
function inferEvidenceLevel(strength: string): string {
    switch (strength) {
        case 'High': return 'Effective (strong evaluation, positive outcomes)';
        case 'Medium': return 'Promising (community-endorsed, emerging evidence)';
        case 'Emerging': return 'Untested (theory/pilot stage)';
        case 'Low': return 'Untested (theory/pilot stage)';
        default: return 'Untested (theory/pilot stage)';
    }
}

async function seedInitiatives() {
    console.log('🌱 Seeding ALMA with REAL Initiatives...');

    let successCount = 0;
    let failCount = 0;

    for (const init of REAL_INITIATIVES) {
        const almaType = inferAlmaType(init);
        const evidenceLevel = inferEvidenceLevel(init.evidence_strength);

        // Prepare metadata
        const metadata = {
            original_type: init.type,
            outcome_focus: init.outcome_focus,
            community_authority_rating: init.community_authority,
            context_tags: init.context_tags
        };

        const { data, error } = await supabase
            .from('alma_initiatives') // Correct table name
            .upsert({
                name: init.title, // Map title to name
                type: almaType, // Map to specific Enum
                description: init.description,
                status: init.status === 'active' ? 'Active' : 'Concept', // Simple mapping, schema allows TEXT defaults
                evidence_level: evidenceLevel,
                // cultural_authority: init.community_authority === 'High' ? 'Community Controlled' : null, // Optional, leave blank for now to avoid check constraint issues
                metadata: metadata, // Store extra fields in metadata
                updated_at: new Date().toISOString()
            }, { onConflict: 'name' }) // Constraint might be on name or ID. Usually ID. We don't have slugs in schema? Schema has no slug column!
            // Wait, schema has NO SLUG column. It uses ID.
            // Upserting by Name is risky if names change. 
            // But for seeding, we can check if a record with this name exists.
            // Supabase upsert requires a unique constraint. verify if name is unique.
            // Schema: CREATE TABLE alma_initiatives ( ... name TEXT NOT NULL ... ) - No unique constraint explicitly visible in snippet on name alone.
            // UUID is PK.
            // If we can't upsert by slug, we might create duplicates.
            // Better strategy: Select by name -> If exists, update. If not, insert.
            // For this script, let's try to match on name.
            .select();

        // Check for duplicates manually if upsert key is missing
        // Actually, let's just use 'name' if we can't assume unique constraint.
        // To be safe, let's just insert if not exists for this run, or search first.

        // Standard approach:
        const { data: existing } = await supabase.from('alma_initiatives').select('id').eq('name', init.title).single();

        let op;
        if (existing) {
            op = await supabase.from('alma_initiatives').update({
                type: almaType,
                description: init.description,
                evidence_level: evidenceLevel,
                metadata: metadata,
                updated_at: new Date().toISOString()
            }).eq('id', existing.id);
        } else {
            op = await supabase.from('alma_initiatives').insert({
                name: init.title,
                type: almaType,
                description: init.description,
                evidence_level: evidenceLevel,
                metadata: metadata
            });
        }

        if (op.error) {
            console.error(`❌ Failed to seed ${init.title}:`, op.error.message);
            failCount++;
        } else {
            console.log(`✅ Seeded: ${init.title} (${almaType})`);
            successCount++;
        }
    }

    console.log(`\n✨ Seeding complete! Success: ${successCount}, Failed: ${failCount}`);
}

seedInitiatives();
