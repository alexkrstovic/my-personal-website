import { escapeHTML, toHTML, uriLooksSafe, type PortableTextComponents } from "@portabletext/to-html";
import type { JournalPost } from "@/lib/journal";
import { AUTHOR_NAME, JOURNAL_DESCRIPTION, JOURNAL_TITLE, SITE_URL, hasImageAsset } from "@/lib/journal-seo";
import { highlightColorOf, readableTextColor } from "@/lib/highlight-color";
import { urlForImage } from "@/lib/sanity/image";

const FEED_URL = `${SITE_URL}/journal/feed.xml`;

const figure = (src: string, alt: string) =>
  `<figure><img src="${escapeHTML(src)}" alt="${escapeHTML(alt)}" /></figure>`;

const videoLink = (url: unknown) =>
  typeof url === "string" && uriLooksSafe(url) ? `<p><a href="${escapeHTML(url)}">Watch the video</a></p>` : "";

// Feed readers do their own styling and mostly ignore CSS, so the post becomes
// plain, portable HTML: the drop cap is just a paragraph, a highlight carries
// its color inline, and videos become links (readers rarely play them).
const components: PortableTextComponents = {
  block: {
    dropcap: ({ children }) => `<p>${children}</p>`,
  },
  marks: {
    highlight: ({ value, children }) => {
      const bg = highlightColorOf(value);
      return `<mark style="background-color:${bg};color:${readableTextColor(bg)}">${children}</mark>`;
    },
  },
  types: {
    image: ({ value }) =>
      hasImageAsset(value)
        ? figure(urlForImage(value).width(1200).url(), typeof value.alt === "string" ? value.alt : "")
        : "",
    video: ({ value }) => videoLink(value.videoUrl),
  },
  // A kind of content the feed doesn't know about is left out, rather than
  // printing the converter's developer warning into the post.
  unknownType: () => "",
};

// Same order as the page: subtitle, cover, then the post itself.
function postHtml(post: JournalPost): string {
  const cover = post.coverVideoUrl
    ? videoLink(post.coverVideoUrl)
    : hasImageAsset(post.coverImage)
      ? figure(urlForImage(post.coverImage!).width(1200).url(), post.title)
      : "";
  const body = toHTML(post.body, { components, onMissingComponent: false });
  return `<p><em>${escapeHTML(post.subtitle)}</em></p>${cover}${body}`;
}

// XML rejects a handful of control characters outright (a stray one pasted in
// from a PDF would make readers refuse the whole feed), so drop them.
const INVALID_XML_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g;

const XML_ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" };
const xml = (value: string) => value.replace(INVALID_XML_CHARS, "").replace(/[&<>"']/g, (c) => XML_ESCAPES[c]);

// The post's HTML is wrapped in CDATA so it can carry real tags; the one
// sequence CDATA can't contain is its own closing marker.
const cdata = (html: string) => `<![CDATA[${html.replace(INVALID_XML_CHARS, "").replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;

function itemXml(post: JournalPost): string {
  const url = `${SITE_URL}/journal/${post.slug}`;
  return [
    "    <item>",
    `      <title>${xml(post.title)}</title>`,
    `      <link>${xml(url)}</link>`,
    `      <guid isPermaLink="true">${xml(url)}</guid>`,
    `      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`,
    `      <dc:creator>${xml(AUTHOR_NAME)}</dc:creator>`,
    ...(post.tags ?? []).map((tag) => `      <category>${xml(tag)}</category>`),
    `      <description>${xml(post.subtitle)}</description>`,
    `      <content:encoded>${cdata(postHtml(post))}</content:encoded>`,
    "    </item>",
  ].join("\n");
}

// The whole RSS document for these posts (newest first, as given).
export function buildFeed(posts: JournalPost[]): string {
  const lastChange = posts.map((post) => post.updatedAt).sort().at(-1);

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">`,
    "  <channel>",
    `    <title>${xml(JOURNAL_TITLE)}</title>`,
    `    <link>${SITE_URL}/journal</link>`,
    `    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />`,
    `    <description>${xml(JOURNAL_DESCRIPTION)}</description>`,
    `    <language>en</language>`,
    ...(lastChange ? [`    <lastBuildDate>${new Date(lastChange).toUTCString()}</lastBuildDate>`] : []),
    ...posts.map(itemXml),
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}
