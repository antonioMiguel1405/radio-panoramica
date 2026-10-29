import type { Flashcard, Source } from "@/lib/types";

const c = (
  id: string,
  module: string,
  front: string,
  back: string,
  source: Source,
  slides?: number[],
): Flashcard => ({ id, module, front, back, source, slides });

export const flashcards: Flashcard[] = [
  // 1 — Conceito
  c("f01", "conceito", "O que a radiografia panorâmica mostra?", "Numa única imagem: maxila, mandíbula, dentes e estruturas adjacentes.", "aula", [1, 2]),
  c("f02", "conceito", "Outros nomes da panorâmica", "Pantomografia ou ortopantomografia — técnica tomográfica curvilínea extraoral.", "complementar"),
  c("f03", "conceito", "Quem se move durante a exposição?", "Fonte de raios X e receptor, sincronizados e em lados opostos. O paciente fica imóvel.", "aula", [8]),
  c("f04", "conceito", "O centro de rotação é fixo?", "Não: muda de posição a cada momento, fazendo o “objeto focado” acompanhar as arcadas.", "aula", [17]),
  c("f05", "conceito", "Por que o que está fora das arcadas fica borrado?", "Está fora da camada de imagem (efeito tomográfico).", "complementar"),
  // 2 — Aparelho
  c("f06", "aparelho", "Componentes do aparelho panorâmico", "Fonte de raios X (ampola), receptor de imagem e apoios para o paciente.", "aula", [6]),
  c("f07", "aparelho", "Apoios para o paciente", "Apoio de mento, cefalostato/apoios laterais de cabeça, bloco de mordida e alças para as mãos.", "aula", [6]),
  c("f08", "aparelho", "Incisivos no bloco de mordida", "Topo a topo, na ranhura do bloco.", "aula", [22, 23, 24, 25]),
  c("f09", "aparelho", "As 3 guias luminosas", "Vertical: sagital mediano. Horizontal: Frankfurt. Linha da camada: frequentemente no canino.", "aula", [23, 29, 33]),
  // 3 — Camada
  c("f10", "camada-de-imagem", "Camada de imagem: definição", "Região tridimensional curva, em forma de ferradura, onde as estruturas aparecem nítidas.", "aula", [17, 18]),
  c("f11", "camada-de-imagem", "Onde a camada é mais estreita?", "Na região anterior → erros anteroposteriores afetam principalmente os dentes anteriores.", "complementar"),
  c("f12", "camada-de-imagem", "Objeto deslocado para o lado da FONTE (lingual)", "Fica mais largo (e borrado).", "complementar"),
  c("f13", "camada-de-imagem", "Objeto deslocado para o lado do RECEPTOR (vestibular)", "Fica mais estreito (e borrado).", "complementar"),
  c("f14", "camada-de-imagem", "Ampliação vertical × horizontal", "Vertical: relativamente constante. Horizontal: varia com a posição do objeto → distorção.", "complementar"),
  c("f15", "camada-de-imagem", "Pode medir na panorâmica?", "Não para medidas lineares precisas, sobretudo horizontais.", "complementar"),
  // 4 — Ângulo negativo
  c("f16", "angulo-negativo", "Ângulo negativo", "Feixe de baixo para cima (aprox. −7°, varia por fabricante).", "aula", [20, 21]),
  c("f17", "angulo-negativo", "Analogia do ângulo negativo", "Lanterna posicionada abaixo do objeto projeta a sombra mais alta na parede.", "aula", [20, 21]),
  c("f18", "angulo-negativo", "Consequência do ângulo negativo no palato", "Palato duro projetado como faixa radiopaca horizontal sobre/acima dos ápices superiores.", "aula", [21]),
  c("f19", "angulo-negativo", "Por que o fantasma é mais alto?", "Por causa do ângulo negativo: o que está perto da fonte é projetado mais alto.", "complementar"),
  // 5 — Posicionamento
  c("f20", "posicionamento", "Plano de Frankfurt", "Paralelo ao solo.", "aula", [42]),
  c("f21", "posicionamento", "Plano sagital mediano", "Perpendicular ao solo e centralizado (sem rotação nem inclinação).", "aula", [29, 30, 31, 33]),
  c("f22", "posicionamento", "Colar de tireoide na panorâmica?", "Não: fica no trajeto do feixe e gera área radiopaca sobre a mandíbula anterior. Só avental.", "complementar"),
  c("f23", "posicionamento", "Posição da língua", "Encostada no palato durante toda a exposição; lábios fechados sobre o bloco.", "complementar"),
  c("f24", "posicionamento", "Postura correta", "De pé ou sentado, coluna ereta, pescoço esticado, segurando as alças.", "aula", [39, 41]),
  c("f25", "posicionamento", "O que remover antes do exame?", "Brincos, colares, piercings, grampos, óculos e próteses removíveis.", "aula", [54, 56]),
  // 6 — Erros
  c("f26", "erros-de-posicionamento", "Paciente muito À FRENTE", "Incisivos estreitos e borrados; sobreposição em pré-molares. → Incisivos na ranhura.", "aula", [24, 25, 26, 27]),
  c("f27", "erros-de-posicionamento", "Paciente muito PARA TRÁS", "Incisivos alargados e borrados; ramos/côndilos cortados; fantasmas evidentes. → Incisivos na ranhura.", "aula", [24, 25, 26, 27]),
  c("f28", "erros-de-posicionamento", "Rotação da cabeça", "Assimetria: posteriores e ramo mais largos de um lado e mais estreitos do outro. → Centralizar sagital mediano.", "aula", [30, 31, 32, 33, 34]),
  c("f29", "erros-de-posicionamento", "Inclinação lateral da cabeça", "Plano oclusal inclinado; bordas inferiores e côndilos em alturas diferentes. → Sagital ⟂ solo.", "aula", [30]),
  c("f30", "erros-de-posicionamento", "Mento ABAIXADO", "“Sorriso” exagerado; incisivos inferiores borrados; côndilos saindo pelo topo; hioide sobre a mandíbula.", "aula", [35, 36]),
  c("f31", "erros-de-posicionamento", "Mento ELEVADO", "Plano oclusal reto/invertido (“triste”); palato largo sobre ápices superiores; incisivos superiores borrados.", "aula", [37, 38]),
  c("f32", "erros-de-posicionamento", "Postura curvada", "Radiopacidade vertical anterior (fantasma da coluna) sobre incisivos e sínfise.", "aula", [41]),
  c("f33", "erros-de-posicionamento", "Faixa radiolúcida sobre ápices superiores", "Língua não encostada no palato (ar).", "complementar"),
  c("f34", "erros-de-posicionamento", "“Degraus” na borda inferior da mandíbula", "Movimento do paciente durante o ciclo.", "complementar"),
  // 7 — Real × fantasma
  c("f35", "imagens-reais-e-fantasmas", "Imagem REAL: onde está o objeto?", "Entre o centro de rotação e o RECEPTOR.", "aula", [48, 49]),
  c("f36", "imagens-reais-e-fantasmas", "Imagem FANTASMA: onde está o objeto?", "Entre o centro de rotação e a FONTE.", "aula", [50, 51]),
  c("f37", "imagens-reais-e-fantasmas", "4 características do fantasma", "OPOSTA, ALTA, GRANDE e BORRADA (mantém a forma geral).", "complementar"),
  c("f38", "imagens-reais-e-fantasmas", "Brinco na orelha direita", "Real à direita; fantasma à esquerda, mais alto, maior e borrado.", "aula", [56]),
  c("f39", "imagens-reais-e-fantasmas", "Apenas imagens reais", "Corpo da mandíbula, dentes, seios maxilares.", "aula", [54]),
  c("f40", "imagens-reais-e-fantasmas", "Imagens reais duplicadas", "Corpo do osso hioide, palato, coluna cervical.", "aula", [54]),
  c("f41", "imagens-reais-e-fantasmas", "Imagens fantasmas", "Coluna cervical, colares (adornos) de pescoço, cornos do osso hioide.", "aula", [54]),
  c("f42", "imagens-reais-e-fantasmas", "Reais únicas + fantasmas", "Cornos maiores do hioide, ramo e cabeça da mandíbula, brincos, colares e zíperes.", "aula", [54]),
  // 8 — Anatomia
  c("f43", "anatomia", "Palato duro × assoalho da fossa nasal", "Faixas radiopacas horizontais distintas; o palato tem também imagem projetada pelo lado oposto.", "aula", [55]),
  c("f44", "anatomia", "Estruturas da ATM e base do crânio", "Fossa mandibular, eminência articular, meato acústico externo, processo mastoide, processo estiloide.", "aula", [4, 57, 58, 59, 60]),
  c("f45", "anatomia", "Tecidos moles e espaços aéreos", "Palato mole, dorso da língua, lóbulo da orelha, espaço aéreo (naso e orofaringe); também hioide e coluna como adjacentes.", "aula", [4, 57, 58, 59, 60]),
  // 9 — Vantagens
  c("f46", "vantagens", "Vantagens da panorâmica", "Visão ampla, dose relativamente baixa, rápida e confortável, útil no trismo, fácil de explicar, boa para triagem.", "complementar"),
  // 10 — Desvantagens
  c("f47", "desvantagens", "Estrela et al. (2008): sensibilidade", "Periodontite apical: 0,55 periapical × 0,28 panorâmica (vs. TCFC).", "aula", [5]),
  c("f48", "desvantagens", "Estrela et al. (2008): amostra", "888 pacientes, 1.508 dentes com infecção endodôntica.", "aula", [5]),
  c("f49", "desvantagens", "Panorâmica substitui interproximal/periapical?", "Não: menor nitidez e detalhe que as intraorais.", "complementar"),
  // 11 — Indicações
  c("f50", "indicacoes", "Panorâmica como check-up de rotina?", "Não: exige exame clínico prévio e justificativa (justificação/ALARA).", "complementar"),
  c("f51", "indicacoes", "Indicações principais", "Terceiros molares/inclusos, supranumerários/agenesias, desenvolvimento da dentição, trauma, lesões extensas, triagem ATM/seios, planejamento inicial, trismo, pré-radioterapia.", "complementar"),
  // 12 — Interpretação
  c("f52", "interpretacao", "6 passos da leitura", "1) Identificação e lado; 2) qualidade técnica; 3) ossos (periferia → centro); 4) dentes; 5) tecidos moles e ar; 6) achados incidentais.", "complementar"),
];
