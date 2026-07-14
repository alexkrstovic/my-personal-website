import { notFound } from "next/navigation";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllPostSlugs, getPostMeta, getRawPost, formatDate } from "@/lib/posts";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugs = getAllPostSlugs();
  if (!slugs.includes(slug)) return {};
  const meta = getPostMeta(slug);
  return {
    title: `${meta.title} — Alex Krstovic`,
    description: meta.excerpt,
  };
}

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="font-[family-name:var(--font-heading)] font-bold text-[32px] md:text-[40px] text-[#131112] leading-tight mt-12 mb-4 first:mt-0"
      {...props}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="font-[family-name:var(--font-heading)] font-bold text-[22px] md:text-[26px] text-[#131112] leading-snug mt-10 mb-3"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="font-[family-name:var(--font-heading)] font-normal text-[18px] md:text-[20px] text-[#131112] leading-snug mt-8 mb-2"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="font-[family-name:var(--font-body)] font-light text-[16px] md:text-[18px] lg:text-[20px] text-[#131112] leading-relaxed mb-6"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="list-disc pl-6 mb-6 space-y-2 font-[family-name:var(--font-body)] font-light text-[16px] md:text-[18px] lg:text-[20px] text-[#131112] leading-relaxed"
      {...props}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="list-decimal pl-6 mb-6 space-y-2 font-[family-name:var(--font-body)] font-light text-[16px] md:text-[18px] lg:text-[20px] text-[#131112] leading-relaxed"
      {...props}
    />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold" {...props} />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="underline hover:opacity-60 transition-opacity"
      {...props}
    />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-2 border-[#131112] pl-6 my-8 opacity-70 font-[family-name:var(--font-body)] font-light text-[18px] md:text-[20px] leading-relaxed italic"
      {...props}
    />
  ),
  hr: () => (
    <hr className="border-none h-px bg-[#131112] opacity-10 my-12" />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="bg-[#e6e7e6] rounded px-1.5 py-0.5 text-[0.9em] font-mono"
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="bg-[#e6e7e6] rounded-[10px] p-6 overflow-x-auto mb-6 text-[14px] font-mono leading-relaxed"
      {...props}
    />
  ),
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = getAllPostSlugs();
  if (!slugs.includes(slug)) notFound();

  const meta = getPostMeta(slug);
  const raw = getRawPost(slug);

  const { content } = await compileMDX({
    source: raw,
    components: mdxComponents,
    options: { parseFrontmatter: true },
  });

  return (
    <div className="bg-[#f7efed] min-h-screen">
      <Navbar />

      <main className="pt-[68px]">
        {/* Back link */}
        <div className="px-5 md:px-10 pt-12">
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] font-light text-[16px] text-[#131112] opacity-50 hover:opacity-100 transition-opacity"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="#131112" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Journal
          </Link>
        </div>

        {/* Post header */}
        <header className="px-5 md:px-10 pt-10 pb-12">
          <div className="max-w-[740px]">
            {meta.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center bg-[#e6e7e6] rounded-[5px] px-[10px] py-[10px] font-[family-name:var(--font-body)] font-light text-[12px] leading-none text-[#131112]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="font-[family-name:var(--font-heading)] font-bold text-[32px] md:text-[48px] lg:text-[60px] text-[#131112] leading-[1.05]">
              {meta.title}
            </h1>
            <p className="mt-4 font-[family-name:var(--font-body)] font-light text-[16px] text-[#131112] opacity-50">
              {formatDate(meta.date)}
            </p>
          </div>
        </header>

        <div className="px-5 md:px-10">
          <div className="h-px bg-[#131112] opacity-10" />
        </div>

        {/* Post content */}
        <article className="px-5 md:px-10 py-14">
          <div className="max-w-[740px]">{content}</div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
