"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/* ═══════════════════════════════════════════════════════════════
   Logo3D — the loading and fallback shell around the scene.

   Guarantees, in order of priority:
     1. No layout shift. The aspect-ratio box is reserved before
        anything loads, so CLS stays at zero.
     2. Never blocks the hero. The scene is dynamically imported
        with ssr:false and only mounts after first paint.
     3. Degrades honestly. No WebGL → static poster.
        prefers-reduced-motion → scene renders, but settled and still.
     4. Costs nothing off-screen. Scrolled away → frameloop stops.
   ═══════════════════════════════════════════════════════════════ */

const LogoScene = dynamic(() => import("./LogoScene"), {
  ssr: false,
  loading: () => <PosterFallback dim />,
});

function PosterFallback({ dim = false }: { dim?: boolean }) {
  return (
    <div
      className="absolute inset-0 grid place-items-center"
      aria-hidden="true"
    >
      <Image
        src="/brand/logo-poster.webp"
        alt=""
        width={512}
        height={512}
        priority={false}
        className={`h-full w-full object-contain transition-opacity duration-500 ${
          dim ? "opacity-40" : "opacity-100"
        }`}
      />
    </div>
  );
}

// Cached at module scope. useSyncExternalStore calls getSnapshot on
// every render and requires a stable result, and probing for a GL
// context allocates a canvas — so this must only ever run once.
let webglCache: boolean | null = null;

function hasWebGL(): boolean {
  if (webglCache !== null) return webglCache;
  try {
    const canvas = document.createElement("canvas");
    webglCache = Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    webglCache = false;
  }
  return webglCache;
}

const noopSubscribe = () => () => {};

export interface Logo3DProps {
  /** Tailwind classes for the aspect-ratio box. */
  className?: string;
  /** Accessible description of the mark. */
  label?: string;
}

export default function Logo3D({
  className = "relative aspect-square w-full max-w-[520px]",
  label = "The A-Coder mark: seven nested triangular frames that scramble and resolve.",
}: Logo3DProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(true);

  // null on the server, so the first paint reserves space without
  // committing to either the scene or the poster.
  const webgl = useSyncExternalStore(
    noopSubscribe,
    () => hasWebGL(),
    () => null as boolean | null,
  );

  // Subscribed rather than mirrored into state — matchMedia is an
  // external store, and syncing it via setState in an effect renders
  // once with the wrong value before correcting itself.
  const reducedMotion = useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  // Mount after the hero text has painted, not before.
  useEffect(() => {
    // Deliberately a timeout, not requestIdleCallback. rIC is throttled
    // hard in a hidden or unfocused tab — measured at 1819ms against a
    // 900ms timeout — so a background tab (⌘-click, session restore)
    // would never mount the scene. A timeout always fires.
    const timer = window.setTimeout(() => setMounted(true), 200);
    return () => window.clearTimeout(timer);
  }, []);

  // Stop rendering entirely once scrolled away.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "128px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={className}>
      <span className="sr-only">{label}</span>

      {webgl === false && <PosterFallback />}

      {mounted && webgl === true && (
        <LogoScene
          reducedMotion={reducedMotion}
          active={inView}
          className="absolute inset-0"
        />
      )}

      {/* Reserved space before mount — keeps CLS at zero. */}
      {!mounted && webgl !== false && (
        <div className="absolute inset-0" aria-hidden="true" />
      )}
    </div>
  );
}
