import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "next-sanity";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import { focusToObjectPosition } from "@/lib/journal-focus";
import { highlightColorOf, readableTextColor } from "@/lib/highlight-color";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-[family-name:var(--font-heading)] font-bold text-[26px] md:text-[32px] text-text leading-snug mt-12 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-[family-name:var(--font-heading)] font-bold text-[22px] md:text-[26px] text-text leading-snug mt-10 mb-3">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="font-[family-name:var(--font-body)] font-light text-[16px] md:text-[18px] text-text leading-relaxed mb-6">
        {children}
      </p>
    ),
    // A paragraph whose first letter drops into the first three lines. flow-root
    // keeps the float inside the paragraph so a short one can't spill into
    // the next block.
    dropcap: ({ children }) => (
      <p className="flow-root font-[family-name:var(--font-body)] font-light text-[16px] md:text-[18px] text-text leading-relaxed mb-6 first-letter:float-left first-letter:font-[family-name:var(--font-heading)] first-letter:font-bold first-letter:text-[5.74em] first-letter:leading-[0.78] first-letter:mt-[0.0475em] first-letter:-ml-[0.04em] first-letter:mr-[0.05em]">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-text/30 pl-5 my-6 font-[family-name:var(--font-body)] font-light italic text-[18px] md:text-[20px] text-text/80 leading-relaxed">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-6 space-y-2 font-[family-name:var(--font-body)] font-light text-[16px] md:text-[18px] text-text leading-relaxed">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-6 space-y-2 font-[family-name:var(--font-body)] font-light text-[16px] md:text-[18px] text-text leading-relaxed">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    // Value is the chosen color for new highlights; text highlighted before
    // colors existed has no value and falls back to the brand yellow.
    highlight: ({ value, children }) => {
      const bg = highlightColorOf(value);
      return (
        <mark
          className="rounded-[3px] px-[2px]"
          style={{
            backgroundColor: bg,
            color: readableTextColor(bg),
            boxDecorationBreak: "clone",
            WebkitBoxDecorationBreak: "clone",
          }}
        >
          {children}
        </mark>
      );
    },
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-[2px] underline-offset-4 hover:opacity-60 transition-opacity"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => (
      <div className="relative w-full aspect-[3/2] rounded-[20px] overflow-hidden my-8">
        <Image
          src={urlForImage(value).width(1600).height(1067).url()}
          alt={value.alt ?? ""}
          fill
          className="object-cover"
        />
      </div>
    ),
    video: ({ value }) => (
      <div className="relative w-full aspect-[3/2] rounded-[20px] overflow-hidden my-8">
        <video
          src={value.videoUrl}
          controls
          loop={Boolean(value.loop)}
          playsInline
          style={{ objectPosition: focusToObjectPosition(value.focus) }}
          className="absolute inset-0 size-full object-cover"
        />
      </div>
    ),
  },
};

export default function JournalBody({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
