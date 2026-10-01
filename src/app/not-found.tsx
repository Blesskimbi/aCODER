import Link from "next/link";
import { Container, ButtonLink } from "@/components/ui/primitives";
import { LogoMark } from "@/components/site/LogoMark";
import { SITE } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center py-24">
      <Container className="text-center">
        <Link href="/" className="inline-block">
          <LogoMark size={44} className="mx-auto opacity-70" />
        </Link>

        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.22em] text-ember-400">
          404
        </p>

        <h1 className="mt-3 font-display text-[34px] font-light leading-[1.1] tracking-[-0.03em] text-steel-50 md:text-[44px]">
          No file at that path.
        </h1>

        <p className="mx-auto mt-4 max-w-[46ch] text-[14px] leading-relaxed text-white/55">
          The page you were after has moved or never existed. The editor is
          still right here.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/download" tone="ghost">
            Download
          </ButtonLink>
          <ButtonLink href={SITE.repoUrl} tone="ghost" external>
            GitHub
          </ButtonLink>
        </div>
      </Container>
    </main>
  );
}
