/**
 * Resolves a `/public` path for the current deployment.
 *
 * `next/image` and `next/link` prepend `basePath` on their own, but plain
 * `<video>`, `<source>`, and CSS `url()` references do not — on the GitHub
 * Pages project page (served under `/Time-Travel-Agency`) those would resolve
 * against the domain root and 404. Anything that ships a raw asset URL to the
 * browser must go through this helper.
 *
 * The prefix has to be readable in the browser bundle, so it travels as a
 * `NEXT_PUBLIC_*` value set by `build:static` — `next.config.ts` keeps the
 * matching `basePath`, and the two must stay in sync.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (!BASE_PATH) return path;
  // Guard against a doubled prefix if a caller passes an already-resolved URL.
  if (path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
