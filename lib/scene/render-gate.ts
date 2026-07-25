/**
 * Pauses rendering when the tab is hidden. Writes happen in event listeners
 * (never in an effect body), so React only ever reads a snapshot.
 */

let visible = true;
const listeners = new Set<() => void>();
let attached = false;

function handle(): void {
  const next = document.visibilityState === "visible";
  if (next === visible) return;
  visible = next;
  for (const cb of listeners) cb();
}

export function subscribeVisible(cb: () => void): () => void {
  listeners.add(cb);
  if (!attached) {
    document.addEventListener("visibilitychange", handle);
    attached = true;
  }
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0 && attached) {
      document.removeEventListener("visibilitychange", handle);
      attached = false;
    }
  };
}

export function getVisibleSnapshot(): boolean {
  return visible;
}

export function getServerVisibleSnapshot(): boolean {
  return true;
}
