import { renderOgImage, renderPhotoOgImage, ogImageSize } from "@/lib/ogImage";
import { getJournalPostMeta, getAllJournalSlugs } from "@/lib/journal";
import { hasImageAsset, metaDescription, resolveSeo } from "@/lib/journal-seo";
import { urlForImage } from "@/lib/sanity/image";

export const alt = "Alex Krstovic \u2014 Journal";
export const size = ogImageSize;
export const contentType = "image/png";

// Posts are published without a redeploy, so unlike Work pages any slug can
// be rendered on demand; refreshed every minute so a retitled post updates.
export const revalidate = 60;

export async function generateStaticParams() {
  return (await getAllJournalSlugs()).map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getJournalPostMeta(slug);
  if (!post) return renderOgImage("Journal", "Writing by Alex Krstovic");

  // A share image chosen in the editor wins; otherwise a card with the title.
  if (hasImageAsset(post.seoImage)) {
    return renderPhotoOgImage(
      urlForImage(post.seoImage!).width(1200).height(630).fit("crop").format("jpg").quality(90).url()
    );
  }
  const { headline, summary } = resolveSeo(post);
  return renderOgImage(headline, metaDescription(summary, 110));
}
