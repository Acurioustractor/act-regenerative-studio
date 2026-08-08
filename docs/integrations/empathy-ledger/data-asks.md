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

---

# Added 2026-08-08, after a day inside the data

Everything above still holds. What follows was found while restoring 107 dead
photographs, and it changes the priority order: **the consent asks now outrank
the dates.** Each figure below was measured directly against the Empathy Ledger
database on 2026-08-08, not inferred.

## 6. Elder review is recorded nowhere, on material that plainly needs it

`syndication_consent` holds 40 rows for the `act-regenerative-studio` site: 37
approved, 38 article-scoped, and every live article covered. That part is in
good order and better than the wiki suggests.

But across all 40 rows, `requires_elder_approval` is false, `elder_approved` is
false, and `cultural_permission_level` is null. Meanwhile **14 of the live
articles use the words Elder, Country, Traditional Owner, custodian, ceremony or
sorry business**, with titles including "walking with Elders on Kalkadoon
Country" and "a day on Quandamooka Country".

The schema has the columns. Nothing populates them, and `/admin/elder-review`
reviews photographs rather than articles, so there is no path to set them.

**What we need:** a way to flag an article as requiring elder review, and to
record who gave it and when. The org-level approval pattern already treats a
Traditional Owner's approval as satisfying elder review; the article-level
fields should be able to record the same thing.

## 7. The wiki and the database disagree about public-web permission

The org-level story approvals in `act-global-infrastructure/wiki/decisions/`
each name public-internet publication under "What is NOT approved". The database
says the opposite: approved, unrevoked consent rows exist for this site,
including for the story those records name by title.

Two systems holding the same decision in different words produced a false alarm
on 2026-08-08, and would have produced a wrong takedown had it been acted on.

**What we need:** the decision records to defer to `syndication_consent` rather
than restate it. Empathy Ledger is the system of record; the wiki should point
at it.

## 8. The media gate fails open

`resolveAssetUrl` ends `return gated ?? url`. A storage path absent from the map,
because the lookup errored or the asset is not registered, ships the raw
public-storage URL. That is the ungated form the gate exists to stop emitting.

For a consent gate, failing closed is the safer default: withholding a
photograph is recoverable, shipping an unrevocable one is not.

**What we need:** a decision on the default, applied to both content-hub routes
together.

## 9. Captions, restated at the real scale

The 123 figure above counts article media. The wider project library is larger
and in worse shape: **2,164 images, 118 with a caption, 0 with a credit**, 75
with named people, 447 with a description that is not a filename.

This is why the site publishes none of it. It is not a design backlog; it is the
reason a photographic surface cannot honestly exist yet.

## Revised: if only one thing gets done

Not the dates any more. **Elder review**, because it is the only item on this
list where being wrong harms somebody rather than merely reading poorly. The
dates remain the best thing to do second.
