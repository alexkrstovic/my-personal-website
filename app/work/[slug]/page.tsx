import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAvailableWorkSlugs, getWorkProjectMeta, getWorkProjectRaw, hasCaseStudy } from "@/lib/work";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Shot from "@/app/components/work-mdx/Shot";
import ShotRow from "@/app/components/work-mdx/ShotRow";
import TextCol from "@/app/components/work-mdx/TextCol";
import Reveal from "@/app/components/Reveal";
import WordReveal from "@/app/components/WordReveal";
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
  const meta = getWorkProjectMeta(slug);
  const title = `${meta.title} — Alex Krstovic`;
  return {
    title,
    description: meta.description,
    alternates: { canonical: `/work/${slug}` },
    openGraph: { title, description: meta.description, url: `/work/${slug}` },
    twitter: { card: "summary_large_image", title, description: meta.description },
  };
}

const projectMdxComponents = {
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="font-[family-name:var(--font-body)] font-semibold text-[30px] text-text leading-relaxed mb-6"
      {...props}
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold" {...props} />
  ),
  Shot,
  ShotRow,
  TextCol,
};

export default async function WorkProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = getAvailableWorkSlugs();
  if (!slugs.includes(slug)) notFound();

  const meta = getWorkProjectMeta(slug);
  const raw = getWorkProjectRaw(slug);

  const { content } = await compileMDX({
    source: raw,
    components: projectMdxComponents,
    options: { parseFrontmatter: true },
  });

  return (
    <div className="bg-bg min-h-screen">
      <Navbar />

      {/* pt must match the fixed Navbar's actual rendered height (currently 95px) */}
      <main className="pt-[95px]">
        {/* Header */}
        <header className="px-5 md:px-10 pt-16 md:pt-20">
          <Reveal delay={0} className="mb-3">
            <Link
              href="/"
              className="inline-flex items-center gap-[10px] bg-[#efb65d] rounded-[5px] px-[10px] py-[5px] font-[family-name:var(--font-body)] font-light text-[16px] text-black leading-none hover:opacity-60 transition-opacity"
            >
              <Image src="/images/arrow-right.svg" alt="" width={13} height={13} unoptimized className="rotate-180" />
              Back to main page
            </Link>
          </Reveal>
          <h1 className="font-[family-name:var(--font-heading)] font-bold text-[42px] md:text-[60px] lg:text-[80px] text-text leading-[1.05]">
            <WordReveal text={meta.title} delay={0} stagger={55} />
          </h1>
          <p className="mt-4 font-[family-name:var(--font-body)] font-light text-[18px] md:text-[24px] lg:text-[30px] text-text leading-normal max-w-[670px]">
            <WordReveal text={meta.subtitle} delay={150} stagger={25} duration={550} />
          </p>
          <Reveal delay={300} className="mt-6 flex flex-wrap gap-2">
            {meta.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center bg-[rgba(217,217,217,0.65)] rounded-[5px] px-[10px] py-[10px] font-[family-name:var(--font-body)] font-light text-[12px] leading-none text-text whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </Reveal>
        </header>

        {/* Hero image */}
        <div className="px-5 md:px-10 mt-10">
          <Reveal delay={0} className="relative w-full rounded-[20px] overflow-hidden">
            <div className="relative w-full h-full" style={{ height: "clamp(280px, 48vw, 700px)" }}>
              <Image
                src={meta.heroImage}
                alt={meta.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1360px"
              />
            </div>
          </Reveal>
        </div>

        {/* Summary panel + intro */}
        <div className="px-5 md:px-10 mt-14 md:mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="flex flex-col gap-5 order-2 lg:order-1">
              <div>
                <h2 className="font-[family-name:var(--font-heading)] font-bold text-[18px] md:text-[20px] text-text mb-2">
                  <WordReveal text="Industry" delay={0} />
                </h2>
                <p className="font-[family-name:var(--font-body)] font-light text-[15px] md:text-[17px] text-text leading-tight">
                  <WordReveal text={meta.industry} delay={40} stagger={30} duration={500} />
                </p>
              </div>

              <div>
                <h2 className="font-[family-name:var(--font-heading)] font-bold text-[18px] md:text-[20px] text-text mb-2">
                  <WordReveal text="What I did" delay={80} stagger={45} />
                </h2>
                <p className="font-[family-name:var(--font-body)] font-light text-[15px] md:text-[17px] text-text mb-2">
                  <WordReveal text={meta.whatIDidSummary} delay={120} stagger={20} duration={500} />
                </p>
                <Reveal delay={200}>
                  <ul className="list-disc pl-5 space-y-1 font-[family-name:var(--font-body)] font-light text-[15px] md:text-[17px] text-text leading-tight">
                    {meta.whatIDid.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Reveal>
              </div>

              <div>
                <h2 className="font-[family-name:var(--font-heading)] font-bold text-[18px] md:text-[20px] text-text mb-2">
                  <WordReveal text="Impact" delay={160} />
                </h2>
                <Reveal delay={220}>
                  <ul className="list-disc pl-5 space-y-1 font-[family-name:var(--font-body)] font-light text-[15px] md:text-[17px] text-text leading-tight">
                    {meta.impact.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Reveal>
              </div>

              <div>
                <h2 className="font-[family-name:var(--font-heading)] font-bold text-[18px] md:text-[20px] text-text mb-2">
                  <WordReveal text="Timeline" delay={240} />
                </h2>
                <p className="font-[family-name:var(--font-body)] font-light text-[15px] md:text-[17px] text-text leading-tight">
                  <WordReveal text={meta.timeline} delay={280} stagger={30} duration={500} />
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="font-[family-name:var(--font-heading)] font-bold text-[22px] md:text-[28px] lg:text-[35px] text-text leading-none mb-4">
                <WordReveal text={meta.tagline} delay={150} stagger={45} />
              </h2>
              <p className="font-[family-name:var(--font-body)] font-light text-[18px] md:text-[22px] lg:text-[30px] text-text leading-normal">
                <WordReveal text={meta.introText} delay={280} stagger={22} duration={550} />
              </p>
            </div>
          </div>

          {hasCaseStudy(slug) && (
            <Reveal delay={200} className="flex justify-center mt-14 md:mt-20">
              <Link
                href={`/work/${slug}/case-study`}
                className="inline-flex items-center gap-2 border border-text rounded-[50px] px-5 py-3 font-[family-name:var(--font-body)] font-light text-[18px] md:text-[20px] lg:text-[25px] text-text hover:opacity-60 transition-opacity"
              >
                <WordReveal text="Read the full case study" delay={0} stagger={45} />
                <Image src="/images/expand.svg" alt="" width={24} height={24} unoptimized />
              </Link>
            </Reveal>
          )}
        </div>

        {/* Gallery */}
        <div className="px-5 md:px-10 mt-20 md:mt-28 mb-[200px]">
          <h2 className="font-[family-name:var(--font-heading)] font-bold text-[26px] md:text-[30px] lg:text-[35px] text-text mb-10">
            <WordReveal text="Gallery" delay={0} />
          </h2>
          <div className="max-w-[1360px]">{content}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
