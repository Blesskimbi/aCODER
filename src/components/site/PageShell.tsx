import type { ReactNode } from "react";
import Link from "next/link";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { getRepoStats } from "@/lib/github";
import {
  Container,
  Section,
  Eyebrow,
  H2,
  Lead,
} from "@/components/ui/primitives";

/**
 * Nav + main + Footer, with the star count fetched once per page.
 *
 * Every content page shares this frame, so the GitHub call and the
 * `pt-24` offset under the fixed header live here rather than being
 * repeated 20-odd times.
 */
export async function PageShell({ children }: { children: ReactNode }) {
  const stats = await getRepoStats();
  return (
    <>
      <Nav stars={stats.stars} />
      <main id="main" className="pt-24">
        {children}
        <div className="h-24" />
      </main>
      <Footer stars={stats.stars} />
    </>
  );
}

/* ── Page header ───────────────────────────────────────────────────
   The eyebrow / heading / lead stack used at the top of every page,
   matching the existing /security and /changelog pages. */

export function PageHeader({
  eyebrow,
  title,
  lead,
  breadcrumb,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  breadcrumb?: { label: string; href: string };
  children?: ReactNode;
}) {
  return (
    <Section className="pb-10 pt-10">
      <Container>
        {breadcrumb && (
          <Link
            href={breadcrumb.href}
            className="mb-5 inline-flex items-center gap-1.5 font-mono text-[11px] text-white/50 transition-colors hover:text-white/80"
          >
            <span aria-hidden="true">←</span> {breadcrumb.label}
          </Link>
        )}
        <Eyebrow tone="ember">{eyebrow}</Eyebrow>
        <H2 className="mt-4">{title}</H2>
        {lead && <Lead className="mt-4">{lead}</Lead>}
        {children}
      </Container>
    </Section>
  );
}
