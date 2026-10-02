import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Card, Badge, Arrow, ExtArrow } from "@/components/ui/primitives";
import { SpecTable, SourceNote, Callout } from "@/components/ui/blocks";
import { CLOUD, LOCAL, FEATURE_SLOTS, OVERRIDES } from "@/content/models";
import { guide } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Models",
  description:
    "Twenty provider options — thirteen cloud, seven local or self-hosted — your own key, and a different model per feature. Models are discovered rather than hard-coded.",
};

function ProviderTable({ rows }: { rows: typeof CLOUD }) {
  return (
    <SpecTable
      head={["Provider", "What you supply", "Notes"]}
      rows={rows.map((p) => [
        <span key="n" className="flex flex-wrap items-center gap-2">
          {p.keyUrl ? (
            <a
              href={p.keyUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-steel-100 underline-offset-4 hover:text-ember-300 hover:underline"
            >
              {p.name} <ExtArrow />
            </a>
          ) : (
            p.name
          )}
          {p.autoDetect && <Badge>auto</Badge>}
        </span>,
        p.fields,
        p.notes ?? "—",
      ])}
    />
  );
}

export default function ModelsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Models"
        title="Your key, your choice, your endpoint."
        lead="Twenty provider options, and the editor is not opinionated about which you use. Requests go from your machine to the endpoint you configured — there is no A-Coder relay in the path."
      />

      <Container className="max-w-[960px]">
        {/* ── Why no model names ─────────────────────────────────── */}
        <Callout title="Why this page names no specific models">
          <p>
            Model line-ups change with every provider release, and a page that
            lists SKUs is wrong within months — the repo&apos;s own README still
            advertises a 3.5-era Claude. A-Coder discovers models from the
            provider instead: local runtimes and the hosted aggregators are
            auto-detected, and cloud providers ship a curated list you enable
            individually. So the useful question is which provider, not which
            model string.
          </p>
        </Callout>

        {/* ── Cloud ──────────────────────────────────────────────── */}
        <section id="cloud" className="mt-16 scroll-mt-28">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Cloud providers
          </h2>
          <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-white/60">
            Eleven are third-party providers you bring your own key to. Two —
            A-Coder and OpenAdapter — are hosted aggregators that fetch their
            model lists for you once a key is added.
          </p>
          <div className="mt-7">
            <ProviderTable rows={CLOUD} />
          </div>
        </section>

        {/* ── Local ──────────────────────────────────────────────── */}
        <section id="local" className="mt-20 scroll-mt-28">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Local and self-hosted
          </h2>
          <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-white/60">
            Endpoints are pre-filled with each runtime&apos;s default, and the
            model list is detected from the server — there is nothing to type in
            by hand.
          </p>
          <div className="mt-7">
            <ProviderTable rows={LOCAL} />
          </div>

          <div className="mt-8">
            <Callout tone="warning" title="Two of these are not local">
              <p>
                Ollama Cloud sits in this group because it is configured the same
                way, and the hosted A-Coder provider sits with the cloud ones.
                Both send requests off your machine. If the point of choosing a
                local runtime is that nothing leaves, pick Ollama, LM Studio,
                vLLM, llama.cpp or your own OpenAI-compatible server.
              </p>
            </Callout>
          </div>
        </section>

        {/* ── Per-feature ────────────────────────────────────────── */}
        <section id="per-feature" className="mt-20 scroll-mt-28">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            A different model per feature
          </h2>
          <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-white/60">
            Seven features take their own model. Leaving one unset is fine —
            A-Coder falls back to any enabled model. The case for setting one
            explicitly is autocomplete: it fires constantly and needs
            fill-in-the-middle support, so a small fast model there saves both
            latency and money.
          </p>
          <div className="mt-7">
            <SpecTable
              head={["Feature", "What it powers"]}
              rows={FEATURE_SLOTS.map((f) => [f.name, f.powers])}
            />
          </div>
        </section>

        {/* ── Overrides ──────────────────────────────────────────── */}
        <section id="overrides" className="mt-20 scroll-mt-28">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Capability overrides
          </h2>
          <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-white/60">
            Every model carries a capability profile. A-Coder ships known values
            for popular models and falls back to sensible defaults for unknown
            ones, but each field can be overridden per model — which is what
            makes an obscure self-hosted model usable rather than merely
            connectable.
          </p>
          <div className="mt-7">
            <SpecTable
              head={["Override", "What it controls"]}
              rows={OVERRIDES.map((o) => [
                <code key={o.key} className="font-mono text-[12px]">
                  {o.key}
                </code>,
                o.controls,
              ])}
            />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Card className="p-6" interactive={false}>
              <h3 className="text-[14px] font-medium text-steel-50">
                Reasoning controls
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/60">
                Thinking models expose a toggle, a token budget or a discrete
                effort level, depending on the provider&apos;s shape. Open models
                that emit think tags are parsed automatically, so the reasoning
                appears in its own card instead of polluting the answer.
              </p>
            </Card>
            <Card className="p-6" interactive={false}>
              <h3 className="text-[14px] font-medium text-steel-50">
                Tool calling without native support
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/60">
                A model that cannot call tools natively is switched to XML tool
                calling in agent mode — A-Coder instructs it to emit calls as XML
                and parses them. That is what lets a tool-weak local model still
                drive the agent.
              </p>
            </Card>
          </div>
        </section>

        <div className="mt-20 flex flex-wrap items-center gap-3 border-t border-white/[0.07] pt-8">
          <Badge>Next</Badge>
          <Link
            href="/help/connect-a-model"
            className="text-[13.5px] text-ember-300 underline-offset-4 hover:underline"
          >
            Connect your first provider <Arrow />
          </Link>
          <span className="text-white/25">·</span>
          <Link
            href="/privacy"
            className="text-[13.5px] text-ember-300 underline-offset-4 hover:underline"
          >
            Where requests actually go <Arrow />
          </Link>
        </div>

        <SourceNote href={guide("providers-and-models.md")}>
          Provider fields, defaults and override keys are quoted from the
          repository&apos;s providers and models guide.
        </SourceNote>
      </Container>
    </PageShell>
  );
}
