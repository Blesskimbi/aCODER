import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { DownloadPicker } from "@/components/sections/DownloadPicker";
import { Container, Section, Eyebrow, H2, Lead } from "@/components/ui/primitives";
import { CopyCommand } from "@/components/site/CopyCommand";
import {
  getRepoStats,
  getLatestRelease,
  mapPlatforms,
} from "@/lib/github";
import { GITHUB_FALLBACK, INSTALL, SITE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Download",
  description:
    "Download A-Coder IDE for macOS, Windows or Linux, or install it with a single command. Free and open source under Apache-2.0.",
};

export default async function DownloadPage() {
  const [stats, release] = await Promise.all([
    getRepoStats(),
    getLatestRelease(),
  ]);

  const version = release?.version ?? GITHUB_FALLBACK.latestVersion;
  const platforms = mapPlatforms(release);

  return (
    <>
      <Nav stars={stats.stars} />
      <main id="main" className="pt-24">
        <Section className="pb-12 pt-10">
          <Container>
            <Eyebrow tone="ember">Download · v{version}</Eyebrow>
            <H2 className="mt-4">Get A-Coder.</H2>
            <Lead className="mt-4">
              Free and open source under Apache-2.0. Bring your own API key, or
              run everything locally. No account required.
            </Lead>
          </Container>
        </Section>

        <Container>
          <DownloadPicker platforms={platforms} version={version} />

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-[15px] font-medium text-steel-50">
                Install from the terminal
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/55">
                The script detects your platform and fetches the right build.
              </p>
              <div className="mt-4 space-y-3">
                <CopyCommand command={INSTALL.unix} label="macOS / Linux" />
                <CopyCommand command={INSTALL.windows} label="Windows" />
              </div>
            </div>

            <div>
              <h3 className="text-[15px] font-medium text-steel-50">
                Integrity
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/55">
                Every artefact is published with SHA-1 and SHA-256 companions.
                Verify your download against the checksum listed beside it on
                the release page before you run it.
              </p>
              <a
                href={SITE.releasesUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-4 inline-block text-[13px] text-ember-300 underline-offset-4 hover:underline"
              >
                All releases and checksums on GitHub →
              </a>
            </div>
          </div>
        </Container>

        <div className="h-24" />
      </main>
      <Footer stars={stats.stars} />
    </>
  );
}
