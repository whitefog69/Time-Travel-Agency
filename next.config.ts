import type { NextConfig } from "next";

/**
 * The site is published to GitHub Pages at
 * https://whitefog69.github.io/Time-Travel-Agency/ — a project page, so every
 * asset and link lives under the `/Time-Travel-Agency` sub-path.
 *
 * `next dev` and `next start` should keep serving from the root, so the prefix
 * is applied only when the Pages workflow sets `GITHUB_PAGES=true`.
 */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/Time-Travel-Agency" : "";

const nextConfig: NextConfig = {
  // Everything below is scoped to the GitHub Pages build. A normal `next build`
  // is untouched, so Vercel keeps serving the app with its `/api/chat` route.
  ...(isGithubPages
    ? {
        // Emits a fully static site into `out/`.
        output: "export" as const,

        basePath,
        assetPrefix: basePath,

        /**
         * Raw asset URLs (the hero `<video>` sources and poster) are written by
         * hand, so they need the prefix at runtime. `env` inlines it into the
         * client bundle for `src/lib/asset.ts`; keep it equal to `basePath`.
         */
        env: { NEXT_PUBLIC_BASE_PATH: basePath },

        /**
         * `output: "export"` refuses to build a route handler. Narrowing the
         * page extensions to `.tsx` leaves `src/app/api/chat/route.ts`
         * unmatched, so it is skipped — the file stays in the repo and still
         * ships on any server-backed deploy.
         */
        pageExtensions: ["tsx"],

        // Pages serves plain files: `/about` only resolves if
        // `/about/index.html` exists, hence the trailing-slash layout.
        trailingSlash: true,
      }
    : {}),

  images: {
    /**
     * The Next.js image optimizer needs a server. The static export ships the
     * original URLs untouched; server deploys keep optimization enabled.
     */
    unoptimized: isGithubPages,
    /**
     * TODO: replace image — placeholder art is served from Unsplash. When you
     * swap in your own images, either move them into `/public` (and delete
     * this block) or replace the hostname with your own CDN.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
