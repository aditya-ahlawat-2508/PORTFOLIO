import { FORMATIONS, type Formation } from "./formations";
import { mulberry32 } from "./rng";
import { samplePrimitive } from "./sampling";

/**
 * Bakes every formation into one RGBA float buffer laid out as a texture array:
 *
 *   layer f, texel i  ->  (x, y, z, aux)
 *
 * All formations live on the GPU at once, so morphing between any two of them
 * is just two integer uniforms and a lerp — no per-transition buffer re-upload,
 * which is what would otherwise cause a visible hitch mid-scroll.
 */

export interface BakedField {
  /** length = formationCount * count * 4 */
  positions: Float32Array;
  /** length = count * 4 — three uniform randoms plus a per-particle stagger. */
  seeds: Float32Array;
  count: number;
  width: number;
  height: number;
  formationCount: number;
}

function bakeFormation(
  formation: Formation,
  count: number,
  target: Float32Array,
  layerOffset: number,
  seed: number
): void {
  const rng = mulberry32(seed);
  const prims = formation.primitives;
  const totalWeight = prims.reduce((s, p) => s + p.weight, 0);

  let written = 0;
  for (let pi = 0; pi < prims.length; pi++) {
    const prim = prims[pi];
    // Last primitive absorbs the rounding remainder so we always fill exactly
    // `count` particles — a partially-filled layer shows up as particles
    // stranded at the origin.
    const share =
      pi === prims.length - 1
        ? count - written
        : Math.floor((prim.weight / totalWeight) * count);

    for (let k = 0; k < share; k++) {
      samplePrimitive(prim, rng, target, layerOffset + (written + k) * 4);
    }
    written += share;
  }
}

export function bakeField(count: number, width: number, height: number): BakedField {
  if (width * height !== count) {
    throw new Error(`bakeField: width*height (${width * height}) must equal count (${count})`);
  }

  const formationCount = FORMATIONS.length;
  const positions = new Float32Array(formationCount * count * 4);

  FORMATIONS.forEach((formation, f) => {
    // Seed per formation index, not per id, so output is stable across renames.
    bakeFormation(formation, count, positions, f * count * 4, 0x9e37 + f * 7919);
  });

  const seeds = new Float32Array(count * 4);
  const rng = mulberry32(0x5f3a);
  for (let i = 0; i < count; i++) {
    seeds[i * 4] = rng();
    seeds[i * 4 + 1] = rng();
    seeds[i * 4 + 2] = rng();
    seeds[i * 4 + 3] = rng();
  }

  return { positions, seeds, count, width, height, formationCount };
}
