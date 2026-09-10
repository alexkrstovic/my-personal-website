import Image from "next/image";
import { compileMDX } from "next-mdx-remote/rsc";
import { getProductCaseStudyMeta, getProductCaseStudyRaw, personalProducts } from "@/lib/products";
import Shot from "@/app/components/work-mdx/Shot";
import ShotRow from "@/app/components/work-mdx/ShotRow";
import Caption from "@/app/components/work-mdx/Caption";
import Narrow from "@/app/components/work-mdx/Narrow";
import SectionDivider from "@/app/components/work-mdx/SectionDivider";
import { Tag } from "@/app/components/ProjectCard";
import Reveal from "@/app/components/Reveal";
import WordReveal from "@/app/components/WordReveal";

const productMdxComponents = {
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
  Shot,
  ShotRow,
  Caption,
  Narrow,
};

export default async function ProductCaseStudyContent({ slug }: { slug: string }) {
  const meta = getProductCaseStudyMeta(slug);
  const raw = getProductCaseStudyRaw(slug);
  const heroProduct = personalProducts.find((p) => p.slug === slug);
  const heroVideoSrc = heroProduct?.videoSrc;
  const heroVideoPoster = heroProduct?.videoPoster;

  const { content } = await compileMDX({
    source: raw,
    components: productMdxComponents,
    options: { parseFrontmatter: true },
  });

  return (
    <>
      {/* Header */}
      <div className="px-5 md:px-10 lg:px-[40px] pt-4 text-center">
        <h1 className="font-[family-name:var(--font-heading)] font-bold text-[36px] md:text-[52px] lg:text-[80px] text-black leading-[1.05]">
          <WordReveal text={meta.title} delay={0} stagger={50} />
        </h1>
        <p className="mt-4 mx-auto font-[family-name:var(--font-body)] font-light text-[18px] md:text-[22px] lg:text-[30px] text-black leading-normal max-w-[670px]">
          <WordReveal text={meta.subtitle} delay={150} stagger={22} duration={550} />
        </p>
        {meta.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {meta.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        )}
      </div>

      {/* Hero — same video as the /my-products listing card */}
      <div className="px-5 md:px-10 lg:px-[40px] mt-10">
        <Reveal
          delay={80}
          className="relative w-full rounded-[20px] overflow-hidden border-[0.25px] border-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
        >
          <div className="relative w-full aspect-[8/5] md:h-[500px] lg:h-[700px] md:aspect-auto bg-[rgba(217,217,217,0.35)]">
            {heroVideoSrc ? (
              <video
                src={heroVideoSrc}
                poster={heroVideoPoster}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-body)] font-light text-[16px] text-text/50">
                Video coming soon
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {/* Meta + content — single narrow column, with wide image breakouts */}
      <div className="px-5 md:px-10 lg:px-[40px] mt-14 mb-[200px]">
        <div className="max-w-[1360px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <div className="order-2 md:order-none flex flex-col gap-5">
              <div>
                <h2 className="font-[family-name:var(--font-heading)] font-bold text-[25px] text-black mb-1">
                  <WordReveal text="Product type" delay={0} stagger={45} />
                </h2>
                <p className="font-[family-name:var(--font-body)] font-light text-[17px] text-black leading-relaxed">
                  <WordReveal text={meta.productType} delay={40} stagger={25} duration={500} />
                </p>
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-heading)] font-bold text-[25px] text-black mb-1">
                  <WordReveal text="Design methodology" delay={40} stagger={45} />
                </h2>
                <p className="font-[family-name:var(--font-body)] font-light text-[17px] text-black leading-relaxed">
                  <WordReveal text={meta.designMethodology} delay={80} stagger={25} duration={500} />
                </p>
              </div>
              {meta.technologies.length > 0 && (
                <div>
                  <h2 className="font-[family-name:var(--font-heading)] font-bold text-[25px] text-black mb-2">
                    <WordReveal text="Technologies used" delay={80} stagger={45} />
                  </h2>
                  <div className="flex flex-col gap-3">
                    {meta.technologies.map((group) => (
                      <Reveal key={group.label} delay={0}>
                        <h3 className="font-[family-name:var(--font-heading)] text-[20px] text-black">
                          {group.label}
                        </h3>
                        <ul className="list-disc pl-[25.5px] font-[family-name:var(--font-body)] font-light text-[17px] text-black leading-relaxed">
                          {group.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </Reveal>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h2 className="font-[family-name:var(--font-heading)] font-bold text-[25px] text-black mb-1">
                  <WordReveal text="Current phase" delay={120} stagger={45} />
                </h2>
                <p className="font-[family-name:var(--font-body)] font-light text-[17px] text-black leading-relaxed">
                  <WordReveal text={meta.currentPhase} delay={160} stagger={25} duration={500} />
                </p>
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-heading)] font-bold text-[25px] text-black mb-1">
                  <WordReveal text="Next step" delay={160} stagger={45} />
                </h2>
                <p className="font-[family-name:var(--font-body)] font-light text-[17px] text-black leading-relaxed">
                  <WordReveal text={meta.nextStep} delay={200} stagger={25} duration={500} />
                </p>
              </div>
            </div>

            {meta.productLink && (
              <div className="order-1 md:order-none">
                <h2 className="font-[family-name:var(--font-heading)] font-bold text-[35px] text-black mb-1">
                  <WordReveal text="Product" delay={0} stagger={45} />
                </h2>
                <Reveal delay={40}>
                  <a
                    href={meta.productLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] font-light text-[30px] text-black underline decoration-from-font hover:opacity-60 transition-opacity"
                  >
                    {meta.productLink.replace(/^https?:\/\//, "")}
                    <Image src="/images/link-external.svg" alt="" width={24} height={24} unoptimized />
                  </a>
                </Reveal>

                {meta.synopsis.length > 0 && (
                  <div className="mt-5">
                    <h2 className="font-[family-name:var(--font-heading)] font-bold text-[35px] text-black mb-1">
                      <WordReveal text="Product synopsis" delay={40} stagger={45} />
                    </h2>
                    {meta.synopsis.map((paragraph, i) => (
                      <Reveal key={i} delay={i * 60}>
                        <p className="mt-3 font-[family-name:var(--font-body)] font-light text-[25px] text-black leading-relaxed">
                          {paragraph}
                        </p>
                      </Reveal>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <SectionDivider />

        <article className="max-w-[1360px] mx-auto">{content}</article>
      </div>
    </>
  );
}
