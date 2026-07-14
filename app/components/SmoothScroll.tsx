"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      prevent: (node: Element) => node.closest("[data-lenis-prevent]") !== null,
    });
    lenisRef.current = lenis;

    let frameId: number;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Force scroll to top on every route change. Lenis keeps its own virtual
  // scroll position across navigations (it lives in the root layout and
  // never remounts), so a raw window.scrollTo isn't enough — it gets
  // overridden back by Lenis's next raf tick unless we go through Lenis.
  //
  // Exception: opening/closing the case-study overlay is a navigation in
  // URL terms but not in visual terms — the underlying page is still
  // sitting right there behind the modal, so its scroll position must be
  // left untouched in both directions.
  useEffect(() => {
    const previousPathname = previousPathnameRef.current;
    previousPathnameRef.current = pathname;
    const isCaseStudyTransition =
      pathname.endsWith("/case-study") || previousPathname.endsWith("/case-study");
    if (isCaseStudyTransition) return;

    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
