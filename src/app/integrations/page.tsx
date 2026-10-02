import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Card, Badge, Arrow, ExtArrow } from "@/components/ui/primitives";
import { SourceNote, Callout } from "@/components/ui/blocks";
import { INTEGRATIONS } from "@/content/integrations";
import { guide } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Integrations",
  description:
    "MCP and ACP for external tools and agents, Skills for installable expertise, Morph for semantic search and fast apply, Composio for a thousand apps, and a REST API for remote control.",
};

export default function IntegrationsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Integrations"
        title="Reaching outside the editor."
        lead="Six ways to give the agent capabilities it does not ship with. Every one of them is off until you turn it on — first launch will not spawn a process or dial a remote host on your behalf."
      />

      <Container className="max-w-[960px]">
        <nav aria-label="Integrations" className="mb-14 flex flex-wrap gap-2">
          {INTEGRATIONS.map((i) => (
            <a
              key={i.id}
              href={`#${i.id}`}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12.5px] text-white/65 transition-colors hover:border-white/20 hover:text-white"
            >
              {i.name}
            </a>
          ))}
        </nav>

        <div className="space-y-6">
          {INTEGRATIONS.map((i) => (
            <Card key={i.id} id={i.id} className="scroll-mt-28 p-7 md:p-8">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-display text-[22px] font-light tracking-[-0.01em] text-steel-50">
                  {i.name}
                </h2>
                <Badge>{i.kind}</Badge>
              </div>

              <p className="mt-3 max-w-[64ch] text-[14px] leading-relaxed text-white/62">
                {i.summary}
              </p>

              <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-2.5 border-y border-white/[0.07] py-4">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                    Configured in
                  </dt>
                  <dd className="mt-1 text-[12.5px] text-white/68">
                    {i.settings}
                  </dd>
                </div>
                {i.configFile && (
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                      On disk
                    </dt>
                    <dd className="mt-1 font-mono text-[12px] text-white/68">
                      {i.configFile}
                    </dd>
                  </div>
                )}
              </dl>

              <ul className="mt-5 space-y-2.5">
                {i.points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-[13px] leading-relaxed">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ember-400/60"
                    />
                    <span className="text-white/60">{p}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                <a
                  href={guide(i.guide)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[12.5px] text-white/50 underline-offset-4 transition-colors hover:text-ember-300 hover:underline"
                >
                  {i.guide} <ExtArrow />
                </a>
                {i.href && (
                  <a
                    href={i.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-[12.5px] text-white/50 underline-offset-4 transition-colors hover:text-ember-300 hover:underline"
                  >
                    Upstream project <ExtArrow />
                  </a>
                )}
                {i.id === "mobile" && (
                  <Link
                    href="/mobile"
                    className="text-[12.5px] text-ember-300 underline-offset-4 hover:underline"
                  >
                    Full API reference <Arrow />
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* ── The shared gate ────────────────────────────────────── */}
        <div className="mt-12">
          <Callout tone="warning" title="They share one permission switch">
            <p>
              MCP tools, Composio app calls and ACP agent runs are all gated by
              the same <strong>MCP tools</strong> approval category — including
              calls made inside subagents. Auto-approving it is therefore the
              broadest switch in Settings: it covers every external tool at
              once, not one integration. Worth leaving on manual until you know
              what each connected server actually exposes.
            </p>
          </Callout>
        </div>

        <SourceNote href={guide("mcp.md")}>
          Config paths, setting keys and endpoint shapes are quoted from the
          repository&apos;s integration guides.
        </SourceNote>
      </Container>
    </PageShell>
  );
}
