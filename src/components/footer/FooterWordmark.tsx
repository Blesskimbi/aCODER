"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Giant "A-Coder" wordmark with a cursor-following reveal.
 *
 * Two stacked copies of the same text:
 *   1. base   — near-invisible fill, always present
 *   2. reveal — stroked + glowing, masked to a radial spotlight
 *
 * The spotlight is driven entirely through CSS custom properties
 * updated inside a single rAF loop. Pointer moves never touch React
 * state, so moving the mouse across the footer causes zero re-renders.
 *
 * Decorative: aria-hidden. The real, readable A-Coder link lives in the
 * footer body underneath.
 */

/** How far the spotlight travels toward the pointer each frame. */
const LERP = 0.14;

export function FooterWordmark() {
  const reducedMotion = usePrefersReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const setVars = (x: number, y: number, on: number) => {
      host.style.setProperty("--wm-x", `${x}px`);
      host.style.setProperty("--wm-y", `${y}px`);
      host.style.setProperty("--wm-on", `${on}`);
    };

    const rect = () => host.getBoundingClientRect();

    // Reduced motion: park it in the centre, no loop at all.
    if (reducedMotion) {
      const r = rect();
      setVars(r.width / 2, r.height / 2, 1);
      return;
    }

    const canHover = window.matchMedia("(hover: hover)").matches;

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let targetOn = 0;
    let curOn = 0;
    let raf = 0;
    let started = false;
    const t0 = performance.now();

    const init = () => {
      const r = rect();
      curX = targetX = r.width / 2;
      curY = targetY = r.height / 2;
    };
    init();

    // Starting the loop is deliberately not gated on the
    // IntersectionObserver alone. If IO is slow to fire — or never does,
    // as happens in a backgrounded tab — the spotlight would stay dead
    // even while the pointer is over the word. Pointer input starts it
    // directly; IO only handles the touch sweep and stopping off-screen.
    const ensureRunning = () => {
      if (started) return;
      started = true;
      raf = requestAnimationFrame(frame);
    };

    const onPointerMove = (e: PointerEvent) => {
      const r = rect();
      targetX = e.clientX - r.left;
      targetY = e.clientY - r.top;
      targetOn = 1;
      ensureRunning();
    };
    const onEnter = () => {
      targetOn = 1;
      ensureRunning();
    };
    const onLeave = () => {
      targetOn = 0;
    };

    if (canHover) {
      host.addEventListener("pointermove", onPointerMove);
      host.addEventListener("pointerenter", onEnter);
      host.addEventListener("pointerleave", onLeave);
    } else {
      // No hover (touch): drift the spotlight across the word forever so
      // the effect is still visible rather than simply absent.
      targetOn = 1;
    }

    const frame = (now: number) => {
      const r = rect();

      if (!canHover) {
        // Slow sweep, eased at the turns so it never feels mechanical.
        const t = ((now - t0) / 5200) % 1;
        targetX = r.width * (0.5 - 0.42 * Math.cos(t * Math.PI * 2));
        targetY = r.height * 0.5;
      }

      curX += (targetX - curX) * LERP;
      curY += (targetY - curY) * LERP;
      // Fade is slower than the movement so it settles rather than blinks.
      curOn += (targetOn - curOn) * 0.08;

      setVars(curX, curY, curOn);
      raf = requestAnimationFrame(frame);
    };

    // Only start the loop once the element has a real size.
    const io = new IntersectionObserver((entries) => {
      const visible = entries[0]?.isIntersecting ?? false;
      if (visible) {
        init();
        ensureRunning();
      } else if (started) {
        started = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(host);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [reducedMotion]);

  return (
    <div className="wm" ref={hostRef} aria-hidden="true">
      <div className="wm-clip">
        <span className="wm-text wm-base">A-Coder</span>
        <span className="wm-text wm-reveal">A-Coder</span>
      </div>
      <div className="wm-glow" />
    </div>
  );
}

export default FooterWordmark;
