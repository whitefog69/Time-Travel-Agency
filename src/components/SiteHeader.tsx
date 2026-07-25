"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const navLinks = [
  { href: "/#destinations", label: "Destinations" },
  { href: "/#quiz", label: "Find Your Era" },
  { href: "/#booking", label: "Reserve" },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-ink-950/85 border-gold-700/25 border-b backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <span className="border-gold-500/60 text-gold-400 group-hover:bg-gold-500/10 flex h-9 w-9 items-center justify-center rounded-full border text-sm tracking-widest transition-colors">
            TT
          </span>
          <span className="font-display text-parchment text-lg leading-none font-medium tracking-[0.2em] uppercase sm:text-xl">
            TimeTravel
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted hover:text-gold-300 relative text-xs tracking-[0.18em] uppercase transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#booking"
            className="border-gold-500/50 text-gold-300 hover:bg-gold-500 hover:text-ink-950 rounded-full border px-5 py-2 text-xs tracking-[0.18em] uppercase transition-all duration-300"
          >
            Book Passage
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="border-gold-700/40 text-gold-300 flex h-10 w-10 items-center justify-center rounded-full border md:hidden"
        >
          <span className="relative block h-3 w-4">
            <span
              className={`absolute left-0 block h-px w-4 bg-current transition-transform duration-300 ${
                menuOpen ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-4 bg-current transition-transform duration-300 ${
                menuOpen ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      {menuOpen ? (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="bg-ink-950/95 border-gold-700/20 overflow-hidden border-t backdrop-blur-md md:hidden"
        >
          <div className="flex flex-col gap-1 px-5 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-muted hover:text-gold-300 py-3 text-sm tracking-[0.16em] uppercase transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.nav>
      ) : null}
    </header>
  );
}
