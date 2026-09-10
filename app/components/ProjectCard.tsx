import Image from "next/image";
import Link from "next/link";
import Reveal from "@/app/components/Reveal";
import WordReveal from "@/app/components/WordReveal";
import type { WorkProjectMeta } from "@/lib/work";

export function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center bg-[rgba(217,217,217,0.65)] rounded-[5px] px-[10px] py-[10px] font-[family-name:var(--font-body)] font-light text-[12px] leading-none text-text whitespace-nowrap">
      {label}
    </span>
  );
}

export default function ProjectCard({
  slug,
  title,
  description,
  tags,
  listingImage,
  comingSoon,
  href,
  ctaLabel = "Explore Project",
  videoSrc,
  videoPoster,
}: Pick<WorkProjectMeta, "slug" | "title" | "description" | "tags" | "listingImage" | "comingSoon"> & {
  href?: string;
  ctaLabel?: string;
  videoSrc?: string;
  videoPoster?: string;
}) {
  const cardContent = (
    <>
      <Reveal delay={0} className="order-2 lg:order-1">
        <h2 className="font-[family-name:var(--font-heading)] font-bold text-[22px] md:text-[28px] lg:text-[35px] text-text leading-none">
          <WordReveal text={title} delay={0} stagger={45} />
        </h2>
        <p className="mt-3 font-[family-name:var(--font-body)] font-light text-[16px] md:text-[20px] lg:text-[25px] text-text leading-normal">
          <WordReveal text={description} delay={100} stagger={25} duration={550} />
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
        {comingSoon ? (
          <span className="mt-4 inline-flex items-center gap-2 font-[family-name:var(--font-body)] font-light text-[16px] text-text leading-none">
            <WordReveal text="Case study coming soon" delay={250} stagger={45} />
            <Image src="/images/info-circle.svg" alt="" width={24} height={24} unoptimized />
          </span>
        ) : (
          <span
            role="button"
            className="mt-4 inline-flex items-center gap-[6px] bg-[#efb65d] rounded-[5px] px-[10px] py-[5px] font-[family-name:var(--font-body)] font-light text-[16px] text-text leading-none hover:opacity-60 transition-opacity"
          >
            <WordReveal text={ctaLabel} delay={250} stagger={45} />
            <Image src="/images/arrow-right.svg" alt="" width={13} height={13} unoptimized />
          </span>
        )}
      </Reveal>

      <Reveal
        delay={150}
        className="relative w-full rounded-[20px] overflow-hidden order-1 lg:order-2"
      >
        {/* Below lg the image is full-width (not a 68%-width column), so
            the 42vw clamp calibrated for that narrower column crops the
            900x600 source hard. Use its real aspect ratio there instead. */}
        <div className="relative w-full aspect-[3/2] lg:aspect-auto lg:h-[clamp(240px,42vw,600px)]">
          {videoSrc ? (
            <video
              src={videoSrc}
              poster={videoPoster}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 size-full rounded-[20px] border-[0.25px] border-black object-cover"
            />
          ) : listingImage ? (
            <Image
              src={listingImage}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 900px"
            />
          ) : (
            <div className="absolute inset-0 rounded-[20px] border-[0.25px] border-black" />
          )}
        </div>
      </Reveal>
    </>
  );

  return (
    <article className="px-5 md:px-10">
      {comingSoon ? (
        <div className="grid grid-cols-1 lg:grid-cols-[32.35%_1fr] gap-5">{cardContent}</div>
      ) : (
        <Link
          href={href ?? `/work/${slug}`}
          data-cursor-label="Explore"
          className="grid grid-cols-1 lg:grid-cols-[32.35%_1fr] gap-5"
        >
          {cardContent}
        </Link>
      )}
    </article>
  );
}
