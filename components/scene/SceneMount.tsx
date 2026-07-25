"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import {
  forceTierOff,
  getServerTierSnapshot,
  getTierSnapshot,
  subscribeTier,
} from "@/lib/scene/tier-store";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

/**
 * Gate in front of the WebGL bundle. Holds the import back until the browser is
 * idle (or the user interacts) so the hero text wins the LCP race, and renders
 * nothing at all on devices that can't or shouldn't run it.
 */
export function SceneMount() {
  const reducedMotion = useReducedMotion();
  const tier = useSyncExternalStore(subscribeTier, getTierSnapshot, getServerTierSnapshot);
  const [armed, setArmed] = useState(false);
  const [fatal, setFatal] = useState(false);

  useEffect(() => {
    if (tier === "off") return;

    let done = false;
    const fire = () => {
      if (done) return;
      done = true;
      setArmed(true);
    };

    // Whichever comes first: the browser going idle, a hard timeout for Safari
    // (no requestIdleCallback), or the user actually starting to interact.
    const idle =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(fire, { timeout: 2000 })
        : null;
    const timer = window.setTimeout(fire, 1200);
    window.addEventListener("scroll", fire, { once: true, passive: true });
    window.addEventListener("pointerdown", fire, { once: true, passive: true });

    return () => {
      done = true;
      if (idle !== null) window.cancelIdleCallback?.(idle);
      window.clearTimeout(timer);
      window.removeEventListener("scroll", fire);
      window.removeEventListener("pointerdown", fire);
    };
  }, [tier]);

  const handleFatal = useCallback(() => {
    forceTierOff();
    setFatal(true);
  }, []);

  if (tier === "off" || fatal || !armed) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ contain: "strict" }}
    >
      <Scene tier={tier} reducedMotion={reducedMotion} onFatal={handleFatal} />
    </div>
  );
}
