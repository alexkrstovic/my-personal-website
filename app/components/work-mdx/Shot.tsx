import Image from "next/image";
import Reveal from "@/app/components/Reveal";

export default function Shot({
  src,
  alt,
  caption,
  aspect = "56%",
  rounded = true,
  bg = true,
}: {
  src: string;
  alt: string;
  caption?: string;
  aspect?: string;
  // MDX JSX expression props (e.g. `rounded={false}`) don't reliably reach
  // the component via next-mdx-remote's compiler — they're silently
  // dropped, falling back to the default. Accepting the string "false"
  // too (same workaround ShotRow's `cols` prop already uses) means MDX
  // content can opt out via `rounded="false"` and have it actually work.
  rounded?: boolean | "false";
  bg?: boolean | "false";
}) {
  const unoptimized = src.endsWith(".svg");
  const isRounded = rounded !== false && rounded !== "false";
  const hasBg = bg !== false && bg !== "false";

  return (
    <Reveal delay={0} className="mb-6">
      <figure>
        <div
          className={`relative w-full overflow-hidden ${isRounded ? "rounded-[20px]" : ""} ${hasBg ? "bg-tag" : ""}`}
          style={{ paddingTop: aspect }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            unoptimized={unoptimized}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1360px"
          />
        </div>
        {caption && (
          <figcaption className="mt-4 font-[family-name:var(--font-heading)] font-medium text-[18px] md:text-[24px] lg:text-[30px] text-text leading-normal">
            {caption}
          </figcaption>
        )}
      </figure>
    </Reveal>
  );
}
