"use client";

import { motion } from "motion/react";
import { revealVariants } from "@/lib/motion-variants";

export function Reveal({
  children,
  index = 0,
  className,
  id,
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
  id?: string;
}) {
  return (
    <motion.div
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      custom={index}
      variants={revealVariants}
    >
      {children}
    </motion.div>
  );
}
