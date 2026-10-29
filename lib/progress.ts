"use client";

import { useSyncExternalStore } from "react";

/**
 * Progresso do aluno salvo no navegador.
 * Toda leitura/escrita em localStorage é protegida: se o armazenamento
 * estiver bloqueado (modo privado, políticas do navegador), o site continua
 * funcionando com o estado apenas em memória.
 */

export type CardStatus = "sei" | "revisar";

export interface SimuladoResult {
  score: number;
  total: number;
  seconds: number;
  at: number;
}

export interface ProgressState {
  v: 1;
  modules: Record<string, true>;
  quiz: Record<string, boolean>;
  simulados: SimuladoResult[];
  cards: Record<string, CardStatus>;
  trail: Record<string, true>;
  anatomyBest: number;
  challengeBest: number;
}

const KEY = "rp-progresso-v1";

const EMPTY: ProgressState = {
  v: 1,
  modules: {},
  quiz: {},
  simulados: [],
  cards: {},
  trail: {},
  anatomyBest: 0,
  challengeBest: 0,
};

let state: ProgressState = EMPTY;
let loaded = false;
let available: boolean | null = null;
const listeners = new Set<() => void>();

function storageAvailable(): boolean {
  if (available !== null) return available;
  try {
    const probe = "__rp_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    available = true;
  } catch {
    available = false;
  }
  return available;
}

function parse(raw: string | null): ProgressState {
  if (!raw) return EMPTY;
  try {
    const data = JSON.parse(raw) as Partial<ProgressState>;
    if (!data || data.v !== 1) return EMPTY;
    return {
      ...EMPTY,
      ...data,
      modules: { ...(data.modules ?? {}) },
      quiz: { ...(data.quiz ?? {}) },
      simulados: Array.isArray(data.simulados) ? data.simulados.slice(-20) : [],
      cards: { ...(data.cards ?? {}) },
      trail: { ...(data.trail ?? {}) },
    };
  } catch {
    return EMPTY;
  }
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  if (!storageAvailable()) return;
  try {
    state = parse(window.localStorage.getItem(KEY));
  } catch {
    state = EMPTY;
  }
}

function persist() {
  if (!storageAvailable()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Cota cheia ou armazenamento bloqueado: segue só em memória.
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function update(fn: (s: ProgressState) => ProgressState) {
  load();
  state = fn(state);
  persist();
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      try {
        state = parse(e.newValue);
      } catch {
        state = EMPTY;
      }
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return state;
}

function getServerSnapshot() {
  return EMPTY;
}

/** Estado de progresso reativo (vazio no servidor, real após hidratação). */
export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const noopSubscribe = () => () => {};

/** `true` somente no cliente após a hidratação. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** Indica se o progresso será mantido entre visitas. */
export function useStorageAvailable(): boolean {
  return useSyncExternalStore(noopSubscribe, storageAvailable, () => true);
}

// ------------------------------------------------------------------
// Ações
// ------------------------------------------------------------------

export function setModuleDone(slug: string, done: boolean) {
  update((s) => {
    const modules = { ...s.modules };
    if (done) modules[slug] = true;
    else delete modules[slug];
    return { ...s, modules };
  });
}

export function recordQuizAnswer(id: string, correct: boolean) {
  update((s) => ({ ...s, quiz: { ...s.quiz, [id]: correct } }));
}

export function recordSimulado(result: SimuladoResult) {
  update((s) => ({ ...s, simulados: [...s.simulados, result].slice(-20) }));
}

export function setCardStatus(id: string, status: CardStatus) {
  update((s) => ({ ...s, cards: { ...s.cards, [id]: status } }));
}

export function resetCards(ids: string[]) {
  update((s) => {
    const cards = { ...s.cards };
    ids.forEach((id) => delete cards[id]);
    return { ...s, cards };
  });
}

export function setTrailStep(id: string, done: boolean) {
  update((s) => {
    const trail = { ...s.trail };
    if (done) trail[id] = true;
    else delete trail[id];
    return { ...s, trail };
  });
}

export function recordAnatomyScore(score: number) {
  update((s) => ({ ...s, anatomyBest: Math.max(s.anatomyBest, score) }));
}

export function recordChallengeScore(score: number) {
  update((s) => ({ ...s, challengeBest: Math.max(s.challengeBest, score) }));
}

export function resetProgress() {
  update(() => EMPTY);
}

// ------------------------------------------------------------------
// Métricas
// ------------------------------------------------------------------

export function moduleCount(s: ProgressState, slugs: string[]) {
  return slugs.filter((slug) => s.modules[slug]).length;
}

/** Fração de questões do banco já acertadas (última resposta). */
export function quizMastery(s: ProgressState, questionIds: string[]) {
  if (questionIds.length === 0) return 0;
  const correct = questionIds.filter((id) => s.quiz[id] === true).length;
  return correct / questionIds.length;
}

/** Progresso geral: 70% módulos concluídos + 30% domínio do quiz. */
export function overallProgress(
  s: ProgressState,
  moduleSlugs: string[],
  questionIds: string[],
) {
  const m = moduleSlugs.length ? moduleCount(s, moduleSlugs) / moduleSlugs.length : 0;
  return 0.7 * m + 0.3 * quizMastery(s, questionIds);
}
