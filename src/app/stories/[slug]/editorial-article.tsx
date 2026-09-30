import type { Metadata } from "next";
import { ArticleBody, Paragraph } from "@/components/pieces/ArticleBody";
import { ArticleOpening } from "@/components/pieces/ArticleOpening";
import openingStyles from "@/components/pieces/article-opening.module.css";
import { Byline } from "@/components/pieces/Byline";
import { CallToAction } from "@/components/pieces/CallToAction";
import { FourWaysOn } from "@/components/pieces/FourWaysOn";
import { Onward } from "@/components/pieces/Onward";
import { Page } from "@/components/pieces/Page";
import { PartOf } from "@/components/pieces/PartOf";
import { ReadingTractor } from "@/components/pieces/ReadingTractor";
import { fieldHref, fieldsById } from "@/content";
import { JsonLd } from "@/components/seo/JsonLd";
import type { EditorialArticle } from "@/lib/empathy-ledger-editorial";
import {
  captionFigures,
  cleanAltText,
  htmlContainsMedia,
  prepareArticleHtml,
  readingTimeMinutes,
} from "@/lib/editorial/article-html";
import { formatArticleType } from "@/lib/editorial/article-type";
import { fieldsForArticle, projectSlugDestination } from "@/lib/fields/field-graph";
import { articleJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo/site";
import { waysOn } from "@/lib/ways-on";
import { GROUP_NAMES, groupsFor } from "../stories-model";
import { articleBlocks } from "./article-blocks";
import { photoShapesIn } from "@/lib/media/photo-shape";
import { ArticleContent, MarkdownContent } from "./ArticleContent";
import { FieldPhotographs, HideBrokenFigures, OpeningGuard } from "./guards";
import styles from "./article.module.css";

/**
 * The editorial article reader, served at /stories/[slug] since the route unification (2026-08-07; previously
 * /blog/[slug]). The page decides whether a slug is a withdrawn story, an authored story packet or an editorial
 * article; this component only ever renders the article branch. Rebuilt on Brand v1 (Pencil: Page 10 · Article,
 * nq1e6; phone iAFgB). The article, its photographs, its captions and its byline are what Empathy Ledger's consent-
 * enforced feed gave the page, unchanged.
 */

export function editorialArticleMetadata(post: EditorialArticle): Metadata {
  return pageMetadata({
    title: post.title,
    description: post.excerpt || "ACT writing carried with consent through Empathy Ledger.",
    path: `/stories/${post.slug}`,
    type: "article",
    // These articles are syndicated from Empathy Ledger, which holds the master
    // copy. Point the canonical at the source so search engines attribute it
    // there instead of treating /stories as duplicate content.
    canonicalUrl: post.canonicalUrl,
    image: post.featuredImageUrl
      ? {
          url: post.featuredImageUrl,
          alt: post.featuredImageAlt || post.title,
        }
      : undefined,
  });
}

function shortLede(raw: string | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  // Keep the first sentence, cap at roughly 180 chars so the opening stays tight.
  const firstSentence = trimmed.split(/(?<=[.!?])\s/)[0] || trimmed;
  if (firstSentence.length <= 200) return firstSentence;
  return firstSentence.slice(0, 180).replace(/[,\s]+\S*$/, "") + "…";
}

/*
 * No date is rendered, deliberately, and the reason is the same one recorded in
 * FieldWriting: `publishedAt` in the editorial feed is a migration artifact
 * rather than an editorial date. Twenty-one of the articles share one timestamp
 * to the millisecond (2026-01-09T23:40:59.476Z) and five more share another
 * (2026-03-25T22:45:19.558574Z); createdAt and updatedAt each hold a single
 * value across the whole corpus.
 *
 * Until 2026-08-07 this reader printed that timestamp as "January 2026" under
 * five unrelated headlines. The field pages had already stopped doing so. A
 * date is a claim about when something happened, and this one is a claim about
 * when a database row was written. The Brand v1 opening has no date either.
 *
 * Restore the label here, and in FieldWriting, once the feed carries real ones.
 */

/** The opening of an article whose photograph is absent, or never arrives: the same words, without the picture. */
function OpeningWithoutPhotograph({
  kicker,
  title,
  subtitle,
  meta,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  meta?: string;
}) {
  return (
    <div className={openingStyles.opening}>
      <div className={openingStyles.text}>
        {kicker && <p className={openingStyles.kicker}>{kicker}</p>}
        <h1 className={openingStyles.title}>{title}</h1>
        {subtitle && <p className={openingStyles.subtitle}>{subtitle}</p>}
        {meta && <p className={openingStyles.meta}>{meta}</p>}
      </div>
    </div>
  );
}

export async function EditorialArticleReader({ post }: { post: EditorialArticle }) {
  const content = post.content || "";
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(content);
  const preparedHtml = looksLikeHtml
    ? captionFigures(prepareArticleHtml(content), post.media?.photoPreviews || [])
    : null;
  const readingMinutes = readingTimeMinutes(content);
  const blocks = preparedHtml ? articleBlocks(preparedHtml) : [];
  // Each gated photograph's true proportions, read from a small copy through the gate and kept for a week (main's
  // photo-shape), so its figure holds its place and shows it whole.
  const shapes = preparedHtml ? await photoShapesIn(preparedHtml) : undefined;
  const subtitle = post.subtitle || shortLede(post.excerpt) || undefined;

  // Every field the article belongs to, not just the ones its project slugs imply: fieldsForArticle also picks up
  // the curated assignments, so a piece tagged justicehub upstream and art by hand shows both. A project that is land
  // rather than a field (Black Cockatoo Valley, the farm) keeps the link the old page gave it, to /about#history.
  const fields = fieldsForArticle(post);
  const partOf = [
    ...fields.map((id) => ({ key: id, name: fieldsById[id].name, href: fieldHref(id) })),
    ...post.relatedProjectSlugs
      .map(projectSlugDestination)
      .filter((destination): destination is { href: string; label: string } => Boolean(destination))
      .filter((destination) => destination.href.startsWith("/about"))
      .map((destination) => ({ key: destination.href, name: destination.label, href: destination.href })),
  ].filter((item, index, all) => all.findIndex((other) => other.href === item.href) === index);
  // A story Empathy Ledger files across ACT (primary project act-main, or none) and no field claims is part of A
  // Curious Tractor as a whole: the essays field-assignments.ts leaves deliberately unassigned (Ben, 1 Oct 2026).
  if (partOf.length === 0 && (!post.primaryProject || post.primaryProject === "act-main")) {
    partOf.push({ key: "act", name: "A Curious Tractor", href: "/about" });
  }

  const groups = groupsFor(post);
  const kicker = [
    formatArticleType(post.articleType),
    groups.length === 1 ? GROUP_NAMES[groups[0]] : "Across ACT",
  ]
    .filter(Boolean)
    .join(" · ");
  const meta = [post.authorName, readingMinutes ? `${readingMinutes} min read` : undefined].filter(Boolean).join(" · ");

  // Field photographs = everything from EL media except the featured image (which already runs at the top) and
  // duplicates. The alt text and caption are the ledger's own, or none: cleanAltText decides whether the alt is a real
  // description, and a photograph the reader has already met in the prose does not run again at the foot.
  const gallery = (post.media?.photoPreviews || [])
    .filter((photo) => !!photo.url && photo.url !== post.featuredImageUrl)
    .filter((photo) => !(preparedHtml && htmlContainsMedia(preparedHtml, photo.url)))
    .slice(0, 8)
    .map((photo) => ({
      url: photo.url,
      alt: cleanAltText(photo.alt ?? photo.alt_text ?? photo.title),
      caption: photo.caption ?? null,
    }));

  const photo = post.featuredImageUrl
    ? { src: post.featuredImageUrl, alt: cleanAltText(post.featuredImageAlt) }
    : null;
  const without = <OpeningWithoutPhotograph kicker={kicker} title={post.title} subtitle={subtitle} meta={meta} />;

  const ways = waysOn(fields, { article: post.slug });
  const actions = [
    ...(post.canonicalUrl ? [{ label: "Open source record", href: post.canonicalUrl }] : []),
    { label: "Read stories", href: "/stories" },
    { label: "Start a conversation", href: "/contact" },
  ];

  return (
    <Page door="Stories">
      <JsonLd
        id={`editorial-${post.slug}-article-jsonld`}
        data={articleJsonLd({
          title: post.title,
          description: post.excerpt || "ACT writing carried with consent through Empathy Ledger.",
          path: `/stories/${post.slug}`,
          image: post.featuredImageUrl,
          authorName: post.authorName,
          publishedAt: post.publishedAt,
        })}
      />
      <JsonLd
        id={`editorial-${post.slug}-breadcrumb-jsonld`}
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Stories", path: "/stories" },
          { name: post.title, path: `/stories/${post.slug}` },
        ])}
      />
      <ReadingTractor target="story" />

      <article id="story">
        {photo ? (
          <OpeningGuard fallback={without}>
            <ArticleOpening
              photo={photo}
              kicker={kicker}
              title={post.title}
              subtitle={subtitle}
              author={post.authorName || undefined}
              readingMinutes={readingMinutes ?? undefined}
            />
          </OpeningGuard>
        ) : (
          without
        )}

        <div className={styles.trail}>
          <div>
            <Onward href="/stories" tone="fg" back>
              All stories
            </Onward>
          </div>
          {partOf.length > 0 && (
            <div className={styles.partOf} role="group" aria-labelledby="part-of-label">
              <span id="part-of-label" className={styles.partOfLabel}>
                Part of
              </span>
              {partOf.map((item) => (
                <PartOf key={item.key} name={item.name} href={item.href} bare />
              ))}
            </div>
          )}
        </div>

        <HideBrokenFigures className={styles.content}>
          {blocks.length > 0 ? (
            <ArticleContent blocks={blocks} shapes={shapes} />
          ) : content && !looksLikeHtml ? (
            <MarkdownContent markdown={content} />
          ) : (
            <ArticleBody>
              <Paragraph>
                This story has no public body yet. Its media, project links, and source record remain connected through
                Empathy Ledger.
              </Paragraph>
            </ArticleBody>
          )}
        </HideBrokenFigures>

        <FieldPhotographs photos={gallery} />

        {post.authorName && (
          <div className={styles.bylineRow}>
            <Byline name={post.authorName} fields={partOf.length > 0 ? partOf.map((item) => item.name) : undefined} />
          </div>
        )}
      </article>

      <CallToAction
        heading="This story lives in the Empathy Ledger, carried with consent. Keep reading, or get in touch."
        actions={actions}
      />

      <FourWaysOn {...ways} />
    </Page>
  );
}
