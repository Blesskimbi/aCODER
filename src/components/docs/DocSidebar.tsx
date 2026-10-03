"use client";

import React, { useState } from "react";
import {
  Compass,
  MessageSquare,
  FileCode,
  Cpu,
  Puzzle,
  Sparkles,
  Terminal,
  Layers,
  ChevronRight,
  ChevronDown,
  Search,
  ExternalLink,
  Laptop,
} from "lucide-react";
import { DOC_SECTIONS, type DocItem, type DocSection } from "@/content/docs";
import { SITE } from "@/lib/site";

interface DocSidebarProps {
  activeDocId: string;
  onSelectDoc: (docId: string) => void;
  onOpenSearch: () => void;
}

const SECTION_ICONS: Record<string, React.ReactNode> = {
  Compass: <Compass className="h-4 w-4" />,
  MessageSquare: <MessageSquare className="h-4 w-4" />,
  FileCode: <FileCode className="h-4 w-4" />,
  Cpu: <Cpu className="h-4 w-4" />,
  Puzzle: <Puzzle className="h-4 w-4" />,
  Sparkles: <Sparkles className="h-4 w-4" />,
  Terminal: <Terminal className="h-4 w-4" />,
  Layers: <Layers className="h-4 w-4" />,
};

export function DocSidebar({
  activeDocId,
  onSelectDoc,
  onOpenSearch,
}: DocSidebarProps) {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [filterText, setFilterText] = useState("");

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const filterLower = filterText.toLowerCase().trim();

  return (
    <div className="flex h-full flex-col">
      {/* Search trigger button (Resend/Cursor style) */}
      <div className="px-3 pb-3">
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[13px] text-white/50 transition-all hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-white/40" />
            <span>Search docs...</span>
          </div>
          <kbd className="rounded border border-white/[0.1] bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] text-white/40">
            Ctrl K
          </kbd>
        </button>

        {/* Quick inline text filter if user wants to narrow sidebar */}
        <div className="mt-2">
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter topics..."
            className="w-full rounded-lg border border-transparent bg-white/[0.02] px-2.5 py-1 text-[11.5px] text-white/80 placeholder-white/30 outline-none transition-colors focus:border-white/[0.08] focus:bg-white/[0.04]"
          />
        </div>
      </div>

      {/* Navigation items */}
      <div className="flex-1 overflow-y-auto px-2 py-2 pr-3 scrollbar-thin">
        <nav className="space-y-6">
          {DOC_SECTIONS.map((section) => {
            const filteredItems = section.items.filter((item) =>
              filterLower ? item.title.toLowerCase().includes(filterLower) : true
            );

            if (filterLower && filteredItems.length === 0) return null;

            const isCollapsed = !filterLower && !!collapsedSections[section.title];

            return (
              <div key={section.title} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleSection(section.title)}
                  className="flex w-full items-center justify-between px-2 py-1 text-left text-[11px] font-semibold uppercase tracking-wider text-white/45 transition-colors hover:text-white/80"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white/40">
                      {SECTION_ICONS[section.iconName] || <Compass className="h-3.5 w-3.5" />}
                    </span>
                    <span>{section.title}</span>
                  </div>
                  <span className="text-white/30">
                    {isCollapsed ? (
                      <ChevronRight className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </span>
                </button>

                {!isCollapsed && (
                  <ul className="mt-1 space-y-0.5 border-l border-white/[0.06] ml-3.5 pl-2">
                    {filteredItems.map((item) => {
                      const isActive = activeDocId === item.id;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => onSelectDoc(item.id)}
                            className={`group flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-all ${
                              isActive
                                ? "bg-white/[0.09] font-medium text-white shadow-sm"
                                : "text-white/60 hover:bg-white/[0.03] hover:text-white/90"
                            }`}
                          >
                            <span className="truncate">{item.title}</span>
                            {item.repo === "a-coder-cli" && (
                              <span className="ml-1.5 rounded bg-sky-500/10 px-1.5 py-0.2 font-mono text-[9.5px] font-medium text-sky-400">
                                CLI
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Sidebar bottom info */}
      <div className="border-t border-white/[0.06] bg-white/[0.015] p-3 text-[11.5px] text-white/45">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>v1.9.15</span>
          </div>
          <span className="font-mono text-[10.5px] text-white/35">Apache-2.0</span>
        </div>
      </div>
    </div>
  );
}
