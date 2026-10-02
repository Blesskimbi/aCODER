import Link from "next/link";
import { ArrowRight, ArrowUpRight, ArrowLeft } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ── Container ─────────────────────────────────────────────────── */

export function Container({
  children,
  className,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cx(
        "mx-auto w-full px-4 sm:px-6",
        wide ? "max-w-[1280px]" : "max-w-[1152px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ── Section ───────────────────────────────────────────────────── */

export function Section({
  children,
  id,
  className,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={cx("scroll-mt-24 py-24 md:py-32", className)}>
      {children}
    </section>
  );
}

/* ── Eyebrow ───────────────────────────────────────────────────── */

export function Eyebrow({
  children,
  tone = "steel",
}: {
  children: ReactNode;
  tone?: "steel" | "ember";
}) {
  return (
    <p
      className={cx(
        "font-mono text-[11px] uppercase tracking-[0.22em]",
        tone === "ember" ? "text-ember-400" : "text-white/62",
      )}
    >
      {children}
    </p>
  );
}

/* ── Headings ──────────────────────────────────────────────────────
   Light weights at large sizes — the reference sets its 52px hero at
   weight 400. See DESIGN_SPEC.md §2.2. */

export function H2({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cx(
        "font-display text-[28px] font-light leading-[1.15] tracking-[-0.02em] text-steel-50 md:text-[38px] lg:text-[44px]",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function Lead({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cx(
        "max-w-[54ch] text-[15px] leading-relaxed text-white/60",
        className,
      )}
    >
      {children}
    </p>
  );
}

/* ── Buttons ───────────────────────────────────────────────────────
   Weight 450 is an intermediate variable-font weight, matching the
   reference's control type. */

type ButtonTone = "primary" | "ghost" | "ember";
type ButtonSize = "md" | "lg";

const TONES: Record<ButtonTone, string> = {
  primary:
    "bg-gradient-to-b from-steel-50 to-steel-200 text-canvas hover:to-steel-100 shadow-[0_6px_22px_-14px_rgba(255,255,255,0.6)]",
  ghost:
    "bg-white/[0.04] text-white/85 border border-white/10 hover:bg-white/[0.07] hover:border-white/[0.16]",
  ember:
    "bg-ember-400 text-[#2A1206] hover:bg-ember-300 shadow-[0_6px_22px_-14px_rgba(255,138,76,0.9)]",
};

const SIZES: Record<ButtonSize, string> = {
  md: "h-10 px-4 text-[13px]",
  lg: "h-11 px-5 text-[14px]",
};

interface ButtonBaseProps {
  tone?: ButtonTone;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

const buttonClass = (tone: ButtonTone, size: ButtonSize, className?: string) =>
  cx(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
    "transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
    "hover:-translate-y-px active:translate-y-0 active:scale-[0.98] active:duration-[50ms]",
    TONES[tone],
    SIZES[size],
    className,
  );

export function Button({
  tone = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonBaseProps & ComponentProps<"button">) {
  return (
    <button className={buttonClass(tone, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  tone = "primary",
  size = "md",
  className,
  children,
  href,
  external,
  ...rest
}: ButtonBaseProps & { href: string; external?: boolean } & Omit<
    ComponentProps<"a">,
    "href"
  >) {
  const cls = buttonClass(tone, size, className);
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={cls}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

/* ── Badge ─────────────────────────────────────────────────────── */

export function Badge({
  children,
  tone = "steel",
}: {
  children: ReactNode;
  tone?: "steel" | "ember" | "warning";
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] tracking-[0.01em]",
        tone === "ember" &&
          "bg-ember-400/10 text-ember-200 ring-1 ring-ember-400/25",
        tone === "warning" &&
          "bg-warning/10 text-warning ring-1 ring-warning/25",
        tone === "steel" && "bg-white/[0.05] text-white/70 ring-1 ring-white/10",
      )}
    >
      {children}
    </span>
  );
}

/* ── Kbd ───────────────────────────────────────────────────────── */

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-xs border border-white/10 bg-white/[0.05] px-1.5 font-mono text-[11px] text-white/70">
      {children}
    </kbd>
  );
}

/* ── Hairline ──────────────────────────────────────────────────── */

export function Hairline({ className }: { className?: string }) {
  return <hr className={cx("hairline", className)} />;
}

/* ── Card ──────────────────────────────────────────────────────── */

/**
 * Cool-tinted hairline on a transparent ground, 24px radius, no drop
 * shadow. Depth reads from the border and an optional top glow rather
 * than from elevation.
 *
 * Note: `.spotlight` owns ::before and `.card-glow` owns ::after, so
 * both can sit on the same element. The previous `rake-edge` +
 * `spotlight` pairing had them both on ::before, where one silently
 * cancelled the other.
 */
export function Card({
  children,
  className,
  id,
  interactive = true,
  glow = false,
  glowTone = "ember",
}: {
  children: ReactNode;
  className?: string;
  /** Set when the card is an in-page anchor target. */
  id?: string;
  interactive?: boolean;
  glow?: boolean;
  glowTone?: "ember" | "steel";
}) {
  return (
    <div
      id={id}
      className={cx(
        "card",
        interactive && "card-interactive spotlight",
        glow && "card-glow",
        glow && glowTone === "steel" && "card-glow-steel",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ── Inline arrows ─────────────────────────────────────────────────
   Real icons rather than the "→" / "↗" / "←" text glyphs these
   replace. Text arrows inherit font metrics unevenly across the three
   families this site loads, and a screen reader may or may not announce
   them depending on the character; an aria-hidden SVG is silent and
   sized predictably.

   `Arrow` follows an internal link, `ExtArrow` an external one, and
   `BackArrow` a breadcrumb. */

export function Arrow({ className }: { className?: string }) {
  return (
    <ArrowRight
      aria-hidden="true"
      strokeWidth={1.75}
      className={cx("inline-block h-3.5 w-3.5 shrink-0 align-[-0.1em]", className)}
    />
  );
}

export function ExtArrow({ className }: { className?: string }) {
  return (
    <ArrowUpRight
      aria-hidden="true"
      strokeWidth={1.75}
      className={cx("inline-block h-3.5 w-3.5 shrink-0 align-[-0.1em]", className)}
    />
  );
}

export function BackArrow({ className }: { className?: string }) {
  return (
    <ArrowLeft
      aria-hidden="true"
      strokeWidth={1.75}
      className={cx("inline-block h-3.5 w-3.5 shrink-0 align-[-0.1em]", className)}
    />
  );
}
