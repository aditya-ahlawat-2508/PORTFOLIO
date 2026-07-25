export type GraphNodeId =
  | "entry"
  | "state"
  | "run"
  | "build"
  | "stack"
  | "solve"
  | "reach";

export interface GraphNodeDef {
  id: GraphNodeId;
  label: string;
  sectionLabel: string;
}

export const graphSequence: GraphNodeDef[] = [
  { id: "entry", label: "entry", sectionLabel: "Hero" },
  { id: "state", label: "state", sectionLabel: "About" },
  { id: "run", label: "run", sectionLabel: "Experience" },
  { id: "build", label: "build", sectionLabel: "Projects" },
  { id: "stack", label: "stack", sectionLabel: "Skills" },
  { id: "solve", label: "solve", sectionLabel: "Competitive programming" },
  { id: "reach", label: "reach", sectionLabel: "Contact" },
];

/** Percentage coordinates (0-100) within the hero's full-bleed viewBox. */
export const heroPositions: Record<GraphNodeId, { x: number; y: number }> = {
  entry: { x: 66, y: 12 },
  state: { x: 86, y: 26 },
  run: { x: 60, y: 38 },
  build: { x: 82, y: 54 },
  stack: { x: 54, y: 66 },
  solve: { x: 76, y: 80 },
  reach: { x: 48, y: 92 },
};

export const heroEdges: [GraphNodeId, GraphNodeId][] = graphSequence
  .slice(0, -1)
  .map((node, i) => [node.id, graphSequence[i + 1].id]);
