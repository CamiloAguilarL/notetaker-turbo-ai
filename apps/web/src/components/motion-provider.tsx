"use client";

import { MotionConfig } from "motion/react";
import type { PropsWithChildren } from "react";

const defaultTransition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function MotionProvider({ children }: PropsWithChildren) {
  return (
    <MotionConfig reducedMotion="user" transition={defaultTransition}>
      {children}
    </MotionConfig>
  );
}
