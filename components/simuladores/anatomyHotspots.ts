import { getModule } from "@/content/modules";
import type { Pt } from "./panorama";

/**
 * Marcadores próprios sobre a panorâmica ESQUEMÁTICA (coordenadas base 1000 × 520).
 * Estruturas bilaterais são marcadas em um dos lados. Não reproduz a numeração
 * do exercício da aula.
 * TODO: validar com o professor — posições aproximadas no esquema didático.
 */
const POS: Record<string, Pt> = {
  // Maxila e face média
  "Seio maxilar e seu assoalho": [300, 112],
  "Fossa nasal": [462, 58],
  "Septo nasal": [500, 88],
  "Conchas nasais": [560, 100],
  "Espinha nasal anterior": [500, 118],
  "Palato duro": [640, 144],
  "Forame/canal incisivo": [500, 146],
  "Sutura palatina mediana": [500, 190],
  "Túber da maxila": [790, 206],
  "Processo zigomático da maxila": [338, 88],
  "Arco zigomático": [205, 106],
  Órbita: [670, 24],
  "Fossa pterigopalatina": [772, 88],
  "Lâmina lateral do processo pterigoide": [216, 178],
  // Mandíbula
  "Cabeça da mandíbula (côndilo)": [100, 116],
  "Colo da mandíbula": [912, 162],
  "Processo coronoide": [794, 164],
  "Incisura da mandíbula": [162, 186],
  "Ramo da mandíbula": [140, 300],
  "Ângulo da mandíbula": [872, 424],
  "Corpo da mandíbula": [640, 420],
  "Cortical (basilar) inferior": [400, 492],
  "Canal da mandíbula": [262, 346],
  "Forame da mandíbula": [838, 262],
  "Forame mentual": [366, 372],
  "Linha oblíqua": [740, 300],
  "Linha milo-hióidea": [680, 372],
  "Fossa da glândula submandibular": [300, 420],
  "Forame lingual / espinhas genianas": [500, 440],
  Sínfise: [500, 476],
  // ATM e base do crânio
  "Fossa mandibular": [900, 90],
  "Eminência articular": [848, 100],
  "Meato acústico externo": [52, 80],
  "Processo mastoide": [40, 150],
  "Processo estiloide": [88, 205],
  // Estruturas adjacentes e tecidos moles
  "Osso hioide": [300, 504],
  "Coluna cervical": [982, 360],
  "Palato mole": [222, 214],
  "Dorso da língua": [776, 246],
  "Lóbulo da orelha": [62, 262],
  "Espaço aéreo (naso e orofaringe)": [868, 330],
};

export interface Hotspot {
  id: string;
  label: string;
  group: string;
  groupId: string;
  pos: Pt;
}

const anatomy = getModule("anatomia");

export const anatomyGroups =
  anatomy?.topics.map((t) => ({ id: t.id, title: t.title })) ?? [];

/** Derivado do Módulo 8: cada estrutura listada no roteiro ganha um marcador. */
export const hotspots: Hotspot[] =
  anatomy?.topics.flatMap((t) =>
    t.points
      .filter((p) => POS[p.label])
      .map((p) => ({
        id: `${t.id}:${p.label}`,
        label: p.label,
        group: t.title,
        groupId: t.id,
        pos: POS[p.label],
      })),
  ) ?? [];

export const GROUP_COLORS: Record<string, string> = {
  maxila: "#38bdf8",
  mandibula: "#f472b6",
  atm: "#fbbf24",
  adjacentes: "#4ade80",
};
