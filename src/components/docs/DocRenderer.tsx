"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, Info, AlertTriangle, Lightbulb, ShieldAlert, Sparkles } from "lucide-react";
import { Kbd } from "@/components/ui/primitives";

interface DocRendererProps {
  content: string;
  onSelectDoc?: (docId: string) => void;
}

const EMOJI_REGEX =
  /[\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{FE0E}\u{FE0F}\u{200D}]/gu;

export function stripEmojis(str: string): string {
  return str.replace(EMOJI_REGEX, "").replace(/\s{2,}/g, " ").trim();
}

export function slugify(text: string): string {
  return stripEmojis(text)
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0E1013] text-[13px] shadow-sm">
      <div className="flex h-9 items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-3.5">
        <span className="font-mono text-[11px] font-medium tracking-wide text-white/50">
          {language || "text"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white"
          title="Copy code"
          type="button"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4 font-mono leading-relaxed text-steel-100">
        <pre>{code}</pre>
      </div>
    </div>
  );
}

function formatInline(text: string, onSelectDoc?: (docId: string) => void): React.ReactNode {
  // Regex to match inline codes, links, bold, kbd
  // Simple tokenizer
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // Check for inline link: [text](href)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const linkHref = linkMatch[2];
      
      const isInternalDoc =
        linkHref.endsWith(".md") ||
        linkHref.startsWith("user-guide/") ||
        linkHref.startsWith("./");

      if (isInternalDoc && onSelectDoc) {
        // extract id
        const cleanId = linkHref
          .replace(/^(\.\/|user-guide\/)/, "")
          .replace(/\.md$/, "");
        
        parts.push(
          <button
            key={keyIdx++}
            type="button"
            onClick={() => onSelectDoc(cleanId)}
            className="inline font-medium text-ember-400 underline decoration-ember-400/40 underline-offset-2 transition-colors hover:text-ember-300 hover:decoration-ember-400"
          >
            {formatInline(linkText, onSelectDoc)}
          </button>
        );
      } else {
        const isExternal = linkHref.startsWith("http");
        parts.push(
          <a
            key={keyIdx++}
            href={linkHref}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-0.5 font-medium text-ember-400 underline decoration-ember-400/40 underline-offset-2 transition-colors hover:text-ember-300"
          >
            <span>{linkText}</span>
            {isExternal && <ExternalLink className="inline h-3 w-3 shrink-0 text-white/40" />}
          </a>
        );
      }
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Check for inline code: `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      const codeVal = codeMatch[1];
      // Check if it's a keyboard shortcut like Ctrl+K, Ctrl+L, Tab, etc.
      if (
        codeVal.includes("Ctrl+") ||
        codeVal.includes("Cmd+") ||
        codeVal.includes("⌘") ||
        codeVal === "Tab" ||
        codeVal === "Enter"
      ) {
        parts.push(
          <span key={keyIdx++} className="mx-0.5 inline-block">
            <Kbd>{codeVal}</Kbd>
          </span>
        );
      } else {
        parts.push(
          <code
            key={keyIdx++}
            className="rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-[12.5px] text-ember-300"
          >
            {codeVal}
          </code>
        );
      }
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Check for bold: **text**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      parts.push(
        <strong key={keyIdx++} className="font-semibold text-white">
          {formatInline(boldMatch[1], onSelectDoc)}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Check for italic: *text*
    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      parts.push(
        <em key={keyIdx++} className="italic text-white/80">
          {italicMatch[1]}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Normal text chunk up to next special char
    const nextSpecial = remaining.search(/[`*\[]/);
    if (nextSpecial === -1) {
      parts.push(remaining);
      break;
    } else if (nextSpecial === 0) {
      // Just take the single character if no pattern matched
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      parts.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return parts;
}

export function cleanRawHtml(content: string): string {
  return content
    .replace(/<div\b[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<p\b[^>]*>[\s\S]*?<\/p>/gi, "")
    .replace(/<a\b[^>]*buymeacoffee[\s\S]*?<\/a>/gi, "")
    .replace(/<img\b[^>]*\/?>/gi, "")
    .replace(/<\/?(div|p|span|h[1-6]|center|br)\b[^>]*>/gi, "")
    .replace(/^#\s+[^\n]+\n+/, "")
    .replace(/\n\s*---\s*\n\s*---\s*\n/g, "\n---\n")
    .trim();
}

export function DocRenderer({ content, onSelectDoc }: DocRendererProps) {
  // Clean frontmatter, raw HTML, and strip any emojis
  let cleaned = cleanRawHtml(stripEmojis(content));
  if (cleaned.startsWith("Title:") || cleaned.startsWith("---")) {
    cleaned = cleaned.replace(/^---[\s\S]*?---/, "").trim();
    cleaned = cleaned.replace(/^Title:.*?\n/i, "");
    cleaned = cleaned.replace(/^Description:.*?\n/i, "");
    cleaned = cleaned.replace(/^Source:.*?\n/i, "");
    cleaned = cleaned.replace(/^---/i, "");
  }
  if (cleaned.startsWith("---")) {
    cleaned = cleaned.replace(/^---\s*\n*/, "").trim();
  }

  const lines = cleaned.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "";
  let tableLines: string[] = [];
  let inTable = false;
  let inBlockquote = false;
  let blockquoteLines: string[] = [];

  const flushTable = (k: number) => {
    if (tableLines.length === 0) return;
    const headerLine = tableLines[0];
    const headers = headerLine
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
    const bodyLines = tableLines.slice(2); // skip separator |---|---|

    elements.push(
      <div key={`table-${k}`} className="my-6 overflow-x-auto rounded-xl border border-white/[0.08] bg-white/[0.015]">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.03]">
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-white/70">
                  {formatInline(h, onSelectDoc)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {bodyLines.map((row, rIdx) => {
              const cols = row
                .split("|")
                .map((c) => c.trim())
                .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
              return (
                <tr key={rIdx} className="transition-colors hover:bg-white/[0.02]">
                  {cols.map((col, cIdx) => (
                    <td key={cIdx} className="px-4 py-3 leading-relaxed text-steel-200">
                      {formatInline(col, onSelectDoc)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
    tableLines = [];
    inTable = false;
  };

  const flushBlockquote = (k: number) => {
    if (blockquoteLines.length === 0) return;
    const fullText = blockquoteLines.join(" ").trim();
    
    // Check callout type
    const isNote = fullText.includes("[!NOTE]") || fullText.toLowerCase().startsWith("note:");
    const isTip = fullText.includes("[!TIP]") || fullText.toLowerCase().startsWith("tip:");
    const isImportant = fullText.includes("[!IMPORTANT]") || fullText.toLowerCase().startsWith("important:");
    const isWarning = fullText.includes("[!WARNING]") || fullText.toLowerCase().startsWith("warning:");

    let cleanText = fullText
      .replace(/\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/gi, "")
      .replace(/^(note|tip|important|warning):/gi, "")
      .trim();

    let borderColor = "border-steel-500/30 bg-steel-900/30 text-steel-200";
    let icon = <Info className="h-4 w-4 shrink-0 text-steel-400" />;
    let label = "Note";

    if (isTip) {
      borderColor = "border-emerald-500/30 bg-emerald-950/20 text-emerald-200";
      icon = <Lightbulb className="h-4 w-4 shrink-0 text-emerald-400" />;
      label = "Tip";
    } else if (isImportant) {
      borderColor = "border-ember-500/30 bg-ember-950/20 text-ember-200";
      icon = <Sparkles className="h-4 w-4 shrink-0 text-ember-400" />;
      label = "Important";
    } else if (isWarning) {
      borderColor = "border-amber-500/30 bg-amber-950/20 text-amber-200";
      icon = <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />;
      label = "Caution";
    }

    elements.push(
      <div key={`quote-${k}`} className={`my-5 flex gap-3 rounded-xl border p-4 text-[13.5px] leading-relaxed shadow-sm ${borderColor}`}>
        <div className="mt-0.5">{icon}</div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-1">{label}</p>
          <div>{formatInline(cleanText, onSelectDoc)}</div>
        </div>
      </div>
    );

    blockquoteLines = [];
    inBlockquote = false;
  };

  let idx = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <CodeBlock
            key={`code-${idx++}`}
            code={codeBuffer.join("\n")}
            language={codeLang}
          />
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        if (inTable) flushTable(idx++);
        if (inBlockquote) flushBlockquote(idx++);
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Blockquote
    if (line.trim().startsWith(">")) {
      if (inTable) flushTable(idx++);
      inBlockquote = true;
      blockquoteLines.push(line.replace(/^>\s*/, ""));
      continue;
    } else if (inBlockquote) {
      flushBlockquote(idx++);
    }

    // Table rows
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      inTable = true;
      tableLines.push(line.trim());
      continue;
    } else if (inTable) {
      flushTable(idx++);
    }

    // Empty lines
    if (!line.trim()) {
      continue;
    }

    // Headings
    if (line.startsWith("# ")) {
      const title = line.replace(/^#\s+/, "").trim();
      elements.push(
        <h1
          key={`h1-${idx++}`}
          id={slugify(title)}
          className="mt-8 mb-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
        >
          {title}
        </h1>
      );
      continue;
    }

    if (line.startsWith("## ")) {
      const title = line.replace(/^##\s+/, "").trim();
      const slug = slugify(title);
      elements.push(
        <h2
          key={`h2-${idx++}`}
          id={slug}
          className="group mt-12 mb-4 flex items-center gap-2 border-b border-white/[0.06] pb-2.5 text-xl font-semibold tracking-tight text-steel-50 sm:text-2xl"
        >
          <span>{title}</span>
          <a
            href={`#${slug}`}
            className="text-white/20 opacity-0 transition-opacity group-hover:opacity-100 hover:text-ember-400"
            aria-label="Permalink to heading"
          >
            #
          </a>
        </h2>
      );
      continue;
    }

    if (line.startsWith("### ")) {
      const title = line.replace(/^###\s+/, "").trim();
      const slug = slugify(title);
      elements.push(
        <h3
          key={`h3-${idx++}`}
          id={slug}
          className="group mt-8 mb-3 flex items-center gap-2 text-[17px] font-medium tracking-tight text-steel-100"
        >
          <span>{title}</span>
          <a
            href={`#${slug}`}
            className="text-white/20 opacity-0 transition-opacity group-hover:opacity-100 hover:text-ember-400"
            aria-label="Permalink to subheading"
          >
            #
          </a>
        </h3>
      );
      continue;
    }

    // Horizontal rule
    if (line.trim() === "---") {
      elements.push(
        <hr key={`hr-${idx++}`} className="my-8 border-t border-white/[0.08]" />
      );
      continue;
    }

    // Bullet lists
    if (line.trim().match(/^[-*]\s+/)) {
      const bulletText = line.trim().replace(/^[-*]\s+/, "");
      elements.push(
        <li
          key={`li-${idx++}`}
          className="ml-5 list-disc pl-1.5 text-[14.5px] leading-relaxed text-steel-200 marker:text-ember-400/80"
        >
          {formatInline(bulletText, onSelectDoc)}
        </li>
      );
      continue;
    }

    // Numbered lists
    if (line.trim().match(/^\d+\.\s+/)) {
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        elements.push(
          <li
            key={`oli-${idx++}`}
            className="ml-5 list-decimal pl-1.5 text-[14.5px] leading-relaxed text-steel-200 marker:font-mono marker:text-[12px] marker:text-white/50"
          >
            {formatInline(numMatch[2], onSelectDoc)}
          </li>
        );
        continue;
      }
    }

    // Regular paragraphs
    elements.push(
      <p
        key={`p-${idx++}`}
        className="my-3 text-[14.5px] leading-relaxed text-steel-200 sm:text-[15px]"
      >
        {formatInline(line, onSelectDoc)}
      </p>
    );
  }

  if (inTable) flushTable(idx++);
  if (inBlockquote) flushBlockquote(idx++);

  return <div className="docs-prose max-w-none">{elements}</div>;
}
