import {
  ChatProviderError,
  type ChatMessage,
  type ChatProvider,
} from "./types";

const MISTRAL_ENDPOINT = "https://api.mistral.ai/v1/chat/completions";
const DEFAULT_MODEL = "mistral-small-latest";

interface MistralChoice {
  message?: { content?: string };
}

interface MistralResponse {
  choices?: MistralChoice[];
}

/**
 * Mistral chat-completions provider.
 *
 * Reads `MISTRAL_API_KEY` at call time (not module load) so a missing key
 * surfaces as a clean 503 at request time rather than crashing the build.
 * Override the model with `MISTRAL_MODEL`.
 */
export const mistralProvider: ChatProvider = {
  name: "mistral",

  async complete(messages: ChatMessage[], signal?: AbortSignal) {
    const apiKey = process.env.MISTRAL_API_KEY;

    if (!apiKey) {
      throw new ChatProviderError(
        "MISTRAL_API_KEY is not set",
        503,
        "The concierge is not configured yet. Add MISTRAL_API_KEY to your environment to enable live replies.",
      );
    }

    let response: Response;
    try {
      response = await fetch(MISTRAL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.MISTRAL_MODEL ?? DEFAULT_MODEL,
          messages,
          temperature: 0.7,
          max_tokens: 600,
        }),
        signal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new ChatProviderError(
          "Upstream request aborted",
          504,
          "That took longer than expected. Please try again.",
        );
      }
      throw new ChatProviderError(
        `Network failure calling Mistral: ${String(error)}`,
      );
    }

    if (!response.ok) {
      // Read the body for server logs, but never return it to the client —
      // provider errors can echo request details.
      const detail = await response.text().catch(() => "<unreadable>");

      if (response.status === 401 || response.status === 403) {
        throw new ChatProviderError(
          `Mistral rejected the API key (${response.status}): ${detail}`,
          503,
          "The concierge could not authenticate. Please check the configured API key.",
        );
      }

      if (response.status === 429) {
        throw new ChatProviderError(
          `Mistral rate limit hit: ${detail}`,
          429,
          "The concierge is handling a rush of enquiries. Please try again in a moment.",
        );
      }

      throw new ChatProviderError(
        `Mistral responded ${response.status}: ${detail}`,
      );
    }

    const data = (await response.json().catch(() => null)) as
      | MistralResponse
      | null;

    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      throw new ChatProviderError(
        "Mistral returned an empty completion",
        502,
        "The concierge did not have a reply to that. Could you rephrase?",
      );
    }

    return reply;
  },
};
