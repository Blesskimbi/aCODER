import { WindowChrome } from "./WindowChrome";
import { cx } from "@/components/ui/primitives";
import type { Mode } from "@/content/product";

/* The IDE's own teal is used inside these mockups — they are product
   surfaces, so they read as genuine screenshots of the app rather than
   as site chrome. See PLAN.md. */

const FILES = [
  { name: "src", type: "dir", depth: 0 },
  { name: "auth", type: "dir", depth: 1 },
  { name: "session.ts", type: "file", depth: 2, state: "edited" },
  { name: "tokens.ts", type: "file", depth: 2, state: "active" },
  { name: "routes.ts", type: "file", depth: 1 },
  { name: "tests", type: "dir", depth: 0 },
  { name: "auth.test.ts", type: "file", depth: 1, state: "edited" },
] as const;

type Line =
  | { kind: "ctx"; n: number; text: string }
  | { kind: "add"; n: number; text: string }
  | { kind: "del"; n: number; text: string };

const DIFF: Line[] = [
  { kind: "ctx", n: 41, text: "export async function refresh(token: string) {" },
  { kind: "del", n: 42, text: "  const row = db.query(`... ${token}`)" },
  { kind: "add", n: 42, text: "  const row = await db.query(SQL, [token])" },
  { kind: "add", n: 43, text: "  if (!row) throw new AuthError('expired')" },
  { kind: "ctx", n: 44, text: "  return sign(row.userId)" },
  { kind: "ctx", n: 45, text: "}" },
];

const TOOL_STEPS = [
  { label: "Searched codebase", detail: "14 files", done: true },
  { label: "Read src/auth/session.ts", detail: "182 lines", done: true },
  { label: "Edited src/auth/session.ts", detail: "+2 −1", done: true },
  { label: "Ran npm test", detail: "34 passed", done: true },
];

function FileTree() {
  return (
    <div className="hidden w-[168px] shrink-0 border-r border-white/[0.06] bg-white/[0.012] py-3 lg:block">
      <p className="px-3 pb-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/50">
        Explorer
      </p>
      <ul className="font-mono text-[11px]">
        {FILES.map((f) => (
          <li
            key={f.name + f.depth}
            className={cx(
              "flex items-center gap-1.5 rounded-xs py-[3px] pr-2",
              "state" in f && f.state === "active"
                ? "bg-ide-teal/10 text-ide-teal-lit"
                : "text-white/62",
            )}
            style={{ paddingLeft: 12 + f.depth * 11 }}
          >
            <span className="truncate">{f.name}</span>
            {"state" in f && f.state === "edited" && (
              <span className="ml-auto h-1 w-1 shrink-0 rounded-full bg-diff-add" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Editor() {
  return (
    <div className="min-w-0 flex-1 bg-panel">
      <div className="flex h-8 items-center gap-0 border-b border-white/[0.06] px-2">
        <span className="rounded-t-[3px] border-b border-ide-teal bg-white/[0.04] px-2.5 py-1.5 font-mono text-[11px] text-white/80">
          session.ts
        </span>
        <span className="px-2.5 py-1.5 font-mono text-[11px] text-white/55">
          tokens.ts
        </span>
      </div>

      <div className="px-2 py-3 font-mono text-[11.5px] leading-[1.75]">
        {DIFF.map((l, i) => (
          <div
            key={i}
            className={cx(
              "flex gap-3 rounded-xs px-2",
              l.kind === "add" && "bg-diff-add/[0.09]",
              l.kind === "del" && "bg-diff-remove/[0.09]",
            )}
          >
            <span className="w-5 shrink-0 select-none text-right text-white/56 tnum">
              {l.n}
            </span>
            <span
              className={cx(
                "w-2 shrink-0 select-none",
                l.kind === "add" && "text-diff-add",
                l.kind === "del" && "text-diff-remove",
                l.kind === "ctx" && "text-transparent",
              )}
            >
              {l.kind === "add" ? "+" : l.kind === "del" ? "−" : " "}
            </span>
            <span
              className={cx(
                "truncate",
                l.kind === "add" && "text-diff-add",
                l.kind === "del" && "text-diff-remove/90",
                l.kind === "ctx" && "text-white/50",
              )}
            >
              {l.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-white/[0.06] px-3 py-2">
        <span className="rounded-xs bg-diff-add/15 px-1.5 py-0.5 font-mono text-[10px] text-diff-add">
          Fast Apply
        </span>
        <span className="font-mono text-[10.5px] text-white/55">
          +2 −1 · accept with Tab
        </span>
      </div>
    </div>
  );
}

function ChatPanel({ mode }: { mode: Mode }) {
  return (
    <div className="w-full shrink-0 border-t border-white/[0.06] bg-white/[0.012] md:w-[268px] md:border-l md:border-t-0">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2">
        <span className="rounded-full bg-ide-teal/12 px-2 py-0.5 font-mono text-[10px] tracking-wide text-ide-teal-lit">
          {mode.name} mode
        </span>
        <span className="font-mono text-[10px] text-white/50">Thread 1</span>
      </div>

      <div className="space-y-2.5 px-3 py-3">
        <div className="rounded-[10px] rounded-tr-xs border-l-2 border-ide-teal bg-white/[0.035] px-2.5 py-2 text-[11.5px] leading-relaxed text-white/75">
          Refresh tokens are being interpolated into SQL. Fix it and add a
          test.
        </div>

        <ul className="space-y-1">
          {TOOL_STEPS.map((s) => (
            <li
              key={s.label}
              className="flex items-center gap-2 rounded-xs bg-white/[0.02] px-2 py-[5px]"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-diff-add" />
              <span className="truncate font-mono text-[10.5px] text-white/60">
                {s.label}
              </span>
              <span className="ml-auto shrink-0 font-mono text-[9.5px] text-white/50">
                {s.detail}
              </span>
            </li>
          ))}
        </ul>

        <div className="rounded-[10px] rounded-tl-xs border border-white/[0.07] bg-white/[0.02] px-2.5 py-2 text-[11.5px] leading-relaxed text-white/65">
          Swapped the template literal for a parameterised query and added an
          expiry check. All 34 tests pass.
        </div>
      </div>

      <div className="mx-3 mb-3 flex items-center gap-2 rounded-[10px] border border-white/[0.08] bg-white/[0.03] px-2.5 py-2">
        <span className="flex-1 truncate text-[11px] text-white/50">
          Ask A-Coder…
        </span>
        <span className="font-mono text-[9.5px] text-white/42">⌘L</span>
      </div>
    </div>
  );
}

export function IdeMockup({
  mode,
  className,
}: {
  mode: Mode;
  className?: string;
}) {
  return (
    <WindowChrome
      title={
        <span className="flex items-center gap-2">
          A-Coder — auth-service
          <span className="hidden font-mono text-[10px] text-white/50 sm:inline">
            ⌘K Quick Edit
          </span>
        </span>
      }
      className={className}
    >
      <div className="flex flex-col md:flex-row">
        <div className="flex min-w-0 flex-1">
          <FileTree />
          <Editor />
        </div>
        <ChatPanel mode={mode} />
      </div>
    </WindowChrome>
  );
}
