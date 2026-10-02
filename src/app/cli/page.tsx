import type { Metadata } from "next";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Card, Badge } from "@/components/ui/primitives";
import { SpecTable, SourceNote, Callout } from "@/components/ui/blocks";
import { CopyCommand } from "@/components/site/CopyCommand";
import { INSTALL, SITE, repoDoc } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Command line",
  description:
    "The a-coder command: open files and folders from a shell, manage extensions, diff, and install from a script with checksum verification.",
};

const INSTALL_FLAGS = [
  ["--version <tag>", "Install a specific release tag instead of the latest."],
  ["--user", "Install without sudo, into ~/Applications or ~/.local/share."],
  ["--tarball", "Force the tarball method on Linux rather than a native package."],
  ["--dry-run", "Print what would be installed and change nothing."],
  ["--help", "Every option the script accepts."],
];

const PS_FLAGS = [
  ["-Version <tag>", "Pin a release tag."],
  ["-UserSetup", "Per-user install, no administrator rights."],
  ["-Portable", "Portable install."],
  ["-Msi", "Use the MSI package."],
];

const EDITOR_CMDS = [
  ["a-coder .", "Open the current directory as a workspace."],
  ["a-coder file.ts", "Open a file."],
  ["a-coder --goto file.ts:42", "Open a file at a line."],
  ["a-coder --diff a.ts b.ts", "Open a two-way diff."],
  ["a-coder --wait file.ts", "Block until the file is closed — for use as $EDITOR."],
  ["a-coder --new-window", "Force a new window."],
  ["a-coder --add dir", "Add a folder to the most recent window."],
];

export default function CliPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Command line"
        title="The a-coder command."
        lead="Installing A-Coder puts a launcher on your PATH. It is the VS Code command line with A-Coder's name, so anything you already type as code works here unchanged."
      >
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge tone="ember">Symlinked to /usr/local/bin/a-coder</Badge>
          <Badge>Installed by the setup script</Badge>
        </div>
      </PageHeader>

      <Container className="max-w-[900px]">
        {/* Set expectations immediately — this is the editor launcher,
            not a terminal coding agent. */}
        <Callout title="What this is, and what it is not">
          <p>
            This page documents the <strong>editor launcher</strong>: the{" "}
            <code>a-coder</code> binary that opens files, folders and diffs from
            a shell. It is not a terminal coding agent — A-Coder&apos;s agent runs
            inside the editor, and the four modes live in the sidebar. If you
            want to drive that agent from somewhere else, the{" "}
            <a href="/mobile">Mobile API</a> is the supported route.
          </p>
        </Callout>

        {/* ── Install ────────────────────────────────────────────── */}
        <section id="install" className="mt-16 scroll-mt-28">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Install from a shell
          </h2>
          <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-white/60">
            Both scripts verify the SHA-256 sidecar published with every release
            before installing anything, and both create the{" "}
            <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-steel-100">
              a-coder
            </code>{" "}
            symlink on your PATH.
          </p>

          <div className="mt-7 space-y-5">
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
                macOS · Linux
              </p>
              <CopyCommand command={INSTALL.unix} />
            </div>
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
                Windows · PowerShell
              </p>
              <CopyCommand command={INSTALL.windows} />
            </div>
          </div>

          <div className="mt-9 grid gap-7 md:grid-cols-2">
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                install.sh options
              </h3>
              <div className="mt-4">
                <SpecTable
                  head={["Flag", "Effect"]}
                  rows={INSTALL_FLAGS.map(([f, d]) => [
                    <code key={f} className="font-mono text-[12px]">
                      {f}
                    </code>,
                    d,
                  ])}
                />
              </div>
            </div>
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                install.ps1 options
              </h3>
              <div className="mt-4">
                <SpecTable
                  head={["Flag", "Effect"]}
                  rows={PS_FLAGS.map(([f, d]) => [
                    <code key={f} className="font-mono text-[12px]">
                      {f}
                    </code>,
                    d,
                  ])}
                />
              </div>
            </div>
          </div>

          <p className="mt-6 text-[12.5px] leading-relaxed text-white/52">
            Piping a script from the internet into a shell runs it unread. Both
            scripts are in the repository root — download and read them first if
            that matters to you, which on a machine you care about it should.
          </p>
        </section>

        {/* ── Using the launcher ─────────────────────────────────── */}
        <section id="usage" className="mt-20 scroll-mt-28">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Opening things
          </h2>
          <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-white/60">
            A-Coder inherits VS Code&apos;s command line, so the familiar flags
            behave as they always have. Run{" "}
            <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-steel-100">
              a-coder --help
            </code>{" "}
            for the full list from your installed build, which is the
            authoritative one.
          </p>
          <div className="mt-7">
            <SpecTable
              head={["Command", "What it does"]}
              rows={EDITOR_CMDS.map(([c, d]) => [
                <code key={c} className="font-mono text-[12px]">
                  {c}
                </code>,
                d,
              ])}
            />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Card className="p-6" interactive={false}>
              <h3 className="text-[14px] font-medium text-steel-50">
                As your git editor
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/60">
                <code className="font-mono text-[12px] text-steel-100">
                  git config --global core.editor &quot;a-coder --wait&quot;
                </code>{" "}
                — the flag makes the command block until you close the file,
                which is what git needs.
              </p>
            </Card>
            <Card className="p-6" interactive={false}>
              <h3 className="text-[14px] font-medium text-steel-50">
                Extensions from the shell
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/60">
                The{" "}
                <code className="font-mono text-[12px] text-steel-100">
                  --install-extension
                </code>{" "}
                and{" "}
                <code className="font-mono text-[12px] text-steel-100">
                  --list-extensions
                </code>{" "}
                flags work against the Visual Studio Marketplace, so scripted
                setup carries over from VS Code.
              </p>
            </Card>
          </div>
        </section>

        {/* ── Honest gap ─────────────────────────────────────────── */}
        <section className="mt-20">
          <Callout tone="warning" title="Two leftovers from the fork">
            <p>
              A-Coder is forked from Void, and two identifiers in{" "}
              <code>product.json</code> still carry the old name:{" "}
              <code>serverApplicationName</code> is <code>void-server</code> and{" "}
              <code>tunnelApplicationName</code> is <code>void-tunnel</code>. If
              you use the remote server or tunnel subcommands, expect those
              names. The desktop launcher itself is correctly{" "}
              <code>a-coder</code>.
            </p>
          </Callout>
        </section>

        <SourceNote href={`${SITE.repoUrl}/blob/main/install.sh`}>
          Flags are read from the install scripts in the repository root, and the
          binary name from <code>applicationName</code> in{" "}
          <code>product.json</code>. Build-from-source instructions are in the{" "}
          <a
            href={repoDoc("DEVELOPMENT_GUIDE.md")}
            target="_blank"
            rel="noreferrer noopener"
          >
            Development Guide
          </a>
          .
        </SourceNote>
      </Container>
    </PageShell>
  );
}
