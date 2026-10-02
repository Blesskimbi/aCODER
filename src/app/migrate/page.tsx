import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Card, Badge } from "@/components/ui/primitives";
import { SpecTable, SourceNote, Callout, NumberedList } from "@/components/ui/blocks";
import { guide } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Migrate",
  description:
    "Import settings, keybindings and extensions from VS Code, Cursor or Windsurf. A-Coder is built on VS Code's core, so the editor you know is the editor you get.",
};

const STEPS = [
  {
    title: "Install, and let the first-run flow offer it",
    body: "Migration is part of onboarding. If you skipped it, the panel is still there at Settings → System → Migration — it is not a one-time window.",
  },
  {
    title: "Pick what comes across",
    body: "Settings, keybindings and extensions are the three things imported. Your keybindings land in keybindings.json exactly as they would in VS Code.",
  },
  {
    title: "Check your extensions",
    body: "A-Coder points its gallery at the Visual Studio Marketplace, so extensions resolve by the same identifiers you already have. Themes and profiles come with them.",
  },
  {
    title: "Add a model provider",
    body: "This is the one step with no equivalent in your old editor: A-Coder talks to providers directly, so it needs a key or a local endpoint before the AI features do anything.",
  },
];

const CARRIES = [
  ["Settings", "Imported", "Your settings.json, via the migration panel."],
  ["Keybindings", "Imported", "Written to keybindings.json as usual."],
  ["Extensions", "Imported", "Resolved from the Visual Studio Marketplace."],
  ["Themes", "Works", "Any VS Code theme extension."],
  ["Profiles", "Works", "VS Code's profile system is inherited."],
  ["Command palette", "Works", "A-Coder's own commands are prefixed “A-Coder:”."],
  ["Model provider", "Set up fresh", "Bring an API key, or point at a local runtime."],
];

const DIFFS = [
  {
    name: "The AI lives in the right-hand panel",
    body: "Chat is in the secondary side bar and opens on startup. The mode dropdown at the bottom of it is the control that matters most — it decides whether the model can read or write at all.",
  },
  {
    name: "Ctrl+K is Quick Edit",
    body: "An inline edit on the current selection, in the editor buffer. Not a command palette.",
  },
  {
    name: "Ctrl+L adds the selection to chat",
    body: "It attaches the selection, or the current file, as a context chip rather than opening a panel.",
  },
  {
    name: "Edits arrive as diffs you accept",
    body: "Changes land as inline diff zones with accept and reject, which auto-advance to the next one. Nothing is written silently unless you turn on auto-accept.",
  },
  {
    name: "Per-project rules",
    body: "A .a-coder-rules file in a workspace root loads as model instructions whenever that project opens.",
  },
];

export default function MigratePage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Migrate"
        title="Switching editors should be boring."
        lead="A-Coder is built on VS Code's open-source core, so the editor underneath is one you already know. Import brings your settings, keybindings and extensions across; only the model provider is genuinely new."
      >
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge>From VS Code</Badge>
          <Badge>From Cursor</Badge>
          <Badge>From Windsurf</Badge>
        </div>
      </PageHeader>

      <Container className="max-w-[900px]">
        <section>
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Four steps
          </h2>
          <div className="mt-7">
            <NumberedList items={STEPS.map((s) => ({ title: s.title, body: s.body }))} />
          </div>
        </section>

        {/* ── What carries over ──────────────────────────────────── */}
        <section className="mt-20">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            What carries over
          </h2>
          <div className="mt-7">
            <SpecTable
              head={["Thing", "Status", "Detail"]}
              rows={CARRIES.map(([thing, status, detail]) => [
                thing,
                <Badge
                  key="s"
                  tone={status === "Set up fresh" ? "warning" : "steel"}
                >
                  {status}
                </Badge>,
                detail,
              ])}
            />
          </div>
        </section>

        {/* ── What is different ──────────────────────────────────── */}
        <section className="mt-20">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            What will feel different
          </h2>
          <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-white/60">
            Five things, and then your muscle memory is intact.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {DIFFS.map((d) => (
              <Card key={d.name} className="p-6" interactive={false}>
                <h3 className="text-[14px] font-medium text-steel-50">
                  {d.name}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/60">
                  {d.body}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Honest caveats ─────────────────────────────────────── */}
        <section className="mt-20 space-y-4">
          <Callout tone="warning" title="How well each path is documented">
            <p>
              The README and the migration panel name all three editors, and
              Cursor and Windsurf are both VS Code forks, so their settings and
              keybindings files have the same shape. That said, the VS Code path
              is the one the repository&apos;s docs actually describe in detail —
              the other two are named but not elaborated. Expect VS Code to be the
              smoothest, and check your imported keybindings afterwards either way.
            </p>
          </Callout>

          <Callout title="On macOS, clear the quarantine flag first">
            <p>
              Builds are unsigned, so Gatekeeper will block the first launch. After
              dragging the app to Applications, run{" "}
              <code>
                sudo xattr -d com.apple.quarantine
                &quot;/Applications/A-Coder.app&quot;
              </code>
              .
            </p>
          </Callout>
        </section>

        <div className="mt-20 flex flex-wrap items-center gap-3 border-t border-white/[0.07] pt-8">
          <Badge>Next</Badge>
          <Link
            href="/download"
            className="text-[13.5px] text-ember-300 underline-offset-4 hover:underline"
          >
            Download A-Coder →
          </Link>
          <span className="text-white/25">·</span>
          <Link
            href="/help/keyboard-shortcuts"
            className="text-[13.5px] text-ember-300 underline-offset-4 hover:underline"
          >
            The shortcuts worth learning first →
          </Link>
        </div>

        <SourceNote href={guide("getting-started.md")}>
          Migration behaviour is drawn from the getting-started and keyboard
          shortcuts guides, and the three supported editors from the repository
          README.
        </SourceNote>
      </Container>
    </PageShell>
  );
}
