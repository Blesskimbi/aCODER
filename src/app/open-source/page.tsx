import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Card, Badge, ButtonLink } from "@/components/ui/primitives";
import { SpecTable, SourceNote, Callout, NumberedList } from "@/components/ui/blocks";
import { getRepoStats, getContributors } from "@/lib/github";
import { SITE, EXTERNAL, repoDoc } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Open source",
  description:
    "A-Coder is Apache-2.0 on GitHub. Read the code, check the claims, fork it for your own use, or build it from source with Node 22.",
};

const STACK = [
  ["Core", "VS Code — the Monaco editor and the extension host"],
  ["UI", "React 19, Tailwind CSS, Lucide icons"],
  ["AI", "A TypeScript orchestration layer written for A-Coder"],
  ["Communication", "MCP, WebSocket, REST"],
  ["Compression", "TOON, for structured tool results"],
];

const BUILD = [
  {
    title: "Install Node 22",
    body: "Pinned in .nvmrc. Older majors will not build the native dependencies cleanly.",
  },
  {
    title: "npm install",
    body: "Then npm run buildreact once, to build the React surfaces.",
  },
  {
    title: "npm run watch",
    body: "Watches and recompiles TypeScript while you work.",
  },
  {
    title: "./scripts/code.sh",
    body: "Launches the development build. Cmd+R reloads it after a change.",
  },
];

const LINEAGE = [
  {
    name: "VS Code",
    href: EXTERNAL.vscode,
    body: "The editor foundation — Monaco, the extension host, the settings and keybinding systems, the marketplace client. Licensed separately as LICENSE-VS-Code.txt.",
  },
  {
    name: "Void",
    href: EXTERNAL.void,
    body: "The agentic IDE A-Coder is forked from. Much of the service architecture, and some identifiers still in product.json, come from here.",
  },
];

export default async function OpenSourcePage() {
  const [stats, contributors] = await Promise.all([
    getRepoStats(),
    getContributors(24),
  ]);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Open source"
        title="Checkable, not just claimable."
        lead="Every assertion this site makes about where your code goes can be verified against the source, which is the point of shipping an AI tool as open source rather than merely saying the right things about privacy."
      >
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <ButtonLink href={SITE.repoUrl} external size="lg">
            View the repository
          </ButtonLink>
          <ButtonLink href={SITE.licenceUrl} external tone="ghost" size="lg">
            Read the licence
          </ButtonLink>
        </div>
      </PageHeader>

      <Container className="max-w-[960px]">
        {/* ── Live stats ─────────────────────────────────────────── */}
        <section>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Stars", value: stats.stars },
              { label: "Forks", value: stats.forks },
              { label: "Licence", value: SITE.licence },
            ].map((s) => (
              <Card key={s.label} className="p-6" interactive={false}>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
                  {s.label}
                </p>
                <p className="tnum mt-2 font-display text-[28px] font-light text-steel-50">
                  {s.value}
                </p>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-[12px] text-white/45">
            {stats.isLive
              ? "Read live from the GitHub API, refreshed hourly."
              : "Last known values — the GitHub API did not answer this build."}
          </p>
        </section>

        {/* ── Honest scale ───────────────────────────────────────── */}
        <div className="mt-10">
          <Callout title="These are small numbers, and that is the real picture">
            <p>
              A few dozen stars is a young project, not a movement. We are not
              going to dress that up as “thousands of developers” — if you adopt
              A-Coder now you are an early user of a small codebase, with the
              trade-offs that implies in both directions: fewer people have hit
              the bugs before you, and your issues are far more likely to shape
              what gets built.
            </p>
          </Callout>
        </div>

        {/* ── Licence ────────────────────────────────────────────── */}
        <section className="mt-20">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            The licence
          </h2>
          <p className="mt-3 max-w-[64ch] text-[14px] leading-relaxed text-white/60">
            Apache-2.0. You can read it, fork it, modify it and ship it
            commercially, with a patent grant and an attribution requirement.
            A-Coder is a fork of Void, which is built on VS Code, so the VS Code
            licence ships alongside as a separate file.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/licence"
              className="text-[13.5px] text-ember-300 underline-offset-4 hover:underline"
            >
              What the licence lets you do →
            </Link>
          </div>
        </section>

        {/* ── Lineage ────────────────────────────────────────────── */}
        <section className="mt-20">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            What it is built on
          </h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {LINEAGE.map((l) => (
              <Card key={l.name} className="p-6" interactive={false}>
                <h3 className="text-[15px] font-medium text-steel-50">
                  {l.name}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/60">
                  {l.body}
                </p>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-3 inline-block text-[12.5px] text-ember-300 underline-offset-4 hover:underline"
                >
                  Upstream repository ↗
                </a>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Stack ──────────────────────────────────────────────── */}
        <section className="mt-20">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            The stack
          </h2>
          <div className="mt-7">
            <SpecTable
              head={["Layer", "Technology"]}
              rows={STACK.map(([a, b]) => [a, b])}
            />
          </div>
        </section>

        {/* ── Build from source ──────────────────────────────────── */}
        <section className="mt-20">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Build it yourself
          </h2>
          <p className="mt-3 max-w-[64ch] text-[14px] leading-relaxed text-white/60">
            Four steps, and the Development Guide covers the rest — including a
            separate guide for Windows, where the native build has its own
            requirements.
          </p>
          <div className="mt-7">
            <NumberedList items={BUILD} />
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {[
              ["Development Guide", "DEVELOPMENT_GUIDE.md"],
              ["Codebase Guide", "VOID_CODEBASE_GUIDE.md"],
              ["Windows Build Guide", "WINDOWS_BUILD_GUIDE.md"],
              ["How to contribute", "HOW_TO_CONTRIBUTE.md"],
            ].map(([label, file]) => (
              <a
                key={file}
                href={repoDoc(file)}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[13px] text-ember-300 underline-offset-4 hover:underline"
              >
                {label} ↗
              </a>
            ))}
          </div>
        </section>

        {/* ── Contributors ───────────────────────────────────────── */}
        {contributors.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
              Contributors
            </h2>
            <p className="mt-3 text-[13px] text-white/55">
              Read from the GitHub API. Counts include commits inherited from the
              upstream VS Code and Void history.
            </p>
            <ul className="mt-7 flex flex-wrap gap-2.5">
              {contributors.map((c) => (
                <li key={c.login}>
                  <a
                    href={c.htmlUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    title={`${c.login} · ${c.contributions} commits`}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1 pr-3 transition-colors hover:border-white/22"
                  >
                    <Image
                      src={c.avatarUrl}
                      alt=""
                      width={24}
                      height={24}
                      unoptimized
                      className="h-6 w-6 rounded-full"
                    />
                    <span className="text-[12.5px] text-white/68">
                      {c.login}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── How to help ────────────────────────────────────────── */}
        <section className="mt-20">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Helping out
          </h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <Card className="p-6" interactive={false}>
              <Badge>Code</Badge>
              <p className="mt-3 text-[13px] leading-relaxed text-white/60">
                Read the contributing guide, then open a pull request. The
                codebase guide is the fastest way to find your way around a
                VS Code fork.
              </p>
            </Card>
            <Card className="p-6" interactive={false}>
              <Badge>Discuss</Badge>
              <p className="mt-3 text-[13px] leading-relaxed text-white/60">
                The community forum is where questions and feature ideas go,
                since the repository has issues turned off.
              </p>
            </Card>
            <Card className="p-6" interactive={false}>
              <Badge>Fund</Badge>
              <p className="mt-3 text-[13px] leading-relaxed text-white/60">
                There is a Buy Me a Coffee page if you want to support the work
                directly.
              </p>
            </Card>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <a
              href={EXTERNAL.forum}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[13px] text-ember-300 underline-offset-4 hover:underline"
            >
              Community forum ↗
            </a>
            <a
              href={EXTERNAL.support}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[13px] text-ember-300 underline-offset-4 hover:underline"
            >
              Buy Me a Coffee ↗
            </a>
            <Link
              href="/community"
              className="text-[13px] text-ember-300 underline-offset-4 hover:underline"
            >
              Community page →
            </Link>
          </div>
        </section>

        <SourceNote href={SITE.repoUrl}>
          Stats and contributors are read from the GitHub API at build time and
          refreshed hourly; the stack and build steps come from the
          repository&apos;s README and Development Guide.
        </SourceNote>
      </Container>
    </PageShell>
  );
}
