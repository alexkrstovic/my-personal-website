import type { ReactNode } from "react";

export default function TextCol({
  children,
  side = "left",
}: {
  children: ReactNode;
  side?: "left" | "right";
}) {
  return (
    <div className={`w-full md:max-w-[49%] ${side === "right" ? "md:ml-auto" : ""}`}>
      {children}
    </div>
  );
}
