import { client } from "@/lib/sanity/client";
import type { PortableTextBlock } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url";

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
  publishedAt
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

export async function getAllJournalPosts(): Promise<JournalPostMeta[]> {
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc) { ${metaFields} }`,
    {},
    { next: { revalidate } }
  );
}

export async function getAllJournalSlugs(): Promise<string[]> {
  return client.fetch(`*[_type == "post"].slug.current`, {}, { next: { revalidate } });
}

export async function getJournalPost(slug: string): Promise<JournalPost | null> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] { ${metaFields}, ${bodyField} }`,
    { slug },
    { next: { revalidate } }
  );
}
