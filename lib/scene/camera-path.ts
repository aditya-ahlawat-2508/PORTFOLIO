import { CatmullRomCurve3, Vector3 } from "three";
import { ANCHORS } from "./formations";

/**
 * One camera station per scroll anchor. The choreography deliberately varies
 * distance and angle so consecutive sections don't feel like the same shot:
 * front -> orbit right -> orbit left -> front -> elevated -> top-down (reads
 * the road network as a map) -> wide -> close/low -> pull back.
 */
interface Station {
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
}

/**
 * Distances are deliberately generous. The field is a backdrop: the crisp SVG
 * schematics inside each project panel carry the precise information, so the 3D
 * has to stay subordinate to the prose sitting in front of it.
 *
 * `look` is offset from the subject where the content needs the room — offsetting
 * the look target (rather than moving the camera) is what shifts the subject
 * sideways in frame.
 */
const STATIONS: Station[] = [
  { pos: [5, 1.5, 30], look: [-7, 0.5, 0], fov: 42 }, // entry — graph, pushed right of the headline
  { pos: [20, 6, 27], look: [1, 0, 0], fov: 46 }, // state
  { pos: [-22, 9, 26], look: [-1, 0, 0], fov: 48 }, // run
  { pos: [4, 7, 34], look: [0, 0, 0], fov: 40 }, // build_aws — see the layers
  { pos: [0, 8, 32], look: [0, 0, 0], fov: 38 }, // build_tripmate — pipeline
  { pos: [1, 30, 23], look: [0, 0, 0], fov: 44 }, // build_meetingpoint — map view
  { pos: [-16, -7, 36], look: [0, 0, 0], fov: 50 }, // stack — wide
  { pos: [13, -10, 25], look: [0, 0, 0], fov: 46 }, // solve — close, low
  { pos: [0, 0, 50], look: [0, 0, 0], fov: 52 }, // reach — pull back
];

if (STATIONS.length !== ANCHORS.length) {
  throw new Error(
    `camera-path: ${STATIONS.length} stations for ${ANCHORS.length} anchors — these must match.`
  );
}

export const posCurve = new CatmullRomCurve3(
  STATIONS.map((s) => new Vector3(...s.pos)),
  false,
  "catmullrom",
  0.35
);

export const lookCurve = new CatmullRomCurve3(
  STATIONS.map((s) => new Vector3(...s.look)),
  false,
  "catmullrom",
  0.35
);

export const FOVS = STATIONS.map((s) => s.fov);
export const STATION_COUNT = STATIONS.length;

/**
 * Uses getPoint (parameter-uniform), NOT getPointAt (arc-length). Arc-length
 * reparameterisation would decouple the camera from the anchors, so arriving at
 * section i would no longer land on station i.
 */
export function sampleCamera(s: number, outPos: Vector3, outLook: Vector3): number {
  const n = STATION_COUNT - 1;
  const u = Math.min(1, Math.max(0, s / n));
  posCurve.getPoint(u, outPos);
  lookCurve.getPoint(u, outLook);

  const i = Math.min(n - 1, Math.max(0, Math.floor(s)));
  const f = Math.min(1, Math.max(0, s - i));
  return FOVS[i] + (FOVS[i + 1] - FOVS[i]) * f;
}
