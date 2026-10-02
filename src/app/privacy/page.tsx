import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Arrow, ExtArrow } from "@/components/ui/primitives";
import { SourceNote, Callout, Prose } from "@/components/ui/blocks";
import { SITE, EXTERNAL, guide } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What A-Coder does and does not do with your code: direct-to-provider requests, local-model support, local storage, and the one hosted exception.",
};

/** Keep in step with the review notice below. */
const DRAFT_AS_AT = "2 October 2026";

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Privacy"
        title="What happens to your code."
        lead="A-Coder is a desktop application, not a hosted service. Most of what a privacy policy usually has to explain does not apply, because there is no server in the middle to explain."
      />

      <Container className="max-w-[820px]">
        {/* The honest status of this document, before the document. */}
        <Callout tone="warning" title={`Draft · not yet legally reviewed · as at ${DRAFT_AS_AT}`}>
          <p>
            This page describes <strong>verified technical behaviour</strong> of
            the software, drawn from its source and documentation. It is{" "}
            <strong>not yet a legally reviewed privacy policy</strong>, and it
            should not be relied on as one. Three things must be settled before it
            becomes binding: the legal entity that controls any data, a contact
            address for privacy requests, and the governing jurisdiction. Those
            are marked below.
          </p>
        </Callout>

        <Prose>
          <h2>The short version</h2>
          <p>
            Your prompts and code go from your machine straight to whichever
            model provider you configured. A-Coder does not relay them through a
            server of its own, because the desktop product does not have one.
            With a local model, nothing leaves your machine at all.
          </p>

          <h2>Requests go directly to your provider</h2>
          <p>
            When you send a message, A-Coder dispatches the request from your
            computer to the provider endpoint you configured — Anthropic, OpenAI,
            your own Ollama server, or any of the others. There is no A-Coder
            proxy, gateway or relay in that path. You can verify this in the
            source rather than taking it on trust; dispatch lives in{" "}
            <code>SendLLMMessageService</code>.
          </p>
          <p>
            This means the provider you chose receives your prompt and whatever
            code context was attached to it, and{" "}
            <strong>their</strong> privacy terms govern what happens to it next.
            A-Coder cannot and does not change that. Read the terms of the
            provider you are sending to.
          </p>

          <h2>Your API keys</h2>
          <p>
            Keys are stored in the editor&apos;s own settings on your device, and
            sent only to the provider they belong to. You hold the account, you
            see the usage, and you can revoke a key without involving this
            project.
          </p>

          <h2>Running with nothing leaving the machine</h2>
          <p>
            Point A-Coder at a local runtime — Ollama, LM Studio, vLLM,
            llama.cpp, LiteLLM, or any OpenAI-compatible server you host — and no
            code, prompt or diff crosses the network. Models are detected from the
            local endpoint. This is the configuration to choose if your code
            cannot leave your environment.
          </p>

          <h2>The one hosted exception</h2>
          <p>
            Two provider options in the settings list are not third-party and are
            not local: the <strong>hosted A-Coder provider</strong> and{" "}
            <strong>Ollama Cloud</strong>. Choosing either sends your requests to
            a hosted endpoint. The project&apos;s documentation states that the
            hosted A-Coder provider forwards to an inference proxy as needed and
            directs you to its own terms. If you need the direct-to-provider or
            fully-local guarantee, do not select these.
          </p>

          <h2>What is stored on your machine</h2>
          <ul>
            <li>
              Chat threads and history, in the editor&apos;s own storage. You can
              export the full history as JSON, or delete it.
            </li>
            <li>
              Learn Mode progress — lessons, exercises, streaks and badges — in
              your <code>~/.a-coder</code> data folder.
            </li>
            <li>Settings, including your provider keys and model assignments.</li>
            <li>
              Skills you install, under <code>~/.a-coder/skills/</code>.
            </li>
          </ul>

          <h2>Telemetry</h2>
          <p>
            The project states that it does not collect your data or use it for
            training. Two qualifications belong alongside that claim, in the
            interest of not overstating it:
          </p>
          <ul>
            <li>
              A-Coder is built on VS Code&apos;s open-source core and{" "}
              <strong>inherits that base&apos;s own telemetry settings</strong>.
              Those are governed by their own configuration — review them in
              Settings if your environment requires it.
            </li>
            <li>
              No independent telemetry audit has been published. The claim is the
              project&apos;s own, and the architecture is consistent with it, but
              it has not been externally verified.
            </li>
          </ul>

          <h2>Features that reach the network when you enable them</h2>
          <p>
            All of these are off by default. Each one is a deliberate decision to
            send something somewhere:
          </p>
          <ul>
            <li>
              <strong>MCP and ACP servers</strong> — remote ones receive whatever
              the agent passes to their tools.
            </li>
            <li>
              <strong>Composio</strong> — connected apps receive tool calls, and
              triggers push events back to a local listener.
            </li>
            <li>
              <strong>Morph</strong> — Fast Context, Fast Apply and Repo Storage
              send code to Morph for search, application and indexing.
            </li>
            <li>
              <strong>Mobile API</strong> — localhost-bound unless you expose it
              through a tunnel, at which point a token is the only control in
              front of your editor.
            </li>
            <li>
              <strong>Media generation</strong> — image and video prompts go to
              the endpoint you configured.
            </li>
          </ul>

          <h2>Children</h2>
          <p>
            Learn Mode is designed for people learning to code, which includes
            students. The editor itself stores progress locally and does not
            transmit it. Note that the <em>model provider</em> you configure may
            have its own age requirements — most commercial providers set a
            minimum age in their terms — so check those before setting a student
            up with a cloud key.
          </p>

          <h2>Still to be settled</h2>
          <p>
            These are the gaps that keep this a draft rather than a policy:
          </p>
          <ul>
            <li>
              <strong>Data controller</strong> — the legal entity responsible,
              and its registered address.
            </li>
            <li>
              <strong>Contact route</strong> — where to send a privacy question
              or a data request. The repository currently has issues disabled, so
              that is not a route.
            </li>
            <li>
              <strong>Governing law</strong> — the jurisdiction this document
              operates under, and which statutory rights therefore apply.
            </li>
            <li>
              <strong>Telemetry audit</strong> — a documented review of what the
              inherited VS Code base sends, and under which settings.
            </li>
          </ul>
        </Prose>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/[0.07] pt-6">
          <Link
            href="/security"
            className="text-[13px] text-ember-300 underline-offset-4 hover:underline"
          >
            Security architecture <Arrow />
          </Link>
          <Link
            href="/terms"
            className="text-[13px] text-ember-300 underline-offset-4 hover:underline"
          >
            Terms <Arrow />
          </Link>
          <Link
            href="/licence"
            className="text-[13px] text-ember-300 underline-offset-4 hover:underline"
          >
            Licence <Arrow />
          </Link>
          <a
            href={EXTERNAL.forum}
            target="_blank"
            rel="noreferrer noopener"
            className="text-[13px] text-ember-300 underline-offset-4 hover:underline"
          >
            Ask on the forum <ExtArrow />
          </a>
        </div>

        <SourceNote href={guide("providers-and-models.md")}>
          Technical claims on this page are drawn from the repository&apos;s
          source and user guides, and every one of them can be checked against{" "}
          <a href={SITE.repoUrl} target="_blank" rel="noreferrer noopener">
            the code
          </a>
          .
        </SourceNote>
      </Container>
    </PageShell>
  );
}
