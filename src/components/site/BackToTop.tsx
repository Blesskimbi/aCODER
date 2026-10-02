"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cx } from "@/components/ui/primitives";

/**
 * Scroll-to-top control.
 *
 * Appears once the page has scrolled past roughly one viewport, so it
 * never covers content on a short page. Honours prefers-reduced-motion by
 * jumping instead of smooth-scrolling, and it is a real button so it is
 * reachable by keyboard and announced to screen readers.
 */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      // Kept out of the tab order while invisible, so it is not a
      // focusable control sitting on top of nothing.
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={cx(
        "fixed bottom-6 right-6 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full",
        "border border-white/12 bg-panel/85 text-white/70 backdrop-blur-xl",
        "shadow-[0_10px_30px_-12px_rgba(0,0,0,0.9)]",
        "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-0.5 hover:border-white/25 hover:text-white",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400",
        show
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      )}
    >
      <ArrowUp aria-hidden="true" className="h-4 w-4" />
    </button>
  );
}
