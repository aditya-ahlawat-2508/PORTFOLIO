import { ANCHORS } from "./formations";

/**
 * The single source of truth mapping scroll position to a continuous position
 * in "anchor space".
 *
 * `s` runs 0 .. ANCHORS.length-1 and equals exactly `i` when anchor `i` is
 * centred in the viewport. The scene reads `frame` directly inside its render
 * loop, so scrolling causes zero React re-renders; React consumers subscribe
 * and get notified only when the integer `index` changes.
 */

export interface Frame {
  /** Continuous position in anchor space. */
  s: number;
  /** Nearest anchor index — what a nav highlight wants. */
  index: number;
  /** Signed change in `s` per second, damped. */
  velocity: number;
  /** Whole-document scroll progress, 0..1. */
  progress: number;
}

export const frame: Frame = { s: 0, index: 0, velocity: 0, progress: 0 };

const listeners = new Set<() => void>();
let centers: number[] = [];
let rafId: number | null = null;
let running = false;
let lastS = 0;
let lastT = 0;
let externalRaf: ((time: number) => void) | null = null;

/**
 * Lets a smooth-scroll library share this module's single rAF loop, so scroll
 * is always read after the library has committed its transform for the frame.
 */
export function setExternalRaf(fn: ((time: number) => void) | null): void {
  externalRaf = fn;
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Snapshot for useSyncExternalStore — must be a primitive. */
export function getIndexSnapshot(): number {
  return frame.index;
}

export function getServerIndexSnapshot(): number {
  return 0;
}

function emit(): void {
  for (const cb of listeners) cb();
}

/**
 * Measure each anchor's document-space centre, then clamp into the range the
 * viewport centre can actually reach. Without the clamp, anchors near the top
 * or bottom of the document are unreachable and the field would never fully
 * arrive at its first or last formation.
 */
export function measure(): void {
  const scrollY = window.scrollY;
  const vh = window.innerHeight;
  const docH = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  );

  const minVc = vh / 2;
  const maxVc = Math.max(minVc, docH - vh / 2);

  const raw = ANCHORS.map((a) => {
    const el = document.getElementById(a.el);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return r.top + scrollY + r.height / 2;
  });

  // Fall back to an even distribution for any anchor whose element is missing,
  // so a renamed id degrades to "slightly wrong" rather than NaN.
  const next: number[] = [];
  raw.forEach((v, i) => {
    const fallback = minVc + ((maxVc - minVc) * i) / Math.max(1, raw.length - 1);
    next.push(Math.min(maxVc, Math.max(minVc, v ?? fallback)));
  });

  // Enforce strict monotonicity — equal neighbours would divide by zero below.
  for (let i = 1; i < next.length; i++) {
    if (next[i] <= next[i - 1]) next[i] = next[i - 1] + 1;
  }

  centers = next;
}

function computeS(viewportCenter: number): number {
  const n = centers.length;
  if (n === 0) return 0;
  if (viewportCenter <= centers[0]) return 0;
  if (viewportCenter >= centers[n - 1]) return n - 1;

  for (let i = 0; i < n - 1; i++) {
    const a = centers[i];
    const b = centers[i + 1];
    if (viewportCenter >= a && viewportCenter <= b) {
      return i + (viewportCenter - a) / (b - a);
    }
  }
  return n - 1;
}

function tick(time: number): void {
  if (!running) return;
  rafId = requestAnimationFrame(tick);

  externalRaf?.(time);

  const vh = window.innerHeight;
  const docH = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  );
  const scrollY = window.scrollY;

  const s = computeS(scrollY + vh / 2);
  const dt = lastT === 0 ? 1 / 60 : Math.min(0.1, (time - lastT) / 1000);
  lastT = time;

  frame.s = s;
  frame.velocity += ((s - lastS) / dt - frame.velocity) * 0.2;
  lastS = s;
  frame.progress = docH > vh ? Math.min(1, Math.max(0, scrollY / (docH - vh))) : 0;

  const nextIndex = Math.round(s);
  if (nextIndex !== frame.index) {
    frame.index = nextIndex;
    emit();
  }
}

export function start(): void {
  if (running || typeof window === "undefined") return;
  running = true;

  measure();
  // Fonts and late layout shift the anchors; re-measure once settled.
  document.fonts?.ready.then(measure).catch(() => {});

  const ro = new ResizeObserver(measure);
  ro.observe(document.body);
  cleanups.push(() => ro.disconnect());

  window.addEventListener("resize", measure, { passive: true });
  cleanups.push(() => window.removeEventListener("resize", measure));

  lastT = 0;
  lastS = computeS(window.scrollY + window.innerHeight / 2);
  frame.s = lastS;
  frame.index = Math.round(lastS);

  rafId = requestAnimationFrame(tick);
}

const cleanups: (() => void)[] = [];

export function stop(): void {
  running = false;
  if (rafId !== null) cancelAnimationFrame(rafId);
  rafId = null;
  while (cleanups.length) cleanups.pop()?.();
}

/** True once `measure` has found real geometry — used to gate first render. */
export function isMeasured(): boolean {
  return centers.length > 0;
}
