/**
 * Empathy Ledger's article body, as blocks.
 *
 * The body arrives as exported HTML (Webflow richtext figures, Storipress divs, a Descript embed inside a
 * `data-rt-embed-type` div). The old reader injected it raw under a `.rich-text` stylesheet. The Brand v1 reader draws
 * it with the ArticleBody pieces, so the HTML is read into a short list of blocks first and each block is drawn by the
 * piece that owns it. Nothing here writes words: text is carried across exactly, and anything the reader does not
 * know is read for its text rather than dropped.
 *
 * Block types kept from the old reader: paragraph, heading, list, figure (with its caption, wide or not), block quote,
 * divider, and embeds (an iframe such as Descript, or a video element). Scripts and styles never come through.
 */

export type Inline =
  | string
  | { tag: "strong" | "em" | "sup" | "sub" | "code" | "br"; children: Inline[] }
  | { tag: "a"; href: string; newTab: boolean; children: Inline[] };

export type Block =
  | { kind: "paragraph"; inline: Inline[] }
  | { kind: "heading"; level: 2 | 3; inline: Inline[] }
  | { kind: "list"; ordered: boolean; items: Inline[][] }
  | { kind: "figure"; src: string; alt: string; caption?: string }
  | { kind: "quote"; text: string }
  | { kind: "divider" }
  | { kind: "embed"; src: string; title?: string; maxWidth?: number }
  | { kind: "video"; src: string; poster?: string; maxWidth?: number };

/* ------------------------------------------------------------------------------------------------------------ */
/* Reading the HTML                                                                                              */
/* ------------------------------------------------------------------------------------------------------------ */

type El = { type: "el"; name: string; attrs: Record<string, string>; children: Node[] };
type Text = { type: "text"; value: string };
type Node = El | Text;

const VOID = new Set([
  "img", "br", "hr", "input", "meta", "link", "source", "wbr", "col", "area", "base", "embed", "track", "param",
]);
const RAW_TEXT = new Set(["script", "style"]);
const CLOSES_PARAGRAPH = new Set([
  "p", "div", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "figure", "blockquote", "hr", "table", "pre", "section",
  "article",
]);

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0", ndash: "\u2013", mdash: "\u2014",
  hellip: "…", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", copy: "©",
  middot: "·", bull: "•", eacute: "é", egrave: "è", agrave: "à", uuml: "ü",
  ouml: "ö", auml: "ä", ntilde: "ñ", deg: "°",
};

export function decodeEntities(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (whole, entity: string) => {
    if (entity[0] === "#") {
      const code = entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      if (!Number.isFinite(code) || code < 1 || code > 0x10ffff) return whole;
      try {
        return String.fromCodePoint(code);
      } catch {
        return whole;
      }
    }
    return NAMED_ENTITIES[entity.toLowerCase()] ?? whole;
  });
}

/** A forgiving tree builder for the markup Empathy Ledger exports. It never throws on bad markup. */
export function parseHtml(html: string): Node[] {
  const root: El = { type: "el", name: "#root", attrs: {}, children: [] };
  const stack: El[] = [root];
  const top = () => stack[stack.length - 1];
  const pushText = (value: string) => {
    if (value) top().children.push({ type: "text", value: decodeEntities(value) });
  };

  let i = 0;
  while (i < html.length) {
    const lt = html.indexOf("<", i);
    if (lt === -1) {
      pushText(html.slice(i));
      break;
    }
    if (lt > i) pushText(html.slice(i, lt));

    if (html.startsWith("<!--", lt)) {
      const end = html.indexOf("-->", lt + 4);
      i = end === -1 ? html.length : end + 3;
      continue;
    }
    const next = html[lt + 1] ?? "";
    if (next === "!" || next === "?") {
      const end = html.indexOf(">", lt);
      i = end === -1 ? html.length : end + 1;
      continue;
    }
    if (next === "/") {
      const end = html.indexOf(">", lt);
      if (end === -1) break;
      const name = html.slice(lt + 2, end).trim().toLowerCase();
      // Close the nearest open element of that name; a close tag with no open one is ignored.
      for (let s = stack.length - 1; s > 0; s--) {
        if (stack[s].name === name) {
          stack.length = s;
          break;
        }
      }
      i = end + 1;
      continue;
    }
    if (!/[a-zA-Z]/.test(next)) {
      pushText("<");
      i = lt + 1;
      continue;
    }

    // An opening tag: name, then attributes (quote-aware, since Storipress puts markup inside attribute values).
    let p = lt + 1;
    while (p < html.length && !/[\s/>]/.test(html[p])) p++;
    const name = html.slice(lt + 1, p).toLowerCase();
    const attrs: Record<string, string> = {};
    let selfClosing = false;
    while (p < html.length) {
      while (p < html.length && /\s/.test(html[p])) p++;
      if (html[p] === ">") {
        p++;
        break;
      }
      if (html[p] === "/") {
        selfClosing = true;
        p++;
        continue;
      }
      const start = p;
      while (p < html.length && !/[\s=/>]/.test(html[p])) p++;
      const key = html.slice(start, p).toLowerCase();
      if (!key) {
        p++;
        continue;
      }
      while (p < html.length && /\s/.test(html[p])) p++;
      let value = "";
      if (html[p] === "=") {
        p++;
        while (p < html.length && /\s/.test(html[p])) p++;
        const quote = html[p];
        if (quote === '"' || quote === "'") {
          const close = html.indexOf(quote, p + 1);
          const stop = close === -1 ? html.length : close;
          value = html.slice(p + 1, stop);
          p = close === -1 ? html.length : close + 1;
        } else {
          const from = p;
          while (p < html.length && !/[\s>]/.test(html[p])) p++;
          value = html.slice(from, p);
        }
      }
      if (!(key in attrs)) attrs[key] = decodeEntities(value);
    }
    i = p;

    if (RAW_TEXT.has(name)) {
      const close = html.toLowerCase().indexOf(`</${name}`, i);
      if (close === -1) {
        i = html.length;
      } else {
        const end = html.indexOf(">", close);
        i = end === -1 ? html.length : end + 1;
      }
      continue;
    }

    if (CLOSES_PARAGRAPH.has(name) && top().name === "p") stack.pop();
    if (name === "li" && top().name === "li") stack.pop();

    const el: El = { type: "el", name, attrs, children: [] };
    top().children.push(el);
    if (!VOID.has(name) && !selfClosing) stack.push(el);
  }
  return root.children;
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Text and inline                                                                                               */
/* ------------------------------------------------------------------------------------------------------------ */

const INLINE_TAGS = new Set([
  "a", "strong", "b", "em", "i", "cite", "sup", "sub", "code", "span", "mark", "small", "u", "s", "del", "ins", "abbr",
  "font", "q", "label", "br", "time", "var", "kbd",
]);
const MEDIA_TAGS = ["img", "iframe", "figure", "video"];
const SKIP = new Set(["script", "style", "noscript", "svg", "source", "track", "input"]);

function contains(node: Node, names: string[]): boolean {
  if (node.type === "text") return false;
  return node.children.some((child) => child.type === "el" && (names.includes(child.name) || contains(child, names)));
}

function findFirst(node: Node, name: string): El | null {
  if (node.type === "text") return null;
  for (const child of node.children) {
    if (child.type !== "el") continue;
    if (child.name === name) return child;
    const found = findFirst(child, name);
    if (found) return found;
  }
  return null;
}

function findAll(node: Node, name: string, into: El[] = []): El[] {
  if (node.type === "text") return into;
  for (const child of node.children) {
    if (child.type !== "el") continue;
    if (child.name === name) into.push(child);
    else findAll(child, name, into);
  }
  return into;
}

/** The words inside a node, whitespace collapsed. */
export function plainText(node: Node | Node[]): string {
  const nodes = Array.isArray(node) ? node : [node];
  const parts: string[] = [];
  const walk = (n: Node) => {
    if (n.type === "text") {
      parts.push(n.value);
      return;
    }
    if (SKIP.has(n.name)) return;
    if (n.name === "br") parts.push(" ");
    n.children.forEach(walk);
    if (!INLINE_TAGS.has(n.name)) parts.push(" ");
  };
  nodes.forEach(walk);
  return parts.join("").replace(/\s+/g, " ").trim();
}

function safeHref(value: string | undefined): string | null {
  const href = (value ?? "").trim();
  if (!href) return null;
  if (href.startsWith("/") || href.startsWith("#")) return href;
  return /^(https?:|mailto:|tel:)/i.test(href) ? href : null;
}

function inlineFrom(nodes: Node[]): Inline[] {
  const out: Inline[] = [];
  const add = (children: Inline[]) => out.push(...children);

  for (const node of nodes) {
    if (node.type === "text") {
      out.push(node.value.replace(/\s+/g, " "));
      continue;
    }
    if (SKIP.has(node.name)) continue;
    const children = inlineFrom(node.children);
    switch (node.name) {
      case "strong":
      case "b":
        out.push({ tag: "strong", children });
        break;
      case "em":
      case "i":
      case "cite":
        out.push({ tag: "em", children });
        break;
      case "sup":
      case "sub":
      case "code":
        out.push({ tag: node.name, children });
        break;
      case "br":
        out.push({ tag: "br", children: [] });
        break;
      case "a": {
        const href = safeHref(node.attrs.href);
        if (href) out.push({ tag: "a", href, newTab: node.attrs.target === "_blank", children });
        else add(children);
        break;
      }
      default:
        // Spans and the like carry no meaning here; a block element inside inline text is read as a space.
        add(children);
        if (!INLINE_TAGS.has(node.name)) out.push(" ");
    }
  }
  return out;
}

/** Merge neighbouring strings, trim the ends, and drop a run that is only space. */
function tidy(inline: Inline[]): Inline[] {
  const merged: Inline[] = [];
  for (const part of inline) {
    const item = typeof part === "string" ? part : { ...part, children: tidy(part.children) };
    const last = merged[merged.length - 1];
    if (typeof item === "string" && typeof last === "string") merged[merged.length - 1] = (last + item).replace(/ {2,}/g, " ");
    else merged.push(item);
  }
  const first = merged[0];
  if (typeof first === "string") merged[0] = first.replace(/^\s+/, "");
  const last = merged[merged.length - 1];
  if (typeof last === "string") merged[merged.length - 1] = last.replace(/\s+$/, "");
  return merged.filter((part) => part !== "");
}

function hasWords(inline: Inline[]): boolean {
  return inline.some((part) => (typeof part === "string" ? /\S/.test(part) : part.tag !== "br" && hasWords(part.children)));
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Blocks                                                                                                        */
/* ------------------------------------------------------------------------------------------------------------ */

function httpsOrSite(value: string | undefined): string | null {
  const src = (value ?? "").trim();
  if (!src) return null;
  if (src.startsWith("//")) return `https:${src}`;
  return /^https:\/\//i.test(src) || src.startsWith("/") ? src : null;
}

/** A wrapper's own `max-width: 640px`, which is how the ledger sizes a Descript embed. */
function widthOf(node: El, inherited?: number): number | undefined {
  const match = /(?:^|;)\s*max-width\s*:\s*(\d{2,4})px/i.exec(node.attrs.style ?? "");
  return match ? Number(match[1]) : inherited;
}

function figureFrom(node: El, out: Block[], width?: number) {
  const frame = findFirst(node, "iframe");
  if (frame) {
    embedFrom(frame, out, width);
    return;
  }
  const video = findFirst(node, "video");
  if (video) {
    videoFrom(video, out, width);
    return;
  }
  const image = findFirst(node, "img");
  if (image) {
    const src = httpsOrSite(image.attrs.src);
    if (src) {
      const caption = plainText(findAll(node, "figcaption"));
      out.push({ kind: "figure", src, alt: image.attrs.alt ?? "", ...(caption ? { caption } : {}) });
    }
    return;
  }
  blocksFrom(node.children, out, width);
}

function embedFrom(node: El, out: Block[], width?: number) {
  const src = httpsOrSite(node.attrs.src);
  if (!src) return;
  out.push({
    kind: "embed",
    src,
    ...(node.attrs.title ? { title: node.attrs.title } : {}),
    ...(width ? { maxWidth: width } : {}),
  });
}

function videoFrom(node: El, out: Block[], width?: number) {
  const src = httpsOrSite(node.attrs.src) ?? httpsOrSite(findFirst(node, "source")?.attrs.src);
  if (!src) return;
  const poster = httpsOrSite(node.attrs.poster);
  out.push({ kind: "video", src, ...(poster ? { poster } : {}), ...(width ? { maxWidth: width } : {}) });
}

/** `width` is the narrowest `max-width` a wrapper has set on the way down, used only by embeds. */
export function blocksFrom(nodes: Node[], out: Block[] = [], width?: number): Block[] {
  let run: Node[] = [];
  const flush = () => {
    if (!run.length) return;
    const inline = tidy(inlineFrom(run));
    if (hasWords(inline)) out.push({ kind: "paragraph", inline });
    run = [];
  };

  for (const node of nodes) {
    if (node.type === "text") {
      run.push(node);
      continue;
    }
    const { name } = node;
    if (SKIP.has(name)) continue;

    if (INLINE_TAGS.has(name) && !contains(node, MEDIA_TAGS)) {
      run.push(node);
      continue;
    }

    flush();
    switch (name) {
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6": {
        const inline = tidy(inlineFrom(node.children));
        if (hasWords(inline)) out.push({ kind: "heading", level: name === "h1" || name === "h2" ? 2 : 3, inline });
        break;
      }
      case "hr":
        out.push({ kind: "divider" });
        break;
      case "blockquote": {
        const text = plainText(node);
        if (text) out.push({ kind: "quote", text });
        break;
      }
      case "ul":
      case "ol": {
        const items = node.children
          .filter((child): child is El => child.type === "el" && child.name === "li")
          .map((li) => tidy(inlineFrom(li.children)))
          .filter(hasWords);
        if (items.length) out.push({ kind: "list", ordered: name === "ol", items });
        break;
      }
      case "figure":
        figureFrom(node, out, widthOf(node, width));
        break;
      case "img": {
        const src = httpsOrSite(node.attrs.src);
        if (src) out.push({ kind: "figure", src, alt: node.attrs.alt ?? "" });
        break;
      }
      case "iframe":
        embedFrom(node, out, width);
        break;
      case "video":
        videoFrom(node, out, width);
        break;
      default:
        // p, div, picture, the embed wrappers, anything unknown: read what is inside.
        blocksFrom(node.children, out, widthOf(node, width));
    }
  }
  flush();
  return out;
}

/** The article body as blocks. Give it HTML that has been through prepareArticleHtml and captionFigures. */
export function articleBlocks(html: string): Block[] {
  return blocksFrom(parseHtml(html));
}
