import { Container, Section, Eyebrow, H2, Lead } from "@/components/ui/primitives";
import { FAQS } from "@/content/product";

export function Faq() {
  return (
    <Section id="faq">
      <Container>
        {/* Heading centred at the top, accordion centred beneath it. */}
        <div className="mx-auto max-w-[62ch] text-center">
          <Eyebrow tone="ember">FAQ</Eyebrow>
          <H2 className="mt-4">Straight answers.</H2>
          <Lead className="mx-auto mt-4">
            The questions worth asking before you install another editor.
          </Lead>
        </div>

        <div className="mx-auto mt-12 max-w-[760px] divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left text-[14.5px] text-steel-50 marker:hidden">
                {f.q}
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-white/50 transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-left text-[13.5px] leading-relaxed text-white/60">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
