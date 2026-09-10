import Image from "next/image";
import Reveal from "@/app/components/Reveal";

export default function Shot({
  src,
  alt,
  caption,
  aspect = "56%",
  rounded = true,
  bg = true,
  video = false,
  shadow = false,
  inset = false,
}: {
  // Optional so a not-yet-supplied video slot can render a placeholder
  // instead of a broken image/video tag.
  src?: string;
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
  video?: boolean | "false";
  shadow?: boolean | "false";
  // Sits the media inset within a padded gray mat instead of filling the
  // frame edge-to-edge — matches the Figma "device mockup" treatment used
  // for the two case-study video placeholders.
  inset?: boolean | "false";
}) {
  const unoptimized = src?.endsWith(".svg");
  const isRounded = rounded !== false && rounded !== "false";
  const hasBg = bg !== false && bg !== "false";
  const isVideo = video !== false && video !== "false";
  const hasShadow = shadow !== false && shadow !== "false";
  const isInset = inset !== false && inset !== "false";

  // Inset media is measured off the Figma mockup's mat, not the actual
  // asset's own aspect ratio, so cover would crop it — contain shows the
  // whole frame, blending into the mat since the two share the same bg.
  const objectFit = isInset ? "object-contain" : "object-cover";

  const media = !src ? (
    <div className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-body)] font-light text-[16px] text-text/50">
      Video coming soon
    </div>
  ) : isVideo ? (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      className={`absolute inset-0 size-full ${objectFit}`}
    />
  ) : (
    <Image
      src={src}
      alt={alt}
      fill
      className={objectFit}
      unoptimized={unoptimized}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1360px"
    />
  );

  return (
    <Reveal delay={0} className="mb-6">
      <figure>
        <div
          className={`relative w-full overflow-hidden ${isRounded ? "rounded-[20px]" : ""} ${hasBg ? "bg-tag" : ""} ${hasShadow && !isInset ? "shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" : ""}`}
          style={{ paddingTop: aspect }}
        >
          {isInset ? (
            <div
              className="absolute rounded-[20px] overflow-hidden shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] bg-bg"
              style={{ top: "6.6%", bottom: "6.6%", left: "10.3%", right: "10.3%" }}
            >
              {media}
            </div>
          ) : (
            media
          )}
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
