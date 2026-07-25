export type Tier = "off" | "low" | "mid" | "high";

export interface TierParams {
  count: number;
  width: number;
  height: number;
  dprCap: number;
  post: boolean;
  bloom: boolean;
  chromatic: boolean;
}

export const TIER_PARAMS: Record<Exclude<Tier, "off">, TierParams> = {
  // width * height must equal count. Counts trimmed from an earlier pass that
  // measured multi-second main-thread blocking on the synchronous bake under
  // throttled CPU — at the point size this field renders, halving density is
  // not visible, and it directly halves bake + texture-upload cost.
  high: { count: 131072, width: 512, height: 256, dprCap: 2, post: true, bloom: true, chromatic: true },
  mid: { count: 65536, width: 256, height: 256, dprCap: 1.5, post: true, bloom: true, chromatic: false },
  low: { count: 32768, width: 256, height: 128, dprCap: 1, post: false, bloom: false, chromatic: false },
};

const BAIL_KEY = "scene:webgl-bail";

/** Latched after repeated context loss — never retry WebGL this session. */
export function hasBailed(): boolean {
  try {
    return sessionStorage.getItem(BAIL_KEY) === "1";
  } catch {
    return false;
  }
}

export function setBailed(): void {
  try {
    sessionStorage.setItem(BAIL_KEY, "1");
  } catch {
    /* storage unavailable — nothing to latch, next load just retries */
  }
}

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

/**
 * Synchronous tier detection. No async probing — the caller needs this before
 * deciding whether to load the WebGL chunk at all.
 */
export function detectTier(): Tier {
  if (typeof window === "undefined") return "off";
  if (hasBailed()) return "off";

  if (!("WebGL2RenderingContext" in window)) return "off";
  try {
    const probe = document.createElement("canvas").getContext("webgl2");
    if (!probe) return "off";
    // Release immediately; contexts are a limited resource.
    probe.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    return "off";
  }

  const nav = navigator as NavigatorWithMemory;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const dpr = window.devicePixelRatio || 1;

  if (memory <= 2) return "low";
  if (coarse && cores <= 4) return "low";
  if (coarse || window.innerWidth < 768) return "low";
  if (cores >= 8 && dpr >= 2) return "high";
  return "mid";
}
