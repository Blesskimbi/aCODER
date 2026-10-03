"use client";

import React, { useEffect, useState } from "react";
import { Copy, Check, ExternalLink, MessageCircle } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { SITE, EXTERNAL } from "@/lib/site";
import { type DocItem } from "@/content/docs";
import { slugify, stripEmojis } from "./DocRenderer";

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

interface DocTableOfContentsProps {
  doc: DocItem;
}

export function DocTableOfContents({ doc }: DocTableOfContentsProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Parse H2 and H3 from markdown content
    const lines = doc.content.split("\n");
    const extracted: HeadingItem[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("## ")) {
        const text = stripEmojis(trimmed.replace(/^##\s+/, "")).trim();
        extracted.push({ id: slugify(text), text, level: 2 });
      } else if (trimmed.startsWith("### ")) {
        const text = stripEmojis(trimmed.replace(/^###\s+/, "")).trim();
        extracted.push({ id: slugify(text), text, level: 3 });
      }
    });

    setHeadings(extracted);
    if (extracted.length > 0) {
      setActiveId(extracted[0].id);
    }
  }, [doc]);

  // ScrollSpy
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0.1 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(doc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const githubUrl = `https://github.com/hamishfromatech/${doc.repo}/blob/main/${doc.path}`;

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-white/50">
          On this page
        </h4>

        {headings.length === 0 ? (
          <p className="mt-3 text-[12.5px] text-white/40">Overview</p>
        ) : (
          <nav className="mt-3">
            <ul className="space-y-1.5 text-[12.5px]">
              {headings.map((h) => {
                const isActive = activeId === h.id;
                return (
                  <li
                    key={h.id}
                    style={{ paddingLeft: h.level === 3 ? "12px" : "0px" }}
                  >
                    <a
                      href={`#${h.id}`}
                      className={`block py-0.5 leading-snug transition-colors ${
                        isActive
                          ? "font-medium text-ember-400"
                          : "text-white/50 hover:text-white/85"
                      }`}
                    >
                      {h.text}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>

      {/* Useful actions */}
      <div className="border-t border-white/[0.06] pt-4">
        <ul className="space-y-2 text-[12px]">
          <li>
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="flex w-full items-center gap-2 text-white/50 transition-colors hover:text-white"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Page markdown copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy page markdown</span>
                </>
              )}
            </button>
          </li>
          <li>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/50 transition-colors hover:text-white"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              <span>Edit on GitHub</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-60" />
            </a>
          </li>
          <li>
            <a
              href={EXTERNAL.forum}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/50 transition-colors hover:text-white"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Ask community</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-60" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
