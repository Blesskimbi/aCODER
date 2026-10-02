/** Single place for site-wide switches and constants. */

export const SITE = {
  name: "A-Coder IDE",
  tagline: "Your True Open Source AI IDE",
  strapline: "Where Agentic AI Meets Professional Development",
  description:
    "An open-source, AI-native code editor built on VS Code. Chat, Plan, Agent and Learn modes, direct-to-provider model access, and first-class local models.",
  url: "https://a-coder.dev",
  repo: "hamishfromatech/A-Coder",
  repoUrl: "https://github.com/hamishfromatech/A-Coder",
  releasesUrl: "https://github.com/hamishfromatech/A-Coder/releases",
  issuesUrl: "https://github.com/hamishfromatech/A-Coder/issues",
  docsUrl: "https://github.com/hamishfromatech/A-Coder/tree/main/docs",
  licence: "Apache-2.0",
  licenceUrl: "https://github.com/hamishfromatech/A-Coder/blob/main/LICENSE.txt",
} as const;

/**
 * Testimonials section visibility.
 *
 * Currently ON so the layout can be reviewed. The content is still
 * placeholder — see content/testimonials.ts — and the section renders a
 * "Sample content" badge while any placeholder remains.
 *
 * Set to `process.env.NODE_ENV !== "production"` to hide it on the live
 * site, or leave it true once real quotes are in.
 */
export const SHOW_TESTIMONIALS = true;

export const INSTALL = {
  unix: "curl -fsSL https://raw.githubusercontent.com/hamishfromatech/A-Coder/main/install.sh | bash",
  windows:
    "irm https://raw.githubusercontent.com/hamishfromatech/A-Coder/main/install.ps1 | iex",
} as const;

/** Fallbacks if the GitHub API is unreachable at build time. */
export const GITHUB_FALLBACK = {
  stars: 37,
  forks: 3,
  latestVersion: "1.9.15",
  latestTag: "1.99.30100",
} as const;

/* ── External destinations ─────────────────────────────────────────
   Only links that actually resolve. Deliberately absent:

   - Discord. The repo README renders it as `[Discord](#)` — a
     placeholder, not a server.
   - An issue tracker. `has_issues` is false on the repository, so
     "open an issue" is not a route to support right now.
   - The README's own GitHub link, which points at the template
     default `https://github.com/your-repo`.

   The forum is the Skool community named in the repo's `homepage`
   field — the only community destination the project publishes. */
export const EXTERNAL = {
  /** Repo `homepage` field. Skool answers 403 to non-browser clients. */
  forum:
    "https://www.skool.com/open-source-ai-builders-club/about?ref=da946a67c5c646e991b96ea9ce7ad9e4",
  /** Named as "Website" in the README. */
  company: "https://theatechcorporation.com",
  support: "https://buymeacoffee.com/hamishfromatech",
  wiki: "https://github.com/hamishfromatech/A-Coder/wiki",
  vscode: "https://github.com/microsoft/vscode",
  void: "https://github.com/voideditor/void",
  morph: "https://morph.so",
  composio: "https://composio.dev",
  acpSpec: "https://github.com/i-am-bee/acp",
  mcpSpec: "https://modelcontextprotocol.io",
} as const;

/** A guide inside the repo's docs/user-guide folder. */
export const guide = (file: string) => `${SITE.docsUrl}/user-guide/${file}`;
/** A doc at the top level of the repo's docs folder. */
export const repoDoc = (file: string) => `${SITE.docsUrl}/${file}`;

/* ── Navigation ────────────────────────────────────────────────────
   The nav shows two grouped menus plus two direct links; the footer
   carries the complete sitemap. */

export interface NavItem {
  label: string;
  href: string;
  blurb?: string;
  external?: boolean;
}

/**
 * Social and community accounts.
 *
 * `url: null` means the account does not exist yet, and the UI renders
 * nothing for it — a social row must never link somewhere that 404s or,
 * worse, lands on an unrelated account that happens to hold the handle.
 * Fill a URL in and it appears in the nav menu and the footer at once.
 *
 * Verified before writing this: the repo has no X, Reddit or YouTube
 * presence anywhere. The one Discord invite in the repository
 * (docs/HOW_TO_CONTRIBUTE.md) resolves to the **Void** server — the
 * upstream project A-Coder forks — not to an A-Coder server, so it is
 * listed separately as an upstream link rather than as "our Discord".
 */
export type SocialId = "skool" | "github" | "discord" | "reddit" | "x" | "youtube";

export interface Social {
  id: SocialId;
  label: string;
  url: string | null;
  /** Shown in the nav menu under the label. */
  blurb?: string;
}

export const SOCIAL: Social[] = [
  {
    id: "skool",
    label: "Skool community",
    url: EXTERNAL.forum,
    blurb: "The project's own forum",
  },
  {
    id: "github",
    label: "GitHub",
    url: SITE.repoUrl,
    blurb: "Read the source, open a PR",
  },
  { id: "discord", label: "Discord", url: null, blurb: "Not opened yet" },
  { id: "reddit", label: "Reddit", url: null, blurb: "Not created yet" },
  { id: "x", label: "X", url: null, blurb: "No account yet" },
  { id: "youtube", label: "YouTube", url: null, blurb: "No channel yet" },
];

/** Only the accounts that actually exist. */
export const liveSocial = () => SOCIAL.filter((s) => s.url !== null);

/**
 * Void's Discord. Real and active, but it is the upstream project's
 * server, so it is always labelled as such and never as A-Coder's.
 */
export const UPSTREAM_DISCORD =
  "https://discord.gg/RSNjgaugJs";

/**
 * Sign-up destination.
 *
 * A-Coder has no accounts — it is a desktop app with no A-Coder server
 * to hold one. The only real sign-up the project operates is joining the
 * community, so that is where this points.
 */
export const SIGNUP_URL = EXTERNAL.forum;

export const NAV_GROUPS: Array<{ title: string; items: NavItem[] }> = [
  {
    title: "Product",
    items: [
      { label: "Features", href: "/features", blurb: "Every capability, grouped" },
      { label: "Modes", href: "/modes", blurb: "Chat, Plan, Agent, Learn" },
      { label: "Models", href: "/models", blurb: "20 providers, your key" },
      { label: "Integrations", href: "/integrations", blurb: "MCP, ACP, Skills, Morph" },
      { label: "Students", href: "/students", blurb: "Learn Mode and the coach" },
      { label: "CLI", href: "/cli", blurb: "The a-coder command" },
      { label: "Mobile & remote", href: "/mobile", blurb: "REST and WebSocket control" },
      { label: "Migrate", href: "/migrate", blurb: "From VS Code, Cursor, Windsurf" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Help centre", href: "/help", blurb: "Task-shaped answers" },
      { label: "Compare", href: "/compare", blurb: "Against the alternatives" },
      { label: "Workshops", href: "/workshops", blurb: "Guided sessions" },
      { label: "Pricing", href: "/pricing", blurb: "Free, and why" },
      { label: "Open source", href: "/open-source", blurb: "Licence, stack, contributing" },
      { label: "Security", href: "/security", blurb: "Where your code goes" },
    ],
  },
];

/** Direct nav links, shown after the grouped menus. */
export const NAV_LINKS = [
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
  { label: "Changelog", href: "/changelog" },
] as const;
