import { NextRequest, NextResponse } from "next/server";
import {
  getLatestRelease,
  getReleases,
  mapPlatforms,
  getPlatformForOs,
  FALLBACK_PLATFORM_ASSETS,
  type PlatformId,
  type OsGroup,
} from "@/lib/github";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const requestedPlatform = searchParams.get("platform") as PlatformId | null;
  const requestedOs = searchParams.get("os") as OsGroup | null;

  // Fetch recent releases to find live assets with fallback
  let downloadUrl: string | null = null;

  try {
    const [latest, recent] = await Promise.all([
      getLatestRelease(),
      getReleases(3),
    ]);
    const platforms = mapPlatforms(latest, recent);

    if (requestedPlatform) {
      const match = platforms.find((p) => p.id === requestedPlatform);
      if (match?.asset?.url) {
        downloadUrl = match.asset.url;
      }
    }

    if (!downloadUrl && requestedOs) {
      const match = getPlatformForOs(platforms, requestedOs);
      if (match?.asset?.url) {
        downloadUrl = match.asset.url;
      }
    }

    if (!downloadUrl) {
      // Detect from user-agent
      const ua = (request.headers.get("user-agent") ?? "").toLowerCase();
      let detectedOs: OsGroup = "windows";
      let arch: "arm64" | "x64" = "x64";

      if (/mac|iphone|ipad|ipod/.test(ua)) {
        detectedOs = "mac";
        arch = /arm|arm64/.test(ua) ? "arm64" : "arm64"; // Default mac to Apple Silicon
      } else if (/win/.test(ua)) {
        detectedOs = "windows";
        arch = /arm|arm64/.test(ua) ? "arm64" : "x64";
      } else if (/linux|android|x11/.test(ua)) {
        detectedOs = "linux";
        arch = /arm|arm64|aarch64/.test(ua) ? "arm64" : "x64";
      }

      const match = getPlatformForOs(platforms, detectedOs, arch);
      if (match?.asset?.url) {
        downloadUrl = match.asset.url;
      }
    }
  } catch (err) {
    console.error("Error resolving download release:", err);
  }

  // Fallback to static verified direct URLs if needed
  if (!downloadUrl) {
    if (requestedPlatform && FALLBACK_PLATFORM_ASSETS[requestedPlatform]) {
      downloadUrl = FALLBACK_PLATFORM_ASSETS[requestedPlatform].url;
    } else if (requestedOs === "mac") {
      downloadUrl = FALLBACK_PLATFORM_ASSETS["mac-arm"].url;
    } else if (requestedOs === "linux") {
      downloadUrl = FALLBACK_PLATFORM_ASSETS["linux-x64"].url;
    } else {
      downloadUrl = FALLBACK_PLATFORM_ASSETS["win-x64"].url;
    }
  }

  return NextResponse.redirect(downloadUrl, { status: 302 });
}
