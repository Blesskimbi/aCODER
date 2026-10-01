"use client";

import { useSyncExternalStore } from "react";

export type Os = "mac" | "windows" | "linux" | "unknown";

let cached: Os | null = null;

function detect(): Os {
  if (cached) return cached;
  const ua = navigator.userAgent;
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ?? "";
  const s = `${platform} ${ua}`.toLowerCase();

  if (/mac|iphone|ipad|ipod/.test(s)) cached = "mac";
  else if (/win/.test(s)) cached = "windows";
  else if (/linux|android|x11/.test(s)) cached = "linux";
  else cached = "unknown";

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

export const OS_LABEL: Record<Os, string> = {
  mac: "macOS",
  windows: "Windows",
  linux: "Linux",
  unknown: "your platform",
};
