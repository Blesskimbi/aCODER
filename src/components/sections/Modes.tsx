"use client";

import { useState } from "react";
import {
  Container,
  Section,
  Eyebrow,
  H2,
  Lead,
  cx,
} from "@/components/ui/primitives";
import { IdeMockup } from "@/components/mockups/IdeMockup";
import { MODES } from "@/content/product";

export function Modes() {
  const [active, setActive] = useState(2); // Agent
  const mode = MODES[active];

  return (
    <Section id="modes">
      <Container>
        {/* Centred header — the previous side-by-side split left a tall
            dead column beside the mockup and squeezed the editor. */}
        <div className="mx-auto max-w-[62ch] text-center">
          <Eyebrow tone="ember">Four modes, one editor</Eyebrow>
          <H2 className="mt-4">
            The right amount of autonomy, chosen per task.
          </H2>
          <Lead className="mx-auto mt-4">
            Switch mode and the same model behaves differently — from answering
            a question, to scoping a change, to making it.
          </Lead>
        </div>

        <div className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Editor modes"
            className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1"
          >
            {MODES.map((m, i) => (
              <button
                key={m.id}
                role="tab"
                aria-selected={i === active}
                aria-controls="mode-panel"
                onClick={() => setActive(i)}
                className={cx(
                  "rounded-full px-4 py-1.5 text-[12.5px] transition-colors duration-200",
                  i === active
                    ? "bg-white/[0.09] text-white"
                    : "text-white/50 hover:text-white/80",
                )}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Fixed-height so swapping modes never shifts the mockup below. */}
        <div
          id="mode-panel"
          role="tabpanel"
          className="mx-auto mt-7 flex min-h-[92px] max-w-[62ch] flex-col items-center text-center"
        >
          <h3 className="font-display text-[20px] font-light tracking-tight text-steel-50">
            {mode.name}
          </h3>
          <p className="mt-1.5 text-[14px] leading-relaxed text-white/65">
            {mode.blurb}
          </p>
          <p className="mt-2 text-[12.5px] text-white/58">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
              Use when
            </span>{" "}
            {mode.useWhen}
          </p>
        </div>

        {/* Full width — the mockup needs the room to read at real density. */}
        <div className="mt-10">
          <IdeMockup mode={mode} />
        </div>
      </Container>
    </Section>
  );
}
