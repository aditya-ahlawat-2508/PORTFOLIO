"use client";

import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Vector2 } from "three";
import type { TierParams } from "@/lib/scene/quality";

const CA_OFFSET = new Vector2(0.00022, 0.00016);

export function Effects({ params, isLight }: { params: TierParams; isLight: boolean }) {
  return (
    <EffectComposer multisampling={0}>
      {params.bloom ? (
        <Bloom
          intensity={isLight ? 0.18 : 0.55}
          luminanceThreshold={isLight ? 0.55 : 0.18}
          luminanceSmoothing={0.35}
          mipmapBlur
          radius={0.62}
        />
      ) : (
        <></>
      )}
      {params.chromatic ? (
        <ChromaticAberration
          offset={CA_OFFSET}
          radialModulation={false}
          modulationOffset={0}
        />
      ) : (
        <></>
      )}
      <Vignette eskil={false} offset={0.24} darkness={isLight ? 0.22 : 0.52} />
    </EffectComposer>
  );
}
