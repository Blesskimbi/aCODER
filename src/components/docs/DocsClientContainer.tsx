"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Copy,
  Check,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ArrowUpRight,
  Terminal,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { ALL_DOCS, getDocById, type DocItem } from "@/content/docs";
import { DocNav } from "./DocNav";
import { DocSidebar } from "./DocSidebar";
import { DocRenderer } from "./DocRenderer";
import { DocTableOfContents } from "./DocTableOfContents";
import { DocHeroVisual } from "./DocHeroVisual";
import { DocQuickstartGrid } from "./DocQuickstartGrid";
import { DocSearchModal } from "./DocSearchModal";

interface DocsClientContainerProps {
  initialDocId?: string;
  stars?: number;
}

export function DocsClientContainer({
  initialDocId = "introduction",
  stars = 37,
}: DocsClientContainerProps) {
  const [activeDocId, setActiveDocId] = useState<string>(initialDocId);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync with URL query param or hash if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const docParam = params.get("doc");
    if (docParam && ALL_DOCS.some((d) => d.id === docParam)) {
      setActiveDocId(docParam);
    } else {
      const hash = window.location.hash.replace("#", "");
      if (hash && ALL_DOCS.some((d) => d.id === hash)) {
        setActiveDocId(hash);
      }
    }
  }, []);

  const handleSelectDoc = (docId: string) => {
    if (!ALL_DOCS.some((d) => d.id === docId)) return;
    setActiveDocId(docId);
    setMobileSidebarOpen(false);

    // Update URL without full reload
    const url = new URL(window.location.href);
    url.searchParams.set("doc", docId);
    window.history.pushState({}, "", url.toString());

    // Scroll main content to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const currentDoc = getDocById(activeDocId);
  const currentIndex = ALL_DOCS.findIndex((d) => d.id === activeDocId);
  const prevDoc = currentIndex > 0 ? ALL_DOCS[currentIndex - 1] : null;
  const nextDoc =
    currentIndex < ALL_DOCS.length - 1 ? ALL_DOCS[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-canvas text-steel-100">
      {/* Top Header */}
      <DocNav
        stars={stars}
        onOpenSearch={() => setIsSearchOpen(true)}
        mobileSidebarOpen={mobileSidebarOpen}
        onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        onSelectDoc={handleSelectDoc}
        activeDocId={activeDocId}
      />

      {/* Global Search Modal */}
      <DocSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectDoc={handleSelectDoc}
      />

      {/* Main 3-Column Wall-to-Wall Layout */}
      <div className="flex w-full min-h-[calc(100vh-3.5rem)]">
        {/* Left Sidebar (Desktop - pinned to left wall) */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 xl:w-72 2xl:w-80 shrink-0 border-r border-white/[0.08] bg-[#0A0A0B] pt-4 lg:block">
          <DocSidebar
            activeDocId={activeDocId}
            onSelectDoc={handleSelectDoc}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        </aside>

        {/* Mobile Slide-Over Sidebar */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
              aria-hidden="true"
            />
            <div className="relative z-10 h-full w-72 max-w-[80vw] border-r border-white/[0.08] bg-[#0A0A0B] p-4 pt-6 shadow-2xl">
              <DocSidebar
                activeDocId={activeDocId}
                onSelectDoc={handleSelectDoc}
                onOpenSearch={() => {
                  setMobileSidebarOpen(false);
                  setIsSearchOpen(true);
                }}
              />
            </div>
          </div>
        )}

        {/* Middle Main Content */}
        <main className="min-w-0 flex-1 px-6 sm:px-10 lg:px-12 xl:px-16 2xl:px-20 py-8">
          <div className="mx-auto max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
            {/* Category Eyebrow & Action bar */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-[12px]">
              <div className="flex items-center gap-2">
                <span className="font-mono uppercase tracking-[0.16em] text-ember-400 font-medium">
                  {currentDoc.section}
                </span>
                <span className="text-white/20">/</span>
                <span className="font-mono text-white/50">{currentDoc.title}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
                  title="Copy link to this document"
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy link</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://github.com/hamishfromatech/${currentDoc.repo}/blob/main/${currentDoc.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white sm:flex"
                  title="View on GitHub"
                >
                  <GithubIcon className="h-3 w-3" />
                  <span>GitHub</span>
                  <ArrowUpRight className="h-2.5 w-2.5 opacity-60" />
                </a>
              </div>
            </div>

            {/* Document Title (Resend/Cursor style) */}
            <div className="mt-6 mb-6">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {currentDoc.title}
              </h1>
              <p className="mt-2 text-[15px] leading-relaxed text-white/60">
                {currentDoc.repo === "A-Coder"
                  ? "A-Coder IDE — Your True Open Source AI IDE built on VS Code with direct-to-provider LLMs, intelligent context, and Learn Mode."
                  : "A-Coder CLI — Minimal, extensible AI coding agent harness with interactive, JSON-RPC, and headless SDK modes."}
              </p>
            </div>

            {/* Visual Hero Showcase (Cursor Docs Style) on Introduction & Getting Started */}
            {(activeDocId === "introduction" || activeDocId === "getting-started") && (
              <>
                <DocHeroVisual />
                <DocQuickstartGrid onSelectDoc={handleSelectDoc} />
              </>
            )}

            {/* CLI Hero screenshot on CLI Overview */}
            {activeDocId === "cli-overview" && (
              <div className="my-8 overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-b from-[#121418] to-[#0A0B0E] p-1.5 shadow-2xl">
                <div className="flex items-center gap-1.5 border-b border-white/[0.07] bg-white/[0.02] px-4 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]/80" />
                  <span className="ml-2 font-mono text-[11px] text-white/45">
                    Terminal · a-coder --interactive
                  </span>
                </div>
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
                  <Image
                    src="/screenshots/a-coder-cli-preview.jpg"
                    alt="A-Coder CLI in terminal"
                    fill
                    unoptimized
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Full Markdown Documentation Content */}
            <DocRenderer
              content={currentDoc.content}
              onSelectDoc={handleSelectDoc}
            />

            {/* Previous / Next Navigation Cards */}
            <div className="mt-16 grid gap-4 border-t border-white/[0.08] pt-8 sm:grid-cols-2">
              {prevDoc ? (
                <button
                  type="button"
                  onClick={() => handleSelectDoc(prevDoc.id)}
                  className="group flex flex-col items-start rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-left transition-all hover:border-white/[0.18] hover:bg-white/[0.04]"
                >
                  <span className="flex items-center gap-1 font-mono text-[11px] text-white/40 group-hover:text-white/60">
                    <ChevronLeft className="h-3 w-3" />
                    <span>Previous</span>
                  </span>
                  <span className="mt-1 text-[14px] font-medium text-white group-hover:text-ember-300">
                    {prevDoc.title}
                  </span>
                  <span className="text-[12px] text-white/50">{prevDoc.section}</span>
                </button>
              ) : (
                <div />
              )}

              {nextDoc ? (
                <button
                  type="button"
                  onClick={() => handleSelectDoc(nextDoc.id)}
                  className="group flex flex-col items-end rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-right transition-all hover:border-white/[0.18] hover:bg-white/[0.04]"
                >
                  <span className="flex items-center gap-1 font-mono text-[11px] text-white/40 group-hover:text-white/60">
                    <span>Next</span>
                    <ChevronRight className="h-3 w-3" />
                  </span>
                  <span className="mt-1 text-[14px] font-medium text-white group-hover:text-ember-300">
                    {nextDoc.title}
                  </span>
                  <span className="text-[12px] text-white/50">{nextDoc.section}</span>
                </button>
              ) : (
                <div />
              )}
            </div>

            {/* Bottom spacer */}
            <div className="h-12" />
          </div>
        </main>

        {/* Right Sidebar: Table of Contents ("On this page" - pinned to right wall) */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 xl:w-72 2xl:w-80 shrink-0 overflow-y-auto border-l border-white/[0.08] bg-[#0A0A0B] px-6 py-6 xl:block">
          <DocTableOfContents doc={currentDoc} />
        </aside>
      </div>
    </div>
  );
}
