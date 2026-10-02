import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Card, Badge, ButtonLink, Arrow, ExtArrow, BackArrow } from "@/components/ui/primitives";
import { SourceNote } from "@/components/ui/blocks";
import {
  getReleases,
  mapPlatforms,
  assetFormat,
  formatBytes,
  releaseSlug as slug,
  findRelease,
} from "@/lib/github";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  const releases = await getReleases();
  return releases.map((r) => ({ version: slug(r.version) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ version: string }>;
}): Promise<Metadata> {
  const { version } = await params;
  const releases = await getReleases();
  const release = findRelease(releases, version);
  if (!release) return { title: "Release not found" };
  return {
    title: `Release ${release.version}`,
    description: `What shipped in A-Coder IDE ${release.version}, including every published installer and its checksum.`,
  };
}

const date = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(iso))
    : "Unpublished";

/**
 * Release bodies are GitHub-flavoured markdown. The changelog index
 * handles the three constructs that actually appear; this page shows the
 * whole body rather than the first fourteen lines.
 */
function Notes({ body }: { body: string }) {
  const lines = body.split(/\r?\n/).filter((l) => l.trim().length > 0);

  if (lines.length === 0) {
    return (
      <p className="text-[13.5px] text-white/58">
        No notes were published for this release.
      </p>
    );
  }

  return (
    <div className="space-y-2.5">
      {lines.map((raw, i) => {
        const line = raw.trim();
        if (line.startsWith("---")) return null;

        if (line.startsWith("#")) {
          return (
            <h3
              key={i}
              className="pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ember-400"
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
            <div key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed">
              <span
                aria-hidden="true"
                className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-ember-400/60"
              />
              <p className="text-white/62">
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

        return (
          <p key={i} className="text-[13.5px] leading-relaxed text-white/58">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      })}
    </div>
  );
}

export default async function ReleasePage({
  params,
}: {
  params: Promise<{ version: string }>;
}) {
  const { version } = await params;
  const releases = await getReleases();
  const release = findRelease(releases, version);

  // An empty list means the API failed, not that the release is gone —
  // 404ing then would hide a working page behind a rate limit.
  if (releases.length === 0) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="Changelog"
          title="Release data is temporarily unavailable."
          lead="The GitHub API did not answer this build. The full history is always on GitHub."
          breadcrumb={{ label: "Changelog", href: "/changelog" }}
        />
        <Container className="max-w-[820px]">
          <ButtonLink href={SITE.releasesUrl} external>
            View releases on GitHub
          </ButtonLink>
        </Container>
      </PageShell>
    );
  }

  if (!release) notFound();

  const index = releases.findIndex((r) => r.tag === release.tag);
  const isLatest = index === 0;
  const newer = index > 0 ? releases[index - 1] : null;
  const older = releases[index + 1] ?? null;

  const platforms = mapPlatforms(release).filter((p) => p.asset);

  return (
    <PageShell>
      <PageHeader
        eyebrow={`Release · ${date(release.publishedAt)}`}
        title={release.version}
        breadcrumb={{ label: "Changelog", href: "/changelog" }}
      >
        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          {isLatest && <Badge tone="ember">Latest</Badge>}
          <Badge>tag {release.tag}</Badge>
          <a
            href={release.url}
            target="_blank"
            rel="noreferrer noopener"
            className="text-[12.5px] text-white/55 underline-offset-4 hover:text-ember-300 hover:underline"
          >
            On GitHub <ExtArrow />
          </a>
        </div>
      </PageHeader>

      <Container className="max-w-[820px]">
        <section>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
            Release notes
          </h2>
          <div className="mt-5">
            <Notes body={release.body} />
          </div>
        </section>

        {/* ── Downloads ──────────────────────────────────────────── */}
        {platforms.length > 0 && (
          <section className="mt-16">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
              Installers in this release
            </h2>
            <p className="mt-3 max-w-[60ch] text-[13px] leading-relaxed text-white/55">
              Every artefact ships a SHA-256 sidecar. Remote extension-host
              builds are filtered out — they are server components, not the
              desktop app.
            </p>

            <div className="mt-6 space-y-2.5">
              {platforms.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="text-[13.5px] text-steel-100">{p.label}</p>
                    <p className="mt-0.5 truncate font-mono text-[11px] text-white/42">
                      {p.asset?.name}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-mono text-[11px] text-white/45">
                      {assetFormat(p.asset!.name)} ·{" "}
                      {formatBytes(p.asset!.size)}
                    </span>
                    <ButtonLink href={p.asset!.url} external tone="ghost">
                      Download
                    </ButtonLink>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Neighbours ─────────────────────────────────────────── */}
        <section className="mt-16 border-t border-white/[0.07] pt-8">
          <div className="grid gap-3 sm:grid-cols-2">
            {newer && (
              <Link href={`/changelog/${slug(newer.version)}`} className="block">
                <Card className="h-full p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                    Newer
                  </p>
                  <p className="mt-2 text-[14px] font-medium text-steel-50">
                    {newer.version} <Arrow />
                  </p>
                </Card>
              </Link>
            )}
            {older && (
              <Link href={`/changelog/${slug(older.version)}`} className="block">
                <Card className="h-full p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                    Older
                  </p>
                  <p className="mt-2 text-[14px] font-medium text-steel-50">
                    <BackArrow /> {older.version}
                  </p>
                </Card>
              </Link>
            )}
          </div>
        </section>

        <SourceNote href={release.url}>
          Notes and assets come from the GitHub Releases API and refresh hourly.
          Tags follow the VS&nbsp;Code base version while titles carry the
          A-Coder version, so this page is addressed by title.
        </SourceNote>
      </Container>
    </PageShell>
  );
}
