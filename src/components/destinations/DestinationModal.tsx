"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatPrice, type Destination } from "@/data/destinations";

interface DestinationModalProps {
  destination: Destination | null;
  onClose: () => void;
}

export default function DestinationModal({
  destination,
  onClose,
}: DestinationModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const open = Boolean(destination);

  // Close on Escape and lock body scroll while the dialog is open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    // Move focus into the dialog for keyboard and screen-reader users.
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {destination ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-6"
        >
          <div
            className="bg-ink-950/85 absolute inset-0 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="destination-modal-title"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="border-gold-700/25 bg-ink-900 relative z-10 my-0 max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-t-3xl border focus:outline-none sm:my-6 sm:rounded-3xl"
          >
            <div className="relative h-56 w-full sm:h-72">
              <Image
                src={destination.image}
                alt={destination.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 900px"
                className="object-cover"
                priority
              />
              <div className="from-ink-900 via-ink-900/40 absolute inset-0 bg-gradient-to-t to-transparent" />

              <button
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="border-gold-500/40 bg-ink-950/70 text-gold-300 hover:bg-gold-500 hover:text-ink-950 absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm transition-colors"
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  ×
                </span>
              </button>

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="text-gold-400 text-[0.6rem] tracking-[0.3em] uppercase">
                  {destination.era} · {destination.year}
                </p>
                <h2
                  id="destination-modal-title"
                  className="font-display text-parchment mt-2 text-4xl leading-tight font-light sm:text-5xl"
                >
                  {destination.name}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-gold-300/90 font-display text-lg leading-relaxed italic sm:text-xl">
                {destination.tagline}
              </p>

              <div className="mt-7 space-y-4">
                {destination.description.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-muted text-sm leading-relaxed sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="rule-gold my-8 h-px opacity-50" />

              <div className="grid gap-8 sm:grid-cols-5">
                <div className="sm:col-span-3">
                  <h3 className="text-gold-400 text-[0.65rem] tracking-[0.25em] uppercase">
                    Included in this passage
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {destination.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="text-muted flex gap-3 text-sm leading-relaxed"
                      >
                        <span
                          aria-hidden="true"
                          className="text-gold-500 mt-1 text-[0.6rem]"
                        >
                          ◆
                        </span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="sm:col-span-2">
                  <div className="border-gold-700/25 bg-ink-800/60 rounded-2xl border p-5">
                    <p className="text-muted text-[0.6rem] tracking-[0.2em] uppercase">
                      Per traveller, from
                    </p>
                    <p className="font-display text-gold-300 mt-2 text-3xl">
                      {formatPrice(destination.price)}
                    </p>
                    <dl className="border-gold-700/20 mt-5 space-y-2.5 border-t pt-5 text-xs">
                      <div className="flex justify-between">
                        <dt className="text-muted">Duration</dt>
                        <dd className="text-parchment">
                          {destination.duration}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted">Pace</dt>
                        <dd className="text-parchment capitalize">
                          {destination.pace}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted">Era</dt>
                        <dd className="text-parchment">{destination.era}</dd>
                      </div>
                    </dl>

                    <Link
                      href={`/#booking?destination=${destination.id}`}
                      onClick={onClose}
                      className="bg-gold-500 text-ink-950 hover:bg-gold-400 mt-6 block w-full rounded-full px-6 py-3 text-center text-[0.65rem] font-medium tracking-[0.2em] uppercase transition-colors"
                    >
                      Reserve This Era
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
