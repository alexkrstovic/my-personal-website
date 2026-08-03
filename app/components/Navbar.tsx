"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Work", href: "/" },
  { label: "About", href: "/about" },
  { label: "Email me", href: "mailto:alexander.krstovic@gmail.com" },
];

function isActive(pathname: string, href: string): boolean {
  if (href.startsWith("mailto:")) return false;
  if (href === "/") return pathname === "/" || pathname.startsWith("/work");
  return pathname === href || pathname.startsWith(`${href}/`);
}

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const CLOSE_DURATION = 400;

export default function Navbar() {
  const pathname = usePathname();
  const [menuMounted, setMenuMounted] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    if (!menuMounted) return;
    const id = requestAnimationFrame(() => setMenuVisible(true));
    return () => cancelAnimationFrame(id);
  }, [menuMounted]);

  // Lock the background page's scroll for as long as the mobile menu is
  // mounted (including during its slide-down close animation). Uses
  // position:fixed rather than overflow:hidden — the menu panel now
  // covers all the way to the very top of the screen (under the status
  // bar), and overflow:hidden in that situation lets iOS Safari's dynamic
  // toolbar collapse mid-animation, which visibly stutters the slide-up.
  // position:fixed doesn't trigger that toolbar recalculation.
  useEffect(() => {
    if (!menuMounted) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      window.scrollTo(0, scrollY);
    };
  }, [menuMounted]);

  // Explicitly declare the status-bar/toolbar tint while the menu is open
  // rather than letting iOS Safari guess it by sampling page content —
  // that guess can get stuck on the menu's green after it closes.
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    const previousContent = meta.getAttribute("content");
    meta.setAttribute("content", menuVisible ? "#9dcdc5" : "#f7efed");
    return () => {
      if (previousContent !== null) meta.setAttribute("content", previousContent);
    };
  }, [menuVisible]);

  function openMenu() {
    setMenuMounted(true);
  }

  function closeMenu() {
    setMenuVisible(false);
    setTimeout(() => setMenuMounted(false), CLOSE_DURATION);
  }

  const open = menuVisible;

  function barTransition() {
    return open ? `transform 0.5s ${EASE}` : `transform ${CLOSE_DURATION}ms ${EASE}`;
  }
  function bgTransition() {
    return open ? `transform 0.6s ${EASE} 150ms` : `transform ${CLOSE_DURATION}ms ${EASE}`;
  }
  function fadeTransition(openDelayMs: number) {
    return open
      ? `opacity 0.8s ${EASE} ${openDelayMs}ms, transform 0.8s ${EASE} ${openDelayMs}ms`
      : `opacity ${CLOSE_DURATION}ms ${EASE}, transform ${CLOSE_DURATION}ms ${EASE}`;
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 py-5">
        <Link href="/" className="relative h-[55px] w-[95px] shrink-0">
          <Image
            src="/images/logo.svg"
            alt="Alex Krstovic"
            fill
            className="object-contain object-left"
            priority
            unoptimized
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-7">
            {navItems.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className={`font-[family-name:var(--font-body)] font-light text-[16px] text-text leading-none hover:opacity-60 transition-opacity ${
                  isActive(pathname, href) ? "underline underline-offset-4" : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-[10px]">
            <a
              href="https://github.com/alexkrstovic"
              target="_blank"
              rel="noopener noreferrer"
              className="relative size-6 hover:opacity-60 transition-opacity"
            >
              <Image src="/images/github.svg" alt="GitHub" fill className="object-contain" unoptimized />
            </a>
            <a
              href="https://linkedin.com/in/alexkrstovic"
              target="_blank"
              rel="noopener noreferrer"
              className="relative size-6 hover:opacity-60 transition-opacity"
            >
              <Image src="/images/linkedin.svg" alt="LinkedIn" fill className="object-contain" unoptimized />
            </a>
          </div>
        </div>

        {/* Mobile menu button — fades out while the menu is open, since
            the yellow "Close menu" bar takes over as the close affordance. */}
        <button
          className="md:hidden flex items-center gap-2 font-[family-name:var(--font-body)] font-light text-[16px]"
          onClick={openMenu}
          aria-label="Open menu"
          style={{
            opacity: open ? 0 : 1,
            pointerEvents: open ? "none" : "auto",
            transition: `opacity 300ms ${EASE}`,
          }}
        >
          <span>Menu</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="var(--color-text)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {/* Mobile full-screen menu — covers the full viewport, but sits
          below the fixed nav bar (z-40 vs the nav's z-50) so the real
          logo stays visible on top of it; no separate logo in the panel. */}
      {menuMounted && (
        <div className="fixed inset-0 z-40 overflow-hidden">
          {/* Green background — slides up shortly after the close bar */}
          <div
            className="absolute inset-0 bg-[#9dcdc5]"
            style={{
              transform: open ? "translateY(0)" : "translateY(100%)",
              transition: bgTransition(),
            }}
          />

          <div className="relative h-full flex flex-col">
            <div className="flex-1 flex flex-col items-end justify-end px-5 pb-10 gap-0 overflow-y-auto">
              <nav className="flex flex-col items-end gap-[5px]">
                {navItems.map(({ label, href }, i) => (
                  <Link
                    key={label}
                    href={href}
                    className={`font-[family-name:var(--font-heading)] font-bold text-[clamp(44px,15vw,80px)] leading-[1.1] text-black hover:opacity-60 transition-opacity ${
                      isActive(pathname, href) ? "underline underline-offset-8" : ""
                    }`}
                    style={{
                      opacity: open ? 1 : 0,
                      transform: open ? "translateY(0)" : "translateY(28px)",
                      transition: fadeTransition(400 + i * 100),
                    }}
                    onClick={closeMenu}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
              <div
                className="mt-10 flex items-center gap-[10px]"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(28px)",
                  transition: fadeTransition(400 + navItems.length * 100),
                }}
              >
                <a
                  href="https://github.com/alexkrstovic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative size-11 hover:opacity-60 transition-opacity"
                >
                  <Image src="/images/github.svg" alt="GitHub" fill className="object-contain" unoptimized />
                </a>
                <a
                  href="https://linkedin.com/in/alexkrstovic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative size-11 hover:opacity-60 transition-opacity"
                >
                  <Image src="/images/linkedin.svg" alt="LinkedIn" fill className="object-contain" unoptimized />
                </a>
              </div>
            </div>

            {/* Yellow close bar — pops up first, slides back down on close */}
            <button
              className="w-full bg-[#efb65d] py-5 text-center font-[family-name:var(--font-body)] font-light text-[16px] text-black hover:opacity-60 transition-opacity"
              style={{
                transform: open ? "translateY(0)" : "translateY(100%)",
                transition: barTransition(),
              }}
              onClick={closeMenu}
              aria-label="Close menu"
            >
              Close menu
            </button>
          </div>
        </div>
      )}
    </>
  );
}
