import { client } from "@/lib/sanity/client";
import type { PortableTextBlock } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url";
import { cleanText } from "@/lib/journal-seo";

export type JournalPostMeta = {
  title: string;
  slug: string;
  subtitle: string;
  coverImage: SanityImageSource | null;
  coverVideoUrl: string | null;
  coverVideoLoop: boolean | null;
  coverVideoFocus: string | null;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoImage: SanityImageSource | null;
};

export type JournalPost = JournalPostMeta & {
  body: PortableTextBlock[];
};

const metaFields = `
  title,
  "slug": slug.current,
  subtitle,
  coverImage,
  "coverVideoUrl": coverVideo.asset->url,
  coverVideoLoop,
  coverVideoFocus,
  tags,
  publishedAt,
  "updatedAt": _updatedAt,
  seoTitle,
  seoDescription,
  seoImage
`;

// Image items resolve their own URLs via the image-url builder from just
// the asset reference, but file (video) items need the direct asset URL
// looked up here — hence the conditional projection instead of a bare `body`.
const bodyField = `
  body[]{
    ...,
    _type == "video" => { "videoUrl": asset->url }
  }
`;

// On the live site posts are re-fetched at most once a minute; locally they're
// fetched fresh every time so a publish shows up on the next reload.
const revalidate = process.env.NODE_ENV === "development" ? 0 : 60;

// Sanity sends `null` for a field left empty, so a post with no tags arrives
// as `tags: null`. Tidying it here (along with the subtitle) means every page,
// card and the feed can rely on real values.
const clean = <T extends { subtitle: string; tags: string[] | null }>(post: T): T => ({
  ...post,
  subtitle: cleanText(post.subtitle),
  tags: post.tags ?? [],
});

export async function getAllJournalPosts(): Promise<JournalPostMeta[]> {
  const posts: JournalPostMeta[] = await client.fetch(
    `*[_type == "post"] | order(publishedAt desc) { ${metaFields} }`,
    {},
    { next: { revalidate } }
  );
  return posts.map(clean);
}

export async function getAllJournalSlugs(): Promise<string[]> {
  return client.fetch(`*[_type == "post"].slug.current`, {}, { next: { revalidate } });
}

export async function getJournalPost(slug: string): Promise<JournalPost | null> {
  const post: JournalPost | null = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0] { ${metaFields}, ${bodyField} }`,
    { slug },
    { next: { revalidate } }
  );
  return post ? clean(post) : null;
}

// The most recent posts, with their full text, for the RSS feed.
export async function getJournalFeedPosts(limit = 20): Promise<JournalPost[]> {
  const posts: JournalPost[] = await client.fetch(
    `*[_type == "post"] | order(publishedAt desc)[0...${Math.trunc(limit)}] { ${metaFields}, ${bodyField} }`,
    {},
    { next: { revalidate } }
  );
  return posts.map(clean);
}

// Just the fields (no body) — for share images, where the whole article isn't needed.
export async function getJournalPostMeta(slug: string): Promise<JournalPostMeta | null> {
  const post: JournalPostMeta | null = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0] { ${metaFields} }`,
    { slug },
    { next: { revalidate } }
  );
  return post ? clean(post) : null;
}
