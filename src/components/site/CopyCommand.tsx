"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cx } from "@/components/ui/primitives";

export function CopyCommand({
  command,
  label,
  className,
}: {
  command: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked by permissions policy; fail quietly
      // rather than throwing in the user's face.
    }
  };

  return (
    <div
      className={cx(
        "rake-edge group flex items-center gap-3 rounded-lg bg-white/[0.025] py-2.5 pl-3.5 pr-2",
        className,
      )}
    >
      {/* Fades out rather than exposing a scrollbar — the command is
          long by nature and the Copy button is what people actually use. */}
      <code
        title={command}
        className="fade-right no-scrollbar min-w-0 flex-1 overflow-hidden whitespace-nowrap font-mono text-[12px] text-white/60"
      >
        {label && <span className="mr-2 select-none text-white/55">{label}</span>}
        {command}
      </code>
      <button
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy install command"}
        className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2 font-mono text-[10.5px] text-white/55 transition-colors hover:border-white/20 hover:text-white/90"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3 text-diff-add" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" />
            Copy
          </>
        )}
      </button>
    </div>
  );
}
