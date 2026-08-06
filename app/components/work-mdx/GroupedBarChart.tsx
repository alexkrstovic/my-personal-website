"use client";

import { useEffect, useRef, useState } from "react";

export type BarSeries = {
  key: string;
  label: string;
  color: string;
  values: number[];
};

export type BenchmarkLine = {
  value: number;
  label: string;
};

const EASE = "cubic-bezier(0.22,1,0.36,1)";
// Sequencing: gridlines draw in first, then benchmark lines, then bars grow
// (staggered per category, then per series) — in that order.
const GRIDLINE_STAGGER = 30;
const BENCHMARK_BASE_DELAY = 200;
const BARS_BASE_DELAY = 400;
const CATEGORY_STAGGER = 90;
const SERIES_STAGGER = 70;

function niceStep(max: number) {
  if (max <= 1) return 0.25;
  if (max <= 2) return 0.5;
  if (max <= 5) return 1;
  if (max <= 10) return 2;
  if (max <= 100) return 20;
  return 50;
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

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

  return { ref, visible };
}

export default function GroupedBarChart({
  title,
  categories,
  series,
  unit = "",
  valueFormatter,
  benchmarks,
  tooltipExtra,
  height = 320,
  annotate,
  barWidth = 64,
  barGap = 4,
  gradient = false,
  legendStyle = "inline",
  tickSize = "sm",
  yMax,
}: {
  title: string;
  categories: string[];
  series: [BarSeries, BarSeries];
  unit?: string;
  valueFormatter?: (v: number) => string;
  benchmarks?: BenchmarkLine[];
  tooltipExtra?: (categoryIndex: number) => string | undefined;
  height?: number;
  /** Optional static callout, e.g. "4.6x more errors", pinned above one category */
  annotate?: { categoryIndex: number; text: string };
  /** Max width (px) of a single series bar */
  barWidth?: number;
  /** Gap (px) between the two series bars within one category */
  barGap?: number;
  /** Render bars as a top-to-faded gradient of the series color, matching Figma */
  gradient?: boolean;
  /** "inline" = title/legend on one row (right-aligned legend); "stacked" = legend below title, left-aligned */
  legendStyle?: "inline" | "stacked";
  /** "sm" = compact axis ticks; "lg" = bold display-size ticks matching Figma */
  tickSize?: "sm" | "lg";
  /** Force the axis ceiling instead of auto-computing it from the data */
  yMax?: number;
}) {
  // Fluid gutter (CSS clamp, not a fixed px) so the axis-label column shrinks
  // on narrow screens instead of forcing the whole chart wider than its
  // container — the fixed-px gutter + fixed-px bars were what pushed these
  // charts past the mobile viewport.
  const GUTTER = tickSize === "lg" ? "clamp(30px, 9vw, 56px)" : "clamp(24px, 7vw, 40px)";
  const gutterMinus8 = `calc(${GUTTER} - 8px)`;
  const { ref, visible } = useInView<HTMLDivElement>();

  const allValues = series
    .flatMap((s) => s.values)
    .concat(benchmarks?.map((b) => b.value) ?? []);
  const rawMax = Math.max(...allValues);
  const step = niceStep(rawMax);
  const axisMax = yMax ?? Math.ceil((rawMax * 1.05) / step) * step;
  const ticks: number[] = [];
  for (let t = 0; t <= axisMax; t += step) ticks.push(Math.round(t * 100) / 100);

  const fmt = valueFormatter ?? ((v: number) => `${Math.round(v * 10) / 10}${unit}`);

  const legend = (
    <div className={`flex flex-wrap items-center ${legendStyle === "stacked" ? "gap-x-5 gap-y-2" : "gap-x-4 gap-y-2"}`}>
      {series.map((s) => (
        <span
          key={s.key}
          className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] font-light text-[14px] text-text"
        >
          <span
            className="inline-block w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: s.color }}
            aria-hidden
          />
          {s.label}
        </span>
      ))}
    </div>
  );

  return (
    <div className="w-full" ref={ref}>
      {legendStyle === "stacked" ? (
        <div className="mb-5">
          <h3 className="font-[family-name:var(--font-heading)] font-normal text-[20px] md:text-[24px] text-text mb-2">
            {title}
          </h3>
          {legend}
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h3 className="font-[family-name:var(--font-heading)] font-normal text-[20px] md:text-[24px] text-text">
            {title}
          </h3>
          {legend}
        </div>
      )}

      <div className="relative" style={{ height }}>
        {/* gridlines + y-axis ticks */}
        {ticks.map((t, tickIndex) => (
          <div key={t} className="absolute" style={{ bottom: `${(t / axisMax) * 100}%`, left: 0, right: 0 }}>
            <span
              className={`absolute -translate-y-1/2 text-right pr-2 text-text/70 ${
                tickSize === "lg"
                  ? "font-[family-name:var(--font-heading)] font-bold text-[20px] md:text-[24px]"
                  : "font-[family-name:var(--font-body)] font-light text-[12px] text-text/60"
              }`}
              style={{ left: 0, width: gutterMinus8 }}
            >
              {t}
            </span>
            <div
              className="border-t border-text/10"
              style={{
                marginLeft: GUTTER,
                transform: visible ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
                transition: `transform 0.5s ${EASE} ${tickIndex * GRIDLINE_STAGGER}ms`,
              }}
            />
          </div>
        ))}

        {/* bars */}
        <div className="absolute inset-0 flex items-stretch gap-2 md:gap-4" style={{ left: GUTTER }}>
          {categories.map((cat, i) => {
            const extra = tooltipExtra?.(i);
            return (
              <div
                key={cat}
                tabIndex={0}
                role="group"
                aria-label={`${cat}: ${series.map((s) => `${s.label} ${fmt(s.values[i])}`).join(", ")}`}
                className="group relative flex-1 min-w-0 flex items-end justify-center outline-none"
                style={{ gap: barGap }}
              >
                {annotate?.categoryIndex === i && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-[family-name:var(--font-body)] font-semibold text-[13px] text-[#b5461f]">
                    {annotate.text}
                  </span>
                )}

                {/* tooltip */}
                <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
                  <div className="bg-text text-bg rounded-[8px] px-3 py-2 whitespace-nowrap shadow-lg">
                    <p className="font-[family-name:var(--font-heading)] font-bold text-[13px] mb-1">{cat}</p>
                    {series.map((s) => (
                      <p
                        key={s.key}
                        className="flex items-center gap-2 font-[family-name:var(--font-body)] font-light text-[13px]"
                      >
                        <span
                          className="inline-block w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: s.color }}
                        />
                        <span className="font-semibold">{fmt(s.values[i])}</span>
                        <span className="opacity-70">{s.label}</span>
                      </p>
                    ))}
                    {extra && (
                      <p className="mt-1 max-w-[220px] whitespace-normal font-[family-name:var(--font-body)] font-light text-[11px] opacity-70">
                        {extra}
                      </p>
                    )}
                  </div>
                </div>

                {series.map((s, seriesIndex) => {
                  const v = s.values[i];
                  const pct = (v / axisMax) * 100;
                  const barDelay = BARS_BASE_DELAY + i * CATEGORY_STAGGER + seriesIndex * SERIES_STAGGER;
                  return (
                    <div
                      key={s.key}
                      className="relative h-full flex-1 min-w-0 flex flex-col items-center justify-end"
                      style={{ maxWidth: barWidth }}
                    >
                      <span
                        className="mb-1 font-[family-name:var(--font-body)] font-light text-[9px] md:text-[11px] text-text whitespace-nowrap"
                        style={{ opacity: visible ? 1 : 0, transition: `opacity 0.3s ease ${barDelay + 500}ms` }}
                      >
                        {fmt(v)}
                      </span>
                      <div
                        className="w-full rounded-t-[4px] group-hover:brightness-110"
                        style={{
                          height: visible ? `${pct}%` : "0%",
                          minHeight: visible && v > 0 ? 2 : 0,
                          background: gradient
                            ? `linear-gradient(to bottom, ${s.color}, ${s.color}66)`
                            : s.color,
                          transition: `height 0.8s ${EASE} ${barDelay}ms, filter 0.15s ease`,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* benchmark reference lines — rendered after the bars so they sit visually on top */}
        {benchmarks?.map((b, bIndex) => (
          <div
            key={b.label}
            className="absolute pointer-events-none"
            style={{ bottom: `${(b.value / axisMax) * 100}%`, left: 0, right: 0 }}
          >
            <span
              className="absolute -translate-y-1/2 text-right pr-2 font-[family-name:var(--font-body)] font-light text-[11px] text-text/35"
              style={{ left: 0, width: gutterMinus8, opacity: visible ? 1 : 0, transition: `opacity 0.4s ease ${BENCHMARK_BASE_DELAY + bIndex * GRIDLINE_STAGGER}ms` }}
            >
              {b.value}
            </span>
            <div
              className="border-t border-dashed border-text/40"
              style={{
                marginLeft: GUTTER,
                transform: visible ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
                transition: `transform 0.5s ${EASE} ${BENCHMARK_BASE_DELAY + bIndex * GRIDLINE_STAGGER}ms`,
              }}
            />
            <span
              className="absolute -translate-y-[calc(100%+2px)] pl-2 font-[family-name:var(--font-body)] font-light text-[12px] text-text/45 whitespace-nowrap"
              style={{ left: GUTTER, opacity: visible ? 1 : 0, transition: `opacity 0.4s ease ${BENCHMARK_BASE_DELAY + bIndex * GRIDLINE_STAGGER}ms` }}
            >
              {b.label}
            </span>
          </div>
        ))}
      </div>

      {/* x-axis category labels */}
      <div className="flex mt-3">
        <div style={{ width: GUTTER }} className="shrink-0" />
        <div className="flex-1 flex gap-2 md:gap-4">
          {categories.map((cat) => (
            <span
              key={cat}
              className="flex-1 min-w-0 text-center font-[family-name:var(--font-body)] font-light text-[11px] md:text-[14px] text-text leading-tight"
              style={{ maxWidth: barWidth * 2 + barGap }}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
