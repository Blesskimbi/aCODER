/**
 * Per-mode detail for /modes and /modes/[mode].
 *
 * Sourced from docs/user-guide/chat-modes.md, learn-mode.md and
 * tools.md. See PRODUCT_NOTES.md — nothing here is invented.
 *
 * Naming note: the repo is inconsistent about the third mode. README.md
 * and the Agent Manager call it **Agent**; docs/user-guide/chat-modes.md
 * and the Mobile API's `agent` setting value label it **Code** in the
 * mode dropdown. The site uses Agent and names the in-app label on the
 * page, rather than silently picking one.
 */

export type ModeId = "chat" | "plan" | "agent" | "learn";

export interface ModeDetail {
  id: ModeId;
  name: string;
  /** Label shown in the in-app dropdown, where it differs. */
  appLabel?: string;
  glyph: string;
  tagline: string;
  blurb: string;
  useWhen: string;
  /** What the model may do in this mode. */
  can: string[];
  /** What it cannot do — the real boundary of the mode. */
  cannot: string[];
  notes?: Array<{ term: string; def: string }>;
}

export const MODE_DETAILS: ModeDetail[] = [
  {
    id: "chat",
    name: "Chat",
    glyph: "💬",
    tagline: "Conversation only, no tools",
    blurb:
      "The model answers from its own knowledge and whatever context you paste in. It cannot read your files, run tools or edit code — which is exactly the point when you want to think out loud without anything touching the project.",
    useWhen: "Quick questions, no file access.",
    can: [
      "Answer from its own knowledge",
      "Work from context you attach by hand",
      "Explain concepts and weigh approaches",
    ],
    cannot: ["Read your files", "Call any tool", "Edit code or run commands"],
  },
  {
    id: "plan",
    name: "Plan",
    glyph: "🔍",
    tagline: "Research, plan & document",
    blurb:
      "The model reads your codebase — read-only tools run in parallel — and produces something reviewable: a todo list, a structured implementation plan with steps, complexity and dependencies, or a walkthrough. It cannot change anything while it does.",
    useWhen: "Research and scope before editing.",
    can: [
      "Read files, outline symbols, search contents",
      "Run read-only tools in parallel",
      "Produce todos, implementation plans and walkthroughs",
      "Open a plan in a preview tab for approval",
    ],
    cannot: ["Edit files", "Run terminal commands"],
    notes: [
      {
        term: "Why start here",
        def: "The docs recommend Plan for anything non-trivial: review the plan, then switch to Agent to execute it. That separates thinking from acting and keeps the decision with you.",
      },
    ],
  },
  {
    id: "agent",
    name: "Agent",
    appLabel: "Code",
    glyph: "🤖",
    tagline: "Edit files & run commands",
    blurb:
      "Full agent autonomy. The model reads, edits, creates and deletes files, runs terminal commands and orchestrates multi-step work. Sensitive actions need your approval unless you have turned that off per category. This is the default mode.",
    useWhen: "Actually change code, run commands.",
    can: [
      "Everything Plan can do",
      "Create, edit, rewrite and delete files",
      "Run terminal commands and execute code",
      "Delegate to subagents and drive an approved plan step by step",
    ],
    cannot: [
      "Run a gated action without your approval, unless you enabled auto-approve for that category",
      "Exceed the Max Iterations cap",
      "Spawn subagents that spawn further subagents",
    ],
    notes: [
      {
        term: "Max Iterations",
        def: "`maxAgentIterations`, default 50. An agent run is bounded — it cannot loop forever.",
      },
      {
        term: "Approval categories",
        def: "edits, terminal, code execution, skills, image generation, repo, forms, quizzes and MCP tools each gate separately. Everything else auto-approves.",
      },
    ],
  },
  {
    id: "learn",
    name: "Learn",
    glyph: "🎓",
    tagline: "Your personal tutor",
    blurb:
      "Interactive tutoring at a difficulty level you pick. The model explains code, teaches concepts, generates exercises, checks your answers without giving them away, escalates hints and quizzes you. Every teaching tool is auto-approved — learning never waits on a permission prompt.",
    useWhen: "Get tutored, practise, quiz yourself.",
    can: [
      "Explain code line by line at your level",
      "Teach a concept from scratch — analogy, example, exercise",
      "Generate and mark exercises",
      "Give progressive hints and build lesson plans",
    ],
    cannot: [
      "Give away an answer when it marks your work as wrong",
      "Skip hint levels — each request advances exactly one",
    ],
    notes: [
      {
        term: "Levels",
        def: "🌱 Beginner, 🌿 Intermediate, 🌳 Advanced. Remembered across sessions via `studentLevel`.",
      },
    ],
  },
];

export const getMode = (id: string) =>
  MODE_DETAILS.find((m) => m.id === id);

/** Behaviours that apply in every mode. From chat-modes.md. */
export const MODE_COMMON: string[] = [
  "Double-tap Enter to force-send while the model is streaming.",
  "Auto-continue carries long responses on, with the message queue retrying on backoff.",
  "Attach images by drag, drop or paste when Vision is on.",
  "@-mention files and folders, or add the current selection as a context chip.",
  "Run several threads at once and switch between them.",
  "Dictate input or hear answers back when Voice is on.",
  "Thinking-capable models show their reasoning in a dedicated card.",
  "An optional sound plays when a response completes.",
];
