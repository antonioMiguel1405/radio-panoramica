"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/**
 * Interpola suavemente um objeto de números até `target`.
 * `target` deve ser uma referência estável (ex.: constante de módulo).
 * Com movimento reduzido, salta direto para o alvo.
 */
export function useTween<T extends object>(target: T, duration = 750): T {
  const reduce = useReducedMotion();
  const [value, setValue] = useState<T>(target);
  const current = useRef<T>(target);

  useEffect(() => {
    const from = current.current as Record<string, number>;
    const to = target as Record<string, number>;
    const d = reduce ? 0 : duration;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = d ? Math.min(1, (now - start) / d) : 1;
      const e = ease(t);
      const next: Record<string, number> = {};
      for (const k of Object.keys(to)) next[k] = from[k] + (to[k] - from[k]) * e;
      current.current = next as T;
      setValue(next as T);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduce]);

  return value;
}
