import type { QuizOption, QuizQuestion, Source } from "@/lib/types";

/**
 * Banco de questões. A PRIMEIRA alternativa é sempre a correta;
 * a ordem é embaralhada na exibição.
 */
type Opt = [text: string, why: string];

const q = (
  id: string,
  module: string,
  source: Source,
  slides: number[] | undefined,
  question: string,
  options: [Opt, Opt, Opt, Opt],
): QuizQuestion => ({
  id,
  module,
  source,
  slides,
  question,
  options: options.map(([text, why]) => ({ text, why })) as [
    QuizOption,
    QuizOption,
    QuizOption,
    QuizOption,
  ],
});

export const quiz: QuizQuestion[] = [
  // Módulo 1 ---------------------------------------------------------
  q("q01", "conceito", "aula", [8], "Durante a exposição panorâmica, o que acontece?", [
    ["Fonte e receptor giram sincronizadamente ao redor da cabeça; o paciente fica imóvel.", "É o princípio dos aparelhos atuais: fonte e receptor se movem juntos, em lados opostos."],
    ["O paciente gira enquanto fonte e receptor ficam parados.", "Nos aparelhos atuais o paciente fica imóvel; quem se move são a fonte e o receptor."],
    ["Só o receptor se move; a fonte fica parada atrás da cabeça.", "Fonte e receptor se movem de forma sincronizada, não só o receptor."],
    ["Fonte e receptor ficam do mesmo lado do paciente.", "Eles ficam sempre em lados opostos do paciente."],
  ]),
  q("q02", "conceito", "aula", [17], "Sobre o centro de rotação, é correto afirmar:", [
    ["Muda de posição a cada momento do movimento, mantendo as arcadas na camada de imagem.", "O centro de rotação móvel faz o “objeto focado” mudar continuamente e acompanhar as arcadas."],
    ["É fixo no centro da cabeça durante todo o ciclo.", "O centro de rotação muda de posição a cada momento do movimento."],
    ["Fica sempre sobre o receptor de imagem.", "O feixe gira em torno de um centro situado entre a fonte e o receptor, que muda de posição."],
    ["Só influencia a nitidez dos seios maxilares.", "Ele define o objeto focado ao longo de toda a arcada, não só dos seios."],
  ]),
  q("q03", "conceito", "complementar", undefined, "Qual destes é outro nome da radiografia panorâmica?", [
    ["Ortopantomografia", "Pantomografia e ortopantomografia são sinônimos da técnica tomográfica curvilínea extraoral."],
    ["Radiografia periapical", "A periapical é uma radiografia intraoral, diferente da panorâmica."],
    ["Radiografia interproximal", "A interproximal é uma radiografia intraoral, diferente da panorâmica."],
    ["Tomografia computadorizada de feixe cônico (TCFC)", "A TCFC é outro exame; foi a referência de comparação no estudo de Estrela et al."],
  ]),
  q("q04", "conceito", "complementar", undefined, "Por que estruturas distantes das arcadas aparecem borradas na panorâmica?", [
    ["Porque estão fora da camada de imagem (efeito tomográfico).", "Fora da camada de imagem as estruturas são borradas pelo movimento do sistema."],
    ["Porque o paciente sempre se move durante a exposição.", "O paciente deve ficar imóvel; o borramento normal decorre do efeito tomográfico."],
    ["Porque o feixe não chega até elas.", "O feixe as atravessa, mas elas estão fora da camada de imagem."],
    ["Porque o receptor é menor que a cabeça.", "O borramento não se deve ao tamanho do receptor, e sim à posição fora da camada."],
  ]),

  // Módulo 2 ---------------------------------------------------------
  q("q05", "aparelho", "aula", [6], "Qual destes NÃO faz parte dos apoios do paciente no aparelho panorâmico?", [
    ["Colar de tireoide", "O colar de tireoide não é usado na panorâmica: fica no trajeto do feixe."],
    ["Bloco de mordida", "O bloco de mordida faz parte dos apoios para o paciente."],
    ["Cefalostato / apoios laterais de cabeça", "Os apoios laterais de cabeça fazem parte dos apoios para o paciente."],
    ["Alças para as mãos", "As alças para as mãos fazem parte dos apoios para o paciente."],
  ]),
  q("q06", "aparelho", "aula", [22, 23, 24, 25], "Como os incisivos devem ficar no bloco de mordida?", [
    ["Superiores e inferiores topo a topo, na ranhura do bloco.", "É assim que as arcadas ficam na posição anteroposterior correta, dentro da camada."],
    ["Em oclusão habitual, atrás do bloco.", "Os incisivos devem ocluir topo a topo na ranhura."],
    ["Apenas os superiores apoiados, com a boca aberta.", "Superiores e inferiores devem estar topo a topo na ranhura."],
    ["Inferiores à frente da ranhura, para proteger os lábios.", "Fora da ranhura, as arcadas saem da camada de imagem."],
  ]),
  q("q07", "aparelho", "aula", [23, 29, 33], "A guia luminosa VERTICAL orienta:", [
    ["O plano sagital mediano.", "A linha vertical marca o plano sagital mediano."],
    ["O plano de Frankfurt.", "O plano de referência horizontal (ex.: Frankfurt) é orientado pela linha horizontal."],
    ["A linha da camada na região do canino.", "A linha da camada é outra guia, frequentemente posicionada no canino."],
    ["A altura do avental de chumbo.", "As guias luminosas orientam o posicionamento da cabeça, não o avental."],
  ]),

  // Módulo 3 ---------------------------------------------------------
  q("q08", "camada-de-imagem", "aula", [17, 18], "A camada de imagem é:", [
    ["Uma região tridimensional curva, em forma de ferradura, onde as estruturas aparecem nítidas.", "É a definição da camada de imagem (camada focal)."],
    ["Uma linha plana entre a fonte e o receptor.", "A camada é tridimensional e curva, em forma de ferradura."],
    ["A região onde as estruturas aparecem borradas.", "É o contrário: dentro da camada as estruturas aparecem nítidas."],
    ["A camada de chumbo do avental de proteção.", "O termo se refere à região focal do exame, não ao avental."],
  ]),
  q("q09", "camada-de-imagem", "complementar", undefined, "Em que região a camada de imagem é mais estreita?", [
    ["Na região anterior.", "Por isso erros anteroposteriores afetam principalmente os dentes anteriores."],
    ["Na região dos molares.", "A camada é mais larga na região posterior."],
    ["Na região dos ramos.", "A região posterior é a mais larga."],
    ["Tem a mesma espessura em toda a arcada.", "Não: é mais estreita na frente e mais larga atrás."],
  ]),
  q("q10", "camada-de-imagem", "complementar", undefined, "Um objeto deslocado para o lado da FONTE (lingual à camada) aparece:", [
    ["Mais largo e borrado.", "Deslocado para o lado da fonte, o objeto fica mais largo (ampliação horizontal maior)."],
    ["Mais estreito e borrado.", "Isso acontece quando o objeto vai para o lado do receptor (vestibular à camada)."],
    ["Nítido e em tamanho proporcional.", "Só dentro da camada o objeto é nítido e proporcional."],
    ["No lado oposto, mais alto.", "Essas são características da imagem fantasma, não do deslocamento em relação à camada."],
  ]),
  q("q11", "camada-de-imagem", "complementar", undefined, "Sobre a ampliação na panorâmica, é correto afirmar:", [
    ["A vertical é relativamente constante; a horizontal varia conforme a posição do objeto.", "Por isso há distorção de forma e as medidas horizontais são pouco confiáveis."],
    ["A horizontal é constante e a vertical varia.", "É o contrário: a vertical é relativamente constante."],
    ["Não há ampliação na panorâmica.", "Há ampliação, e a horizontal é variável."],
    ["Ambas são iguais, permitindo medidas lineares precisas.", "A panorâmica não é confiável para medidas lineares precisas."],
  ]),

  // Módulo 4 ---------------------------------------------------------
  q("q12", "angulo-negativo", "aula", [20, 21], "O feixe panorâmico tem angulação negativa. Isso significa que ele incide:", [
    ["De baixo para cima — por isso as imagens fantasmas aparecem mais altas.", "Como uma lanterna abaixo do objeto, que projeta a sombra mais alta."],
    ["De cima para baixo — por isso os fantasmas aparecem mais baixos.", "O feixe vem de baixo para cima, e os fantasmas aparecem mais altos."],
    ["Paralelo ao plano oclusal, sem efeito na altura das imagens.", "A angulação negativa altera a altura das projeções."],
    ["Somente de trás para a frente.", "A angulação negativa se refere à inclinação vertical do feixe (de baixo para cima)."],
  ]),
  q("q13", "angulo-negativo", "aula", [21], "Por causa do ângulo negativo, qual estrutura é projetada como faixa radiopaca horizontal sobre ou acima dos ápices dos dentes superiores?", [
    ["Palato duro", "O palato duro é projetado sobre a região dos ápices superiores / acima deles."],
    ["Osso hioide", "O hioide fica abaixo da mandíbula."],
    ["Canal da mandíbula", "O canal da mandíbula está na mandíbula, abaixo dos dentes inferiores."],
    ["Processo estiloide", "O estiloide aparece na região posterior, próximo ao ramo."],
  ]),
  q("q14", "angulo-negativo", "aula", [20, 21], "A analogia da lanterna, usada na aula para o ângulo negativo, diz que:", [
    ["Uma lanterna abaixo do objeto projeta a sombra mais alta na parede.", "Assim o feixe de baixo para cima projeta mais alto o que está perto da fonte."],
    ["Uma lanterna acima do objeto projeta a sombra mais baixa.", "A analogia é com a lanterna posicionada abaixo do objeto."],
    ["Uma lanterna em movimento borra a sombra.", "O borrão pelo movimento é a analogia do ciclista (imagem fantasma), não a do ângulo negativo."],
    ["Quanto mais longe a lanterna, mais nítida a sombra.", "Não é essa a analogia da aula."],
  ]),
  q("q15", "angulo-negativo", "complementar", undefined, "A angulação negativa do feixe panorâmico é de aproximadamente:", [
    ["−7° (varia conforme o fabricante)", "Valor aproximado citado na literatura; depende do aparelho."],
    ["−45°", "Valor muito acima do aproximado (cerca de −7°)."],
    ["+20°", "A angulação é negativa (de baixo para cima)."],
    ["0°", "Com 0° não haveria angulação negativa."],
  ]),

  // Módulo 5 ---------------------------------------------------------
  q("q16", "posicionamento", "aula", [42], "Como deve ficar o plano de Frankfurt no posicionamento?", [
    ["Paralelo ao solo.", "Frankfurt paralelo ao solo evita os erros de mento abaixado e elevado."],
    ["Perpendicular ao solo.", "Quem fica perpendicular ao solo é o plano sagital mediano."],
    ["Inclinado para baixo.", "Frankfurt inclinado para baixo = mento abaixado (erro)."],
    ["Inclinado para cima.", "Frankfurt inclinado para cima = mento elevado (erro)."],
  ]),
  q("q17", "posicionamento", "complementar", undefined, "Por que o colar de tireoide NÃO é usado na panorâmica?", [
    ["Porque fica no trajeto do feixe e gera área radiopaca sobre a mandíbula anterior.", "O colar bloqueia o feixe e prejudica a imagem da região anterior da mandíbula."],
    ["Porque a panorâmica não emite radiação.", "A panorâmica usa raios X; o paciente usa avental de chumbo."],
    ["Porque causa faixa radiolúcida sobre os ápices superiores.", "Essa faixa decorre da língua afastada do palato."],
    ["Porque gera imagem fantasma da coluna cervical.", "O fantasma da coluna está ligado à postura curvada."],
  ]),
  q("q18", "posicionamento", "complementar", undefined, "Durante a exposição, a língua deve ficar:", [
    ["Encostada no palato.", "Assim não fica ar entre a língua e o palato."],
    ["Apoiada no assoalho da boca.", "Afastada do palato, ela deixa ar e forma faixa radiolúcida sobre os ápices superiores."],
    ["Projetada para fora, sobre o bloco.", "Os lábios devem estar fechados sobre o bloco e a língua no palato."],
    ["Em qualquer posição: ela não interfere.", "A posição da língua interfere na imagem dos ápices superiores."],
  ]),
  q("q19", "posicionamento", "aula", [39, 41], "Qual orientação de postura está correta?", [
    ["Coluna ereta, pescoço esticado e mãos nas alças do aparelho.", "Postura ereta evita o fantasma da coluna na região anterior."],
    ["Ombros curvados para aproximar o queixo do bloco.", "Postura curvada gera radiopacidade anterior (fantasma da coluna)."],
    ["Cabeça inclinada para o lado do receptor.", "O plano sagital mediano deve ficar perpendicular ao solo, sem inclinação."],
    ["Mento elevado para alongar o pescoço.", "Elevar o mento inclina o Frankfurt para cima (erro)."],
  ]),
  q("q20", "posicionamento", "aula", [54, 56], "Antes do exame, devem ser removidos:", [
    ["Brincos, colares, piercings, grampos, óculos e próteses removíveis.", "Objetos metálicos geram imagens reais e fantasmas."],
    ["Apenas as próteses removíveis.", "Todos os objetos metálicos de cabeça e pescoço devem ser removidos."],
    ["Apenas os óculos.", "Brincos, colares, piercings, grampos e próteses removíveis também."],
    ["Nada: metais não interferem na panorâmica.", "Metais geram imagens reais e fantasmas que atrapalham a interpretação."],
  ]),

  // Módulo 6 ---------------------------------------------------------
  q("q21", "erros-de-posicionamento", "aula", [24, 25, 26, 27], "Paciente posicionado muito À FRENTE (arcadas anteriores à camada). Os incisivos aparecem:", [
    ["Estreitos e borrados.", "Muito à frente = dentes anteriores estreitados e borrados."],
    ["Alargados e borrados.", "Esse é o aspecto do paciente muito para trás."],
    ["Nítidos e de tamanho normal.", "Fora da camada eles ficam borrados e distorcidos."],
    ["Duplicados no lado oposto.", "Duplicação no lado oposto não é a assinatura desse erro."],
  ]),
  q("q22", "erros-de-posicionamento", "aula", [24, 25, 26, 27], "Paciente posicionado muito PARA TRÁS. Qual é o aspecto esperado?", [
    ["Incisivos alargados e borrados; ramos/côndilos podem ficar cortados nas laterais.", "Também deixa os fantasmas mais evidentes."],
    ["Incisivos estreitos e borrados.", "Esse é o aspecto do paciente muito à frente."],
    ["Plano oclusal inclinado, com côndilos em alturas diferentes.", "Isso indica inclinação lateral da cabeça."],
    ["Faixa radiolúcida sobre os ápices superiores.", "Isso indica língua afastada do palato."],
  ]),
  q("q23", "erros-de-posicionamento", "aula", [35, 36], "Plano oclusal em “sorriso” exagerado, incisivos inferiores borrados e hioide sobreposto à mandíbula indicam:", [
    ["Mento abaixado.", "Frankfurt inclinado para baixo: “sorriso” exagerado e côndilos podendo sair pelo topo."],
    ["Mento elevado.", "Mento elevado deixa o plano oclusal reto ou invertido (“triste”)."],
    ["Rotação da cabeça.", "Rotação gera assimetria horizontal entre os lados."],
    ["Língua afastada do palato.", "A língua gera faixa radiolúcida sobre os ápices superiores."],
  ]),
  q("q24", "erros-de-posicionamento", "aula", [37, 38], "Mento ELEVADO (Frankfurt inclinado para cima) produz:", [
    ["Plano oclusal reto/invertido e palato duro largo sobreposto aos ápices superiores.", "Também borra os incisivos superiores."],
    ["“Sorriso” exagerado e côndilos saindo pelo topo da imagem.", "Esses são sinais de mento abaixado."],
    ["Assimetria horizontal entre os lados.", "Assimetria horizontal indica rotação."],
    ["“Degraus” na borda inferior da mandíbula.", "Degraus indicam movimento do paciente."],
  ]),
  q("q25", "erros-de-posicionamento", "aula", [30, 31, 32, 33, 34], "Rotação da cabeça (plano sagital mediano girado) causa:", [
    ["Assimetria: posteriores e ramo de um lado mais largos e do outro mais estreitos.", "Um lado se aproxima da fonte (alarga) e o outro do receptor (estreita)."],
    ["Plano oclusal inclinado, com côndilos em alturas diferentes.", "Isso é inclinação lateral, não rotação."],
    ["Incisivos estreitos e borrados.", "Isso é paciente muito à frente."],
    ["Radiopacidade vertical na região anterior.", "Isso é postura curvada (fantasma da coluna)."],
  ]),
  q("q26", "erros-de-posicionamento", "aula", [30], "Plano oclusal inclinado, bordas inferiores da mandíbula e côndilos em alturas diferentes indicam:", [
    ["Inclinação lateral da cabeça.", "Correção: plano sagital mediano perpendicular ao solo."],
    ["Rotação da cabeça.", "Rotação gera diferença de LARGURA entre os lados, não de altura."],
    ["Mento elevado.", "Mento elevado deixa o plano oclusal reto ou invertido, de forma simétrica."],
    ["Movimento do paciente.", "Movimento gera ondulações e degraus na borda inferior."],
  ]),
  q("q27", "erros-de-posicionamento", "complementar", undefined, "Faixa radiolúcida sobre os ápices dos dentes superiores. Qual é a causa?", [
    ["Língua não encostada no palato.", "O ar entre a língua e o palato aparece como faixa radiolúcida."],
    ["Colar de tireoide.", "O colar gera área radiopaca sobre a mandíbula anterior."],
    ["Postura curvada.", "A postura curvada gera radiopacidade vertical anterior."],
    ["Mento abaixado.", "Mento abaixado gera “sorriso” exagerado."],
  ]),
  q("q28", "erros-de-posicionamento", "aula", [41], "Postura curvada (coluna não ereta) produz:", [
    ["Radiopacidade vertical na região anterior, pela imagem fantasma da coluna cervical.", "Fica sobre incisivos e sínfise. Correção: coluna e pescoço esticados."],
    ["Faixa radiolúcida sobre os ápices superiores.", "Isso é língua afastada do palato."],
    ["Incisivos alargados e borrados.", "Isso é paciente muito para trás."],
    ["Plano oclusal reto ou invertido.", "Isso é mento elevado."],
  ]),
  q("q29", "erros-de-posicionamento", "complementar", undefined, "Ondulações e “degraus” na borda inferior da mandíbula sugerem:", [
    ["Movimento do paciente durante o ciclo.", "Correção: orientar imobilidade e repetir só se necessário."],
    ["Rotação da cabeça.", "Rotação gera assimetria de largura."],
    ["Colar de tireoide.", "O colar gera área radiopaca na região anterior da mandíbula."],
    ["Língua afastada do palato.", "A língua gera faixa radiolúcida sobre os ápices superiores."],
  ]),
  q("q30", "erros-de-posicionamento", "aula", [30, 31, 32, 33, 34], "Qual é a correção para a rotação da cabeça?", [
    ["Centralizar o plano sagital mediano com a guia luminosa.", "O plano sagital mediano deve ficar centralizado e perpendicular ao solo."],
    ["Abaixar o mento.", "O mento corrige-se pelo Frankfurt, não pela rotação."],
    ["Pedir para afastar a língua do palato.", "A língua deve ficar encostada no palato."],
    ["Colocar o colar de tireoide.", "O colar não é usado na panorâmica."],
  ]),

  // Módulo 7 ---------------------------------------------------------
  q("q31", "imagens-reais-e-fantasmas", "aula", [48, 49], "A imagem REAL forma-se quando o objeto está:", [
    ["Entre o centro de rotação e o receptor de imagem.", "Definição de imagem real."],
    ["Entre o centro de rotação e a fonte de raios X.", "Essa posição forma imagem fantasma."],
    ["Fora do trajeto do feixe.", "Fora do trajeto do feixe não há imagem."],
    ["Sempre na linha média posterior.", "Estruturas da linha média posterior formam imagens duplas."],
  ]),
  q("q32", "imagens-reais-e-fantasmas", "aula", [50, 51], "A imagem FANTASMA forma-se quando o objeto está:", [
    ["Entre o centro de rotação e a fonte de raios X.", "Definição de imagem fantasma."],
    ["Entre o centro de rotação e o receptor de imagem.", "Essa posição forma imagem real."],
    ["Exatamente dentro da camada de imagem.", "Dentro da camada a imagem é real e nítida."],
    ["Encostado no receptor.", "Perto do receptor (lado do receptor) a imagem é real."],
  ]),
  q("q33", "imagens-reais-e-fantasmas", "aula", [56], "Paciente com brinco na orelha DIREITA. Quais imagens são esperadas?", [
    ["Real à direita; fantasma à esquerda, mais alta, maior e borrada.", "Fantasma: oposta, alta, grande e borrada."],
    ["Real à esquerda; fantasma à direita, mais baixa.", "A real fica no lado do brinco, e o fantasma é mais alto."],
    ["Apenas imagem real à direita.", "Brincos geram imagem real e também fantasma."],
    ["Fantasma à direita, menor e nítida.", "O fantasma aparece no lado oposto, maior e borrado."],
  ]),
  q("q34", "imagens-reais-e-fantasmas", "aula", [54], "Quais estruturas formam APENAS imagens reais?", [
    ["Dentes, corpo da mandíbula e seios maxilares.", "Classificação no plano axial (slide 54)."],
    ["Coluna cervical, colares e cornos do hioide.", "Esses formam imagens fantasmas."],
    ["Corpo do hioide, palato e coluna cervical.", "Esses formam imagens reais duplicadas."],
    ["Brincos, zíperes e ramo da mandíbula.", "Esses formam imagens reais únicas e fantasmas."],
  ]),
  q("q35", "imagens-reais-e-fantasmas", "aula", [54], "Corpo do osso hioide, palato e coluna cervical podem formar:", [
    ["Imagens reais duplicadas.", "Estruturas da linha média atravessadas duas vezes pelo feixe."],
    ["Apenas imagens reais únicas.", "Elas podem gerar imagens reais duplicadas."],
    ["Nenhuma imagem.", "Elas aparecem na panorâmica."],
    ["Apenas fantasmas, nunca imagem real.", "Elas estão na lista de imagens reais duplicadas."],
  ]),
  q("q36", "imagens-reais-e-fantasmas", "complementar", undefined, "Qual característica NÃO pertence à imagem fantasma?", [
    ["Aparecer mais nítida que o objeto real.", "O fantasma é mais BORRADO."],
    ["Aparecer no lado oposto ao objeto.", "É característica do fantasma (OPOSTA)."],
    ["Aparecer mais alta que o objeto real.", "É característica do fantasma (ALTA), pelo ângulo negativo."],
    ["Aparecer maior, principalmente na horizontal.", "É característica do fantasma (GRANDE)."],
  ]),
  q("q37", "imagens-reais-e-fantasmas", "complementar", undefined, "O que são imagens duplas (reais duplicadas)?", [
    ["Duas imagens reais simétricas de estruturas da linha média posterior atravessadas duas vezes pelo feixe.", "Exemplos: corpo do hioide, palato, coluna cervical."],
    ["A imagem real e a imagem fantasma de um mesmo brinco.", "Isso é real + fantasma, não imagem dupla."],
    ["O resultado de duas exposições no mesmo receptor.", "Imagem dupla é um fenômeno do ciclo normal, não de duas exposições."],
    ["Imagens de dentes supranumerários.", "Supranumerários são uma indicação clínica, não um tipo de imagem."],
  ]),
  q("q38", "imagens-reais-e-fantasmas", "aula", [54], "Ramo e cabeça da mandíbula formam:", [
    ["Imagens reais únicas e fantasmas.", "Estão na mesma linha de brincos, colares e zíperes (slide 54)."],
    ["Apenas imagens reais.", "Apenas reais: corpo da mandíbula, dentes e seios maxilares."],
    ["Apenas imagens fantasmas.", "Ramo e cabeça também formam imagem real."],
    ["Imagens reais duplicadas.", "Reais duplicadas: corpo do hioide, palato e coluna cervical."],
  ]),
  q("q39", "imagens-reais-e-fantasmas", "aula", [52], "Na analogia do ciclista fotografado em movimento (panning), o que fica borrado?", [
    ["O que não acompanha o movimento do sistema.", "Assim se explica o borramento da imagem fantasma."],
    ["Somente o que está mais perto da câmera.", "O critério é acompanhar ou não o movimento do sistema."],
    ["Tudo fica igualmente nítido.", "No panning, o que não acompanha o movimento fica borrado."],
    ["Somente estruturas metálicas.", "O borramento não depende de o objeto ser metálico."],
  ]),

  // Módulo 8 ---------------------------------------------------------
  q("q40", "anatomia", "aula", [55], "Palato duro e assoalho da fossa nasal, na panorâmica:", [
    ["São faixas radiopacas horizontais distintas.", "E o palato ainda tem imagem projetada pelo lado oposto."],
    ["São a mesma linha.", "São faixas distintas — confundi-las é um erro comum."],
    ["São faixas radiolúcidas.", "Ambas são radiopacas."],
    ["Só aparecem em pacientes desdentados.", "Aparecem rotineiramente na panorâmica."],
  ]),
  q("q41", "anatomia", "aula", [4, 57, 58, 59, 60], "Qual destas estruturas pertence ao grupo “ATM e base do crânio”?", [
    ["Eminência articular", "Grupo ATM e base do crânio, junto com fossa mandibular, meato acústico externo, mastoide e estiloide."],
    ["Forame mentual", "Pertence à mandíbula."],
    ["Seio maxilar", "Pertence à maxila e face média."],
    ["Dorso da língua", "É tecido mole."],
  ]),
  q("q42", "anatomia", "aula", [4, 57, 58, 59, 60], "Qual destas é um tecido mole ou espaço aéreo visível na panorâmica?", [
    ["Palato mole", "Grupo das estruturas adjacentes e tecidos moles."],
    ["Processo coronoide", "Pertence à mandíbula."],
    ["Túber da maxila", "Pertence à maxila."],
    ["Processo estiloide", "Pertence à ATM e base do crânio."],
  ]),

  // Módulo 9 ---------------------------------------------------------
  q("q43", "vantagens", "complementar", undefined, "Por que a panorâmica é útil em pacientes com trismo ou reflexo de náusea?", [
    ["Porque é extraoral e dispensa receptores dentro da boca.", "É rápida, confortável e útil para quem não tolera receptores intraorais."],
    ["Porque substitui a periapical em detalhes endodônticos.", "Ela não substitui a periapical para detalhes finos."],
    ["Porque exige maior abertura de boca.", "Os incisivos ficam topo a topo no bloco, sem grande abertura."],
    ["Porque dispensa qualquer posicionamento.", "Ela é muito dependente do posicionamento."],
  ]),
  q("q44", "vantagens", "complementar", undefined, "Sobre a dose de radiação da panorâmica:", [
    ["É relativamente baixa, geralmente menor que a de um levantamento periapical completo; os valores variam.", "Os valores variam por aparelho e estudo."],
    ["É sempre maior que a de um levantamento periapical completo.", "Em geral é menor."],
    ["É zero, por ser extraoral.", "Ela usa raios X; a dose não é zero."],
    ["Tem um valor fixo, igual em todos os aparelhos.", "Os valores variam por aparelho e estudo."],
  ]),

  // Módulo 10 --------------------------------------------------------
  q("q45", "desvantagens", "aula", [5], "Estrela et al. (2008): sensibilidade para detectar periodontite apical:", [
    ["0,55 na periapical e 0,28 na panorâmica.", "Dados do estudo citado na aula (888 pacientes, 1.508 dentes)."],
    ["0,28 na periapical e 0,55 na panorâmica.", "Os valores estão invertidos."],
    ["0,90 na periapical e 0,85 na panorâmica.", "Os valores do estudo foram bem menores."],
    ["Iguais nos dois métodos.", "A panorâmica teve cerca de metade da sensibilidade da periapical."],
  ]),
  q("q46", "desvantagens", "aula", [5], "Qual é a mensagem principal de Estrela et al. (2008) sobre a panorâmica?", [
    ["Ela subestima lesões periapicais.", "A prevalência de lesões foi significativamente maior na TCFC."],
    ["Ela é mais sensível que a TCFC.", "A TCFC mostrou-se acurada e detectou mais lesões."],
    ["Ela detecta bem as lesões em estágio inicial.", "Os métodos convencionais só identificaram bem lesões em estágio avançado."],
    ["Ela é equivalente à TCFC.", "A prevalência de lesões foi significativamente maior na TCFC."],
  ]),
  q("q47", "desvantagens", "complementar", undefined, "A panorâmica substitui a radiografia interproximal para diagnóstico de cárie?", [
    ["Não: tem menor nitidez e detalhe que as intraorais.", "Também não substitui a periapical para detalhes endodônticos/periodontais finos."],
    ["Sim, porque mostra todos os dentes.", "Mostrar todos os dentes não compensa o menor detalhe."],
    ["Sim, se o paciente estiver bem posicionado.", "Mesmo bem posicionada, tem menor nitidez que as intraorais."],
    ["Sim, porque a dose é menor.", "Dose não define capacidade diagnóstica para cárie."],
  ]),
  q("q48", "desvantagens", "complementar", undefined, "Qual destas NÃO é uma desvantagem ou limitação da panorâmica?", [
    ["Visão ampla das arcadas numa única imagem.", "Essa é uma vantagem."],
    ["Ampliação desigual, sobretudo horizontal.", "É uma limitação geométrica."],
    ["Forte dependência do posicionamento.", "É uma limitação: erros são frequentes."],
    ["Imagem bidimensional de estruturas tridimensionais.", "É uma limitação."],
  ]),

  // Módulo 11 --------------------------------------------------------
  q("q49", "indicacoes", "complementar", undefined, "A radiografia panorâmica deve ser solicitada:", [
    ["Com base em exame clínico prévio e justificativa (princípio da justificação/ALARA).", "Ela não é exame de “check-up” de rotina."],
    ["Como check-up de rotina em todos os pacientes.", "Pedir sem exame clínico e justificativa fere o princípio da justificação."],
    ["Sempre antes de qualquer consulta.", "A solicitação depende de indicação clínica."],
    ["Somente depois de uma TCFC.", "A TCFC complementa a panorâmica quando necessário, não o contrário."],
  ]),
  q("q50", "indicacoes", "complementar", undefined, "Qual destas é uma indicação da panorâmica?", [
    ["Avaliação de terceiros molares e dentes inclusos/impactados.", "Indicação clássica da panorâmica."],
    ["Detecção de cáries interproximais.", "Para cárie, a interproximal é superior."],
    ["Detalhes endodônticos finos.", "Para isso, a periapical é superior."],
    ["Medidas lineares precisas.", "A panorâmica não é confiável para medidas precisas."],
  ]),
  q("q51", "indicacoes", "complementar", undefined, "Em implantodontia e cirurgia, a panorâmica serve para:", [
    ["Planejamento inicial, complementando com TCFC quando necessário.", "Por causa da distorção, a panorâmica é ponto de partida, não exame final de medidas."],
    ["Medidas finais precisas, dispensando outros exames.", "Medidas na panorâmica são pouco confiáveis."],
    ["Nada: não tem utilidade nessa área.", "É indicada para o planejamento inicial."],
    ["Substituir a TCFC em todos os casos.", "A TCFC complementa quando necessário."],
  ]),

  // Módulo 12 --------------------------------------------------------
  q("q52", "interpretacao", "aula", [26, 32], "Qual é o primeiro passo da interpretação sistemática da panorâmica?", [
    ["Identificação e lado (marcadores D/E ou R/L).", "Antes de qualquer achado, confira identificação e lado."],
    ["Procurar lesões periapicais.", "Dentes vêm depois da qualidade técnica e das estruturas ósseas."],
    ["Avaliar os tecidos moles.", "Tecidos moles são o 5º passo."],
    ["Procurar achados incidentais.", "Achados incidentais são o último passo."],
  ]),
  q("q53", "interpretacao", "complementar", undefined, "Na leitura sistemática, as estruturas ósseas devem ser avaliadas:", [
    ["Da periferia para o centro.", "ATM/côndilos, ramos, corpo e basilar da mandíbula, maxila, seios e fossas nasais."],
    ["Do centro para a periferia.", "A sequência proposta vai da periferia para o centro."],
    ["Apenas na região da queixa do paciente.", "A leitura sistemática avalia toda a imagem."],
    ["Em ordem aleatória.", "A ordem fixa evita deixar achados passarem."],
  ]),
];
