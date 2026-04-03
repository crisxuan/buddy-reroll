#!/usr/bin/env node
// buddy-reroll.js
// Claude Code Buddy reroll script

const crypto = require('crypto')

// --- Constants (must match Claude Code source) ---
const SALT = 'friend-2026-401'
const SPECIES = ['duck', 'goose', 'blob', 'cat', 'dragon', 'octopus', 'owl', 'penguin', 'turtle', 'snail', 'ghost', 'axolotl', 'capybara', 'cactus', 'robot', 'rabbit', 'mushroom', 'chonk']
const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary']
const RARITY_WEIGHTS = { common: 60, uncommon: 25, rare: 10, epic: 4, legendary: 1 }
const RARITY_RANK = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 }
const EYES = ['·', '✦', '×', '◉', '@', '°']
const HATS = ['none', 'crown', 'tophat', 'propeller', 'halo', 'wizard', 'beanie', 'tinyduck']
const STAT_NAMES = ['DEBUGGING', 'PATIENCE', 'CHAOS', 'WISDOM', 'SNARK']
const RARITY_FLOOR = { common: 5, uncommon: 15, rare: 25, epic: 35, legendary: 50 }
const RARITY_STARS = { common: '★', uncommon: '★★', rare: '★★★', epic: '★★★★', legendary: '★★★★★' }
const DEFAULT_MAX = 50_000_000
const DEFAULT_COUNT = 5
const DEFAULT_MIN_STATS = 90
const UID_RE = /^[a-f0-9]{64}$/i

// --- Hash function (FNV-1a) ---
function hash(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// --- PRNG (Mulberry32 — same as Claude Code) ---
function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)]
}

function rollRarity(rng) {
  let roll = rng() * 100
  for (const r of RARITIES) {
    roll -= RARITY_WEIGHTS[r]
    if (roll < 0) return r
  }
  return 'common'
}

function rollStats(rng, rarity) {
  const floor = RARITY_FLOOR[rarity]
  const peak = pick(rng, STAT_NAMES)
  let dump = pick(rng, STAT_NAMES)
  while (dump === peak) dump = pick(rng, STAT_NAMES)
  const stats = {}
  for (const name of STAT_NAMES) {
    if (name === peak) {
      stats[name] = Math.min(100, floor + 50 + Math.floor(rng() * 30))
    } else if (name === dump) {
      stats[name] = Math.max(1, floor - 10 + Math.floor(rng() * 15))
    } else {
      stats[name] = floor + Math.floor(rng() * 40)
    }
  }
  return stats
}

function rollFull(uid) {
  const rng = mulberry32(hash(uid + SALT))
  const rarity = rollRarity(rng)
  const species = pick(rng, SPECIES)
  const eye = pick(rng, EYES)
  const hat = rarity === 'common' ? 'none' : pick(rng, HATS)
  const shiny = rng() < 0.01
  const stats = rollStats(rng, rarity)
  return { uid, rarity, species, eye, hat, shiny, stats }
}

function usage() {
  return `Usage: node buddy-reroll.js [options]

Options:
  --species <name>       ${SPECIES.join(', ')}
  --rarity <name>        ${RARITIES.join(', ')}
  --eye <char>           ${EYES.join(' ')}
  --hat <name>           ${HATS.join(', ')}
  --shiny                Require shiny
  --min-stats [value]    Require ALL stats >= value (default: ${DEFAULT_MIN_STATS})
  --max <number>         Max iterations (default: ${DEFAULT_MAX})
  --count <number>       Results to find (default: ${DEFAULT_COUNT})
  --check <uid>          Check what buddy a specific userID produces
  --json                 Emit machine-readable JSON
  --help, -h             Show this help`
}

function fail(message) {
  console.error(message)
  process.exit(1)
}

function parsePositiveInteger(flag, raw) {
  if (raw === undefined) fail(`Missing value for ${flag}`)
  if (!/^\d+$/.test(raw)) fail(`Invalid value for ${flag}: ${raw}. Expected a positive integer.`)
  const value = Number(raw)
  if (!Number.isSafeInteger(value) || value <= 0) {
    fail(`Invalid value for ${flag}: ${raw}. Expected a positive integer.`)
  }
  return value
}

function validateUid(uid) {
  if (!UID_RE.test(uid)) {
    fail(`Invalid uid: ${uid}. Expected a 64-character hexadecimal string.`)
  }
  return uid.toLowerCase()
}

function formatBuddySummary(r) {
  return `[#${r.rarity} ${RARITY_STARS[r.rarity]}] ${r.species} eye=${r.eye} hat=${r.hat} shiny=${r.shiny}`
}

function printBuddyText(r, includeUid = true) {
  if (includeUid) console.log(`  UID     : ${r.uid}`)
  console.log(`  Species : ${r.species}`)
  console.log(`  Rarity  : ${r.rarity} ${RARITY_STARS[r.rarity]}`)
  console.log(`  Eye     : ${r.eye}`)
  console.log(`  Hat     : ${r.hat}`)
  console.log(`  Shiny   : ${r.shiny}`)
  console.log('  Stats   :')
  for (const name of STAT_NAMES) {
    const val = r.stats[name]
    const filled = Math.floor(val / 5)
    const bar = '█'.repeat(filled) + '░'.repeat(20 - filled)
    console.log(`    ${name.padEnd(10)} ${bar} ${val}`)
  }
}

function printSearchHit(index, r) {
  console.log(`#${index} [${r.rarity} ${RARITY_STARS[r.rarity]}] ${r.species} eye=${r.eye} hat=${r.hat} shiny=${r.shiny}`)
  console.log(`   stats: ${STAT_NAMES.map((name) => `${name}:${r.stats[name]}`).join(' ')}`)
  console.log(`   uid:   ${r.uid}`)
  console.log('')
}

// --- Parse CLI args ---
function parseArgs() {
  const args = process.argv.slice(2)
  const opts = { max: DEFAULT_MAX, count: DEFAULT_COUNT, json: false }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    switch (arg) {
      case '--species':
        opts.species = args[++i]
        break
      case '--rarity':
        opts.rarity = args[++i]
        break
      case '--eye':
        opts.eye = args[++i]
        break
      case '--hat':
        opts.hat = args[++i]
        break
      case '--shiny':
        opts.shiny = true
        break
      case '--min-stats': {
        const next = args[i + 1]
        opts.minStatsVal = next && !next.startsWith('--')
          ? parsePositiveInteger('--min-stats', args[++i])
          : DEFAULT_MIN_STATS
        break
      }
      case '--max':
        opts.max = parsePositiveInteger('--max', args[++i])
        break
      case '--count':
        opts.count = parsePositiveInteger('--count', args[++i])
        break
      case '--check':
        opts.check = validateUid(args[++i])
        break
      case '--json':
        opts.json = true
        break
      case '--help':
      case '-h':
        console.log(usage())
        process.exit(0)
      default:
        fail(`Unknown argument: ${arg}\n\n${usage()}`)
    }
  }

  if (opts.species && !SPECIES.includes(opts.species)) {
    fail(`Unknown species: ${opts.species}\nAvailable: ${SPECIES.join(', ')}`)
  }
  if (opts.rarity && !RARITIES.includes(opts.rarity)) {
    fail(`Unknown rarity: ${opts.rarity}\nAvailable: ${RARITIES.join(', ')}`)
  }
  if (opts.eye && !EYES.includes(opts.eye)) {
    fail(`Unknown eye: ${opts.eye}\nAvailable: ${EYES.join(' ')}`)
  }
  if (opts.hat && !HATS.includes(opts.hat)) {
    fail(`Unknown hat: ${opts.hat}\nAvailable: ${HATS.join(', ')}`)
  }
  if (opts.minStatsVal && opts.minStatsVal > 100) {
    fail(`Invalid value for --min-stats: ${opts.minStatsVal}. Expected an integer between 1 and 100.`)
  }

  return opts
}

const opts = parseArgs()

// --- Check mode ---
if (opts.check) {
  const buddy = rollFull(opts.check)
  if (opts.json) {
    console.log(JSON.stringify({ mode: 'check', buddy }, null, 2))
  } else {
    printBuddyText(buddy)
  }
  process.exit(0)
}

const filters = []
if (opts.species) filters.push(`species=${opts.species}`)
if (opts.rarity) filters.push(`rarity>=${opts.rarity}`)
if (opts.eye) filters.push(`eye=${opts.eye}`)
if (opts.hat) filters.push(`hat=${opts.hat}`)
if (opts.shiny) filters.push('shiny=true')
if (opts.minStatsVal) filters.push(`all stats>=${opts.minStatsVal}`)

const minRarityRank = opts.rarity ? RARITY_RANK[opts.rarity] : 0
const results = []
const startTime = Date.now()

if (!opts.json) {
  console.log(`Searching: ${filters.join(', ') || 'any'} (max ${opts.max.toLocaleString()}, find ${opts.count})`)
  console.log('')
}

for (let i = 0; i < opts.max; i++) {
  const uid = crypto.randomBytes(32).toString('hex')
  const buddy = rollFull(uid)

  if (opts.rarity && RARITY_RANK[buddy.rarity] < minRarityRank) continue
  if (opts.species && buddy.species !== opts.species) continue
  if (opts.eye && buddy.eye !== opts.eye) continue
  if (opts.hat && buddy.hat !== opts.hat) continue
  if (opts.shiny && !buddy.shiny) continue
  if (opts.minStatsVal && !Object.values(buddy.stats).every((value) => value >= opts.minStatsVal)) continue

  results.push(buddy)
  if (!opts.json) {
    printSearchHit(results.length, buddy)
  }
  if (results.length >= opts.count) break
}

const elapsedSeconds = Number(((Date.now() - startTime) / 1000).toFixed(1))

if (opts.json) {
  console.log(JSON.stringify({
    mode: 'search',
    filters,
    max: opts.max,
    countRequested: opts.count,
    found: results.length,
    elapsedSeconds,
    results
  }, null, 2))
  process.exit(0)
}

if (results.length === 0) {
  console.log(`No match found in ${opts.max.toLocaleString()} iterations (${elapsedSeconds}s)`)
} else {
  console.log(`Found ${results.length} match(es) in ${elapsedSeconds}s`)
}
