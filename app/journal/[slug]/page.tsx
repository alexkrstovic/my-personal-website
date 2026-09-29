import { notFound } from "next/navigation";
import JournalPostView from "@/app/components/journal/JournalPostView";
import { getAllJournalSlugs, getJournalPost } from "@/lib/journal";
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
  const title = `${post.title} — Alex Krstovic`;
  return {
    title,
    description: post.subtitle,
    alternates: { canonical: `/journal/${slug}` },
    openGraph: { title, description: post.subtitle, url: `/journal/${slug}` },
    twitter: { card: "summary_large_image", title, description: post.subtitle },
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

  return <JournalPostView post={post} priorityCover />;
}
