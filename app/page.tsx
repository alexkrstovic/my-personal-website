import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProjectCard from "@/app/components/ProjectCard";
import Reveal from "@/app/components/Reveal";
import WordReveal from "@/app/components/WordReveal";
import { getAllWorkProjects } from "@/lib/work";

export default function Home() {
  const projects = getAllWorkProjects();

  return (
    <div className="bg-bg min-h-screen">
      <Navbar />

      {/* Hero */}
      <section id="work" className="pt-[68px]">
        <div className="px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[43%_57%] items-end gap-8 pt-32 lg:pt-[374px] pb-20 md:pb-24 lg:pb-28">
            {/* Scroll hint — desktop left column */}
            <Reveal delay={450} className="hidden lg:flex items-center gap-2 self-end pb-1">
              <span className="font-[family-name:var(--font-body)] font-light text-[16px] text-text leading-none">
                Scroll for featured work
              </span>
              <div className="relative size-6 -rotate-90">
                <Image src="/images/arrow-down.svg" alt="" fill className="object-contain" unoptimized />
              </div>
            </Reveal>

            {/* Heading + subtitle */}
            <div>
              <h1 className="font-[family-name:var(--font-heading)] font-bold text-[42px] md:text-[60px] lg:text-[80px] text-text leading-[1.05]">
                <WordReveal text="Digital Product Designer from Vancouver" delay={0} />
              </h1>
              <p className="mt-5 font-[family-name:var(--font-body)] font-light text-[18px] md:text-[24px] lg:text-[30px] text-text leading-normal">
                <WordReveal text="Helping individuals and companies build great digital products" delay={300} />
              </p>
              {/* Scroll hint — mobile */}
              <Reveal delay={300} className="mt-8 flex items-center gap-2 lg:hidden">
                <span className="font-[family-name:var(--font-body)] font-light text-[16px] text-text leading-none">
                  Scroll for featured work
                </span>
                <div className="relative size-6 -rotate-90">
                  <Image src="/images/arrow-down.svg" alt="" fill className="object-contain" unoptimized />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="flex flex-col gap-20 pb-20">
        {projects.map((project) => (
          <ProjectCard key={project.slug} {...project} />
        ))}
      </section>

      <Footer />
    </div>
  );
}
