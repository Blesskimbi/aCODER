/**
 * Workshops.
 *
 * Empty on purpose, for the same reason as the blog: the project runs no
 * workshops that the repo or its community pages record, and inventing a
 * schedule would mean inventing dates, hosts and sign-up links.
 *
 * The route and its machinery are complete — add an entry to WORKSHOPS
 * and the index, detail page, static params and sitemap all pick it up.
 */

export interface Workshop {
  slug: string;
  title: string;
  summary: string;
  /** ISO date, or null for a self-paced session with no fixed date. */
  date: string | null;
  /** e.g. "90 minutes". */
  duration?: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All levels";
  host?: string;
  /** Where it runs — a URL, or a place. */
  location?: string;
  /** Sign-up destination. */
  registerUrl?: string;
  /** What someone will be able to do afterwards. */
  outcomes: string[];
  body: string[];
}

export const WORKSHOPS: Workshop[] = [];

export const getWorkshop = (slug: string) =>
  WORKSHOPS.find((w) => w.slug === slug);

export const upcoming = () =>
  WORKSHOPS.filter((w) => w.date && new Date(w.date) >= new Date()).sort(
    (a, b) => (a.date ?? "").localeCompare(b.date ?? ""),
  );

export const past = () =>
  WORKSHOPS.filter((w) => w.date && new Date(w.date) < new Date()).sort(
    (a, b) => (b.date ?? "").localeCompare(a.date ?? ""),
  );

export const selfPaced = () => WORKSHOPS.filter((w) => !w.date);
