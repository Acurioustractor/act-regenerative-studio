# Handover → Codex: Confessions to Philanthropy campaign (2026-05-30)

Continuing from a Claude Code session. Everything below is **live on production**
(`act-regenerative-studio.vercel.app`). `main` is at `b2c3245`. Pick up here for
further polish and the Monday QPW launch.

## TL;DR
The **Confessions to Philanthropy** campaign (gold-phone anonymous voicemail line for
Queensland Philanthropy Week) is now unified under `/confessions` with a persistent
nav, and **The Payout Wall** (the data-art piece) has been reworked. Four changes
shipped today, all on prod.

## What shipped today (all merged to main + deployed)
1. **PR #46** — Payout Wall openness data fix: `102 / 99.0%` → **`113 / 98.9%`**, named
   cells re-cut from the confirmed-grantmaker filter (was World Vision / universities;
   now Geoffrey Cumming / Yajilarra / BHP / Paul Ramsay / Rio Tinto / Besen).
2. **commit `16b70e5`** — Confessions: words-only messages (c01, c05) render as readable
   quotes, not fake audio players; c05 transcript extended to match its audio; the Friday
   tape renders `█` redaction bars.
3. **PR #47** — **IA reframe**: campaign unified under `/confessions` + persistent
   `CampaignNav` + first wall-canvas fix.
4. **PR #48** — **Payout Wall rework**: dark-wall-with-gold-crown visual, confessions
   play **over** the wall (the voice's words rise over the breathing data), legibility pass.

## Campaign IA (everything under /confessions)
| Route | What it is |
|---|---|
| `/confessions` | Home: the gold-phone call (catch-a-voice hero) + the voicemail inbox |
| `/confessions/wall` | The Payout Wall — data art + voices-over-the-wall |
| `/confessions/friday` | The Friday Tape — the week's cleared voices, "play the week back" |
| `/confessions/method` | How we know + right of reply |
| `/confessions/share/[variant]` | OG share cards (nav hides itself here) |

**308 redirects** (in `config/launch-redirects.cjs`): `/art/the-payout-wall` →
`/confessions/wall`, `/art/the-payout-wall/method` → `/confessions/method`.

## Key files
- **Pages:** `src/app/confessions/page.tsx` (home), `layout.tsx` (applies the nav),
  `wall/page.tsx`, `friday/page.tsx`, `method/page.tsx`.
- **Nav:** `src/components/confessions/CampaignNav.tsx` (in-flow at top, not sticky;
  hides on `/confessions/share`).
- **Components:** `PayoutWall.tsx` (canvas + voices-over-the-wall), `FridayTape.tsx`,
  `VoicemailInbox.tsx`, `CallCTA.tsx`, `transcript.tsx` (`renderTranscript` turns `█`
  runs into redaction bars).
- **Confession data:** `src/data/confessions-mock.ts` — `realConfessions` array,
  `IS_MOCK = false`. Cleared audio = `audioStatus: 'cleared'` + `audioSrc`; words-only =
  a `consentNote`. c02/c03/c04/c06 are audio; c01/c05 are words-only.
- **Wall data:** `public/confessions/payout-wall.json` — regenerate with
  `node scripts/build-payout-wall-data.mjs` (loads `.env.local`). Both the page
  (build-time import) and the canvas (runtime fetch) read it.
- **Audio:** `public/confessions/audio/c0{2,3,4,6}.mp3` (the 4 cleared voicemails).

## Run / verify
```bash
npm run dev            # port 3001
npx tsc --noEmit       # types
npm run build          # full build (runs EL/wiki/data syncs, then next build)
npm start              # prod server on :3001 (needed for check:launch)
npm run check:launch   # launch smoke: 120 routes, h1s, metadata, consent, sitemap
```
**Deploy is AUTOMATIC on push to `main`** (`.github/workflows/deploy.yml` → Vercel). PRs
run CI (Build / Lint & Type Check / Tests / Security). Watch a deploy:
`gh run watch <id> --exit-status`.

## Gotchas / rules (read before committing or shipping)
- **Deploy auto-ships from `main`.** Anything merged to `main` goes to prod. Work on a
  branch; merge only when verified.
- **Curated commits only.** `npm run build` dirties `src/data/*.generated.json` (sync
  artifacts). NEVER `git commit -am` or `git add -A` — `git add` only the files you
  changed, and `git show --stat HEAD` to confirm before pushing.
- **Raw recordings are gitignored.** `Confessions Recordings/` (`.gitignore:17`) holds
  raw Dialpad voicemails with caller PII + `MODERATION-LOG.md`. Transcribe **locally**
  (`whisper` is installed at `/opt/homebrew/bin/whisper`, models cached); never upload a
  caller's audio to a third-party service.
- **Consent-first (ACT core value).** A voicemail only gets audio (`audioStatus:
  'cleared'`) if the caller consented to VOICE playback AND it carries no identifying
  detail. c01/c05 chose words-only. One raw clip (a caller leaving their name + phone for
  the founders) is **withheld entirely** — not a confession, has PII.
- **No em-dashes** in any ACT-facing copy.
- **Payout Wall data caveats** (don't re-inflate the numbers): the hoard uses the
  `reportable_in_power_map = true` cut; "foundations" concentration excludes
  `capital_source_class = 'unknown'` (aid orgs / universities). Full provenance:
  `grantscope/output/foundation-power.provenance.md` + the `/confessions/method` page.

## Open / candidate next steps
- Ben flagged he may want to tune: the hero copy on `/confessions/wall`, the receipt-card
  readability, and the other campaign pages (friday / method) polish.
- `CampaignNav` is in-flow (not sticky) — could be made sticky if wanted.
- **QPW launch is Mon 1 – Fri 5 June 2026.** The Friday Tape playback lands Fri 5 June.
- **Newsletter #1 is held** for the Monday QPW moment — it's a **manual GHL broadcast** to
  the "Newsletter" tag (no API send). Copy in `docs/strategy/confessions-launch-comms.md`.
- The gold-phone line `+61 (0) 2 8503 4273` is **confirmed answering** (2026-05-30).

## PR / commit trail (today)
`#46` openness data · `16b70e5` words-as-quotes · `#47` IA reframe (`96f8f1d`) ·
`#48` wall rework (`b2c3245`).
