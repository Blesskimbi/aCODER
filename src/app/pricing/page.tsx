import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import {
  Container,
  Section,
  Eyebrow,
  H2,
  Lead,
  Card,
  Badge,
  ButtonLink,
} from "@/components/ui/primitives";
import { getRepoStats } from "@/lib/github";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "A-Coder IDE is free forever. Bring your own API key or run local models — there is no subscription and no seat cost.",
};

const INCLUDED = [
  "Every feature in the editor, with nothing held back",
  "All four modes — Chat, Plan, Agent and Learn",
  "All 11 cloud providers and 6 local runtimes",
  "MCP, ACP, Skills, Agent Manager and the Mobile API",
  "Unlimited workspaces, threads and machines",
  "No account, no telemetry gate, no seat count",
];

export default async function PricingPage() {
  const stats = await getRepoStats();

  return (
    <>
      <Nav stars={stats.stars} />
      <main id="main" className="pt-24">
        <Section className="pb-12 pt-10">
          <Container>
            <Eyebrow tone="ember">Pricing</Eyebrow>
            <H2 className="mt-4">Free forever.</H2>
            <Lead className="mt-4">
              A-Coder is Apache-2.0 open source. You pay your model provider
              directly for what you use, or nothing at all if you run models on
              your own hardware. There is no A-Coder subscription.
            </Lead>
          </Container>
        </Section>

        <Container>
          <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
            <Card glow className="p-8">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-[52px] font-light leading-none tracking-[-0.03em] text-steel-50">
                  $0
                </span>
                <span className="text-[14px] text-white/62">forever</span>
              </div>
              <p className="mt-3 max-w-[42ch] text-[14px] leading-relaxed text-white/60">
                Bring your own key, or run local models and pay nothing to
                anyone.
              </p>

              <ul className="mt-7 space-y-2.5">
                {INCLUDED.map((i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember-400"
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                    <span className="text-[13px] leading-relaxed text-white/65">
                      {i}
                    </span>
                  </li>
                ))}
              </ul>

              <ButtonLink href="/download" size="lg" className="mt-8">
                Download A-Coder
              </ButtonLink>
            </Card>

            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="text-[14px] font-medium text-steel-50">
                  What you actually pay for
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/58">
                  Model usage, billed by whichever provider you configure —
                  Anthropic, OpenAI, Google and so on — at their rates, to your
                  own account. A-Coder never sits in the middle of that
                  transaction, and takes no margin.
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-white/58">
                  Run Ollama, vLLM, LM&nbsp;Studio, LiteLLM or llama.cpp
                  locally and that cost is zero too.
                </p>
              </Card>

              {/* TODO — remove once tiers are decided. Nothing is invented here. */}
              <Card
                interactive={false}
                className="border-dashed p-6 opacity-80"
              >
                <Badge tone="warning">TODO · not yet decided</Badge>
                <h3 className="mt-3 text-[14px] font-medium text-steel-50">
                  Future paid tiers
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/50">
                  This slot is reserved for hosted or team offerings if they
                  ever exist. No tiers, prices or features have been decided, so
                  none are shown. This placeholder is deliberate — see
                  PRODUCT_NOTES.md.
                </p>
              </Card>
            </div>
          </div>
        </Container>

        <div className="h-24" />
      </main>
      <Footer stars={stats.stars} />
    </>
  );
}
