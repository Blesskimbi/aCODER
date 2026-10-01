import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════
   Procedural geometry for the A-Coder mark.

   The logo is a brushed-steel triangle of 7 nested concentric
   triangular frames. Each frame is split into 3 segments with
   gaps at the corners, thinning toward an open centre, with small
   gear/hinge details at some joints.

   Every ring is built from ONE segment geometry instanced 3× at
   120° intervals. That 3-fold symmetry is what makes the twist
   moves land exactly on the assembled mark every time.
   ═══════════════════════════════════════════════════════════════ */

export const RING_COUNT = 7;

/** Corner angles of an upward-pointing equilateral triangle. */
const VERTEX_ANGLES = [90, 210, 330].map((d) => (d * Math.PI) / 180);

export interface RingSpec {
  /** Circumradius of this ring's outer triangle. */
  radius: number;
  /** Width of the frame bar. */
  width: number;
  /** Extrusion depth (centred on z = 0 so flips are symmetric). */
  depth: number;
  /** Linear gap at each end of a segment, in world units. */
  gap: number;
  /** Which corners (0–2) carry a gear detail. */
  gearCorners: number[];
  /** Per-ring roughness jitter, so rings don't read as one slab. */
  roughness: number;
}

/**
 * Seven rings, outer to inner. Radius and width both taper inward,
 * and the gap rotates around the corners so the breaks don't line
 * up into a visible seam.
 */
export function buildRingSpecs(): RingSpec[] {
  const specs: RingSpec[] = [];

  for (let k = 0; k < RING_COUNT; k++) {
    const t = k / (RING_COUNT - 1); // 0 → outer, 1 → inner

    // Radius tapers to leave an open centre hole.
    const radius = 1.0 - t * 0.66;

    // Frames thin toward the middle.
    const width = 0.082 - t * 0.032;

    // Depth thins slightly so the stack reads as layered plate.
    const depth = 0.085 - t * 0.022;

    // Gap grows a little inward, and each ring breaks at a
    // different corner so the seams spiral rather than stack.
    const gap = 0.055 + t * 0.03;

    specs.push({
      radius,
      width,
      depth,
      gap,
      gearCorners: k % 2 === 0 ? [k % 3] : [],
      roughness: 0.26 + (k % 3) * 0.035,
    });
  }

  return specs;
}

/**
 * One segment of a ring: a bevelled bar lying along one side of
 * the triangle, with its outer face flush to the triangle edge.
 *
 * Returned centred on the origin and on z = 0, ready to be placed
 * by `segmentTransform`.
 */
export function createSegmentGeometry(spec: RingSpec): THREE.BufferGeometry {
  const { radius, width, depth, gap } = spec;

  // Side length of an equilateral triangle from its circumradius.
  const sideLength = radius * Math.sqrt(3);
  const barLength = Math.max(sideLength - gap * 2, 0.02);

  const halfL = barLength / 2;
  const halfW = width / 2;

  // A slight mitre on the ends reads as a machined cut rather
  // than a sawn one, and catches the key light along the break.
  const mitre = Math.min(width * 0.55, halfL * 0.5);

  const shape = new THREE.Shape();
  shape.moveTo(-halfL + mitre, -halfW);
  shape.lineTo(halfL - mitre, -halfW);
  shape.lineTo(halfL, halfW);
  shape.lineTo(-halfL, halfW);
  shape.closePath();

  const bevel = Math.min(width * 0.22, depth * 0.34);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelOffset: 0,
    bevelSegments: 2,
    curveSegments: 1,
  });

  // Centre the extrusion on z = 0 — required so that a 180° flip
  // about an in-plane median axis maps the ring exactly onto itself.
  geometry.translate(0, 0, -depth / 2);
  geometry.computeVertexNormals();

  return geometry;
}

/**
 * Placement for segment `i` (0–2) of a ring: rotation about Z and
 * the offset that sits the bar's outer face on the triangle edge.
 */
export function segmentTransform(spec: RingSpec, i: number) {
  const { radius, width } = spec;

  const a = VERTEX_ANGLES[i];
  const b = VERTEX_ANGLES[(i + 1) % 3];

  const v1 = new THREE.Vector2(Math.cos(a), Math.sin(a)).multiplyScalar(radius);
  const v2 = new THREE.Vector2(Math.cos(b), Math.sin(b)).multiplyScalar(radius);

  // Midpoint of the side, pulled inward by half the bar width so
  // the outer face lands exactly on the triangle edge.
  const mid = v1.clone().add(v2).multiplyScalar(0.5);
  const inward = mid.clone().normalize().multiplyScalar(-width / 2);
  const position = mid.add(inward);

  const rotationZ = Math.atan2(v2.y - v1.y, v2.x - v1.x);

  return {
    position: [position.x, position.y, 0] as [number, number, number],
    rotationZ,
  };
}

/**
 * A small gear/hinge detail for the joints. Simple involute-ish
 * teeth — at the scale these render, silhouette is all that reads.
 */
export function createGearGeometry(
  outerRadius: number,
  teeth = 9,
  thickness = 0.03,
): THREE.BufferGeometry {
  const rOuter = outerRadius;
  const rRoot = outerRadius * 0.74;
  const rBore = outerRadius * 0.3;

  const shape = new THREE.Shape();
  const step = (Math.PI * 2) / teeth;

  for (let i = 0; i < teeth; i++) {
    const base = i * step;
    // root → flank → tip → flank, four points per tooth
    const pts: Array<[number, number]> = [
      [rRoot, base],
      [rOuter, base + step * 0.22],
      [rOuter, base + step * 0.42],
      [rRoot, base + step * 0.64],
    ];
    for (const [r, ang] of pts) {
      const x = Math.cos(ang) * r;
      const y = Math.sin(ang) * r;
      if (i === 0 && r === rRoot && ang === base) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
  }
  shape.closePath();

  // Bore
  const hole = new THREE.Path();
  hole.absarc(0, 0, rBore, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: thickness * 0.18,
    bevelSize: thickness * 0.18,
    bevelSegments: 1,
    curveSegments: 6,
  });

  geometry.translate(0, 0, -thickness / 2);
  geometry.computeVertexNormals();

  return geometry;
}

/** World position of corner `i` on a given ring, for gear placement. */
export function cornerPosition(
  spec: RingSpec,
  i: number,
): [number, number, number] {
  const a = VERTEX_ANGLES[i];
  const inset = spec.radius - spec.width * 0.5;
  return [Math.cos(a) * inset, Math.sin(a) * inset, 0];
}

/** Unit vector along the median axis through vertex `i`. Used for flips. */
export function medianAxis(i: number): THREE.Vector3 {
  const a = VERTEX_ANGLES[i];
  return new THREE.Vector3(Math.cos(a), Math.sin(a), 0).normalize();
}
