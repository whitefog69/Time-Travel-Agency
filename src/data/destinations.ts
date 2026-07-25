/**
 * Structured data for the three TimeTravel Agency destinations.
 *
 * TODO: replace image — every `image` field below points at a royalty-free
 * Unsplash placeholder sized 1600x1200. Swap these for licensed art direction
 * before launch. Remote hosts must stay in sync with `images.remotePatterns`
 * in `next.config.ts`; if you move the files into `/public`, use a leading
 * slash (e.g. `/images/paris-1889.jpg`) and the remote pattern can be dropped.
 */

export type DestinationId = "paris-1889" | "cretaceous" | "florence-1504";

/** Tags used by the quiz to score a destination against a traveller profile. */
export type DestinationTheme =
  | "art"
  | "architecture"
  | "nature"
  | "adventure"
  | "science"
  | "culture"
  | "romance";

export type Pace = "leisurely" | "balanced" | "intense";

export interface Destination {
  id: DestinationId;
  name: string;
  era: string;
  /** Human-readable year label used in badges and the booking summary. */
  year: string;
  tagline: string;
  /** Two to three paragraphs of immersive brochure copy. */
  description: string[];
  highlights: string[];
  themes: DestinationTheme[];
  pace: Pace;
  /** Price per traveller, in USD. */
  price: number;
  duration: string;
  /** Tailwind-friendly accent used for per-destination gradients and glows. */
  accent: {
    from: string;
    to: string;
    glow: string;
  };
  image: string;
  imageAlt: string;
}

export const destinations: Destination[] = [
  {
    id: "paris-1889",
    name: "Paris",
    era: "Belle Époque",
    year: "1889",
    tagline:
      "Champagne under wrought iron, the night the century learned to glow.",
    description: [
      "You arrive on the Champ de Mars in the spring of 1889, three weeks into the Exposition Universelle, as a newly finished Eiffel Tower throws its first electric light across the Seine. The air smells of coal smoke, lilac, and hot sugar from the confectioners' pavilions. Paris has invited the world to dinner, and you have a seat at the table.",
      "Our temporal concierges place you in a private apartment on the Avenue Rapp, wardrobe fitted to the season and papers arranged in advance. Days belong to the exposition's forty-seven acres of pavilions — the Galerie des Machines, the reconstructed Cairo street, Edison's phonograph drawing crowds ten deep. Evenings belong to the cafés of Montmartre, where the painters arguing at the next table have not yet become famous.",
      "This is the Belle Époque at the precise moment it believed in itself most completely: optimistic, electric, and entirely unaware of what the next century holds. We recommend it to travellers who want to feel history at its most confident.",
    ],
    highlights: [
      "Private ascent of the Eiffel Tower during its inaugural season",
      "Full access to the Exposition Universelle and the Galerie des Machines",
      "Dinner at a Montmartre café among the post-impressionist circle",
      "A fitted period wardrobe from a Rue de la Paix couturier",
      "Evening carriage tour of the newly gaslit boulevards",
    ],
    themes: ["architecture", "culture", "romance", "art"],
    pace: "balanced",
    price: 48500,
    duration: "9 days",
    accent: {
      from: "#c9a227",
      to: "#8c6d1f",
      glow: "rgba(201, 162, 39, 0.35)",
    },
    // TODO: replace image
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80",
    imageAlt:
      "Golden hour over Parisian rooftops with the Eiffel Tower on the skyline",
  },
  {
    id: "cretaceous",
    name: "The Cretaceous",
    era: "Late Mesozoic",
    year: "−65,000,000",
    tagline:
      "Stand in the last great forest before the sky changes forever.",
    description: [
      "Sixty-five million years before your birth certificate, the interior of what will become North America is warm, humid, and impossibly loud. Magnolias and tree ferns crowd a floodplain the size of a country. Somewhere beyond the treeline, something very large is moving through the undergrowth, and every bird-like creature in the canopy has gone silent at once.",
      "Travellers are housed in the Meridian, a shielded observation platform suspended eleven metres above the forest floor, with panoramic glass and a temporal anchor rated for the full expedition window. Guided excursions descend to ground level in armoured transports under the supervision of our paleo-security team. You will see hadrosaur herds at the water's edge at dawn, and if the season cooperates, a tyrannosaur at a kill.",
      "Nothing you have been shown in a museum prepares you for the scale, the smell, or the sound. This is the flagship expedition of our catalogue, and the one our travellers describe in the fewest words when they return.",
    ],
    highlights: [
      "Suspended observation deck above an untouched Cretaceous floodplain",
      "Dawn viewing of hadrosaur and ceratopsian herds at the river bend",
      "Armoured ground excursion with paleo-security escort",
      "Night-vision canopy session tracking early mammals and pterosaurs",
      "Specimen briefing with the expedition's resident paleontologist",
    ],
    themes: ["nature", "adventure", "science"],
    pace: "intense",
    price: 96000,
    duration: "6 days",
    accent: {
      from: "#4a7c59",
      to: "#2b4a35",
      glow: "rgba(74, 124, 89, 0.35)",
    },
    // TODO: replace image
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80",
    imageAlt:
      "Mist rising through a dense primeval forest valley at first light",
  },
  {
    id: "florence-1504",
    name: "Florence",
    era: "High Renaissance",
    year: "1504",
    tagline:
      "The year the David was raised, and two rivals shared a single city.",
    description: [
      "Florence in 1504 is a city of roughly fifty thousand people that is, at this exact moment, producing more consequential art per square metre than anywhere in human history. Michelangelo is twenty-nine and has just finished the David. Leonardo is fifty-two and back in the city after two decades away. The Signoria has commissioned them both to paint the same hall, and the entire republic is watching.",
      "You are lodged in a merchant's palazzo two streets from the Piazza della Signoria, with introductions arranged through our standing relationships in the guild quarter. Our itinerary places you in the Piazza on the morning the David is manoeuvred into position — four days of work by forty men — and inside the workshops where preparatory cartoons for the Battle of Anghiari are still pinned to the wall.",
      "For travellers whose interest is art, architecture, or the sheer improbability of genius clustering in one place at one time, no other window in our catalogue comes close.",
    ],
    highlights: [
      "Witness the installation of Michelangelo's David in the Piazza della Signoria",
      "Workshop visit during preparation of Leonardo's Battle of Anghiari",
      "Private access to Brunelleschi's dome and the cathedral works yard",
      "Dinner with a Medici-circle patron in the Oltrarno",
      "Guided study of the Uffizi quarter's guild workshops",
    ],
    themes: ["art", "architecture", "culture"],
    pace: "leisurely",
    price: 62000,
    duration: "8 days",
    accent: {
      from: "#b8763e",
      to: "#7a4a24",
      glow: "rgba(184, 118, 62, 0.35)",
    },
    // TODO: replace image
    image:
      "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=1600&q=80",
    imageAlt:
      "Florence cathedral dome rising above terracotta rooftops at sunset",
  },
];

export function getDestination(id: DestinationId): Destination | undefined {
  return destinations.find((destination) => destination.id === id);
}

/** Formats a price as a whole-dollar USD string, e.g. `$48,500`. */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}
