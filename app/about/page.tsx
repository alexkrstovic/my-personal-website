import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Reveal from "@/app/components/Reveal";
import WordReveal from "@/app/components/WordReveal";

const title = "About — Alex Krstovic";
const description =
  "Product designer based in Vancouver, BC, specializing in complex web and mobile products.";

export const metadata = {
  title,
  description,
  openGraph: { title, description, url: "/about" },
  twitter: { card: "summary_large_image", title, description },
};

const skillGroups = [
  {
    heading: "Design",
    items: ["Product Design", "UX Research", "UI Design", "Interaction Design", "Design Systems"],
  },
  {
    heading: "Research",
    items: ["User Testing", "Competitive Analysis", "Personas", "A/B Testing", "Information Architecture"],
  },
  {
    heading: "Methodologies",
    items: ["Agile & Lean UX", "Design Thinking"],
  },
];

const tools = [
  "Figma",
  "ProtoPie",
  "Webflow",
  "Photoshop",
  "Illustrator",
  "Hotjar",
  "FullStory",
  "HTML/CSS / Javascript",
  "Basic Python",
  "Claude Code (AI-assisted development)",
];

export default function AboutPage() {
  return (
    <div className="bg-bg min-h-screen">
      <Navbar />

      <main className="pt-[68px]">
        {/* Header */}
        <div className="px-5 md:px-10 pt-16 md:pt-20">
          <h1 className="font-[family-name:var(--font-heading)] font-bold text-[42px] md:text-[60px] lg:text-[80px] text-text leading-[1.05]">
            <WordReveal text="Digital Product Designer" delay={0} stagger={60} />
          </h1>
          <p className="mt-4 font-[family-name:var(--font-body)] font-light text-[18px] md:text-[24px] lg:text-[30px] text-text leading-normal max-w-[1130px]">
            <WordReveal
              text="I'm a product designer specializing in complex web and mobile products — UX research, and UI design. I research problems and design the solutions that fit."
              delay={150}
              stagger={22}
              duration={550}
            />
          </p>
        </div>

        {/* Photo */}
        <div className="mt-10">
          <Reveal delay={0} className="relative w-full">
            <div className="relative w-full h-full" style={{ height: "clamp(280px, 43vw, 640px)" }}>
              <Image
                src="/images/about-photo.png"
                alt="Alex Krstovic"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </div>
          </Reveal>
        </div>

        {/* More about me / Skills / Tools */}
        <div className="px-5 md:px-10 mt-16 md:mt-20 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[210px_1fr] gap-5">
            <span className="font-[family-name:var(--font-heading)] font-medium text-[20px] md:text-[22px] lg:text-[25px] text-text">
              <WordReveal text="More about me" delay={0} stagger={60} />
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_440px] gap-5">
              {/* Bio */}
              <div className="max-w-[670px] flex flex-col gap-5 font-[family-name:var(--font-body)] font-light text-[16px] md:text-[18px] lg:text-[20px] text-text leading-normal">
                <p>
                  <WordReveal
                    text="I'm a product designer based in Vancouver, BC. I design web and mobile applications, mostly the complicated ones: dense information, complex workflows, and users who depend on getting things right."
                    delay={100}
                    stagger={18}
                    duration={500}
                  />
                </p>
                <p>
                  <WordReveal
                    text="My work covers the full process: user research, interaction design, prototyping, interface design, and design systems. I test with real users and let the data challenge my assumptions, and I prototype in working code, which keeps me close to developers and keeps the designs grounded in what can actually be built."
                    delay={200}
                    stagger={10}
                    duration={500}
                  />
                </p>
                <p>
                  <WordReveal
                    text="I've spent eight years in design, from leading UX at a startup to running my own freelance practice. Along the way I went back to school and completed my Bachelor of Arts in Interactive Arts and Technology at Simon Fraser University, with a concentration in Interaction Design."
                    delay={300}
                    stagger={12}
                    duration={500}
                  />
                </p>
              </div>

              {/* Skills + Tools + Education */}
              <div>
                <h2 className="font-[family-name:var(--font-heading)] font-medium text-[20px] md:text-[25px] text-text mb-4">
                  <WordReveal text="Skills" delay={200} />
                </h2>

                <div className="grid grid-cols-2 gap-5">
                  {/* Design / Research / Methodologies */}
                  <Reveal delay={250}>
                    <div className="flex flex-col gap-5">
                      {skillGroups.map((group) => (
                        <div key={group.heading}>
                          <p className="font-[family-name:var(--font-heading)] font-semibold text-[15px] text-text mb-1">
                            {group.heading}
                          </p>
                          <ul className="font-[family-name:var(--font-body)] font-light text-[15px] text-text leading-relaxed">
                            {group.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </Reveal>

                  {/* Tools */}
                  <div>
                    <h3 className="font-[family-name:var(--font-body)] font-semibold text-[15px] md:text-[17px] text-text mb-1">
                      <WordReveal text="Tools" delay={300} />
                    </h3>
                    <Reveal delay={340}>
                      <ul className="font-[family-name:var(--font-body)] font-light text-[15px] text-text leading-relaxed">
                        {tools.map((tool) => (
                          <li key={tool}>{tool}</li>
                        ))}
                      </ul>
                    </Reveal>
                  </div>
                </div>

                {/* Education — sits below the Skills/Tools row */}
                <Reveal delay={400} className="mt-8">
                  <div className="bg-[#efb65d] rounded-[10px] p-[10px] text-black">
                    <p className="font-[family-name:var(--font-heading)] font-medium text-[18px] md:text-[20px] mb-1">
                      <WordReveal text="Education" delay={40} />
                    </p>
                    <p className="font-[family-name:var(--font-heading)] font-semibold text-[15px]">
                      <WordReveal text="Simon Fraser University" delay={90} stagger={45} />
                    </p>
                    <p className="font-[family-name:var(--font-body)] font-light text-[15px] leading-relaxed">
                      <WordReveal
                        text="Bachelor of Arts, Interactive Arts and Technology"
                        delay={150}
                        stagger={25}
                        duration={500}
                      />
                      <br />
                      <WordReveal
                        text="Concentration: Interaction Design"
                        delay={330}
                        stagger={35}
                      />
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>

          <Reveal delay={450} className="flex justify-center mt-14 md:mt-20">
            <a
              href="/alexander-krstovic-resume.pdf"
              download="Alexander Krstovic Resume.pdf"
              className="inline-flex items-center gap-2 border border-text rounded-[50px] px-5 py-3 font-[family-name:var(--font-body)] font-light text-[16px] text-text hover:opacity-60 transition-opacity"
            >
              <WordReveal text="Download resume" delay={0} stagger={60} />
            </a>
          </Reveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
