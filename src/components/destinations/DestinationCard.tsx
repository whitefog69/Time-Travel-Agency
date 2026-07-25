"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { formatPrice, type Destination } from "@/data/destinations";

interface DestinationCardProps {
  destination: Destination;
  index: number;
  onOpen: (destination: Destination) => void;
}

export default function DestinationCard({
  destination,
  index,
  onOpen,
}: DestinationCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8 }}
      className="group border-gold-700/20 bg-ink-900 relative overflow-hidden rounded-2xl border"
    >
      <button
        type="button"
        onClick={() => onOpen(destination)}
        aria-label={`View details for ${destination.name}, ${destination.year}`}
        className="focus-visible:ring-gold-400 block w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src={destination.image}
            alt={destination.imageAlt}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
          />

          {/* Base scrim so the copy stays readable over any photograph. */}
          <div className="from-ink-950 via-ink-950/55 absolute inset-0 bg-gradient-to-t to-transparent" />

          {/* Per-destination accent wash that warms on hover. */}
          <div
            className="absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-700 group-hover:opacity-100"
            style={{
              backgroundImage: `linear-gradient(to top, ${destination.accent.from}, transparent 60%)`,
            }}
          />

          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="text-gold-400 text-[0.6rem] tracking-[0.3em] uppercase">
              {destination.era}
            </p>
            <h3 className="font-display text-parchment mt-2 text-3xl leading-tight font-light">
              {destination.name}
            </h3>
            <p className="text-muted mt-1 font-mono text-xs tracking-widest">
              {destination.year}
            </p>
          </div>

          <div className="border-gold-500/30 bg-ink-950/70 text-gold-300 absolute top-5 right-5 rounded-full border px-3 py-1 text-[0.6rem] tracking-[0.15em] uppercase backdrop-blur-sm">
            {destination.duration}
          </div>
        </div>

        <div className="p-6">
          <p className="text-muted min-h-[3.5rem] text-sm leading-relaxed italic">
            {destination.tagline}
          </p>

          <div className="border-gold-700/20 mt-5 flex items-center justify-between border-t pt-5">
            <div>
              <p className="text-muted text-[0.6rem] tracking-[0.2em] uppercase">
                From
              </p>
              <p className="text-gold-300 font-display mt-1 text-xl">
                {formatPrice(destination.price)}
              </p>
            </div>
            <span className="text-gold-400 group-hover:text-gold-300 flex items-center gap-2 text-[0.65rem] tracking-[0.2em] uppercase transition-colors">
              Discover
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </div>
        </div>
      </button>

      {/* Hover glow ring. */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 0 1px ${destination.accent.glow}` }}
      />
    </motion.article>
  );
}
