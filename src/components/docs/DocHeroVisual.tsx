"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Terminal, Code2, Layers, CheckCircle2 } from "lucide-react";
import { IdeMockup } from "@/components/mockups/IdeMockup";
import { MODES } from "@/content/product";

export function DocHeroVisual() {
  const [activeTab, setActiveTab] = useState<"ide" | "cli" | "interactive">("ide");

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-b from-[#121418] to-[#0A0B0E] p-1.5 shadow-2xl transition-all">
      {/* Visual switcher bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] bg-white/[0.02] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]/80" />
          <span className="ml-2 font-mono text-[11px] text-white/45">
            A-Coder v1.9.15 · {activeTab === "ide" ? "IDE Surface" : activeTab === "cli" ? "CLI Agent" : "Live Diff Engine"}
          </span>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-black/40 p-0.5 text-[11.5px]">
          <button
            type="button"
            onClick={() => setActiveTab("ide")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all ${
              activeTab === "ide"
                ? "bg-white/[0.12] text-white shadow-sm"
                : "text-white/55 hover:text-white/90"
            }`}
          >
            <Code2 className="h-3.5 w-3.5 text-ember-400" />
            <span>IDE Interface</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cli")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all ${
              activeTab === "cli"
                ? "bg-white/[0.12] text-white shadow-sm"
                : "text-white/55 hover:text-white/90"
            }`}
          >
            <Terminal className="h-3.5 w-3.5 text-ember-400" />
            <span>CLI Terminal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("interactive")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all ${
              activeTab === "interactive"
                ? "bg-white/[0.12] text-white shadow-sm"
                : "text-white/55 hover:text-white/90"
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-ide-teal" />
            <span>Interactive Diff</span>
          </button>
        </div>
      </div>

      {/* Visual canvas */}
      <div className="relative overflow-hidden rounded-xl bg-canvas-deep">
        {activeTab === "ide" && (
          <div className="group relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src="/screenshots/a-coder-ide-preview.jpg"
              alt="A-Coder IDE Interface showing syntax highlighting, diff zones, and autonomous AI assistant reasoning"
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-[1.01]"
              priority
            />
            {/* Subtle overlay badges */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[11px] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-white/80">Agent active: Exact-match fast apply</span>
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-ember-500/20 bg-ember-950/60 px-3 py-1 text-[11px] text-ember-300 backdrop-blur-md">
              <Sparkles className="h-3 w-3" />
              <span>Morph Fast Context Engine</span>
            </div>
          </div>
        )}

        {activeTab === "cli" && (
          <div className="group relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src="/screenshots/a-coder-cli-preview.jpg"
              alt="A-Coder CLI Agent running in terminal"
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-[1.01]"
            />
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[11px] backdrop-blur-md">
              <span className="font-mono text-white/80">JSON-RPC & Interactive CLI · Node.js v22+</span>
            </div>
          </div>
        )}

        {activeTab === "interactive" && (
          <div className="p-3">
            <IdeMockup mode={MODES[2]} />
          </div>
        )}
      </div>

      {/* Bottom feature callout strip */}
      <div className="grid grid-cols-2 divide-x divide-white/[0.06] border-t border-white/[0.06] bg-white/[0.015] text-[12px] sm:grid-cols-4">
        <div className="p-3 text-center sm:text-left">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/40 block">Foundations</span>
          <span className="font-medium text-steel-100 flex items-center justify-center sm:justify-start gap-1 mt-0.5">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" /> VS Code / Code-OSS
          </span>
        </div>
        <div className="p-3 text-center sm:text-left">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/40 block">Token Efficiency</span>
          <span className="font-medium text-steel-100 flex items-center justify-center sm:justify-start gap-1 mt-0.5">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" /> TOON 30–70% Savings
          </span>
        </div>
        <div className="p-3 text-center sm:text-left">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/40 block">Models</span>
          <span className="font-medium text-steel-100 flex items-center justify-center sm:justify-start gap-1 mt-0.5">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" /> 20 Providers + Local
          </span>
        </div>
        <div className="p-3 text-center sm:text-left">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/40 block">Licence</span>
          <span className="font-medium text-steel-100 flex items-center justify-center sm:justify-start gap-1 mt-0.5">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" /> True Apache-2.0
          </span>
        </div>
      </div>
    </div>
  );
}
