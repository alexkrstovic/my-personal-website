import { renderOgImage, ogImageSize } from "@/lib/ogImage";
import { JOURNAL_DESCRIPTION } from "@/lib/journal-seo";

export const alt = "Alex Krstovic \u2014 Journal";
export const size = ogImageSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage("Journal", JOURNAL_DESCRIPTION);
}
