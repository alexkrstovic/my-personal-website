import Image from "next/image";
import Reveal from "@/app/components/Reveal";

export default function Shot({
  src,
  alt,
  caption,
  aspect = "56%",
}: {
  src: string;
  alt: string;
  caption?: string;
  aspect?: string;
}) {
  const unoptimized = src.endsWith(".svg");

  return (
    <Reveal delay={0} className="mb-6">
      <figure>
        <div
          className="relative w-full rounded-[20px] overflow-hidden bg-tag"
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
