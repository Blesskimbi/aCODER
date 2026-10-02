"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, GitBranch, Menu, X, Star } from "lucide-react";
import { NAV_GROUPS, NAV_LINKS, SITE } from "@/lib/site";
import { LogoMark } from "./LogoMark";
import { cx } from "@/components/ui/primitives";

export function Nav({ stars }: { stars: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  /** Title of the open desktop menu, or null. */
  const [menu, setMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the mobile sheet.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Dismiss an open menu on Escape or on a click outside it.
  useEffect(() => {
    if (!menu) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(null);
    };
    const onPointer = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setMenu(null);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menu]);

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || menu
          ? "border-b border-white/[0.07] bg-canvas/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div
        ref={navRef}
        className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-4 sm:px-6"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[15px] font-medium tracking-tight text-steel-50"
        >
          <LogoMark size={22} />
          A-Coder
        </Link>

        {/* ── Desktop ──────────────────────────────────────────── */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_GROUPS.map((group) => {
            const isOpen = menu === group.title;
            return (
              <div
                key={group.title}
                className="relative"
                onMouseEnter={() => setMenu(group.title)}
                onMouseLeave={() => setMenu(null)}
              >
                <button
                  onClick={() => setMenu(isOpen ? null : group.title)}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  className={cx(
                    "flex items-center gap-1 text-[13px] transition-colors",
                    isOpen ? "text-white" : "text-white/60 hover:text-white/95",
                  )}
                >
                  {group.title}
                  <ChevronDown
                    aria-hidden="true"
                    className={cx(
                      "h-3 w-3 transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="absolute left-1/2 top-full w-[320px] -translate-x-1/2 pt-3">
                    <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-panel/95 p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                      {group.items.map((item) =>
                        item.external ? (
                          <a
                            key={item.href}
                            href={item.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            onClick={() => setMenu(null)}
                            className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.05]"
                          >
                            <span className="text-[13px] text-steel-100">
                              {item.label}{" "}
                              <span aria-hidden="true" className="text-white/35">
                                ↗
                              </span>
                            </span>
                            {item.blurb && (
                              <span className="mt-0.5 block text-[11.5px] leading-snug text-white/45">
                                {item.blurb}
                              </span>
                            )}
                          </a>
                        ) : (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMenu(null)}
                            className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.05]"
                          >
                            <span className="text-[13px] text-steel-100">
                              {item.label}
                            </span>
                            {item.blurb && (
                              <span className="mt-0.5 block text-[11.5px] leading-snug text-white/45">
                                {item.blurb}
                              </span>
                            )}
                          </Link>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] text-white/60 transition-colors hover:text-white/95"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href={SITE.repoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/70 transition-colors hover:border-white/20 hover:text-white sm:inline-flex"
          >
            <GitBranch className="h-3.5 w-3.5" />
            <span className="tnum">{stars}</span>
            <Star className="h-3 w-3 fill-current" />
          </a>

          <Link
            href="/download"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-b from-steel-50 to-steel-200 px-3.5 text-[13px] font-medium text-canvas transition-all duration-200 hover:-translate-y-px hover:to-steel-100"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/70 md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* ── Mobile sheet ───────────────────────────────────────── */}
      {open && (
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/[0.07] bg-canvas/95 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col px-4 py-4">
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="mb-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                  {group.title}
                </p>
                <div className="mt-2 flex flex-col">
                  {group.items.map((item) =>
                    item.external ? (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        onClick={() => setOpen(false)}
                        className="border-b border-white/[0.05] py-3 text-[14px] text-white/75 last:border-0"
                      >
                        {item.label} ↗
                      </a>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="border-b border-white/[0.05] py-3 text-[14px] text-white/75 last:border-0"
                      >
                        {item.label}
                      </Link>
                    ),
                  )}
                </div>
              </div>
            ))}

            <div className="flex flex-col">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-white/[0.05] py-3 text-[14px] text-white/75"
                >
                  {l.label}
                </Link>
              ))}
              <a
                href={SITE.repoUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-2 py-3 text-[14px] text-white/75"
              >
                <GitBranch className="h-4 w-4" /> GitHub · {stars}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
