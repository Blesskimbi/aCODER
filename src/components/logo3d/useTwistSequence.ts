"use client";

import { useCallback, useMemo, useRef } from "react";
import * as THREE from "three";
import { RING_COUNT, medianAxis } from "./geometry";

/* ═══════════════════════════════════════════════════════════════
   useTwistSequence

   Drives the assembled → scramble → hold → solve → assembled loop.

   Every move is a rotation about a symmetry axis of the mark, so
   the scrambled state is always a *valid* configuration and the
   solve always lands on the exact logo:

     · twist  — ±120° about Z (3-fold rotational symmetry)
     · flip   — 180° about a median axis through a vertex
     · group  — a twist applied to 2–3 adjacent rings together

   Moves are stored as (axis, angle) and applied by pre-multiplying
   into the parent frame. Solving replays the same axes with negated
   angles in reverse order, so the rings return to identity exactly
   rather than approximately.
   ═══════════════════════════════════════════════════════════════ */

const AXIS_Z = new THREE.Vector3(0, 0, 1);

const SCRAMBLE_MIN = 6;
const SCRAMBLE_MAX = 8;

const MOVE_MS_MIN = 450;
const MOVE_MS_MAX = 600;

/** Mechanical pause between moves — matches the reference's --fx-hold. */
const INTER_MOVE_MS = 80;

const HOLD_ASSEMBLED_MS = 2000;
const HOLD_SCRAMBLED_MS = 420;

interface Move {
  rings: number[];
  axis: THREE.Vector3;
  angle: number;
  durationMs: number;
}

type Phase = "holdAssembled" | "scramble" | "holdScrambled" | "solve";

/** Ease-out with a small overshoot, then settle. Snappy, mechanical. */
function easeOutBackSmall(t: number): number {
  const c1 = 0.9;
  const c3 = c1 + 1;
  const p = t - 1;
  return 1 + c3 * p * p * p + c1 * p * p;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildScramble(): Move[] {
  const count = randInt(SCRAMBLE_MIN, SCRAMBLE_MAX);
  const moves: Move[] = [];
  let lastRings = "";

  for (let i = 0; i < count; i++) {
    const kind = pick(["twist", "twist", "flip", "group"] as const);
    const durationMs = randInt(MOVE_MS_MIN, MOVE_MS_MAX);

    let move: Move;

    if (kind === "group") {
      // 2–3 adjacent rings twisting as one assembly.
      const size = randInt(2, 3);
      const start = randInt(0, RING_COUNT - size);
      const rings = Array.from({ length: size }, (_, n) => start + n);
      move = {
        rings,
        axis: AXIS_Z,
        angle: (pick([1, -1]) * Math.PI * 2) / 3,
        durationMs,
      };
    } else if (kind === "flip") {
      const ring = randInt(0, RING_COUNT - 1);
      move = {
        rings: [ring],
        axis: medianAxis(randInt(0, 2)),
        angle: Math.PI,
        durationMs,
      };
    } else {
      const ring = randInt(0, RING_COUNT - 1);
      move = {
        rings: [ring],
        axis: AXIS_Z,
        angle: (pick([1, -1]) * Math.PI * 2) / 3,
        durationMs,
      };
    }

    // Avoid two consecutive moves on exactly the same rings — it
    // reads as a stutter rather than as a sequence.
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

function invert(moves: Move[]): Move[] {
  return [...moves]
    .reverse()
    .map((m) => ({ ...m, angle: -m.angle }));
}

export interface TwistSequence {
  /** Settled orientation of each ring; the animation base. */
  base: THREE.Quaternion[];
  /** Live orientation of each ring, written every frame. */
  live: THREE.Quaternion[];
  /** 0–1 progress through the current move, for gear spin. */
  moveProgress: React.RefObject<number>;
  /** True while a move is actually turning. */
  isMoving: React.RefObject<boolean>;
  /** Advance the sequencer. Call once per frame with delta seconds. */
  advance: (delta: number) => void;
  /** Trigger an extra quick scramble-and-solve (click / hover). */
  pulse: () => void;
  /** Snap every ring to assembled — used for reduced-motion. */
  reset: () => void;
}

export function useTwistSequence(): TwistSequence {
  const base = useMemo(
    () => Array.from({ length: RING_COUNT }, () => new THREE.Quaternion()),
    [],
  );
  const live = useMemo(
    () => Array.from({ length: RING_COUNT }, () => new THREE.Quaternion()),
    [],
  );

  const moveProgress = useRef(0);
  const isMoving = useRef(false);

  const phase = useRef<Phase>("holdAssembled");
  const phaseElapsed = useRef(0);

  const queue = useRef<Move[]>([]);
  const scrambleRef = useRef<Move[]>([]);
  const moveIndex = useRef(0);
  const moveElapsed = useRef(0);
  const interPause = useRef(0);

  // Scratch objects — allocating quaternions per frame would churn GC.
  const scratchDelta = useMemo(() => new THREE.Quaternion(), []);
  const pendingPulse = useRef(false);

  const applyMoveToLive = useCallback(
    (move: Move, easedT: number) => {
      scratchDelta.setFromAxisAngle(move.axis, move.angle * easedT);
      for (const r of move.rings) {
        live[r].copy(scratchDelta).multiply(base[r]);
      }
    },
    [base, live, scratchDelta],
  );

  const commitMove = useCallback(
    (move: Move) => {
      scratchDelta.setFromAxisAngle(move.axis, move.angle);
      for (const r of move.rings) {
        base[r].premultiply(scratchDelta);
        live[r].copy(base[r]);
      }
    },
    [base, live, scratchDelta],
  );

  const reset = useCallback(() => {
    for (let i = 0; i < RING_COUNT; i++) {
      base[i].identity();
      live[i].identity();
    }
    phase.current = "holdAssembled";
    phaseElapsed.current = 0;
    queue.current = [];
    moveIndex.current = 0;
    moveElapsed.current = 0;
    isMoving.current = false;
    moveProgress.current = 0;
  }, [base, live]);

  const pulse = useCallback(() => {
    pendingPulse.current = true;
  }, []);

  const advance = useCallback(
    (delta: number) => {
      const ms = delta * 1000;

      // A pulse cuts the assembled hold short and starts immediately.
      if (
        pendingPulse.current &&
        phase.current === "holdAssembled"
      ) {
        pendingPulse.current = false;
        phaseElapsed.current = HOLD_ASSEMBLED_MS;
      }

      switch (phase.current) {
        case "holdAssembled": {
          phaseElapsed.current += ms;
          isMoving.current = false;
          moveProgress.current = 0;
          if (phaseElapsed.current >= HOLD_ASSEMBLED_MS) {
            scrambleRef.current = buildScramble();
            queue.current = scrambleRef.current;
            moveIndex.current = 0;
            moveElapsed.current = 0;
            interPause.current = 0;
            phase.current = "scramble";
          }
          break;
        }

        case "holdScrambled": {
          phaseElapsed.current += ms;
          isMoving.current = false;
          moveProgress.current = 0;
          if (phaseElapsed.current >= HOLD_SCRAMBLED_MS) {
            queue.current = invert(scrambleRef.current);
            moveIndex.current = 0;
            moveElapsed.current = 0;
            interPause.current = 0;
            phase.current = "solve";
          }
          break;
        }

        case "scramble":
        case "solve": {
          const moves = queue.current;

          if (moveIndex.current >= moves.length) {
            phaseElapsed.current = 0;
            phase.current =
              phase.current === "scramble" ? "holdScrambled" : "holdAssembled";
            isMoving.current = false;
            moveProgress.current = 0;
            break;
          }

          // Short mechanical pause between moves.
          if (interPause.current > 0) {
            interPause.current -= ms;
            isMoving.current = false;
            break;
          }

          const move = moves[moveIndex.current];
          moveElapsed.current += ms;

          const t = Math.min(moveElapsed.current / move.durationMs, 1);
          const eased = t >= 1 ? 1 : easeOutBackSmall(t);

          isMoving.current = true;
          moveProgress.current = t;
          applyMoveToLive(move, eased);

          if (t >= 1) {
            commitMove(move);
            moveIndex.current += 1;
            moveElapsed.current = 0;
            interPause.current = INTER_MOVE_MS;
            isMoving.current = false;
          }
          break;
        }
      }
    },
    [applyMoveToLive, commitMove],
  );

  return { base, live, moveProgress, isMoving, advance, pulse, reset };
}
