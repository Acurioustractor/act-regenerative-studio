# What the site needs from Empathy Ledger

> Written 2026-08-07. Figures verified against
> `src/data/empathy-ledger-editorial.generated.json` on that date, not carried
> over from an earlier draft. Re-check them before sending if the sync has run
> since.

Five asks, and they are not equal. Two are holding the site back today. Three
are quality and can follow.

## The two that matter

### 1. Real publish dates

26 articles carry **5 distinct timestamps between them**. Eighteen share
`2026-01-09T23:40:59.476+00:00` to the millisecond, which is a migration
artifact rather than a publication date.

The site does not print them. Field pages render no dates at all, because
showing that timestamp would tell a reader something false about when the work
happened. A guard test in `field-graph.test.ts` flips when real dates arrive.

So the cost is not cosmetic. Twenty-six pieces of writing sit on the site with
nothing to say when they were made, and a reader cannot tell what is current.

**What we need:** the original publication date per article, or the best
available date with a note on what it represents.

### 2. One key for the corpus, not two

The sync writes with `editorialDestination: "act_el"`. The runtime reads
`/api/v2/sites/act-regenerative-studio/...`. Two identifiers for the same site.

We cannot tell from this side whether they resolve to the same set of articles.
If they ever diverge, the baked snapshot and the live read disagree and the site
serves whichever it happened to get, with nothing to signal that anything is
wrong. That is the kind of fault that stays quiet until someone notices an
article missing.

**What we need:** confirmation they select the same corpus, or one key that
both paths should use.

## The three that are quality

| | State | What it costs |
| --- | --- | --- |
| **Featured image alt text** | 0 of the 18 articles with a featured image carry alt text | The site strips Webflow filename junk and falls back to the article title. Anyone using a screen reader gets the headline read twice |
| **Media captions** | 0 of 123 media items carry a caption, and none carry alt text either | Photographs of people and places arrive with nothing said about them. Captions are where consent and context usually live |
| **Per-article bylines** | All 26 attribute to Benjamin Knight | Person-voiced pieces are told by the people in them. The byline should say so |

The bylines one matters more than its position here suggests. An article in
someone's own voice, credited to someone else, is the thing Empathy Ledger
exists to prevent.

## What we are not asking for

Not a schema change, and not a rebuild. Four of the five are fields that already
exist and are empty. The fifth is a question about which key is authoritative.

## If only one thing gets done

The dates. Everything else degrades gracefully, and a reader can live without a
caption. A body of work with no dates reads as abandoned, and the site currently
chooses silence over stating something untrue.
