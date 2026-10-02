import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Card, Badge, Arrow, ExtArrow } from "@/components/ui/primitives";
import { SpecTable, SourceNote, Callout } from "@/components/ui/blocks";
import { FEATURE_GROUPS, APPROVAL_CATEGORIES } from "@/content/features";
import { guide } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Features",
  description:
    "Everything A-Coder can do, grouped by what it touches — reading your codebase, changing code, the terminal, planning, context, git, and the editor underneath.",
};

export default function FeaturesPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Features"
        title="What it can actually do."
        lead="Grouped by what each capability touches, because that is also how permission works. Read-only tools run freely; anything that can change your project is gated."
      />

      <Container className="max-w-[960px]">
        {/* Jump list — eight groups is too many to scroll blindly. */}
        <nav aria-label="Feature groups" className="mb-14 flex flex-wrap gap-2">
          {FEATURE_GROUPS.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12.5px] text-white/65 transition-colors hover:border-white/20 hover:text-white"
            >
              {g.title}
            </a>
          ))}
        </nav>

        <div className="space-y-20">
          {FEATURE_GROUPS.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-28">
              <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
                {group.title}
              </h2>
              <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-white/60">
                {group.blurb}
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {group.items.map((item) => (
                  <Card key={item.name} className="p-6">
                    <h3 className="text-[14.5px] font-medium text-steel-50">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-white/60">
                      {item.body}
                    </p>
                    {item.ref && (
                      <p className="mt-3.5 font-mono text-[11px] text-white/42">
                        {item.ref}
                      </p>
                    )}
                  </Card>
                ))}
              </div>

              <a
                href={guide(group.guide)}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-5 inline-block text-[12.5px] text-white/50 underline-offset-4 transition-colors hover:text-ember-300 hover:underline"
              >
                {group.guide} <ExtArrow />
              </a>
            </section>
          ))}
        </div>

        {/* ── Approval model ─────────────────────────────────────── */}
        <section id="approval" className="mt-24 scroll-mt-28">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            What needs your permission
          </h2>
          <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-white/60">
            Nine categories prompt before running. Everything outside them
            auto-approves, because reading, searching, planning and teaching
            cannot change your project.
          </p>

          <div className="mt-7">
            <SpecTable
              head={["Category", "What falls under it"]}
              rows={APPROVAL_CATEGORIES.map((c) => [
                <span key={c.name} className="font-mono text-[12px]">
                  {c.name}
                </span>,
                c.covers,
              ])}
            />
          </div>

          <div className="mt-8">
            <Callout tone="warning" title="Two asymmetries worth knowing">
              <p>
                Opening a terminal is gated, but running a command in one you
                already approved is not — the gate is on creating the
                capability. And image generation prompts while video generation
                does not, because only the former is treated as a paid
                external call.
              </p>
            </Callout>
          </div>
        </section>

        <div className="mt-20 flex flex-wrap items-center gap-3 border-t border-white/[0.07] pt-8">
          <Badge>Next</Badge>
          <Link
            href="/modes"
            className="text-[13.5px] text-ember-300 underline-offset-4 hover:underline"
          >
            How the four modes differ <Arrow />
          </Link>
          <span className="text-white/25">·</span>
          <Link
            href="/integrations"
            className="text-[13.5px] text-ember-300 underline-offset-4 hover:underline"
          >
            Extending it with MCP, ACP and Skills <Arrow />
          </Link>
        </div>

        <SourceNote href={guide("tools.md")}>
          Tool names on this page are the real identifiers the agent calls, and
          every claim is drawn from the repository&apos;s own user guides.
        </SourceNote>
      </Container>
    </PageShell>
  );
}
