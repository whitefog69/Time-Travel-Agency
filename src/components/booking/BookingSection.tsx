"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  destinations,
  formatPrice,
  type DestinationId,
} from "@/data/destinations";
import Reveal from "@/components/Reveal";

interface BookingForm {
  name: string;
  email: string;
  destination: string;
  departure: string;
  travellers: string;
  notes: string;
}

type FormErrors = Partial<Record<keyof BookingForm, string>>;

const EMPTY_FORM: BookingForm = {
  name: "",
  email: "",
  destination: "",
  departure: "",
  travellers: "1",
  notes: "",
};

/** Today's date as `YYYY-MM-DD`, used as the earliest selectable departure. */
function todayISO(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function validate(form: BookingForm, minDate: string): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) {
    errors.name = "Please tell us who is travelling.";
  } else if (form.name.trim().length < 2) {
    errors.name = "That name looks a little short.";
  }

  if (!form.email.trim()) {
    errors.email = "We need an address to send your charter papers.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
    errors.email = "That doesn't look like a valid email address.";
  }

  if (!form.destination) {
    errors.destination = "Choose an era.";
  }

  if (!form.departure) {
    errors.departure = "Choose a departure date.";
  } else if (form.departure < minDate) {
    errors.departure = "Departure must be today or later.";
  }

  const travellers = Number(form.travellers);
  if (!Number.isInteger(travellers) || travellers < 1 || travellers > 8) {
    errors.travellers = "Parties of 1 to 8 travellers, please.";
  }

  return errors;
}

export default function BookingSection() {
  const minDate = useMemo(() => todayISO(), []);
  const [form, setForm] = useState<BookingForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const selected = destinations.find((d) => d.id === form.destination);
  const travellerCount = Number(form.travellers) || 0;
  const estimate =
    selected && travellerCount > 0 ? selected.price * travellerCount : null;

  function update<K extends keyof BookingForm>(field: K, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    // Clear a field's error as soon as the traveller edits it.
    setErrors((current) =>
      current[field] ? { ...current, [field]: undefined } : current,
    );
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const found = validate(form, minDate);
    setErrors(found);

    if (Object.keys(found).length === 0) {
      // Fictional demo: no network call, no charge. The confirmation panel
      // stands in for what a real charter desk would send by email.
      setSubmitted(true);
    }
  }

  function reset() {
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitted(false);
  }

  const fieldClass =
    "w-full rounded-xl border bg-ink-900/60 px-4 py-3 text-sm text-parchment placeholder:text-muted/60 transition-colors focus:outline-none";
  const okBorder = "border-gold-700/30 focus:border-gold-500/70";
  const badBorder = "border-red-500/60 focus:border-red-400";

  return (
    <section
      id="booking"
      className="bg-ink-950 bg-starfield relative scroll-mt-24 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal className="text-center">
          <p className="text-gold-400 text-[0.65rem] tracking-[0.35em] uppercase">
            Reserve
          </p>
          <h2 className="font-display mt-5 text-4xl leading-tight font-light sm:text-5xl">
            <span className="text-parchment">Request your </span>
            <span className="text-gold-gradient">charter</span>
          </h2>
          <p className="text-muted mt-6 text-base leading-relaxed">
            Submit an enquiry and a charter agent will confirm availability
            within one business day — of your own century.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-12">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="border-gold-500/40 bg-ink-900/70 rounded-3xl border p-8 text-center sm:p-12"
              >
                <div className="border-gold-500/50 text-gold-400 mx-auto flex h-14 w-14 items-center justify-center rounded-full border text-2xl">
                  ✓
                </div>
                <h3 className="font-display text-parchment mt-6 text-3xl font-light">
                  Enquiry received
                </h3>
                <p className="text-muted mx-auto mt-4 max-w-md text-sm leading-relaxed">
                  Thank you, {form.name.trim().split(" ")[0]}. Your request for{" "}
                  <span className="text-gold-300">
                    {selected?.name}, {selected?.year}
                  </span>{" "}
                  departing {form.departure} for {form.travellers} traveller
                  {travellerCount === 1 ? "" : "s"} is with our charter desk.
                </p>
                <p className="text-muted/70 mt-5 text-xs leading-relaxed italic">
                  This is a fictional demonstration — nothing was submitted or
                  charged.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="border-gold-500/40 text-gold-300 hover:bg-gold-500/10 mt-8 rounded-full border px-7 py-3 text-[0.65rem] tracking-[0.2em] uppercase transition-colors"
                >
                  Make Another Enquiry
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                noValidate
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-gold-700/25 bg-ink-900/60 space-y-5 rounded-3xl border p-6 backdrop-blur-sm sm:p-9"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="booking-name"
                      className="text-muted mb-2 block text-[0.65rem] tracking-[0.2em] uppercase"
                    >
                      Full name
                    </label>
                    <input
                      id="booking-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Eleanor Vance"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "error-name" : undefined}
                      className={`${fieldClass} ${errors.name ? badBorder : okBorder}`}
                    />
                    {errors.name ? (
                      <p id="error-name" className="mt-2 text-xs text-red-400">
                        {errors.name}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="booking-email"
                      className="text-muted mb-2 block text-[0.65rem] tracking-[0.2em] uppercase"
                    >
                      Email
                    </label>
                    <input
                      id="booking-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@example.com"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "error-email" : undefined
                      }
                      className={`${fieldClass} ${errors.email ? badBorder : okBorder}`}
                    />
                    {errors.email ? (
                      <p id="error-email" className="mt-2 text-xs text-red-400">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="booking-destination"
                    className="text-muted mb-2 block text-[0.65rem] tracking-[0.2em] uppercase"
                  >
                    Destination
                  </label>
                  <select
                    id="booking-destination"
                    value={form.destination}
                    onChange={(e) =>
                      update("destination", e.target.value as DestinationId)
                    }
                    aria-invalid={Boolean(errors.destination)}
                    aria-describedby={
                      errors.destination ? "error-destination" : undefined
                    }
                    className={`${fieldClass} ${errors.destination ? badBorder : okBorder}`}
                  >
                    <option value="">Select an era…</option>
                    {destinations.map((destination) => (
                      <option key={destination.id} value={destination.id}>
                        {destination.name}, {destination.year} —{" "}
                        {formatPrice(destination.price)}
                      </option>
                    ))}
                  </select>
                  {errors.destination ? (
                    <p
                      id="error-destination"
                      className="mt-2 text-xs text-red-400"
                    >
                      {errors.destination}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="booking-departure"
                      className="text-muted mb-2 block text-[0.65rem] tracking-[0.2em] uppercase"
                    >
                      Departure date
                    </label>
                    <input
                      id="booking-departure"
                      type="date"
                      min={minDate}
                      value={form.departure}
                      onChange={(e) => update("departure", e.target.value)}
                      aria-invalid={Boolean(errors.departure)}
                      aria-describedby={
                        errors.departure ? "error-departure" : undefined
                      }
                      className={`${fieldClass} ${errors.departure ? badBorder : okBorder} [color-scheme:dark]`}
                    />
                    {errors.departure ? (
                      <p
                        id="error-departure"
                        className="mt-2 text-xs text-red-400"
                      >
                        {errors.departure}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="booking-travellers"
                      className="text-muted mb-2 block text-[0.65rem] tracking-[0.2em] uppercase"
                    >
                      Travellers
                    </label>
                    <input
                      id="booking-travellers"
                      type="number"
                      min={1}
                      max={8}
                      value={form.travellers}
                      onChange={(e) => update("travellers", e.target.value)}
                      aria-invalid={Boolean(errors.travellers)}
                      aria-describedby={
                        errors.travellers ? "error-travellers" : undefined
                      }
                      className={`${fieldClass} ${errors.travellers ? badBorder : okBorder}`}
                    />
                    {errors.travellers ? (
                      <p
                        id="error-travellers"
                        className="mt-2 text-xs text-red-400"
                      >
                        {errors.travellers}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="booking-notes"
                    className="text-muted mb-2 block text-[0.65rem] tracking-[0.2em] uppercase"
                  >
                    Notes for the concierge{" "}
                    <span className="normal-case opacity-60">(optional)</span>
                  </label>
                  <textarea
                    id="booking-notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    placeholder="Dietary requirements, anniversaries, particular interests…"
                    className={`${fieldClass} ${okBorder} resize-none`}
                  />
                </div>

                {estimate !== null ? (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-gold-700/25 bg-ink-800/50 flex items-center justify-between rounded-xl border px-5 py-4"
                  >
                    <span className="text-muted text-[0.65rem] tracking-[0.2em] uppercase">
                      Estimated total
                    </span>
                    <span className="font-display text-gold-300 text-2xl">
                      {formatPrice(estimate)}
                    </span>
                  </motion.div>
                ) : null}

                <button
                  type="submit"
                  className="bg-gold-500 text-ink-950 hover:bg-gold-400 w-full rounded-full px-8 py-4 text-[0.7rem] font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:shadow-[0_0_36px_rgba(201,162,39,0.35)]"
                >
                  Submit Enquiry
                </button>

                <p className="text-muted/60 text-center text-[0.7rem] leading-relaxed">
                  Fictional demonstration. No payment is taken and no data
                  leaves your browser.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
