"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Download, Menu, Star, X as CloseIcon } from "lucide-react";
import {
  NAV_GROUPS,
  NAV_LINKS,
  SITE,
  SIGNUP_URL,
  SOCIAL,
  UPSTREAM_DISCORD,
  type NavItem,
  type SocialId,
} from "@/lib/site";
import { LogoMark } from "./LogoMark";
import { GithubIcon, DiscordIcon } from "@/components/ui/BrandIcons";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { cx } from "@/components/ui/primitives";

/**
 * Community menu items.
 *
 * Built from the social config, so an account that does not exist yet
 * cannot appear here. Void's Discord is appended separately and labelled
 * as the upstream project's server — A-Coder has none of its own.
 */
function communityItems(): Array<NavItem & { social?: SocialId }> {
  const items: Array<NavItem & { social?: SocialId }> = SOCIAL.filter(
    (s) => s.url !== null,
  ).map((s) => ({
    label: s.label,
    href: s.url as string,
    blurb: s.blurb,
    external: true,
    social: s.id,
  }));

  items.push(
    { label: "Community page", href: "/community", blurb: "Every channel, and what is missing" },
    {
      label: "Void Discord",
      href: UPSTREAM_DISCORD,
      blurb: "The upstream project, not A-Coder",
      external: true,
      social: "discord",
    },
  );

  return items;
}

export function Nav({ stars }: { stars: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  /** Title of the open desktop menu, or null. */
  const [menu, setMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const GROUPS = [
    ...NAV_GROUPS.map((g) => ({ title: g.title, items: g.items as Array<NavItem & { social?: SocialId }> })),
    { title: "Community", items: communityItems() },
  ];

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
          className="flex shrink-0 items-center gap-2.5 text-[15px] font-medium tracking-tight text-steel-50"
        >
          <LogoMark size={22} />
          A-Coder
        </Link>

        {/* ── Desktop ──────────────────────────────────────────────
            Shown from lg rather than md: six items plus two buttons
            crowd a tablet-width bar. */}
        <nav className="hidden items-center gap-6 lg:flex">
          {GROUPS.map((group) => {
            const isOpen = menu === group.title;
            return (
              <div
                key={group.title}
                className="relative"
                onMouseEnter={() => setMenu(group.title)}
                onMouseLeave={() => setMenu(null)}
              >
                {/* No caret — hovering the label reveals the menu. */}
                <button
                  onClick={() => setMenu(isOpen ? null : group.title)}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  className={cx(
                    "text-[13px] transition-colors",
                    isOpen ? "text-white" : "text-white/60 hover:text-white/95",
                  )}
                >
                  {group.title}
                </button>

                {isOpen && (
                  <div className="absolute left-1/2 top-full w-[320px] -translate-x-1/2 pt-3">
                    <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-panel/95 p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                      {group.items.map((item) => {
                        const body = (
                          <>
                            <span className="flex items-center gap-2 text-[13px] text-steel-100">
                              {item.social && (
                                <SocialIcon
                                  id={item.social}
                                  className="h-3.5 w-3.5 shrink-0 text-white/55"
                                />
                              )}
                              {item.label}
                            </span>
                            {item.blurb && (
                              <span
                                className={cx(
                                  "mt-0.5 block text-[11.5px] leading-snug text-white/45",
                                  item.social && "pl-[22px]",
                                )}
                              >
                                {item.blurb}
                              </span>
                            )}
                          </>
                        );

                        return item.external ? (
                          <a
                            key={item.href}
                            href={item.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            onClick={() => setMenu(null)}
                            className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.05]"
                          >
                            {body}
                          </a>
                        ) : (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMenu(null)}
                            className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.05]"
                          >
                            {body}
                          </Link>
                        );
                      })}
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

        <div className="flex shrink-0 items-center gap-2.5">
          <a
            href={SITE.repoUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`A-Coder on GitHub, ${stars} stars`}
            className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/70 transition-colors hover:border-white/20 hover:text-white sm:inline-flex"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            <span className="tnum">{stars}</span>
            <Star aria-hidden="true" className="h-3 w-3 fill-current" />
          </a>

          <a
            href={SIGNUP_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden h-9 items-center rounded-lg border border-white/12 bg-white/[0.04] px-3.5 text-[13px] font-medium text-white/85 transition-all duration-200 hover:-translate-y-px hover:border-white/22 hover:bg-white/[0.07] sm:inline-flex"
          >
            Sign up
          </a>

          <Link
            href="/download"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-b from-steel-50 to-steel-200 px-3.5 text-[13px] font-medium text-canvas transition-all duration-200 hover:-translate-y-px hover:to-steel-100"
          >
            <Download aria-hidden="true" className="h-3.5 w-3.5" />
            Download
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/70 lg:hidden"
          >
            {open ? (
              <CloseIcon aria-hidden="true" className="h-4 w-4" />
            ) : (
              <Menu aria-hidden="true" className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile sheet ───────────────────────────────────────── */}
      {open && (
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/[0.07] bg-canvas/95 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col px-4 py-4">
            {GROUPS.map((group) => (
              <div key={group.title} className="mb-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                  {group.title}
                </p>
                <div className="mt-2 flex flex-col">
                  {group.items.map((item) => {
                    const label = (
                      <span className="flex items-center gap-2">
                        {item.social && (
                          <SocialIcon
                            id={item.social}
                            className="h-4 w-4 shrink-0 text-white/55"
                          />
                        )}
                        {item.label}
                      </span>
                    );
                    return item.external ? (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        onClick={() => setOpen(false)}
                        className="border-b border-white/[0.05] py-3 text-[14px] text-white/75 last:border-0"
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="border-b border-white/[0.05] py-3 text-[14px] text-white/75 last:border-0"
                      >
                        {label}
                      </Link>
                    );
                  })}
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
                className="flex items-center gap-2 border-b border-white/[0.05] py-3 text-[14px] text-white/75"
              >
                <GithubIcon className="h-4 w-4" /> GitHub · {stars}
              </a>
              <a
                href={UPSTREAM_DISCORD}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-2 py-3 text-[14px] text-white/75"
              >
                <DiscordIcon className="h-4 w-4" /> Void Discord (upstream)
              </a>
            </div>

            <a
              href={SIGNUP_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-lg border border-white/12 bg-white/[0.05] text-[14px] font-medium text-white/90"
            >
              Sign up
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
