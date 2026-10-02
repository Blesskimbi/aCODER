import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Badge, ButtonLink } from "@/components/ui/primitives";
import { Prose } from "@/components/ui/blocks";
import { WORKSHOPS, getWorkshop } from "@/content/workshops";

export const revalidate = 3600;

export function generateStaticParams() {
  return WORKSHOPS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const w = getWorkshop(slug);
  if (!w) return { title: "Workshop not found" };
  return { title: w.title, description: w.summary };
}

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));

export default async function WorkshopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const w = getWorkshop(slug);
  if (!w) notFound();

  return (
    <PageShell>
      <PageHeader
        eyebrow={w.date ? fmt(w.date) : "Self-paced"}
        title={w.title}
        lead={w.summary}
        breadcrumb={{ label: "All workshops", href: "/workshops" }}
      >
        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <Badge tone="ember">{w.level}</Badge>
          {w.duration && <Badge>{w.duration}</Badge>}
          {w.host && (
            <span className="text-[13px] text-white/60">with {w.host}</span>
          )}
        </div>

        {w.registerUrl && (
          <div className="mt-7">
            <ButtonLink href={w.registerUrl} external size="lg">
              Register
            </ButtonLink>
          </div>
        )}
      </PageHeader>

      <Container className="max-w-[820px]">
        {w.outcomes.length > 0 && (
          <section className="mb-12">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
              What you will be able to do afterwards
            </h2>
            <ul className="mt-5 space-y-2.5">
              {w.outcomes.map((o) => (
                <li key={o} className="flex gap-2.5 text-[13.5px] leading-relaxed">
                  <Check
                    aria-hidden="true"
                    className="mt-[3px] h-3.5 w-3.5 shrink-0 text-success"
                  />
                  <span className="text-white/65">{o}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Prose>
          {w.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Prose>

        {w.location && (
          <p className="mt-10 border-t border-white/[0.07] pt-5 text-[12.5px] text-white/52">
            Where: {w.location}
          </p>
        )}
      </Container>
    </PageShell>
  );
}
