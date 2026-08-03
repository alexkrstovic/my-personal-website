import { notFound } from "next/navigation";
import Link from "next/link";
import { getAvailableWorkSlugs, getWorkCaseStudyMeta, hasCaseStudy } from "@/lib/work";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CaseStudyContent from "@/app/components/work/CaseStudyContent";
import CloseBar, { CloseBarLabel } from "@/app/components/work/CloseBar";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAvailableWorkSlugs()
    .filter(hasCaseStudy)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugs = getAvailableWorkSlugs();
  if (!slugs.includes(slug) || !hasCaseStudy(slug)) return {};
  const meta = getWorkCaseStudyMeta(slug);
  const title = `${meta.title} Case Study — Alex Krstovic`;
  return {
    title,
    description: meta.subtitle,
    openGraph: { title, description: meta.subtitle, url: `/work/${slug}/case-study` },
    twitter: { card: "summary_large_image", title, description: meta.subtitle },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = getAvailableWorkSlugs();
  if (!slugs.includes(slug) || !hasCaseStudy(slug)) notFound();

  return (
    <div className="bg-bg min-h-screen">
      <Navbar />

      {/* pt/stickyTop must match the fixed Navbar's actual rendered height
          (currently 95px) — if they drift out of sync, the Navbar's own
          full-width hit area silently overlaps and swallows clicks meant
          for the CloseBar sitting just underneath it. */}
      <main className="pt-[95px]">
        <CaseStudyContent
          slug={slug}
          closeButton={
            <CloseBar stickyTop={95}>
              <Link
                href={`/work/${slug}`}
                className="hover:opacity-60 transition-opacity"
                aria-label="Close case study"
              >
                <CloseBarLabel />
              </Link>
            </CloseBar>
          }
        />
      </main>

      <Footer />
    </div>
  );
}
