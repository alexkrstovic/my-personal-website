import { renderOgImage, ogImageSize } from "@/lib/ogImage";

export const alt = "About Alex Krstovic";
export const size = ogImageSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage("About Alex Krstovic", "Digital Product Designer based in Vancouver, BC");
}
