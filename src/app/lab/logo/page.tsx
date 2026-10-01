import type { Metadata } from "next";
import Logo3D from "@/components/logo3d/Logo3D";

export const metadata: Metadata = {
  title: "Logo lab",
  robots: { index: false, follow: false },
};

/* Development harness for the 3D mark. Not linked from the site,
   and excluded from indexing. */

const SPECS = [
  ["Rings", "7 nested frames, 3 segments each"],
  ["Moves", "±120° twist · 180° median flip · 2–3 ring group twist"],
  ["Sequence", "assembled 2s → 6–8 scramble → hold → exact reverse"],
  ["Per move", "450–600ms, ease-out-back, 80ms mechanical pause"],
  ["Material", "MeshPhysicalMaterial · metalness 1 · anisotropy 0.75"],
  ["Lighting", "key upper-left 112° · rim lower-right · ember bounce"],
  ["Budget", "DPR ≤ 1.5 · pauses off-screen and on hidden tab"],
];

export default function LogoLabPage() {
  return (
    <main className="min-h-dvh bg-canvas px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-400">
            Lab · not indexed
          </p>
          <h1 className="mt-3 font-display text-4xl font-light tracking-tight text-steel-50">
            The mark, in three dimensions
          </h1>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-white/60">
            Seven nested triangular frames, rebuilt procedurally. Every move
            rotates about a symmetry axis of the triangle, so the scramble is
            always a valid state and the solve always lands on the exact logo.
            Hover or click to trigger an extra scramble.
          </p>
        </header>

        <div className="rake-edge rake relative overflow-hidden rounded-panel bg-canvas-deep">
          <div className="grid place-items-center p-6 sm:p-10">
            <Logo3D className="relative aspect-square w-full max-w-[560px]" />
          </div>
        </div>

        <dl className="mt-12 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {SPECS.map(([term, detail]) => (
            <div
              key={term}
              className="flex flex-col gap-1 border-t border-white/[0.07] pt-4"
            >
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/62">
                {term}
              </dt>
              <dd className="text-[13px] leading-relaxed text-white/75">
                {detail}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </main>
  );
}
