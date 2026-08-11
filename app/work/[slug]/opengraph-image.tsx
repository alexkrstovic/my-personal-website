import { renderOgImage, ogImageSize } from "@/lib/ogImage";
import { getAvailableWorkSlugs, getWorkProjectMeta } from "@/lib/work";

export const alt = "Alex Krstovic — Work";
export const size = ogImageSize;
export const contentType = "image/png";

// Without this, an unknown slug is rendered on demand and getWorkProjectMeta
// throws ENOENT on the missing .mdx — a 500 where the sibling page routes
// return a clean 404. false limits this route to the slugs below.
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAvailableWorkSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getWorkProjectMeta(slug);
  return renderOgImage(meta.title, meta.description);
}
