/**
 * Authored formation data. Pure numbers — no `three` import, so this module is
 * safe to pull into any bundle and cheap to test.
 *
 * Every formation is a list of primitives with a `weight`. The baker
 * (`bake.ts`) distributes the particle budget across primitives in proportion
 * to weight, then scatters particles onto each primitive with a seeded PRNG.
 *
 * `aux` is a free per-particle scalar the shaders read. Its meaning is
 * per-formation:
 *   - pipeline formations: normalised position along the pipeline (drives the
 *     travelling signal pulse)
 *   - layered formations:  which layer the particle belongs to (drives tint)
 *   - everything else:     a static tint offset
 */

export type FormationId =
  | "boot"
  | "entry"
  | "state"
  | "run"
  | "build_aws"
  | "build_tripmate"
  | "build_meetingpoint"
  | "stack"
  | "solve"
  | "reach";

export type Vec3 = [number, number, number];

export type Primitive =
  | { kind: "node"; at: Vec3; radius: number; weight: number; aux?: number }
  | {
      kind: "edge";
      from: Vec3;
      to: Vec3;
      bow?: number;
      thickness: number;
      weight: number;
      auxFrom?: number;
      auxTo?: number;
    }
  | {
      kind: "plane";
      center: Vec3;
      size: [number, number];
      jitter: number;
      weight: number;
      aux?: number;
    }
  | {
      kind: "shell";
      center: Vec3;
      radius: number;
      thickness: number;
      weight: number;
      aux?: number;
    }
  | {
      kind: "scatter";
      center: Vec3;
      extent: Vec3;
      weight: number;
      aux?: number;
    };

export interface Formation {
  id: FormationId;
  primitives: Primitive[];
}

/* ------------------------------------------------------------------ *
 * entry — the 7-node graph of the site itself.
 *
 * Coordinates are derived from the 2D `heroPositions` in
 * components/graph/graph-data.ts so the WebGL graph and the SVG rail nav
 * describe the same shape. z is hand-set to give the graph real depth.
 * ------------------------------------------------------------------ */

/**
 * Deliberately wide z-spread. At the hero camera distance a shallow layout reads
 * as a flat zigzag; pushing nodes well apart in depth (combined with the slow
 * rotation of the whole field) is what makes it legible as a 3D graph.
 */
export const SITE_NODES: { id: string; at: Vec3 }[] = [
  { id: "entry", at: [0.0, 6.4, 1.5] },
  { id: "state", at: [5.4, 3.9, -6.5] },
  { id: "run", at: [-2.4, 2.0, 6.0] },
  { id: "build", at: [4.8, -0.7, -3.0] },
  { id: "stack", at: [-4.2, -2.7, 6.8] },
  { id: "solve", at: [3.0, -4.9, -5.5] },
  { id: "reach", at: [-4.6, -6.9, 2.5] },
];

/**
 * Extra chords across the sequence. The spine alone is a polyline; these are
 * what make it read as a graph rather than a zigzag.
 */
const SITE_CHORDS: [number, number][] = [
  [0, 3],
  [1, 4],
  [2, 5],
  [3, 6],
  [0, 2],
];

function siteGraph(): Primitive[] {
  const out: Primitive[] = [];
  const last = SITE_NODES.length - 1;

  SITE_NODES.forEach((n, i) => {
    out.push({ kind: "node", at: n.at, radius: 0.34, weight: 3, aux: i / last });
  });

  // Spine — the traversal order.
  for (let i = 0; i < last; i++) {
    out.push({
      kind: "edge",
      from: SITE_NODES[i].at,
      to: SITE_NODES[i + 1].at,
      bow: 1.1,
      thickness: 0.055,
      weight: 4,
      auxFrom: i / last,
      auxTo: (i + 1) / last,
    });
  }

  // Chords — fainter, so the spine still reads as the primary path.
  SITE_CHORDS.forEach(([a, b]) => {
    out.push({
      kind: "edge",
      from: SITE_NODES[a].at,
      to: SITE_NODES[b].at,
      bow: 2.4,
      thickness: 0.04,
      weight: 1.4,
      auxFrom: a / last,
      auxTo: b / last,
    });
  });

  return out;
}

/* ------------------------------------------------------------------ *
 * build_aws — the 3-layer serverless stack, as three stacked planes with
 * vertical connectors. Terraform (bottom, provisions) -> Lambda / API
 * Gateway (middle) -> Streamlit (top, what the user sees).
 * ------------------------------------------------------------------ */

const AWS_LAYER_Y = [-4.2, 0, 4.2];

function awsStack(): Primitive[] {
  const out: Primitive[] = [];
  AWS_LAYER_Y.forEach((y, i) => {
    out.push({
      kind: "plane",
      center: [0, y, 0],
      size: [11, 7.5],
      jitter: 0.22,
      weight: 6,
      aux: 0.15 + i * 0.4,
    });
  });
  // Vertical connectors between layers, at the plane corners and centre.
  const posts: [number, number][] = [
    [-4.2, -2.6],
    [4.2, -2.6],
    [-4.2, 2.6],
    [4.2, 2.6],
    [0, 0],
  ];
  for (let i = 0; i < AWS_LAYER_Y.length - 1; i++) {
    posts.forEach(([px, pz]) => {
      out.push({
        kind: "edge",
        from: [px, AWS_LAYER_Y[i], pz],
        to: [px, AWS_LAYER_Y[i + 1], pz],
        thickness: 0.04,
        weight: 0.9,
        auxFrom: 0.15 + i * 0.4,
        auxTo: 0.15 + (i + 1) * 0.4,
      });
    });
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * build_tripmate — the 5-agent LangGraph pipeline as a line. `aux` carries
 * normalised position along the chain, which is what the travelling pulse
 * rides on in the vertex shader.
 * ------------------------------------------------------------------ */

export const TRIPMATE_AGENTS = ["flight", "hotel", "weather", "itinerary", "response"];

function tripmatePipeline(): Primitive[] {
  const out: Primitive[] = [];
  const n = TRIPMATE_AGENTS.length;
  const span = 15;
  const xs = TRIPMATE_AGENTS.map((_, i) => -span / 2 + (span * i) / (n - 1));

  xs.forEach((x, i) => {
    const t = i / (n - 1);
    out.push({ kind: "node", at: [x, 0, 0], radius: 0.5, weight: 4, aux: t });
  });
  for (let i = 0; i < n - 1; i++) {
    out.push({
      kind: "edge",
      from: [xs[i], 0, 0],
      to: [xs[i + 1], 0, 0],
      thickness: 0.07,
      weight: 5,
      auxFrom: i / (n - 1),
      auxTo: (i + 1) / (n - 1),
    });
  }
  // A faint halo so the pipeline doesn't read as a bare line in isolation.
  out.push({
    kind: "scatter",
    center: [0, 0, 0],
    extent: [9, 3.2, 3.2],
    weight: 3,
    aux: 0,
  });
  return out;
}

/* ------------------------------------------------------------------ *
 * build_meetingpoint — a road network in the xz plane, so it reads as a map
 * from the elevated camera station. Irregular on purpose: a perfect grid
 * looks synthetic, and the project runs on real OSM extracts.
 * ------------------------------------------------------------------ */

const ROAD_NODES: Vec3[] = [
  [-8, 0, -6],
  [-2.5, 0, -7.2],
  [4, 0, -6.4],
  [8.4, 0, -4],
  [-7.4, 0, -0.5],
  [-1.2, 0, -1.4],
  [3.4, 0, -0.8],
  [8, 0, 1.2],
  [-6.6, 0, 5],
  [-1.8, 0, 4.2],
  [3.8, 0, 5.4],
  [7.6, 0, 6.2],
];

const ROAD_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3],
  [4, 5], [5, 6], [6, 7],
  [8, 9], [9, 10], [10, 11],
  [0, 4], [4, 8],
  [1, 5], [5, 9],
  [2, 6], [6, 10],
  [3, 7], [7, 11],
  [1, 6], [5, 10],
];

function meetingPointMap(): Primitive[] {
  const out: Primitive[] = [];
  ROAD_EDGES.forEach(([a, b]) => {
    out.push({
      kind: "edge",
      from: ROAD_NODES[a],
      to: ROAD_NODES[b],
      thickness: 0.045,
      weight: 2.4,
      auxFrom: 0.18,
      auxTo: 0.18,
    });
  });
  ROAD_NODES.forEach((at) => {
    out.push({ kind: "node", at, radius: 0.16, weight: 0.5, aux: 0.35 });
  });
  // The two candidate venues — the utilitarian and egalitarian answers.
  out.push({ kind: "node", at: [-1.2, 0.6, -1.4], radius: 0.55, weight: 5, aux: 1.0 });
  out.push({ kind: "node", at: [3.4, 0.6, -0.8], radius: 0.55, weight: 5, aux: 0.85 });
  return out;
}

/* ------------------------------------------------------------------ *
 * Ambient formations. These sit behind text-heavy sections, so they are
 * deliberately calm and generated rather than hand-authored — only `entry`
 * and the three project formations earn hand-placed coordinates.
 * ------------------------------------------------------------------ */

function ambient(radius: number, spread: number, aux: number): Primitive[] {
  return [
    { kind: "shell", center: [0, 0, 0], radius, thickness: 1.5, weight: 6, aux },
    {
      kind: "scatter",
      center: [0, 0, 0],
      extent: [spread, spread * 0.62, spread * 0.5],
      weight: 5,
      aux: aux * 0.5,
    },
  ];
}

export const FORMATIONS: Formation[] = [
  // `boot` is the pre-intro state: a loose cloud the field morphs out of on
  // first paint. Never a scroll target.
  { id: "boot", primitives: ambient(13, 22, 0.1) },
  { id: "entry", primitives: siteGraph() },
  { id: "state", primitives: ambient(7.5, 15, 0.5) },
  { id: "run", primitives: ambient(9, 17, 0.35) },
  { id: "build_aws", primitives: awsStack() },
  { id: "build_tripmate", primitives: tripmatePipeline() },
  { id: "build_meetingpoint", primitives: meetingPointMap() },
  { id: "stack", primitives: ambient(10.5, 19, 0.65) },
  { id: "solve", primitives: ambient(6.5, 13, 0.8) },
  { id: "reach", primitives: ambient(12, 21, 0.25) },
];

export const FORMATION_INDEX: Record<FormationId, number> = FORMATIONS.reduce(
  (acc, f, i) => {
    acc[f.id] = i;
    return acc;
  },
  {} as Record<FormationId, number>
);

/** Formations whose `aux` channel encodes pipeline position, so the pulse runs. */
export const PULSE_FORMATIONS: FormationId[] = ["build_tripmate"];

/**
 * Scroll anchors, in document order. There are 9, not 7: the three project
 * panels inside `build` each get their own anchor so the field morphs three
 * times as you read through that section.
 *
 * `el` is the DOM id or data attribute the scroll driver measures.
 */
export interface Anchor {
  /** DOM element id to measure. */
  el: string;
  formation: FormationId;
  /**
   * Field opacity while resting at this anchor. Text-heavy sections pull the
   * field back so it never competes with prose; sections where the diagram *is*
   * the content stay bright. Transitions always brighten toward 1.
   */
  rest: number;
}

export const ANCHORS: Anchor[] = [
  { el: "entry", formation: "entry", rest: 0.85 },
  { el: "state", formation: "state", rest: 0.2 },
  { el: "run", formation: "run", rest: 0.18 },
  { el: "panel-aws-cost-optimizer", formation: "build_aws", rest: 0.28 },
  { el: "panel-tripmate-ai", formation: "build_tripmate", rest: 0.3 },
  { el: "panel-meeting-point", formation: "build_meetingpoint", rest: 0.28 },
  { el: "stack", formation: "stack", rest: 0.16 },
  { el: "solve", formation: "solve", rest: 0.22 },
  { el: "reach", formation: "reach", rest: 0.3 },
];

/**
 * Anchor space has 9 entries; the rail nav has 7 sections (the three project
 * anchors all live inside `build`). This collapses one to the other so the nav
 * highlight and the 3D scene are driven by the same scroll value.
 */
export const ANCHOR_TO_SECTION: number[] = [0, 1, 2, 3, 3, 3, 4, 5, 6];
