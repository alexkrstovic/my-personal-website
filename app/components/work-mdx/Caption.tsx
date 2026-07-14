import type { ReactNode } from "react";
import Reveal from "@/app/components/Reveal";
import TextCol from "@/app/components/work-mdx/TextCol";

export default function Caption({
  children,
  side = "left",
}: {
  children: ReactNode;
  side?: "left" | "right";
}) {
  return (
    <TextCol side={side}>
      <Reveal delay={0} className="mb-6">
        <p className="font-[family-name:var(--font-body)] font-semibold text-[30px] text-text leading-snug">
          {children}
        </p>
      </Reveal>
    </TextCol>
  );
}
