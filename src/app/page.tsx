import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/sections/Hero";
import { ProviderMarquee } from "@/components/sections/Providers";
import { Modes } from "@/components/sections/Modes";
import { Bento } from "@/components/sections/Bento";
import { StudentMode } from "@/components/sections/StudentMode";
import { Privacy } from "@/components/sections/Privacy";
import { Migration } from "@/components/sections/Migration";
import { Comparison } from "@/components/sections/Comparison";
import { Testimonials } from "@/components/sections/Testimonials";
import { OpenSource } from "@/components/sections/OpenSource";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hairline } from "@/components/ui/primitives";
import {
  getRepoStats,
  getLatestRelease,
  getContributors,
} from "@/lib/github";
import { GITHUB_FALLBACK } from "@/lib/site";

export const revalidate = 3600;

export default async function HomePage() {
  const [stats, release, contributors] = await Promise.all([
    getRepoStats(),
    getLatestRelease(),
    getContributors(),
  ]);

  const version = release?.version ?? GITHUB_FALLBACK.latestVersion;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "A-Coder IDE",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Windows, Linux",
    softwareVersion: version,
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
    description:
      "An open-source, AI-native code editor built on VS Code with Chat, Plan, Agent and Learn modes, direct-to-provider model access and first-class local model support.",
    url: "https://a-coder.dev",
    codeRepository: "https://github.com/hamishfromatech/A-Coder",
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Serialised from a literal above — no user input reaches this.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav stars={stats.stars} />
      <main id="main">
        <Hero stars={stats.stars} version={version} />
        <ProviderMarquee />
        <Modes />
        <Hairline />
        <Bento />
        <Hairline />
        <StudentMode />
        <Hairline />
        <Privacy />
        <Migration />
        <Hairline />
        <Comparison />
        <Testimonials />
        <Hairline />
        <OpenSource
          stats={stats}
          contributors={contributors}
          version={version}
          publishedAt={release?.publishedAt ?? null}
        />
        <Hairline />
        <Faq />
        <FinalCta />
      </main>
      <Footer stars={stats.stars} />
    </>
  );
}
