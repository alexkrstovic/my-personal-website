import Image from "next/image";
import Link from "next/link";
import Reveal from "@/app/components/Reveal";
import WordReveal from "@/app/components/WordReveal";
import { Tag } from "@/app/components/ProjectCard";
import type { PersonalProduct } from "@/lib/products";

export default function ProductCard({
  slug,
  name,
  description,
  tags,
  link,
  logoImage,
  videoSrc,
  hasCaseStudy,
}: PersonalProduct & { hasCaseStudy: boolean }) {
  const cardContent = (
    <>
      <Reveal
        delay={0}
        className="relative w-full rounded-[20px] overflow-hidden border-[0.25px] border-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
      >
        <div className="relative w-full aspect-[8/5] md:h-[500px] lg:h-[700px] md:aspect-auto bg-[rgba(217,217,217,0.35)]">
          {videoSrc ? (
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-body)] font-light text-[16px] text-text/50">
              Video coming soon
            </div>
          )}
          {logoImage && (
            <div className="absolute left-10 top-7 h-[57px] w-[170px]">
              <Image src={logoImage} alt={`${name} logo`} fill className="object-contain object-left" unoptimized />
            </div>
          )}
        </div>
      </Reveal>

      <Reveal delay={150} className="mt-6">
        <h2 className="font-[family-name:var(--font-heading)] font-bold text-[28px] md:text-[35px] text-black leading-none">
          <WordReveal text={name} delay={0} stagger={45} />
        </h2>
        <p className="mt-3 font-[family-name:var(--font-body)] font-light text-[18px] md:text-[25px] text-black leading-normal max-w-[440px]">
          <WordReveal text={description} delay={100} stagger={25} duration={550} />
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
        <span
          role="button"
          className="mt-4 inline-flex items-center gap-[6px] bg-[#efb65d] rounded-[5px] px-[10px] py-[5px] font-[family-name:var(--font-body)] font-light text-[16px] text-text leading-none hover:opacity-60 transition-opacity"
        >
          <WordReveal text="Explore Product" delay={250} stagger={45} />
          <Image src="/images/arrow-right.svg" alt="" width={13} height={13} unoptimized />
        </span>
      </Reveal>
    </>
  );

  return (
    <article className="px-5 md:px-10 lg:px-[155px]">
      {hasCaseStudy ? (
        <Link href={`/my-products/${slug}`} data-cursor-ignore>
          {cardContent}
        </Link>
      ) : (
        <a href={link} target="_blank" rel="noopener noreferrer" data-cursor-ignore>
          {cardContent}
        </a>
      )}
    </article>
  );
}
