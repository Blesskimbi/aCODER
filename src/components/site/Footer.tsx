import Link from "next/link";
import { GitBranch, Star } from "lucide-react";
import { SITE, GITHUB_FALLBACK } from "@/lib/site";
import { LogoMark } from "./LogoMark";
import { Container } from "@/components/ui/primitives";
import { FooterWordmark } from "@/components/footer/FooterWordmark";

const g = (p: string) => `${SITE.docsUrl}/${p}`;

/* Only real destinations. A "Community" column was specified but the
   repo has no public community link other than a referral URL on its
   homepage field, so it is left out rather than filled with guesses. */
const COLUMNS: Array<{
  title: string;
  links: Array<{ label: string; href: string; external?: boolean }>;
}> = [
  {
    title: "Product",
    links: [
      { label: "Download", href: "/download" },
      { label: "Changelog", href: "/changelog" },
      { label: "Pricing", href: "/pricing" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      {
        label: "Getting started",
        href: g("user-guide/getting-started.md"),
        external: true,
      },
      {
        label: "Keyboard shortcuts",
        href: g("user-guide/keyboard-shortcuts.md"),
        external: true,
      },
      {
        label: "Providers & models",
        href: g("user-guide/providers-and-models.md"),
        external: true,
      },
    ],
  },
  {
    title: "Open source",
    links: [
      { label: "GitHub", href: SITE.repoUrl, external: true },
      { label: "Releases", href: SITE.releasesUrl, external: true },
      { label: "Issues", href: SITE.issuesUrl, external: true },
      {
        label: "Contributing",
        href: g("HOW_TO_CONTRIBUTE.md"),
        external: true,
      },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Licence (Apache-2.0)", href: SITE.licenceUrl, external: true },
      {
        label: "Third-party notices",
        href: `https://github.com/${SITE.repo}/blob/main/ThirdPartyNotices.txt`,
        external: true,
      },
      {
        label: "VS Code licence",
        href: `https://github.com/${SITE.repo}/blob/main/LICENSE-VS-Code.txt`,
        external: true,
      },
    ],
  },
];

export function Footer({ stars }: { stars?: number }) {
  const starCount = stars ?? GITHUB_FALLBACK.stars;

  return (
    <footer className="relative mt-24">
      {/* Decorative. The readable A-Coder link is in the body below. */}
      <Container>
        <FooterWordmark />
      </Container>

      <Container className="pb-16 pt-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5 text-[15px] font-medium text-steel-50"
            >
              <LogoMark size={22} />
              A-Coder
            </Link>
            <p className="mt-3 max-w-[30ch] text-[13px] leading-relaxed text-white/55">
              {SITE.tagline}. Open source under Apache-2.0.
            </p>

            {/* No public status page exists, so this is the live repo
                signal rather than an invented "all systems operational". */}
            <a
              href={SITE.repoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/70 transition-colors hover:border-white/20 hover:text-white"
            >
              <GitBranch className="h-3.5 w-3.5" />
              <span className="tnum">{starCount}</span>
              <Star className="h-3 w-3 fill-current" />
              <span className="text-white/45">on GitHub</span>
            </a>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/58">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-[13px] text-white/60 transition-colors hover:text-white/95"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="text-[13px] text-white/60 transition-colors hover:text-white/95"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/[0.07] pt-6 text-[12.5px] text-white/62 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Built on{" "}
            <a
              href="https://github.com/microsoft/vscode"
              target="_blank"
              rel="noreferrer noopener"
              className="text-white/75 underline-offset-4 hover:underline"
            >
              VS Code
            </a>{" "}
            and{" "}
            <a
              href="https://github.com/voideditor/void"
              target="_blank"
              rel="noreferrer noopener"
              className="text-white/75 underline-offset-4 hover:underline"
            >
              Void
            </a>
            .
          </p>
          <p>Apache-2.0 · Bring your own key</p>
        </div>
      </Container>
    </footer>
  );
}
