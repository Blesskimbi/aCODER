"use client";

import { useSyncExternalStore } from "react";
import type { PlatformId, OsGroup } from "./github";

export type Os = "mac" | "windows" | "linux" | "unknown";
export type Arch = "arm64" | "x64";

export interface DetectedSystemInfo {
  os: OsGroup;
  arch: Arch;
  platformId: PlatformId;
  label: string;
  installerFormat: string;
}

let cached: Os | null = null;
let cachedSystem: DetectedSystemInfo | null = null;

function detectSystemDetails(): DetectedSystemInfo {
  if (cachedSystem) return cachedSystem;

  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      os: "windows",
      arch: "x64",
      platformId: "win-x64",
      label: "Windows · x64",
      installerFormat: "exe",
    };
  }

  const ua = navigator.userAgent;
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ?? "";
  const s = `${platform} ${ua}`.toLowerCase();

  let os: OsGroup = "windows";
  let arch: Arch = "x64";

  if (/mac|iphone|ipad|ipod/.test(s)) {
    os = "mac";
    // Check if Apple Silicon vs Intel
    let isAppleSilicon = true;
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") ||
        (canvas.getContext(
          "experimental-webgl",
        ) as WebGLRenderingContext | null);
      if (gl) {
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          if (typeof renderer === "string" && /Intel/i.test(renderer)) {
            isAppleSilicon = false;
          }
        }
      }
    } catch {
      // Default to Apple Silicon (most modern Macs)
      isAppleSilicon = true;
    }
    arch = isAppleSilicon ? "arm64" : "x64";
  } else if (/win/.test(s)) {
    os = "windows";
    arch = /arm|arm64/i.test(s) ? "arm64" : "x64";
  } else if (/linux|android|x11/.test(s)) {
    os = "linux";
    arch = /aarch64|arm64/i.test(s) ? "arm64" : "x64";
  } else {
    // Sensible fallback
    os = "windows";
    arch = "x64";
  }

  let platformId: PlatformId = "win-x64";
  let label = "Windows · x64";
  let installerFormat = "exe";

  if (os === "mac") {
    if (arch === "arm64") {
      platformId = "mac-arm";
      label = "macOS · Apple Silicon";
    } else {
      platformId = "mac-intel";
      label = "macOS · Intel";
    }
    installerFormat = "dmg";
  } else if (os === "windows") {
    if (arch === "arm64") {
      platformId = "win-arm";
      label = "Windows · ARM64";
    } else {
      platformId = "win-x64";
      label = "Windows · x64";
    }
    installerFormat = "exe";
  } else {
    if (arch === "arm64") {
      platformId = "linux-arm";
      label = "Linux · ARM64";
    } else {
      platformId = "linux-x64";
      label = "Linux · x86_64";
    }
    installerFormat = "deb";
  }

  cachedSystem = {
    os,
    arch,
    platformId,
    label,
    installerFormat,
  };

  return cachedSystem;
}

function detect(): Os {
  if (cached) return cached;
  const sys = detectSystemDetails();
  cached = sys.os;
  return cached;
}

const noopSubscribe = () => () => {};

/** null until hydrated, so the server and client agree on first paint. */
export function useOs(): Os | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => detect(),
    () => null as Os | null,
  );
}

/** Provides complete detected system details once hydrated. */
export function useDetectedSystem(): DetectedSystemInfo | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => detectSystemDetails(),
    () => null,
  );
}

export const OS_LABEL: Record<Os, string> = {
  mac: "macOS",
  windows: "Windows",
  linux: "Linux",
  unknown: "your platform",
};

/** Directly trigger installer file download in browser without navigating to GitHub. */
export function triggerDirectDownload(url: string, filename?: string) {
  if (typeof window === "undefined") return;

  const a = document.createElement("a");
  a.href = url;
  if (filename) {
    a.setAttribute("download", filename);
  } else {
    a.setAttribute("download", "");
  }
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
  }, 100);
}
