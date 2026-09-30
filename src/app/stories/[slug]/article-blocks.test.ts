import { describe, expect, it } from "vitest";
import { getBakedEditorialSnapshot } from "@/lib/empathy-ledger-editorial";
import { captionFigures, prepareArticleHtml } from "@/lib/editorial/article-html";
import { articleBlocks, decodeEntities, parseHtml, plainText, type Block, type Inline } from "./article-blocks";

const words = (text: string) => text.split(/\s+/).filter(Boolean).length;

function inlineText(inline: Inline[]): string {
  return inline.map((part) => (typeof part === "string" ? part : inlineText(part.children))).join("");
}

function blockWords(blocks: Block[]): number {
  let total = 0;
  for (const block of blocks) {
    if (block.kind === "paragraph" || block.kind === "heading") total += words(inlineText(block.inline));
    if (block.kind === "list") total += block.items.reduce((sum, item) => sum + words(inlineText(item)), 0);
    if (block.kind === "quote") total += words(block.text);
    if (block.kind === "figure" && block.caption) total += words(block.caption);
  }
  return total;
}

describe("article body blocks", () => {
  it("reads each block type the old reader supported", () => {
    const blocks = articleBlocks(
      [
        "<h1>One</h1><h3>Two</h3><h4>Three</h4>",
        '<p>A <strong>bold</strong> and <em>slanted</em> line with a <a href="https://example.org/x" target="_blank">link</a>.</p>',
        "<blockquote><p>First.</p><p>Second.</p></blockquote>",
        "<hr>",
        "<ul><li>a</li><li>b</li></ul><ol><li>c</li></ol>",
        '<figure class="w-richtext-align-fullwidth"><div><img src="https://example.org/a.jpg" alt="A road"></div><figcaption>The road</figcaption></figure>',
        '<div data-rt-embed-type="true"><div><div><iframe src="https://share.descript.com/embed/x" allowfullscreen></iframe></div></div></div>',
      ].join(""),
    );
    expect(blocks.map((b) => b.kind)).toEqual([
      "heading", "heading", "heading", "paragraph", "quote", "divider", "list", "list", "figure", "embed",
    ]);
    expect(blocks.filter((b) => b.kind === "heading").map((b) => (b as { level: number }).level)).toEqual([2, 3, 3]);
    expect(blocks[4]).toEqual({ kind: "quote", text: "First. Second." });
    expect(blocks[8]).toEqual({ kind: "figure", src: "https://example.org/a.jpg", alt: "A road", caption: "The road" });
    expect(blocks[9]).toEqual({ kind: "embed", src: "https://share.descript.com/embed/x" });
  });

  it("keeps the width the ledger gave an embed", () => {
    expect(
      articleBlocks(
        '<div data-rt-embed-type="true"><div style="display: flex; justify-content: center;"><div style="max-width: 640px; width: 100%;"><div style="position: relative; padding-bottom: 56.25%;"><iframe src="https://share.descript.com/embed/x"></iframe></div></div></div></div>',
      ),
    ).toEqual([{ kind: "embed", src: "https://share.descript.com/embed/x", maxWidth: 640 }]);
  });

  it("never lets a script, an unsafe link or an unsafe frame through", () => {
    const blocks = articleBlocks(
      '<script>alert(1)</script><p>Words <a href="javascript:alert(1)">here</a>.</p><iframe src="javascript:alert(1)"></iframe><iframe src="http://insecure.example/x"></iframe>',
    );
    expect(blocks).toEqual([{ kind: "paragraph", inline: ["Words here."] }]);
  });

  it("keeps markup that sits inside an attribute value from becoming content", () => {
    const html =
      '<div data-title="<p>Photo by <a href=&quot;https://x.example&quot;>Someone</a></p>" data-src="https://x.example/a.jpg"><figure><picture><img alt="" src="https://x.example/a.jpg"></picture></figure></div><p>After.</p>';
    expect(articleBlocks(html)).toEqual([
      { kind: "figure", src: "https://x.example/a.jpg", alt: "" },
      { kind: "paragraph", inline: ["After."] },
    ]);
  });

  it("decodes entities and skips empty paragraphs", () => {
    expect(decodeEntities("a &amp; b &#8217; c &#x41; &unknown;")).toBe("a & b ’ c A &unknown;");
    expect(articleBlocks("<p>&nbsp;</p><p><br></p><p>Kept</p>")).toEqual([{ kind: "paragraph", inline: ["Kept"] }]);
  });

  it("survives markup that is not well formed", () => {
    expect(() => parseHtml("<p>unclosed <em>text<p>next</div></span> 1 < 2")).not.toThrow();
    expect(plainText(parseHtml("<p>one</p><p>two</p>"))).toBe("one two");
  });
});

describe("every article in the baked feed", () => {
  const { articles } = getBakedEditorialSnapshot();

  it("has a body to read", () => {
    expect(articles.filter((a) => a.content).length).toBeGreaterThan(0);
  });

  for (const article of articles.filter((a) => a.content)) {
    it(`${article.slug}: loses no words, photographs or embeds`, () => {
      const html = captionFigures(prepareArticleHtml(article.content as string), article.media?.photoPreviews || []);
      const blocks = articleBlocks(html);

      const source = parseHtml(html);
      const sourceWords = words(plainText(source));
      const kept = blockWords(blocks);
      // Words in a figure's caption are kept; words that sit only in attributes never were text.
      expect(Math.abs(kept - sourceWords)).toBeLessThanOrEqual(Math.ceil(sourceWords * 0.01));

      // Counted from the tree, not by pattern: Storipress puts markup with `>` inside attribute values.
      const count = (name: string) => {
        let total = 0;
        const walk = (nodes: ReturnType<typeof parseHtml>) =>
          nodes.forEach((n) => {
            if (n.type !== "el") return;
            if (n.name === name && n.attrs.src) total++;
            walk(n.children);
          });
        walk(source);
        return total;
      };
      expect(blocks.filter((b) => b.kind === "figure").length).toBe(count("img"));
      expect(blocks.filter((b) => b.kind === "embed").length).toBe(count("iframe"));
      expect(count("img")).toBe((html.match(/<img\b/gi) || []).length);
      expect(blocks.some((b) => b.kind === "paragraph")).toBe(true);
    });
  }
});
