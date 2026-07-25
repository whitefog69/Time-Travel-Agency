import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-gold-700/20 bg-ink-950 border-t">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-gold-300 text-2xl tracking-[0.18em] uppercase">
              TimeTravel
            </p>
            <p className="text-muted mt-4 max-w-xs text-sm leading-relaxed">
              A private temporal travel house. Chartered passage, curated eras,
              absolute discretion.
            </p>
          </div>

          <div>
            <p className="text-gold-400 text-xs tracking-[0.2em] uppercase">
              Destinations
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="/#destinations"
                  className="text-muted hover:text-parchment transition-colors"
                >
                  Paris, 1889
                </Link>
              </li>
              <li>
                <Link
                  href="/#destinations"
                  className="text-muted hover:text-parchment transition-colors"
                >
                  The Cretaceous
                </Link>
              </li>
              <li>
                <Link
                  href="/#destinations"
                  className="text-muted hover:text-parchment transition-colors"
                >
                  Florence, 1504
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-gold-400 text-xs tracking-[0.2em] uppercase">
              Notice
            </p>
            <p className="text-muted mt-4 text-sm leading-relaxed">
              TimeTravel Agency is a fictional brand built as a portfolio
              demonstration. No temporal passage is actually sold, and no
              booking is ever charged.
            </p>
          </div>
        </div>

        <div className="rule-gold mt-12 h-px opacity-40" />

        <div className="text-muted mt-6 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} TimeTravel Agency. Fictional.</p>
          <p className="tracking-[0.14em] uppercase">
            Chronometric charter · Est. 2387
          </p>
        </div>
      </div>
    </footer>
  );
}
