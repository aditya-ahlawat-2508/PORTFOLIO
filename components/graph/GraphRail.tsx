"use client";

import { useSyncExternalStore } from "react";
import { graphSequence } from "./graph-data";
import { ANCHOR_TO_SECTION } from "@/lib/scene/formations";
import {
  getIndexSnapshot,
  getServerIndexSnapshot,
  subscribe,
} from "@/lib/scene/scroll-store";
import { cn } from "@/lib/cn";

function stateOf(index: number, activeIndex: number): "resolved" | "active" | "pending" {
  if (index < activeIndex) return "resolved";
  if (index === activeIndex) return "active";
  return "pending";
}

export function GraphRail() {
  const anchorIndex = useSyncExternalStore(
    subscribe,
    getIndexSnapshot,
    getServerIndexSnapshot
  );
  const activeIndex = ANCHOR_TO_SECTION[anchorIndex] ?? 0;

  return (
    <nav
      aria-label="Site sections"
      className={cn(
        "fixed z-40 font-mono text-eyebrow",
        "top-0 left-0 right-0 h-14 flex items-center px-4 gap-3 border-b border-hairline bg-void/90 backdrop-blur-sm",
        "lg:top-0 lg:left-0 lg:right-auto lg:bottom-0 lg:h-auto lg:w-20 lg:flex-col lg:justify-center lg:border-b-0 lg:border-r lg:px-0 lg:gap-6"
      )}
    >
      <ol className="flex items-center gap-3 lg:flex-col lg:gap-7">
        {graphSequence.map((node, i) => {
          const state = stateOf(i, activeIndex);
          const isLast = i === graphSequence.length - 1;
          return (
            <li key={node.id} className="flex items-center lg:flex-col">
              <div className="flex items-center lg:flex-col">
                <a
                  href={`#${node.id}`}
                  aria-label={node.sectionLabel}
                  aria-current={state === "active" ? "true" : undefined}
                  className="group relative flex items-center justify-center w-6 h-6 rounded-[2px]"
                >
                  <span
                    className={cn(
                      "block w-2.5 h-2.5 rounded-full border transition-colors duration-300",
                      state === "resolved" && "bg-pulse border-pulse",
                      state === "active" && "bg-signal border-signal",
                      state === "pending" && "bg-transparent border-muted/40"
                    )}
                  />
                  <span
                    className={cn(
                      "pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-[2px] border border-hairline bg-surface px-2 py-1 text-eyebrow text-vellum opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
                      "lg:left-full lg:top-1/2 lg:mt-0 lg:ml-2 lg:-translate-x-0 lg:-translate-y-1/2"
                    )}
                  >
                    {node.label}
                  </span>
                </a>
              </div>
              {!isLast && (
                <span
                  aria-hidden
                  className={cn(
                    "block bg-muted/20",
                    "w-6 h-px lg:w-px lg:h-7 lg:mx-auto",
                    state === "resolved" && "bg-pulse"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
