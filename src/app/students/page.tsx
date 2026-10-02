import type { Metadata } from "next";
import Link from "next/link";
import { Sprout, Leaf, TreeDeciduous } from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Card, Badge, Arrow } from "@/components/ui/primitives";
import { SpecTable, SourceNote, Callout, CardGrid } from "@/components/ui/blocks";
import { guide } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "For students",
  description:
    "Learn Mode turns the editor into a tutor: three levels, four exercise types, hints that escalate one step at a time, quizzes, streaks and badges.",
};

const LEVELS = [
  {
    icon: Sprout,
    name: "Beginner",
    body: "New to coding. Simple explanations, no jargon.",
  },
  {
    icon: Leaf,
    name: "Intermediate",
    body: "Some experience. Technical terms, with definitions.",
  },
  {
    icon: TreeDeciduous,
    name: "Advanced",
    body: "Experienced. Deep dives and best practices.",
  },
];

const TOOLS = [
  ["explain_code", "Line-by-line explanation of code, pitched at your level."],
  ["teach_concept", "Teaches a concept from scratch — analogy, example, exercise."],
  ["create_exercise", "Generates a practice exercise in one of four formats."],
  ["check_answer", "Marks your solution without revealing it when you are wrong."],
  ["give_hint", "A progressive hint. Each request advances exactly one level."],
  ["create_lesson_plan", "Builds a multi-module learning path toward a goal."],
  ["display_lesson", "Renders a lesson in its own preview tab."],
];

const EXERCISES = [
  ["fill_blank", "Fill in the missing code in a snippet."],
  ["fix_bug", "Find and fix a bug in code you are given."],
  ["write_function", "Write a function from a specification."],
  ["extend_code", "Add new behaviour to existing code."],
];

const PROGRESS = [
  {
    title: "What is counted",
    body: "Lessons completed, exercises solved, quizzes taken and time spent — tracked per thread and across all of them.",
  },
  {
    title: "Streaks",
    body: "Consecutive days spent learning, both your current run and your longest.",
  },
  {
    title: "Badges",
    body: "Unlockable across lessons, exercises, quizzes, streaks and milestones.",
  },
  {
    title: "Stored locally",
    body: "Progress lives in your own ~/.a-coder data folder, not on anyone's server.",
  },
];

const ACCESS = [
  ["preferredFontSize", "Lesson font size — small, medium or large."],
  ["preferredCodeTheme", "Code-block theme in lessons — light, dark or auto."],
  ["enableReducedMotion", "Reduce motion throughout the learning UI."],
  ["enableHighContrast", "High-contrast learning UI."],
  ["enableCelebrations", "Celebration animations on achievements. On by default."],
  ["enableSoundEffects", "Sound effects on achievements. Off by default."],
];

export default function StudentsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="For students"
        title="An editor that teaches while you build."
        lead="Learn Mode is a real mode, not a documentation tab. Pick a level and the model explains, sets exercises, marks your work without giving the answer away, and escalates hints one step at a time."
      >
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge tone="ember">Free, like the rest of the editor</Badge>
          <Badge>No teaching tool ever waits on approval</Badge>
        </div>
      </PageHeader>

      <Container className="max-w-[960px]">
        {/* ── Levels ─────────────────────────────────────────────── */}
        <section>
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Three levels
          </h2>
          <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-white/60">
            You pick one when you first enter Learn mode, and change it later
            from the chat header. The choice is remembered across sessions.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {LEVELS.map((l) => (
              <Card key={l.name} className="p-6" interactive={false}>
                <l.icon
                  aria-hidden="true"
                  className="h-6 w-6 text-ember-300"
                  strokeWidth={1.5}
                />
                <h3 className="mt-3 text-[15px] font-medium text-steel-50">
                  {l.name}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/58">
                  {l.body}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* ── The tutor ──────────────────────────────────────────── */}
        <section className="mt-20">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            What the tutor can do
          </h2>
          <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-white/60">
            Seven dedicated teaching tools, all auto-approved. Learning never
            stops at a permission prompt.
          </p>
          <div className="mt-7">
            <SpecTable
              head={["Tool", "What it does"]}
              rows={TOOLS.map(([t, d]) => [
                <code key={t} className="font-mono text-[12px]">
                  {t}
                </code>,
                d,
              ])}
            />
          </div>
        </section>

        {/* ── Exercises & hints ──────────────────────────────────── */}
        <section className="mt-20">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Exercises, and help that does not spoil them
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                Four exercise formats
              </h3>
              <div className="mt-4">
                <SpecTable
                  head={["Type", "What you do"]}
                  rows={EXERCISES.map(([t, d]) => [
                    <code key={t} className="font-mono text-[12px]">
                      {t}
                    </code>,
                    d,
                  ])}
                />
              </div>
            </div>

            <Card className="p-7" interactive={false}>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                Hints escalate in four steps
              </h3>
              <ol className="mt-4 space-y-3">
                {["A nudge in the right direction", "Narrower — where to look", "Close to the shape of the answer", "The solution"].map(
                  (step, i) => (
                    <li key={step} className="flex gap-3 text-[13px] leading-relaxed">
                      <span className="mt-[1px] font-mono text-[11px] text-ember-400">
                        {i + 1}
                      </span>
                      <span className="text-white/62">{step}</span>
                    </li>
                  ),
                )}
              </ol>
              <p className="mt-5 border-t border-white/[0.07] pt-4 text-[12.5px] leading-relaxed text-white/55">
                Each request advances exactly one level, and the tutor tracks how
                many you have used per exercise — so asking for help does not
                immediately end the exercise, and it will not repeat or overshoot.
              </p>
            </Card>
          </div>
        </section>

        {/* ── Progress ───────────────────────────────────────────── */}
        <section className="mt-20">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Progress, streaks and badges
          </h2>
          <div className="mt-7">
            <CardGrid>
              {PROGRESS.map((p) => (
                <Card key={p.title} className="p-6" interactive={false}>
                  <h3 className="text-[14px] font-medium text-steel-50">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/58">
                    {p.body}
                  </p>
                </Card>
              ))}
            </CardGrid>
          </div>
        </section>

        {/* ── Proactive coach ────────────────────────────────────── */}
        <section className="mt-20">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            The ambient half: Proactive Coach
          </h2>
          <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-white/60">
            Learn mode is tutoring you ask for. The Proactive Coach is tutoring
            offered — it watches editor activity and surfaces a dismissible
            bubble when it notices something worth discussing. Discuss opens the
            chat; Dismiss closes it.
          </p>
          <div className="mt-6 max-w-[62ch]">
            <Callout title="Off by default, and rate-limited">
              <p>
                <code>enableProactiveCoach</code> is off until you turn it on,
                and <code>proactiveCoachIntervalSeconds</code> sets the minimum
                gap between checks — 120 seconds by default. Raise it to make the
                coach less intrusive; set it to zero and it never fires at all.
              </p>
            </Callout>
          </div>
        </section>

        {/* ── Accessibility ──────────────────────────────────────── */}
        <section className="mt-20">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Comfort and accessibility
          </h2>
          <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-white/60">
            These live in the Learn-mode UI rather than the main Settings tabs.
          </p>
          <div className="mt-7">
            <SpecTable
              head={["Setting", "Purpose"]}
              rows={ACCESS.map(([k, d]) => [
                <code key={k} className="font-mono text-[12px]">
                  {k}
                </code>,
                d,
              ])}
            />
          </div>
        </section>

        <div className="mt-20 flex flex-wrap items-center gap-3 border-t border-white/[0.07] pt-8">
          <Badge>Next</Badge>
          <Link
            href="/modes/learn"
            className="text-[13.5px] text-ember-300 underline-offset-4 hover:underline"
          >
            Learn mode in the modes reference <Arrow />
          </Link>
          <span className="text-white/25">·</span>
          <Link
            href="/help/learn-mode-basics"
            className="text-[13.5px] text-ember-300 underline-offset-4 hover:underline"
          >
            Getting started with it <Arrow />
          </Link>
        </div>

        <SourceNote href={guide("learn-mode.md")}>
          Tool names, exercise types, hint levels and setting keys are quoted
          from the repository&apos;s Learn Mode and Proactive Coach guides.
        </SourceNote>
      </Container>
    </PageShell>
  );
}
