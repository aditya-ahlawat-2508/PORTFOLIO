"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { FieldGroup } from "./FieldGroup";
import { CameraRig } from "./CameraRig";

// @react-three/postprocessing pulls in the full postprocessing library. Split
// it into its own chunk so tiers that never render it (low, reduced motion)
// don't pay to download or parse it.
const Effects = dynamic(() => import("./Effects").then((m) => m.Effects), {
  ssr: false,
});
import { TIER_PARAMS, setBailed, type Tier } from "@/lib/scene/quality";
import { readPalette, type ScenePalette } from "@/lib/scene/theme-uniforms";
import { subscribeTheme } from "@/lib/subscribe-theme";
import {
  getServerVisibleSnapshot,
  getVisibleSnapshot,
  subscribeVisible,
} from "@/lib/scene/render-gate";

/**
 * Everything that touches `three` lives at or below this module, so the whole
 * WebGL stack lands in one lazily-loaded chunk.
 */
export default function Scene({
  tier,
  reducedMotion,
  onFatal,
}: {
  tier: Exclude<Tier, "off">;
  reducedMotion: boolean;
  onFatal: () => void;
}) {
  const params = TIER_PARAMS[tier];
  const visible = useSyncExternalStore(
    subscribeVisible,
    getVisibleSnapshot,
    getServerVisibleSnapshot
  );

  const [palette, setPalette] = useState<ScenePalette>(() => readPalette());

  // Theme changes arrive as attribute mutations; re-read the computed vars.
  useEffect(() => {
    return subscribeTheme(() => setPalette(readPalette()));
  }, []);

  const dpr = useMemo<[number, number]>(
    () => [1, Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio || 1, params.dprCap)],
    [params.dprCap]
  );

  const lossCount = useMemo(() => ({ n: 0 }), []);

  const handleCreated = useCallback(
    ({ gl }: { gl: { domElement: HTMLCanvasElement } }) => {
      const canvas = gl.domElement;
      canvas.addEventListener(
        "webglcontextlost",
        (e) => {
          e.preventDefault();
          lossCount.n += 1;
          // One restore attempt is reasonable; a second loss means this device
          // cannot hold the context, so stop trying for the rest of the session.
          if (lossCount.n >= 2) {
            setBailed();
            onFatal();
          }
        },
        { passive: false }
      );
    },
    [lossCount, onFatal]
  );

  // Under reduced motion nothing animates, so render on demand only.
  const frameloop = reducedMotion ? "demand" : visible ? "always" : "never";

  return (
    <Canvas
      dpr={dpr}
      frameloop={frameloop}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.5, 22], fov: 42, near: 0.1, far: 200 }}
      onCreated={handleCreated}
      // No 3D interaction anywhere, so skip R3F's event manager entirely —
      // saves a raycast per pointer move.
      events={undefined}
      style={{ pointerEvents: "none" }}
    >
      <CameraRig reducedMotion={reducedMotion} />
      <FieldGroup params={params} palette={palette} reducedMotion={reducedMotion} />
      {/* Mounting is what triggers the chunk fetch, so gate on params.post here
          rather than inside Effects — that's what keeps the low tier and
          reduced-motion paths from ever downloading postprocessing at all. */}
      {!reducedMotion && params.post && <Effects params={params} isLight={palette.isLight} />}
    </Canvas>
  );
}
