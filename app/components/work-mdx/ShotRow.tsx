import type { ReactNode } from "react";

export default function ShotRow({
  children,
  cols = 2,
}: {
  children: ReactNode;
  cols?: 2 | 3 | "2" | "3";
}) {
  const colsClass = Number(cols) === 3 ? "md:grid-cols-3" : "md:grid-cols-2";

  return (
    <div className={`grid grid-cols-1 ${colsClass} gap-5 mb-6 [&>figure]:mb-0 [&>div]:mb-0`}>
      {children}
    </div>
  );
}
