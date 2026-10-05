"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowRight,
  GitBranch,
  Download,
  ChevronDown,
  Terminal,
  Check,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { Container, ButtonLink, cx } from "@/components/ui/primitives";
import { CopyCommand } from "@/components/site/CopyCommand";
import { IdeMockup } from "@/components/mockups/IdeMockup";
import { MODES } from "@/content/product";
import { INSTALL, SITE } from "@/lib/site";
import { useDetectedSystem, useOs, OS_LABEL } from "@/lib/useOs";
import {
  PlatformIcon,
  AppleIcon,
  WindowsIcon,
  LinuxIcon,
} from "@/components/ui/platform-icons";
import {
  assetFormat,
  formatBytes,
  getPlatformForOs,
  getFallbackPlatforms,
  type PlatformDownload,
} from "@/lib/github";
import { DownloadFeedbackModal } from "@/components/site/DownloadFeedbackModal";

const AsciiRenderer = dynamic(
  () => import("@/components/ui/ascii-renderer").then((m) => m.AsciiRenderer),
  { ssr: false },
);

export function Hero({
  stars,
  version,
  platforms,
}: {
  stars: number;
  version: string;
  platforms?: PlatformDownload[];
}) {
  const os = useOs();
  const detected = useDetectedSystem();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalPlatform, setModalPlatform] = useState<PlatformDownload | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const platformsList =
    platforms && platforms.length > 0 ? platforms : getFallbackPlatforms();

  // Target platform for detected OS
  const activeOs = detected?.os ?? (os === "mac" || os === "linux" ? os : "windows");
  const targetPlatform = getPlatformForOs(
    platformsList,
    activeOs,
    detected?.arch ?? "x64",
  );
  const asset = targetPlatform?.asset;

  // Active terminal command based on detected OS
  const [commandTab, setCommandTab] = useState<"auto" | "windows" | "unix">("auto");
  const activeCommandType =
    commandTab === "auto"
      ? activeOs === "windows"
        ? "windows"
        : "unix"
      : commandTab;
  const command =
    activeCommandType === "windows" ? INSTALL.windows : INSTALL.unix;

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!dropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [dropdownOpen]);

  const handleDownload = (e: React.MouseEvent, p: PlatformDownload) => {
    setModalPlatform(p);
    setIsModalOpen(true);
    setDropdownOpen(false);
  };

  return (
    <section className="relative isolate overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <DownloadFeedbackModal
        platform={modalPlatform}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        version={version}
      />

      {/* Background gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(760px_circle_at_18%_-8%,rgba(255,255,255,0.07),transparent_62%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[120px] h-[420px] w-[820px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(255,138,76,0.07),transparent)] blur-2xl"
      />

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
          <div className="stagger">
            <h1 className="font-display text-[40px] font-light leading-[1.06] tracking-[-0.03em] text-steel-50 md:text-[56px] lg:text-[62px]">
              Your true{" "}
              <span className="whitespace-nowrap bg-gradient-to-r from-steel-50 via-steel-300 to-ember-400 bg-clip-text text-transparent">
                open source
              </span>
              <br />
              AI IDE.
            </h1>

            <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-white/60">
              Chat, Plan, Agent and Learn — four modes in one editor built on
              VS&nbsp;Code. Your keys, your machine, straight to the provider.
              No relay, no subscription, no lock-in.
            </p>

            {/* Main Action CTAs — z-30 ensures dropdown floats above following content */}
            <div className="relative z-30 mt-8 flex flex-wrap items-center gap-3">
              {/* Primary Direct Download Group */}
              <div
                ref={dropdownRef}
                className={cx(
                  "relative inline-flex rounded-xl shadow-lg shadow-ember-500/10 transition-all",
                  dropdownOpen ? "z-50" : "z-20",
                )}
              >
                <a
                  href={asset?.url || "/api/download"}
                  download={asset?.name}
                  onClick={(e) => handleDownload(e, targetPlatform)}
                  className="inline-flex h-12 items-center gap-2.5 rounded-l-xl bg-gradient-to-r from-ember-400 to-amber-400 px-5 text-sm font-semibold text-[#251004] transition-all duration-200 hover:from-ember-300 hover:to-amber-300 hover:-translate-y-px"
                >
                  <Download className="h-4 w-4" />
                  <span>Download for {OS_LABEL[activeOs]}</span>
                  {asset && (
                    <span className="rounded bg-black/15 px-1.5 py-0.5 font-mono text-[10.5px]">
                      .{assetFormat(asset.name)}
                    </span>
                  )}
                </a>

                {/* Dropdown Toggle for other platforms */}
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                  aria-label="Select alternative platform download"
                  className="inline-flex h-12 items-center justify-center rounded-r-xl border-l border-black/15 bg-amber-400 px-3 text-[#251004] transition-colors hover:bg-amber-300"
                >
                  <ChevronDown
                    className={cx(
                      "h-4 w-4 transition-transform duration-200",
                      dropdownOpen && "rotate-180",
                    )}
                  />
                </button>

                {/* Dropdown Menu — Rich frosted glass surface in front */}
                {dropdownOpen && (
                  <div
                    className="glass-menu absolute left-0 top-full z-50 mt-2.5 w-80 rounded-2xl p-2.5 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3 py-1.5 text-[10.5px] font-mono uppercase tracking-wider text-white/50">
                      Direct Downloads
                    </div>
                    <div className="space-y-1">
                      {platformsList.map((p) => {
                        if (!p.asset) return null;
                        const isCurrent = p.id === targetPlatform?.id;
                        return (
                          <a
                            key={p.id}
                            href={p.asset.url}
                            download={p.asset.name}
                            onClick={(e) => handleDownload(e, p)}
                            className={cx(
                              "flex items-center justify-between rounded-xl px-3 py-2.5 text-xs transition-colors",
                              isCurrent
                                ? "bg-ember-500/15 text-ember-300 font-medium border border-ember-500/30"
                                : "text-white/85 hover:bg-white/[0.08] hover:text-white",
                            )}
                          >
                            <div className="flex items-center gap-2.5">
                              <PlatformIcon os={p.os} className="h-4 w-4" />
                              <span className="font-medium">{p.label}</span>
                            </div>
                            <span className="font-mono text-[10.5px] text-white/50">
                              .{assetFormat(p.asset.name)}
                            </span>
                          </a>
                        );
                      })}
                    </div>

                    <div className="my-1.5 border-t border-white/10" />

                    <Link
                      href="/download"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs text-white/70 hover:bg-white/[0.08] hover:text-white transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-ember-400" />
                        <span>All packages &amp; checksums</span>
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-white/40" />
                    </Link>
                  </div>
                )}
              </div>

              {/* View Source CTA */}
              <ButtonLink
                href={SITE.repoUrl}
                tone="ghost"
                size="lg"
                external
              >
                <GitBranch className="h-4 w-4" />
                View source · {stars}
              </ButtonLink>
            </div>

            {/* Terminal Command Box with dynamic toggle — relative z-10 ensures it stays beneath the dropdown */}
            <div className="relative z-10 mt-6 max-w-[540px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-white/50">
                  Or install via terminal:
                </span>
                <div className="inline-flex rounded-lg border border-white/10 bg-white/[0.02] p-0.5 text-[11px] font-mono">
                  <button
                    onClick={() => setCommandTab("windows")}
                    className={cx(
                      "px-2.5 py-0.5 rounded transition-colors",
                      activeCommandType === "windows"
                        ? "bg-white/[0.12] text-white font-medium"
                        : "text-white/50 hover:text-white/80",
                    )}
                  >
                    Windows
                  </button>
                  <button
                    onClick={() => setCommandTab("unix")}
                    className={cx(
                      "px-2.5 py-0.5 rounded transition-colors",
                      activeCommandType === "unix"
                        ? "bg-white/[0.12] text-white font-medium"
                        : "text-white/50 hover:text-white/80",
                    )}
                  >
                    macOS / Linux
                  </button>
                </div>
              </div>

              <CopyCommand
                command={command}
                label={activeCommandType === "windows" ? "PS>" : "$"}
              />
              <p className="mt-2.5 font-mono text-[11px] text-white/50">
                Direct installer · Bring your own key or run local models (Ollama, LM Studio)
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
            <div className="relative h-[420px] w-full lg:h-[480px]">
              <AsciiRenderer />
            </div>
          </div>
        </div>

        <div className="relative mt-16 md:mt-20">
          <IdeMockup mode={MODES[2]} />
        </div>
      </Container>
    </section>
  );
}
