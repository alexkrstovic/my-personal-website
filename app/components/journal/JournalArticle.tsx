import Image from "next/image";
import WordReveal from "@/app/components/WordReveal";
import Reveal from "@/app/components/Reveal";
import { Tag } from "@/app/components/ProjectCard";
import JournalBody from "@/app/components/journal/JournalBody";
import { urlForImage } from "@/lib/sanity/image";
import { focusToObjectPosition } from "@/lib/journal-focus";
import type { JournalPost } from "@/lib/journal";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// The one place a journal post's layout is defined, so the public page and
// the Studio preview can't drift apart.
export default function JournalArticle({
  post,
  priorityCover = false,
}: {
  post: JournalPost;
  priorityCover?: boolean;
}) {
  return (
    <div className="px-5 md:px-10 lg:px-[40px] pt-[40px]">
      <div className="max-w-[900px] mx-auto">
        <p className="font-[family-name:var(--font-body)] font-light text-[14px] text-text/60 leading-none">
          <WordReveal text={formatDate(post.publishedAt)} delay={0} stagger={35} />
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] font-bold text-[36px] md:text-[52px] text-black leading-[1.05]">
          <WordReveal text={post.title} delay={40} stagger={50} />
        </h1>
        <p className="mt-4 font-[family-name:var(--font-body)] font-light text-[18px] md:text-[24px] text-text leading-normal">
          <WordReveal text={post.subtitle} delay={150} stagger={22} duration={550} />
        </p>
        {post.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        )}
      </div>

      {(post.coverVideoUrl || post.coverImage) && (
        <Reveal delay={100} className="max-w-[900px] mx-auto mt-10">
          <div className="relative w-full aspect-[3/2] rounded-[20px] overflow-hidden">
            {post.coverVideoUrl ? (
              <video
                src={post.coverVideoUrl}
                autoPlay
                loop={post.coverVideoLoop !== false}
                muted
                playsInline
                preload="auto"
                style={{ objectPosition: focusToObjectPosition(post.coverVideoFocus) }}
                className="absolute inset-0 size-full object-cover"
              />
            ) : post.coverImage ? (
              <Image
                src={urlForImage(post.coverImage).width(1600).height(1067).url()}
                alt={post.title}
                fill
                className="object-cover"
                priority={priorityCover}
              />
            ) : null}
          </div>
        </Reveal>
      )}

      <div className="max-w-[900px] mx-auto mt-10 mb-[200px]">
        <JournalBody value={post.body} />
      </div>
    </div>
  );
}
