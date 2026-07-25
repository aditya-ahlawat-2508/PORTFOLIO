"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  Color,
  InstancedMesh,
  Matrix4,
  MeshBasicMaterial,
  NormalBlending,
  SphereGeometry,
  Vector3,
} from "three";
import { SITE_NODES } from "@/lib/scene/formations";
import { frame } from "@/lib/scene/scroll-store";
import type { ScenePalette } from "@/lib/scene/theme-uniforms";

const matrix = new Matrix4();
const scaleVec = new Vector3();
const scratch = new Color();

/**
 * Crisp markers at the seven site-graph nodes. The particle field alone reads as
 * a cloud; these give it structure so the hero is legibly a *graph*. They exist
 * only while the graph formation is on screen and fade out as it morphs away.
 */
export function GraphNodes({ palette }: { palette: ScenePalette }) {
  const ref = useRef<InstancedMesh>(null);

  const geometry = useMemo(() => new SphereGeometry(0.15, 16, 16), []);
  const material = useMemo(
    () =>
      new MeshBasicMaterial({
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      }),
    []
  );

  useEffect(() => {
    material.blending = palette.isLight ? NormalBlending : AdditiveBlending;
    material.needsUpdate = true;
  }, [material, palette]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material]
  );

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;

    // Visible only around the graph formation (anchor 0).
    const vis = Math.max(0, Math.min(1, 1 - frame.s / 0.85));
    material.opacity = vis;
    mesh.visible = vis > 0.01;
    if (!mesh.visible) return;

    for (let i = 0; i < SITE_NODES.length; i++) {
      const [x, y, z] = SITE_NODES[i].at;
      const isActive = i === frame.index;
      const s = (isActive ? 1.5 : 1) * (0.6 + 0.4 * vis);
      scaleVec.setScalar(s);
      matrix.makeScale(scaleVec.x, scaleVec.y, scaleVec.z);
      matrix.setPosition(x, y, z);
      mesh.setMatrixAt(i, matrix);

      if (i < frame.index) scratch.copy(palette.pulse);
      else if (i === frame.index) scratch.copy(palette.signal);
      else scratch.copy(palette.muted);
      mesh.setColorAt(i, scratch);
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, SITE_NODES.length]}
      frustumCulled={false}
    />
  );
}
