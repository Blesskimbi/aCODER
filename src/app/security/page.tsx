import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import {
  Container,
  Section,
  Eyebrow,
  H2,
  Lead,
  Card,
} from "@/components/ui/primitives";
import { getRepoStats } from "@/lib/github";
import { LOCAL_PROVIDERS } from "@/content/product";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Security",
  description:
    "How A-Coder handles your code and keys: direct-to-provider requests, local model support, and per-tool permissions.",
};

const SECTIONS = [
  {
    title: "Requests go straight to the provider",
    body: "A-Coder dispatches model requests from your machine to the provider endpoint you configured. There is no A-Coder relay, proxy or gateway in the path, because there is no A-Coder server at all — it is a desktop application, not a hosted service. You can confirm this in the source: dispatch lives in SendLLMMessageService.",
  },
  {
    title: "Your keys stay on your machine",
    body: "API keys are stored in the editor's own settings on your device and sent only to the provider they belong to. You hold the account, you see the usage, and you can revoke a key without involving us.",
  },
  {
    title: "Or nothing leaves the machine",
    body: `Point A-Coder at a local runtime and no code, prompt or diff crosses the network. Supported locally: ${LOCAL_PROVIDERS.join(", ")}. Models are auto-detected from the endpoint.`,
  },
  {
    title: "The agent asks before it acts",
    body: "Tools are grouped into approval categories. You choose what runs unattended and what needs a confirmation, and terminal commands can be gated further with explicit allow and deny patterns. An agent cannot quietly run a command you have not permitted.",
  },
  {
    title: "Open to inspection",
    body: "The entire editor is Apache-2.0 on GitHub. Anything asserted on this page can be checked against the source rather than taken on trust — which is the point of shipping an AI tool as open source.",
  },
];

export default async function SecurityPage() {
  const stats = await getRepoStats();

  return (
    <>
      <Nav stars={stats.stars} />
      <main id="main" className="pt-24">
        <Section className="pb-10 pt-10">
          <Container>
            <Eyebrow tone="ember">Security</Eyebrow>
            <H2 className="mt-4">Where your code goes.</H2>
            <Lead className="mt-4">
              The short version: to the model provider you chose, and nowhere
              else. Here is the longer version.
            </Lead>
          </Container>
        </Section>

        <Container className="max-w-[860px]">
          <div className="space-y-4">
            {SECTIONS.map((s, i) => (
              <Card key={s.title} className="p-7">
                <span className="font-mono text-[10px] tracking-[0.16em] text-white/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-2 text-[16px] font-medium text-steel-50">
                  {s.title}
                </h2>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-white/62">
                  {s.body}
                </p>
              </Card>
            ))}
          </div>

          <div className="card mt-10 p-6">
            <h3 className="text-[14px] font-medium text-steel-50">
              Reporting a vulnerability
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-white/55">
              Please report security issues through the repository&apos;s issue
              tracker so they can be triaged in the open.
            </p>
            <a
              href={SITE.issuesUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 inline-block text-[13px] text-ember-300 underline-offset-4 hover:underline"
            >
              Open an issue →
            </a>
          </div>

          <p className="mt-8 text-[12px] leading-relaxed text-white/55">
            A-Coder is built on VS&nbsp;Code&apos;s open-source core. Settings
            inherited from that base, including any upstream telemetry options,
            are governed by their own configuration — review them in Settings
            if your environment requires it.
          </p>
        </Container>

        <div className="h-24" />
      </main>
      <Footer stars={stats.stars} />
    </>
  );
}
