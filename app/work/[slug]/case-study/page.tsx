import { notFound } from "next/navigation";
import Link from "next/link";
import { getAvailableWorkSlugs, getWorkCaseStudyMeta } from "@/lib/work";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CaseStudyContent from "@/app/components/work/CaseStudyContent";
import CloseBar, { CloseBarLabel } from "@/app/components/work/CloseBar";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAvailableWorkSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugs = getAvailableWorkSlugs();
  if (!slugs.includes(slug)) return {};
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
  if (!slugs.includes(slug)) notFound();

  return (
    <div className="bg-bg min-h-screen">
      <Navbar />

      <main className="pt-[68px]">
        <CaseStudyContent
          slug={slug}
          closeButton={
            <CloseBar stickyTop={68}>
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
