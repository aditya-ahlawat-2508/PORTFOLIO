import { detectTier, type Tier } from "./quality";

/**
 * Tier detection creates a throwaway WebGL context, so it must run exactly once.
 * Cached at module scope and read as a stable snapshot — this is what lets the
 * component read it without a setState-in-effect.
 */
let cached: Tier | null = null;

export function getTierSnapshot(): Tier {
  if (cached === null) cached = detectTier();
  return cached;
}

export function getServerTierSnapshot(): Tier {
  return "off";
}

export function forceTierOff(): void {
  cached = "off";
}

/** Tier never changes after detection, so there is nothing to subscribe to. */
export function subscribeTier(): () => void {
  return () => {};
}
