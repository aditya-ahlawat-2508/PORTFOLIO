import type { Primitive, Vec3 } from "./formations";

type Rng = () => number;

/** Gaussian-ish from three uniforms — cheaper than Box-Muller and smooth enough. */
function bell(rng: Rng): number {
  return (rng() + rng() + rng()) / 1.5 - 1;
}

function sampleNode(p: Extract<Primitive, { kind: "node" }>, rng: Rng, out: Float32Array, o: number) {
  // Cube-root radius keeps density even through the volume instead of clumping
  // at the centre.
  const r = p.radius * Math.cbrt(rng());
  const theta = rng() * Math.PI * 2;
  const phi = Math.acos(2 * rng() - 1);
  const s = Math.sin(phi);
  out[o] = p.at[0] + r * s * Math.cos(theta);
  out[o + 1] = p.at[1] + r * s * Math.sin(theta);
  out[o + 2] = p.at[2] + r * Math.cos(phi);
  out[o + 3] = p.aux ?? 0;
}

function sampleEdge(p: Extract<Primitive, { kind: "edge" }>, rng: Rng, out: Float32Array, o: number) {
  const t = rng();
  const { from, to } = p;

  let x: number, y: number, z: number;
  if (p.bow) {
    // Quadratic bezier bowed perpendicular to the segment, so graph edges read
    // as curves rather than a wire cage.
    const mx = (from[0] + to[0]) / 2;
    const my = (from[1] + to[1]) / 2;
    const mz = (from[2] + to[2]) / 2;
    const dx = to[0] - from[0];
    const dz = to[2] - from[2];
    // cross(d, worldUp) = (-dz, 0, dx). Degenerate only when the segment is
    // exactly vertical, in which case bow along +x instead of losing the curve.
    let px = -dz;
    let py = 0;
    let pz = dx;
    let plen = Math.hypot(px, py, pz);
    if (plen < 1e-6) {
      px = 1;
      py = 0;
      pz = 0;
      plen = 1;
    }
    px /= plen;
    py /= plen;
    pz /= plen;
    const cx = mx + px * p.bow;
    const cy = my + py * p.bow;
    const cz = mz + pz * p.bow;
    const u = 1 - t;
    x = u * u * from[0] + 2 * u * t * cx + t * t * to[0];
    y = u * u * from[1] + 2 * u * t * cy + t * t * to[1];
    z = u * u * from[2] + 2 * u * t * cz + t * t * to[2];
  } else {
    x = from[0] + (to[0] - from[0]) * t;
    y = from[1] + (to[1] - from[1]) * t;
    z = from[2] + (to[2] - from[2]) * t;
  }

  out[o] = x + bell(rng) * p.thickness;
  out[o + 1] = y + bell(rng) * p.thickness;
  out[o + 2] = z + bell(rng) * p.thickness;
  const a0 = p.auxFrom ?? 0;
  const a1 = p.auxTo ?? a0;
  out[o + 3] = a0 + (a1 - a0) * t;
}

function samplePlane(p: Extract<Primitive, { kind: "plane" }>, rng: Rng, out: Float32Array, o: number) {
  out[o] = p.center[0] + (rng() - 0.5) * p.size[0];
  out[o + 1] = p.center[1] + bell(rng) * p.jitter;
  out[o + 2] = p.center[2] + (rng() - 0.5) * p.size[1];
  out[o + 3] = p.aux ?? 0;
}

function sampleShell(p: Extract<Primitive, { kind: "shell" }>, rng: Rng, out: Float32Array, o: number) {
  const r = p.radius + bell(rng) * p.thickness;
  const theta = rng() * Math.PI * 2;
  const phi = Math.acos(2 * rng() - 1);
  const s = Math.sin(phi);
  out[o] = p.center[0] + r * s * Math.cos(theta);
  out[o + 1] = p.center[1] + r * s * Math.sin(theta);
  out[o + 2] = p.center[2] + r * Math.cos(phi);
  out[o + 3] = p.aux ?? 0;
}

function sampleScatter(p: Extract<Primitive, { kind: "scatter" }>, rng: Rng, out: Float32Array, o: number) {
  out[o] = p.center[0] + bell(rng) * p.extent[0];
  out[o + 1] = p.center[1] + bell(rng) * p.extent[1];
  out[o + 2] = p.center[2] + bell(rng) * p.extent[2];
  out[o + 3] = p.aux ?? 0;
}

/** Write one particle's (x, y, z, aux) for `prim` into `out` at offset `o`. */
export function samplePrimitive(prim: Primitive, rng: Rng, out: Float32Array, o: number): void {
  switch (prim.kind) {
    case "node":
      return sampleNode(prim, rng, out, o);
    case "edge":
      return sampleEdge(prim, rng, out, o);
    case "plane":
      return samplePlane(prim, rng, out, o);
    case "shell":
      return sampleShell(prim, rng, out, o);
    case "scatter":
      return sampleScatter(prim, rng, out, o);
  }
}

export type { Vec3 };
