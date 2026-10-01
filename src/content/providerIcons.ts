/**
 * Provider marks, used referentially to show which services A-Coder
 * connects to. Each file is the provider's own icon, unmodified.
 *
 * Only providers whose icon I could identify with certainty are mapped.
 * A mislabelled brand mark is worse than no mark at all, so the rest
 * fall back to a text wordmark until the mapping is confirmed — see the
 * UNMAPPED note below.
 */
export const PROVIDER_ICONS: Record<string, string> = {
  OpenAI: "/providers/openai.png",
  "Google Gemini": "/providers/google.png",
  Anthropic: "/providers/anthropic.png",
  "xAI Grok": "/providers/xai.png",
};

/**
 * Still text-only, for want of a confirmed icon:
 * Mistral · Groq · DeepSeek · OpenRouter · Vertex AI · Azure ·
 * AWS Bedrock · Ollama · vLLM · LM Studio · LiteLLM · llama.cpp ·
 * OpenAI-compatible
 */
export function providerIcon(name: string): string | null {
  return PROVIDER_ICONS[name] ?? null;
}
