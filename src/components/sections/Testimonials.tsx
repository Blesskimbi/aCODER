import {
  Container,
  Section,
  Eyebrow,
  H2,
  Lead,
  Card,
  Badge,
  cx,
} from "@/components/ui/primitives";
import {
  TESTIMONIALS,
  hasPlaceholders,
  initials,
  type Testimonial,
} from "@/content/testimonials";
import { SHOW_TESTIMONIALS } from "@/lib/site";

/**
 * Layout demo. Every quote is a labelled placeholder — nothing here is
 * a real endorsement, and the badge stays visible while any placeholder
 * remains. Controlled by SHOW_TESTIMONIALS in lib/site.ts.
 */

function Avatar({ name, size }: { name: string; size: "sm" | "lg" }) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        "flex shrink-0 items-center justify-center rounded-full bg-white/[0.06] font-mono text-white/58 ring-1 ring-white/10",
        size === "lg" ? "h-10 w-10 text-[12px]" : "h-8 w-8 text-[11px]",
      )}
    >
      {initials(name)}
    </div>
  );
}

function Attribution({
  t,
  size,
}: {
  t: Testimonial;
  size: "sm" | "lg";
}) {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={t.name} size={size} />
      <div className="min-w-0">
        <p
          className={cx(
            "truncate text-white/70",
            size === "lg" ? "text-[13px]" : "text-[12.5px]",
          )}
        >
          {t.name}
        </p>
        <p className="font-mono text-[10.5px] leading-snug text-white/62">
          {t.role} · {t.company}
        </p>
      </div>
    </div>
  );
}

export function Testimonials() {
  if (!SHOW_TESTIMONIALS) return null;

  const featured = TESTIMONIALS.filter((t) => t.featured);
  const rest = TESTIMONIALS.filter((t) => !t.featured);

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-[62ch] text-center">
          <Eyebrow tone="ember">Testimonials</Eyebrow>
          <H2 className="mt-4">What developers say.</H2>
          <Lead className="mx-auto mt-4">
            Real quotes from people using A-Coder in their own work.
          </Lead>

          {hasPlaceholders && (
            <div className="mt-5 flex justify-center">
              <Badge tone="warning">
                Sample content · replace before launch
              </Badge>
            </div>
          )}
        </div>

        {/* Two featured quotes, set larger. */}
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {featured.map((t, i) => (
            <Card key={`f-${i}`} glow className="flex flex-col p-7">
              <p className="flex-1 font-display text-[17px] font-light leading-[1.6] tracking-[-0.01em] text-white/72">
                {t.quote}
              </p>
              <div className="mt-6 border-t border-white/[0.06] pt-5">
                <Attribution t={t} size="lg" />
              </div>
            </Card>
          ))}
        </div>

        {/* Smaller supporting cards. */}
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {rest.map((t, i) => (
            <Card key={`r-${i}`} className="flex flex-col p-5">
              <p className="flex-1 text-[13px] leading-relaxed text-white/58">
                {t.quote}
              </p>
              <div className="mt-5 border-t border-white/[0.06] pt-4">
                <Attribution t={t} size="sm" />
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
