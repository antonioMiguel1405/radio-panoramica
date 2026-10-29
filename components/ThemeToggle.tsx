"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { THEME_KEY as KEY } from "@/lib/theme";

type Mode = "system" | "light" | "dark";
const listeners = new Set<() => void>();

function readMode(): Mode {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return memoryMode;
  }
}
let memoryMode: Mode = "system";

function systemDark() {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

function apply(mode: Mode) {
  const dark = mode === "dark" || (mode === "system" && systemDark());
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
}

function setMode(mode: Mode) {
  memoryMode = mode;
  try {
    if (mode === "system") window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, mode);
  } catch {
    // sem armazenamento: vale só nesta visita
  }
  apply(mode);
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

const labels: Record<Mode, string> = {
  system: "Tema: automático (sistema)",
  light: "Tema: claro",
  dark: "Tema: escuro",
};
const next: Record<Mode, Mode> = { system: "light", light: "dark", dark: "system" };

/** Alterna Sistema → Claro → Escuro. Script inline no layout evita o “flash”. */
export function ThemeToggle() {
  const mode = useSyncExternalStore(subscribe, readMode, () => "system" as Mode);

  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  const Icon = mode === "light" ? Sun : mode === "dark" ? Moon : Monitor;
  return (
    <button
      type="button"
      onClick={() => setMode(next[mode])}
      className="inline-flex size-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-fg"
      aria-label={`${labels[mode]}. Clique para alternar.`}
      title={labels[mode]}
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}
