import { Flame, GraduationCap, Trophy } from "lucide-react";
import {
  Container,
  Section,
  Eyebrow,
  H2,
  Lead,
  Card,
  Badge,
} from "@/components/ui/primitives";

export function StudentMode() {
  return (
    <Section>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <Eyebrow tone="ember">Learn mode</Eyebrow>
            <H2 className="mt-4">An editor that teaches while you build.</H2>
            <Lead className="mt-4">
              Learn mode turns the assistant into a tutor: levels, exercises,
              hints, quizzes, badges and streaks. The Proactive Coach offers
              ambient suggestions as you work, rather than waiting to be asked.
            </Lead>
          </div>

          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <GraduationCap
                    className="h-4 w-4 text-ide-teal-lit"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/58">
                    Exercise · Level 2
                  </span>
                </div>
                <h3 className="mt-3 text-[15px] font-medium text-steel-50">
                  Parameterise a SQL query
                </h3>
                <p className="mt-1.5 max-w-[38ch] text-[12.5px] leading-relaxed text-white/58">
                  Rewrite the interpolated query so user input can never reach
                  the statement directly.
                </p>
              </div>

              <div className="shrink-0 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Flame
                    className="h-3.5 w-3.5 text-ember-400"
                    aria-hidden="true"
                  />
                  <span className="tnum text-[15px] font-medium text-steel-50">
                    12
                  </span>
                </div>
                <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/55">
                  day streak
                </p>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between font-mono text-[10.5px] text-white/58">
                <span>Progress</span>
                <span className="tnum">7 / 10</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-ide-teal to-ide-teal-lit" />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-4">
              <Badge tone="ember">
                <Trophy className="h-3 w-3" aria-hidden="true" />
                SQL safety
              </Badge>
              <Badge>Hints used · 1</Badge>
              <Badge>Quiz passed</Badge>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
