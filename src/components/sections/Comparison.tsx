import { Check, Minus } from "lucide-react";
import {
  Container,
  Section,
  Eyebrow,
  H2,
  Lead,
  cx,
} from "@/components/ui/primitives";

/**
 * Only facts that are publicly verifiable and stable are asserted.
 * Anything about another product's data handling is deliberately left
 * as "See their policy" rather than claimed — see PRODUCT_NOTES.md §9.
 */

type Cell = true | false | string;

const COLUMNS = ["A-Coder", "Cursor", "Windsurf", "VS Code + Copilot"];

const ROWS: Array<{ label: string; cells: Cell[]; note?: string }> = [
  {
    label: "Open-source licence",
    cells: ["Apache-2.0", false, false, "Editor MIT · Copilot proprietary"],
  },
  {
    label: "Cost of the editor",
    cells: ["Free", "Paid plans", "Paid plans", "Editor free · Copilot paid"],
  },
  {
    label: "Bring your own API key",
    cells: [true, "Partial", "Partial", false],
  },
  {
    label: "Local models as a first-class option",
    cells: ["6 runtimes", false, false, false],
  },
  {
    label: "Requests go straight to the provider",
    cells: [true, "See their policy", "See their policy", "See their policy"],
  },
  {
    label: "Built on VS Code",
    cells: [true, true, true, true],
  },
  {
    label: "VS Code extensions and themes",
    cells: [true, true, true, true],
  },
  {
    label: "Built-in tutoring mode",
    cells: [true, false, false, false],
  },
];

function Cellish({ value, strong }: { value: Cell; strong: boolean }) {
  if (value === true)
    return (
      <Check
        className={cx("h-4 w-4", strong ? "text-diff-add" : "text-white/55")}
        aria-label="Yes"
        strokeWidth={2}
      />
    );
  if (value === false)
    return <Minus className="h-4 w-4 text-white/58" aria-label="No" />;
  return (
    <span
      className={cx(
        "text-[12.5px]",
        strong ? "text-steel-50" : "text-white/55",
      )}
    >
      {value}
    </span>
  );
}

export function Comparison() {
  return (
    <Section>
      <Container>
        <div className="max-w-[54ch]">
          <Eyebrow tone="ember">How it compares</Eyebrow>
          <H2 className="mt-4">Verifiable differences only.</H2>
          <Lead className="mt-4">
            No invented benchmarks and no claims about anyone else&apos;s data
            handling. Where a competitor&apos;s behaviour depends on their
            policy, we say so rather than guess.
          </Lead>
        </div>

        {/* Still scrollable on narrow viewports, just without the bar. */}
        <div className="no-scrollbar mt-10 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/[0.09]">
                <th className="w-[34%] py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.16em] font-normal text-white/55">
                  Capability
                </th>
                {COLUMNS.map((c, i) => (
                  <th
                    key={c}
                    className={cx(
                      "py-3 pr-4 text-[12.5px] font-medium",
                      i === 0 ? "text-steel-50" : "text-white/62",
                    )}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-white/[0.05] transition-colors hover:bg-white/[0.015]"
                >
                  <td className="py-3.5 pr-4 text-[13px] text-white/65">
                    {row.label}
                  </td>
                  {row.cells.map((cell, i) => (
                    <td
                      key={i}
                      className={cx(
                        "py-3.5 pr-4",
                        i === 0 && "bg-ember-400/[0.03]",
                      )}
                    >
                      <Cellish value={cell} strong={i === 0} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-5 text-[12px] leading-relaxed text-white/58">
          Competitor details reflect their publicly documented plans and may
          change. Check each vendor&apos;s current terms before relying on
          anything here.
        </p>
      </Container>
    </Section>
  );
}
