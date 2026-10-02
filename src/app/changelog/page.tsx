import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import {
  Container,
  Section,
  Eyebrow,
  H2,
  Lead,
  Badge,
} from "@/components/ui/primitives";
import {
  getRepoStats,
  getReleases,
  releaseSlug,
  type Release,
} from "@/lib/github";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Every A-Coder IDE release, straight from GitHub — new features, improvements and fixes.",
};

const date = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(iso))
    : "";

/**
 * Release bodies are GitHub-flavoured markdown. Rather than pull in a
 * full renderer for a handful of constructs, handle the three that
 * actually appear: headings, list items and inline bold.
 */
function ReleaseBody({ body }: { body: string }) {
  const lines = body.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) {
    return (
      <p className="text-[13px] text-white/58">
        No notes were published for this release.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {lines.slice(0, 14).map((raw, i) => {
        const line = raw.trim();

        if (line.startsWith("#")) {
          return (
            <h3
              key={i}
              className="pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/58"
            >
              {line.replace(/^#+\s*/, "")}
            </h3>
          );
        }

        if (/^[-*]\s/.test(line)) {
          const text = line.replace(/^[-*]\s*/, "");
          const [, lead, rest] =
            text.match(/^\*\*(.+?)\*\*\s*(?:—|-)?\s*(.*)$/) ?? [];
          return (
            <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed">
              <span
                aria-hidden="true"
                className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ember-400/60"
              />
              <p className="text-white/60">
                {lead ? (
                  <>
                    <span className="text-steel-100">{lead}</span>
                    {rest ? ` — ${rest}` : ""}
                  </>
                ) : (
                  text.replace(/\*\*/g, "")
                )}
              </p>
            </div>
          );
        }

        if (line.startsWith("---")) return null;

        return (
          <p key={i} className="text-[13px] leading-relaxed text-white/55">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      })}
    </div>
  );
}

function Entry({ release, first }: { release: Release; first: boolean }) {
  return (
    <li className="relative grid gap-5 pb-12 pl-8 md:grid-cols-[180px_1fr] md:gap-10 md:pl-10">
      {/* Timeline rail */}
      <span
        aria-hidden="true"
        className="absolute left-[3px] top-2 h-full w-px bg-white/[0.08]"
      />
      <span
        aria-hidden="true"
        className={`absolute left-0 top-[7px] h-[7px] w-[7px] rounded-full ${
          first ? "bg-ember-400" : "bg-white/20"
        }`}
      />

      <div>
        <div className="flex items-center gap-2">
          <h2 className="font-display text-[20px] font-light tracking-tight text-steel-50">
            <Link
              href={`/changelog/${releaseSlug(release.version)}`}
              className="underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              {release.version}
            </Link>
          </h2>
          {first && <Badge tone="ember">Latest</Badge>}
        </div>
        <p className="mt-1 font-mono text-[11px] text-white/55">
          {date(release.publishedAt)}
        </p>
        <Link
          href={`/changelog/${releaseSlug(release.version)}`}
          className="mt-2 inline-block font-mono text-[11px] text-white/50 underline-offset-4 transition-colors hover:text-ember-300 hover:underline"
        >
          Full notes &amp; downloads →
        </Link>
        <a
          href={release.url}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-1 block font-mono text-[11px] text-white/42 underline-offset-4 transition-colors hover:text-white/60 hover:underline"
        >
          {release.tag} ↗
        </a>
      </div>

      <div className="min-w-0">
        <ReleaseBody body={release.body} />
      </div>
    </li>
  );
}

export default async function ChangelogPage() {
  const [stats, releases] = await Promise.all([
    getRepoStats(),
    getReleases(),
  ]);

  return (
    <>
      <Nav stars={stats.stars} />
      <main id="main" className="pt-24">
        <Section className="pb-10 pt-10">
          <Container>
            <Eyebrow tone="ember">Changelog</Eyebrow>
            <H2 className="mt-4">What shipped, and when.</H2>
            <Lead className="mt-4">
              Pulled straight from GitHub Releases and refreshed hourly, so
              this page and the repository can never disagree.
            </Lead>
          </Container>
        </Section>

        <Container className="max-w-[900px]">
          {releases.length > 0 ? (
            <ol className="mt-6">
              {releases.map((r, i) => (
                <Entry key={r.tag} release={r} first={i === 0} />
              ))}
            </ol>
          ) : (
            <div className="card p-8 text-center">
              <p className="text-[14px] text-white/60">
                Release data is temporarily unavailable.
              </p>
              <a
                href={SITE.releasesUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-2 inline-block text-[13px] text-ember-300 underline-offset-4 hover:underline"
              >
                View releases on GitHub →
              </a>
            </div>
          )}

          <p className="border-t border-white/[0.07] pt-6 text-[12px] text-white/55">
            Release tags follow the VS&nbsp;Code base version; titles carry the
            A-Coder version.{" "}
            <a
              href={SITE.releasesUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-white/55 underline-offset-4 hover:underline"
            >
              Full history on GitHub
            </a>
            .
          </p>
        </Container>

        <div className="h-24" />
      </main>
      <Footer stars={stats.stars} />
    </>
  );
}
