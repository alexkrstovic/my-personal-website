import { renderOgImage, ogImageSize } from "@/lib/ogImage";

export const alt = "Alex Krstovic — Digital Product Designer";
export const size = ogImageSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage("Alex Krstovic", "Digital Product Designer");
}
