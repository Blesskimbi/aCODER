import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, X } from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Card, Badge } from "@/components/ui/primitives";
import { SourceNote, Callout } from "@/components/ui/blocks";
import { MODE_DETAILS, getMode } from "@/content/modes";
import { guide } from "@/lib/site";

export const revalidate = 3600;

/** Produces exactly /modes/chat, /modes/plan, /modes/agent, /modes/learn. */
export function generateStaticParams() {
  return MODE_DETAILS.map((m) => ({ mode: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ mode: string }>;
}): Promise<Metadata> {
  const { mode } = await params;
  const m = getMode(mode);
  if (!m) return { title: "Mode not found" };
  return {
    title: `${m.name} mode`,
    description: `${m.tagline}. ${m.blurb}`.slice(0, 300),
  };
}

export default async function ModePage({
  params,
}: {
  params: Promise<{ mode: string }>;
}) {
  const { mode } = await params;
  const m = getMode(mode);
  if (!m) notFound();

  const others = MODE_DETAILS.filter((x) => x.id !== m.id);

  return (
    <PageShell>
      <PageHeader
        eyebrow={`${m.glyph} ${m.name} mode`}
        title={m.tagline}
        lead={m.blurb}
        breadcrumb={{ label: "All modes", href: "/modes" }}
      >
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {m.id === "agent" && <Badge tone="ember">Default mode</Badge>}
          {m.appLabel && <Badge>Labelled “{m.appLabel}” in the app</Badge>}
        </div>
      </PageHeader>

      <Container className="max-w-[900px]">
        {/* ── The boundary ───────────────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-7" interactive={false}>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-success">
              Can
            </h2>
            <ul className="mt-4 space-y-2.5">
              {m.can.map((c) => (
                <li key={c} className="flex gap-2.5 text-[13px] leading-relaxed">
                  <Check
                    aria-hidden="true"
                    className="mt-[3px] h-3.5 w-3.5 shrink-0 text-success"
                  />
                  <span className="text-white/65">{c}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-7" interactive={false}>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-danger">
              Cannot
            </h2>
            <ul className="mt-4 space-y-2.5">
              {m.cannot.map((c) => (
                <li key={c} className="flex gap-2.5 text-[13px] leading-relaxed">
                  <X
                    aria-hidden="true"
                    className="mt-[3px] h-3.5 w-3.5 shrink-0 text-danger"
                  />
                  <span className="text-white/65">{c}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <p className="mt-6 text-[13px] text-white/55">
          <span className="text-white/75">Use when:</span> {m.useWhen}
        </p>

        {/* ── Notes ──────────────────────────────────────────────── */}
        {m.notes && m.notes.length > 0 && (
          <dl className="mt-12 space-y-5">
            {m.notes.map((n) => (
              <div
                key={n.term}
                className="border-l border-white/[0.09] pl-5"
              >
                <dt className="text-[13.5px] font-medium text-steel-100">
                  {n.term}
                </dt>
                <dd className="mt-1.5 text-[13px] leading-relaxed text-white/58">
                  {n.def}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* The naming conflict belongs on this page specifically. */}
        {m.appLabel && (
          <div className="mt-12">
            <Callout tone="warning" title="A naming inconsistency in the repo">
              <p>
                The README and the Agent Manager call this mode{" "}
                <strong>Agent</strong>. The chat-modes guide and the Mobile
                API&apos;s mode setting label it <strong>{m.appLabel}</strong> in
                the dropdown. They are the same mode. The site uses Agent
                because that matches the README and the manager it opens, but
                expect to see “{m.appLabel}” in the app itself.
              </p>
            </Callout>
          </div>
        )}

        {/* ── Other modes ────────────────────────────────────────── */}
        <section className="mt-20 border-t border-white/[0.07] pt-10">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
            The other three
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {others.map((o) => (
              <Link key={o.id} href={`/modes/${o.id}`} className="block">
                <Card className="h-full p-5">
                  <span aria-hidden="true" className="text-[18px] leading-none">
                    {o.glyph}
                  </span>
                  <h3 className="mt-3 text-[14px] font-medium text-steel-50">
                    {o.name}
                    <span aria-hidden="true" className="ml-1 text-white/35">
                      →
                    </span>
                  </h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/55">
                    {o.tagline}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <SourceNote
          href={guide(m.id === "learn" ? "learn-mode.md" : "chat-modes.md")}
        >
          Drawn from the repository&apos;s own mode documentation.
        </SourceNote>
      </Container>
    </PageShell>
  );
}
