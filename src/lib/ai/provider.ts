import { mistralProvider } from "./mistral";
import type { ChatProvider } from "./types";

/**
 * Provider registry.
 *
 * To add a vendor: implement `ChatProvider` in a sibling file, register it
 * here, and set `CHAT_PROVIDER` in the environment. Nothing else changes —
 * the route handler and the chat UI are provider-agnostic.
 *
 * Example (OpenAI-compatible vendors are a near copy of `mistral.ts`; only the
 * endpoint, key, and model default differ):
 *   import { openaiProvider } from "./openai";
 *   const providers = { mistral: mistralProvider, openai: openaiProvider };
 */
const providers: Record<string, ChatProvider> = {
  mistral: mistralProvider,
};

const DEFAULT_PROVIDER = "mistral";

export function getChatProvider(): ChatProvider {
  const requested = process.env.CHAT_PROVIDER?.toLowerCase() ?? DEFAULT_PROVIDER;
  const provider = providers[requested];

  if (!provider) {
    const known = Object.keys(providers).join(", ");
    console.warn(
      `[chat] Unknown CHAT_PROVIDER "${requested}". Known providers: ${known}. Falling back to "${DEFAULT_PROVIDER}".`,
    );
    return providers[DEFAULT_PROVIDER];
  }

  return provider;
}
