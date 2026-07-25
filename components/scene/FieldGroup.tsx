"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { ParticleField } from "./ParticleField";
import { GraphNodes } from "./GraphNodes";
import { frame } from "@/lib/scene/scroll-store";
import type { ScenePalette } from "@/lib/scene/theme-uniforms";
import type { TierParams } from "@/lib/scene/quality";

/**
 * Rotates the whole field slowly on Y. This is what sells the depth — a static
 * 3D layout viewed from a fixed angle reads as flat no matter how much z-spread
 * it has. Scroll velocity nudges the rotation so flicking the page feels
 * connected to the scene.
 */
export function FieldGroup({
  params,
  palette,
  reducedMotion,
}: {
  params: TierParams;
  palette: ScenePalette;
  reducedMotion: boolean;
}) {
  const group = useRef<Group>(null);
  const spin = useRef(0);

  useFrame((_, delta) => {
    if (!group.current || reducedMotion) return;
    const dt = Math.min(delta, 0.1);
    spin.current += dt * 0.085 + frame.velocity * dt * 0.05;
    group.current.rotation.y = spin.current;
    group.current.rotation.x = Math.sin(spin.current * 0.35) * 0.07;
  });

  return (
    <group ref={group}>
      <ParticleField params={params} palette={palette} reducedMotion={reducedMotion} />
      <GraphNodes palette={palette} />
    </group>
  );
}
