"use client";

import React, { useState } from "react";
import { Laptop, Terminal, KeyRound, Cpu, Check, Copy, ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import { INSTALL } from "@/lib/site";
import { useDetectedSystem } from "@/lib/useOs";
import {
  getFallbackPlatforms,
  getPlatformForOs,
  assetFormat,
  type PlatformDownload,
} from "@/lib/github";
import { DownloadFeedbackModal } from "@/components/site/DownloadFeedbackModal";

interface DocQuickstartGridProps {
  onSelectDoc?: (docId: string) => void;
}

export function DocQuickstartGrid({ onSelectDoc }: DocQuickstartGridProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const detected = useDetectedSystem();
  const [modalPlatform, setModalPlatform] = useState<PlatformDownload | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const platforms = getFallbackPlatforms();
  const targetPlatform = getPlatformForOs(
    platforms,
    detected?.os ?? "windows",
    detected?.arch ?? "x64",
  );

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="my-10">
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Quickstart
        </h2>
        <p className="mt-1 text-[14px] text-white/60">
          Learn how to get A-Coder running in your environment in under two minutes.
        </p>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        {/* Card 1: Desktop IDE */}
        <div className="group relative flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#0D0F12] p-4 transition-all hover:border-white/[0.18] hover:bg-[#111418]">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ember-500/10 text-ember-400">
                <Laptop className="h-4 w-4" />
              </div>
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[10.5px] text-white/60">
                macOS · Win · Linux
              </span>
            </div>
            <h3 className="mt-3 text-[15px] font-medium text-white group-hover:text-ember-300">
              A-Coder Desktop IDE
            </h3>
            <p className="mt-1 text-[13px] leading-relaxed text-white/55">
              Full VS Code / Code-OSS fork with Chat, Plan, Agent & Learn modes, direct LLM streaming, and inline diffs.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
            <a
              href={targetPlatform?.asset?.url || "/api/download"}
              download={targetPlatform?.asset?.name}
              onClick={() => {
                if (targetPlatform?.asset) {
                  setModalPlatform(targetPlatform);
                  setIsModalOpen(true);
                }
              }}
              className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ember-400 hover:text-ember-300"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download for {detected ? detected.label : "Desktop"}</span>
              <ArrowRight className="h-3 w-3" />
            </a>
            {onSelectDoc && (
              <button
                type="button"
                onClick={() => onSelectDoc("getting-started")}
                className="text-[12px] text-white/50 hover:text-white"
              >
                Guide →
              </button>
            )}
          </div>
        </div>

        {/* Card 2: CLI Agent */}
        <div className="group relative flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#0D0F12] p-4 transition-all hover:border-white/[0.18] hover:bg-[#111418]">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                <Terminal className="h-4 w-4" />
              </div>
              <button
                type="button"
                onClick={() => handleCopy("cli-cmd", INSTALL.unix)}
                className="flex items-center gap-1 rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[10.5px] text-white/60 hover:bg-white/[0.12] hover:text-white"
                title="Copy install command"
              >
                {copiedKey === "cli-cmd" ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy curl</span>
                  </>
                )}
              </button>
            </div>
            <h3 className="mt-3 text-[15px] font-medium text-white group-hover:text-sky-300">
              A-Coder CLI Agent
            </h3>
            <p className="mt-1 text-[13px] leading-relaxed text-white/55">
              Minimal, extensible terminal agent harness. Run interactively, script over JSON-RPC, or automate in CI.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
            <button
              type="button"
              onClick={() => onSelectDoc?.("cli-overview")}
              className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-sky-400 hover:text-sky-300"
            >
              <span>CLI Documentation</span>
              <ArrowRight className="h-3 w-3" />
            </button>
            <span className="font-mono text-[11px] text-white/40">Node 22+</span>
          </div>
        </div>

        {/* Card 3: Bring Your Own Key */}
        <div className="group relative flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#0D0F12] p-4 transition-all hover:border-white/[0.18] hover:bg-[#111418]">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <KeyRound className="h-4 w-4" />
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[10.5px] text-emerald-400">
                Direct-to-Provider
              </span>
            </div>
            <h3 className="mt-3 text-[15px] font-medium text-white group-hover:text-emerald-300">
              Bring Your Own Key
            </h3>
            <p className="mt-1 text-[13px] leading-relaxed text-white/55">
              Connect Anthropic, OpenAI, Google Gemini, Grok, DeepSeek, or OpenRouter. Your key stays on your machine.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
            <button
              type="button"
              onClick={() => onSelectDoc?.("providers-and-models")}
              className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-emerald-400 hover:text-emerald-300"
            >
              <span>Configure Providers</span>
              <ArrowRight className="h-3 w-3" />
            </button>
            <span className="text-[12px] text-white/45">No Proxy Server</span>
          </div>
        </div>

        {/* Card 4: 100% Local Models */}
        <div className="group relative flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#0D0F12] p-4 transition-all hover:border-white/[0.18] hover:bg-[#111418]">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                <Cpu className="h-4 w-4" />
              </div>
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 font-mono text-[10.5px] text-amber-400">
                Air-gapped & Offline
              </span>
            </div>
            <h3 className="mt-3 text-[15px] font-medium text-white group-hover:text-amber-300">
              Local Ollama & vLLM
            </h3>
            <p className="mt-1 text-[13px] leading-relaxed text-white/55">
              Zero telemetry, zero cloud calls. Auto-detect models from Ollama, LM Studio, vLLM, LiteLLM, or llamaCpp.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
            <button
              type="button"
              onClick={() => onSelectDoc?.("providers-and-models")}
              className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-amber-400 hover:text-amber-300"
            >
              <span>Local Model Setup</span>
              <ArrowRight className="h-3 w-3" />
            </button>
            <span className="text-[12px] text-white/45">100% Private</span>
          </div>
        </div>
      </div>

      <DownloadFeedbackModal
        platform={modalPlatform}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        version="1.9.15"
      />
    </div>
  );
}
