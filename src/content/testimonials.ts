/**
 * DEMO CONTENT — not real testimonials.
 *
 * Every entry is a placeholder so the section's layout can be reviewed
 * with realistic text lengths. Names, roles and companies are generic
 * on purpose and no quote is attributed to a real person. Replace each
 * entry with a genuine quote (and set `isPlaceholder: false`) before
 * launch; the section renders a visible "Sample content" badge for as
 * long as any placeholder remains.
 */

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  /** Null renders initials rather than a fake photo. */
  avatar: string | null;
  quote: string;
  sourceUrl: string | null;
  isPlaceholder: boolean;
  /** Featured quotes render larger, at the top of the section. */
  featured?: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Reviewer Name",
    role: "Staff Engineer",
    company: "Company",
    avatar: null,
    quote:
      "[Placeholder — a longer, featured quote goes here. Roughly this length: two or three sentences describing the reviewer's before-and-after, ideally naming the specific thing that changed about their day.]",
    sourceUrl: null,
    isPlaceholder: true,
    featured: true,
  },
  {
    name: "Reviewer Name",
    role: "Open Source Maintainer",
    company: "Project",
    avatar: null,
    quote:
      "[Placeholder — a second featured quote, similar length, ideally from a different kind of user so the two read as contrasting perspectives rather than the same voice twice.]",
    sourceUrl: null,
    isPlaceholder: true,
    featured: true,
  },
  {
    name: "Reviewer Name",
    role: "Backend Developer",
    company: "Company",
    avatar: null,
    quote:
      "[Placeholder — short quote, one or two lines. Best used for a single sharp point.]",
    sourceUrl: null,
    isPlaceholder: true,
  },
  {
    name: "Reviewer Name",
    role: "Computer Science Student",
    company: "University",
    avatar: null,
    quote:
      "[Placeholder — a quote about Learn mode would sit well here, from a student or someone early in their career.]",
    sourceUrl: null,
    isPlaceholder: true,
  },
  {
    name: "Reviewer Name",
    role: "Platform Engineer",
    company: "Company",
    avatar: null,
    quote:
      "[Placeholder — a quote about running local models or the privacy architecture belongs in this slot.]",
    sourceUrl: null,
    isPlaceholder: true,
  },
  {
    name: "Reviewer Name",
    role: "Tech Lead",
    company: "Company",
    avatar: null,
    quote:
      "[Placeholder — a short quote about migrating a team across from another editor.]",
    sourceUrl: null,
    isPlaceholder: true,
  },
];

export const hasPlaceholders = TESTIMONIALS.some((t) => t.isPlaceholder);

/** Initials for the avatar fallback, so no fake photos are shipped. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
