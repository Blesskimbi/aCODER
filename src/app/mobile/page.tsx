import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Card, Badge } from "@/components/ui/primitives";
import { SpecTable, SourceNote, Callout } from "@/components/ui/blocks";
import { guide } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Mobile & remote",
  description:
    "A REST and WebSocket server inside the editor. Drive threads, read the workspace, approve tool calls and stream responses from another device — off by default, token-authenticated.",
};

const SETTINGS = [
  ["apiEnabled", "false", "Whether the server runs at all."],
  ["apiPort", "3737", "Port it listens on."],
  ["apiTokens", "[]", "Valid tokens, generated and managed in Settings."],
  ["apiTunnelUrl", "—", "Cloudflare Tunnel hostname, for access beyond localhost."],
];

const ENDPOINTS: Array<{ group: string; rows: string[][] }> = [
  {
    group: "Chat & threads",
    rows: [
      ["GET /threads", "List threads"],
      ["GET /threads/:id", "Read one thread"],
      ["POST /threads", "Create a thread"],
      ["POST /threads/:id/messages", "Send a message; the response streams over WebSocket"],
      ["GET /threads/:id/status", "Whether it is running, and on what"],
      ["POST /threads/:id/cancel", "Abort the running response"],
      ["POST /threads/:id/approve", "Approve a pending tool call"],
      ["POST /threads/:id/reject", "Refuse a pending tool call"],
      ["DELETE /threads/:id", "Delete a thread"],
    ],
  },
  {
    group: "Workspace & files",
    rows: [
      ["GET /workspace", "Workspace info"],
      ["GET /workspace/files", "List files"],
      ["GET /workspace/files/tree", "Directory tree"],
      ["GET /workspace/files/:path", "Read a file, with line-range and page options"],
      ["GET /workspace/files/:path/outline", "Symbols and signatures"],
      ["GET /workspace/files/:path/raw", "Binary streaming, with Range support"],
      ["POST /workspace/search", "Content search"],
      ["GET /workspace/diagnostics", "Lint and diagnostic errors"],
      ["GET /workspace/folder/:path", "Folder contents with name, type, size"],
    ],
  },
  {
    group: "Planning",
    rows: [
      ["GET /planning/current", "The current plan"],
      ["POST /planning/create", "Create a plan"],
      ["PATCH /planning/tasks/:id", "Update a task"],
    ],
  },
  {
    group: "Settings & MCP",
    rows: [
      ["GET /settings", "Current settings"],
      ["GET /settings/models", "Available models"],
      ["GET · PUT /settings/model", "Read or set the active model"],
      ["GET · PUT /settings/mode", "Read or set the mode: normal, gather or agent"],
      ["GET /mcp/servers", "Configured MCP servers"],
      ["GET /mcp/tools", "Tools those servers expose"],
      ["PUT /mcp/servers/:name/toggle", "Enable or disable a server"],
    ],
  },
];

export default function MobilePage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Mobile & remote"
        title="Your editor, over HTTP."
        lead="A REST and WebSocket server built into the editor. It exposes threads, the workspace, planning, settings and MCP — enough to watch an agent run from your phone and approve what it asks for."
      >
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge tone="ember">Off by default</Badge>
          <Badge>Bound to 127.0.0.1</Badge>
          <Badge>Bearer token on every route but /health</Badge>
        </div>
      </PageHeader>

      <Container className="max-w-[960px]">
        {/* ── Settings ───────────────────────────────────────────── */}
        <section id="setup" className="scroll-mt-28">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Turning it on
          </h2>
          <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-white/60">
            Settings → API &amp; Mobile. Four settings, and the defaults are the
            safe ones.
          </p>
          <div className="mt-7">
            <SpecTable
              head={["Setting", "Default", "Purpose"]}
              rows={SETTINGS.map(([k, d, p]) => [
                <code key={k} className="font-mono text-[12px]">
                  {k}
                </code>,
                <code key="d" className="font-mono text-[12px] text-white/50">
                  {d}
                </code>,
                p,
              ])}
            />
          </div>
        </section>

        {/* ── Auth ───────────────────────────────────────────────── */}
        <section id="auth" className="mt-20 scroll-mt-28">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Authentication
          </h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <Card className="p-6" interactive={false}>
              <h3 className="text-[14px] font-medium text-steel-50">
                Token format
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/60">
                Tokens look like{" "}
                <code className="font-mono text-[12px] text-steel-100">
                  acoder_&lt;random&gt;
                </code>
                . Generate them in Settings.
              </p>
            </Card>
            <Card className="p-6" interactive={false}>
              <h3 className="text-[14px] font-medium text-steel-50">
                How to send it
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/60">
                <code className="font-mono text-[12px] text-steel-100">
                  Authorization: Bearer &lt;token&gt;
                </code>{" "}
                for HTTP, or{" "}
                <code className="font-mono text-[12px] text-steel-100">
                  ?token=&lt;token&gt;
                </code>{" "}
                for the WebSocket.
              </p>
            </Card>
          </div>

          <div className="mt-8">
            <Callout tone="warning" title="A token is a key to your editor">
              <p>
                Anyone holding one can read your files, send messages and approve
                tool calls — which means approving an agent&apos;s terminal
                commands. Treat it like a password. A Cloudflare Tunnel makes all
                of that reachable from the public internet, so if you open one:
                use a strong token, rotate it, and restrict the hostname in your
                Cloudflare dashboard.
              </p>
            </Callout>
          </div>
        </section>

        {/* ── Endpoints ──────────────────────────────────────────── */}
        <section id="endpoints" className="mt-20 scroll-mt-28">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Endpoints
          </h2>
          <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-white/60">
            Every path is prefixed{" "}
            <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-steel-100">
              /api/v1
            </code>
            .{" "}
            <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-steel-100">
              GET /api/v1/health
            </code>{" "}
            is the only route that does not need a token.
          </p>

          <div className="mt-8 space-y-10">
            {ENDPOINTS.map((g) => (
              <div key={g.group}>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                  {g.group}
                </h3>
                <div className="mt-4">
                  <SpecTable
                    head={["Route", "What it does"]}
                    rows={g.rows.map(([r, d]) => [
                      <code key={r} className="font-mono text-[12px]">
                        {r}
                      </code>,
                      d,
                    ])}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── WebSocket ──────────────────────────────────────────── */}
        <section id="websocket" className="mt-20 scroll-mt-28">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Live state over WebSocket
          </h2>
          <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-white/60">
            Connect and subscribe to <code>chat</code>, <code>workspace</code> or{" "}
            <code>planning</code>. This is how a client shows a response arriving
            token by token rather than polling for a finished answer.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <Card className="p-6" interactive={false}>
              <code className="font-mono text-[12px] text-ember-300">
                stream_state_changed
              </code>
              <p className="mt-2.5 text-[13px] leading-relaxed text-white/60">
                Carries what the agent is doing — calling the model, running a
                tool, awaiting you, or idle — alongside content, reasoning, the
                current tool call and token usage.
              </p>
            </Card>
            <Card className="p-6" interactive={false}>
              <code className="font-mono text-[12px] text-ember-300">
                message_added
              </code>
              <p className="mt-2.5 text-[13px] leading-relaxed text-white/60">
                A new message landed in the thread.
              </p>
            </Card>
          </div>
        </section>

        <div className="mt-20 flex flex-wrap items-center gap-3 border-t border-white/[0.07] pt-8">
          <Badge>Next</Badge>
          <Link
            href="/help/enable-remote-control"
            className="text-[13.5px] text-ember-300 underline-offset-4 hover:underline"
          >
            Step-by-step setup →
          </Link>
          <span className="text-white/25">·</span>
          <Link
            href="/security"
            className="text-[13.5px] text-ember-300 underline-offset-4 hover:underline"
          >
            How A-Coder handles your code →
          </Link>
        </div>

        <SourceNote href={guide("mobile-api.md")}>
          Routes, settings, token format and event names are quoted from the
          repository&apos;s Mobile API guide.
        </SourceNote>
      </Container>
    </PageShell>
  );
}
