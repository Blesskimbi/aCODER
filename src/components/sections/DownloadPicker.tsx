"use client";

import { Download, ShieldCheck } from "lucide-react";
import { Card, cx, ExtArrow } from "@/components/ui/primitives";
import {
  assetFormat,
  formatBytes,
  type PlatformDownload,
} from "@/lib/github";
import { useOs } from "@/lib/useOs";
import { SITE } from "@/lib/site";

export function DownloadPicker({
  platforms,
  version,
}: {
  platforms: PlatformDownload[];
  version: string;
}) {
  const os = useOs();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {platforms.map((p) => {
        const isPreferred = os !== null && p.os === os;
        const available = Boolean(p.asset);

        return (
          <Card
            key={p.id}
            className={cx(
              "flex flex-col p-5",
              isPreferred && available && "card-glow",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-[14px] font-medium text-steel-50">
                  {p.label}
                </h3>
                <p className="mt-1 font-mono text-[11px] text-white/55">
                  v{version}
                  {p.asset && ` · ${formatBytes(p.asset.size)}`}
                </p>
              </div>
              {isPreferred && (
                <span className="shrink-0 rounded-full bg-ember-400/12 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ember-200">
                  Your OS
                </span>
              )}
            </div>

            <div className="mt-5 flex-1" />

            {available ? (
              <>
                <a
                  href={p.asset!.url}
                  className={cx(
                    "inline-flex h-10 items-center justify-center gap-2 rounded-lg text-[13px] font-medium transition-all duration-200 hover:-translate-y-px",
                    isPreferred
                      ? "bg-ember-400 text-[#2A1206] hover:bg-ember-300"
                      : "border border-white/10 bg-white/[0.05] text-white/85 hover:bg-white/[0.08]",
                  )}
                >
                  <Download className="h-3.5 w-3.5" />
                  Download .{assetFormat(p.asset!.name)}
                </a>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  {p.checksum && (
                    <a
                      href={p.checksum.url}
                      className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-white/55 transition-colors hover:text-white/65"
                    >
                      <ShieldCheck className="h-3 w-3" />
                      SHA-256
                    </a>
                  )}
                  {p.alternates.map((alt) => (
                    <a
                      key={alt.name}
                      href={alt.url}
                      className="font-mono text-[10.5px] text-white/55 underline-offset-4 transition-colors hover:text-white/65 hover:underline"
                    >
                      .{assetFormat(alt.name)}
                    </a>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="inline-flex h-10 items-center justify-center rounded-lg border border-dashed border-white/[0.1] text-[12.5px] text-white/55">
                  Not in this release
                </div>
                <a
                  href={SITE.releasesUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-3 font-mono text-[10.5px] text-white/55 underline-offset-4 hover:text-white/65 hover:underline"
                >
                  Check all releases <ExtArrow />
                </a>
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
}
