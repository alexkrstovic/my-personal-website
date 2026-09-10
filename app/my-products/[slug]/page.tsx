import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProductCaseStudyContent from "@/app/components/products/ProductCaseStudyContent";
import { personalProducts, hasProductCaseStudy, getProductCaseStudyMeta } from "@/lib/products";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return personalProducts.filter((p) => hasProductCaseStudy(p.slug)).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!hasProductCaseStudy(slug)) return {};
  const meta = getProductCaseStudyMeta(slug);
  const title = `${meta.title} — Alex Krstovic`;
  return {
    title,
    description: meta.subtitle,
    alternates: { canonical: `/my-products/${slug}` },
    openGraph: { title, description: meta.subtitle, url: `/my-products/${slug}` },
    twitter: { card: "summary_large_image", title, description: meta.subtitle },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!hasProductCaseStudy(slug)) notFound();

  return (
    <div className="bg-bg min-h-screen">
      <Navbar />

      {/* pt must match the fixed Navbar's actual rendered height (currently 95px) */}
      <main className="pt-[95px]">
        <ProductCaseStudyContent slug={slug} />
      </main>

      <Footer />
    </div>
  );
}
