import Image from "next/image";
import { GitFork, Star, Tag } from "lucide-react";
import {
  Container,
  Section,
  Eyebrow,
  H2,
  Lead,
  ButtonLink,
  Card,
} from "@/components/ui/primitives";
import { SITE } from "@/lib/site";
import type { Contributor, RepoStats } from "@/lib/github";

/** Real numbers from the GitHub API, presented as facts — never as
    "join thousands of developers". See PRODUCT_NOTES.md §1. */

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Star;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Icon className="h-4 w-4 text-white/58" strokeWidth={1.75} aria-hidden="true" />
      <span className="tnum font-display text-[28px] font-light leading-none tracking-[-0.03em] text-steel-50">
        {value}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
        {label}
      </span>
    </div>
  );
}

export function OpenSource({
  stats,
  contributors,
  version,
  publishedAt,
}: {
  stats: RepoStats;
  contributors: Contributor[];
  version: string;
  publishedAt: string | null;
}) {
  const released = publishedAt
    ? new Intl.DateTimeFormat("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(publishedAt))
    : null;

  return (
    <Section>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <Eyebrow tone="ember">Open source</Eyebrow>
            <H2 className="mt-4">Read it, fork it, ship it.</H2>
            <Lead className="mt-4">
              The whole editor is Apache-2.0 on GitHub — not an open core with
              the useful parts held back. A-Coder&apos;s own code lives in{" "}
              <code className="rounded-xs bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-white/70">
                src/vs/workbench/contrib/void/
              </code>
              .
            </Lead>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={SITE.repoUrl} external>
                View on GitHub
              </ButtonLink>
              <ButtonLink href="/changelog" tone="ghost">
                Changelog
              </ButtonLink>
            </div>
          </div>

          <Card className="p-7">
            <div className="grid grid-cols-3 gap-6">
              <Stat
                icon={Star}
                value={stats.stars.toLocaleString("en-AU")}
                label="Stars"
              />
              <Stat
                icon={GitFork}
                value={stats.forks.toLocaleString("en-AU")}
                label="Forks"
              />
              <Stat icon={Tag} value={version} label="Latest" />
            </div>

            {released && (
              <p className="mt-5 font-mono text-[11px] text-white/55">
                Released {released}
                {!stats.isLive && " · cached"}
              </p>
            )}

            {contributors.length > 0 && (
              <div className="mt-6 border-t border-white/[0.07] pt-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
                  Contributors
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {contributors.map((c) => (
                    <a
                      key={c.login}
                      href={c.htmlUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      title={`${c.login} — ${c.contributions} commits`}
                      className="block overflow-hidden rounded-full ring-1 ring-white/10 transition-transform hover:-translate-y-0.5"
                    >
                      <Image
                        src={c.avatarUrl}
                        alt={c.login}
                        width={30}
                        height={30}
                        className="h-[30px] w-[30px]"
                        unoptimized
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </Container>
    </Section>
  );
}
