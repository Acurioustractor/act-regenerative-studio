#!/usr/bin/env node
/**
 * Sync Vignette Frontmatter from Empathy Ledger
 *
 * This script queries Empathy Ledger for stories with transcript analysis
 * and updates the corresponding vignette YAML frontmatter with:
 * - ALMA signal scores
 * - Descript video IDs
 * - Consent status
 * - Last sync timestamp
 *
 * Usage:
 *   node sync-from-el.mjs                    # Sync all linked vignettes
 *   node sync-from-el.mjs --dry-run          # Preview changes without writing
 *   node sync-from-el.mjs --vignette 05      # Sync specific vignette number
 */

import { createClient } from '@supabase/supabase-js'
import { parse, stringify } from 'yaml'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load EL environment
const elEnvPath = path.resolve(__dirname, '../../../empathy-ledger-v2/.env.local')
dotenv.config({ path: elEnvPath })

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Paths
const VIGNETTES_DIR = path.resolve(__dirname, '../04-story/vignettes')

/**
 * Parse YAML frontmatter from markdown file
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return { frontmatter: null, frontmatterStr: null, body: content }

  const frontmatterStr = match[1]
  const body = content.slice(match[0].length)

  try {
    const frontmatter = parse(frontmatterStr)
    return { frontmatter, frontmatterStr, body }
  } catch (e) {
    console.error('YAML parse error:', e.message)
    return { frontmatter: null, frontmatterStr, body }
  }
}

/**
 * Update frontmatter in file content (targeted updates only)
 */
function updateFrontmatter(content, updates) {
  const { frontmatter, body } = parseFrontmatter(content)
  if (!frontmatter) return null

  // Apply updates
  for (const [key, value] of Object.entries(updates)) {
    if (key.includes('.')) {
      // Nested key like 'media.descript_video_id'
      const parts = key.split('.')
      let obj = frontmatter
      for (let i = 0; i < parts.length - 1; i++) {
        if (!obj[parts[i]]) obj[parts[i]] = {}
        obj = obj[parts[i]]
      }
      obj[parts[parts.length - 1]] = value
    } else {
      frontmatter[key] = value
    }
  }

  // Serialize back
  const newFrontmatterStr = stringify(frontmatter, {
    lineWidth: 0,  // Prevent line wrapping
    nullStr: 'null',
    defaultKeyType: 'PLAIN',
    defaultStringType: 'QUOTE_DOUBLE'
  })

  return `---\n${newFrontmatterStr}---${body}`
}

/**
 * Map ALMA analysis fields to vignette signal scores
 */
function mapAlmaSignals(analysis) {
  if (!analysis || !analysis.impact_assessment) {
    return null
  }

  const impact = analysis.impact_assessment

  return {
    evidence_strength: impact.evidence_strength || 3,
    community_authority: impact.community_relevance || 3,
    harm_risk_inverted: impact.sensitivity_level ? (5 - impact.sensitivity_level) : 3,
    implementation_capability: impact.actionability || 3,
    option_value: impact.transferability || 3,
    community_value_return: impact.community_benefit || 3
  }
}

/**
 * Query EL for story and analysis data
 */
async function getStoryData(storyId) {
  // Get story details
  const { data: story, error: storyError } = await supabase
    .from('stories')
    .select('id, title, media_url, privacy_level, cultural_sensitivity_level')
    .eq('id', storyId)
    .single()

  if (storyError || !story) {
    console.log(`  ⚠️ Story not found: ${storyId}`, storyError?.message || '')
    return null
  }

  // Get transcript and analysis
  const { data: transcripts } = await supabase
    .from('transcripts')
    .select(`
      id,
      transcript_analysis_results (
        themes,
        quotes,
        impact_assessment,
        cultural_flags
      )
    `)
    .eq('story_id', storyId)

  const analysis = transcripts?.[0]?.transcript_analysis_results?.[0] || null

  // Extract Descript video ID from media_url
  let descriptVideoId = null
  if (story.media_url && story.media_url.includes('descript.com')) {
    const match = story.media_url.match(/\/view\/([^/?]+)/)
    if (match) descriptVideoId = match[1]
  }

  return {
    story,
    analysis,
    descriptVideoId
  }
}

/**
 * Find all vignette files and their EL IDs
 */
async function findVignettes() {
  const vignettes = []
  const categories = ['platform-methodology', 'palm-island', 'justice-youth', 'oonchiumpa', 'system-outcomes']

  for (const category of categories) {
    const categoryPath = path.join(VIGNETTES_DIR, category)
    try {
      const files = await fs.readdir(categoryPath)
      for (const file of files) {
        if (!file.endsWith('.md')) continue

        const filePath = path.join(categoryPath, file)
        const content = await fs.readFile(filePath, 'utf-8')
        const { frontmatter } = parseFrontmatter(content)

        if (frontmatter && frontmatter.empathy_ledger_id) {
          vignettes.push({
            file,
            path: filePath,
            relativePath: path.relative(VIGNETTES_DIR, filePath),
            category,
            elId: frontmatter.empathy_ledger_id,
            vignetteNumber: frontmatter.vignette_number
          })
        }
      }
    } catch (e) {
      // Category folder doesn't exist, skip
    }
  }

  return vignettes
}

/**
 * Update a vignette file with new data from EL
 */
async function updateVignette(vignette, elData, dryRun = false) {
  const content = await fs.readFile(vignette.path, 'utf-8')
  const { frontmatter } = parseFrontmatter(content)

  if (!frontmatter) {
    console.log(`  ⚠️ No frontmatter found in ${vignette.file}`)
    return false
  }

  const updates = {}
  const changes = []

  // Update last_synced
  updates.last_synced = new Date().toISOString()
  changes.push('last_synced')

  // Update Descript video ID if available
  if (elData.descriptVideoId) {
    if (frontmatter.media?.descript_video_id !== elData.descriptVideoId) {
      updates['media.descript_video_id'] = elData.descriptVideoId
      updates['media.descript_url'] = `https://share.descript.com/view/${elData.descriptVideoId}`
      changes.push('descript_video_id')
    }
  }

  // Update consent scope from story privacy level
  if (elData.story?.privacy_level) {
    const consentMap = {
      'public': 'EXTERNAL',
      'community': 'EXTERNAL-LITE',
      'private': 'INTERNAL',
      'restricted': 'INTERNAL'
    }
    const newScope = consentMap[elData.story.privacy_level]
    if (newScope && frontmatter.consent_scope !== newScope) {
      updates.consent_scope = newScope
      changes.push('consent_scope')
    }
  }

  // Update ALMA signals from analysis (if available)
  if (elData.analysis) {
    const signals = mapAlmaSignals(elData.analysis)
    if (signals) {
      for (const [key, value] of Object.entries(signals)) {
        updates[`alma_signals.${key}`] = value
      }

      // Calculate overall score
      const scores = Object.values(signals)
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      updates['alma_signals.overall_score'] = Math.round(avg * 10) / 10
      changes.push('alma_signals')
    }
  }

  if (changes.length === 1 && changes[0] === 'last_synced') {
    // Only timestamp changed - skip unless there are real updates
    console.log(`  ✓ ${vignette.file} - No substantive changes`)
    return false
  }

  console.log(`  ${dryRun ? '[DRY RUN] ' : ''}📝 ${vignette.file}`)
  console.log(`     Changes: ${changes.join(', ')}`)

  if (!dryRun) {
    const newContent = updateFrontmatter(content, updates)
    if (newContent) {
      await fs.writeFile(vignette.path, newContent, 'utf-8')
    }
  }

  return true
}

/**
 * Main sync function
 */
async function syncVignettes(options = {}) {
  const { dryRun = false, vignetteNumber = null } = options

  console.log('═'.repeat(60))
  console.log('SYNC VIGNETTES FROM EMPATHY LEDGER')
  console.log('═'.repeat(60))
  console.log(`Mode: ${dryRun ? 'DRY RUN (no files will be modified)' : 'LIVE'}`)
  console.log(`EL URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)
  console.log('')

  // Find vignettes with EL IDs
  const vignettes = await findVignettes()
  console.log(`Found ${vignettes.length} vignettes with EL links`)

  // Filter by vignette number if specified
  const toSync = vignetteNumber
    ? vignettes.filter(v => v.vignetteNumber === parseInt(vignetteNumber))
    : vignettes

  console.log(`Syncing ${toSync.length} vignettes...`)
  console.log('')

  let synced = 0
  let unchanged = 0
  let failed = 0

  for (const vignette of toSync) {
    console.log(`\n[${vignette.vignetteNumber}] ${vignette.relativePath}`)
    console.log(`    EL ID: ${vignette.elId}`)

    try {
      const elData = await getStoryData(vignette.elId)

      if (!elData) {
        failed++
        continue
      }

      console.log(`    Story: ${elData.story?.title || 'Unknown'}`)
      console.log(`    Has analysis: ${elData.analysis ? 'Yes' : 'No'}`)
      console.log(`    Descript ID: ${elData.descriptVideoId || 'None'}`)

      const updated = await updateVignette(vignette, elData, dryRun)
      if (updated) synced++
      else unchanged++

    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`)
      failed++
    }
  }

  console.log('')
  console.log('═'.repeat(60))
  console.log('SYNC COMPLETE')
  console.log('═'.repeat(60))
  console.log(`Updated: ${synced}`)
  console.log(`Unchanged: ${unchanged}`)
  console.log(`Failed: ${failed}`)
  console.log('')

  if (dryRun && synced > 0) {
    console.log('ℹ️  Run without --dry-run to apply changes')
  }
}

// Parse CLI arguments
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const vignetteIndex = args.indexOf('--vignette')
const vignetteNumber = vignetteIndex >= 0 ? args[vignetteIndex + 1] : null

// Run sync
syncVignettes({ dryRun, vignetteNumber })
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
