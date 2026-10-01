import type { ReactNode } from "react";
import { cx } from "@/components/ui/primitives";

/**
 * The framed-application device. Content inside is rendered at real
 * IDE density — 11–13px type, 3px radii — because blown-up
 * "simplified" mockups read as fake. See RESEARCH.md §3.
 */
export function WindowChrome({
  title,
  children,
  className,
  tone = "editor",
  fadeBottom = true,
}: {
  title: ReactNode;
  children: ReactNode;
  className?: string;
  tone?: "editor" | "terminal";
  /** Dissolve the panel into the canvas instead of ending on a border. */
  fadeBottom?: boolean;
}) {
  return (
    <div
      className={cx(
        "rake-edge overflow-hidden rounded-panel bg-chrome shadow-[0_24px_64px_-32px_#000000e6,0_2px_8px_#00000066]",
        fadeBottom && "fade-bottom fade-bottom-sm",
        className,
      )}
    >
      <div className="flex h-9 items-center gap-3 border-b border-white/[0.06] bg-white/[0.02] px-3.5">
        <div className="flex items-center gap-[6px]">
          <span className="h-[9px] w-[9px] rounded-full bg-white/[0.14]" />
          <span className="h-[9px] w-[9px] rounded-full bg-white/[0.14]" />
          <span className="h-[9px] w-[9px] rounded-full bg-white/[0.14]" />
        </div>
        <div
          className={cx(
            "truncate text-[11.5px]",
            tone === "terminal" ? "font-mono text-white/62" : "text-white/50",
          )}
        >
          {title}
        </div>
      </div>
      {/* Real empty space for the fade to dissolve. Without it the
          gradient lands on the chat input and the agent summary and
          hides them outright. */}
      <div className={cx(fadeBottom && "pb-24")}>{children}</div>
    </div>
  );
}
