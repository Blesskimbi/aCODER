"use client";

import { useRef } from "react";
import {
  OrbitControls,
  AsciiRenderer as AsciiEffectPass,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * ASCII-rendered torus knot.
 *
 * ── How the luminance mapping actually works ──────────────────────
 * AsciiEffect picks a glyph from the ramp by brightness:
 *
 *     iCharIdx = round((1 - brightness) * maxIdx)
 *     if (invert) iCharIdx = maxIdx - iCharIdx
 *     if (alpha === 0) brightness = 1        // transparent is "bright"
 *
 * drei's AsciiRenderer defaults to `invert: true`. With that default a
 * transparent background is forced to brightness 1, inverted to maxIdx,
 * and drawn as '#' — which is where the solid field of '#' came from.
 * It was never a background colour; it was the empty space being
 * rendered as the densest glyph.
 *
 * So: invert={false}, and the mesh is dark. Then
 *   · transparent background → brightness 1 → index 0 → space
 *   · dark mesh              → low brightness → dense glyphs
 * The figure is the only thing drawn, and the page shows through
 * everywhere else. Glyph colour comes from fgColor, not the scene, so
 * the mesh being dark has no bearing on how it looks.
 *
 * `color` stays false: per-character RGB sampling is what produced the
 * red/cyan fringing, and monochrome is what we want.
 */
export const AsciiRenderer = () => {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <Canvas gl={{ alpha: true }}>
      <ambientLight intensity={0.45} />
      <pointLight position={[10, 10, 10]} intensity={0.9} />
      <directionalLight position={[-10, -10, -5]} intensity={0.7} />
      <Torusknot reducedMotion={reducedMotion} />
      <OrbitControls enabled={!reducedMotion} />
      <AsciiEffectPass
        // Index 0 is the space, so the empty background stays empty;
        // every lit index resolves to '*', giving a uniform asterisk
        // figure rather than a mixed-glyph gradient.
        characters=" ****"
        // White figure. Set from CSS, so the scene stays dark.
        fgColor="#FFFFFF"
        // No box — the page background shows through.
        bgColor="transparent"
        // Off. See the note above: the default (true) is what painted
        // the empty background as a solid field of '#'.
        invert={false}
        // Monochrome — per-character RGB is the source of the fringing.
        color={false}
        resolution={0.15}
      />
    </Canvas>
  );
};

const Torusknot = ({ reducedMotion }: { reducedMotion: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current || reducedMotion) return;
    meshRef.current.rotation.x = meshRef.current.rotation.y += delta / 2;
  });

  return (
    <mesh ref={meshRef} scale={1.25}>
      <torusKnotGeometry args={[1, 0.2, 128, 32]} />
      {/* Dark on purpose — this is what puts the figure at the dense end
          of the ramp. The visible colour is fgColor above. */}
      <meshStandardMaterial color="#232323" roughness={0.9} metalness={0} />
    </mesh>
  );
};

export default AsciiRenderer;
