"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatPrice } from "@/data/destinations";
import {
  quizQuestions,
  scoreQuiz,
  type QuizAnswers,
  type QuizResult,
} from "@/lib/quiz";
import Reveal from "@/components/Reveal";

export default function QuizSection() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const question = quizQuestions[step];
  const progress = (step / quizQuestions.length) * 100;

  function choose(value: string) {
    const updated = { ...answers, [question.id]: value };
    setAnswers(updated);

    if (step < quizQuestions.length - 1) {
      setStep(step + 1);
    } else {
      setResult(scoreQuiz(updated));
    }
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setResult(null);
  }

  return (
    <section
      id="quiz"
      className="bg-ink-900 relative scroll-mt-24 overflow-hidden py-24 sm:py-32"
    >
      <div className="bg-gold-500/5 absolute top-1/2 left-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal className="text-center">
          <p className="text-gold-400 text-[0.65rem] tracking-[0.35em] uppercase">
            Personal Consultation
          </p>
          <h2 className="font-display mt-5 text-4xl leading-tight font-light sm:text-5xl">
            <span className="text-parchment">Which era is </span>
            <span className="text-gold-gradient">yours?</span>
          </h2>
          <p className="text-muted mt-6 text-base leading-relaxed">
            Four questions. Our concierge will match you to the passage that
            actually fits.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-12">
          <div className="border-gold-700/25 bg-ink-800/60 rounded-3xl border p-6 backdrop-blur-sm sm:p-9">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="text-gold-400 text-center text-[0.6rem] tracking-[0.3em] uppercase">
                    Our recommendation
                  </p>

                  <div className="relative mt-6 h-44 w-full overflow-hidden rounded-2xl sm:h-56">
                    <Image
                      src={result.destination.image}
                      alt={result.destination.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 640px"
                      className="object-cover"
                    />
                    <div className="from-ink-800 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-gold-400 text-[0.6rem] tracking-[0.28em] uppercase">
                        {result.destination.era}
                      </p>
                      <h3 className="font-display text-parchment mt-1.5 text-3xl font-light sm:text-4xl">
                        {result.destination.name}, {result.destination.year}
                      </h3>
                    </div>
                  </div>

                  <p className="text-muted mt-6 text-sm leading-relaxed sm:text-base">
                    {result.rationale}
                  </p>

                  <div className="border-gold-700/20 mt-6 flex items-center justify-between border-t pt-5">
                    <div>
                      <p className="text-muted text-[0.6rem] tracking-[0.2em] uppercase">
                        Match confidence
                      </p>
                      <p className="text-gold-300 font-display mt-1 text-2xl">
                        {result.confidence}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted text-[0.6rem] tracking-[0.2em] uppercase">
                        From
                      </p>
                      <p className="text-gold-300 font-display mt-1 text-2xl">
                        {formatPrice(result.destination.price)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="#booking"
                      className="bg-gold-500 text-ink-950 hover:bg-gold-400 flex-1 rounded-full px-6 py-3 text-center text-[0.65rem] font-medium tracking-[0.2em] uppercase transition-colors"
                    >
                      Reserve This Passage
                    </Link>
                    <button
                      type="button"
                      onClick={restart}
                      className="border-gold-500/40 text-gold-300 hover:bg-gold-500/10 flex-1 rounded-full border px-6 py-3 text-[0.65rem] tracking-[0.2em] uppercase transition-colors"
                    >
                      Start Over
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-gold-400 text-[0.6rem] tracking-[0.28em] uppercase">
                      Question {step + 1} of {quizQuestions.length}
                    </p>
                    {step > 0 ? (
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="text-muted hover:text-gold-300 text-[0.65rem] tracking-[0.15em] uppercase transition-colors"
                      >
                        ← Back
                      </button>
                    ) : null}
                  </div>

                  <div className="bg-ink-700 mt-4 h-px w-full overflow-hidden rounded-full">
                    <motion.div
                      className="bg-gold-500 h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>

                  <h3 className="font-display text-parchment mt-7 text-2xl leading-snug font-light sm:text-3xl">
                    {question.prompt}
                  </h3>
                  <p className="text-muted mt-2 text-sm">{question.helper}</p>

                  <div className="mt-7 space-y-3">
                    {question.options.map((option) => {
                      const selected = answers[question.id] === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => choose(option.value)}
                          className={`group w-full rounded-2xl border p-4 text-left transition-all duration-300 sm:p-5 ${
                            selected
                              ? "border-gold-500/70 bg-gold-500/10"
                              : "border-gold-700/25 bg-ink-900/50 hover:border-gold-500/50 hover:bg-ink-700/40"
                          }`}
                        >
                          <p className="text-parchment group-hover:text-gold-300 text-sm font-medium transition-colors sm:text-base">
                            {option.label}
                          </p>
                          <p className="text-muted mt-1 text-xs leading-relaxed sm:text-sm">
                            {option.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
