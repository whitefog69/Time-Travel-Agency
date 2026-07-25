"use client";

import { useState } from "react";
import { destinations, type Destination } from "@/data/destinations";
import Reveal from "@/components/Reveal";
import DestinationCard from "./DestinationCard";
import DestinationModal from "./DestinationModal";

export default function DestinationsSection() {
  const [active, setActive] = useState<Destination | null>(null);

  return (
    <section
      id="destinations"
      className="bg-ink-950 bg-starfield relative scroll-mt-24 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-gold-400 text-[0.65rem] tracking-[0.35em] uppercase">
            The Catalogue
          </p>
          <h2 className="font-display mt-5 text-4xl leading-tight font-light sm:text-5xl md:text-6xl">
            <span className="text-gold-gradient">Three windows</span>
            <span className="text-parchment"> in time</span>
          </h2>
          <p className="text-muted mt-6 text-base leading-relaxed">
            Each passage is chartered individually, limited to a handful of
            travellers, and accompanied end to end by a temporal concierge.
            Select an era to view the full itinerary.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination, index) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              index={index}
              onOpen={setActive}
            />
          ))}
        </div>
      </div>

      <DestinationModal destination={active} onClose={() => setActive(null)} />
    </section>
  );
}
