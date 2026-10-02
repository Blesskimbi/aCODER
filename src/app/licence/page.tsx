import type { Metadata } from "next";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Card, Badge, ButtonLink, Arrow, ExtArrow } from "@/components/ui/primitives";
import { SpecTable, SourceNote, Callout } from "@/components/ui/blocks";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Licence",
  description:
    "A-Coder is Apache-2.0: use it commercially, modify it, distribute it and patent-protect it, so long as you preserve notices and state your changes.",
};

const PERMITTED = [
  "Use it commercially, in a business, with no fee",
  "Modify the source however you like",
  "Distribute it, modified or not",
  "Sublicense it as part of a larger work",
  "Use it privately without publishing your changes",
  "Rely on an express patent grant from the contributors",
];

const REQUIRED = [
  "Include a copy of the licence with any distribution",
  "Preserve the copyright, patent, trade mark and attribution notices",
  "State significant changes you made to the files",
  "Include the NOTICE file's contents, if you redistribute",
];

const WITHHELD = [
  "Any warranty — the software is provided as-is",
  "Any liability for damages arising from its use",
  "Use of the A-Coder name, logo or trade marks to endorse your fork",
];

const FILES = [
  [
    "LICENSE.txt",
    "Apache-2.0",
    "A-Coder's own licence. The authoritative one.",
    "LICENSE.txt",
  ],
  [
    "LICENSE-VS-Code.txt",
    "MIT",
    "The VS Code core A-Coder is ultimately built on.",
    "LICENSE-VS-Code.txt",
  ],
  [
    "ThirdPartyNotices.txt",
    "Various",
    "Every bundled dependency and its own terms.",
    "ThirdPartyNotices.txt",
  ],
];

export default function LicencePage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Licence"
        title="Apache-2.0, and what that buys you."
        lead="A permissive licence with a patent grant. You can build a business on this, fork it in private, or ship a modified version — as long as you keep the notices and say what you changed."
      >
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <ButtonLink href={SITE.licenceUrl} external size="lg">
            Read the full text
          </ButtonLink>
          <Badge tone="ember">{SITE.licence}</Badge>
        </div>
      </PageHeader>

      <Container className="max-w-[900px]">
        {/* ── The three columns of a licence ─────────────────────── */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6" interactive={false}>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-success">
              You may
            </h2>
            <ul className="mt-4 space-y-2.5">
              {PERMITTED.map((p) => (
                <li key={p} className="flex gap-2.5 text-[13px] leading-relaxed">
                  <Check
                    aria-hidden="true"
                    className="mt-[3px] h-3.5 w-3.5 shrink-0 text-success"
                  />
                  <span className="text-white/65">{p}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6" interactive={false}>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-warning">
              You must
            </h2>
            <ul className="mt-4 space-y-2.5">
              {REQUIRED.map((p) => (
                <li key={p} className="flex gap-2.5 text-[13px] leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-warning/70"
                  />
                  <span className="text-white/65">{p}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6" interactive={false}>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-danger">
              You do not get
            </h2>
            <ul className="mt-4 space-y-2.5">
              {WITHHELD.map((p) => (
                <li key={p} className="flex gap-2.5 text-[13px] leading-relaxed">
                  <X
                    aria-hidden="true"
                    className="mt-[3px] h-3.5 w-3.5 shrink-0 text-danger"
                  />
                  <span className="text-white/65">{p}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <p className="mt-5 text-[12.5px] leading-relaxed text-white/50">
          This is a plain-language summary for orientation, not legal advice. The
          licence text itself governs, and it is short enough to read.
        </p>

        {/* ── Licence files ──────────────────────────────────────── */}
        <section className="mt-20">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Three licence files, because of the lineage
          </h2>
          <p className="mt-3 max-w-[64ch] text-[14px] leading-relaxed text-white/60">
            A-Coder is a fork of Void, which is built on VS Code. Each layer keeps
            its own terms, and all three ship in the repository.
          </p>
          <div className="mt-7">
            <SpecTable
              head={["File", "Licence", "Covers"]}
              rows={FILES.map(([file, lic, covers, path]) => [
                <a
                  key={file}
                  href={`${SITE.repoUrl}/blob/main/${path}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-mono text-[12px] text-steel-100 underline-offset-4 hover:text-ember-300 hover:underline"
                >
                  {file} <ExtArrow />
                </a>,
                <Badge key="l">{lic}</Badge>,
                covers,
              ])}
            />
          </div>
        </section>

        {/* ── The MIT discrepancy ────────────────────────────────── */}
        <section className="mt-16">
          <Callout tone="warning" title="One contradiction inside the repository">
            <p>
              <code>LICENSE.txt</code> is Apache-2.0 and GitHub reports
              Apache-2.0, but <code>product.json</code> still sets{" "}
              <code>licenseName</code> to <code>MIT</code>, and the inherited{" "}
              <code>package.json</code> says MIT too. Both look like unchanged
              upstream leftovers from the Void and VS Code bases.
            </p>
            <p>
              This site publishes <strong>Apache-2.0</strong>, on the basis that
              the licence file and GitHub&apos;s own detection agree. If you are
              making a decision that turns on the licence, read{" "}
              <code>LICENSE.txt</code> directly — and the stale field is worth
              correcting in the repository.
            </p>
          </Callout>
        </section>

        {/* ── Forking ────────────────────────────────────────────── */}
        <section className="mt-16">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            If you fork it
          </h2>
          <p className="mt-3 max-w-[64ch] text-[14px] leading-relaxed text-white/60">
            You are welcome to. Two practical asks beyond what the licence
            strictly requires: rename it, and change the{" "}
            <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-steel-100">
              acoder://
            </code>{" "}
            protocol handler. Users need to be able to tell whose build they are
            running, because that determines whose security decisions they are
            trusting.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/brand"
              className="text-[13px] text-ember-300 underline-offset-4 hover:underline"
            >
              Naming and logo rules <Arrow />
            </Link>
            <Link
              href="/open-source"
              className="text-[13px] text-ember-300 underline-offset-4 hover:underline"
            >
              Building from source <Arrow />
            </Link>
            <Link
              href="/terms"
              className="text-[13px] text-ember-300 underline-offset-4 hover:underline"
            >
              Terms of use <Arrow />
            </Link>
          </div>
        </section>

        <SourceNote href={SITE.licenceUrl}>
          Summarised from the Apache License 2.0 as published in the repository.
        </SourceNote>
      </Container>
    </PageShell>
  );
}
