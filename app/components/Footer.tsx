import WordReveal from "@/app/components/WordReveal";

export default function Footer() {
  return (
    <footer className="bg-accent px-5 md:px-10 py-20">
      <h2 className="font-[family-name:var(--font-heading)] font-bold text-[42px] md:text-[64px] lg:text-[100px] text-text leading-[1.05]">
        <WordReveal text="Have a project or a role in mind? Let's talk." delay={0} stagger={45} />
      </h2>
      <div className="mt-5 font-[family-name:var(--font-body)] font-light text-[18px] md:text-[24px] lg:text-[30px] text-text leading-normal">
        <p>
          <WordReveal text="Shoot me an email and let's talk" delay={250} stagger={35} />
        </p>
        <a
          href="mailto:alexander.krstovic@gmail.com"
          className="inline-block hover:opacity-60 transition-opacity"
        >
          <WordReveal text="Email me" delay={450} stagger={45} underline />
        </a>
      </div>
    </footer>
  );
}
