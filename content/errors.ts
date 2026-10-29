import type { PositioningError } from "@/lib/types";

/** Tabela de erros de posicionamento (Módulo 6): causa → aspecto → correção. */
export const positioningErrors: PositioningError[] = [
  {
    id: "frente",
    name: "Paciente muito à frente",
    cause: "Arcadas anteriores à camada de imagem (à frente da ranhura do bloco de mordida).",
    causeRef: { source: "aula", slides: [24, 25, 26, 27] },
    aspect:
      "Dentes anteriores **estreitados e borrados**; sobreposição na região de pré-molares.",
    aspectRef: { source: "complementar" },
    correction: "Incisivos topo a topo na ranhura do bloco de mordida.",
  },
  {
    id: "tras",
    name: "Paciente muito para trás",
    cause: "Arcadas posteriores à camada de imagem.",
    causeRef: { source: "aula", slides: [24, 25, 26, 27] },
    aspect:
      "Dentes anteriores **alargados e borrados**; ramos/côndilos podem ficar cortados nas laterais; fantasmas mais evidentes.",
    aspectRef: { source: "complementar" },
    correction: "Incisivos topo a topo na ranhura do bloco de mordida.",
  },
  {
    id: "rotacao",
    name: "Rotação da cabeça",
    cause: "Plano sagital mediano girado.",
    causeRef: { source: "aula", slides: [30, 31, 32, 33, 34] },
    aspect:
      "**Assimetria**: dentes posteriores e ramo de um lado mais largos e do outro mais estreitos.",
    aspectRef: { source: "complementar" },
    correction: "Plano sagital mediano centralizado com a guia luminosa.",
  },
  {
    id: "inclinacao",
    name: "Inclinação lateral da cabeça",
    cause: "Cabeça inclinada para um dos lados (plano sagital mediano não perpendicular ao solo).",
    causeRef: { source: "aula", slides: [30] },
    aspect:
      "**Plano oclusal inclinado**; bordas inferiores da mandíbula e côndilos em alturas diferentes.",
    aspectRef: { source: "complementar" },
    correction: "Plano sagital mediano perpendicular ao solo.",
  },
  {
    id: "mento-abaixado",
    name: "Mento abaixado",
    cause: "Plano de Frankfurt inclinado para baixo.",
    causeRef: { source: "aula", slides: [35, 36] },
    aspect:
      "Plano oclusal em **“sorriso” exagerado** (curva em V/U acentuada); incisivos **inferiores** borrados; côndilos podem sair pelo topo da imagem; osso hioide sobreposto à mandíbula.",
    aspectRef: { source: "complementar" },
    correction: "Plano de Frankfurt paralelo ao solo.",
  },
  {
    id: "mento-elevado",
    name: "Mento elevado",
    cause: "Plano de Frankfurt inclinado para cima.",
    causeRef: { source: "aula", slides: [37, 38] },
    aspect:
      "Plano oclusal **reto ou invertido (“triste”)**; palato duro largo sobreposto aos ápices dos dentes superiores; incisivos **superiores** borrados.",
    aspectRef: { source: "complementar" },
    correction: "Plano de Frankfurt paralelo ao solo.",
  },
  {
    id: "postura",
    name: "Postura curvada",
    cause: "Coluna não ereta (pescoço curvado).",
    causeRef: { source: "aula", slides: [41] },
    aspect:
      "**Radiopacidade vertical na região anterior** (imagem fantasma da coluna cervical) sobre incisivos e sínfise.",
    aspectRef: { source: "complementar" },
    correction: "Coluna e pescoço esticados.",
  },
  {
    id: "lingua",
    name: "Língua não encostada no palato",
    cause: "Língua afastada do palato durante a exposição.",
    causeRef: { source: "complementar" },
    aspect: "**Faixa radiolúcida (ar)** sobre os ápices dos dentes superiores.",
    aspectRef: { source: "complementar" },
    correction: "Orientar o paciente a manter a língua encostada no palato.",
  },
  {
    id: "metais",
    name: "Objetos metálicos não removidos",
    cause: "Brincos, colares, piercings, grampos, óculos ou próteses removíveis mantidos.",
    causeRef: { source: "aula", slides: [56] },
    aspect:
      "**Imagens reais + fantasmas** (fantasma no lado oposto, mais alto e borrado).",
    aspectRef: { source: "aula", slides: [56] },
    correction: "Remover os adornos e objetos metálicos antes do exame.",
  },
  {
    id: "movimento",
    name: "Movimento do paciente",
    cause: "Paciente se moveu durante o ciclo de exposição.",
    causeRef: { source: "complementar" },
    aspect:
      "Distorções/ondulações e **“degraus” na borda inferior** da mandíbula.",
    aspectRef: { source: "complementar" },
    correction: "Orientar imobilidade; repetir o exame só se necessário.",
  },
  {
    id: "colar",
    name: "Colar de tireoide",
    cause: "Uso de colar de tireoide, que fica no trajeto do feixe.",
    causeRef: { source: "complementar" },
    aspect: "**Área radiopaca** sobre a mandíbula anterior.",
    aspectRef: { source: "complementar" },
    correction: "Usar só o avental de chumbo, sem colar.",
  },
];
