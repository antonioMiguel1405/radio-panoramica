/** Origem de cada informação: slides da aula ou literatura complementar. */
export type Source = "aula" | "complementar";

/** Referência de origem com os slides correspondentes (quando houver). */
export interface SourceRef {
  source: Source;
  slides?: number[];
}

/** Ilustrações SVG originais disponíveis no roteiro. */
export type FigureId =
  | "rotacao"
  | "aparelho"
  | "camada"
  | "angulo"
  | "posicionamento"
  | "real-fantasma"
  | "anatomia"
  | "estrela";

export type ModuleIcon =
  | "Orbit"
  | "ScanLine"
  | "Layers"
  | "Triangle"
  | "UserCheck"
  | "TriangleAlert"
  | "Ghost"
  | "Bone"
  | "ThumbsUp"
  | "ThumbsDown"
  | "Stethoscope"
  | "ListChecks";

/** Ponto-chave: menor unidade de conteúdo (folha do mapa mental). */
export interface KeyPoint extends SourceRef {
  /** Rótulo curto para o mapa mental. */
  label: string;
  /** Texto completo (aceita **negrito** e *itálico*). */
  text: string;
}

export interface ContentTable extends SourceRef {
  caption: string;
  headers: string[];
  rows: string[][];
  note?: string;
}

export interface Topic {
  id: string;
  title: string;
  /** Resumo de uma frase, usado no mapa mental e na busca. */
  summary: string;
  points: KeyPoint[];
  table?: ContentTable;
  figure?: FigureId;
}

export type CalloutVariant = "pegadinha" | "mnemonico" | "dica";

export interface Callout extends SourceRef {
  variant: CalloutVariant;
  title: string;
  text: string;
}

export interface SelfCheck {
  q: string;
  a: string;
}

export interface Module {
  slug: string;
  number: number;
  title: string;
  shortTitle: string;
  /** Cor do módulo (mesma no mapa, roteiro e quiz). */
  color: string;
  icon: ModuleIcon;
  /** Tempo estimado de estudo, em minutos. */
  minutes: number;
  summary: string;
  objectives: string[];
  topics: Topic[];
  callouts: Callout[];
  selfCheck: SelfCheck[];
  /** Link para um simulador relacionado. */
  simulator?: { tab: SimulatorTab; label: string };
}

export type SimulatorTab = "camada" | "fantasma" | "erros" | "anatomia";

export interface QuizOption {
  text: string;
  /** Por que esta alternativa está certa ou errada. */
  why: string;
}

export interface QuizQuestion extends SourceRef {
  id: string;
  module: string;
  question: string;
  /** A primeira alternativa é SEMPRE a correta (embaralhadas na exibição). */
  options: [QuizOption, QuizOption, QuizOption, QuizOption];
}

export interface Flashcard extends SourceRef {
  id: string;
  module: string;
  front: string;
  back: string;
}

export interface GlossaryTerm extends SourceRef {
  term: string;
  definition: string;
  module?: string;
}

export interface PositioningError {
  id: string;
  name: string;
  cause: string;
  causeRef: SourceRef;
  aspect: string;
  aspectRef: SourceRef;
  correction: string;
}

export interface TrailStep {
  id: string;
  label: string;
  href: string;
  minutes: number;
  kind: "modulo" | "quiz" | "flashcards" | "simulador" | "revisao" | "mapa";
}

export interface TrailBlock {
  title: string;
  steps: TrailStep[];
}

export interface Trail {
  id: "relampago" | "completa" | "tres-dias";
  name: string;
  duration: string;
  description: string;
  blocks: TrailBlock[];
}
