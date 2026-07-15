import type { ReactNode } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import { getWorkCaseStudyMeta, getWorkCaseStudyRaw } from "@/lib/work";
import Shot from "@/app/components/work-mdx/Shot";
import ShotRow from "@/app/components/work-mdx/ShotRow";
import Caption from "@/app/components/work-mdx/Caption";
import Narrow from "@/app/components/work-mdx/Narrow";
import SectionDivider from "@/app/components/work-mdx/SectionDivider";
import Reveal from "@/app/components/Reveal";
import WordReveal from "@/app/components/WordReveal";

const caseStudyMdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Narrow>
      <Reveal delay={0} className="mt-14 first:mt-0">
        <h2
          className="font-[family-name:var(--font-heading)] font-bold text-[26px] md:text-[30px] text-text leading-snug mb-5"
          {...props}
        />
      </Reveal>
    </Narrow>
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <Narrow>
      <Reveal delay={0}>
        <p
          className="font-[family-name:var(--font-body)] font-light text-[16px] md:text-[18px] text-text leading-relaxed mb-6"
          {...props}
        />
      </Reveal>
    </Narrow>
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <Narrow>
      <Reveal delay={0}>
        <ul
          className="list-disc pl-6 mb-6 space-y-2 font-[family-name:var(--font-body)] font-light text-[16px] md:text-[18px] text-text leading-relaxed"
          {...props}
        />
      </Reveal>
    </Narrow>
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold" {...props} />
  ),
  Shot,
  ShotRow,
  Caption,
  Narrow,
  Divider: SectionDivider,
};

export default async function CaseStudyContent({
  slug,
  closeButton,
}: {
  slug: string;
  closeButton: ReactNode;
}) {
  const meta = getWorkCaseStudyMeta(slug);
  const raw = getWorkCaseStudyRaw(slug);

  const { content } = await compileMDX({
    source: raw,
    components: caseStudyMdxComponents,
    options: { parseFrontmatter: true },
  });

  return (
    <>
      {closeButton}

      {/* Header */}
      <div className="px-5 md:px-10 pt-4">
        <Narrow>
          <h1 className="font-[family-name:var(--font-heading)] font-bold text-[36px] md:text-[52px] lg:text-[64px] text-text leading-[1.05]">
            <WordReveal text={meta.title} delay={0} stagger={50} />
          </h1>
          <p className="mt-4 font-[family-name:var(--font-body)] font-light text-[18px] md:text-[22px] lg:text-[26px] text-text leading-normal max-w-[670px]">
            <WordReveal text={meta.subtitle} delay={150} stagger={22} duration={550} />
          </p>
        </Narrow>
      </div>

      {/* Meta + content — single narrow column, with wide image breakouts */}
      <div className="px-5 md:px-10 mt-14 pb-20">
        <Narrow>
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="font-[family-name:var(--font-heading)] font-bold text-[18px] text-text mb-1">
                <WordReveal text="My role" delay={0} stagger={45} />
              </h2>
              {meta.role.map((line, i) => (
                <p
                  key={line}
                  className="font-[family-name:var(--font-body)] font-light text-[15px] text-text leading-relaxed"
                >
                  <WordReveal text={line} delay={40 + i * 40} stagger={25} duration={500} />
                </p>
              ))}
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-heading)] font-bold text-[18px] text-text mb-1">
                <WordReveal text="Design Methodology" delay={80} stagger={45} />
              </h2>
              <p className="font-[family-name:var(--font-body)] font-light text-[15px] text-text leading-relaxed">
                <WordReveal text={meta.methodology} delay={120} stagger={25} duration={500} />
              </p>
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-heading)] font-bold text-[18px] text-text mb-1">
                <WordReveal text="Research methods" delay={160} stagger={45} />
              </h2>
              <Reveal delay={200}>
                <ul className="font-[family-name:var(--font-body)] font-light text-[15px] text-text leading-relaxed">
                  {meta.researchMethods.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-heading)] font-bold text-[18px] text-text mb-1">
                <WordReveal text="Website platform" delay={240} stagger={45} />
              </h2>
              <p className="font-[family-name:var(--font-body)] font-light text-[15px] text-text leading-relaxed">
                <WordReveal text={meta.platform} delay={280} stagger={25} duration={500} />
              </p>
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-heading)] font-bold text-[18px] text-text mb-1">
                <WordReveal text="Tools" delay={320} />
              </h2>
              <Reveal delay={360}>
                <ul className="font-[family-name:var(--font-body)] font-light text-[15px] text-text leading-relaxed">
                  {meta.tools.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </Narrow>

        <SectionDivider />

        <article>{content}</article>
      </div>
    </>
  );
}
