"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  ShieldCheck,
  Terminal,
  Check,
  Copy,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  Laptop,
} from "lucide-react";
import { Card, cx, ExtArrow } from "@/components/ui/primitives";
import { PlatformIcon, AppleIcon, WindowsIcon, LinuxIcon } from "@/components/ui/platform-icons";
import {
  assetFormat,
  formatBytes,
  type PlatformDownload,
  type OsGroup,
} from "@/lib/github";
import { useDetectedSystem, triggerDirectDownload } from "@/lib/useOs";
import { DownloadFeedbackModal } from "@/components/site/DownloadFeedbackModal";
import { INSTALL, SITE } from "@/lib/site";

export function DownloadPicker({
  platforms,
  version,
}: {
  platforms: PlatformDownload[];
  version: string;
}) {
  const detected = useDetectedSystem();
  const [selectedOs, setSelectedOs] = useState<OsGroup | "all">("windows");
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [modalPlatform, setModalPlatform] = useState<PlatformDownload | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync selected tab with detected OS on client hydration
  useEffect(() => {
    if (detected?.os) {
      setSelectedOs(detected.os);
    }
  }, [detected?.os]);

  const activeOs: OsGroup = selectedOs === "all" ? (detected?.os ?? "windows") : selectedOs;

  // Filter platforms for current view
  const currentPlatforms =
    selectedOs === "all"
      ? platforms
      : platforms.filter((p) => p.os === selectedOs);

  // Find the primary recommended platform download for active OS
  const primaryPlatform =
    currentPlatforms.find((p) => {
      if (activeOs === "mac") {
        return detected?.arch === "x64" ? p.id === "mac-intel" : p.id === "mac-arm";
      }
      if (activeOs === "windows") {
        return detected?.arch === "arm64" ? p.id === "win-arm" : p.id === "win-x64";
      }
      return detected?.arch === "arm64" ? p.id === "linux-arm" : p.id === "linux-x64";
    }) ??
    currentPlatforms[0] ??
    platforms[0];

  const terminalCommand =
    activeOs === "windows" ? INSTALL.windows : INSTALL.unix;

  const handleDownloadClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    p: PlatformDownload,
  ) => {
    if (!p.asset?.url) return;
    // Let browser start download via href/download attribute, and open feedback modal
    setModalPlatform(p);
    setIsModalOpen(true);
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(terminalCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="space-y-10">
      <DownloadFeedbackModal
        platform={modalPlatform}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        version={version}
      />

      {/* OS Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
        <div
          role="tablist"
          aria-label="Filter installers by operating system"
          className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-sm self-start"
        >
          <button
            role="tab"
            aria-selected={selectedOs === "mac"}
            onClick={() => setSelectedOs("mac")}
            className={cx(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200",
              selectedOs === "mac"
                ? "bg-white/[0.12] text-white shadow-sm"
                : "text-white/60 hover:text-white hover:bg-white/[0.04]",
            )}
          >
            <AppleIcon className="h-4 w-4" />
            <span>macOS</span>
            {detected?.os === "mac" && (
              <span className="ml-1 rounded-full bg-ember-500/20 px-1.5 py-0.2 font-mono text-[9px] uppercase tracking-wider text-ember-300">
                Detected
              </span>
            )}
          </button>

          <button
            role="tab"
            aria-selected={selectedOs === "windows"}
            onClick={() => setSelectedOs("windows")}
            className={cx(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200",
              selectedOs === "windows"
                ? "bg-white/[0.12] text-white shadow-sm"
                : "text-white/60 hover:text-white hover:bg-white/[0.04]",
            )}
          >
            <WindowsIcon className="h-4 w-4" />
            <span>Windows</span>
            {detected?.os === "windows" && (
              <span className="ml-1 rounded-full bg-ember-500/20 px-1.5 py-0.2 font-mono text-[9px] uppercase tracking-wider text-ember-300">
                Detected
              </span>
            )}
          </button>

          <button
            role="tab"
            aria-selected={selectedOs === "linux"}
            onClick={() => setSelectedOs("linux")}
            className={cx(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200",
              selectedOs === "linux"
                ? "bg-white/[0.12] text-white shadow-sm"
                : "text-white/60 hover:text-white hover:bg-white/[0.04]",
            )}
          >
            <LinuxIcon className="h-4 w-4" />
            <span>Linux</span>
            {detected?.os === "linux" && (
              <span className="ml-1 rounded-full bg-ember-500/20 px-1.5 py-0.2 font-mono text-[9px] uppercase tracking-wider text-ember-300">
                Detected
              </span>
            )}
          </button>

          <button
            role="tab"
            aria-selected={selectedOs === "all"}
            onClick={() => setSelectedOs("all")}
            className={cx(
              "flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all duration-200",
              selectedOs === "all"
                ? "bg-white/[0.12] text-white shadow-sm"
                : "text-white/60 hover:text-white hover:bg-white/[0.04]",
            )}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>All Platforms</span>
          </button>
        </div>

        {detected && (
          <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
            <PlatformIcon os={detected.os} className="h-3.5 w-3.5 text-ember-400" />
            <span>Active Machine: <strong className="text-white/90">{detected.label}</strong></span>
          </div>
        )}
      </div>

      {/* Featured Spotlight for Selected / Detected OS */}
      {selectedOs !== "all" && primaryPlatform && primaryPlatform.asset && (
        <div className="relative overflow-hidden rounded-2xl border border-ember-500/30 bg-gradient-to-br from-[#18110b] via-[#120e0a] to-[#0a0a0c] p-6 sm:p-8 shadow-2xl">
          <div className="absolute right-0 top-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-ember-500/10 blur-3xl pointer-events-none" />

          <div className="relative grid gap-8 lg:grid-cols-12 items-center">
            {/* Left Col: Main Installer */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-ember-500/30 bg-ember-500/10 px-3 py-1 text-xs font-medium text-ember-300">
                <PlatformIcon os={activeOs} className="h-3.5 w-3.5" />
                <span>
                  {activeOs === detected?.os ? "Recommended for your system" : `Official ${primaryPlatform.label} Installer`}
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-display font-medium text-steel-50 tracking-tight">
                  A-Coder for {primaryPlatform.label}
                </h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed max-w-xl">
                  Download the standalone desktop installer. Comes packaged with the complete Void AI engine, full local model support, and direct provider access.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={primaryPlatform.asset.url}
                  download={primaryPlatform.asset.name}
                  onClick={(e) => handleDownloadClick(e, primaryPlatform)}
                  className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-ember-400 to-amber-400 px-6 text-sm font-semibold text-[#251004] shadow-lg shadow-ember-500/20 transition-all duration-200 hover:from-ember-300 hover:to-amber-300 hover:-translate-y-0.5"
                >
                  <Download className="h-4 w-4" />
                  <span>Download .{assetFormat(primaryPlatform.asset.name)}</span>
                  <span className="opacity-75 font-mono text-xs">
                    ({formatBytes(primaryPlatform.asset.size)})
                  </span>
                </a>

                {primaryPlatform.checksum && (
                  <a
                    href={primaryPlatform.checksum.url}
                    download
                    className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-mono text-white/70 hover:bg-white/[0.08] hover:text-white transition-colors"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>SHA-256</span>
                  </a>
                )}
              </div>

              {primaryPlatform.alternates.length > 0 && (
                <div className="pt-1 flex flex-wrap items-center gap-2 text-xs text-white/50">
                  <span>Other formats:</span>
                  {primaryPlatform.alternates.map((alt) => (
                    <a
                      key={alt.name}
                      href={alt.url}
                      download={alt.name}
                      onClick={() => {
                        setModalPlatform({
                          ...primaryPlatform,
                          asset: alt,
                        });
                        setIsModalOpen(true);
                      }}
                      className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-white/80 hover:bg-white/[0.08] hover:text-white transition-colors"
                    >
                      .{assetFormat(alt.name)} ({formatBytes(alt.size)})
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Right Col: Terminal Command for this OS */}
            <div className="lg:col-span-5 rounded-xl border border-white/10 bg-black/50 p-5 space-y-3 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-mono text-white/60">
                  <Terminal className="h-3.5 w-3.5 text-ember-400" />
                  <span>One-line terminal install</span>
                </span>
                <span className="font-mono text-[10px] text-white/40 uppercase">
                  {activeOs === "windows" ? "PowerShell" : "Bash"}
                </span>
              </div>

              <div className="relative rounded-lg bg-black/80 border border-white/10 p-3 font-mono text-xs text-white/90 overflow-x-auto">
                <code>{terminalCommand}</code>
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-[11px] text-white/50">
                  Installs app and adds <code className="text-white/80">a-coder</code> to PATH.
                </p>
                <button
                  onClick={handleCopyCommand}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-white hover:bg-white/[0.1] transition-colors shrink-0"
                >
                  {copiedCmd ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Platform Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium uppercase tracking-wider text-white/60">
            {selectedOs === "all" ? "All Platform Packages" : `${activeOs.toUpperCase()} Builds`}
          </h4>
          <span className="font-mono text-xs text-white/40">
            Version {version}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {currentPlatforms.map((p) => {
            const isPreferred =
              detected !== null &&
              p.os === detected.os &&
              (p.id.includes(detected.arch) || currentPlatforms.length === 1);
            const available = Boolean(p.asset);

            return (
              <Card
                key={p.id}
                className={cx(
                  "flex flex-col p-5 transition-all duration-200",
                  isPreferred && available && "border-ember-500/40 bg-ember-500/[0.02]",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/80 border border-white/10">
                      <PlatformIcon os={p.os} className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-medium text-steel-50">
                        {p.label}
                      </h3>
                      <p className="font-mono text-[11px] text-white/50">
                        v{version}
                        {p.asset && ` · ${formatBytes(p.asset.size)}`}
                      </p>
                    </div>
                  </div>
                  {isPreferred && (
                    <span className="shrink-0 rounded-full bg-ember-400/15 border border-ember-500/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-ember-300">
                      Your OS
                    </span>
                  )}
                </div>

                <div className="mt-5 flex-1" />

                {available && p.asset ? (
                  <>
                    <a
                      href={p.asset.url}
                      download={p.asset.name}
                      onClick={(e) => handleDownloadClick(e, p)}
                      className={cx(
                        "inline-flex h-10 items-center justify-center gap-2 rounded-lg text-[13px] font-medium transition-all duration-200 hover:-translate-y-px",
                        isPreferred
                          ? "bg-ember-400 text-[#2A1206] hover:bg-ember-300 font-semibold"
                          : "border border-white/10 bg-white/[0.05] text-white/90 hover:bg-white/[0.1]",
                      )}
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download .{assetFormat(p.asset.name)}</span>
                    </a>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      {p.checksum && (
                        <a
                          href={p.checksum.url}
                          download
                          className="inline-flex items-center gap-1 font-mono text-[10.5px] text-white/50 transition-colors hover:text-white/80"
                        >
                          <ShieldCheck className="h-3 w-3 text-emerald-400" />
                          <span>SHA-256</span>
                        </a>
                      )}
                      {p.alternates.map((alt) => (
                        <a
                          key={alt.name}
                          href={alt.url}
                          download={alt.name}
                          onClick={() => {
                            setModalPlatform({ ...p, asset: alt });
                            setIsModalOpen(true);
                          }}
                          className="font-mono text-[10.5px] text-white/50 underline-offset-4 transition-colors hover:text-white/80 hover:underline"
                        >
                          .{assetFormat(alt.name)}
                        </a>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="inline-flex h-10 items-center justify-center rounded-lg border border-dashed border-white/10 text-[12px] text-white/40">
                    Package unavailable
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
