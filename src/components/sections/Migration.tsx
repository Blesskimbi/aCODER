import { ArrowRight } from "lucide-react";
import {
  Container,
  Section,
  Eyebrow,
  H2,
  Lead,
  Card,
} from "@/components/ui/primitives";
import { LogoMark } from "@/components/site/LogoMark";

const SOURCES = ["VS Code", "Cursor", "Windsurf"];

export function Migration() {
  return (
    <Section>
      <Container>
        <Card className="fade-bottom fade-bottom-xs overflow-hidden p-8 md:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <Eyebrow tone="ember">Migration</Eyebrow>
              <H2 className="mt-4">Bring your editor with you.</H2>
              <Lead className="mt-4">
                A-Coder is built on VS&nbsp;Code&apos;s open-source core and
                points at the Visual Studio Marketplace, so your extensions,
                themes, keybindings and profiles carry straight over.
              </Lead>
            </div>

            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <ul className="space-y-2.5">
                {SOURCES.map((s) => (
                  <li
                    key={s}
                    className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-[13px] text-white/65"
                  >
                    {s}
                  </li>
                ))}
              </ul>

              <ArrowRight
                className="h-5 w-5 shrink-0 text-ember-400"
                aria-hidden="true"
              />

              <div className="rake-edge flex items-center gap-2.5 rounded-lg bg-white/[0.05] px-4 py-3">
                <LogoMark size={20} />
                <span className="text-[13px] font-medium text-steel-50">
                  A-Coder
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
