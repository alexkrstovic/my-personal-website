export default function Footer() {
  return (
    <footer className="bg-accent px-5 md:px-10 py-20">
      <h2 className="font-[family-name:var(--font-heading)] font-bold text-[42px] md:text-[64px] lg:text-[100px] text-text leading-[1.05]">
        Have a project or a role in mind? Let&apos;s talk.
      </h2>
      <div className="mt-5 font-[family-name:var(--font-body)] font-light text-[18px] md:text-[24px] lg:text-[30px] text-text leading-normal">
        <p>Shoot me an email and let&apos;s talk</p>
        <a
          href="mailto:alexander.krstovic@gmail.com"
          className="inline-block underline hover:opacity-60 transition-opacity"
        >
          Email me
        </a>
      </div>
    </footer>
  );
}
