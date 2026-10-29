import { NORMAL, type PanoParams } from "./panorama";

/** Deformação da panorâmica esquemática para cada erro de `content/errors.ts`. */
export const ERROR_PRESETS: Record<string, PanoParams> = {
  normal: NORMAL,
  frente: { ...NORMAL, antWidth: 0.6, blurUpperAnt: 2.6, blurLowerAnt: 2.6, premolarOverlap: 1 },
  tras: { ...NORMAL, antWidth: 1.45, blurUpperAnt: 2.8, blurLowerAnt: 2.8, ramusCut: 1, ghostsBoost: 1 },
  rotacao: { ...NORMAL, scaleR: 1.24, scaleL: 0.78 },
  inclinacao: { ...NORMAL, tilt: 1 },
  "mento-abaixado": { ...NORMAL, smile: 1.3, blurLowerAnt: 2.6, condyleY: -40, hyoidY: -44 },
  "mento-elevado": { ...NORMAL, smile: -0.3, palateY: 20, palateWidth: 2.4, blurUpperAnt: 2.6 },
  postura: { ...NORMAL, spineGhost: 1 },
  lingua: { ...NORMAL, airBand: 1 },
  metais: { ...NORMAL, earring: 1 },
  movimento: { ...NORMAL, motion: 1 },
  colar: { ...NORMAL, collar: 1 },
};
