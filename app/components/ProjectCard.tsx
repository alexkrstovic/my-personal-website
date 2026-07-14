import Image from "next/image";
import Link from "next/link";
import Reveal from "@/app/components/Reveal";
import type { WorkProjectMeta } from "@/lib/work";

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center bg-accent rounded-[5px] px-[10px] py-[10px] font-[family-name:var(--font-body)] font-light text-[12px] leading-none text-text whitespace-nowrap">
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
}: WorkProjectMeta) {
  return (
    <article className="px-5 md:px-10">
      <div className="grid grid-cols-1 lg:grid-cols-[32.35%_1fr] gap-5">
        <Reveal delay={0} className="order-2 lg:order-1">
          <h2 className="font-[family-name:var(--font-heading)] font-bold text-[22px] md:text-[28px] lg:text-[35px] text-text leading-none">
            {title}
          </h2>
          <p className="mt-3 font-[family-name:var(--font-body)] font-light text-[16px] md:text-[20px] lg:text-[25px] text-text leading-normal">
            {description}
          </p>
          {comingSoon ? (
            <span className="mt-4 inline-flex items-center gap-2 font-[family-name:var(--font-body)] font-light text-[16px] text-text leading-none">
              Case study coming soon
              <Image src="/images/info-circle.svg" alt="" width={24} height={24} unoptimized />
            </span>
          ) : (
            <Link
              href={`/work/${slug}`}
              className="mt-4 inline-flex items-center gap-2 font-[family-name:var(--font-body)] font-light text-[16px] text-text leading-none hover:opacity-60 transition-opacity"
            >
              Check Project
              <Image src="/images/arrow-right.svg" alt="" width={13} height={13} unoptimized />
            </Link>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </Reveal>

        <Reveal
          delay={150}
          className="relative w-full rounded-[20px] overflow-hidden order-1 lg:order-2"
        >
          {/* Below lg the image is full-width (not a 68%-width column), so
              the 42vw clamp calibrated for that narrower column crops the
              900x600 source hard. Use its real aspect ratio there instead. */}
          <div className="relative w-full aspect-[3/2] lg:aspect-auto lg:h-[clamp(240px,42vw,600px)]">
            <Image
              src={listingImage}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 900px"
            />
          </div>
        </Reveal>
      </div>
    </article>
  );
}
