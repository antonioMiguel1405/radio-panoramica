"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Respeita `prefers-reduced-motion` em todas as animações do framer-motion. */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
