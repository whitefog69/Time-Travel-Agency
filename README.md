# TimeTravel Agency

> A fictional luxury time-travel agency — an immersive, single-page marketing site with an AI concierge, a personalisation quiz, and a booking flow.

TimeTravel Agency arranges private passage to three moments in history: **Belle Époque Paris (1889)**, **the Late Cretaceous (−65,000,000)**, and **Renaissance Florence (1504)**. The site is built as a portfolio-grade demonstration of a premium brand experience — deep midnight tones, gold accents, serif display type, and restrained motion.

**This is a fictional brand.** No passage is sold, no booking is submitted, and no payment is ever taken.

---

## Tech stack

| Layer      | Choice                                             |
| ---------- | -------------------------------------------------- |
| Framework  | Next.js 16.2 (App Router, Turbopack)               |
| Language   | TypeScript 5 (strict)                              |
| Styling    | Tailwind CSS v4 (CSS-first `@theme` configuration) |
| Animation  | Framer Motion 12                                   |
| AI         | Mistral AI (`mistral-small-latest`) via a swappable provider layer |
| Fonts      | Cormorant Garamond (display) + Inter (body), via `next/font` |
| Images     | `next/image` with lazy loading and remote optimisation |
| Deployment | Vercel                                             |

---

## Features

### Home
- **Hero** — full-screen, with a slot for a background video and an animated aurora-gradient fallback used when no video is configured, when the video fails to load, or when the visitor prefers reduced motion.
- **Agency intro** — three trust pillars with staggered scroll reveals.

### Destinations gallery
- Three interactive cards with image zoom, lift, and per-destination accent glow on hover.
- Each card opens a **detail modal** with full brochure copy, inclusions, pricing, duration, and pace.
- Modal supports `Escape` to close, backdrop dismissal, body-scroll locking, and focus handling.
- Images use `next/image` with `loading="lazy"` and responsive `sizes`.

### AI concierge chat
- Floating bubble (bottom-right), present on **every page** — mounted in the root layout.
- Backed by a Next.js Route Handler at **`/api/chat`**.
- Personality: warm, knowledgeable temporal concierge who gives personalised destination advice and answers FAQs, stays in character, and never invents destinations or prices.
- **Typing indicator** while the reply is composed.
- **Graceful error handling** at every layer — missing key, bad key, rate limit, timeout, network failure, and empty completion each produce a distinct, human-readable message. The site remains fully usable without an API key.

### Personalisation quiz
- Four questions covering experience type, interests, pace, and appetite for risk.
- Weighted scoring in a pure, side-effect-free module (`src/lib/quiz.ts`).
- Returns a recommended destination, a **match-confidence percentage**, and a rationale composed from the traveller's own answers.

### Booking form
- Destination, departure date, party size, and free-text notes.
- **Client-side validation** with per-field inline errors, `aria-invalid` / `aria-describedby` wiring, past-date rejection, and a live estimated total.
- Submitting shows a confirmation panel. Nothing is sent anywhere.

### Motion & accessibility
- Fade-and-lift reveals on scroll (fire once), card micro-interactions, animated progress and page transitions.
- Every animation respects `prefers-reduced-motion`, via both Framer Motion's `useReducedMotion` and a CSS media block.
- Semantic landmarks, labelled controls, keyboard-operable dialogs, and visible focus states.

---

## Getting started

**Prerequisites:** Node.js 20.9+ (Next.js 16 requirement) and npm.

```bash
# 1. Install dependencies
npm install

# 2. Create your local env file
cp .env.example .env.local     # Windows PowerShell: copy .env.example .env.local

# 3. Add your Mistral key to .env.local (optional — see below)
#    MISTRAL_API_KEY=your_key_here

# 4. Start the dev server
npm run dev
```

Open **http://localhost:3000**.

### Scripts

| Command         | Description                                  |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Start the development server (Turbopack)     |
| `npm run build` | Production build                             |
| `npm start`     | Serve the production build (run build first) |
| `npm run lint`  | Run ESLint                                   |

---

## Environment variables

| Variable          | Required | Default                 | Purpose                                                        |
| ----------------- | -------- | ----------------------- | -------------------------------------------------------------- |
| `MISTRAL_API_KEY` | For chat | —                       | Mistral API key. Get one at [console.mistral.ai](https://console.mistral.ai/api-keys). |
| `MISTRAL_MODEL`   | No       | `mistral-small-latest`  | Override the model.                                            |
| `CHAT_PROVIDER`   | No       | `mistral`               | Select a registered provider.                                  |

Copy `.env.example` to `.env.local` and fill in your key. `.env.local` is gitignored.

> **Without a key the app still builds, runs, and deploys.** Every page works; the chat widget simply replies with a polite "not configured yet" notice instead of live answers.

### Swapping the AI provider

The AI layer is deliberately thin, so changing vendors touches one file:

```
src/lib/ai/
  types.ts       # ChatProvider interface + ChatProviderError
  mistral.ts     # Mistral implementation
  provider.ts    # Registry — add your provider here
  concierge.ts   # System prompt, generated from the destinations data
```

To add a vendor: implement the `ChatProvider` interface in a new file, register it in the `providers` map in `provider.ts`, and set `CHAT_PROVIDER`. The route handler and the chat UI are provider-agnostic and need no changes. OpenAI-compatible vendors (OpenAI, Groq, Together, OpenRouter) are a near-copy of `mistral.ts` — only the endpoint, key, and model default differ.

---

## Deploy

### One-click

Push this repository to GitHub, then:

1. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
2. Vercel auto-detects Next.js — no build configuration needed.
3. Add the environment variable **`MISTRAL_API_KEY`** under **Settings → Environment Variables** (select Production, Preview, and Development).
4. Click **Deploy**.

### Via the CLI

```bash
npm i -g vercel
vercel                          # preview deployment
vercel env add MISTRAL_API_KEY  # add the key (repeat per environment)
vercel --prod                   # production deployment
```

> If you deploy without `MISTRAL_API_KEY`, the build still succeeds and the site works — only live chat replies are disabled. Add the key and redeploy to enable them.

### GitHub Pages

Live at **https://whitefog69.github.io/Time-Travel-Agency/**.

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which runs `npm run build:static` and publishes `out/`. Enable it once under **Settings → Pages → Source → GitHub Actions**.

To reproduce the Pages build locally:

```bash
npm run build:static   # writes ./out
npx serve out          # note: assets are prefixed /Time-Travel-Agency
```

**What differs on Pages.** GitHub Pages serves static files with no server runtime, so `npm run build:static` sets two variables that change the build:

| Variable                    | Effect                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `GITHUB_PAGES`              | Applies the `/Time-Travel-Agency` base path and asset prefix for the project subpath. |
| `NEXT_PUBLIC_STATIC_EXPORT` | Tells the chat widget its backend is absent, so it shows an offline notice.           |

The `/api/chat` route cannot run there — `pageExtensions` excludes it from this build only. Every other feature (destinations, quiz, booking, animations) is fully static and works. `MISTRAL_API_KEY` is deliberately *not* used by this build: a static site cannot hold a secret.

By default the concierge chat is **inactive** on the Pages URL. To switch it on, see below.

### Enabling the concierge chat on GitHub Pages

The API key must stay on a server — bundling it into a static site would expose
it to anyone who views source. So host the API on Vercel and point the Pages
frontend at it.

**1. Deploy the API.** Follow the Vercel steps above, including setting
`MISTRAL_API_KEY`. The same repo serves both; only the Pages build strips the
route. Note the deployment URL, e.g. `https://your-app.vercel.app`.

**2. Point Pages at it.** In the repo: **Settings → Secrets and variables →
Actions → Variables → New repository variable**.

| Name           | Value                                     |
| -------------- | ----------------------------------------- |
| `CHAT_API_URL` | `https://your-app.vercel.app/api/chat`    |

A *variable*, not a secret: `NEXT_PUBLIC_*` values are inlined into the client
bundle and are public by definition. The Mistral key never enters this build.

**3. Re-run the workflow** (Actions → Deploy to GitHub Pages → Run workflow).
The widget now sends chat turns to the Vercel API, which holds the key.

Leave `CHAT_API_URL` unset and the widget keeps showing its offline notice —
the site still builds and deploys fine.

**CORS.** `https://whitefog69.github.io` is allowlisted in
[`src/app/api/chat/route.ts`](src/app/api/chat/route.ts); add more origins with
the `ALLOWED_ORIGINS` env var (comma-separated) on the API host. Requests from
any other origin are rejected, so the endpoint cannot be used to spend your API
credit from an arbitrary page.

---

## Project structure

```
src/
├── app/
│   ├── api/chat/route.ts          # Chat endpoint — validation, timeouts, error mapping
│   ├── globals.css                # Design tokens (@theme), keyframes, reduced-motion
│   ├── layout.tsx                 # Root layout, fonts, metadata, persistent chat widget
│   └── page.tsx                   # Home — composes all sections
├── components/
│   ├── Hero.tsx                   # Full-screen hero, video slot + gradient fallback
│   ├── IntroSection.tsx           # Agency introduction
│   ├── Reveal.tsx                 # Reusable scroll-reveal wrapper
│   ├── SiteHeader.tsx             # Sticky nav with mobile menu
│   ├── SiteFooter.tsx
│   ├── booking/BookingSection.tsx # Booking form + validation
│   ├── chat/
│   │   ├── ChatWidget.tsx         # Floating concierge widget
│   │   └── TypingIndicator.tsx
│   ├── destinations/
│   │   ├── DestinationCard.tsx
│   │   ├── DestinationModal.tsx
│   │   └── DestinationsSection.tsx
│   └── quiz/QuizSection.tsx       # Quiz UI
├── data/destinations.ts           # Single source of truth for the three eras
└── lib/
    ├── ai/                        # Provider abstraction + concierge prompt
    └── quiz.ts                    # Pure scoring + rationale logic
```

---

## Replacing the placeholder images

All placeholder art is marked with `TODO: replace image` comments.

- **Destination images** — `src/data/destinations.ts`. Currently Unsplash URLs. To use local files, drop them in `public/images/`, change each `image` field to `/images/your-file.jpg`, and remove the `remotePatterns` block from `next.config.ts`.

---

## Hero video

The hero plays a continuous dolly shot that passes through all three catalogue
destinations in order — a gold transit corridor, Belle Époque Paris,
Renaissance Florence, then the Cretaceous forest.

| Asset                            | Size    | Notes                                       |
| -------------------------------- | ------- | ------------------------------------------- |
| `public/videos/hero.mp4`         | 2.45 MB | 1280×720, H.264, silent, faststart          |
| `public/videos/hero-mobile.mp4`  | 1.00 MB | 854×480, served under `(max-width: 768px)`  |
| `public/images/hero-poster.jpg`  | 69 KB   | Frame 0 of `hero.mp4`                       |

### Regenerating from a new master

The published files are derived from an 8 s source clip. Four things the
encode fixes, worth preserving if the footage is ever swapped:

1. **Seamless loop** — the tail is cross-faded back onto the clip's own opening
   frame, so `loop` wraps without a visible cut. The source cut hard from a
   bright forest to a dark corridor.
2. **Faststart** — the source carried its `moov` atom at the end of the file,
   forcing a full download before the first frame could paint.
3. **No audio track** — the hero is `muted`, so the AAC stream was dead weight.
4. **Cropped watermark** — a generator mark in the bottom-right corner is
   cropped out before rescaling back to 16:9.

```bash
# Requires ffmpeg on PATH. SRC is the source master.
SRC=source.mp4
FC="[0:v]crop=1232:693:0:0,scale=1280:720:flags=lanczos,split=2[s1][s2];\
[s1]trim=0:7.1,setpts=PTS-STARTPTS[body];\
[s2]trim=0:0.9,setpts=PTS-STARTPTS[head];\
[body][head]xfade=transition=fade:duration=0.9:offset=6.2[v]"

# 720p master
ffmpeg -i "$SRC" -filter_complex "$FC" -map "[v]" -an \
  -c:v libx264 -profile:v high -preset veryslow -crf 26 \
  -pix_fmt yuv420p -movflags +faststart -g 48 public/videos/hero.mp4

# 480p mobile cut
ffmpeg -i "$SRC" -filter_complex "$FC;[v]scale=854:480[vs]" -map "[vs]" -an \
  -c:v libx264 -profile:v high -preset veryslow -crf 28 \
  -pix_fmt yuv420p -movflags +faststart -g 48 public/videos/hero-mobile.mp4

# Poster = frame 0 of the encoded loop, so poster -> playback is invisible
ffmpeg -i public/videos/hero.mp4 -vf "select=eq(n\,0)" -vframes 1 -q:v 3 \
  public/images/hero-poster.jpg
```

### Legibility

The footage swings from ~60 to ~161 luma behind the headline, so the scrim in
`Hero.tsx` is tuned for the *bright* acts rather than the average. Compositing
the three scrim layers over every frame keeps the worst-case contrast at
9.4:1 for the headline, 4.5:1 for the CTA row, and 6.4:1 for the nav — all
above their WCAG thresholds. If you replace the footage, re-check those
numbers before trusting the existing scrim values.

Under `prefers-reduced-motion` the video is not mounted at all; the poster is
shown as a still background instead, so the composition is unchanged.

---

## AI tools used

In the interest of transparency:

- **Claude (Anthropic)** — used as a pair-programmer to scaffold the project, write the components and AI integration layer, author the destination brochure copy and concierge prompt, and produce this README.
- **Mistral AI** — the runtime LLM powering the concierge chat widget (`mistral-small-latest`).

All generated code was reviewed, and the build and lint pass cleanly.

---

## Credits

- **Framework** — [Next.js](https://nextjs.org/) by Vercel
- **Styling** — [Tailwind CSS](https://tailwindcss.com/)
- **Animation** — [Framer Motion](https://www.framer.com/motion/)
- **LLM API** — [Mistral AI](https://mistral.ai/)
- **Fonts** — [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) and [Inter](https://fonts.google.com/specimen/Inter), served via `next/font`
- **Placeholder photography** — [Unsplash](https://unsplash.com/), used under the [Unsplash License](https://unsplash.com/license). Replace before any commercial use.

Historical details in the destination copy are drawn from the 1889 Exposition Universelle, the Late Cretaceous of the North American interior, and Florence in 1504 — dramatised for a fictional brand.

---

## License

Provided as a portfolio demonstration. Replace the placeholder imagery before any commercial use.
