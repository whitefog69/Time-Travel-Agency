import { getChatProvider } from "@/lib/ai/provider";
import { CONCIERGE_SYSTEM_PROMPT } from "@/lib/ai/concierge";
import { ChatProviderError, type ChatMessage } from "@/lib/ai/types";

/**
 * Runs on the Node.js runtime (Fluid Compute) — the platform default.
 *
 * A static export has no server to run this on, so the GitHub Pages build
 * (`npm run build:static`) drops the route before compiling. See README.
 */
export const dynamic = "force-dynamic";

/** Guardrails against oversized or abusive payloads. */
const MAX_MESSAGES = 24;
const MAX_CHARS_PER_MESSAGE = 4000;
const UPSTREAM_TIMEOUT_MS = 30_000;

/**
 * Origins permitted to call this route cross-origin — the GitHub Pages site
 * lives on a different host than this API, so the browser preflights.
 *
 * An explicit allowlist rather than `*`: this endpoint spends real API credit,
 * so it should not be callable from any page on the web. Add extra origins via
 * `ALLOWED_ORIGINS` (comma-separated) without touching this file.
 */
const DEFAULT_ALLOWED_ORIGINS = ["https://whitefog69.github.io"];

function allowedOrigins(): string[] {
  const extra = (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return [...DEFAULT_ALLOWED_ORIGINS, ...extra];
}

/**
 * CORS headers for a given request, echoing the origin only when it is
 * allowlisted. Returns no CORS headers otherwise, so the browser blocks the
 * response. Same-origin callers (the Vercel-hosted site itself) send no
 * `Origin` header and are unaffected.
 */
function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin");
  if (!origin || !allowedOrigins().includes(origin)) return {};

  return {
    "Access-Control-Allow-Origin": origin,
    // Cached responses must vary by origin, or a CDN could serve one origin's
    // CORS headers to another.
    Vary: "Origin",
  };
}

/** Preflight for the cross-origin JSON POST the chat widget sends. */
export async function OPTIONS(request: Request) {
  const cors = corsHeaders(request);

  if (!Object.keys(cors).length) {
    return new Response(null, { status: 403 });
  }

  return new Response(null, {
    status: 204,
    headers: {
      ...cors,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

interface ChatRequestBody {
  messages?: unknown;
}

/** Narrows untrusted JSON into the conversation turns we accept. */
function parseMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;

  const messages: ChatMessage[] = [];

  for (const entry of input) {
    if (typeof entry !== "object" || entry === null) return null;

    const { role, content } = entry as Record<string, unknown>;

    // The system prompt is supplied server-side only; ignore any client copy
    // so the browser cannot rewrite the concierge's instructions.
    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string") return null;

    const trimmed = content.trim();
    if (!trimmed) continue;

    messages.push({
      role,
      content: trimmed.slice(0, MAX_CHARS_PER_MESSAGE),
    });
  }

  if (messages.length === 0) return null;

  // Keep the most recent turns so long sessions stay within token budget.
  return messages.slice(-MAX_MESSAGES);
}

export async function POST(request: Request) {
  const response = await handleChat(request);

  // Applied at the boundary so every exit path — success, validation failure,
  // and upstream error alike — carries CORS. Without this the browser hides
  // the real error behind an opaque network failure.
  for (const [header, value] of Object.entries(corsHeaders(request))) {
    response.headers.set(header, value);
  }

  return response;
}

async function handleChat(request: Request) {
  let body: ChatRequestBody;

  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return Response.json(
      { error: "Malformed request body." },
      { status: 400 },
    );
  }

  const messages = parseMessages(body.messages);

  if (!messages) {
    return Response.json(
      { error: "Expected a non-empty `messages` array of chat turns." },
      { status: 400 },
    );
  }

  const provider = getChatProvider();
  const timeout = AbortSignal.timeout(UPSTREAM_TIMEOUT_MS);

  try {
    const reply = await provider.complete(
      [{ role: "system", content: CONCIERGE_SYSTEM_PROMPT }, ...messages],
      timeout,
    );

    return Response.json({ reply });
  } catch (error) {
    if (error instanceof ChatProviderError) {
      // Full detail to the server log, sanitised message to the browser.
      console.error(`[chat:${provider.name}] ${error.message}`);
      return Response.json(
        { error: error.publicMessage },
        { status: error.status },
      );
    }

    console.error(`[chat:${provider.name}] Unexpected failure:`, error);
    return Response.json(
      {
        error:
          "The concierge is momentarily unavailable. Please try again shortly.",
      },
      { status: 500 },
    );
  }
}
