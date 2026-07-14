"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Work", href: "/" },
  { label: "About", href: "/about" },
  { label: "Email me", href: "mailto:contact@alexkrstovic.com" },
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
  // mounted (including during its slide-down close animation).
  useEffect(() => {
    if (!menuMounted) return;
    const html = document.documentElement;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [menuMounted]);

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
        <Link href="/" className="relative h-7 w-52 shrink-0">
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
              href="https://linkedin.com/in/alexkrstovic"
              target="_blank"
              rel="noopener noreferrer"
              className="relative size-6 hover:opacity-60 transition-opacity"
            >
              <Image src="/images/linkedin.svg" alt="LinkedIn" fill className="object-contain" unoptimized />
            </a>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center gap-2 font-[family-name:var(--font-body)] font-light text-[16px]"
          onClick={openMenu}
          aria-label="Open menu"
        >
          <span>Menu</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="var(--color-text)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {/* Mobile full-screen menu */}
      {menuMounted && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          {/* Green background — slides up shortly after the close bar */}
          <div
            className="absolute inset-0 bg-[#9dcdc5]"
            style={{
              transform: open ? "translateY(0)" : "translateY(100%)",
              transition: bgTransition(),
            }}
          />

          <div className="relative h-full flex flex-col">
            <div
              className="p-5"
              style={{
                opacity: open ? 1 : 0,
                transition: fadeTransition(150),
              }}
            >
              <Link href="/" className="relative h-[18px] w-36 shrink-0 inline-block" onClick={closeMenu}>
                <Image src="/images/logo.svg" alt="Alex Krstovic" fill className="object-contain object-left" unoptimized />
              </Link>
            </div>

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
              <a
                href="https://linkedin.com/in/alexkrstovic"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 relative size-11 hover:opacity-60 transition-opacity"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(28px)",
                  transition: fadeTransition(400 + navItems.length * 100),
                }}
              >
                <Image src="/images/linkedin.svg" alt="LinkedIn" fill className="object-contain" unoptimized />
              </a>
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
