import { KeyRound, Server, ShieldCheck, TerminalSquare } from "lucide-react";
import {
  Container,
  Section,
  Eyebrow,
  H2,
  Lead,
  Card,
} from "@/components/ui/primitives";
import { LOCAL_PROVIDERS } from "@/content/product";

const POINTS = [
  {
    icon: Server,
    title: "No A-Coder in the path",
    body: "Requests are dispatched from your machine straight to the provider you configured. There is no relay or proxy of ours in between.",
  },
  {
    icon: KeyRound,
    title: "Your keys, your account",
    body: "You bring your own API keys and pay your provider directly. No subscription, no seat, no resold tokens.",
  },
  {
    icon: TerminalSquare,
    title: "Or nothing leaves at all",
    body: "Point it at a local runtime and your code never reaches the network. Models are auto-detected from the endpoint.",
  },
  {
    icon: ShieldCheck,
    title: "Per-tool permissions",
    body: "Approval categories, auto-approve rules, and allow and deny patterns for terminal commands. You decide what the agent may do unattended.",
  },
];

export function Privacy() {
  return (
    <Section id="privacy">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Eyebrow tone="ember">Privacy &amp; local models</Eyebrow>
            <H2 className="mt-4">Your keys. Your machine.</H2>
            <Lead className="mt-4">
              A-Coder is a client, not a service. That is an architectural
              property, not a policy promise — there is no server of ours to
              send anything to.
            </Lead>

            <div className="mt-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                Run entirely local
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {LOCAL_PROVIDERS.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 font-mono text-[11.5px] text-white/60"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {POINTS.map(({ icon: Icon, title, body }) => (
              <Card key={title} className="p-5">
                <Icon
                  className="h-4 w-4 text-ember-400"
                  aria-hidden="true"
                  strokeWidth={1.75}
                />
                <h3 className="mt-3 text-[13.5px] font-medium text-steel-50">
                  {title}
                </h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/58">
                  {body}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
