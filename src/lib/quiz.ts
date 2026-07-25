import {
  destinations,
  type Destination,
  type DestinationId,
  type DestinationTheme,
  type Pace,
} from "@/data/destinations";

export interface QuizOption {
  value: string;
  label: string;
  description: string;
  /** Points added to each destination when this option is chosen. */
  scores: Partial<Record<DestinationId, number>>;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  helper: string;
  options: QuizOption[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "experience",
    prompt: "What kind of experience are you after?",
    helper: "The shape of the journey matters more than the century.",
    options: [
      {
        value: "spectacle",
        label: "A city at its peak",
        description: "Crowds, invention, and the feeling of history turning.",
        scores: { "paris-1889": 3, "florence-1504": 2 },
      },
      {
        value: "wilderness",
        label: "Somewhere genuinely wild",
        description: "No cities, no roads, nothing human at all.",
        scores: { cretaceous: 4 },
      },
      {
        value: "mastery",
        label: "In the room where it was made",
        description: "Workshops, studios, and people at the top of their craft.",
        scores: { "florence-1504": 4, "paris-1889": 1 },
      },
    ],
  },
  {
    id: "interest",
    prompt: "Which pulls you hardest?",
    helper: "Pick the one you'd talk about at dinner afterwards.",
    options: [
      {
        value: "art",
        label: "Art & the people who made it",
        description: "Painting, sculpture, and the arguments behind them.",
        scores: { "florence-1504": 4, "paris-1889": 1 },
      },
      {
        value: "architecture",
        label: "Architecture & engineering",
        description: "Domes, towers, and structures that changed what's possible.",
        scores: { "paris-1889": 3, "florence-1504": 3 },
      },
      {
        value: "nature",
        label: "The natural world",
        description: "Landscapes and living things on a scale you can't imagine.",
        scores: { cretaceous: 4 },
      },
      {
        value: "society",
        label: "How people actually lived",
        description: "Streets, cafés, fashion, and the texture of daily life.",
        scores: { "paris-1889": 3, "florence-1504": 2 },
      },
    ],
  },
  {
    id: "pace",
    prompt: "How should the days feel?",
    helper: "Be honest — a mismatch here spoils an otherwise perfect era.",
    options: [
      {
        value: "leisurely",
        label: "Slow and considered",
        description: "Long lunches, few fixed commitments, room to linger.",
        scores: { "florence-1504": 3, "paris-1889": 1 },
      },
      {
        value: "balanced",
        label: "Full but civilised",
        description: "A planned itinerary with evenings left open.",
        scores: { "paris-1889": 3, "florence-1504": 1 },
      },
      {
        value: "intense",
        label: "Genuinely demanding",
        description: "Early starts, real terrain, and a briefing every morning.",
        scores: { cretaceous: 4 },
      },
    ],
  },
  {
    id: "comfort",
    prompt: "And your appetite for risk?",
    helper: "Every passage is insured. Not every passage is comfortable.",
    options: [
      {
        value: "refined",
        label: "I'd like the good linen",
        description: "Comfort, service, and a very good bottle at dinner.",
        scores: { "paris-1889": 3, "florence-1504": 2 },
      },
      {
        value: "curious",
        label: "Comfortable, but I want a story",
        description: "Some novelty, as long as somebody competent is in charge.",
        scores: { "florence-1504": 2, "paris-1889": 2, cretaceous: 1 },
      },
      {
        value: "bold",
        label: "Put me somewhere with teeth",
        description: "Genuine expedition conditions. That's the appeal.",
        scores: { cretaceous: 4 },
      },
    ],
  },
];

export type QuizAnswers = Record<string, string>;

export interface QuizResult {
  destination: Destination;
  /** Confidence 0–100, from the winner's share of total points scored. */
  confidence: number;
  rationale: string;
}

const THEME_PHRASES: Record<DestinationTheme, string> = {
  art: "the art",
  architecture: "the architecture",
  nature: "the natural world",
  adventure: "genuine expedition conditions",
  science: "the science",
  culture: "the texture of daily life",
  romance: "the romance of the era",
};

const PACE_PHRASES: Record<Pace, string> = {
  leisurely: "unhurried days with room to linger",
  balanced: "a full itinerary that still leaves evenings open",
  intense: "demanding days with early starts",
};

/**
 * Builds a short rationale explaining the match, using the traveller's own
 * selections so the copy reads as personalised rather than canned.
 */
function buildRationale(
  destination: Destination,
  answers: QuizAnswers,
): string {
  const interestOption = quizQuestions
    .find((question) => question.id === "interest")
    ?.options.find((option) => option.value === answers.interest);

  const themes = destination.themes
    .slice(0, 2)
    .map((theme) => THEME_PHRASES[theme])
    .join(" and ");

  const interestClause = interestOption
    ? `You told us ${interestOption.label.toLowerCase()} pulls hardest, and this passage is built around exactly that.`
    : `This passage is built around ${themes}.`;

  return [
    `${destination.name}, ${destination.year} is your era.`,
    interestClause,
    `It suits travellers who want ${PACE_PHRASES[destination.pace]} — which is how these ${destination.duration.toLowerCase()} are structured.`,
    destination.tagline,
  ].join(" ");
}

/**
 * Scores every destination against the traveller's answers and returns the
 * best match. Ties break toward the earlier destination in the catalogue,
 * which keeps results deterministic.
 */
export function scoreQuiz(answers: QuizAnswers): QuizResult {
  const totals = new Map<DestinationId, number>(
    destinations.map((destination) => [destination.id, 0]),
  );

  for (const question of quizQuestions) {
    const chosen = answers[question.id];
    if (!chosen) continue;

    const option = question.options.find((item) => item.value === chosen);
    if (!option) continue;

    for (const [id, points] of Object.entries(option.scores)) {
      const destinationId = id as DestinationId;
      totals.set(destinationId, (totals.get(destinationId) ?? 0) + (points ?? 0));
    }
  }

  let winnerId: DestinationId = destinations[0].id;
  let best = -1;

  for (const destination of destinations) {
    const score = totals.get(destination.id) ?? 0;
    if (score > best) {
      best = score;
      winnerId = destination.id;
    }
  }

  const totalPoints = [...totals.values()].reduce((sum, n) => sum + n, 0);
  const confidence =
    totalPoints > 0 ? Math.round((best / totalPoints) * 100) : 0;

  const destination =
    destinations.find((item) => item.id === winnerId) ?? destinations[0];

  return {
    destination,
    confidence,
    rationale: buildRationale(destination, answers),
  };
}
