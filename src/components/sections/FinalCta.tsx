"use client";

import { useState } from "react";
import {
  Container,
  Section,
  H2,
  Lead,
  ButtonLink,
  cx,
} from "@/components/ui/primitives";
import { CopyCommand } from "@/components/site/CopyCommand";
import { INSTALL, SITE } from "@/lib/site";

const TABS = [
  { id: "mac", label: "macOS", command: INSTALL.unix },
  { id: "linux", label: "Linux", command: INSTALL.unix },
  { id: "windows", label: "Windows", command: INSTALL.windows },
] as const;

export function FinalCta() {
  const [active, setActive] = useState(0);

  return (
    <Section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[900px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(255,138,76,0.08),transparent)] blur-2xl"
      />
      <Container className="relative">
        <div className="mx-auto max-w-[680px] text-center">
          <H2>Install it in one line.</H2>
          <Lead className="mx-auto mt-4">
            Free, open source, and yours to modify. Bring your own key, or point
            it at a model running on your own machine.
          </Lead>
        </div>

        <div className="mx-auto mt-10 max-w-[680px]">
          <div
            role="tablist"
            aria-label="Install command by platform"
            className="mx-auto inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1"
          >
            {TABS.map((t, i) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={cx(
                  "rounded-full px-4 py-1.5 text-[12.5px] transition-colors duration-200",
                  i === active
                    ? "bg-white/[0.09] text-white"
                    : "text-white/50 hover:text-white/80",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <CopyCommand
            command={TABS[active].command}
            label="$"
            className="mt-5"
          />

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/download" size="lg">
              All downloads
            </ButtonLink>
            <ButtonLink
              href={SITE.repoUrl}
              tone="ghost"
              size="lg"
              external
            >
              Read the source
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
