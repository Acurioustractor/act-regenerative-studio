
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '../../act-personal-ai/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials. Make sure you are authenticated.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface EvidenceSeed {
    title: string;
    evidence_type: 'Academic Research' | 'Evaluation Report' | 'Case Study' | 'Lived Experience/Story' | 'Cultural Knowledge' | 'Sensor/Biometric Data' | 'Code/Github Commit' | 'Oral History' | 'Policy Analysis';
    findings: string;
    methodology?: string;
    cultural_safety?: string;
    source_url?: string;
    author?: string;
    year?: string;
    consent_level: 'Strictly Private' | 'Community Controlled' | 'Public Knowledge Commons';
}

const REAL_EVIDENCE: EvidenceSeed[] = [
    {
        title: 'Oonchiumpa Outcomes Framework 2024',
        evidence_type: 'Evaluation Report',
        findings: '95% reduction in offending behaviour; 72% re-engagement with education; 89% retention rate in program.',
        methodology: 'Participatory Action Research with Arrernte Elders and Youth.',
        cultural_safety: 'Governed by Oonchiumpa Board.',
        source_url: 'https://notion.so/act/oonchiumpa-report', // Placeholder real link
        consent_level: 'Community Controlled'
    },
    {
        title: 'Goods. Impact Assessment',
        evidence_type: 'Case Study',
        findings: '$550,000 in funding secured; 5 partner organisations onboarded; established sovereign procurement channels.',
        methodology: 'Financial analysis and stakeholder interviews.',
        source_url: 'https://goods.org.au',
        consent_level: 'Public Knowledge Commons'
    },
    {
        title: 'Empathy Ledger Pilot Data',
        evidence_type: 'Lived Experience/Story',
        findings: 'Validated "Story Sovereignty" model with 50+ participants; developed reusable digital infrastructure.',
        methodology: 'Pilot program with feedback loops.',
        consent_level: 'Public Knowledge Commons'
    },
    {
        title: 'Fishers Oysters Annual Review',
        evidence_type: 'Evaluation Report',
        findings: 'Successful seeding of new oyster beds; 5 youth employed in land-sea management roles.',
        methodology: 'Operational reporting.',
        consent_level: 'Community Controlled'
    },
    {
        title: 'Diagrama Impact Analysis',
        evidence_type: 'Policy Analysis',
        findings: 'Spanish model demonstrates 30% lower recidivism than standard detention models.',
        methodology: 'Comparative policy review.',
        consent_level: 'Public Knowledge Commons'
    }
];

// Helper to look up initiative IDs by name/slug to link them later?
// This script just seeds the Evidence entities themselves. Linking is a separate step or needs lookup.
// For now, let's just seed the Evidence records.

async function seedEvidence() {
    console.log('🌱 Seeding ALMA Evidence records...');

    let successCount = 0;
    let failCount = 0;

    for (const ev of REAL_EVIDENCE) {
        const { data, error } = await supabase
            .from('alma_evidence')
            .upsert({
                title: ev.title,
                evidence_type: ev.evidence_type,
                findings: ev.findings,
                methodology: ev.methodology,
                cultural_safety: ev.cultural_safety,
                source_url: ev.source_url,
                author: ev.author,
                consent_level: ev.consent_level, // Defaulting if allowed, check schema
                updated_at: new Date().toISOString()
            }, { onConflict: 'title' }) // Best effort dedup by title. Schema has ID PK.
            .select();

        // Manual Upsert Logic if needed
        const { data: existing } = await supabase.from('alma_evidence').select('id').eq('title', ev.title).single();

        let op;
        if (existing) {
            op = await supabase.from('alma_evidence').update({
                evidence_type: ev.evidence_type,
                findings: ev.findings,
                updated_at: new Date().toISOString()
            }).eq('id', existing.id);
        } else {
            op = await supabase.from('alma_evidence').insert({
                title: ev.title,
                evidence_type: ev.evidence_type,
                findings: ev.findings,
                methodology: ev.methodology,
                cultural_safety: ev.cultural_safety,
                source_url: ev.source_url,
                author: ev.author,
                consent_level: ev.consent_level
            });
        }

        if (op.error) {
            console.error(`❌ Failed to seed ${ev.title}:`, op.error.message);
            failCount++;
        } else {
            console.log(`✅ Seeded: ${ev.title}`);
            successCount++;
        }
    }

    console.log(`\n✨ Evidence Seeding complete! Success: ${successCount}, Failed: ${failCount}`);
}

seedEvidence();
