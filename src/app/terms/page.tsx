import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Arrow, ExtArrow } from "@/components/ui/primitives";
import { SourceNote, Callout, Prose } from "@/components/ui/blocks";
import { SITE, EXTERNAL } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Terms",
  description:
    "The terms on which A-Coder is provided: Apache-2.0 software, supplied as-is, with your provider relationships and your agent's actions remaining yours.",
};

const DRAFT_AS_AT = "2 October 2026";

export default function TermsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Terms"
        title="The terms, such as they are."
        lead="A-Coder is free, open-source software you run yourself. There is no account, no subscription and no service to sign up for, so most of what a terms-of-service document normally governs simply is not here."
      />

      <Container className="max-w-[820px]">
        <Callout tone="warning" title={`Draft · not yet legally reviewed · as at ${DRAFT_AS_AT}`}>
          <p>
            This page explains the practical terms of using A-Coder and{" "}
            <strong>is not yet a legally reviewed terms-of-service document</strong>.
            The binding terms for the software today are the{" "}
            <Link href="/licence">Apache-2.0 licence</Link>, which is a real legal
            instrument and governs your rights to the code. The entity,
            jurisdiction and contact route still to be settled are listed at the
            end.
          </p>
        </Callout>

        <Prose>
          <h2>What you are agreeing to</h2>
          <p>
            By downloading, building or using A-Coder you accept the terms of the{" "}
            <strong>Apache License 2.0</strong>, which is the licence the software
            is released under. That licence is the operative document. It grants
            you broad rights — to use, modify, distribute and sell — subject to
            attribution and the preservation of notices, and it includes an
            express patent grant.
          </p>

          <h2>The software is provided as-is</h2>
          <p>
            This is the part of Apache-2.0 worth reading twice, because it is the
            part people skip. The licence disclaims warranties and limits
            liability: the software is provided <strong>without warranties or
            conditions of any kind</strong>, and the contributors are not liable
            for damages arising from its use.
          </p>
          <p>
            That is not boilerplate here, it is a genuine description of the
            situation. A-Coder is an early project. Builds are unsigned. It runs
            an agent that can edit your files and execute terminal commands. Use
            version control, review what the agent proposes, and do not grant
            blanket auto-approval on a codebase you cannot afford to have broken.
          </p>

          <h2>Your agent, your responsibility</h2>
          <p>
            A-Coder gives a language model the ability to write files and run
            commands on your machine, gated by an approval system you control.
            When you approve an action — or enable auto-approval for a category —
            the consequences of that action are yours. The permission system
            exists precisely so that this is a choice rather than a default.
          </p>
          <p>
            The same applies to code the model produces. You are responsible for
            reviewing it, for its correctness, and for whether its licensing is
            compatible with your project.
          </p>

          <h2>Your relationship with model providers is yours</h2>
          <p>
            A-Coder sends requests to providers you configure, using keys you
            own. Each of those providers has its own terms, pricing, rate limits
            and acceptable-use policy, and you are contracting with them
            directly — not through this project.
          </p>
          <p>
            Practically: A-Coder cannot refund provider charges, raise your rate
            limits, or appeal a suspension. If you set a capable model loose on a
            large codebase, the token bill is between you and your provider.
          </p>

          <h2>Third-party integrations</h2>
          <p>
            MCP servers, ACP agent servers, Composio apps, Morph and any
            OpenAI-compatible endpoint are operated by other people. Connecting
            one means accepting its terms. A-Coder ships them off by default and
            requires you to enable each one explicitly, which is the only
            protection it can meaningfully offer.
          </p>

          <h2>Trade marks</h2>
          <p>
            The licence covers the code, not the name or the logo. You may fork
            A-Coder freely; please rename your fork so users can tell whose build
            they are running. See the <Link href="/brand">brand page</Link> for
            what that means in practice.
          </p>

          <h2>Upstream licences</h2>
          <p>
            A-Coder is a fork of Void, which is built on VS Code. The VS Code
            licence ships alongside as a separate file, and third-party
            dependencies carry their own notices. Both are in the repository and
            both continue to apply.
          </p>
          <p>
            One inconsistency to flag rather than hide: the repository&apos;s{" "}
            <code>product.json</code> still declares <code>MIT</code> as its
            licence name, inherited unchanged from upstream, while{" "}
            <code>LICENSE.txt</code> and GitHub both report Apache-2.0. The
            licence file is the authoritative one; the stale field is worth fixing
            in the repository.
          </p>

          <h2>This website</h2>
          <p>
            This site documents the software. It is provided for information, is
            not a contract, and may be inaccurate or out of date — where it and
            the repository disagree, the repository wins. The site collects no
            account information because it has no accounts.
          </p>

          <h2>Still to be settled</h2>
          <ul>
            <li>
              <strong>Contracting entity</strong> — the legal entity offering
              these terms, and its registered address.
            </li>
            <li>
              <strong>Governing law and venue</strong> — the jurisdiction whose
              law applies and where disputes would be heard.
            </li>
            <li>
              <strong>Notice route</strong> — a formal address for legal notices.
            </li>
            <li>
              <strong>Hosted-provider terms</strong> — the hosted A-Coder
              provider is a service rather than local software, and needs its own
              terms covering availability, payment and data handling.
            </li>
          </ul>
        </Prose>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/[0.07] pt-6">
          <Link
            href="/licence"
            className="text-[13px] text-ember-300 underline-offset-4 hover:underline"
          >
            The licence in plain terms <Arrow />
          </Link>
          <Link
            href="/privacy"
            className="text-[13px] text-ember-300 underline-offset-4 hover:underline"
          >
            Privacy <Arrow />
          </Link>
          <a
            href={SITE.licenceUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-[13px] text-ember-300 underline-offset-4 hover:underline"
          >
            Full licence text <ExtArrow />
          </a>
          <a
            href={EXTERNAL.forum}
            target="_blank"
            rel="noreferrer noopener"
            className="text-[13px] text-ember-300 underline-offset-4 hover:underline"
          >
            Ask on the forum <ExtArrow />
          </a>
        </div>

        <SourceNote href={SITE.licenceUrl}>
          The operative terms are the Apache-2.0 licence as published in the
          repository.
        </SourceNote>
      </Container>
    </PageShell>
  );
}
