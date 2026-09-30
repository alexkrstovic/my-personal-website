import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import WordReveal from "@/app/components/WordReveal";
import JournalCard from "@/app/components/journal/JournalCard";
import { getAllJournalPosts } from "@/lib/journal";
import { JOURNAL_TITLE as title, JOURNAL_DESCRIPTION as description } from "@/lib/journal-seo";
import type { Metadata } from "next";

// The share image comes from ./opengraph-image.tsx.
export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/journal",
    types: { "application/rss+xml": [{ url: "/journal/feed.xml", title }] },
  },
  openGraph: { type: "website", title, description, url: "/journal", siteName: "Alex Krstovic" },
  twitter: { card: "summary_large_image", title, description },
};

export const revalidate = 60;

export default async function JournalPage() {
  const posts = await getAllJournalPosts();

  return (
    <div className="bg-bg min-h-screen">
      <Navbar />

      {/* pt must match the fixed Navbar's actual rendered height (currently 95px) */}
      <section className="pt-[95px] pb-20 md:pb-24">
        <div className="px-5 md:px-10 lg:px-[40px] pt-[40px] pb-10 md:pb-14">
          <h1 className="font-[family-name:var(--font-heading)] font-bold text-[36px] md:text-[53px] text-black leading-none">
            <WordReveal text="Journal" delay={0} />
          </h1>
          <p className="mt-5 font-[family-name:var(--font-body)] font-light text-[18px] md:text-[30px] text-text leading-normal max-w-[670px]">
            <WordReveal text="Writing on design, research, and building things." delay={150} />
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="flex flex-col gap-20">
            {posts.map((post) => (
              <JournalCard key={post.slug} {...post} />
            ))}
          </div>
        ) : (
          <p className="px-5 md:px-10 lg:px-[40px] font-[family-name:var(--font-body)] font-light text-[18px] text-text/60">
            Nothing published yet — check back soon.
          </p>
        )}
      </section>

      <Footer />
    </div>
  );
}
