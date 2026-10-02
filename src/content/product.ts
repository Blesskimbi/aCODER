/**
 * All product copy. Sourced from the A-Coder repo — see PRODUCT_NOTES.md.
 * Nothing here is invented; if it is not in the repo, it is not here.
 */

export interface Mode {
  id: "chat" | "plan" | "agent" | "learn";
  name: string;
  blurb: string;
  useWhen: string;
}

export const MODES: Mode[] = [
  {
    id: "chat",
    name: "Chat",
    blurb: "General coding questions and quick fixes.",
    useWhen: "Quick questions, no file access.",
  },
  {
    id: "plan",
    name: "Plan",
    blurb: "Understanding codebases and architectural decisions.",
    useWhen: "Research and scope before editing.",
  },
  {
    id: "agent",
    name: "Agent",
    blurb: "Multi-step features and complex refactoring.",
    useWhen: "Actually change code, run commands.",
  },
  {
    id: "learn",
    name: "Learn",
    blurb: "Skill building, concept explanations and exercises.",
    useWhen: "Get tutored, practise, quiz yourself.",
  },
];

export const CLOUD_PROVIDERS = [
  "Anthropic",
  "OpenAI",
  "Google Gemini",
  "xAI Grok",
  "Mistral",
  "Groq",
  "DeepSeek",
  "OpenRouter",
  "Vertex AI",
  "Azure",
  "AWS Bedrock",
  "A-Coder (hosted)",
  "OpenAdapter",
] as const;

/**
 * Runtimes where the endpoint is on your own hardware, so nothing
 * leaves the machine. Ollama Cloud is deliberately not in this list:
 * the docs group it with the local providers because it is configured
 * the same way, but it is a hosted endpoint.
 */
export const LOCAL_PROVIDERS = [
  "Ollama",
  "vLLM",
  "LM Studio",
  "LiteLLM",
  "llama.cpp",
  "OpenAI-compatible",
] as const;

export interface Shortcut {
  keys: string[];
  action: string;
}

export const SHORTCUTS: Shortcut[] = [
  { keys: ["Ctrl", "K"], action: "Quick Edit" },
  { keys: ["Ctrl", "L"], action: "Add selection to chat" },
  { keys: ["Ctrl", "Shift", "L"], action: "New chat" },
  { keys: ["Ctrl", "Shift", "A"], action: "Open Agent Manager" },
  { keys: ["Tab"], action: "Accept autocomplete" },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "What licence is A-Coder released under?",
    a: "Apache-2.0. The full text is in LICENSE.txt in the repository. A-Coder is a fork of Void Editor, which is itself built on VS Code (Code-OSS), and the VS Code licence is included separately as LICENSE-VS-Code.txt.",
  },
  {
    q: "Where do my prompts and code actually go?",
    a: "Straight from your machine to whichever provider you have configured. A-Coder dispatches requests directly rather than through any intermediary server of its own, so there is no A-Coder relay in the path. With a local provider such as Ollama, vLLM, LM Studio, LiteLLM or llama.cpp, requests never leave your machine at all.",
  },
  {
    q: "Which models can I use?",
    a: "Eleven third-party cloud providers — Anthropic, OpenAI, Google Gemini, xAI Grok, Mistral, Groq, DeepSeek, OpenRouter, Vertex AI, Azure and AWS Bedrock — plus local and self-hosted options via Ollama, vLLM, LM Studio, LiteLLM, llama.cpp and any OpenAI-compatible server. There are also two hosted aggregators, A-Coder and OpenAdapter, which fetch their model lists for you. You bring your own key, and you can assign different models to different features.",
  },
  {
    q: "How is this different from Void or plain VS Code?",
    a: "A-Coder is a fork of Void Editor, which is built on VS Code's open-source core. You keep the editor you know — VS Code extensions, themes and profiles all work. A-Coder adds the four modes, the agent tool system, semantic codebase search, Fast Apply diffs, the Agent Manager, MCP and Skills, and Learn Mode on top of that foundation.",
  },
  {
    q: "Does it work with my existing VS Code extensions?",
    a: "Yes. A-Coder points at the Visual Studio Marketplace, so your extensions, themes and keybindings carry over.",
  },
  {
    q: "What is TOON compression?",
    a: "Token-Oriented Object Notation — a compact encoding for tool results that cuts token usage on structured output. It is opt-in: enable enableToolResultTOON in settings. When on, it is only applied where it actually saves at least 10%. Measured savings are roughly 30–50% on directory listings, 40–60% on lint errors, and 30–70% on large structured MCP results.",
  },
  {
    q: "What do I need to build it from source?",
    a: "Node.js v22, as pinned in .nvmrc. The Development Guide, Contributing Guidelines and a Windows-specific build guide are all in the docs folder of the repository.",
  },
];
