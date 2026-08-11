import { renderOgImage, ogImageSize } from "@/lib/ogImage";
import { getAvailableWorkSlugs, getWorkCaseStudyMeta, hasCaseStudy } from "@/lib/work";

export const alt = "Alex Krstovic — Case Study";
export const size = ogImageSize;
export const contentType = "image/png";

// See the sibling work opengraph-image: keeps unknown slugs a 404 instead of
// a 500 from reading a case-study.mdx that isn't there.
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAvailableWorkSlugs()
    .filter(hasCaseStudy)
    .map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getWorkCaseStudyMeta(slug);
  return renderOgImage(`${meta.title} Case Study`, meta.subtitle);
}
