"use client";

import { Fragment, useEffect, useRef, useState } from "react";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function WordReveal({
  text,
  className,
  delay = 0,
  stagger = 50,
  duration = 650,
  underline = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  /** CSS text-decoration doesn't paint through inline-block descendants, so a
   * parent's `underline` class won't reach the masked words — draw it here instead. */
  underline?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "top",
              paddingBottom: "0.3em",
              marginBottom: "-0.3em",
            }}
          >
            <span
              style={{
                display: "inline-block",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(110%)",
                transition: `opacity ${duration}ms ${EASE} ${delay + i * stagger}ms, transform ${duration}ms ${EASE} ${delay + i * stagger}ms`,
                textDecoration: underline ? "underline" : undefined,
              }}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? (
            <span style={{ textDecoration: underline ? "underline" : undefined }}> </span>
          ) : (
            ""
          )}
        </Fragment>
      ))}
    </span>
  );
}
