import type { GlossaryTerm } from "@/lib/types";

export const glossary: GlossaryTerm[] = [
  {
    term: "Radiografia panorâmica",
    definition:
      "Exame que mostra, numa única imagem, maxila, mandíbula, dentes e estruturas adjacentes.",
    source: "aula",
    slides: [1, 2],
    module: "conceito",
  },
  {
    term: "Pantomografia / ortopantomografia",
    definition: "Outros nomes da radiografia panorâmica: técnica tomográfica curvilínea extraoral.",
    source: "complementar",
    module: "conceito",
  },
  {
    term: "Centro de rotação",
    definition:
      "Ponto em torno do qual o feixe gira; muda de posição a cada momento do movimento da fonte e do receptor.",
    source: "aula",
    slides: [8, 17],
    module: "conceito",
  },
  {
    term: "Efeito tomográfico",
    definition: "Borramento das estruturas que estão fora da camada de imagem.",
    source: "complementar",
    module: "conceito",
  },
  {
    term: "Camada de imagem (camada focal)",
    definition:
      "Região tridimensional curva, em forma de ferradura, onde as estruturas aparecem nítidas; mais estreita na região anterior.",
    source: "aula",
    slides: [17, 18],
    module: "camada-de-imagem",
  },
  {
    term: "Ampliação horizontal",
    definition:
      "Varia conforme a posição do objeto em relação à camada: mais largo do lado da fonte, mais estreito do lado do receptor.",
    source: "complementar",
    module: "camada-de-imagem",
  },
  {
    term: "Ampliação vertical",
    definition: "Relativamente constante na panorâmica.",
    source: "complementar",
    module: "camada-de-imagem",
  },
  {
    term: "Fonte de raios X (ampola)",
    definition: "Componente de onde parte o feixe; gira sincronizada com o receptor, do lado oposto.",
    source: "aula",
    slides: [6, 8],
    module: "aparelho",
  },
  {
    term: "Receptor de imagem",
    definition: "Sensor digital ou filme/placa que registra a imagem; gira do lado oposto à fonte.",
    source: "aula",
    slides: [6, 8],
    module: "aparelho",
  },
  {
    term: "Cefalostato",
    definition: "Apoios laterais de cabeça do aparelho; fazem parte dos apoios para o paciente.",
    source: "aula",
    slides: [6],
    module: "aparelho",
  },
  {
    term: "Bloco de mordida",
    definition:
      "Peça com ranhura onde os incisivos ocluem topo a topo; define a posição anteroposterior das arcadas.",
    source: "aula",
    slides: [22, 23, 24, 25],
    module: "aparelho",
  },
  {
    term: "Guias luminosas (laser)",
    definition:
      "Linhas de luz que orientam o plano sagital mediano (vertical), o plano de referência horizontal (ex.: Frankfurt) e a camada (frequentemente no canino).",
    source: "aula",
    slides: [23, 29, 33],
    module: "aparelho",
  },
  {
    term: "Ângulo negativo",
    definition:
      "Inclinação do feixe de baixo para cima (aprox. −7°, varia por fabricante); projeta mais alto o que está perto da fonte.",
    source: "aula",
    slides: [20, 21],
    module: "angulo-negativo",
  },
  {
    term: "Plano de Frankfurt",
    definition: "Plano de referência horizontal que deve ficar paralelo ao solo no posicionamento.",
    source: "aula",
    slides: [42],
    module: "posicionamento",
  },
  {
    term: "Plano sagital mediano",
    definition: "Plano que divide a cabeça em direita e esquerda; deve ficar perpendicular ao solo e centralizado.",
    source: "aula",
    slides: [29, 30, 31, 33],
    module: "posicionamento",
  },
  {
    term: "Imagem real",
    definition: "Forma-se quando o objeto está entre o centro de rotação e o receptor de imagem.",
    source: "aula",
    slides: [48, 49],
    module: "imagens-reais-e-fantasmas",
  },
  {
    term: "Imagem fantasma",
    definition:
      "Forma-se quando o objeto está entre o centro de rotação e a fonte; aparece oposta, mais alta, maior e mais borrada.",
    source: "aula",
    slides: [50, 51],
    module: "imagens-reais-e-fantasmas",
  },
  {
    term: "Imagem dupla (real duplicada)",
    definition:
      "Duas imagens reais simétricas de estruturas da linha média posterior atravessadas duas vezes pelo feixe.",
    source: "complementar",
    module: "imagens-reais-e-fantasmas",
  },
  // TODO: validar com o professor — definições gerais de radiologia (não constam dos slides).
  {
    term: "Radiopaco",
    definition: "Área clara (branca) na imagem; aparece em estruturas densas, como osso, dentes e metais.",
    source: "complementar",
  },
  {
    term: "Radiolúcido",
    definition: "Área escura na imagem; aparece onde o feixe passa com facilidade, como no ar.",
    source: "complementar",
  },
  {
    term: "TCFC",
    definition: "Tomografia computadorizada de feixe cônico; no estudo de Estrela et al. (2008), foi a referência de comparação.",
    source: "aula",
    slides: [5],
    module: "desvantagens",
  },
  {
    term: "Sensibilidade",
    definition:
      "Capacidade de um exame detectar a doença quando ela existe. Em Estrela et al. (2008): 0,55 (periapical) × 0,28 (panorâmica).",
    source: "aula",
    slides: [5],
    module: "desvantagens",
  },
  {
    term: "Trismo",
    definition: "Limitação de abertura de boca; a panorâmica é útil nesses pacientes por ser extraoral.",
    source: "complementar",
    module: "vantagens",
  },
  {
    term: "Justificação / ALARA",
    definition:
      "Princípio de proteção radiológica: só expor com justificativa clínica e com a menor dose razoavelmente possível.",
    source: "complementar",
    module: "indicacoes",
  },
  {
    term: "Marcadores D/E (R/L)",
    definition: "Indicam o lado direito/esquerdo na imagem; primeiro passo da interpretação.",
    source: "aula",
    slides: [26, 32],
    module: "interpretacao",
  },
];
