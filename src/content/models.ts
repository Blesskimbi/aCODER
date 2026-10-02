/**
 * Providers and model configuration for /models.
 *
 * Sourced from docs/user-guide/providers-and-models.md and
 * getting-started.md.
 *
 * Deliberately no model SKUs. The repo names specific versions
 * (and its README still names a 3.5-era Claude), but version claims
 * date badly and the set changes with every provider release. The site
 * names providers and describes how models are discovered instead.
 * See PRODUCT_NOTES.md §5.
 */

export interface Provider {
  name: string;
  /** What you supply to connect it. */
  fields: string;
  notes?: string;
  /** Where the provider issues keys. */
  keyUrl?: string;
  /** Models arrive automatically rather than being typed in. */
  autoDetect?: boolean;
}

export const CLOUD: Provider[] = [
  { name: "Anthropic", fields: "API key", keyUrl: "https://console.anthropic.com/settings/keys" },
  { name: "OpenAI", fields: "API key", keyUrl: "https://platform.openai.com/api-keys" },
  { name: "Google Gemini", fields: "API key", keyUrl: "https://aistudio.google.com/apikey" },
  { name: "xAI (Grok)", fields: "API key", keyUrl: "https://console.x.ai" },
  { name: "DeepSeek", fields: "API key", keyUrl: "https://platform.deepseek.com/api_keys" },
  { name: "Mistral", fields: "API key", keyUrl: "https://console.mistral.ai/api-keys" },
  { name: "Groq", fields: "API key", keyUrl: "https://console.groq.com/keys" },
  {
    name: "OpenRouter",
    fields: "API key",
    notes: "Aggregator — one key reaches a hundred-plus models.",
    keyUrl: "https://openrouter.ai/settings/keys",
  },
  {
    name: "Google Vertex AI",
    fields: "Region and project",
    notes: "Authenticate with Google Cloud first; models are added by hand.",
  },
  {
    name: "Microsoft Azure OpenAI",
    fields: "Resource, API key, API version",
    notes: "Models are added by hand.",
  },
  {
    name: "AWS Bedrock",
    fields: "API key, region, endpoint",
    notes: "Reached through a LiteLLM proxy or the Bedrock Access Gateway.",
  },
  {
    name: "A-Coder (hosted)",
    fields: "API key",
    notes: "The project's own hosted models — the one option that is not bring-your-own-key.",
    autoDetect: true,
  },
  {
    name: "OpenAdapter",
    fields: "API key",
    notes: "OpenAI-compatible aggregator on a flat rate.",
    autoDetect: true,
  },
];

export const LOCAL: Provider[] = [
  { name: "Ollama", fields: "Endpoint", notes: "Default 127.0.0.1:11434. Models get Download buttons in Settings.", autoDetect: true },
  { name: "Ollama Cloud", fields: "Endpoint and API key", notes: "Hosted Ollama models.", autoDetect: true },
  { name: "LM Studio", fields: "Endpoint", notes: "Default localhost:1234.", autoDetect: true },
  { name: "vLLM", fields: "Endpoint", notes: "Default localhost:8000.", autoDetect: true },
  { name: "llama.cpp", fields: "Endpoint", notes: "Default 127.0.0.1:8080, via llama-server.", autoDetect: true },
  { name: "LiteLLM", fields: "Endpoint", notes: "A unified gateway in front of anything else." },
  {
    name: "OpenAI-compatible",
    fields: "Base URL, API key, custom headers",
    notes: "Any server speaking the OpenAI API. Omit /chat/completions from the base URL.",
  },
];

/** Features that can each run a different model. From getting-started.md. */
export const FEATURE_SLOTS: Array<{ name: string; powers: string }> = [
  { name: "Chat", powers: "Sidebar conversation, in all four modes" },
  { name: "Quick Edit", powers: "Inline Ctrl+K edits" },
  { name: "Autocomplete", powers: "Inline fill-in-the-middle completions as you type" },
  { name: "Apply", powers: "Writing suggested changes into files" },
  { name: "Commit Messages", powers: "One-click messages in Source Control" },
  { name: "Vision", powers: "Image understanding for images dropped into chat" },
  { name: "Smart Tool Picker", powers: "A separate model that picks tools before the main one runs" },
];

/** Per-model capability overrides. From providers-and-models.md. */
export const OVERRIDES: Array<{ key: string; controls: string }> = [
  { key: "contextWindow", controls: "Input token limit. Default 256,768." },
  { key: "reservedOutputTokenSpace", controls: "Space held back for the response. Default 16,384." },
  { key: "supportsSystemMessage", controls: "How the system prompt is sent: false, system-role, developer-role or separated." },
  { key: "specialToolFormat", controls: "Tool-calling dialect: openai-style, anthropic-style, gemini-style or marker-style." },
  { key: "supportsFIM", controls: "Whether the model can do fill-in-the-middle for autocomplete." },
  { key: "defaultTemperature", controls: "Recommended sampling temperature." },
  { key: "reasoningCapabilities", controls: "Whether it reasons, and whether reasoning can be switched off." },
  { key: "additionalOpenAIPayload", controls: "Extra fields appended to OpenAI-compatible request bodies." },
];
