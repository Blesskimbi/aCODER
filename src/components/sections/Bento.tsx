"use client";

import { useEffect, useRef, useState } from "react";
import {
  Container,
  Section,
  Eyebrow,
  H2,
  Lead,
  Card,
  Kbd,
  cx,
} from "@/components/ui/primitives";
import { SHORTCUTS } from "@/content/product";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/** Cursor-following spotlight — named in the IDE's own DESIGN.md. */
function useSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, []);
  return ref;
}

function Tile({
  title,
  body,
  children,
  className,
}: {
  title: string;
  body: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const ref = useSpotlight();
  return (
    <Card className={cx("flex flex-col p-6", className)}>
      <div ref={ref} className="absolute inset-0" aria-hidden="true" />
      <h3 className="relative text-[14px] font-medium text-steel-50">{title}</h3>
      <p className="relative mt-1.5 text-[13px] leading-relaxed text-white/60">
        {body}
      </p>
      {children && <div className="relative mt-4 flex-1">{children}</div>}
    </Card>
  );
}

/* ── Autocomplete typing ───────────────────────────────────────── */

const GHOST = "const session = await refresh(token)";

function AutocompleteDemo() {
  const reduce = usePrefersReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setN((v) => (v >= GHOST.length + 14 ? 0 : v + 1));
    }, 85);
    return () => clearInterval(id);
  }, [reduce]);

  // Derived, not stored — settling the reduced-motion value via
  // setState inside the effect would cascade an extra render.
  const shown = reduce ? GHOST.length : n;
  const typed = GHOST.slice(0, Math.min(shown, 16));
  const ghost = shown > 16 ? GHOST.slice(16, Math.min(shown, GHOST.length)) : "";

  return (
    <div className="rounded-md border border-white/[0.06] bg-panel p-3 font-mono text-[11.5px] leading-relaxed">
      <div className="flex">
        <span className="mr-3 select-none text-white/56">42</span>
        <span className="text-white/70">{typed}</span>
        <span className="text-white/62">{ghost}</span>
        <span className="ml-px inline-block h-[15px] w-[1.5px] animate-pulse bg-ember-400 align-middle" />
      </div>
      <div className="mt-2.5 flex items-center gap-2 text-[10px] text-white/50">
        <Kbd>Tab</Kbd> to accept
      </div>
    </div>
  );
}

/* ── TOON token counter ────────────────────────────────────────── */

function ToonDemo() {
  const reduce = usePrefersReducedMotion();
  const [raw, setRaw] = useState(100);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setRaw((v) => (v <= 42 ? 100 : v - 2));
    }, 90);
    return () => clearInterval(id);
  }, [reduce]);

  const pct = reduce ? 42 : raw;
  const tokens = Math.round((pct / 100) * 4820);

  return (
    <div className="rounded-md border border-white/[0.06] bg-panel p-3">
      <div className="flex items-baseline justify-between font-mono text-[11px]">
        <span className="text-white/55">tool result</span>
        <span className="tnum text-steel-100">
          {tokens.toLocaleString("en-AU")} tokens
        </span>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-ember-500 to-ember-300 transition-[width] duration-100"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2.5 font-mono text-[10px] text-white/50">
        30–70% smaller on structured results · opt-in
      </p>
    </div>
  );
}

/* ── Terminal running ──────────────────────────────────────────── */

const TERMINAL = [
  "$ npm test",
  "PASS  tests/auth.test.ts",
  "Tests: 34 passed, 34 total",
];

function TerminalDemo() {
  const reduce = usePrefersReducedMotion();
  const [step, setStep] = useState(TERMINAL.length);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setStep((v) => (v >= TERMINAL.length ? 0 : v + 1));
    }, 900);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="rounded-md border border-white/[0.06] bg-panel p-3 font-mono text-[11px] leading-[1.9]">
      {TERMINAL.slice(0, step).map((l, i) => (
        <div
          key={i}
          className={cx(
            i === 0 ? "text-white/55" : "text-diff-add",
            "truncate",
          )}
        >
          {l}
        </div>
      ))}
      {step < TERMINAL.length && (
        <span className="inline-block h-[13px] w-[7px] animate-pulse bg-white/35" />
      )}
    </div>
  );
}

/* ── Shortcuts ─────────────────────────────────────────────────── */

function ShortcutList() {
  return (
    <ul className="space-y-1.5">
      {SHORTCUTS.map((s) => (
        <li key={s.action} className="flex items-center gap-2">
          <span className="flex gap-1">
            {s.keys.map((k) => (
              <Kbd key={k}>{k}</Kbd>
            ))}
          </span>
          <span className="truncate text-[12px] text-white/50">{s.action}</span>
        </li>
      ))}
    </ul>
  );
}

export function Bento() {
  return (
    <Section id="features">
      <Container>
        <div className="max-w-[54ch]">
          <Eyebrow tone="ember">What it does</Eyebrow>
          <H2 className="mt-4">Built for the work, not the demo.</H2>
          <Lead className="mt-4">
            Every capability here ships in the editor today. Nothing is
            roadmap.
          </Lead>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Tile
            title="Autocomplete"
            body="Inline fill-in-the-middle completions as you type, from the model you choose."
            className="lg:col-span-2"
          >
            <AutocompleteDemo />
          </Tile>

          <Tile
            title="Quick Edit"
            body="Rewrite a selection in place, review the diff, accept or reject."
          >
            <ShortcutList />
          </Tile>

          <Tile
            title="TOON compression"
            body="A compact encoding for tool results that cuts token spend where it actually helps."
          >
            <ToonDemo />
          </Tile>

          <Tile
            title="Terminal &amp; tests"
            body="The agent runs commands, reads the output, and fixes what it broke."
          >
            <TerminalDemo />
          </Tile>

          <Tile
            title="Semantic codebase search"
            body="Morph Fast Context finds the files that matter, without shipping your repo to an index server."
          />

          <Tile
            title="Agent Manager"
            body="Delegate focused subagents and orchestrate work across multiple workspaces."
          />

          <Tile
            title="MCP, ACP &amp; Skills"
            body="Model Context Protocol servers, agent servers, and markdown skill packages in ~/.a-coder/skills."
          />

          <Tile
            title="Vision, voice &amp; media"
            body="Image understanding in chat, speech to text and back, and image and video generation tools."
          />

          <Tile
            title="Git integration"
            body="Generated commit messages, repo tools and semantic repo search."
          />

          <Tile
            title="Mobile API"
            body="REST and WebSocket control, so you can drive a session from another device."
          />
        </div>
      </Container>
    </Section>
  );
}
