"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

/** Vertical timeline rail that fills with accent colour as you scroll through it. */
export default function JourneyRail({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <div ref={ref} className="relative mt-16">
      <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-line md:block" aria-hidden />
      <motion.div
        style={{ scaleY }}
        className="absolute bottom-0 left-0 top-0 hidden w-px origin-top bg-gradient-to-b from-accent via-accent to-accent/0 md:block"
        aria-hidden
      />
      <div className="divide-y divide-line">{children}</div>
    </div>
  );
}
