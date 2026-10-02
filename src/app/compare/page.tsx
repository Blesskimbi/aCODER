import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Badge, cx } from "@/components/ui/primitives";
import { SourceNote, Callout } from "@/components/ui/blocks";
import { COMPARE_COLUMNS, COMPARE_GROUPS, type Cell } from "@/content/compare";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Compare",
  description:
    "How A-Coder differs from Cursor, Windsurf and VS Code with Copilot on licence, model choice, data handling, agent behaviour and extensibility.",
};

function Cellish({ value, strong }: { value: Cell; strong: boolean }) {
  if (value === true)
    return (
      <>
        <Check
          aria-hidden="true"
          className={cx("h-4 w-4", strong ? "text-diff-add" : "text-white/55")}
        />
        <span className="sr-only">Yes</span>
      </>
    );

  if (value === false)
    return (
      <>
        <Minus aria-hidden="true" className="h-4 w-4 text-white/22" />
        <span className="sr-only">No</span>
      </>
    );

  return (
    <span
      className={cx(
        "text-[12.5px] leading-snug",
        strong ? "text-steel-100" : "text-white/55",
      )}
    >
      {value}
    </span>
  );
}

export default function ComparePage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Compare"
        title="Against the alternatives."
        lead="The honest version: A-Coder wins on openness, model choice and data control, and it is a far newer, far smaller project than anything it is listed beside. Both halves of that matter."
      />

      <Container className="max-w-[1000px]">
        <Callout title="The rules this table follows">
          <p>
            Nothing is claimed about another product&apos;s data handling — those
            cells say “See their policy”, because asserting otherwise would mean
            guessing about software we cannot read. There are no prices for other
            products either: they change constantly, and a stale price is worse
            than none. The A-Coder column is sourced from its repository and can
            be checked against it.
          </p>
        </Callout>

        <div className="mt-12 space-y-14">
          {COMPARE_GROUPS.map((group) => (
            <section key={group.title}>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-ember-400">
                {group.title}
              </h2>

              <div className="-mx-4 mt-5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th scope="col" className="w-[30%] py-3 pr-5" />
                      {COMPARE_COLUMNS.map((c, i) => (
                        <th
                          key={c}
                          scope="col"
                          className={cx(
                            "py-3 pr-5 text-[12.5px] font-medium",
                            i === 0 ? "text-steel-50" : "text-white/55",
                          )}
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows.map((row) => (
                      <tr
                        key={row.label}
                        className="border-b border-white/[0.055] last:border-0"
                      >
                        <th
                          scope="row"
                          className="py-3.5 pr-5 align-top text-[13px] font-normal text-white/70"
                        >
                          {row.label}
                          {row.note && (
                            <span className="mt-1 block text-[11.5px] leading-snug text-white/40">
                              {row.note}
                            </span>
                          )}
                        </th>
                        {row.cells.map((cell, i) => (
                          <td key={i} className="py-3.5 pr-5 align-top">
                            <Cellish value={cell} strong={i === 0} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>

        {/* ── The other side of it ───────────────────────────────── */}
        <section className="mt-20">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Where A-Coder is behind
          </h2>
          <p className="mt-3 max-w-[64ch] text-[14px] leading-relaxed text-white/60">
            A comparison table that only flatters its author is not worth
            reading, so:
          </p>
          <ul className="mt-6 max-w-[64ch] space-y-3">
            {[
              "It is young and small. The repository has a few dozen stars and a handful of forks — the commercial alternatives have orders of magnitude more users finding bugs before you do.",
              "Builds are unsigned. On macOS you have to clear the quarantine flag by hand before the first launch.",
              "Windows x64 is missing from the current release. Only arm64 Windows artefacts are published, which is the minority of Windows machines.",
              "There is no published privacy policy or telemetry audit. The architecture supports the claims the project makes, but a formal policy document does not yet exist.",
              "Documentation is thorough but inconsistent in places — the repo disagrees with itself about the third mode's name and about what Ctrl+L does.",
            ].map((t) => (
              <li key={t} className="flex gap-2.5 text-[13.5px] leading-relaxed">
                <span
                  aria-hidden="true"
                  className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-warning/70"
                />
                <span className="text-white/60">{t}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-16 flex flex-wrap items-center gap-3 border-t border-white/[0.07] pt-8">
          <Badge>Next</Badge>
          <Link
            href="/migrate"
            className="text-[13.5px] text-ember-300 underline-offset-4 hover:underline"
          >
            Switching from one of them →
          </Link>
          <span className="text-white/25">·</span>
          <Link
            href="/open-source"
            className="text-[13.5px] text-ember-300 underline-offset-4 hover:underline"
          >
            Read the source yourself →
          </Link>
        </div>

        <SourceNote href="https://github.com/hamishfromatech/A-Coder">
          Every A-Coder cell is drawn from the repository and its user guides.
          Check any of them against
        </SourceNote>
      </Container>
    </PageShell>
  );
}
