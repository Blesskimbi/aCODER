import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Card, Badge, Arrow } from "@/components/ui/primitives";
import { SourceNote, Callout } from "@/components/ui/blocks";
import { MODE_DETAILS, MODE_COMMON } from "@/content/modes";
import { guide } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Modes",
  description:
    "Four modes, each with a different boundary: Chat talks, Plan reads, Agent writes, Learn teaches. The mode decides what the model is allowed to do.",
};

export default function ModesPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Modes"
        title="Four modes, four boundaries."
        lead="A mode is not a prompt preset — it changes what the model is permitted to do. Chat cannot see your files. Plan can read them but not write. That boundary is the feature."
      />

      <Container className="max-w-[960px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {MODE_DETAILS.map((m) => (
            <Link key={m.id} href={`/modes/${m.id}`} className="block">
              <Card className="h-full p-7">
                <div className="flex items-start justify-between gap-3">
                  <m.icon
                    aria-hidden="true"
                    className="h-6 w-6 text-ember-300"
                    strokeWidth={1.5}
                  />
                  {m.id === "agent" && <Badge tone="ember">Default</Badge>}
                </div>

                <h2 className="mt-4 text-[17px] font-medium text-steel-50">
                  {m.name}
                  <Arrow className="ml-1.5 text-white/35" />
                </h2>
                <p className="mt-1 font-mono text-[11px] text-white/50">
                  {m.tagline}
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-white/60">
                  {m.blurb}
                </p>

                <p className="mt-4 border-t border-white/[0.07] pt-3 text-[12.5px] text-white/50">
                  <span className="text-white/70">Use when:</span> {m.useWhen}
                </p>
              </Card>
            </Link>
          ))}
        </div>

        {/* ── The recommended pairing ────────────────────────────── */}
        <div className="mt-12">
          <Callout tone="ember" title="The pairing the docs recommend">
            <p>
              Start in <strong>Plan</strong> for anything non-trivial. Read the
              plan it produces, then switch to <strong>Agent</strong> to execute
              it. That separates thinking from acting, which is where most agent
              mistakes come from — and it keeps the decision with you.
            </p>
          </Callout>
        </div>

        {/* ── Shared behaviour ───────────────────────────────────── */}
        <section className="mt-20">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            True in every mode
          </h2>
          <ul className="mt-6 grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {MODE_COMMON.map((c) => (
              <li key={c} className="flex gap-2.5 text-[13px] leading-relaxed">
                <span
                  aria-hidden="true"
                  className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ember-400/60"
                />
                <span className="text-white/60">{c}</span>
              </li>
            ))}
          </ul>
        </section>

        <SourceNote href={guide("chat-modes.md")}>
          The in-app dropdown labels the third mode <strong>Code</strong> while
          the README and the Agent Manager call it <strong>Agent</strong>. The
          site uses Agent and says so on that page rather than quietly picking
          one.
        </SourceNote>
      </Container>
    </PageShell>
  );
}
