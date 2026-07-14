import type { ReactNode } from "react";

// Full-width strip; only the label inside (passed as children) is the
// hoverable/clickable target, not the bar itself. `stickyTop` positions it
// relative to whatever sits above it (the fixed Navbar on the full page,
// nothing inside the modal sheet), so pass the offset per context.
export default function CloseBar({
  children,
  stickyTop = 0,
}: {
  children: ReactNode;
  stickyTop?: number;
}) {
  return (
    <div
      className="sticky z-20 w-full bg-[#efb65d] flex justify-center py-[10px]"
      style={{ top: stickyTop }}
    >
      {children}
    </div>
  );
}

export function CloseBarLabel() {
  return (
    <span className="flex flex-col items-center gap-[3px]">
      <span className="font-[family-name:var(--font-body)] font-light text-[16px] text-black">
        Close
      </span>
      <span className="w-[42px] h-px bg-black" />
    </span>
  );
}
