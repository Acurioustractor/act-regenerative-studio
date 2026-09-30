import type { ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { ArticleBody, BodyHeading, Divider, Figure, Paragraph, PullQuote } from "@/components/pieces/ArticleBody";
import { PieceLink } from "@/components/pieces/PieceLink";
import type { Block, Inline } from "./article-blocks";
import styles from "./article.module.css";

/**
 * The words of an article, drawn with the ArticleBody pieces (Pencil: Body, page items D and E, and the article page
 * nq1e6). Empathy Ledger's body arrives as HTML and is read into blocks by article-blocks.ts; each block goes to the
 * piece that owns it. What the reader cannot draw as a piece (a list, an embedded video) is drawn here in the same
 * column. A few articles arrive as Markdown and take the same pieces through the second half of this file.
 */

function renderInline(inline: Inline[]): ReactNode[] {
  return inline.map((part, index) => {
    if (typeof part === "string") return part;
    if (part.tag === "br") return <br key={index} />;
    if (part.tag === "a") {
      return (
        <PieceLink
          key={index}
          href={part.href}
          {...(part.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {renderInline(part.children)}
        </PieceLink>
      );
    }
    const Tag = part.tag;
    return <Tag key={index}>{renderInline(part.children)}</Tag>;
  });
}

export function BodyList({ ordered = false, children }: { ordered?: boolean; children: ReactNode }) {
  const Tag = ordered ? "ol" : "ul";
  return <Tag className={styles.list}>{children}</Tag>;
}

/**
 * A film or an audio player inside the story, at 16 by 9. Where the ledger sized it (a Descript embed is 640 wide) it
 * keeps that width, centred in the words' column; without a size it takes the wide column like a photograph.
 */
function Embed({ maxWidth, children }: { maxWidth?: number; children: ReactNode }) {
  return (
    <figure
      {...(maxWidth ? { style: { maxWidth } } : { "data-lane": "wide" })}
      className={maxWidth ? `${styles.embed} ${styles.sized}` : styles.embed}
    >
      {children}
    </figure>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "paragraph":
      return <Paragraph>{renderInline(block.inline)}</Paragraph>;
    case "heading":
      return <BodyHeading level={block.level}>{renderInline(block.inline)}</BodyHeading>;
    case "list":
      return (
        <BodyList ordered={block.ordered}>
          {block.items.map((item, index) => (
            <li key={index}>{renderInline(item)}</li>
          ))}
        </BodyList>
      );
    case "figure":
      return <Figure src={block.src} alt={block.alt} caption={block.caption} />;
    case "quote":
      // Word for word from the piece. It is not attributed: the feed does not say whose words a block quote holds.
      return <PullQuote quote={block.text} />;
    case "divider":
      return <Divider />;
    case "embed":
      return (
        <Embed maxWidth={block.maxWidth}>
          <div className={styles.frame}>
            <iframe src={block.src} title={block.title || "Embedded media"} loading="lazy" allowFullScreen />
          </div>
        </Embed>
      );
    case "video":
      return (
        <Embed maxWidth={block.maxWidth}>
          <div className={styles.frame}>
            <video src={block.src} poster={block.poster} controls preload="metadata" playsInline />
          </div>
        </Embed>
      );
  }
}

export function ArticleContent({ blocks }: { blocks: Block[] }) {
  return (
    <ArticleBody>
      {blocks.map((block, index) => (
        <BlockView key={index} block={block} />
      ))}
    </ArticleBody>
  );
}

/* Markdown ---------------------------------------------------------------------------------------------------- */

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) return textOf((node.props as { children?: ReactNode }).children);
  return "";
}

const markdownPieces: Components = {
  p: ({ node, children }) => {
    const only = node?.children.length === 1 ? node.children[0] : null;
    // A picture on its own line is a figure, and a figure cannot sit inside a paragraph.
    if (only && only.type === "element" && only.tagName === "img") return <>{children}</>;
    return <Paragraph>{children}</Paragraph>;
  },
  h1: ({ children }) => <BodyHeading>{children}</BodyHeading>,
  h2: ({ children }) => <BodyHeading>{children}</BodyHeading>,
  h3: ({ children }) => <BodyHeading level={3}>{children}</BodyHeading>,
  h4: ({ children }) => <BodyHeading level={3}>{children}</BodyHeading>,
  h5: ({ children }) => <BodyHeading level={3}>{children}</BodyHeading>,
  h6: ({ children }) => <BodyHeading level={3}>{children}</BodyHeading>,
  hr: () => <Divider />,
  blockquote: ({ children }) => <PullQuote quote={textOf(children).replace(/\s+/g, " ").trim()} />,
  ul: ({ children }) => <BodyList>{children}</BodyList>,
  ol: ({ children }) => <BodyList ordered>{children}</BodyList>,
  img: ({ src, alt }) =>
    typeof src === "string" && /^(https:\/\/|\/)/.test(src) ? <Figure src={src} alt={alt ?? ""} /> : null,
};

export function MarkdownContent({ markdown }: { markdown: string }) {
  return (
    <ArticleBody>
      <ReactMarkdown components={markdownPieces}>{markdown}</ReactMarkdown>
    </ArticleBody>
  );
}
