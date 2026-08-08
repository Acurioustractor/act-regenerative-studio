# Elder review: what to ask, and who to ask it of

**Written 2026-08-08. This is preparation for conversations, not a decision.**

ACT is not a First Nations organisation and does not hold this authority. Nothing
in here decides anything. It exists so that when the conversations happen, they
happen on accurate facts rather than on what anyone assumed was true.

Every figure below was measured against the Empathy Ledger database on
2026-08-08.

---

## Where things actually stand

Better than it first looked, and worse in one specific way.

**The consent record exists and is in order.** `syndication_consent` holds 40
rows for the `act-regenerative-studio` site: 37 approved, 38 article-scoped,
and every live article covered by an approved, unrevoked row. Nobody published
anything without a record.

**A first pass got this wrong**, and the mistake is worth knowing because it
will recur. The org-level story approvals in
`act-global-infrastructure/wiki/decisions/` each name public-internet
publication under "What is NOT approved". Read alone, that says the site is in
breach. The database says the opposite. Empathy Ledger is the system of record;
the wiki records are older and were never updated. **Read the database first.**

**What is genuinely missing is elder review.** Across all 40 consent rows:

| field | value on every row |
| --- | --- |
| `requires_elder_approval` | false |
| `elder_approved` | false |
| `elder_approved_by` | null |
| `cultural_permission_level` | null |

The columns exist. Nothing has ever filled them. And `/admin/elder-review`
reviews photographs, not articles, so there is currently no path to fill them
even if someone wanted to.

---

## The twelve live articles that carry culturally weighted material

Grouped by the community the work sits with, because that is who the question
belongs to. Counts are mentions in the article body.

### Palm Island — Bwgcolman
- **At the Speed of Ceremony: Learning Partnership on Palm Island**
  5 mentions of Elders, references ceremony. The most heavily weighted piece on
  the site.

### Quandamooka
- **Between Waters and Worlds: A Day on Quandamooka Country**
  7 mentions of Country, 2 of Elders, references ceremony.

### Kalkadoon — Mount Isa
- **Seeds of Change: Walking with Elders and Youth on Kalkadoon Country**
  14 mentions of Country, names Traditional Owners, references ceremony. Elders
  are in the title.

### Warumungu — Tennant Creek
- **Wilya Janta: A Paradigm Shift in Housing for Remote Aboriginal Communities**
- **NAIDOC with Jimmy** — names a Traditional Owner
  Jimmy Frank Jupurrurla leads this work and holds cultural authority for the
  Country it is from.

### Arrernte — Mparntwe
- **Oonchiumpa: What Happens When Community Leads**
  Named at line 37 of the Oonchiumpa approval as one of the six stories it
  covers. Kristy Bloomfield (Central Arrernte, Eastern Arrernte, Alyawarra
  Traditional Owner of Mparntwe) and Tanya Turner are the co-directors who gave
  the original verbal approval.

### Not tied to one community
- The Spirit Must Be Strong
- History's Wounds and Tomorrow's Possibilities
- The Kids Are Not Alright
- JusticeHub: A Platform for Community-Led Justice Solutions
- The Power of Indigenous Storytelling
- Life is hard, but it's not

Two further weighted articles, *From Bolivia to Brisbane* and *Edition #1*, are
already withheld by ACT's own withdrawal tombstone and are not public.

---

## The questions worth bringing

Phrased so they can be answered, and so that "no" and "not yet" are as easy to
say as "yes". The existing approval pattern is verbal consent in conversation
with community leaders, witnessed and written down promptly. That pattern
already works; these are the questions it has not yet been asked.

**1. Is the public website in scope?**
The approvals name the wiki, the campaign work, the Minderoo envelope and Judges
on Country. They do not name a public website. The database says yes; the wiki
says no. Which was meant?

**2. Does this piece need elder review, and has it had one?**
Per article, for the twelve above. The system can record who gave it and when.
It currently records nothing.

**3. Where a leader holds Traditional Owner authority for the Country a story
comes from, does their approval satisfy elder review?**
The Oonchiumpa record already sets this precedent for Kristy Bloomfield. It
would be worth knowing whether it holds for Jimmy Frank Jupurrurla and for the
Palm Island and Kalkadoon work, or whether those need a separate review.

**4. Is there anything here that should come down now?**
Not as a hypothetical. Twelve specific pieces, listed above, are public today.

**5. What should happen with the photographs?**
2,164 images sit in the project library. 118 have a caption. None has a credit.
75 have named people. None of it is published, and it will not be until this is
answered, but the question of what those photographs are for is worth asking
alongside the writing.

---

## What each answer unblocks

- **Yes, in scope, elder review given** → record it in `syndication_consent`
  (`elder_approved`, `elder_approved_by`, `elder_approved_at`), and the record
  finally matches the practice.
- **Yes, but this piece needs review first** → set `requires_elder_approval` and
  withhold that slug via `config/withdrawn-editorial.json` until it clears. The
  withdrawal path is already built, already enforced at both the sync and the
  serving layer, and takes effect on the next sync.
- **No, or not yet** → same mechanism, and nothing is lost. Withheld articles are
  never deleted, only made non-public.
- **No answer yet** → the honest position is that the pieces stay up under the
  consent that does exist, and this document records what is still unasked.

---

## What ACT should fix regardless of the answers

Three things that are ours, not the Elders':

1. **There is no way to record an article-level elder review.** The columns
   exist; the admin surface reviews photographs instead. Until that is built,
   even a clear "yes" cannot be written down.
2. **The wiki records contradict the database.** They should point at
   `syndication_consent` rather than restate it. The contradiction already
   produced one false alarm.
3. **The media gate fails open.** An asset missing from the gate map ships a raw,
   unrevocable URL. Failing closed is the safer default for consent-bearing
   media.

---

*Related: `data-asks.md` in this directory, and the Oonchiumpa approval at*
*`act-global-infrastructure/wiki/decisions/2026-04-18-oonchiumpa-story-approval.md`,*
*which sets the verbal-consent governance pattern this builds on.*
