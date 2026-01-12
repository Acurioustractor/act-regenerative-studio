#!/usr/bin/env node
/**
 * Validate Vignette Frontmatter
 *
 * Checks all vignette files for:
 * - Valid YAML frontmatter
 * - Required fields present
 * - ALMA signal scores in valid range (1-5)
 * - Valid consent_scope values
 * - Valid category values
 *
 * Usage:
 *   node validate-vignettes.mjs
 *   node validate-vignettes.mjs --fix  # Fix common issues
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const VIGNETTES_DIR = path.resolve(__dirname, '../04-story/vignettes')

// Required fields for a vignette
const REQUIRED_FIELDS = [
  'title',
  'slug',
  'vignette_number',
  'category',
  'consent_scope',
  'project_slugs',
  'alma_signals',
  'status'
]

// Valid enum values
const VALID_CONSENT_SCOPES = ['INTERNAL', 'EXTERNAL-LITE', 'EXTERNAL']
const VALID_CATEGORIES = ['platform-methodology', 'palm-island', 'justice-youth', 'oonchiumpa', 'system-outcomes']
const VALID_STATUSES = ['draft', 'pending', 'published']
const VALID_CULTURAL_REVIEW = ['pending', 'elder-review', 'approved', 'restricted']

// ALMA signal keys
const ALMA_SIGNALS = [
  'evidence_strength',
  'community_authority',
  'harm_risk_inverted',
  'implementation_capability',
  'option_value',
  'community_value_return'
]

/**
 * Parse YAML frontmatter (simplified parser)
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null

  const yaml = match[1]
  const result = {}

  // Very basic YAML parsing for our specific format
  let currentSection = null
  let currentArray = null

  for (const line of yaml.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const indent = line.search(/\S/)
    const colonIdx = trimmed.indexOf(':')

    if (colonIdx > 0 && indent === 0) {
      const key = trimmed.slice(0, colonIdx)
      const value = trimmed.slice(colonIdx + 1).trim()

      if (value === '' || value === '{}' || value === '[]') {
        result[key] = value === '[]' ? [] : {}
        currentSection = key
      } else {
        result[key] = parseValue(value)
        currentSection = null
      }
      currentArray = value === '[]' ? key : null
    } else if (trimmed.startsWith('-') && currentArray) {
      if (!Array.isArray(result[currentArray])) result[currentArray] = []
      result[currentArray].push(trimmed.slice(1).trim())
    } else if (colonIdx > 0 && indent > 0 && currentSection) {
      const key = trimmed.slice(0, colonIdx)
      const value = trimmed.slice(colonIdx + 1).trim()
      if (typeof result[currentSection] === 'object') {
        result[currentSection][key] = parseValue(value)
      }
    }
  }

  return result
}

function parseValue(str) {
  if (str === 'null') return null
  if (str === 'true') return true
  if (str === 'false') return false
  if (!isNaN(Number(str)) && str !== '') return Number(str)
  if (str.startsWith('"') && str.endsWith('"')) return str.slice(1, -1)
  return str
}

/**
 * Validate a single vignette
 */
function validateVignette(filePath, frontmatter) {
  const errors = []
  const warnings = []
  const fileName = path.basename(filePath)

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!(field in frontmatter) || frontmatter[field] === null) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  // Validate consent_scope
  if (frontmatter.consent_scope && !VALID_CONSENT_SCOPES.includes(frontmatter.consent_scope)) {
    errors.push(`Invalid consent_scope: "${frontmatter.consent_scope}" (must be one of: ${VALID_CONSENT_SCOPES.join(', ')})`)
  }

  // Validate category
  if (frontmatter.category && !VALID_CATEGORIES.includes(frontmatter.category)) {
    errors.push(`Invalid category: "${frontmatter.category}" (must be one of: ${VALID_CATEGORIES.join(', ')})`)
  }

  // Validate status
  if (frontmatter.status && !VALID_STATUSES.includes(frontmatter.status)) {
    errors.push(`Invalid status: "${frontmatter.status}" (must be one of: ${VALID_STATUSES.join(', ')})`)
  }

  // Validate cultural_review_status
  if (frontmatter.cultural_review_status &&
      frontmatter.cultural_review_status !== 'pending' &&
      !VALID_CULTURAL_REVIEW.includes(frontmatter.cultural_review_status)) {
    warnings.push(`Unusual cultural_review_status: "${frontmatter.cultural_review_status}"`)
  }

  // Validate ALMA signals
  if (frontmatter.alma_signals) {
    for (const signal of ALMA_SIGNALS) {
      const value = frontmatter.alma_signals[signal]
      if (value !== null && value !== undefined) {
        if (typeof value !== 'number' || value < 1 || value > 5) {
          errors.push(`Invalid ALMA signal ${signal}: ${value} (must be 1-5)`)
        }
      }
    }

    // Check overall_score calculation
    const scores = ALMA_SIGNALS
      .map(s => frontmatter.alma_signals[s])
      .filter(v => typeof v === 'number')

    if (scores.length > 0) {
      const expectedAvg = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      const actual = frontmatter.alma_signals.overall_score
      if (actual && Math.abs(actual - expectedAvg) > 0.2) {
        warnings.push(`overall_score (${actual}) doesn't match calculated average (${expectedAvg})`)
      }
    }
  }

  // Validate vignette_number matches filename
  const numMatch = fileName.match(/^(\d+)-/)
  if (numMatch) {
    const fileNum = parseInt(numMatch[1])
    if (frontmatter.vignette_number !== fileNum) {
      warnings.push(`vignette_number (${frontmatter.vignette_number}) doesn't match filename (${fileNum})`)
    }
  }

  // Check EL linkage
  if (!frontmatter.empathy_ledger_id) {
    warnings.push('Not linked to Empathy Ledger (empathy_ledger_id is null)')
  }

  // Check media
  if (frontmatter.media) {
    if (frontmatter.media.descript_video_id && !frontmatter.media.descript_url) {
      warnings.push('Has descript_video_id but no descript_url')
    }
  }

  // Check project_slugs
  if (frontmatter.project_slugs && frontmatter.project_slugs.length === 0) {
    warnings.push('project_slugs is empty')
  }

  return { errors, warnings }
}

/**
 * Main validation function
 */
async function validateAllVignettes() {
  console.log('═'.repeat(60))
  console.log('VIGNETTE VALIDATION')
  console.log('═'.repeat(60))
  console.log('')

  const categories = ['platform-methodology', 'palm-island', 'justice-youth', 'oonchiumpa', 'system-outcomes']
  const results = {
    total: 0,
    valid: 0,
    errors: 0,
    warnings: 0,
    details: []
  }

  for (const category of categories) {
    const categoryPath = path.join(VIGNETTES_DIR, category)

    try {
      const files = await fs.readdir(categoryPath)

      for (const file of files) {
        if (!file.endsWith('.md')) continue

        const filePath = path.join(categoryPath, file)
        const content = await fs.readFile(filePath, 'utf-8')
        const frontmatter = parseFrontmatter(content)

        results.total++

        if (!frontmatter) {
          results.errors++
          results.details.push({
            file: `${category}/${file}`,
            errors: ['No valid YAML frontmatter found'],
            warnings: []
          })
          continue
        }

        const { errors, warnings } = validateVignette(filePath, frontmatter)

        if (errors.length > 0) {
          results.errors++
        } else if (warnings.length > 0) {
          results.warnings++
        } else {
          results.valid++
        }

        if (errors.length > 0 || warnings.length > 0) {
          results.details.push({
            file: `${category}/${file}`,
            errors,
            warnings
          })
        }
      }
    } catch (e) {
      // Category folder doesn't exist
    }
  }

  // Print results
  console.log(`Scanned ${results.total} vignettes\n`)

  for (const detail of results.details) {
    const hasErrors = detail.errors.length > 0
    const icon = hasErrors ? '❌' : '⚠️'
    console.log(`${icon} ${detail.file}`)

    for (const error of detail.errors) {
      console.log(`   ❌ ${error}`)
    }
    for (const warning of detail.warnings) {
      console.log(`   ⚠️  ${warning}`)
    }
    console.log('')
  }

  console.log('═'.repeat(60))
  console.log('SUMMARY')
  console.log('═'.repeat(60))
  console.log(`✅ Valid:     ${results.valid}`)
  console.log(`⚠️  Warnings:  ${results.warnings}`)
  console.log(`❌ Errors:    ${results.errors}`)
  console.log(`📊 Total:     ${results.total}`)
  console.log('')

  // Exit with error code if there are errors
  if (results.errors > 0) {
    process.exit(1)
  }
}

validateAllVignettes()
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
