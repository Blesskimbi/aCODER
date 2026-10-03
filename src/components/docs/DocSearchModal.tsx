"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, BookOpen, ArrowRight, CornerDownLeft, ArrowUpDown } from "lucide-react";
import { ALL_DOCS, type DocItem } from "@/content/docs";

interface DocSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDoc: (docId: string) => void;
}

export function DocSearchModal({ isOpen, onClose, onSelectDoc }: DocSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSearchTerm("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          // parent opens it
        }
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        onSelectDoc(results[selectedIndex].id);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const query = searchTerm.toLowerCase().trim();

  const results: Array<DocItem & { snippet: string }> = React.useMemo(() => {
    let docs = ALL_DOCS;
    if (activeFilter === "IDE") {
      docs = docs.filter((d) => d.repo === "A-Coder" && d.section !== "Architecture");
    } else if (activeFilter === "CLI") {
      docs = docs.filter((d) => d.repo === "a-coder-cli" || d.section === "CLI Agent");
    } else if (activeFilter === "Arch") {
      docs = docs.filter((d) => d.section === "Architecture");
    }

    if (!query) {
      return docs.slice(0, 8).map((d) => ({
        ...d,
        snippet: d.content
          .replace(/[#*`|]/g, " ")
          .slice(0, 140)
          .trim() + "...",
      }));
    }

    const matches: Array<{ doc: DocItem; score: number; snippet: string }> = [];

    docs.forEach((doc) => {
      let score = 0;
      const titleLower = doc.title.toLowerCase();
      const contentLower = doc.content.toLowerCase();

      if (titleLower.includes(query)) score += 30;
      if (doc.section.toLowerCase().includes(query)) score += 15;

      const idx = contentLower.indexOf(query);
      if (idx !== -1) {
        score += 5;
        const start = Math.max(0, idx - 40);
        const end = Math.min(doc.content.length, idx + 100);
        const snippet =
          (start > 0 ? "..." : "") +
          doc.content.slice(start, end).replace(/[#*`|]/g, " ").trim() +
          "...";
        matches.push({ doc, score, snippet });
      } else if (score > 0) {
        matches.push({
          doc,
          score,
          snippet:
            doc.content.replace(/[#*`|]/g, " ").slice(0, 120).trim() + "...",
        });
      }
    });

    matches.sort((a, b) => b.score - a.score);
    return matches.slice(0, 10).map((m) => ({ ...m.doc, snippet: m.snippet }));
  }, [query, activeFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 p-4 pt-16 backdrop-blur-sm sm:pt-24">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0E1014] shadow-2xl">
        {/* Search header */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3">
          <Search className="h-5 w-5 text-white/40" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search documentation, guides, tools, and CLI flags..."
            className="flex-1 bg-transparent text-[15px] text-white placeholder-white/40 outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-white/40 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="rounded border border-white/[0.1] bg-white/[0.05] px-2 py-0.5 font-mono text-[10px] text-white/50">
            ESC
          </kbd>
        </div>

        {/* Filter tags */}
        <div className="flex items-center gap-1.5 border-b border-white/[0.05] bg-white/[0.015] px-4 py-2 text-[12px]">
          {["All", "IDE", "CLI", "Arch"].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setActiveFilter(tag);
                setSelectedIndex(0);
              }}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                activeFilter === tag
                  ? "bg-ember-500/20 text-ember-400"
                  : "text-white/50 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              {tag}
            </button>
          ))}
          <span className="ml-auto font-mono text-[11px] text-white/40">
            {results.length} result{results.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Results list */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[14px] text-white/60">No documentation matched "{searchTerm}"</p>
              <p className="mt-1 text-[12px] text-white/40">Try searching for modes, shortcuts, local models, or CLI.</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {results.map((doc, idx) => (
                <li key={doc.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectDoc(doc.id);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all ${
                      selectedIndex === idx
                        ? "bg-white/[0.08] text-white"
                        : "text-steel-200 hover:bg-white/[0.04]"
                    }`}
                  >
                    <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-ember-400" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-medium text-white">
                          {doc.title}
                        </span>
                        <span className="rounded bg-white/[0.06] px-1.5 py-0.2 font-mono text-[10px] text-white/50">
                          {doc.section}
                        </span>
                        <span className="ml-auto font-mono text-[10px] text-white/35">
                          {doc.repo}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-white/55">
                        {doc.snippet}
                      </p>
                    </div>
                    {selectedIndex === idx && (
                      <CornerDownLeft className="h-4 w-4 shrink-0 text-white/40" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.02] px-4 py-2 font-mono text-[11px] text-white/40">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ArrowUpDown className="h-3 w-3" /> Navigate
            </span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="h-3 w-3" /> Select
            </span>
            <span>ESC Close</span>
          </div>
          <span>A-Coder Documentation</span>
        </div>
      </div>
    </div>
  );
}
