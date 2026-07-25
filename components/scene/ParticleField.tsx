"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DataArrayTexture,
  FloatType,
  GLSL3,
  NearestFilter,
  NormalBlending,
  RGBAFormat,
  ShaderMaterial,
  Sphere,
  Vector3,
} from "three";
import { bakeField } from "@/lib/scene/bake";
import { ANCHORS, FORMATION_INDEX, PULSE_FORMATIONS } from "@/lib/scene/formations";
import {
  particlesFragmentShader,
  particlesVertexShader,
} from "./shaders/particles";
import { frame } from "@/lib/scene/scroll-store";
import type { ScenePalette } from "@/lib/scene/theme-uniforms";
import type { TierParams } from "@/lib/scene/quality";

const BOOT_SLOT = FORMATION_INDEX.boot;
const ENTRY_SLOT = FORMATION_INDEX.entry;
const INTRO_MS = 1500;

const PULSE_SLOTS = new Set(PULSE_FORMATIONS.map((id) => FORMATION_INDEX[id]));
const ANCHOR_SLOTS = ANCHORS.map((a) => FORMATION_INDEX[a.formation]);
const ANCHOR_REST = ANCHORS.map((a) => a.rest);

/** Rest plateaus: hold the shape for most of a section, morph through the middle. */
function plateau(t: number): number {
  const x = Math.min(1, Math.max(0, (t - 0.3) / 0.4));
  return x * x * (3 - 2 * x);
}

export function ParticleField({
  params,
  palette,
  reducedMotion,
}: {
  params: TierParams;
  palette: ScenePalette;
  reducedMotion: boolean;
}) {
  const { size } = useThree();
  const introStart = useRef<number | null>(null);
  const skipIntro = useRef(false);

  const baked = useMemo(
    () => bakeField(params.count, params.width, params.height),
    [params.count, params.width, params.height]
  );

  const texture = useMemo(() => {
    const tex = new DataArrayTexture(
      baked.positions,
      baked.width,
      baked.height,
      baked.formationCount
    );
    tex.format = RGBAFormat;
    tex.type = FloatType;
    tex.minFilter = NearestFilter;
    tex.magFilter = NearestFilter;
    tex.generateMipmaps = false;
    tex.needsUpdate = true;
    return tex;
  }, [baked]);

  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    // `position` carries the per-particle randoms, not a position — see the note
    // at the top of shaders/particles.ts.
    const randoms = new Float32Array(baked.count * 3);
    const stagger = new Float32Array(baked.count);
    for (let i = 0; i < baked.count; i++) {
      randoms[i * 3] = baked.seeds[i * 4];
      randoms[i * 3 + 1] = baked.seeds[i * 4 + 1];
      randoms[i * 3 + 2] = baked.seeds[i * 4 + 2];
      stagger[i] = baked.seeds[i * 4 + 3];
    }
    g.setAttribute("position", new BufferAttribute(randoms, 3));
    g.setAttribute("aStagger", new BufferAttribute(stagger, 1));
    // Positions come from the texture, so the computed bounds are meaningless.
    // Set a generous manual sphere and never cull.
    g.boundingSphere = new Sphere(new Vector3(0, 0, 0), 40);
    return g;
  }, [baked]);

  const material = useMemo(() => {
    return new ShaderMaterial({
      glslVersion: GLSL3,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      uniforms: {
        uFormations: { value: texture },
        uTexW: { value: baked.width },
        uSlotA: { value: BOOT_SLOT },
        uSlotB: { value: ENTRY_SLOT },
        uBlend: { value: 0 },
        uTime: { value: 0 },
        uPulse: { value: 0 },
        uPulseActive: { value: 0 },
        uMotion: { value: reducedMotion ? 0 : 1 },
        uArc: { value: 0.85 },
        uPointScale: { value: 60 },
        uColRest: { value: palette.muted.clone() },
        uColTransit: { value: palette.signal.clone() },
        uColPulse: { value: palette.pulse.clone() },
        uOpacity: { value: 0.9 },
        uSoftness: { value: 0.02 },
        uTint: { value: 0.8 },
      },
      vertexShader: particlesVertexShader,
      fragmentShader: particlesFragmentShader,
    });
    // Palette and motion are pushed in via effects below, so they are
    // deliberately not dependencies — rebuilding the material on a theme
    // toggle would recompile the shader for no reason.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texture, baked.width]);

  /* Theme: additive reads beautifully on the dark ground and washes out to white
     on the light one, so blending mode is part of the palette, not a detail. */
  useEffect(() => {
    material.uniforms.uColRest.value.copy(palette.muted);
    material.uniforms.uColTransit.value.copy(palette.signal);
    material.uniforms.uColPulse.value.copy(palette.pulse);
    material.blending = palette.isLight ? NormalBlending : AdditiveBlending;
    material.uniforms.uSoftness.value = palette.isLight ? 0.06 : 0.02;
    material.uniforms.uTint.value = palette.isLight ? 0.55 : 0.85;
    material.needsUpdate = true;
  }, [material, palette]);

  useEffect(() => {
    material.uniforms.uMotion.value = reducedMotion ? 0 : 1;
  }, [material, reducedMotion]);

  useEffect(() => {
    // Point size scales with viewport height so density reads the same at any
    // window size, and with DPR so it isn't twice as chunky on retina.
    const dpr = Math.min(window.devicePixelRatio || 1, params.dprCap);
    material.uniforms.uPointScale.value = (size.height / 900) * 20 * dpr;
  }, [material, size.height, params.dprCap]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, [geometry, material, texture]);

  useFrame((state) => {
    const u = material.uniforms;
    const t = state.clock.elapsedTime;
    u.uTime.value = t;

    // One-shot intro: the field assembles out of a loose cloud into the site
    // graph. Skipped entirely on a deep scroll position or under reduced motion.
    if (introStart.current === null) {
      introStart.current = performance.now();
      skipIntro.current = reducedMotion || frame.s > 0.35;
    }
    const introT = skipIntro.current
      ? 1
      : Math.min(1, (performance.now() - introStart.current) / INTRO_MS);

    if (introT < 1) {
      u.uSlotA.value = BOOT_SLOT;
      u.uSlotB.value = ENTRY_SLOT;
      u.uBlend.value = introT * introT * (3 - 2 * introT);
      u.uPulseActive.value = 0;
      u.uOpacity.value = 0.35 + 0.6 * introT;
      return;
    }

    const s = Math.min(ANCHOR_SLOTS.length - 1, Math.max(0, frame.s));
    const i = Math.min(ANCHOR_SLOTS.length - 2, Math.floor(s));
    const local = s - i;
    const blended = plateau(local);

    const slotA = ANCHOR_SLOTS[i];
    const slotB = ANCHOR_SLOTS[i + 1];

    u.uSlotA.value = slotA;
    u.uSlotB.value = slotB;
    u.uBlend.value = blended;

    // Pulse only runs while a pipeline formation is on screen.
    let pulseWeight = 0;
    if (PULSE_SLOTS.has(slotA)) pulseWeight += 1 - blended;
    if (PULSE_SLOTS.has(slotB)) pulseWeight += blended;
    u.uPulseActive.value = pulseWeight;
    u.uPulse.value = reducedMotion ? 0.5 : (t * 0.32) % 1;

    // Brighten through transitions, settle back at rest.
    const rest = ANCHOR_REST[i] + (ANCHOR_REST[i + 1] - ANCHOR_REST[i]) * local;
    const transit = Math.sin(blended * Math.PI);
    u.uOpacity.value = rest + (1 - rest) * transit * 0.9;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
