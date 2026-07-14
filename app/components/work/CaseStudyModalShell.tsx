"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Lenis from "lenis";
import { ModalCloseContext, useSetModalOpen } from "@/app/components/work/ModalContext";
import { MODAL_DURATION, MODAL_TRANSITION } from "@/app/components/work/modalTiming";

const SHEET_TRANSITION = `transform ${MODAL_TRANSITION}`;

export default function CaseStudyModalShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const setModalOpen = useSetModalOpen();

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    const html = document.documentElement;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    setModalOpen(true);
    return () => {
      cancelAnimationFrame(frame);
      html.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      setModalOpen(false);
    };
  }, [setModalOpen]);

  // The sheet is excluded from the root Lenis instance (see data-lenis-prevent
  // + SmoothScroll.tsx's `prevent` option) so it doesn't fight the background
  // page's scroll. That means it falls back to plain native scroll unless it
  // gets its own scoped Lenis instance — this gives it the same slow/smoothed
  // feel as the rest of the site, independent of the root instance.
  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;

    const lenis = new Lenis({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    let frameId: number;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  function requestClose() {
    if (closing) return;
    setClosing(true);
    setTimeout(() => router.back(), MODAL_DURATION);
  }

  const open = visible && !closing;

  return (
    <ModalCloseContext.Provider value={requestClose}>
      <div className="fixed inset-0 z-[200]">
        <button
          type="button"
          aria-label="Close case study"
          data-cursor-ignore
          onClick={requestClose}
          className="absolute inset-x-0 top-0 h-10 transition-opacity"
          style={{ opacity: open ? 1 : 0, transitionDuration: `${MODAL_DURATION}ms` }}
        />
        <div
          ref={wrapperRef}
          data-lenis-prevent
          className="absolute inset-x-0 bottom-0 top-10 bg-bg rounded-t-[28px] overflow-y-auto overscroll-contain shadow-2xl"
          style={{
            transform: open ? "translateY(0)" : "translateY(100%)",
            transition: SHEET_TRANSITION,
          }}
        >
          <div ref={contentRef}>{children}</div>
        </div>
      </div>
    </ModalCloseContext.Provider>
  );
}
