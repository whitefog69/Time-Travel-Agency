"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CONCIERGE_GREETING } from "@/lib/ai/concierge";
import type { ChatMessage } from "@/lib/ai/types";
import TypingIndicator from "./TypingIndicator";

interface DisplayMessage extends ChatMessage {
  id: string;
  /** Set when the turn failed, so it can render as an inline notice. */
  isError?: boolean;
}

let messageCounter = 0;
const nextId = () => `msg-${++messageCounter}`;

export default function ChatWidget() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([
    { id: "greeting", role: "assistant", content: CONCIERGE_GREETING },
  ]);

  const transcriptRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Keep the newest turn in view.
  useEffect(() => {
    const node = transcriptRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, pending]);

  // Focus the composer when the panel opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Close on Escape while the panel has focus.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  async function sendMessage(event: React.FormEvent) {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || pending) return;

    const userMessage: DisplayMessage = {
      id: nextId(),
      role: "user",
      content: trimmed,
    };

    // Snapshot the history that the model should see. Error notices are
    // excluded — they are UI artefacts, not part of the conversation.
    const history = [...messages, userMessage]
      .filter((message) => !message.isError)
      .map(({ role, content }) => ({ role, content }));

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setPending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = (await response.json().catch(() => null)) as {
        reply?: string;
        error?: string;
      } | null;

      if (!response.ok || !data?.reply) {
        setMessages((current) => [
          ...current,
          {
            id: nextId(),
            role: "assistant",
            content:
              data?.error ??
              "The concierge is momentarily unavailable. Please try again shortly.",
            isError: true,
          },
        ]);
        return;
      }

      setMessages((current) => [
        ...current,
        { id: nextId(), role: "assistant", content: data.reply! },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: nextId(),
          role: "assistant",
          content:
            "I couldn't reach the charter desk — please check your connection and try again.",
          isError: true,
        },
      ]);
    } finally {
      setPending(false);
      inputRef.current?.focus();
    }
  }

  return (
    <>
      {/* Launcher */}
      <motion.button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close concierge chat" : "Open concierge chat"}
        aria-expanded={open}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={reduceMotion ? undefined : { scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gold-500 text-ink-950 hover:bg-gold-400 fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-[0_8px_30px_rgba(201,162,39,0.35)] transition-colors sm:right-7 sm:bottom-7"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="text-2xl leading-none"
              aria-hidden="true"
            >
              ×
            </motion.span>
          ) : (
            <motion.svg
              key="chat"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open ? (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="TimeTravel Agency concierge"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="border-gold-700/30 bg-ink-900/97 fixed right-0 bottom-0 z-50 flex h-[70svh] max-h-[560px] w-full flex-col overflow-hidden rounded-t-2xl border shadow-2xl backdrop-blur-md sm:right-7 sm:bottom-24 sm:h-[520px] sm:w-[min(384px,calc(100vw-3.5rem))] sm:rounded-2xl"
          >
            <header className="border-gold-700/25 bg-ink-800/80 flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="border-gold-500/50 text-gold-400 flex h-9 w-9 items-center justify-center rounded-full border text-[0.6rem] tracking-widest">
                  TT
                </span>
                <div>
                  <p className="font-display text-parchment text-base leading-tight">
                    Temporal Concierge
                  </p>
                  <p className="text-gold-400/80 flex items-center gap-1.5 text-[0.65rem]">
                    <span className="bg-gold-400 inline-block h-1.5 w-1.5 rounded-full" />
                    At your service
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="text-muted hover:text-parchment px-2 text-xl leading-none transition-colors sm:hidden"
              >
                ×
              </button>
            </header>

            <div
              ref={transcriptRef}
              className="scrollbar-luxe flex-1 space-y-4 overflow-y-auto px-5 py-5"
              aria-live="polite"
              aria-atomic="false"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === "user" ? "flex justify-end" : "flex"
                  }
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      message.role === "user"
                        ? "bg-gold-500 text-ink-950 rounded-br-sm"
                        : message.isError
                          ? "border border-red-500/30 bg-red-500/10 text-red-200/90"
                          : "bg-ink-700/70 text-parchment/90 rounded-bl-sm"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {pending ? <TypingIndicator /> : null}
            </div>

            <form
              onSubmit={sendMessage}
              className="border-gold-700/25 bg-ink-800/60 border-t p-3"
            >
              <div className="flex items-center gap-2">
                <label htmlFor="concierge-input" className="sr-only">
                  Message the concierge
                </label>
                <input
                  id="concierge-input"
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about an era…"
                  autoComplete="off"
                  disabled={pending}
                  className="bg-ink-950/70 border-gold-700/30 text-parchment placeholder:text-muted/70 focus:border-gold-500/60 min-w-0 flex-1 rounded-full border px-4 py-2.5 text-sm transition-colors focus:outline-none disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={pending || !input.trim()}
                  aria-label="Send message"
                  className="bg-gold-500 text-ink-950 hover:bg-gold-400 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
