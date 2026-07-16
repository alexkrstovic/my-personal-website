"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const INTERACTIVE_SELECTOR = "a, button, [role='button']";
const LABEL_SELECTOR = "[data-cursor-label]";
const HOVER_SELECTOR = `${INTERACTIVE_SELECTOR}, ${LABEL_SELECTOR}`;
const DEFAULT_SIZE = 16;
const HOVER_PADDING = 12;
const MAGNET_STRENGTH = 0.35;
const MAGNET_MAX = 10;
const MAGNET_TRANSITION = "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)";
const MAGNET_RELEASE_MS = 350;
const REST_OPACITY_DESKTOP = 0.7;
const HOVER_OPACITY = 0.1;
const LABEL_HEIGHT = 34;
const LABEL_PADDING_X = 20;
const LABEL_OPACITY = 0.95;

type CursorState = {
  pointer: { x: number; y: number };
  target: { x: number; y: number; w: number; h: number; r: number; opacity: number; active: boolean; label: string | null };
  current: { x: number; y: number; w: number; h: number; r: number; opacity: number };
  hoveredEl: HTMLElement | null;
  releaseTimers: WeakMap<HTMLElement, ReturnType<typeof setTimeout>>;
};

function restState(hasTouch: boolean) {
  // Touch-capable devices (iPad chief among them) can't have their native
  // cursor suppressed from web content — confirmed on-device that
  // `cursor: none` doesn't hide it there. Rather than show a full-time ball
  // competing with the native one, collapse it to nothing at rest and only
  // let it grow into view when it morphs over an interactive element — same
  // shape-matching effect, without a permanently-visible second cursor.
  const size = hasTouch ? 0 : DEFAULT_SIZE;
  const opacity = hasTouch ? 0 : REST_OPACITY_DESKTOP;
  return { size, opacity };
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const stateRef = useRef<CursorState | null>(null);
  const pathname = usePathname();
  const [mouseDetected, setMouseDetected] = useState(false);

  useEffect(() => {
    if (mouseDetected) return;
    function onPointerMove(e: PointerEvent) {
      if (e.pointerType === "mouse") setMouseDetected(true);
    }
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [mouseDetected]);

  useEffect(() => {
    if (!mouseDetected) return;

    const cursor = cursorRef.current;
    const label = labelRef.current;
    if (!cursor || !label) return;

    const hasTouch = navigator.maxTouchPoints > 0;
    const { size: restSize, opacity: restOpacity } = restState(hasTouch);

    document.body.classList.add("magnet-active");
    document.body.classList.add("custom-cursor-active");

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const state: CursorState = {
      pointer,
      target: { x: pointer.x, y: pointer.y, w: restSize, h: restSize, r: restSize / 2, opacity: restOpacity, active: false, label: null },
      current: { x: pointer.x, y: pointer.y, w: restSize, h: restSize, r: restSize / 2, opacity: 0 },
      hoveredEl: null,
      releaseTimers: new WeakMap(),
    };
    stateRef.current = state;

    function setLabel(text: string | null) {
      if (state.target.label === text) return;
      state.target.label = text;
      label!.textContent = text ?? "";
      label!.style.opacity = text ? "1" : "0";
    }

    function resetTarget() {
      state.target.active = false;
      state.target.w = restSize;
      state.target.h = restSize;
      state.target.r = restSize / 2;
      state.target.opacity = restOpacity;
      setLabel(null);
    }

    function applyMagnet(el: HTMLElement, clientX: number, clientY: number) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, (clientX - cx) * MAGNET_STRENGTH));
      const dy = Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, (clientY - cy) * MAGNET_STRENGTH));
      el.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
    }

    function engageMagnet(el: HTMLElement, clientX: number, clientY: number) {
      const pendingRelease = state.releaseTimers.get(el);
      if (pendingRelease) {
        clearTimeout(pendingRelease);
        state.releaseTimers.delete(el);
      }
      el.style.transition = MAGNET_TRANSITION;
      applyMagnet(el, clientX, clientY);
    }

    function releaseMagnet(el: HTMLElement) {
      el.style.transform = "translate3d(0, 0, 0)";
      const timer = setTimeout(() => {
        el.style.transition = "";
        el.style.transform = "";
        state.releaseTimers.delete(el);
      }, MAGNET_RELEASE_MS);
      state.releaseTimers.set(el, timer);
    }

    function onMouseMove(e: MouseEvent) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!state.target.active) {
        state.target.x = pointer.x;
        state.target.y = pointer.y;
      }
      state.current.opacity = state.current.opacity || restOpacity;
      if (state.hoveredEl && document.contains(state.hoveredEl)) {
        applyMagnet(state.hoveredEl, e.clientX, e.clientY);
      } else if (state.hoveredEl) {
        // Hovered element was removed from the DOM without a mouseout
        // (e.g. a Next.js client-side route change) — drop the stale hover.
        state.hoveredEl = null;
        resetTarget();
      }
    }

    function onMouseOver(e: MouseEvent) {
      const el = (e.target as Element)?.closest?.(HOVER_SELECTOR) as HTMLElement | null;
      if (!el || el.hasAttribute("data-cursor-ignore")) return;

      const labelText = el.getAttribute("data-cursor-label");
      if (labelText) {
        // A large hover zone (e.g. a whole card) rather than a specific
        // control — grow into a labeled pill that keeps following the
        // pointer, instead of snapping/shape-matching to the zone's bounds.
        // Sized to hug the text itself (not a fixed circle) so the label
        // stays fully legible instead of spilling past a too-small ball —
        // past its edge the label text (bg-colored) becomes invisible
        // against the page background, which is the same color.
        state.target.active = false;
        setLabel(labelText);
        state.target.w = label!.offsetWidth + LABEL_PADDING_X * 2;
        state.target.h = LABEL_HEIGHT;
        state.target.r = LABEL_HEIGHT / 2;
        state.target.opacity = LABEL_OPACITY;
        return;
      }

      const rect = el.getBoundingClientRect();
      const radius = parseFloat(getComputedStyle(el).borderRadius) || 6;
      state.target.x = rect.left + rect.width / 2;
      state.target.y = rect.top + rect.height / 2;
      state.target.w = rect.width + HOVER_PADDING;
      state.target.h = rect.height + HOVER_PADDING;
      state.target.r = Math.min(radius + HOVER_PADDING / 2, state.target.h / 2);
      state.target.opacity = HOVER_OPACITY;
      state.target.active = true;
      setLabel(null);

      state.hoveredEl = el;
      engageMagnet(el, pointer.x, pointer.y);
    }

    function onMouseOut(e: MouseEvent) {
      const el = (e.target as Element)?.closest?.(HOVER_SELECTOR) as HTMLElement | null;
      if (!el || el.hasAttribute("data-cursor-ignore")) return;

      resetTarget();

      if (state.hoveredEl === el) state.hoveredEl = null;
      if (!el.hasAttribute("data-cursor-label")) releaseMagnet(el);
    }

    const onMouseDown = () => {
      cursor.style.setProperty("--press-scale", "0.85");
    };
    const onMouseUp = () => {
      cursor.style.setProperty("--press-scale", "1");
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver, true);
    document.addEventListener("mouseout", onMouseOut, true);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    let frameId: number;
    const tick = () => {
      const followX = state.target.active ? state.target.x : pointer.x;
      const followY = state.target.active ? state.target.y : pointer.y;

      state.current.x += (followX - state.current.x) * 0.25;
      state.current.y += (followY - state.current.y) * 0.25;
      state.current.w += (state.target.w - state.current.w) * 0.2;
      state.current.h += (state.target.h - state.current.h) * 0.2;
      state.current.r += (state.target.r - state.current.r) * 0.2;
      state.current.opacity += (state.target.opacity - state.current.opacity) * 0.15;

      cursor.style.width = `${state.current.w}px`;
      cursor.style.height = `${state.current.h}px`;
      cursor.style.borderRadius = `${state.current.r}px`;
      cursor.style.opacity = String(state.current.opacity);
      cursor.style.transform = `translate(${state.current.x - state.current.w / 2}px, ${state.current.y - state.current.h / 2}px) scale(var(--press-scale, 1))`;

      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver, true);
      document.removeEventListener("mouseout", onMouseOut, true);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.body.classList.remove("magnet-active");
      document.body.classList.remove("custom-cursor-active");
      if (state.hoveredEl) {
        state.hoveredEl.style.transition = "";
        state.hoveredEl.style.transform = "";
      }
      stateRef.current = null;
    };
  }, [mouseDetected]);

  // Reset any lingering hover/magnet state on client-side route changes —
  // navigating away removes the hovered element without firing mouseout.
  useEffect(() => {
    const state = stateRef.current;
    if (!state) return;

    if (state.hoveredEl) {
      state.hoveredEl.style.transition = "";
      state.hoveredEl.style.transform = "";
    }
    state.hoveredEl = null;
    state.target.active = false;
    state.target.label = null;
    if (labelRef.current) {
      labelRef.current.textContent = "";
      labelRef.current.style.opacity = "0";
    }
    const { size: restSize, opacity: restOpacity } = restState(navigator.maxTouchPoints > 0);
    state.target.w = restSize;
    state.target.h = restSize;
    state.target.r = restSize / 2;
    state.target.opacity = restOpacity;
  }, [pathname]);

  return (
    <div
      ref={cursorRef}
      aria-hidden
      className="fixed top-0 left-0 z-[9999] pointer-events-none bg-text opacity-0 flex items-center justify-center"
      style={{ width: DEFAULT_SIZE, height: DEFAULT_SIZE, borderRadius: "50%" }}
    >
      <span
        ref={labelRef}
        className="font-[family-name:var(--font-body)] font-light text-[15px] text-bg whitespace-nowrap opacity-0"
        style={{ transition: "opacity 0.25s ease" }}
      />
    </div>
  );
}
