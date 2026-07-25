"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * TODO: replace video — drop an MP4 at `/public/videos/hero.mp4` and set
 * HERO_VIDEO_SRC to "/videos/hero.mp4". While it is null (or if the file fails
 * to load), the animated aurora gradient below is used instead, so the hero is
 * never blank.
 */
const HERO_VIDEO_SRC: string | null = null;

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);
  const showVideo = Boolean(HERO_VIDEO_SRC) && !videoFailed && !reduceMotion;

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* Background layer: video when available, animated gradient otherwise. */}
      <div className="absolute inset-0 -z-10">
        {showVideo ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoFailed(true)}
            poster="/images/hero-poster.jpg"
          >
            <source src={HERO_VIDEO_SRC ?? undefined} type="video/mp4" />
          </video>
        ) : (
          <div className="bg-ink-950 absolute inset-0">
            <div className="animate-aurora absolute -top-1/3 -left-1/4 h-[80vh] w-[80vw] rounded-full bg-[radial-gradient(circle,rgba(201,162,39,0.30),transparent_65%)] blur-3xl" />
            <div className="animate-aurora-slow absolute -right-1/4 -bottom-1/3 h-[75vh] w-[75vw] rounded-full bg-[radial-gradient(circle,rgba(96,84,190,0.28),transparent_65%)] blur-3xl" />
            <div className="animate-aurora absolute top-1/4 left-1/3 h-[55vh] w-[55vw] rounded-full bg-[radial-gradient(circle,rgba(184,118,62,0.20),transparent_70%)] blur-3xl" />
          </div>
        )}

        {/* Vignette + scrim keeps the display type legible over any backdrop. */}
        <div className="from-ink-950/70 via-ink-950/50 to-ink-950 absolute inset-0 bg-gradient-to-b" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(7,7,12,0.85)_100%)]" />
      </div>

      <div className="mx-auto max-w-4xl px-5 py-28 text-center sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-gold-400 text-[0.65rem] tracking-[0.4em] uppercase sm:text-xs"
        >
          Chartered Temporal Passage
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="font-display mt-6 text-5xl leading-[1.05] font-light sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <span className="text-gold-gradient">Every era</span>
          <br />
          <span className="text-parchment">is a destination.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
          className="text-muted mx-auto mt-8 max-w-2xl text-base leading-relaxed sm:text-lg"
        >
          We arrange private passage to three of history&rsquo;s most
          extraordinary moments — fitted, provisioned, and accompanied. You
          bring curiosity. We handle the century.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="#destinations"
            className="group bg-gold-500 text-ink-950 hover:bg-gold-400 w-full rounded-full px-8 py-3.5 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:shadow-[0_0_36px_rgba(201,162,39,0.4)] sm:w-auto"
          >
            Explore Destinations
          </Link>
          <Link
            href="#quiz"
            className="border-gold-500/40 text-gold-300 hover:border-gold-400 hover:bg-gold-500/10 w-full rounded-full border px-8 py-3.5 text-xs tracking-[0.2em] uppercase transition-all duration-300 sm:w-auto"
          >
            Find Your Era
          </Link>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, 9, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="border-gold-500/40 flex h-11 w-6 items-start justify-center rounded-full border pt-2"
        >
          <span className="bg-gold-400 h-1.5 w-1 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
