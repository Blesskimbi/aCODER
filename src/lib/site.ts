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
      { label: "Documentation", href: "/docs", blurb: "The full user guide" },
      { label: "Help centre", href: "/help", blurb: "Task-shaped answers" },
      { label: "Changelog", href: "/changelog", blurb: "Every release" },
      { label: "Compare", href: "/compare", blurb: "Against the alternatives" },
      { label: "Blog", href: "/blog", blurb: "Notes from the project" },
      { label: "Workshops", href: "/workshops", blurb: "Guided sessions" },
      { label: "Forum", href: EXTERNAL.forum, blurb: "Community discussion", external: true },
    ],
  },
];

/** Direct nav links, shown after the grouped menus. */
export const NAV_LINKS = [
  { label: "Pricing", href: "/pricing" },
  { label: "Open source", href: "/open-source" },
] as const;
