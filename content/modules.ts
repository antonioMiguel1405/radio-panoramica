import type { KeyPoint, Module } from "@/lib/types";
import { positioningErrors } from "./errors";

/** Intervalo de slides, inclusivo. */
const r = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

/** Estruturas do exercício de identificação da aula (slides 4 e 57–60). */
const anatomyPoint = (label: string): KeyPoint => ({
  label,
  text: label,
  source: "aula",
  slides: [4, ...r(57, 60)],
});

const errorPoints: Record<string, KeyPoint> = Object.fromEntries(
  positioningErrors.map((e) => [
    e.id,
    {
      label: e.name,
      text: `**${e.name}** — ${e.cause} **Na imagem:** ${e.aspect} **Correção:** ${e.correction}`,
      source: e.causeRef.source,
      slides: e.causeRef.slides,
    },
  ]),
);

export const modules: Module[] = [
  // ------------------------------------------------------------------
  {
    slug: "conceito",
    number: 1,
    title: "Conceito e princípio de formação da imagem",
    shortTitle: "Conceito e princípio",
    color: "#0ea5e9",
    icon: "Orbit",
    minutes: 12,
    summary:
      "O que a panorâmica mostra e como fonte e receptor, girando em sincronia ao redor do paciente imóvel, formam a imagem das arcadas.",
    objectives: [
      "Definir radiografia panorâmica e dizer o que ela mostra numa única imagem.",
      "Explicar o movimento sincronizado da fonte e do receptor ao redor do paciente imóvel.",
      "Explicar por que o centro de rotação muda de posição durante o ciclo.",
      "Justificar por que estruturas fora da camada de imagem aparecem borradas.",
    ],
    topics: [
      {
        id: "definicao",
        title: "O que é a radiografia panorâmica",
        summary: "Uma única imagem de maxila, mandíbula, dentes e estruturas adjacentes.",
        points: [
          {
            label: "Visão única das arcadas",
            text: "A radiografia panorâmica mostra, numa **única imagem**, a **maxila**, a **mandíbula**, os **dentes** e as **estruturas adjacentes** — como uma “foto panorâmica” de uma cidade.",
            source: "aula",
            slides: [1, 2],
          },
          {
            label: "Pantomografia / ortopantomografia",
            text: "Também é chamada de **pantomografia** ou **ortopantomografia**: é uma técnica **tomográfica curvilínea extraoral**.",
            source: "complementar",
          },
        ],
      },
      {
        id: "principio",
        title: "Princípio de formação da imagem",
        summary: "Fonte e receptor giram sincronizados, em lados opostos, ao redor do paciente imóvel.",
        figure: "rotacao",
        points: [
          {
            label: "Fonte e receptor sincronizados",
            text: "Nos aparelhos atuais, a **fonte de raios X** e o **receptor de imagem** se movem de forma **sincronizada** ao redor da cabeça; o **paciente fica imóvel**.",
            source: "aula",
            slides: [8],
          },
          {
            label: "Centro de rotação",
            text: "O feixe gira em torno de um **centro de rotação**; fonte e receptor ficam **sempre em lados opostos** do paciente.",
            source: "aula",
            slides: r(8, 16),
          },
        ],
      },
      {
        id: "centro-movel",
        title: "Centro de rotação móvel e camada de imagem",
        summary: "O centro de rotação se desloca para manter as arcadas na camada de imagem.",
        points: [
          {
            label: "Centro muda a cada momento",
            text: "O centro de rotação **muda de posição a cada momento** do movimento da fonte e do receptor.",
            source: "aula",
            slides: [17],
          },
          {
            label: "“Objeto focado” contínuo",
            text: "Isso faz o **“objeto focado” mudar continuamente**, de modo que as arcadas do paciente fiquem dentro da chamada **camada de imagem**.",
            source: "aula",
            slides: [17],
          },
          {
            label: "Efeito tomográfico",
            text: "Estruturas **fora da camada de imagem ficam borradas** (efeito tomográfico); por isso a imagem prioriza as arcadas.",
            source: "complementar",
          },
        ],
      },
    ],
    callouts: [
      {
        variant: "pegadinha",
        title: "Quem se move?",
        text: "Na panorâmica, **o paciente fica imóvel**. Quem gira são a **fonte e o receptor**, de forma sincronizada e sempre em lados opostos da cabeça.",
        source: "aula",
        slides: [8],
      },
    ],
    selfCheck: [
      {
        q: "Quais componentes se movem durante a exposição panorâmica e como eles se movem?",
        a: "A fonte de raios X e o receptor de imagem. Eles giram de forma sincronizada ao redor da cabeça, sempre em lados opostos, em torno de um centro de rotação. O paciente permanece imóvel.",
      },
      {
        q: "Por que o centro de rotação muda de posição durante o ciclo?",
        a: "Para que o “objeto focado” mude continuamente e as arcadas do paciente fiquem dentro da camada de imagem.",
      },
      {
        q: "Por que estruturas distantes das arcadas aparecem borradas?",
        a: "Porque estão fora da camada de imagem: o movimento do sistema as borra (efeito tomográfico).",
      },
    ],
    simulator: { tab: "fantasma", label: "Ver a rotação no simulador" },
  },

  // ------------------------------------------------------------------
  {
    slug: "aparelho",
    number: 2,
    title: "O aparelho",
    shortTitle: "O aparelho",
    color: "#6366f1",
    icon: "ScanLine",
    minutes: 10,
    summary:
      "Fonte, receptor e apoios do paciente; bloco de mordida, guias luminosas e camada ajustável.",
    objectives: [
      "Listar os componentes do aparelho panorâmico.",
      "Explicar a função do bloco de mordida e como os incisivos devem ocluir nele.",
      "Descrever as três guias luminosas e o que cada uma orienta.",
      "Reconhecer que a forma da camada de imagem varia entre aparelhos.",
    ],
    topics: [
      {
        id: "componentes",
        title: "Componentes",
        summary: "Fonte de raios X, receptor de imagem e apoios para o paciente.",
        figure: "aparelho",
        points: [
          {
            label: "Fonte de raios X (ampola)",
            text: "**Fonte de raios X (ampola)**: de onde parte o feixe.",
            source: "aula",
            slides: [6],
          },
          {
            label: "Receptor de imagem",
            text: "**Receptor de imagem**: sensor digital ou filme/placa.",
            source: "aula",
            slides: [6],
          },
          {
            label: "Apoios para o paciente",
            text: "**Apoios para o paciente**: apoio de mento, cefalostato/apoios laterais de cabeça, bloco de mordida e alças para as mãos.",
            source: "aula",
            slides: [6],
          },
        ],
      },
      {
        id: "bloco-mordida",
        title: "Bloco de mordida",
        summary: "Os incisivos ocluem topo a topo na ranhura do bloco.",
        points: [
          {
            label: "Incisivos topo a topo",
            text: "Os incisivos ocluem **topo a topo na ranhura** do bloco de mordida.",
            source: "aula",
            slides: r(22, 25),
          },
          {
            label: "Modelos de bloco/apoio",
            text: "Existem diferentes modelos de bloco/apoio: para **dentados**, para **desdentados** e **apoio de mento**.",
            source: "aula",
            slides: r(22, 25),
          },
        ],
      },
      {
        id: "guias",
        title: "Guias luminosas (laser)",
        summary: "Linhas de luz que orientam os planos de posicionamento.",
        points: [
          {
            label: "Linha vertical: sagital mediano",
            text: "Linha **vertical** do **plano sagital mediano**.",
            source: "aula",
            slides: [23, 29, 33],
          },
          {
            label: "Linha horizontal: Frankfurt",
            text: "Linha **horizontal** do plano de referência (ex.: **plano de Frankfurt**).",
            source: "aula",
            slides: [23, 29, 33],
          },
          {
            label: "Linha da camada (canino)",
            text: "Linha da **camada de imagem**, frequentemente na região do **canino**, conforme o fabricante.",
            source: "aula",
            slides: [23, 29, 33],
          },
        ],
      },
      {
        id: "camada-ajustavel",
        title: "Camada ajustável",
        summary: "A forma e a largura da camada podem variar por região e por fabricante.",
        points: [
          {
            label: "Ajuste por região",
            text: "Aparelhos modernos podem **ajustar a forma/largura da camada de imagem** por região.",
            source: "aula",
            slides: [19],
          },
          {
            label: "Varia por fabricante",
            text: "A forma exata da camada **varia entre fabricantes**.",
            source: "complementar",
          },
        ],
      },
    ],
    callouts: [
      {
        variant: "dica",
        title: "Bloco de mordida não é só conforto",
        text: "É a ranhura do bloco que coloca as arcadas na posição **anteroposterior** correta, dentro da camada de imagem.",
        source: "aula",
        slides: r(23, 25),
      },
    ],
    selfCheck: [
      {
        q: "Cite os três grupos de componentes do aparelho panorâmico.",
        a: "Fonte de raios X (ampola); receptor de imagem (sensor digital ou filme/placa); apoios para o paciente (apoio de mento, cefalostato/apoios laterais, bloco de mordida, alças para as mãos).",
      },
      {
        q: "Quais são as guias luminosas e o que cada uma orienta?",
        a: "Linha vertical: plano sagital mediano. Linha horizontal: plano de referência (ex.: Frankfurt). Linha da camada: posição anteroposterior, frequentemente na região do canino, conforme o fabricante.",
      },
      {
        q: "Como os incisivos devem ficar no bloco de mordida?",
        a: "Superiores e inferiores topo a topo na ranhura do bloco.",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    slug: "camada-de-imagem",
    number: 3,
    title: "Camada de imagem (camada focal)",
    shortTitle: "Camada de imagem",
    color: "#14b8a6",
    icon: "Layers",
    minutes: 15,
    summary:
      "Região em ferradura onde a imagem é nítida — mais estreita na frente — e as distorções de ampliação.",
    objectives: [
      "Definir camada de imagem e descrever sua forma.",
      "Explicar por que erros anteroposteriores afetam principalmente os dentes anteriores.",
      "Prever se um objeto deslocado ficará mais largo ou mais estreito.",
      "Diferenciar ampliação vertical e horizontal e justificar a baixa confiabilidade de medidas.",
    ],
    topics: [
      {
        id: "definicao-camada",
        title: "Definição",
        summary: "Região tridimensional curva, em ferradura, onde as estruturas ficam nítidas.",
        figure: "camada",
        points: [
          {
            label: "Ferradura tridimensional",
            text: "Região **tridimensional curva, em forma de ferradura**, onde as estruturas aparecem **nítidas** na imagem.",
            source: "aula",
            slides: [17, 18],
          },
          {
            label: "Fora da camada: borrado",
            text: "Estruturas fora da camada aparecem **borradas** e com **dimensões distorcidas**.",
            source: "complementar",
          },
        ],
      },
      {
        id: "espessura",
        title: "Espessura da camada",
        summary: "Mais estreita na região anterior, mais larga na posterior.",
        points: [
          {
            label: "Mais estreita na frente",
            text: "A camada é **mais estreita na região anterior** e mais larga na posterior.",
            source: "complementar",
          },
          {
            label: "Anteriores mais sensíveis",
            text: "Por isso, erros de posicionamento **anteroposterior** afetam principalmente os **dentes anteriores**.",
            source: "complementar",
          },
        ],
      },
      {
        id: "ampliacao",
        title: "Ampliação e distorção",
        summary: "Ampliação vertical quase constante; horizontal variável conforme a posição do objeto.",
        points: [
          {
            label: "Vertical ≈ constante",
            text: "A **ampliação vertical** é relativamente constante.",
            source: "complementar",
          },
          {
            label: "Horizontal variável",
            text: "A **ampliação horizontal** varia conforme a posição do objeto em relação à camada → **distorção de forma**.",
            source: "complementar",
          },
          {
            label: "Lado da fonte: mais largo",
            text: "Objeto deslocado para o **lado da fonte** (lingual à camada) fica **mais largo**.",
            source: "complementar",
          },
          {
            label: "Lado do receptor: mais estreito",
            text: "Objeto deslocado para o **lado do receptor** (vestibular à camada) fica **mais estreito**.",
            source: "complementar",
          },
        ],
        table: {
          caption: "Para onde o objeto foi deslocado × como ele aparece",
          headers: ["Posição do objeto", "Largura na imagem", "Nitidez"],
          rows: [
            ["Dentro da camada", "Proporcional", "Nítido"],
            ["Lado da fonte (lingual à camada)", "Mais largo", "Borrado"],
            ["Lado do receptor (vestibular à camada)", "Mais estreito", "Borrado"],
          ],
          source: "complementar",
        },
      },
      {
        id: "medidas",
        title: "Consequência clínica",
        summary: "A panorâmica não é confiável para medidas lineares precisas.",
        points: [
          {
            label: "Medidas pouco confiáveis",
            text: "A panorâmica **não é confiável para medidas lineares precisas**, sobretudo **horizontais**.",
            source: "complementar",
          },
        ],
      },
    ],
    callouts: [
      {
        variant: "mnemonico",
        title: "Receptor Reduz, Fonte Farta",
        text: "Perto do **R**eceptor (vestibular à camada) a imagem **R**eduz (estreita); perto da **F**onte (lingual à camada) ela fica **F**arta (larga). Paciente muito à frente = dentes anteriores perto do receptor = **estreitos**.",
        source: "complementar",
      },
      {
        variant: "pegadinha",
        title: "A camada não tem a mesma espessura",
        text: "Ela é **mais estreita na frente**: pequenos erros anteroposteriores já borram os incisivos, enquanto a região posterior tolera mais.",
        source: "complementar",
      },
    ],
    selfCheck: [
      {
        q: "Por que os incisivos são os dentes mais afetados por erros anteroposteriores?",
        a: "Porque a camada de imagem é mais estreita na região anterior: pequenos deslocamentos já tiram os incisivos da camada.",
      },
      {
        q: "Um dente deslocado para o lado da fonte (lingual à camada) aparece como?",
        a: "Mais largo e borrado.",
      },
      {
        q: "Por que não se fazem medidas lineares precisas na panorâmica?",
        a: "Porque a ampliação horizontal varia conforme a posição do objeto em relação à camada, gerando distorção de forma. A vertical é relativamente constante; a horizontal, não.",
      },
    ],
    simulator: { tab: "camada", label: "Mover a arcada no simulador" },
  },

  // ------------------------------------------------------------------
  {
    slug: "angulo-negativo",
    number: 4,
    title: "Ângulo negativo",
    shortTitle: "Ângulo negativo",
    color: "#f59e0b",
    icon: "Triangle",
    minutes: 10,
    summary:
      "O feixe vem de baixo para cima: o palato é projetado sobre os ápices e os fantasmas aparecem mais altos.",
    objectives: [
      "Explicar o que é a angulação negativa do feixe.",
      "Usar a analogia da lanterna para justificar as projeções mais altas.",
      "Explicar a projeção do palato duro e diferenciá-lo do assoalho da fossa nasal.",
      "Relacionar o ângulo negativo à altura das imagens fantasmas.",
    ],
    topics: [
      {
        id: "o-que-e",
        title: "O que é",
        summary: "Feixe de baixo para cima, como lanterna abaixo de um objeto.",
        figure: "angulo",
        points: [
          {
            label: "De baixo para cima",
            text: "O feixe incide **de baixo para cima** (**angulação negativa**).",
            source: "aula",
            slides: [20, 21],
          },
          {
            label: "Analogia da lanterna",
            text: "Como uma **lanterna posicionada abaixo** de um objeto, que projeta sua sombra **mais alta** na parede.",
            source: "aula",
            slides: [20, 21],
          },
          {
            label: "Aproximadamente −7°",
            text: "A angulação é de aproximadamente **−7°** (varia conforme o fabricante).",
            source: "complementar",
          },
        ],
      },
      {
        id: "consequencias",
        title: "Consequências na imagem",
        summary: "Palato sobre os ápices superiores; estruturas próximas à fonte projetadas mais altas.",
        points: [
          {
            label: "Palato sobre os ápices",
            text: "O **palato duro** é projetado como **faixa radiopaca horizontal** sobre a região dos ápices dos dentes superiores / acima deles.",
            source: "aula",
            slides: [21],
          },
          {
            label: "Perto da fonte = mais alto",
            text: "Estruturas **próximas à fonte** são projetadas **mais altas**.",
            source: "aula",
            slides: [21],
          },
          {
            label: "Fantasmas mais altos",
            text: "O ângulo negativo explica por que as **imagens fantasmas aparecem mais altas** que o objeto real.",
            source: "complementar",
          },
        ],
      },
      {
        id: "palato-fossa",
        title: "Palato duro × assoalho da fossa nasal",
        summary: "Duas faixas radiopacas horizontais distintas.",
        points: [
          {
            label: "Duas faixas distintas",
            text: "**Palato duro** e **assoalho da fossa nasal** aparecem como **faixas radiopacas horizontais distintas** na imagem.",
            source: "aula",
            slides: [55],
          },
          {
            label: "Palato: real + projetada",
            text: "O palato tem **imagem real** e também **imagem projetada pelo lado oposto**.",
            source: "aula",
            slides: [55],
          },
        ],
      },
    ],
    callouts: [
      {
        variant: "mnemonico",
        title: "Lanterna embaixo, sombra em cima",
        text: "Fonte baixa → o que está **perto da fonte sobe** na imagem: é o caso do palato e das imagens fantasmas.",
        source: "aula",
        slides: [20, 21],
      },
      {
        variant: "pegadinha",
        title: "Fantasma é mais alto, não mais baixo",
        text: "Por causa do feixe de baixo para cima, a imagem fantasma aparece **mais alta** que o objeto real.",
        source: "complementar",
      },
    ],
    selfCheck: [
      {
        q: "Explique a analogia da lanterna usada para o ângulo negativo.",
        a: "Uma lanterna posicionada abaixo de um objeto projeta a sombra mais alta na parede. Da mesma forma, o feixe panorâmico vem de baixo para cima e projeta mais alto o que está próximo da fonte.",
      },
      {
        q: "Por que a imagem fantasma aparece mais alta que o objeto real?",
        a: "Por causa da angulação negativa (de baixo para cima): o objeto que forma o fantasma está do lado da fonte e é projetado mais alto.",
      },
      {
        q: "Qual estrutura aparece como faixa radiopaca horizontal sobre ou acima dos ápices superiores por causa do ângulo negativo?",
        a: "O palato duro — que não deve ser confundido com o assoalho da fossa nasal.",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    slug: "posicionamento",
    number: 5,
    title: "Posicionamento correto do paciente",
    shortTitle: "Posicionamento",
    color: "#22c55e",
    icon: "UserCheck",
    minutes: 15,
    summary:
      "Postura ereta, Frankfurt paralelo ao solo, sagital mediano perpendicular e centralizado, incisivos na ranhura, língua no palato.",
    objectives: [
      "Descrever o preparo do paciente (avental sem colar; remoção de metais).",
      "Orientar corretamente o plano de Frankfurt e o plano sagital mediano.",
      "Explicar o posicionamento anteroposterior pelo bloco de mordida.",
      "Justificar a língua no palato e a imobilidade durante o ciclo.",
    ],
    topics: [
      {
        id: "preparo",
        title: "Preparo do paciente",
        summary: "Remover metais; avental de chumbo sem colar de tireoide.",
        points: [
          {
            label: "Remover objetos metálicos",
            text: "**Remover objetos metálicos** da cabeça e do pescoço: brincos, colares, piercings, grampos, óculos e próteses removíveis — eles geram **imagens reais e fantasmas**.",
            source: "aula",
            slides: [54, 56],
          },
          {
            label: "Avental de chumbo",
            text: "Paciente com **avental de chumbo**.",
            source: "aula",
            slides: [39],
          },
          {
            label: "Sem colar de tireoide",
            text: "**Não usar colar de tireoide** na panorâmica: ele fica no trajeto do feixe e cria **área radiopaca sobre a mandíbula anterior**.",
            source: "complementar",
          },
        ],
      },
      {
        id: "postura",
        title: "Postura",
        summary: "De pé ou sentado, coluna ereta, pescoço esticado, segurando as alças.",
        figure: "posicionamento",
        points: [
          {
            label: "Coluna ereta",
            text: "Paciente **de pé (ou sentado)**, **coluna ereta**, pés juntos/levemente à frente, **segurando as alças** do aparelho.",
            source: "aula",
            slides: [39],
          },
          {
            label: "Pescoço esticado",
            text: "Pescoço **esticado e alinhado** (polegar para baixo = postura curvada; polegar para cima = postura ereta).",
            source: "aula",
            slides: [41],
          },
        ],
      },
      {
        id: "planos",
        title: "Planos de referência",
        summary: "Frankfurt paralelo ao solo; sagital mediano perpendicular e centralizado; incisivos na ranhura.",
        points: [
          {
            label: "Frankfurt paralelo ao solo",
            text: "Plano de referência horizontal (ex.: **plano de Frankfurt**) **paralelo ao solo**.",
            source: "aula",
            slides: [42],
          },
          {
            label: "Sagital mediano perpendicular",
            text: "**Plano sagital mediano perpendicular ao solo e centralizado** — sem rotação nem inclinação lateral da cabeça.",
            source: "aula",
            slides: [29, 30, 31, 33],
          },
          {
            label: "Incisivos na ranhura",
            text: "**Anteroposterior**: incisivos superiores e inferiores na **ranhura do bloco de mordida**, para que as arcadas fiquem dentro da camada de imagem.",
            source: "aula",
            slides: r(23, 25),
          },
        ],
        table: {
          caption: "Checklist de posicionamento",
          headers: ["Referência", "Como deve ficar", "Se errar (ver Módulo 6)"],
          rows: [
            ["Plano de Frankfurt", "Paralelo ao solo", "Mento abaixado ou elevado"],
            ["Plano sagital mediano", "Perpendicular ao solo e centralizado", "Rotação ou inclinação lateral"],
            ["Incisivos", "Topo a topo na ranhura do bloco", "Muito à frente ou muito para trás"],
            ["Coluna e pescoço", "Coluna ereta, pescoço esticado", "Fantasma da coluna na região anterior"],
            ["Língua", "Encostada no palato", "Faixa radiolúcida sobre ápices superiores"],
            ["Objetos metálicos", "Removidos", "Imagens reais e fantasmas"],
          ],
          source: "aula",
          slides: [23, 24, 25, 29, 30, 31, 33, 39, 41, 42],
          note: "Referências de posicionamento: aula. Consequências dos erros e orientação da língua: literatura complementar.",
        },
      },
      {
        id: "exposicao",
        title: "Durante a exposição",
        summary: "Língua no palato, lábios fechados e imobilidade.",
        points: [
          {
            label: "Língua no palato",
            text: "**Língua encostada no palato** durante toda a exposição; **lábios fechados** sobre o bloco.",
            source: "complementar",
          },
          {
            label: "Imobilidade",
            text: "Paciente **imóvel** durante todo o ciclo (aprox. **10–20 s**, conforme o aparelho).",
            source: "complementar",
          },
        ],
      },
    ],
    callouts: [
      {
        variant: "mnemonico",
        title: "Frankfurt deitado, sagital em pé",
        text: "**Frankfurt** fica **paralelo ao solo** (deitado); o **sagital mediano** fica **perpendicular ao solo** (em pé) e centralizado.",
        source: "aula",
        slides: [29, 42],
      },
      {
        variant: "pegadinha",
        title: "Avental sim, colar não",
        text: "Na panorâmica o **colar de tireoide não é usado**: ele fica no trajeto do feixe e gera área radiopaca sobre a mandíbula anterior.",
        source: "complementar",
      },
    ],
    selfCheck: [
      {
        q: "Como devem estar o plano de Frankfurt e o plano sagital mediano?",
        a: "Frankfurt paralelo ao solo; sagital mediano perpendicular ao solo e centralizado (sem rotação nem inclinação lateral).",
      },
      {
        q: "Por que o colar de tireoide não é usado na panorâmica?",
        a: "Porque fica no trajeto do feixe e cria uma área radiopaca sobre a mandíbula anterior.",
      },
      {
        q: "Qual a orientação para a língua durante a exposição, e o que acontece se ela não for seguida?",
        a: "A língua deve ficar encostada no palato. Se não ficar, o ar entre a língua e o palato forma uma faixa radiolúcida sobre os ápices dos dentes superiores.",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    slug: "erros-de-posicionamento",
    number: 6,
    title: "Erros de posicionamento",
    shortTitle: "Erros de posicionamento",
    color: "#ef4444",
    icon: "TriangleAlert",
    minutes: 20,
    summary:
      "Cada erro deixa uma “assinatura” na imagem: causa → aspecto → correção.",
    objectives: [
      "Relacionar cada erro de posicionamento à sua causa.",
      "Reconhecer o aspecto de cada erro na imagem panorâmica.",
      "Indicar a correção de cada erro.",
      "Diferenciar mento abaixado × mento elevado e paciente à frente × para trás.",
    ],
    topics: [
      {
        id: "anteroposterior",
        title: "Erros anteroposteriores",
        summary: "Muito à frente → anteriores estreitos; muito para trás → anteriores largos.",
        points: [errorPoints["frente"], errorPoints["tras"]],
      },
      {
        id: "sagital",
        title: "Erros do plano sagital mediano",
        summary: "Rotação → assimetria; inclinação → plano oclusal inclinado.",
        points: [errorPoints["rotacao"], errorPoints["inclinacao"]],
      },
      {
        id: "frankfurt",
        title: "Erros do plano de Frankfurt",
        summary: "Mento abaixado → “sorriso”; mento elevado → plano reto/“triste”.",
        points: [errorPoints["mento-abaixado"], errorPoints["mento-elevado"]],
      },
      {
        id: "postura-lingua",
        title: "Postura, língua e movimento",
        summary: "Fantasma da coluna, faixa de ar e “degraus” na borda inferior.",
        points: [errorPoints["postura"], errorPoints["lingua"], errorPoints["movimento"]],
      },
      {
        id: "objetos",
        title: "Objetos e acessórios",
        summary: "Metais geram reais + fantasmas; colar de tireoide gera área radiopaca.",
        points: [errorPoints["metais"], errorPoints["colar"]],
      },
    ],
    callouts: [
      {
        variant: "mnemonico",
        title: "Mento abaixado sorri; mento elevado fica triste",
        text: "**Abaixado** → plano oclusal em **“sorriso”** exagerado. **Elevado** → plano oclusal **reto ou invertido (“triste”)**.",
        source: "complementar",
      },
      {
        variant: "mnemonico",
        title: "Frente estreita, trás larga",
        text: "Paciente **à frente** → incisivos **estreitos** e borrados. Paciente **para trás** → incisivos **largos** e borrados.",
        source: "complementar",
      },
      {
        variant: "pegadinha",
        title: "Superiores × inferiores",
        text: "Mento **elevado** borra os incisivos **superiores** e joga o palato sobre os ápices superiores. Mento **abaixado** borra os incisivos **inferiores** e aproxima o hioide da mandíbula. Não inverta!",
        source: "complementar",
      },
    ],
    selfCheck: [
      {
        q: "Uma panorâmica mostra incisivos estreitos e borrados. Qual é o erro e como corrigir?",
        a: "Paciente muito à frente (arcadas anteriores à camada). Correção: incisivos topo a topo na ranhura do bloco de mordida.",
      },
      {
        q: "Plano oclusal em “sorriso” exagerado e côndilos saindo pelo topo da imagem: qual é o erro?",
        a: "Mento abaixado (Frankfurt inclinado para baixo). Correção: Frankfurt paralelo ao solo.",
      },
      {
        q: "Dentes posteriores e ramo de um lado mais largos que os do outro lado indicam qual erro?",
        a: "Rotação da cabeça (plano sagital mediano girado). Correção: centralizar o plano sagital mediano com a guia luminosa.",
      },
      {
        q: "Faixa radiolúcida sobre os ápices dos dentes superiores. Qual é a causa?",
        a: "Língua não encostada no palato (ar entre a língua e o palato).",
      },
    ],
    simulator: { tab: "erros", label: "Simular os erros" },
  },

  // ------------------------------------------------------------------
  {
    slug: "imagens-reais-e-fantasmas",
    number: 7,
    title: "Imagem real × imagem fantasma × imagem dupla",
    shortTitle: "Real × fantasma × dupla",
    color: "#a855f7",
    icon: "Ghost",
    minutes: 20,
    summary:
      "A posição do objeto em relação ao centro de rotação define se ele forma imagem real, fantasma ou dupla.",
    objectives: [
      "Definir imagem real e imagem fantasma pela posição do objeto em relação ao centro de rotação.",
      "Descrever as características da imagem fantasma (oposta, alta, grande e borrada).",
      "Explicar o que são imagens duplas.",
      "Classificar estruturas anatômicas e objetos quanto ao tipo de imagem formada.",
    ],
    topics: [
      {
        id: "real",
        title: "Imagem real",
        summary: "Objeto entre o centro de rotação e o receptor.",
        figure: "real-fantasma",
        points: [
          {
            label: "Entre centro e receptor",
            text: "A **imagem real** forma-se quando o objeto está localizado **entre o centro de rotação e o receptor de imagem**.",
            source: "aula",
            slides: [48, 49],
          },
        ],
      },
      {
        id: "fantasma",
        title: "Imagem fantasma",
        summary: "Objeto entre o centro de rotação e a fonte: oposta, alta, grande e borrada.",
        points: [
          {
            label: "Entre centro e fonte",
            text: "A **imagem fantasma** forma-se quando o objeto está localizado **entre o centro de rotação e a fonte de raios X**.",
            source: "aula",
            slides: [50, 51],
          },
          {
            label: "Oposta, alta, grande, borrada",
            text: "A imagem fantasma aparece no **lado oposto** ao objeto real, **mais alta** (por causa do ângulo negativo), **maior** (principalmente na horizontal) e **mais borrada**; mantém a forma geral do objeto.",
            source: "complementar",
          },
          {
            label: "Analogia do borrão",
            text: "Assim como numa foto com movimento (ciclista fotografado em *panning*), **o que não acompanha o movimento do sistema fica borrado**.",
            source: "aula",
            slides: [52],
          },
        ],
      },
      {
        id: "multiplas",
        title: "Imagens múltiplas e imagens duplas",
        summary: "Um objeto atravessado mais de uma vez pode gerar mais de uma imagem.",
        points: [
          {
            label: "Mais de uma imagem",
            text: "Um mesmo objeto pode ser **atravessado pelo feixe em diferentes momentos do ciclo**, gerando mais de uma imagem.",
            source: "aula",
            slides: [47],
          },
          {
            label: "Imagens duplas",
            text: "**Imagens duplas (reais duplicadas)**: estruturas na **linha média posterior**, atravessadas **duas vezes** pelo feixe, que aparecem como **duas imagens reais simétricas**.",
            source: "complementar",
          },
        ],
      },
      {
        id: "classificacao",
        title: "Classificação das estruturas (plano axial)",
        summary: "Quais estruturas formam imagens reais, duplicadas, fantasmas ou reais + fantasmas.",
        points: [
          {
            label: "Apenas reais",
            text: "**Apenas imagens reais**: corpo da mandíbula, dentes, seios maxilares.",
            source: "aula",
            slides: [54],
          },
          {
            label: "Reais duplicadas",
            text: "**Imagens reais duplicadas**: corpo do osso hioide, palato, coluna cervical.",
            source: "aula",
            slides: [54],
          },
          {
            label: "Fantasmas",
            text: "**Imagens fantasmas**: coluna cervical, colares (adornos) de pescoço, cornos do osso hioide.",
            source: "aula",
            slides: [54],
          },
          {
            label: "Reais únicas + fantasmas",
            text: "**Imagens reais únicas e fantasmas**: cornos maiores do osso hioide, ramo da mandíbula, cabeça da mandíbula, brincos, colares e zíperes de roupas.",
            source: "aula",
            slides: [54],
          },
        ],
        table: {
          caption: "Classificação das imagens no plano axial",
          headers: ["Tipo de imagem", "Estruturas / objetos"],
          rows: [
            ["Apenas imagens reais", "Corpo da mandíbula, dentes, seios maxilares"],
            ["Imagens reais duplicadas", "Corpo do osso hioide, palato, coluna cervical"],
            ["Imagens fantasmas", "Coluna cervical, colares (adornos) de pescoço, cornos do osso hioide"],
            [
              "Imagens reais únicas e fantasmas",
              "Cornos maiores do osso hioide, ramo da mandíbula, cabeça da mandíbula, brincos, colares e zíperes de roupas",
            ],
          ],
          source: "aula",
          slides: [54],
        },
      },
      {
        id: "brinco",
        title: "Exemplo clássico: brinco",
        summary: "Real no lado do brinco; fantasma no lado oposto, mais alto.",
        points: [
          {
            label: "Brinco: real + fantasma",
            text: "**Brincos** geram **imagem real no lado do brinco** e **imagem fantasma no lado oposto, mais alta**.",
            source: "aula",
            slides: [56],
          },
        ],
      },
    ],
    callouts: [
      {
        variant: "mnemonico",
        title: "OPOSTA, ALTA, GRANDE e BORRADA",
        text: "As quatro características da imagem fantasma: aparece no lado **oposto**, mais **alta**, **maior** e mais **borrada**.",
        source: "complementar",
      },
      {
        variant: "mnemonico",
        title: "Real = Receptor · Fantasma = Fonte",
        text: "Tomando o **centro de rotação** como referência: objeto do lado do **R**eceptor → imagem **R**eal; objeto do lado da **F**onte → imagem **F**antasma.",
        source: "aula",
        slides: [48, 49, 50, 51],
      },
      {
        variant: "pegadinha",
        title: "A coluna aparece em duas linhas da tabela",
        text: "A **coluna cervical** está tanto em “reais duplicadas” quanto em “fantasmas” — está correto: um mesmo objeto pode ser atravessado pelo feixe em diferentes momentos do ciclo.",
        source: "aula",
        slides: [47, 54],
      },
    ],
    selfCheck: [
      {
        q: "Onde o objeto precisa estar para formar imagem real? E imagem fantasma?",
        a: "Real: entre o centro de rotação e o receptor de imagem. Fantasma: entre o centro de rotação e a fonte de raios X.",
      },
      {
        q: "Paciente com brinco na orelha esquerda: descreva as imagens formadas.",
        a: "Imagem real à esquerda (lado do brinco) e imagem fantasma à direita (lado oposto), mais alta, maior e mais borrada.",
      },
      {
        q: "Cite estruturas que formam apenas imagens reais.",
        a: "Corpo da mandíbula, dentes e seios maxilares.",
      },
      {
        q: "O que são imagens duplas?",
        a: "Imagens reais duplicadas de estruturas da linha média posterior, atravessadas duas vezes pelo feixe, que aparecem como duas imagens reais simétricas (ex.: corpo do hioide, palato, coluna cervical).",
      },
    ],
    simulator: { tab: "fantasma", label: "Arrastar um brinco no simulador" },
  },

  // ------------------------------------------------------------------
  {
    slug: "anatomia",
    number: 8,
    title: "Anatomia radiográfica na panorâmica",
    shortTitle: "Anatomia radiográfica",
    color: "#ec4899",
    icon: "Bone",
    minutes: 25,
    summary:
      "Estruturas da maxila, da mandíbula, da ATM e base do crânio, e tecidos moles/espaços aéreos.",
    objectives: [
      "Reconhecer as estruturas da maxila e da face média.",
      "Reconhecer as estruturas da mandíbula.",
      "Reconhecer as estruturas da ATM e da base do crânio.",
      "Reconhecer estruturas adjacentes, tecidos moles e espaços aéreos.",
    ],
    topics: [
      {
        id: "maxila",
        title: "Maxila e face média",
        summary: "Seios maxilares, fossas nasais, palato, zigoma e região pterigoide.",
        figure: "anatomia",
        points: [
          "Seio maxilar e seu assoalho",
          "Fossa nasal",
          "Septo nasal",
          "Conchas nasais",
          "Espinha nasal anterior",
          "Palato duro",
          "Forame/canal incisivo",
          "Sutura palatina mediana",
          "Túber da maxila",
          "Processo zigomático da maxila",
          "Arco zigomático",
          "Órbita",
          "Fossa pterigopalatina",
          "Lâmina lateral do processo pterigoide",
        ].map(anatomyPoint),
      },
      {
        id: "mandibula",
        title: "Mandíbula",
        summary: "Côndilo, ramo, corpo, canal, forames e linhas ósseas.",
        points: [
          "Cabeça da mandíbula (côndilo)",
          "Colo da mandíbula",
          "Processo coronoide",
          "Incisura da mandíbula",
          "Ramo da mandíbula",
          "Ângulo da mandíbula",
          "Corpo da mandíbula",
          "Cortical (basilar) inferior",
          "Canal da mandíbula",
          "Forame da mandíbula",
          "Forame mentual",
          "Linha oblíqua",
          "Linha milo-hióidea",
          "Fossa da glândula submandibular",
          "Forame lingual / espinhas genianas",
          "Sínfise",
        ].map(anatomyPoint),
      },
      {
        id: "atm",
        title: "ATM e base do crânio",
        summary: "Fossa mandibular, eminência articular, meato acústico, mastoide e estiloide.",
        points: [
          "Fossa mandibular",
          "Eminência articular",
          "Meato acústico externo",
          "Processo mastoide",
          "Processo estiloide",
        ].map(anatomyPoint),
      },
      {
        id: "adjacentes",
        title: "Estruturas adjacentes e tecidos moles",
        summary: "Hioide, coluna, palato mole, língua, orelha e espaço aéreo.",
        points: [
          "Osso hioide",
          "Coluna cervical",
          "Palato mole",
          "Dorso da língua",
          "Lóbulo da orelha",
          "Espaço aéreo (naso e orofaringe)",
        ].map(anatomyPoint),
      },
    ],
    callouts: [
      {
        variant: "pegadinha",
        title: "Palato duro × assoalho da fossa nasal",
        text: "São **faixas radiopacas horizontais distintas**. O palato ainda tem uma **imagem projetada pelo lado oposto**.",
        source: "aula",
        slides: [55],
      },
      {
        variant: "dica",
        title: "Treine no esquema",
        text: "Use o **modo treino** do esquema interativo: ele mostra o nome e você toca no local — ou mostra o local e você escolhe o nome.",
        source: "complementar",
      },
    ],
    selfCheck: [
      {
        q: "Cite cinco estruturas da mandíbula visíveis na panorâmica.",
        a: "Por exemplo: cabeça da mandíbula (côndilo), processo coronoide, incisura da mandíbula, canal da mandíbula, forame mentual, linha oblíqua, cortical (basilar) inferior, sínfise.",
      },
      {
        q: "Quais estruturas da ATM e da base do crânio aparecem na panorâmica?",
        a: "Fossa mandibular, eminência articular, meato acústico externo, processo mastoide e processo estiloide.",
      },
      {
        q: "Quais tecidos moles e espaços aéreos podem aparecer?",
        a: "Palato mole, dorso da língua, lóbulo da orelha e espaço aéreo (naso e orofaringe).",
      },
    ],
    simulator: { tab: "anatomia", label: "Treinar anatomia" },
  },

  // ------------------------------------------------------------------
  {
    slug: "vantagens",
    number: 9,
    title: "Vantagens",
    shortTitle: "Vantagens",
    color: "#10b981",
    icon: "ThumbsUp",
    minutes: 8,
    summary:
      "Visão ampla numa única imagem, dose relativamente baixa, rapidez e conforto.",
    objectives: [
      "Listar as vantagens da radiografia panorâmica.",
      "Explicar por que ela é útil em pacientes com trismo ou reflexo de náusea.",
      "Comparar, de forma qualitativa, sua dose com a de um levantamento periapical completo.",
    ],
    topics: [
      {
        id: "abrangencia",
        title: "Abrangência",
        summary: "Dentes, maxila, mandíbula, ATM e seios numa única imagem.",
        points: [
          {
            label: "Visão ampla",
            text: "Visão ampla de **dentes, maxila, mandíbula, ATM e seios maxilares** numa única imagem.",
            source: "complementar",
          },
          {
            label: "Avaliação inicial e triagem",
            text: "Ótima para **avaliação inicial** e **triagem dirigida por indicação clínica**.",
            source: "complementar",
          },
        ],
      },
      {
        id: "paciente-dose",
        title: "Paciente e dose",
        summary: "Dose relativamente baixa; rápida, confortável e fácil de explicar.",
        points: [
          {
            label: "Dose relativamente baixa",
            text: "**Dose de radiação relativamente baixa** — geralmente menor que a de um levantamento periapical completo (os valores **variam por aparelho/estudo**).",
            source: "complementar",
          },
          {
            label: "Trismo e náusea",
            text: "**Rápida e confortável**; útil em pacientes com **trismo**, **reflexo de náusea** ou que não toleram receptores intraorais.",
            source: "complementar",
          },
          {
            label: "Comunicação com o paciente",
            text: "**Fácil de explicar** ao paciente (comunicação/educação).",
            source: "complementar",
          },
        ],
      },
    ],
    callouts: [
      {
        variant: "pegadinha",
        title: "Dose baixa ≠ exame sem justificativa",
        text: "Mesmo com dose relativamente baixa, a panorâmica **não deve ser pedida como rotina** sem exame clínico e justificativa (ver Indicações).",
        source: "complementar",
      },
    ],
    selfCheck: [
      {
        q: "Por que a panorâmica é útil em pacientes com trismo?",
        a: "Porque é extraoral: não exige receptores dentro da boca, sendo rápida e confortável.",
      },
      {
        q: "Como é a dose da panorâmica em relação a um levantamento periapical completo?",
        a: "Geralmente menor; os valores variam por aparelho e por estudo, por isso não se decora um número fixo.",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    slug: "desvantagens",
    number: 10,
    title: "Desvantagens e limitações",
    shortTitle: "Desvantagens",
    color: "#f97316",
    icon: "ThumbsDown",
    minutes: 12,
    summary:
      "Menor detalhe, distorção, camada limitada, artefatos e dependência do posicionamento — e a evidência de Estrela et al. (2008).",
    objectives: [
      "Explicar por que a panorâmica não substitui as radiografias intraorais.",
      "Citar as limitações geométricas e técnicas.",
      "Citar e interpretar os valores de sensibilidade do estudo de Estrela et al. (2008).",
    ],
    topics: [
      {
        id: "detalhe",
        title: "Nitidez e detalhe",
        summary: "Menos detalhe que as intraorais; imagem 2D de estruturas 3D.",
        points: [
          {
            label: "Menor nitidez que intraorais",
            text: "**Menor nitidez e detalhe** que as radiografias intraorais (periapical/interproximal).",
            source: "complementar",
          },
          {
            label: "Não substitui intraorais",
            text: "**Não substitui** a **interproximal** para cárie nem a **periapical** para detalhes endodônticos/periodontais finos.",
            source: "complementar",
          },
          {
            label: "Imagem 2D",
            text: "**Imagem bidimensional** de estruturas tridimensionais.",
            source: "complementar",
          },
        ],
      },
      {
        id: "geometria",
        title: "Limitações geométricas",
        summary: "Ampliação desigual e camada de imagem limitada.",
        points: [
          {
            label: "Ampliação desigual",
            text: "**Ampliação desigual e distorção** (sobretudo horizontal); medidas pouco confiáveis.",
            source: "complementar",
          },
          {
            label: "Camada limitada",
            text: "**Camada de imagem limitada**: estruturas fora dela ficam borradas ou não aparecem.",
            source: "complementar",
          },
        ],
      },
      {
        id: "artefatos",
        title: "Artefatos, técnica e custo",
        summary: "Sobreposições, fantasmas, dependência do posicionamento e custo.",
        points: [
          {
            label: "Sobreposições e artefatos",
            text: "**Sobreposições e artefatos**: imagens fantasmas, imagens duplas, coluna, espaço aéreo, adornos.",
            source: "aula",
            slides: r(46, 54),
          },
          {
            label: "Depende do posicionamento",
            text: "Muito **dependente do posicionamento** correto; erros são frequentes.",
            source: "complementar",
          },
          {
            label: "Custo do aparelho",
            text: "**Custo do aparelho** maior que o de um aparelho intraoral.",
            source: "complementar",
          },
        ],
      },
      {
        id: "estrela",
        title: "Evidência da aula: Estrela et al. (2008)",
        summary: "Panorâmica detectou bem menos periodontites apicais que a TCFC.",
        figure: "estrela",
        points: [
          {
            label: "888 pacientes, 1.508 dentes",
            text: "**Estrela et al., J Endod 2008**: **888 pacientes (1.508 dentes)** com infecção endodôntica, comparando periapical e panorâmica com a **TCFC**.",
            source: "aula",
            slides: [5],
          },
          {
            label: "Sensibilidade 0,55 × 0,28",
            text: "**Sensibilidade** para detectar periodontite apical: **0,55 na periapical** e **0,28 na panorâmica**.",
            source: "aula",
            slides: [5],
          },
          {
            label: "Mais lesões na TCFC",
            text: "A **prevalência de lesões foi significativamente maior na TCFC**; os métodos convencionais identificaram bem a lesão **só em estágio avançado**; a TCFC mostrou-se **acurada**.",
            source: "aula",
            slides: [5],
          },
          {
            label: "Panorâmica subestima",
            text: "Mensagem: a **panorâmica subestima lesões periapicais**.",
            source: "aula",
            slides: [5],
          },
        ],
        table: {
          caption: "Estrela et al. (2008) — detecção de periodontite apical",
          headers: ["Método", "Sensibilidade"],
          rows: [
            ["Radiografia periapical", "0,55"],
            ["Radiografia panorâmica", "0,28"],
            ["TCFC", "Referência de comparação (mostrou-se acurada)"],
          ],
          source: "aula",
          slides: [5],
        },
      },
    ],
    callouts: [
      {
        variant: "mnemonico",
        title: "0,55 × 0,28",
        text: "**P**eriapical **0,55** > **P**anorâmica **0,28**: a panorâmica teve cerca de **metade** da sensibilidade da periapical.",
        source: "aula",
        slides: [5],
      },
      {
        variant: "pegadinha",
        title: "Ausência de lesão na panorâmica não exclui lesão",
        text: "Com sensibilidade de 0,28, muitas periodontites apicais **não aparecem** na panorâmica: ela **subestima** as lesões periapicais.",
        source: "aula",
        slides: [5],
      },
    ],
    selfCheck: [
      {
        q: "Por que a panorâmica não substitui a interproximal para diagnóstico de cárie?",
        a: "Porque tem menor nitidez e detalhe que as radiografias intraorais.",
      },
      {
        q: "Quais foram os valores de sensibilidade no estudo de Estrela et al. (2008)?",
        a: "0,55 para a periapical e 0,28 para a panorâmica na detecção de periodontite apical, em comparação com a TCFC.",
      },
      {
        q: "Cite três limitações geométricas ou técnicas da panorâmica.",
        a: "Ampliação desigual/distorção horizontal; camada de imagem limitada; sobreposições e artefatos (fantasmas, imagens duplas); forte dependência do posicionamento; imagem 2D.",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    slug: "indicacoes",
    number: 11,
    title: "Indicações",
    shortTitle: "Indicações",
    color: "#3b82f6",
    icon: "Stethoscope",
    minutes: 10,
    summary:
      "Quando pedir (e quando não pedir) uma radiografia panorâmica.",
    objectives: [
      "Listar as principais indicações da radiografia panorâmica.",
      "Reconhecer quando complementar com TCFC.",
      "Explicar por que a panorâmica não é exame de “rotina” (princípio da justificação/ALARA).",
    ],
    topics: [
      {
        id: "avaliacao-geral",
        title: "Avaliação geral e dentição",
        summary: "Avaliação inicial, terceiros molares, supranumerários, agenesias e desenvolvimento.",
        points: [
          {
            label: "Avaliação geral inicial",
            text: "**Avaliação geral inicial** de dentes e ossos maxilares, **quando clinicamente justificada**.",
            source: "complementar",
          },
          {
            label: "Terceiros molares e inclusos",
            text: "**Terceiros molares** e dentes **inclusos/impactados**; **dentes supranumerários** e **agenesias**.",
            source: "complementar",
          },
          {
            label: "Desenvolvimento da dentição",
            text: "Avaliação do **desenvolvimento da dentição** (odontopediatria e ortodontia).",
            source: "complementar",
          },
        ],
      },
      {
        id: "patologia-trauma",
        title: "Trauma e patologia",
        summary: "Fraturas, lesões extensas, ATM e seios maxilares.",
        points: [
          {
            label: "Trauma e fraturas",
            text: "**Trauma**: suspeita de fraturas, principalmente de **mandíbula**.",
            source: "complementar",
          },
          {
            label: "Lesões extensas",
            text: "**Lesões extensas** (cistos, tumores) e avaliação da sua extensão inicial.",
            source: "complementar",
          },
          {
            label: "Triagem de ATM e seios",
            text: "**Triagem** da **ATM** (côndilos) e dos **seios maxilares**.",
            source: "complementar",
          },
        ],
      },
      {
        id: "planejamento",
        title: "Planejamento e situações especiais",
        summary: "Implantes e cirurgia, trismo, radioterapia e doenças sistêmicas.",
        points: [
          {
            label: "Implantodontia e cirurgia",
            text: "**Planejamento inicial** em implantodontia e cirurgia (complementar com **TCFC** quando necessário).",
            source: "complementar",
          },
          {
            label: "Trismo / intolerância",
            text: "Pacientes com **trismo** ou que **não toleram** filmes intraorais.",
            source: "complementar",
          },
          {
            label: "Radioterapia e doenças sistêmicas",
            text: "Avaliação **antes de radioterapia** de cabeça e pescoço e em **doenças sistêmicas com repercussão óssea**.",
            source: "complementar",
          },
        ],
      },
      {
        id: "quando-nao",
        title: "Quando NÃO pedir",
        summary: "Nunca como “check-up” de rotina sem exame clínico.",
        points: [
          {
            label: "Não é check-up de rotina",
            text: "**Não** deve ser solicitada como rotina de “check-up” **sem exame clínico prévio e justificativa** (princípio da **justificação/ALARA**).",
            source: "complementar",
          },
        ],
      },
    ],
    callouts: [
      {
        variant: "pegadinha",
        title: "“Panorâmica de rotina” é resposta errada",
        text: "A solicitação depende de **exame clínico prévio e justificativa** — princípio da justificação/ALARA.",
        source: "complementar",
      },
    ],
    selfCheck: [
      {
        q: "Cite quatro indicações da radiografia panorâmica.",
        a: "Por exemplo: terceiros molares e dentes inclusos; desenvolvimento da dentição; suspeita de fratura de mandíbula; lesões extensas; triagem de ATM e seios; planejamento inicial de implantes; pacientes com trismo; avaliação antes de radioterapia.",
      },
      {
        q: "Quando a panorâmica não deve ser solicitada?",
        a: "Como rotina de “check-up” sem exame clínico prévio e justificativa (princípio da justificação/ALARA).",
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    slug: "interpretacao",
    number: 12,
    title: "Interpretação sistemática",
    shortTitle: "Interpretação",
    color: "#84cc16",
    icon: "ListChecks",
    minutes: 10,
    summary:
      "Checklist de leitura em 6 passos, da identificação aos achados incidentais.",
    objectives: [
      "Aplicar uma sequência sistemática de leitura da panorâmica.",
      "Avaliar a qualidade técnica antes de interpretar achados.",
      "Lembrar a baixa sensibilidade para lesões periapicais ao avaliar os dentes.",
    ],
    topics: [
      {
        id: "antes",
        title: "Antes dos achados",
        summary: "1) Identificação e lado; 2) qualidade técnica.",
        points: [
          {
            label: "1. Identificação e lado",
            text: "**1) Identificação e lado**: marcadores **D/E** ou **R/L**.",
            source: "aula",
            slides: [26, 32],
          },
          {
            label: "2. Qualidade técnica",
            text: "**2) Qualidade técnica**: posicionamento, plano oclusal, simetria, artefatos.",
            source: "complementar",
          },
        ],
      },
      {
        id: "ossos",
        title: "Estruturas ósseas",
        summary: "3) Da periferia para o centro.",
        points: [
          {
            label: "3. Ossos: periferia → centro",
            text: "**3) Estruturas ósseas, da periferia para o centro**: ATM/côndilos, ramos, corpo e basilar da mandíbula, maxila, seios e fossas nasais.",
            source: "complementar",
          },
        ],
      },
      {
        id: "dentes",
        title: "Dentes",
        summary: "4) Número, desenvolvimento, posição, restaurações, cáries e periápice.",
        points: [
          {
            label: "4. Dentes",
            text: "**4) Dentes**: número, desenvolvimento, posição, restaurações, cáries extensas, lesões periapicais (lembrando a **baixa sensibilidade**).",
            source: "complementar",
          },
        ],
      },
      {
        id: "moles",
        title: "Tecidos moles e achados incidentais",
        summary: "5) Tecidos moles e espaços aéreos; 6) achados incidentais.",
        points: [
          {
            label: "5. Tecidos moles e ar",
            text: "**5) Tecidos moles e espaços aéreos**.",
            source: "complementar",
          },
          {
            label: "6. Achados incidentais",
            text: "**6) Achados incidentais** (ex.: calcificações em tecidos moles).",
            source: "complementar",
          },
        ],
      },
    ],
    callouts: [
      {
        variant: "dica",
        title: "Sempre na mesma ordem",
        text: "Ler sempre na mesma sequência — começando por **identificação e qualidade técnica** e indo **da periferia para o centro** — evita que achados fora da região de interesse passem despercebidos.",
        source: "complementar",
      },
    ],
    selfCheck: [
      {
        q: "Quais são os dois primeiros passos da interpretação?",
        a: "1) Identificação e lado (marcadores D/E ou R/L); 2) qualidade técnica (posicionamento, plano oclusal, simetria, artefatos).",
      },
      {
        q: "Por que a ausência de lesão periapical na panorâmica não exclui periodontite apical?",
        a: "Pela baixa sensibilidade da panorâmica (0,28 em Estrela et al., 2008): ela subestima lesões periapicais.",
      },
    ],
  },
];

export const moduleSlugs = modules.map((m) => m.slug);

export function getModule(slug: string) {
  return modules.find((m) => m.slug === slug);
}

export function getModuleNeighbors(slug: string) {
  const i = modules.findIndex((m) => m.slug === slug);
  return {
    prev: i > 0 ? modules[i - 1] : undefined,
    next: i >= 0 && i < modules.length - 1 ? modules[i + 1] : undefined,
  };
}

export const totalMinutes = modules.reduce((sum, m) => sum + m.minutes, 0);
