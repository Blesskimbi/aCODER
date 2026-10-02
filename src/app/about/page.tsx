import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Card, Badge } from "@/components/ui/primitives";
import { SourceNote, Callout, NumberedList } from "@/components/ui/blocks";
import { SITE, EXTERNAL } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About",
  description:
    "Why A-Coder exists: privacy by design, model choice, developer sovereignty, and teaching rather than replacing.",
};

/** The four principles are stated in the repo's own PITCH_DECK.md. */
const ETHOS = [
  {
    title: "Privacy by design",
    body: "Your code, your models, your rules. Requests go from your machine straight to the provider you chose, with no A-Coder server in the path — and if you point at a local runtime, nothing leaves the machine at all.",
  },
  {
    title: "Open source, meaningfully",
    body: "Apache-2.0, and the whole editor. Not an open shell around a closed core — the part that decides what the model sees and what it is allowed to do is the part you can read.",
  },
  {
    title: "Developer sovereignty",
    body: "Choose your own model rather than being locked to one provider. Understand your tools instead of trusting a black box. Control what runs, with a permission gate on every action that can change your project.",
  },
  {
    title: "Education over automation",
    body: "A tool that writes code you do not understand has traded one problem for a worse one. Learn Mode and the Proactive Coach exist so that using A-Coder makes you better rather than more dependent.",
  },
];

const HISTORY = [
  {
    title: "VS Code",
    body: "Microsoft's open-source editor core provides Monaco, the extension host, settings, keybindings and the marketplace client. Decades of editor problems already solved.",
  },
  {
    title: "Void",
    body: "An open-source agentic IDE built on that core, which pioneered much of this shape. A-Coder is a fork of it, and credits it as such.",
  },
  {
    title: "A-Coder",
    body: "Adds the four modes, the tool and approval system, semantic search, the Agent Manager and subagents, MCP, ACP, Skills, the Mobile API, and Learn Mode. First commit August 2025.",
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="About"
        title="Why this exists."
        lead="AI coding tools solved generation and created three new problems: code you do not understand, a provider you cannot leave, and a tool you cannot inspect. A-Coder is an attempt at the same capability without those costs."
      />

      <Container className="max-w-[900px]">
        {/* ── Ethos ──────────────────────────────────────────────── */}
        <section>
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Four commitments
          </h2>
          <div className="mt-7">
            <NumberedList items={ETHOS} />
          </div>
        </section>

        {/* ── Lineage ────────────────────────────────────────────── */}
        <section className="mt-20">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Where it came from
          </h2>
          <p className="mt-3 max-w-[64ch] text-[14px] leading-relaxed text-white/60">
            A-Coder is not built from nothing, and says so. Two projects carry
            most of the weight underneath it.
          </p>
          <div className="mt-7 space-y-3">
            {HISTORY.map((h, i) => (
              <Card key={h.title} className="p-6" interactive={false}>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-ember-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[15px] font-medium text-steel-50">
                    {h.title}
                  </h3>
                </div>
                <p className="mt-2.5 text-[13px] leading-relaxed text-white/60">
                  {h.body}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Who ────────────────────────────────────────────────── */}
        <section className="mt-20">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Who builds it
          </h2>
          <Card className="mt-7 p-7" interactive={false}>
            <p className="text-[14px] leading-relaxed text-white/65">
              A-Coder is developed by Hamish, who founded and leads the project,
              under{" "}
              <a
                href={EXTERNAL.company}
                target="_blank"
                rel="noreferrer noopener"
                className="text-ember-300 underline-offset-4 hover:underline"
              >
                The A Tech Corporation
              </a>
              , based in Australia. It is a small team — the contributor list on
              the open-source page is the honest picture of who has touched the
              code.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              <Link
                href="/open-source"
                className="text-[13px] text-ember-300 underline-offset-4 hover:underline"
              >
                Contributors →
              </Link>
              <a
                href={EXTERNAL.company}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[13px] text-ember-300 underline-offset-4 hover:underline"
              >
                theatechcorporation.com ↗
              </a>
            </div>
          </Card>
        </section>

        {/* ── Honesty ────────────────────────────────────────────── */}
        <section className="mt-16">
          <Callout title="The size of it">
            <p>
              This is an early project with a few dozen stars, not an established
              product. We would rather you know that from the about page than
              discover it afterwards. What that buys you is unusual leverage:
              report something and it is likely to be read by the person who can
              fix it.
            </p>
          </Callout>
        </section>

        <div className="mt-16 flex flex-wrap items-center gap-3 border-t border-white/[0.07] pt-8">
          <Badge>Next</Badge>
          <Link
            href="/open-source"
            className="text-[13.5px] text-ember-300 underline-offset-4 hover:underline"
          >
            Read the source →
          </Link>
          <span className="text-white/25">·</span>
          <Link
            href="/community"
            className="text-[13.5px] text-ember-300 underline-offset-4 hover:underline"
          >
            Find the community →
          </Link>
          <span className="text-white/25">·</span>
          <Link
            href="/join"
            className="text-[13.5px] text-ember-300 underline-offset-4 hover:underline"
          >
            Working on it →
          </Link>
        </div>

        <SourceNote href={SITE.repoUrl}>
          The four commitments are drawn from the project&apos;s own stated ethos;
          the lineage and dates from the repository and its release history.
        </SourceNote>
      </Container>
    </PageShell>
  );
}
