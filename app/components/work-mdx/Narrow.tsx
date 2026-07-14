import type { ReactNode } from "react";

export default function Narrow({ children }: { children: ReactNode }) {
  return <div className="max-w-[900px] mx-auto">{children}</div>;
}
