"use client";

import dynamic from "next/dynamic";
import { ArrowRight, GitBranch } from "lucide-react";
import { Container, ButtonLink, Badge } from "@/components/ui/primitives";
import { CopyCommand } from "@/components/site/CopyCommand";
import { IdeMockup } from "@/components/mockups/IdeMockup";
import { MODES } from "@/content/product";
import { INSTALL, SITE } from "@/lib/site";
import { useOs, OS_LABEL } from "@/lib/useOs";

const AsciiRenderer = dynamic(
  () => import("@/components/ui/ascii-renderer").then((m) => m.AsciiRenderer),
  { ssr: false },
);

export function Hero({ stars, version }: { stars: number; version: string }) {
  const os = useOs();
  const command = os === "windows" ? INSTALL.windows : INSTALL.unix;

  return (
    <section className="relative isolate overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* The one gradient moment — restrained, and used only here. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(760px_circle_at_18%_-8%,rgba(255,255,255,0.07),transparent_62%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[120px] h-[420px] w-[820px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(255,138,76,0.07),transparent)] blur-2xl"
      />

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
          <div className="stagger">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="ember">Apache-2.0</Badge>
              <Badge>Built on VS Code &amp; Void</Badge>
              <Badge>v{version}</Badge>
            </div>

            <h1 className="mt-6 font-display text-[40px] font-light leading-[1.06] tracking-[-0.03em] text-steel-50 md:text-[56px] lg:text-[62px]">
              Your true{" "}
              <span className="whitespace-nowrap bg-gradient-to-r from-steel-50 via-steel-300 to-ember-400 bg-clip-text text-transparent">
                open source
              </span>
              <br />
              AI IDE.
            </h1>

            <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-white/60">
              Chat, Plan, Agent and Learn — four modes in one editor built on
              VS&nbsp;Code. Your keys, your machine, straight to the provider.
              No relay, no subscription, no lock-in.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/download" size="lg">
                Download for {os ? OS_LABEL[os] : "your platform"}
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink
                href={SITE.repoUrl}
                tone="ghost"
                size="lg"
                external
              >
                <GitBranch className="h-4 w-4" />
                View source · {stars}
              </ButtonLink>
            </div>

            <CopyCommand
              command={command}
              label="$"
              className="mt-5 max-w-[540px]"
            />
            <p className="mt-2.5 font-mono text-[11px] text-white/55">
              macOS, Windows and Linux · bring your own key or run local models
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
            {/* Explicit height, not aspect-ratio. R3F measures this
                container to size its canvas; an aspect-ratio box leaves
                it stuck at the 300x150 default and the scene never
                renders. The upstream demo uses h-[500px] for this reason. */}
            {/* No background, radius or border — the effect is
                transparent and the page shows through. Height stays
                explicit: R3F measures this box to size its canvas, and
                an aspect-ratio box leaves it at the 300x150 default. */}
            <div className="relative h-[420px] w-full lg:h-[480px]">
              <AsciiRenderer />
            </div>
          </div>
        </div>

        <div className="relative mt-16 md:mt-20">
          <IdeMockup mode={MODES[2]} />
        </div>
      </Container>
    </section>
  );
}
