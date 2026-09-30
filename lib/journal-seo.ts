// Text from the editor can carry stray line breaks or double spaces (a
// subtitle typed into a multi-line box, say). Collapse them so every place a
// subtitle is used — page, cards, search snippets, share previews — is clean.
export function cleanText(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

// Search results show roughly the first 155 characters of a description, so
// cut longer ones at a word boundary rather than mid-word.
export function metaDescription(value: string | null | undefined, max = 155): string {
  const text = cleanText(value);
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:!?\s]+$/, "") + "…";
}

export const SITE_URL = "https://alexkrstovic.com";
export const AUTHOR_NAME = "Alex Krstovic";

// The Journal's own title and one-line description, used by its page, share
// image and RSS feed so they can't drift apart.
export const JOURNAL_TITLE = `Journal \u2014 ${AUTHOR_NAME}`;
export const JOURNAL_DESCRIPTION = "Writing on design, research, and building things.";

// The title and description search engines and link previews use: what the
// writer typed in the "Search & sharing" section if anything (a box left blank
// or holding only spaces counts as empty), otherwise the post's own title and
// subtitle. `summary` is the full text; `description` is it cut for search.
export function resolveSeo(post: {
  title: string;
  subtitle: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
}) {
  const headline = cleanText(post.seoTitle) || post.title;
  const summary = cleanText(post.seoDescription) || cleanText(post.subtitle);
  return {
    headline,
    title: `${headline} \u2014 ${AUTHOR_NAME}`,
    summary,
    description: metaDescription(summary),
  };
}

export function hasImageAsset(source: unknown): boolean {
  return Boolean((source as { asset?: unknown } | null | undefined)?.asset);
}
