"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const INTERACTIVE_SELECTOR = "a, button, [role='button']";
const DEFAULT_SIZE = 16;
const HOVER_PADDING = 12;
const MAGNET_STRENGTH = 0.35;
const MAGNET_MAX = 10;
const MAGNET_TRANSITION = "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)";
const MAGNET_RELEASE_MS = 350;
const REST_OPACITY_DESKTOP = 0.7;
const HOVER_OPACITY = 0.1;

type CursorState = {
  pointer: { x: number; y: number };
  target: { x: number; y: number; w: number; h: number; r: number; opacity: number; active: boolean };
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
    if (!cursor) return;

    const hasTouch = navigator.maxTouchPoints > 0;
    const { size: restSize, opacity: restOpacity } = restState(hasTouch);

    document.body.classList.add("magnet-active");
    document.body.classList.add("custom-cursor-active");

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const state: CursorState = {
      pointer,
      target: { x: pointer.x, y: pointer.y, w: restSize, h: restSize, r: restSize / 2, opacity: restOpacity, active: false },
      current: { x: pointer.x, y: pointer.y, w: restSize, h: restSize, r: restSize / 2, opacity: 0 },
      hoveredEl: null,
      releaseTimers: new WeakMap(),
    };
    stateRef.current = state;

    function resetTarget() {
      state.target.active = false;
      state.target.w = restSize;
      state.target.h = restSize;
      state.target.r = restSize / 2;
      state.target.opacity = restOpacity;
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
      const el = (e.target as Element)?.closest?.(INTERACTIVE_SELECTOR) as HTMLElement | null;
      if (!el || el.hasAttribute("data-cursor-ignore")) return;

      const rect = el.getBoundingClientRect();
      const radius = parseFloat(getComputedStyle(el).borderRadius) || 6;
      state.target.x = rect.left + rect.width / 2;
      state.target.y = rect.top + rect.height / 2;
      state.target.w = rect.width + HOVER_PADDING;
      state.target.h = rect.height + HOVER_PADDING;
      state.target.r = Math.min(radius + HOVER_PADDING / 2, state.target.h / 2);
      state.target.opacity = HOVER_OPACITY;
      state.target.active = true;

      state.hoveredEl = el;
      engageMagnet(el, pointer.x, pointer.y);
    }

    function onMouseOut(e: MouseEvent) {
      const el = (e.target as Element)?.closest?.(INTERACTIVE_SELECTOR) as HTMLElement | null;
      if (!el || el.hasAttribute("data-cursor-ignore")) return;

      resetTarget();

      if (state.hoveredEl === el) state.hoveredEl = null;
      releaseMagnet(el);
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
      className="fixed top-0 left-0 z-[9999] pointer-events-none bg-text opacity-0"
      style={{ width: DEFAULT_SIZE, height: DEFAULT_SIZE, borderRadius: "50%" }}
    />
  );
}
