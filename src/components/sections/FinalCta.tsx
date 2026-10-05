"use client";

import React, { useState, useEffect } from "react";
import { Download, Layers, ArrowRight } from "lucide-react";
import {
  Container,
  Section,
  H2,
  Lead,
  ButtonLink,
  cx,
} from "@/components/ui/primitives";
import { CopyCommand } from "@/components/site/CopyCommand";
import { INSTALL, SITE } from "@/lib/site";
import { useDetectedSystem, useOs, OS_LABEL } from "@/lib/useOs";
import {
  PlatformIcon,
  AppleIcon,
  WindowsIcon,
  LinuxIcon,
} from "@/components/ui/platform-icons";
import { getFallbackPlatforms, getPlatformForOs } from "@/lib/github";
import { DownloadFeedbackModal } from "@/components/site/DownloadFeedbackModal";

const TABS = [
  { id: "mac", label: "macOS", command: INSTALL.unix, icon: AppleIcon },
  { id: "windows", label: "Windows", command: INSTALL.windows, icon: WindowsIcon },
  { id: "linux", label: "Linux", command: INSTALL.unix, icon: LinuxIcon },
] as const;

export function FinalCta() {
  const detected = useDetectedSystem();
  const [active, setActive] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Automatically select detected OS on client mount
  useEffect(() => {
    if (detected?.os) {
      const idx = TABS.findIndex((t) => t.id === detected.os);
      if (idx !== -1) setActive(idx);
    }
  }, [detected?.os]);

  const activeTab = TABS[active];
  const platforms = getFallbackPlatforms();
  const targetPlatform = getPlatformForOs(
    platforms,
    activeTab.id,
    detected?.arch ?? "x64",
  );
  const asset = targetPlatform?.asset;

  return (
    <Section className="relative isolate overflow-hidden">
      <DownloadFeedbackModal
        platform={targetPlatform}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        version="1.9.15"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[900px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(255,138,76,0.08),transparent)] blur-2xl"
      />
      <Container className="relative">
        <div className="mx-auto max-w-[680px] text-center">
          <H2>Install it in one line.</H2>
          <Lead className="mx-auto mt-4">
            Free, open source, and yours to modify. Bring your own key, or point
            it at a model running on your own machine.
          </Lead>
        </div>

        <div className="mx-auto mt-10 max-w-[680px]">
          <div
            role="tablist"
            aria-label="Install command by platform"
            className="mx-auto flex justify-center rounded-full border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-sm"
          >
            {TABS.map((t, i) => {
              const Icon = t.icon;
              const isDetected = detected?.os === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  className={cx(
                    "flex items-center gap-2 rounded-full px-4 py-1.5 text-[12.5px] transition-colors duration-200",
                    i === active
                      ? "bg-white/[0.12] text-white shadow-sm"
                      : "text-white/50 hover:text-white/80",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{t.label}</span>
                  {isDetected && (
                    <span className="hidden sm:inline rounded-full bg-ember-500/20 px-1.5 py-0.2 font-mono text-[8.5px] uppercase tracking-wider text-ember-300">
                      Your OS
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <CopyCommand
            command={activeTab.command}
            label={activeTab.id === "windows" ? "PS>" : "$"}
            className="mt-5"
          />

          <div className="mt-7 flex flex-wrap justify-center items-center gap-3">
            {asset && (
              <a
                href={asset.url}
                download={asset.name}
                onClick={() => setIsModalOpen(true)}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-ember-400 to-amber-400 px-5 text-sm font-semibold text-[#251004] transition-all duration-200 hover:from-ember-300 hover:to-amber-300 hover:-translate-y-px shadow-lg shadow-ember-500/10"
              >
                <Download className="h-4 w-4" />
                <span>Download for {activeTab.label}</span>
              </a>
            )}

            <ButtonLink href="/download" tone="ghost" size="lg">
              <Layers className="h-4 w-4" />
              All platforms
            </ButtonLink>

            <ButtonLink
              href={SITE.repoUrl}
              tone="ghost"
              size="lg"
              external
            >
              Read the source
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
