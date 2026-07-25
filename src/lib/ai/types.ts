/** Shared chat types used by both the API route and the client widget. */

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/**
 * A chat provider wraps a single LLM vendor behind one method, so swapping
 * vendors means adding a file here and changing `CHAT_PROVIDER` — not touching
 * the route handler or the UI.
 */
export interface ChatProvider {
  /** Stable identifier, e.g. "mistral". */
  readonly name: string;
  /**
   * Sends the conversation and resolves with the assistant's reply text.
   * Implementations should throw `ChatProviderError` on failure.
   */
  complete(messages: ChatMessage[], signal?: AbortSignal): Promise<string>;
}

/** Error carrying an HTTP status so the route can map failures to responses. */
export class ChatProviderError extends Error {
  readonly status: number;
  /** Safe, user-facing message. Never leaks provider internals or keys. */
  readonly publicMessage: string;

  constructor(message: string, status = 502, publicMessage?: string) {
    super(message);
    this.name = "ChatProviderError";
    this.status = status;
    this.publicMessage =
      publicMessage ??
      "The concierge is momentarily unavailable. Please try again shortly.";
  }
}
