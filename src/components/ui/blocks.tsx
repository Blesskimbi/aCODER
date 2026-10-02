import Link from "next/link";
import type { ReactNode } from "react";
import { Card, cx } from "./primitives";

/* ── Callout ───────────────────────────────────────────────────────
   Used for the draft notices on the legal pages and for the "not in
   this repo" caveats, so a qualification is never buried in prose. */

export function Callout({
  tone = "steel",
  title,
  children,
}: {
  tone?: "steel" | "warning" | "ember";
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside
      className={cx(
        "rounded-2xl border p-5",
        tone === "warning" && "border-warning/25 bg-warning/[0.045]",
        tone === "ember" && "border-ember-400/25 bg-ember-400/[0.045]",
        tone === "steel" && "border-white/10 bg-white/[0.03]",
      )}
    >
      {title && (
        <p
          className={cx(
            "font-mono text-[10px] uppercase tracking-[0.18em]",
            tone === "warning" && "text-warning",
            tone === "ember" && "text-ember-300",
            tone === "steel" && "text-white/60",
          )}
        >
          {title}
        </p>
      )}
      <div className="mt-2 space-y-2 text-[13px] leading-relaxed text-white/62 [&_a]:text-ember-300 [&_a]:underline-offset-4 [&_a:hover]:underline">
        {children}
      </div>
    </aside>
  );
}

/* ── Spec table ────────────────────────────────────────────────────
   Horizontally scrollable so wide tables never force the page body to
   scroll sideways on a phone. */

export function SpecTable({
  head,
  rows,
  className,
}: {
  head: string[];
  rows: ReactNode[][];
  className?: string;
}) {
  return (
    <div className={cx("-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0", className)}>
      <table className="w-full min-w-[520px] border-collapse text-left">
        <thead>
          <tr className="border-b border-white/10">
            {head.map((h) => (
              <th
                key={h}
                scope="col"
                className="py-2.5 pr-5 font-mono text-[10px] font-normal uppercase tracking-[0.16em] text-white/55"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/[0.055] last:border-0">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={cx(
                    "py-3 pr-5 align-top text-[13px] leading-relaxed",
                    j === 0 ? "text-steel-100" : "text-white/60",
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Link card grid ────────────────────────────────────────────────── */

export function CardGrid({
  cols = 2,
  children,
}: {
  cols?: 2 | 3;
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        "grid gap-4",
        cols === 3
          ? "sm:grid-cols-2 lg:grid-cols-3"
          : "sm:grid-cols-2",
      )}
    >
      {children}
    </div>
  );
}

export function LinkCard({
  href,
  external,
  title,
  blurb,
  meta,
}: {
  href: string;
  external?: boolean;
  title: string;
  blurb?: string;
  meta?: string;
}) {
  const inner = (
    <Card className="h-full p-6">
      {meta && (
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
          {meta}
        </p>
      )}
      <h3 className="mt-2 text-[15px] font-medium text-steel-50">
        {title}
        <span aria-hidden="true" className="ml-1.5 text-white/35">
          {external ? "↗" : "→"}
        </span>
      </h3>
      {blurb && (
        <p className="mt-2 text-[13px] leading-relaxed text-white/58">{blurb}</p>
      )}
    </Card>
  );

  return external ? (
    <a href={href} target="_blank" rel="noreferrer noopener" className="block">
      {inner}
    </a>
  ) : (
    <Link href={href} className="block">
      {inner}
    </Link>
  );
}

/* ── Numbered section list ─────────────────────────────────────────
   The pattern already used on /security. */

export function NumberedList({
  items,
}: {
  items: Array<{ title: string; body: ReactNode }>;
}) {
  return (
    <div className="space-y-4">
      {items.map((s, i) => (
        <Card key={s.title} className="p-7">
          <span className="font-mono text-[10px] tracking-[0.16em] text-white/50">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-2 text-[16px] font-medium text-steel-50">
            {s.title}
          </h3>
          <div className="mt-2.5 text-[13.5px] leading-relaxed text-white/62">
            {s.body}
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ── Empty state ───────────────────────────────────────────────────
   For index pages whose content collection is genuinely empty. It
   says so plainly rather than showing invented entries. */

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { label: string; href: string; external?: boolean };
}) {
  return (
    <div className="card flex flex-col items-start gap-3 p-10">
      <span
        aria-hidden="true"
        className="h-8 w-8 rounded-lg border border-dashed border-white/20"
      />
      <h2 className="text-[16px] font-medium text-steel-50">{title}</h2>
      <p className="max-w-[52ch] text-[13.5px] leading-relaxed text-white/58">
        {body}
      </p>
      {action &&
        (action.external ? (
          <a
            href={action.href}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-1 text-[13px] text-ember-300 underline-offset-4 hover:underline"
          >
            {action.label} ↗
          </a>
        ) : (
          <Link
            href={action.href}
            className="mt-1 text-[13px] text-ember-300 underline-offset-4 hover:underline"
          >
            {action.label} →
          </Link>
        ))}
    </div>
  );
}

/* ── Prose ─────────────────────────────────────────────────────────
   Long-form body copy for the legal pages. */

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div
      className={cx(
        "max-w-[68ch] text-[13.5px] leading-[1.75] text-white/62",
        "[&_h2]:mt-10 [&_h2]:text-[16px] [&_h2]:font-medium [&_h2]:text-steel-50",
        "[&_h3]:mt-7 [&_h3]:text-[14px] [&_h3]:font-medium [&_h3]:text-steel-100",
        "[&_p]:mt-3.5 [&_ul]:mt-3.5 [&_ul]:space-y-2 [&_li]:pl-1",
        "[&_ul]:list-disc [&_ul]:pl-5 [&_li::marker]:text-white/30",
        "[&_a]:text-ember-300 [&_a]:underline-offset-4 [&_a:hover]:underline",
        "[&_strong]:font-medium [&_strong]:text-steel-100",
        "[&_code]:rounded [&_code]:bg-white/[0.06] [&_code]:px-1.5 [&_code]:py-0.5",
        "[&_code]:font-mono [&_code]:text-[12px] [&_code]:text-steel-100",
      )}
    >
      {children}
    </div>
  );
}

/* ── Source note ───────────────────────────────────────────────────
   Every page that restates repo content links back to it, so a reader
   can check the claim rather than trust it. */

export function SourceNote({
  children,
  href,
  label = "Read the source",
}: {
  children: ReactNode;
  href: string;
  label?: string;
}) {
  return (
    <p className="mt-10 border-t border-white/[0.07] pt-5 text-[12px] leading-relaxed text-white/50">
      {children}{" "}
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="text-white/65 underline-offset-4 hover:underline"
      >
        {label} ↗
      </a>
    </p>
  );
}
