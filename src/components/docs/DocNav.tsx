"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Star, Download, Menu, X, ArrowLeft, Terminal } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { LogoMark } from "@/components/site/LogoMark";
import { SITE } from "@/lib/site";
import { useDetectedSystem } from "@/lib/useOs";
import {
  getFallbackPlatforms,
  getPlatformForOs,
  assetFormat,
  type PlatformDownload,
} from "@/lib/github";
import { DownloadFeedbackModal } from "@/components/site/DownloadFeedbackModal";

interface DocNavProps {
  stars?: number;
  onOpenSearch: () => void;
  mobileSidebarOpen: boolean;
  onToggleMobileSidebar: () => void;
  onSelectDoc: (docId: string) => void;
  activeDocId: string;
}

export function DocNav({
  stars = 37,
  onOpenSearch,
  mobileSidebarOpen,
  onToggleMobileSidebar,
  onSelectDoc,
  activeDocId,
}: DocNavProps) {
  const isCliActive = activeDocId.startsWith("cli-");
  const detected = useDetectedSystem();
  const [modalPlatform, setModalPlatform] = useState<PlatformDownload | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const platforms = getFallbackPlatforms();
  const targetPlatform = getPlatformForOs(
    platforms,
    detected?.os ?? "windows",
    detected?.arch ?? "x64",
  );

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-white/[0.08] bg-[#0A0A0B]/95 px-4 backdrop-blur-md sm:px-6 lg:px-8 xl:px-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="rounded-lg p-1.5 text-white/60 hover:bg-white/[0.06] hover:text-white lg:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Logo and site return link */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-85">
          <div className="h-5 w-5 text-ember-400">
            <LogoMark />
          </div>
          <span className="font-display text-[15px] font-semibold tracking-tight text-white">
            A-Coder
          </span>
          <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/60">
            Docs
          </span>
        </Link>

        {/* Top category navigation links (Resend/Cursor style) */}
        <nav className="hidden items-center gap-1 md:flex ml-4 border-l border-white/[0.08] pl-4">
          <button
            type="button"
            onClick={() => onSelectDoc("introduction")}
            className={`rounded-lg px-2.5 py-1 text-[13px] font-medium transition-colors ${
              !isCliActive && activeDocId !== "codebase-guide"
                ? "bg-white/[0.08] text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            Documentation
          </button>
          <button
            type="button"
            onClick={() => onSelectDoc("cli-overview")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[13px] font-medium transition-colors ${
              isCliActive
                ? "bg-white/[0.08] text-sky-400"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Terminal className="h-3.5 w-3.5 text-sky-400" />
            <span>CLI Agent</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectDoc("mcp")}
            className="rounded-lg px-2.5 py-1 text-[13px] font-medium text-white/60 transition-colors hover:text-white"
          >
            MCP & Integrations
          </button>
          <button
            type="button"
            onClick={() => onSelectDoc("codebase-guide")}
            className="rounded-lg px-2.5 py-1 text-[13px] font-medium text-white/60 transition-colors hover:text-white"
          >
            Architecture
          </button>
        </nav>
      </div>

      {/* Center/Right actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global search button (Cursor style center/right) */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[12.5px] text-white/50 transition-all hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-white sm:px-3"
        >
          <Search className="h-3.5 w-3.5 text-white/40" />
          <span className="hidden sm:inline">Search docs...</span>
          <span className="inline sm:hidden">Search</span>
          <kbd className="hidden rounded bg-white/[0.06] px-1 py-0.5 font-mono text-[9.5px] text-white/40 sm:inline-block">
            ⌘K
          </kbd>
        </button>

        {/* GitHub link with star count */}
        <a
          href={SITE.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] px-2.5 py-1.5 text-[12px] font-medium text-white/70 transition-all hover:bg-white/[0.06] hover:text-white sm:flex"
        >
          <GithubIcon className="h-3.5 w-3.5" />
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{stars}</span>
          </span>
        </a>

        {/* Download IDE button */}
        <a
          href={targetPlatform?.asset?.url || "/api/download"}
          download={targetPlatform?.asset?.name}
          onClick={() => {
            if (targetPlatform?.asset) {
              setModalPlatform(targetPlatform);
              setIsModalOpen(true);
            }
          }}
          className="flex items-center gap-1.5 rounded-xl bg-white/[0.1] px-3 py-1.5 text-[12.5px] font-medium text-white transition-all hover:bg-ember-500 hover:text-white active:scale-95"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Download</span>
          {targetPlatform?.asset && (
            <span className="hidden sm:inline font-mono text-[10px] opacity-75">
              .{assetFormat(targetPlatform.asset.name)}
            </span>
          )}
        </a>
      </div>

      <DownloadFeedbackModal
        platform={modalPlatform}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        version="1.9.15"
      />
    </header>
  );
}
