import Reveal from "@/components/Reveal";

const pillars = [
  {
    title: "Chartered privately",
    body: "Every passage is arranged for a single party. You will not share your century with strangers.",
  },
  {
    title: "Accompanied throughout",
    body: "A temporal concierge travels with you — fluent in the period, its customs, and its hazards.",
  },
  {
    title: "Anchored and insured",
    body: "Return anchors are redundant, monitored continuously, and rated well beyond your window.",
  },
];

export default function IntroSection() {
  return (
    <section className="bg-ink-900 relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-gold-400 text-[0.65rem] tracking-[0.35em] uppercase">
            Est. 2387
          </p>
          <h2 className="font-display mt-6 text-3xl leading-snug font-light sm:text-4xl md:text-5xl">
            <span className="text-parchment">
              The past is not a museum. It is a{" "}
            </span>
            <span className="text-gold-gradient">place</span>
            <span className="text-parchment">, and it is open.</span>
          </h2>
          <p className="text-muted mt-8 text-base leading-relaxed sm:text-lg">
            TimeTravel Agency has arranged private passage for four decades. We
            do not sell tours. We arrange a period of residence in a century
            that is not yours — fitted to your interests, provisioned for your
            comfort, and returned to the minute.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 0.12}>
              <div className="text-center sm:text-left">
                <div className="border-gold-500/40 text-gold-400 font-display mx-auto flex h-11 w-11 items-center justify-center rounded-full border text-sm sm:mx-0">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display text-parchment mt-5 text-xl font-light">
                  {pillar.title}
                </h3>
                <p className="text-muted mt-3 text-sm leading-relaxed">
                  {pillar.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
