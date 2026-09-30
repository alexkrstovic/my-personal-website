import { notFound } from "next/navigation";
import JournalPostView from "@/app/components/journal/JournalPostView";
import { getAllJournalSlugs, getJournalPost } from "@/lib/journal";
import { resolveSeo, SITE_URL, AUTHOR_NAME } from "@/lib/journal-seo";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const slugs = await getAllJournalSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getJournalPost(slug);
  if (!post) return {};
  const { title, description } = resolveSeo(post);
  const url = `/journal/${slug}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      types: { "application/rss+xml": [{ url: "/journal/feed.xml", title: "Journal — Alex Krstovic" }] },
    },
    // The share image comes from ./opengraph-image.tsx.
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: AUTHOR_NAME,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [AUTHOR_NAME],
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getJournalPost(slug);
  if (!post) notFound();

  // Tells search engines this is a dated article by a named author.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: resolveSeo(post).description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    url: `${SITE_URL}/journal/${slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/journal/${slug}` },
    image: `${SITE_URL}/journal/${slug}/opengraph-image`,
    author: { "@type": "Person", name: AUTHOR_NAME, url: SITE_URL },
    ...(post.tags.length > 0 && { keywords: post.tags.join(", ") }),
    inLanguage: "en",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <JournalPostView post={post} priorityCover />
    </>
  );
}
