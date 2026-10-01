"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Download, GitBranch, Menu, X, Star } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/site";
import { LogoMark } from "./LogoMark";
import { cx } from "@/components/ui/primitives";

export function Nav({ stars }: { stars: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-white/[0.07] bg-canvas/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[15px] font-medium tracking-tight text-steel-50"
        >
          <LogoMark size={22} />
          A-Coder
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
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

      {open && (
        <div className="border-t border-white/[0.07] bg-canvas/95 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col px-4 py-3">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/[0.05] py-3.5 text-[14px] text-white/75 last:border-0"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={SITE.repoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-2 py-3.5 text-[14px] text-white/75"
            >
              <GitBranch className="h-4 w-4" /> GitHub · {stars}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
