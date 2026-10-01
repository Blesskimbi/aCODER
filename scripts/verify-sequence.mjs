/**
 * Verifies the central guarantee of the logo animation:
 *
 *   After a scramble of N moves and the inverse replay, every ring
 *   returns to EXACTLY its assembled orientation — and every
 *   intermediate state is itself a symmetry of the mark, so the
 *   logo is never "wrong", only turning.
 *
 * Mirrors the algorithm in src/components/logo3d/useTwistSequence.ts.
 * Run: node scripts/verify-sequence.mjs
 */

import * as THREE from "three";

const RING_COUNT = 7;
const AXIS_Z = new THREE.Vector3(0, 0, 1);
const VERTEX_ANGLES = [90, 210, 330].map((d) => (d * Math.PI) / 180);

const medianAxis = (i) =>
  new THREE.Vector3(
    Math.cos(VERTEX_ANGLES[i]),
    Math.sin(VERTEX_ANGLES[i]),
    0,
  ).normalize();

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (a) => a[Math.floor(Math.random() * a.length)];

function buildScramble() {
  const count = randInt(6, 8);
  const moves = [];
  let lastRings = "";
  for (let i = 0; i < count; i++) {
    const kind = pick(["twist", "twist", "flip", "group"]);
    let move;
    if (kind === "group") {
      const size = randInt(2, 3);
      const start = randInt(0, RING_COUNT - size);
      move = {
        rings: Array.from({ length: size }, (_, n) => start + n),
        axis: AXIS_Z,
        angle: (pick([1, -1]) * Math.PI * 2) / 3,
      };
    } else if (kind === "flip") {
      move = {
        rings: [randInt(0, RING_COUNT - 1)],
        axis: medianAxis(randInt(0, 2)),
        angle: Math.PI,
      };
    } else {
      move = {
        rings: [randInt(0, RING_COUNT - 1)],
        axis: AXIS_Z,
        angle: (pick([1, -1]) * Math.PI * 2) / 3,
      };
    }
    const key = move.rings.join(",");
    if (key === lastRings) {
      i--;
      continue;
    }
    lastRings = key;
    moves.push(move);
  }
  return moves;
}

const invert = (moves) =>
  [...moves].reverse().map((m) => ({ ...m, angle: -m.angle }));

function commit(base, move) {
  const d = new THREE.Quaternion().setFromAxisAngle(move.axis, move.angle);
  for (const r of move.rings) base[r].premultiply(d);
}

/**
 * Is this orientation a symmetry of an upward equilateral triangle
 * frame extruded symmetrically about z = 0? The symmetry group is
 * D3: identity, ±120° about Z, and 180° about each median axis.
 */
function isSymmetry(q) {
  const candidates = [new THREE.Quaternion()];
  for (const a of [(Math.PI * 2) / 3, (-Math.PI * 2) / 3]) {
    candidates.push(new THREE.Quaternion().setFromAxisAngle(AXIS_Z, a));
  }
  for (let i = 0; i < 3; i++) {
    candidates.push(
      new THREE.Quaternion().setFromAxisAngle(medianAxis(i), Math.PI),
    );
  }
  // A quaternion and its negation are the same rotation.
  return candidates.some((c) => {
    const dot = Math.abs(
      q.x * c.x + q.y * c.y + q.z * c.z + q.w * c.w,
    );
    return Math.abs(dot - 1) < 1e-6;
  });
}

const TRIALS = 2000;
let worstReturn = 0;
let symmetryViolations = 0;
let totalIntermediate = 0;

for (let t = 0; t < TRIALS; t++) {
  const base = Array.from({ length: RING_COUNT }, () => new THREE.Quaternion());
  const scramble = buildScramble();

  for (const m of scramble) {
    commit(base, m);
    for (const q of base) {
      totalIntermediate++;
      if (!isSymmetry(q)) symmetryViolations++;
    }
  }

  for (const m of invert(scramble)) commit(base, m);

  // Distance from identity, as an angle in degrees.
  for (const q of base) {
    const ang = 2 * Math.acos(Math.min(1, Math.abs(q.w))) * (180 / Math.PI);
    worstReturn = Math.max(worstReturn, ang);
  }
}

console.log(`trials                       ${TRIALS}`);
console.log(`intermediate states checked   ${totalIntermediate}`);
console.log(`symmetry violations           ${symmetryViolations}`);
console.log(`worst return error (degrees)  ${worstReturn.toExponential(3)}`);

const ok = symmetryViolations === 0 && worstReturn < 1e-6;
console.log(ok ? "\nPASS" : "\nFAIL");
process.exit(ok ? 0 : 1);
