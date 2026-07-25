"use client";

import { useEffect } from "react";
import { measure, setExternalRaf, start, stop } from "@/lib/scene/scroll-store";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Owns the single rAF loop for the whole app: it advances Lenis, then reads
 * scroll into the scroll store. Runs regardless of whether WebGL is active,
 * because the rail nav depends on it too.
 */
export function ScrollDriver() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let cancelled = false;

    async function boot() {
      if (!reducedMotion) {
        const { default: Lenis } = await import("lenis");
        if (cancelled) return;
        lenis = new Lenis({ lerp: 0.1, autoRaf: false });
        setExternalRaf((t) => lenis?.raf(t));
      }
      start();
      // Late layout (fonts, reveals) shifts anchors; one more pass after paint.
      requestAnimationFrame(() => requestAnimationFrame(measure));
    }

    boot();

    return () => {
      cancelled = true;
      stop();
      setExternalRaf(null);
      lenis?.destroy();
    };
  }, [reducedMotion]);

  return null;
}
