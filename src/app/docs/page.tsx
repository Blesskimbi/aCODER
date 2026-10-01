import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import {
  Container,
  Section,
  Eyebrow,
  H2,
  Lead,
  Card,
  Kbd,
} from "@/components/ui/primitives";
import { getRepoStats } from "@/lib/github";
import { SHORTCUTS } from "@/content/product";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Guides for A-Coder IDE — getting started, chat modes, providers and models, tools, MCP, Skills and the Mobile API.",
};

const g = (p: string) => `${SITE.docsUrl}/${p}`;

const GROUPS: Array<{
  title: string;
  items: Array<{ label: string; blurb: string; href: string }>;
}> = [
  {
    title: "Getting started",
    items: [
      {
        label: "Getting Started",
        blurb: "Install, connect a model, run your first chat and edit.",
        href: g("user-guide/getting-started.md"),
      },
      {
        label: "Interface Tour",
        blurb: "The sidebar, editor overlays, settings panes and views.",
        href: g("user-guide/interface-tour.md"),
      },
      {
        label: "Keyboard Shortcuts",
        blurb: "Every keybinding and slash command.",
        href: g("user-guide/keyboard-shortcuts.md"),
      },
    ],
  },
  {
    title: "Chat & modes",
    items: [
      {
        label: "Chat Modes",
        blurb: "Chat, Plan, Agent and Learn — and when to use each.",
        href: g("user-guide/chat-modes.md"),
      },
      {
        label: "Learn Mode",
        blurb: "Levels, exercises, hints, quizzes, badges and streaks.",
        href: g("user-guide/learn-mode.md"),
      },
      {
        label: "Proactive Coach",
        blurb: "Ambient coaching suggestions while you work.",
        href: g("user-guide/proactive-coach.md"),
      },
    ],
  },
  {
    title: "Models & settings",
    items: [
      {
        label: "Providers & Models",
        blurb: "Every provider, per-feature selection and capability overrides.",
        href: g("user-guide/providers-and-models.md"),
      },
      {
        label: "Settings Reference",
        blurb: "Every setting, grouped by tab, with defaults.",
        href: g("user-guide/settings-reference.md"),
      },
      {
        label: "Context Management",
        blurb: "Context gathering, TOON compression and the iteration cap.",
        href: g("user-guide/context-management.md"),
      },
    ],
  },
  {
    title: "Editing & code",
    items: [
      {
        label: "Quick Edit",
        blurb: "Inline AI editing with Ctrl+K.",
        href: g("user-guide/quick-edit.md"),
      },
      {
        label: "Inline Diffs",
        blurb: "Applying and rejecting edits, auto-accept and Fast Apply.",
        href: g("user-guide/inline-diffs.md"),
      },
      {
        label: "Built-in Tools",
        blurb: "The complete agent tool catalogue.",
        href: g("user-guide/tools.md"),
      },
      {
        label: "Tool Approval & Terminal",
        blurb: "Approval categories and terminal allow/deny patterns.",
        href: g("user-guide/tool-approval-and-terminal.md"),
      },
    ],
  },
  {
    title: "Integrations",
    items: [
      {
        label: "MCP",
        blurb: "Model Context Protocol servers.",
        href: g("user-guide/mcp.md"),
      },
      {
        label: "Skills",
        blurb: "Markdown skill packages in ~/.a-coder/skills/.",
        href: g("user-guide/skills.md"),
      },
      {
        label: "Agent Manager",
        blurb: "Subagents and multi-workspace orchestration.",
        href: g("user-guide/agent-manager.md"),
      },
      {
        label: "Mobile API",
        blurb: "REST and WebSocket remote control.",
        href: g("user-guide/mobile-api.md"),
      },
    ],
  },
  {
    title: "Contributing",
    items: [
      {
        label: "Development Guide",
        blurb: "Build, run and package A-Coder.",
        href: g("DEVELOPMENT_GUIDE.md"),
      },
      {
        label: "Contributing Guidelines",
        blurb: "Setup for macOS, Windows and Linux.",
        href: g("HOW_TO_CONTRIBUTE.md"),
      },
      {
        label: "Codebase Guide",
        blurb: "Architecture overview.",
        href: g("VOID_CODEBASE_GUIDE.md"),
      },
    ],
  },
];

export default async function DocsPage() {
  const stats = await getRepoStats();

  return (
    <>
      <Nav stars={stats.stars} />
      <main id="main" className="pt-24">
        <Section className="pb-10 pt-10">
          <Container>
            <Eyebrow tone="ember">Documentation</Eyebrow>
            <H2 className="mt-4">Everything, in the repository.</H2>
            <Lead className="mt-4">
              The docs live beside the code so they version with it. These
              links go straight to the source on GitHub.
            </Lead>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2.5">
              {SHORTCUTS.map((s) => (
                <span key={s.action} className="flex items-center gap-2">
                  <span className="flex gap-1">
                    {s.keys.map((k) => (
                      <Kbd key={k}>{k}</Kbd>
                    ))}
                  </span>
                  <span className="text-[12px] text-white/62">{s.action}</span>
                </span>
              ))}
            </div>
          </Container>
        </Section>

        <Container>
          <div className="space-y-12">
            {GROUPS.map((group) => (
              <div key={group.title}>
                <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/58">
                  {group.title}
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group block"
                    >
                      <Card className="h-full p-5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-[13.5px] font-medium text-steel-50">
                            {item.label}
                          </h3>
                          <ArrowUpRight
                            className="h-3.5 w-3.5 shrink-0 text-white/42 transition-colors group-hover:text-ember-400"
                            aria-hidden="true"
                          />
                        </div>
                        <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/55">
                          {item.blurb}
                        </p>
                      </Card>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>

        <div className="h-24" />
      </main>
      <Footer stars={stats.stars} />
    </>
  );
}
