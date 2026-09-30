import Image from "next/image";
import Link from "next/link";
import Reveal from "@/app/components/Reveal";
import WordReveal from "@/app/components/WordReveal";
import { Tag } from "@/app/components/ProjectCard";
import { urlForImage } from "@/lib/sanity/image";
import { focusToObjectPosition } from "@/lib/journal-focus";
import { formatPostDate } from "@/lib/journal-date";
import type { JournalPostMeta } from "@/lib/journal";

export default function JournalCard({
  title,
  slug,
  subtitle,
  coverImage,
  coverVideoUrl,
  coverVideoLoop,
  coverVideoFocus,
  tags,
  publishedAt,
}: JournalPostMeta) {
  const hasCover = Boolean(coverVideoUrl || coverImage);

  return (
    <article className="px-5 md:px-10 lg:px-[40px]">
      <Link
        href={`/journal/${slug}`}
        data-cursor-label="Read"
        className={`grid grid-cols-1 gap-5 ${hasCover ? "lg:grid-cols-[32.35%_1fr]" : ""}`}
      >
        <Reveal delay={0} className={hasCover ? "order-2 lg:order-1" : "max-w-[900px]"}>
          <p className="font-[family-name:var(--font-body)] font-light text-[14px] text-text/60 leading-none">
            <WordReveal text={formatPostDate(publishedAt)} delay={0} stagger={35} />
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-heading)] font-bold text-[22px] md:text-[28px] lg:text-[35px] text-text leading-none">
            <WordReveal text={title} delay={40} stagger={45} />
          </h2>
          <p className="mt-3 font-[family-name:var(--font-body)] font-light text-[16px] md:text-[20px] lg:text-[25px] text-text leading-normal">
            <WordReveal text={subtitle} delay={100} stagger={20} duration={550} />
          </p>
          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
          )}
        </Reveal>

        {hasCover && (
          <Reveal
            delay={150}
            className="relative w-full rounded-[20px] overflow-hidden order-1 lg:order-2"
          >
            <div className="relative w-full aspect-[3/2] lg:aspect-auto lg:h-[clamp(240px,42vw,600px)]">
              {coverVideoUrl ? (
                <video
                  src={coverVideoUrl}
                  autoPlay
                  loop={coverVideoLoop !== false}
                  muted
                  playsInline
                  preload="auto"
                  style={{ objectPosition: focusToObjectPosition(coverVideoFocus) }}
                  className="absolute inset-0 size-full object-cover"
                />
              ) : coverImage ? (
                <Image
                  src={urlForImage(coverImage).width(1200).height(800).url()}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 900px"
                />
              ) : null}
            </div>
          </Reveal>
        )}
      </Link>
    </article>
  );
}
