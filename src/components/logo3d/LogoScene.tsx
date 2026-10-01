"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import * as THREE from "three";

import {
  RING_COUNT,
  buildRingSpecs,
  createSegmentGeometry,
  createGearGeometry,
  segmentTransform,
  cornerPosition,
} from "./geometry";
import { useTwistSequence } from "./useTwistSequence";

/* ═══════════════════════════════════════════════════════════════
   The mark, rebuilt in 3D.

   Lighting follows the identity: a single strong key from the
   upper left at the same 112° rake as the CSS, a soft rim to
   separate the silhouette from the ground, and a near-black
   smoky backdrop. Ember appears only as a faint bounce, so the
   metal stays the subject.
   ═══════════════════════════════════════════════════════════════ */

const KEY_COLOUR = "#FFF4EC";
const RIM_COLOUR = "#9FB4C8";
const EMBER_BOUNCE = "#FF8A4C";

interface RingsProps {
  reducedMotion: boolean;
  paused: React.RefObject<boolean>;
  pointer: React.RefObject<{ x: number; y: number }>;
}

function Rings({ reducedMotion, paused, pointer }: RingsProps) {
  const specs = useMemo(() => buildRingSpecs(), []);
  const sequence = useTwistSequence();

  const rootRef = useRef<THREE.Group>(null);
  const ringRefs = useRef<Array<THREE.Group | null>>([]);
  const gearRefs = useRef<Array<THREE.Mesh | null>>([]);

  // Build geometries once. Each ring gets one segment geometry
  // instanced 3× — that shared symmetry is what makes the twists land.
  const geometries = useMemo(
    () => specs.map((s) => createSegmentGeometry(s)),
    [specs],
  );

  const gearGeometries = useMemo(
    () => specs.map((s) => createGearGeometry(s.width * 0.82, 9, s.depth * 0.6)),
    [specs],
  );

  // Flattened so every gear has a stable index. Previously these were
  // collected by resetting the ref array during render, which mutates
  // a ref mid-render and can desync from the committed tree.
  const gearList = useMemo(
    () =>
      specs.flatMap((spec, ring) =>
        spec.gearCorners.map((corner) => ({ ring, corner })),
      ),
    [specs],
  );

  const materials = useMemo(
    () =>
      specs.map(
        (s) =>
          new THREE.MeshPhysicalMaterial({
            // Slightly blue-cool base. A neutral grey picked up too
            // much warmth from the key and read as bronze.
            color: new THREE.Color("#CFD6DE"),
            metalness: 1,
            roughness: s.roughness,
            // Brushed steel: anisotropic highlights stretched along
            // the bar rather than a mirror-round specular.
            anisotropy: 0.75,
            anisotropyRotation: 0,
            envMapIntensity: 1.35,
            clearcoat: 0.08,
            clearcoatRoughness: 0.4,
          }),
      ),
    [specs],
  );

  const gearMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#8F979F"),
        metalness: 1,
        roughness: 0.42,
        envMapIntensity: 1.1,
      }),
    [],
  );

  const tiltTarget = useRef({ x: 0, y: 0 });
  const elapsed = useRef(0);

  useFrame((_, rawDelta) => {
    if (paused.current) return;

    // Clamp delta so a backgrounded tab doesn't fast-forward the
    // sequence on return.
    const delta = Math.min(rawDelta, 1 / 20);

    if (!reducedMotion) {
      elapsed.current += delta;
      sequence.advance(delta);
    }

    // Write settled or animating orientation into each ring group.
    for (let i = 0; i < RING_COUNT; i++) {
      const g = ringRefs.current[i];
      if (!g) continue;
      g.quaternion.copy(reducedMotion ? sequence.base[i] : sequence.live[i]);
    }

    const root = rootRef.current;
    if (!root) return;

    if (reducedMotion) {
      root.rotation.set(0, 0, 0);
      root.position.set(0, 0, 0);
      return;
    }

    // Damped mouse-tilt parallax.
    tiltTarget.current.x = pointer.current.y * 0.19;
    tiltTarget.current.y = pointer.current.x * 0.26;

    const damp = 1 - Math.pow(0.0015, delta);
    root.rotation.x += (tiltTarget.current.x - root.rotation.x) * damp;
    root.rotation.y += (tiltTarget.current.y - root.rotation.y) * damp;

    // Slow idle float — long period, so it reads as breathing.
    root.position.y = Math.sin(elapsed.current * 0.46) * 0.032;
    root.rotation.z = Math.sin(elapsed.current * 0.31) * 0.022;

    if (process.env.NODE_ENV !== "production") {
      (window as unknown as Record<string, unknown>).__acoderLogo = {
        moving: sequence.isMoving.current,
        progress: Number(sequence.moveProgress.current.toFixed(2)),
        // Rotation magnitude of each ring, in degrees.
        ringAngles: ringRefs.current.map((g) =>
          g
            ? Number(
                (
                  2 *
                  Math.acos(Math.min(1, Math.abs(g.quaternion.w))) *
                  (180 / Math.PI)
                ).toFixed(1),
              )
            : null,
        ),
      };
    }

    // Gears spin only while a move is actually turning.
    const spin = sequence.isMoving.current ? 1 : 0;
    for (let i = 0; i < gearRefs.current.length; i++) {
      const gear = gearRefs.current[i];
      if (!gear) continue;
      gear.rotation.z += delta * 5.5 * spin * (i % 2 === 0 ? 1 : -1);
    }
  });

  return (
    <group
      ref={rootRef}
      // Breathing room, so a flip never clips the canvas edge.
      scale={0.86}
      onPointerDown={() => sequence.pulse()}
      onPointerOver={() => sequence.pulse()}
    >
      {specs.map((spec, k) => (
        <group
          key={k}
          ref={(el) => {
            ringRefs.current[k] = el;
          }}
        >
          {[0, 1, 2].map((i) => {
            const { position, rotationZ } = segmentTransform(spec, i);
            return (
              <mesh
                key={i}
                geometry={geometries[k]}
                material={materials[k]}
                position={position}
                rotation={[0, 0, rotationZ]}
                castShadow
                receiveShadow
              />
            );
          })}

          {spec.gearCorners.map((corner) => {
            const gearIndex = gearList.findIndex(
              (g) => g.ring === k && g.corner === corner,
            );
            return (
              <mesh
                key={`gear-${corner}`}
                ref={(el) => {
                  gearRefs.current[gearIndex] = el;
                }}
                geometry={gearGeometries[k]}
                material={gearMaterial}
                position={cornerPosition(spec, corner)}
              />
            );
          })}
        </group>
      ))}
    </group>
  );
}

/** Slow-drifting volumetric haze behind the mark. */
function Smoke({ paused }: { paused: React.RefObject<boolean> }) {
  const ref = useRef<THREE.Group>(null);

  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    // Kept very low — at higher alpha the additive planes formed a
    // visible lighter rectangle against the page background.
    g.addColorStop(0, "rgba(150,170,195,0.085)");
    g.addColorStop(0.42, "rgba(120,140,170,0.03)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // Kept well inside the frustum. Larger puffs ran past the canvas
  // edges and cut off square, drawing a visible box on the page.
  const puffs = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        position: [
          Math.cos((i / 5) * Math.PI * 2) * 0.62,
          Math.sin((i / 5) * Math.PI * 2) * 0.42,
          -0.9 - i * 0.16,
        ] as [number, number, number],
        scale: 1.9 + i * 0.32,
        speed: 0.012 + i * 0.004,
      })),
    [],
  );

  useFrame((_, delta) => {
    if (paused.current || !ref.current) return;
    ref.current.children.forEach((child, i) => {
      child.rotation.z += delta * puffs[i].speed;
    });
  });

  return (
    <group ref={ref}>
      {puffs.map((p, i) => (
        <mesh key={i} position={p.position} scale={p.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={texture}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            opacity={0.32}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Caps device pixel ratio without fighting the renderer each frame. */
function DprGuard({ max = 1.5 }: { max?: number }) {
  const { gl } = useThree();
  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, max));
  }, [gl, max]);
  return null;
}

export interface LogoSceneProps {
  reducedMotion?: boolean;
  /** False when scrolled out of view — stops the render loop entirely. */
  active?: boolean;
  className?: string;
}

export default function LogoScene({
  reducedMotion = false,
  active = true,
  className,
}: LogoSceneProps) {
  // Seed from the current state — the tab may already be hidden on
  // first mount, so this cannot start as a bare `false`.
  const paused = useRef(
    typeof document !== "undefined" ? document.hidden : false,
  );
  const pointer = useRef({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);

  // Pause on a hidden tab. Off-screen pausing is handled by `active`,
  // which drops the frameloop rather than just skipping work.
  useEffect(() => {
    const onVisibility = () => {
      paused.current = document.hidden;
    };
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div
      ref={wrapRef}
      className={className}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        pointer.current.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      }}
      onPointerLeave={() => {
        pointer.current.x = 0;
        pointer.current.y = 0;
      }}
    >
      <Canvas
        // Long lens, pulled back. A wide FOV made the nested rings
        // recede into a pyramid; the real mark reads flat and emblematic.
        camera={{ position: [0, 0, 4.6], fov: 26 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        frameloop={reducedMotion || !active ? "demand" : "always"}
      >
        <DprGuard />

        {/* No background colour — alpha:true lets the page show through,
            so the scene has no visible box edge. */}

        {/* Key light, upper-left — the same 112° rake as the CSS. */}
        <directionalLight
          position={[-3.6, 3.4, 2.8]}
          intensity={3.4}
          color={KEY_COLOUR}
        />
        {/* Cool fill from the right keeps the metal reading as steel. */}
        <directionalLight
          position={[3.2, -1.8, -2.2]}
          intensity={1.5}
          color={RIM_COLOUR}
        />
        <directionalLight
          position={[2.6, 2.4, 1.2]}
          intensity={0.9}
          color="#DCE6F0"
        />
        {/* Ember is a whisper, not a wash. At 2.2 it turned the whole
            mark copper; the metal has to stay the subject. */}
        <pointLight
          position={[2.2, -1.9, 1.4]}
          intensity={0.45}
          distance={5.5}
          color={EMBER_BOUNCE}
        />
        <ambientLight intensity={0.22} color="#C8D4E0" />

        {/* Procedural studio environment — no CDN fetch, and exact
            control over the reflections that define brushed steel. */}
        <Environment resolution={256}>
          <Lightformer
            form="rect"
            intensity={5}
            position={[-2.4, 2.2, 2]}
            scale={[4, 3, 1]}
            target={[0, 0, 0]}
            color="#FFFFFF"
          />
          <Lightformer
            form="rect"
            intensity={2.4}
            position={[3, -1, -1.5]}
            scale={[3, 2, 1]}
            target={[0, 0, 0]}
            color="#AFC2D4"
          />
          {/* A cold bar reflection along the bars is what actually
              sells brushed steel in the anisotropic highlight. */}
          <Lightformer
            form="rect"
            intensity={1.8}
            position={[-1.2, -2.6, 1.4]}
            scale={[5, 0.6, 1]}
            target={[0, 0, 0]}
            color="#E6EEF6"
          />
          <Lightformer
            form="circle"
            intensity={0.3}
            position={[1.6, -1.6, 1.8]}
            scale={[1.2, 1.2, 1]}
            target={[0, 0, 0]}
            color="#FF8A4C"
          />
          <Lightformer
            form="rect"
            intensity={0.5}
            position={[0, -3, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[6, 6, 1]}
            color="#1A1D21"
          />
        </Environment>

        <Smoke paused={paused} />
        <Rings
          reducedMotion={reducedMotion}
          paused={paused}
          pointer={pointer}
        />

        {!reducedMotion && (
          <EffectComposer>
            <Bloom
              intensity={0.42}
              luminanceThreshold={0.62}
              luminanceSmoothing={0.28}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.24} darkness={0.82} />
            <Noise opacity={0.028} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
