/**
 * Integrations for /integrations.
 *
 * Sourced from docs/user-guide/{mcp,acp,skills,morph,composio,mobile-api}.md.
 * Config paths, setting keys and endpoint shapes are quoted as written.
 */

export interface Integration {
  id: string;
  name: string;
  kind: "Protocol" | "Service" | "Platform" | "Built in";
  summary: string;
  /** Where it is configured in the app. */
  settings: string;
  /** Config file on disk, if it has one. */
  configFile?: string;
  points: string[];
  guide: string;
  /** Upstream project link, where there is one. */
  href?: string;
}

export const INTEGRATIONS: Integration[] = [
  {
    id: "mcp",
    name: "MCP",
    kind: "Protocol",
    summary:
      "Model Context Protocol. The agent calls tools exposed by any MCP-compatible server — data sources, internal APIs, browser automation.",
    settings: "Settings → MCP Tools",
    configFile: "~/.a-coder/mcp.json",
    points: [
      "Both transports: stdio servers run as local child processes; SSE and URL servers connect remotely with custom headers.",
      "New servers default to off. First launch will not spawn npx processes or dial a remote host without you turning it on.",
      "The config file is watched — editing it refreshes the server list automatically.",
      "A Chrome DevTools MCP sample ships in the default config: navigate, click, screenshot, inspect network, run Lighthouse audits.",
      "Tools land in the MCP tools approval category, so they prompt unless you auto-approve that category.",
    ],
    guide: "mcp.md",
    href: "https://modelcontextprotocol.io",
  },
  {
    id: "acp",
    name: "ACP",
    kind: "Protocol",
    summary:
      "Agent Communication Protocol. Where MCP exposes tools, ACP exposes whole agents — other agentic systems running their own model-and-tool loops.",
    settings: "Settings → ACP Agents",
    configFile: "~/.a-coder/acp.json",
    points: [
      "Each agent on a server is registered as a tool named acp_{server}_{agent}.",
      "Runs stream back as events: created, in progress, awaiting, completed, failed, plus message, thought and tool_call.",
      "Server state shows as loading, success, offline or error in Settings.",
      "Use MCP for data sources and browser automation; use ACP to delegate to another agent framework.",
    ],
    guide: "acp.md",
    href: "https://github.com/i-am-bee/acp",
  },
  {
    id: "skills",
    name: "Skills",
    kind: "Built in",
    summary:
      "Markdown-defined packages of instructions, scripts, references and assets that the agent loads on demand. Installable expertise.",
    settings: "Settings → AI Skills",
    configFile: "~/.a-coder/skills/{skill}/SKILL.md",
    points: [
      "A skill is a SKILL.md with YAML frontmatter, plus optional scripts/, references/ and assets/ folders.",
      "The description field is what the model sees when deciding whether to load the skill, so it should say when to use it.",
      "References load lazily and assets support {{variable}} interpolation, so a big skill does not cost context up front.",
      "Scripts run as Python, Bash or Node, with a 60-second default timeout and a 300-second maximum.",
      "Benchmarks score a skill 0–100, and metrics track usage count, success rate and average duration.",
      "Installing and uninstalling need the skills approval category; loading and reading are auto-approved.",
    ],
    guide: "skills.md",
  },
  {
    id: "morph",
    name: "Morph",
    kind: "Service",
    summary:
      "Three capabilities behind one API key: semantic search over your repo, higher-accuracy code application, and a git workspace with an indexed codebase.",
    settings: "Settings → Features → Morph Settings",
    points: [
      "Fast Context runs a semantic search and returns relevant snippets — better than keyword search for a question about behaviour.",
      "Fast Apply applies an edit through Morph instead of overwriting a file wholesale.",
      "Repo Storage adds git tools plus semantic search over an indexed repo, scoped by branch, commit or directory.",
      "All three are off by default and need a Morph API key. Fast Context can also be enabled per model.",
      "Embeddings can regenerate on push, optionally blocking the push until indexing finishes.",
    ],
    guide: "morph.md",
    href: "https://morph.so",
  },
  {
    id: "composio",
    name: "Composio",
    kind: "Platform",
    summary:
      "A marketplace of over a thousand external apps — GitHub, Jira, Slack, Gmail, Notion — exposed to the agent as tools, plus inbound event triggers.",
    settings: "Settings → App Integrations",
    points: [
      "Browse apps by category; each shows its auth schemes, tool count and trigger count.",
      "OAuth2 apps redirect you to authenticate; API-key apps take a key. Connection status is pending, active, failed or expired.",
      "Only apps you explicitly enable expose their tools to the model.",
      "Triggers let apps push events in — a PR opened, a ticket changed — over a webhook listener with HMAC signature verification.",
      "The listener is local, so reaching it from outside needs a Cloudflare Tunnel, the same pattern as the Mobile API.",
    ],
    guide: "composio.md",
    href: "https://composio.dev",
  },
  {
    id: "mobile",
    name: "Mobile API",
    kind: "Built in",
    summary:
      "A REST and WebSocket server inside the editor, exposing threads, workspace, planning, settings and MCP to remote clients.",
    settings: "Settings → API & Mobile",
    points: [
      "Off by default, and bound to 127.0.0.1 when on.",
      "Every endpoint except /health needs a bearer token.",
      "WebSocket channels stream live state: chat, workspace and planning.",
      "Tool approvals can be granted or refused remotely, so an agent run is not stuck waiting at your desk.",
      "A Cloudflare Tunnel exposes it beyond localhost — which makes the token the only thing standing in front of your editor.",
    ],
    guide: "mobile-api.md",
  },
];

export const getIntegration = (id: string) =>
  INTEGRATIONS.find((i) => i.id === id);
