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

export const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Modes", href: "/#modes" },
  { label: "Models", href: "/#models" },
  { label: "Docs", href: "/docs" },
  { label: "Changelog", href: "/changelog" },
] as const;

/** Fallbacks if the GitHub API is unreachable at build time. */
export const GITHUB_FALLBACK = {
  stars: 37,
  forks: 3,
  latestVersion: "1.9.15",
  latestTag: "1.99.30100",
} as const;
