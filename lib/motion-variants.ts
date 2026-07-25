import type { Variants } from "motion/react";

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const edgeDrawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.32, delay, ease: "easeInOut" },
  }),
};

export const nodeResolveVariants: Variants = {
  pending: { scale: 1, opacity: 0.5 },
  resolved: (delay: number) => ({
    scale: [1, 1.4, 1],
    opacity: 1,
    transition: { duration: 0.4, delay, ease: "easeOut" },
  }),
};
