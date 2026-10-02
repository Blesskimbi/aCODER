import { SITE, GITHUB_FALLBACK } from "./site";

/**
 * GitHub data, fetched at build time and revalidated hourly.
 * Every call degrades to the fallbacks in lib/site.ts — the page must
 * never fail to render because an unauthenticated API call was rate
 * limited.
 */

const REVALIDATE = 3600;

export interface RepoStats {
  stars: number;
  forks: number;
  openIssues: number;
  isLive: boolean;
}

export interface ReleaseAsset {
  name: string;
  url: string;
  size: number;
}

export interface Release {
  version: string;
  tag: string;
  publishedAt: string | null;
  url: string;
  body: string;
  assets: ReleaseAsset[];
}

/**
 * Optional build-time token.
 *
 * Unauthenticated GitHub allows 60 requests/hour per IP, which a shared
 * CI runner can exhaust before the build starts. When that happens every
 * call here returns null: stats fall back to the constants in site.ts and
 * `/changelog/[version]` prerenders no paths at all. Setting either
 * variable raises the limit to 5,000/hour and makes release pages
 * deterministic. Read-only `public_repo` scope is sufficient; no token is
 * required for the build to succeed.
 */
const TOKEN = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;

async function gh<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${SITE.repo}${path}`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getRepoStats(): Promise<RepoStats> {
  const data = await gh<{
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
  }>("");

  if (!data) {
    return {
      stars: GITHUB_FALLBACK.stars,
      forks: GITHUB_FALLBACK.forks,
      openIssues: 0,
      isLive: false,
    };
  }

  return {
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    isLive: true,
  };
}

interface RawRelease {
  tag_name: string;
  name: string | null;
  published_at: string | null;
  html_url: string;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
  assets: Array<{
    name: string;
    browser_download_url: string;
    size: number;
  }>;
}

function normalise(r: RawRelease): Release {
  return {
    // Tags follow the VS Code base version (1.99.3xxxx) while the
    // release title carries the A-Coder version. Show the title.
    version: r.name?.trim() || r.tag_name,
    tag: r.tag_name,
    publishedAt: r.published_at,
    url: r.html_url,
    body: r.body ?? "",
    assets: r.assets.map((a) => ({
      name: a.name,
      url: a.browser_download_url,
      size: a.size,
    })),
  };
}

/**
 * How many releases the site reads, everywhere.
 *
 * This is a cache-size limit, not an editorial one. Each release carries
 * ~57 assets, so the response is large: 15 releases is ~1.3 MB, 20 is
 * ~1.7 MB and 30 exceeds the 2 MB Next data-cache ceiling. Past that
 * ceiling nothing is cached, so every page that reads releases issues its
 * own request — which on an unauthenticated runner means 14-odd calls
 * against a 60/hour limit, and an empty changelog once it trips.
 *
 * Keeping one shared limit also keeps /changelog and /changelog/[version]
 * in agreement: every release listed on the index has a detail page.
 */
export const RELEASE_LIMIT = 15;

export async function getReleases(
  limit: number = RELEASE_LIMIT,
): Promise<Release[]> {
  const data = await gh<RawRelease[]>(`/releases?per_page=${limit}`);
  if (!Array.isArray(data)) return [];
  return data.filter((r) => !r.draft).map(normalise);
}

export async function getLatestRelease(): Promise<Release | null> {
  const releases = await getReleases(1);
  return releases[0] ?? null;
}

export interface Contributor {
  login: string;
  avatarUrl: string;
  htmlUrl: string;
  contributions: number;
}

export async function getContributors(limit = 12): Promise<Contributor[]> {
  const data = await gh<
    Array<{
      login: string;
      avatar_url: string;
      html_url: string;
      contributions: number;
      type: string;
    }>
  >(`/contributors?per_page=${limit}`);

  if (!Array.isArray(data)) return [];

  return data
    .filter((c) => c.type === "User")
    .map((c) => ({
      login: c.login,
      avatarUrl: c.avatar_url,
      htmlUrl: c.html_url,
      contributions: c.contributions,
    }));
}

/* ── Release asset → platform mapping ──────────────────────────────
   Formats are read from the live release rather than hard-coded; the
   project publishes .zip for macOS and .AppImage / .tar.gz for Linux,
   not the .dmg / .deb a spec sheet might lead you to expect. */

export type PlatformId =
  | "mac-arm"
  | "mac-intel"
  | "win-x64"
  | "win-arm"
  | "linux-x64"
  | "linux-arm";

export type OsGroup = "mac" | "windows" | "linux";

export interface PlatformDownload {
  id: PlatformId;
  os: OsGroup;
  label: string;
  /** Preferred installer. */
  asset: ReleaseAsset | null;
  checksum: ReleaseAsset | null;
  /** Other formats published for the same platform. */
  alternates: ReleaseAsset[];
}

/**
 * Matchers are ordered by preference — the first hit becomes the main
 * download and the rest are offered as alternates.
 *
 * Verified against the live release rather than assumed: macOS ships
 * .dmg *and* .zip, Linux ships .deb, .AppImage and .tar.gz, and
 * Windows currently publishes arm64 only. "reh" artefacts are remote
 * extension-host server builds, not the desktop app, so they are
 * excluded entirely.
 */
const MATCHERS: Array<{
  id: PlatformId;
  os: OsGroup;
  label: string;
  tests: RegExp[];
}> = [
  {
    id: "mac-arm",
    os: "mac",
    label: "macOS · Apple Silicon",
    tests: [/^A-Coder\.arm64\..*\.dmg$/i, /^A-Coder-darwin-arm64-.*\.zip$/i],
  },
  {
    id: "mac-intel",
    os: "mac",
    label: "macOS · Intel",
    tests: [/^A-Coder\.x64\..*\.dmg$/i, /^A-Coder-darwin-x64-.*\.zip$/i],
  },
  {
    id: "win-x64",
    os: "windows",
    label: "Windows · x64",
    tests: [/^A-CoderSetup-x64-.*\.exe$/i, /^A-Coder-win32-x64-.*\.zip$/i],
  },
  {
    id: "win-arm",
    os: "windows",
    label: "Windows · ARM64",
    tests: [/^A-CoderSetup-arm64-.*\.exe$/i, /^A-Coder-win32-arm64-.*\.zip$/i],
  },
  {
    id: "linux-x64",
    os: "linux",
    label: "Linux · x86_64",
    tests: [
      /^a-coder_.*_amd64\.deb$/i,
      /x86_64\.AppImage$/i,
      /^A-Coder-linux-x64-.*\.tar\.gz$/i,
    ],
  },
  {
    id: "linux-arm",
    os: "linux",
    label: "Linux · ARM64",
    tests: [/^a-coder_.*_arm64\.deb$/i, /^A-Coder-linux-arm64-.*\.tar\.gz$/i],
  },
];

const isRemoteHost = (name: string) => /(^|[-_])reh([-_]|$)/i.test(name);

export function mapPlatforms(release: Release | null): PlatformDownload[] {
  const assets = (release?.assets ?? []).filter(
    (a) =>
      !isRemoteHost(a.name) &&
      !/\.(sha1|sha256|zsync)$/i.test(a.name),
  );

  return MATCHERS.map(({ id, os, label, tests }) => {
    const matched = tests
      .map((t) => assets.find((a) => t.test(a.name)))
      .filter((a): a is ReleaseAsset => Boolean(a));

    const [asset = null, ...alternates] = matched;
    const checksum = asset
      ? (release?.assets.find((a) => a.name === `${asset.name}.sha256`) ?? null)
      : null;

    return { id, os, label, asset, checksum, alternates };
  });
}

/** File extension, for labelling a download button. */
export function assetFormat(name: string): string {
  const m = name.match(/\.(dmg|exe|deb|AppImage|zip|tar\.gz)$/i);
  return m ? m[1].toLowerCase().replace("tar.gz", "tar.gz") : "";
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return "—";
  const mb = bytes / 1024 / 1024;
  if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
  return `${Math.round(mb)} MB`;
}

/**
 * URL segment for a release.
 *
 * Releases are addressed by *title* (the A-Coder version, e.g. "1.9.15")
 * rather than tag, because tags carry the VS Code base version and mean
 * nothing to a reader. Titles may contain characters that do not belong
 * in a path, so they are slugged.
 */
export const releaseSlug = (version: string) =>
  version
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Match a release by its slugged title, falling back to the raw tag. */
export const findRelease = (releases: Release[], key: string) =>
  releases.find((r) => releaseSlug(r.version) === key || r.tag === key);
