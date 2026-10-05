"use client";

import React, { useState } from "react";
import {
  Download,
  CheckCircle2,
  X,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { PlatformIcon } from "@/components/ui/platform-icons";
import { formatBytes, type PlatformDownload } from "@/lib/github";
import Link from "next/link";

interface DownloadFeedbackModalProps {
  platform: PlatformDownload | null;
  isOpen: boolean;
  onClose: () => void;
  version: string;
}

export function DownloadFeedbackModal({
  platform,
  isOpen,
  onClose,
  version,
}: DownloadFeedbackModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !platform || !platform.asset) return null;

  const os = platform.os;
  const asset = platform.asset;

  const handleCopyMacCommand = () => {
    navigator.clipboard.writeText(
      'sudo xattr -d com.apple.quarantine "/Applications/A-Coder.app"',
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/12 bg-[#0c0d10] p-6 shadow-2xl shadow-black/80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close download dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ember-500/15 border border-ember-500/25 text-ember-400">
            <PlatformIcon os={os} className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3" />
                Download Initiated
              </span>
              <span className="text-[11px] font-mono text-white/50">
                v{version}
              </span>
            </div>
            <h3 className="mt-1 text-[16px] font-semibold text-white">
              Downloading for {platform.label}
            </h3>
          </div>
        </div>

        {/* File info card */}
        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-mono text-xs text-white/90 font-medium">
              {asset.name}
            </p>
            <p className="mt-0.5 font-mono text-[11px] text-white/50">
              {formatBytes(asset.size)} · Direct installer
            </p>
          </div>
          <a
            href={asset.url}
            download
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/10 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-ember-400" />
            Restart
          </a>
        </div>

        {/* Platform-specific installation note */}
        <div className="mt-5 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white/60">
            Next Steps
          </h4>

          {os === "mac" && (
            <div className="rounded-xl border border-ember-500/20 bg-ember-500/[0.05] p-3.5 text-xs text-white/80 space-y-2">
              <p className="leading-relaxed">
                1. Open the downloaded <code className="text-ember-300">.dmg</code> and drag <span className="font-medium text-white">A-Coder</span> into your Applications folder.
              </p>
              <p className="leading-relaxed">
                2. Since builds are community-published, run this one-time command in your Terminal to clear Gatekeeper quarantine before first launch:
              </p>
              <div className="mt-1 flex items-center justify-between rounded-lg bg-black/60 border border-white/10 px-3 py-2 font-mono text-[11px] text-white/90">
                <span className="truncate pr-2">
                  sudo xattr -d com.apple.quarantine &quot;/Applications/A-Coder.app&quot;
                </span>
                <button
                  onClick={handleCopyMacCommand}
                  className="shrink-0 text-white/50 hover:text-white p-1 rounded transition-colors"
                  title="Copy command"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {os === "windows" && (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 text-xs text-white/80 space-y-1.5">
              <p className="leading-relaxed">
                1. When the download finishes, launch <code className="text-ember-300">{asset.name}</code>.
              </p>
              <p className="leading-relaxed">
                2. If Windows Defender SmartScreen appears, click <span className="text-white font-medium">&quot;More info&quot;</span> and then <span className="text-white font-medium">&quot;Run anyway&quot;</span>.
              </p>
              <p className="leading-relaxed">
                3. A-Coder installs cleanly into your user directory without needing admin rights.
              </p>
            </div>
          )}

          {os === "linux" && (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 text-xs text-white/80 space-y-1.5">
              <p className="leading-relaxed">
                1. For Debian/Ubuntu (<code className="text-ember-300">.deb</code>): run <code className="font-mono text-white/90">sudo dpkg -i {asset.name}</code>.
              </p>
              <p className="leading-relaxed">
                2. For AppImage: make executable with <code className="font-mono text-white/90">chmod +x *.AppImage</code> and execute.
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <Link
            href="/docs"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors"
          >
            Read Getting Started Guide
            <ArrowRight className="h-3.5 w-3.5 text-ember-400" />
          </Link>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-white/[0.08] hover:bg-white/[0.14] text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
