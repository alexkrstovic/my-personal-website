import type { Metadata } from "next";

// Only ever shown inside the Studio's Preview tab — keep it out of search.
export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
};

export default function StudioPreviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
