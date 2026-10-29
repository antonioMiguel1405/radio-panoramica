# Radiografia Panorâmica — mapa mental e roteiro de estudos interativo

Material de estudo para prova da disciplina de **Radiologia Odontológica (ICT/UNESP São José dos Campos)**,
baseado na aula de Radiografia Panorâmica do **Prof. Dr. Luiz Roberto C. Manhães Jr.**

Site estático (Next.js), rápido e pensado para o celular, com:

| Página | O que tem |
| --- | --- |
| **Início** (`/`) | Acesso a tudo, anel de progresso geral e **plano de revisão** com 3 trilhas (1 h, 1 dia, 3 dias). |
| **Mapa mental** (`/mapa`) | Árvore interativa gerada a partir do conteúdo: expandir/recolher, layouts Árvore/Radial, painel de detalhes, minimapa (desktop) e **Exportar PNG**. |
| **Roteiro** (`/roteiro`) | 12 módulos com objetivos, conteúdo com selo de origem (aula/complementar + slides), ilustrações SVG, pegadinhas, mnemônicos, autoverificação e “Concluí este módulo”. |
| **Quiz** (`/quiz`) | 53 questões com explicação de cada alternativa, filtro por módulo, simulado de 10 questões com cronômetro e revisão de erros. |
| **Flashcards** (`/flashcards`) | 52 cartões com “Sei” / “Revisar” e repetição simples. |
| **Simuladores** (`/simuladores`) | Camada de imagem · Imagem real × fantasma · Erros de posicionamento (com desafio) · Treino de anatomia. |
| **Revisão** (`/revisao`) | Folha de revisão densa, pronta para **imprimir / salvar em PDF (A4)**. |

Há ainda busca global (**Ctrl/⌘ + K**), tema claro/escuro e progresso salvo no navegador.

> Todas as ilustrações são **SVGs originais e esquemáticos**. Nenhuma imagem dos slides ou da internet foi usada.

## Como rodar

Requisitos: Node.js 20.9 ou mais recente.

```bash
npm install
npm run dev        # http://localhost:3000
```

Outros scripts:

```bash
npm run build      # build de produção (gera páginas estáticas)
npm run start      # serve o build
npm run lint       # ESLint
npm run typecheck  # TypeScript
```

## Como editar o conteúdo

**Todo o conteúdo fica em [`/content`](content)** — o restante do site é gerado a partir dali.

| Arquivo | Conteúdo |
| --- | --- |
| `content/modules.ts` | Os 12 módulos: objetivos, tópicos, pontos-chave, tabelas, pegadinhas, mnemônicos e autoverificação. |
| `content/errors.ts` | Tabela de erros de posicionamento (usada no Módulo 6, no simulador e na revisão). |
| `content/quiz.ts` | Questões do quiz. **A primeira alternativa é sempre a correta** (o site embaralha). |
| `content/flashcards.ts` | Flashcards. |
| `content/glossary.ts` | Glossário (aparece na busca). |
| `content/trilhas.ts` | Trilhas do plano de revisão. |
| `content/mindmap.ts` | **Não editar**: o mapa mental é derivado automaticamente de `modules.ts`. |
| `content/meta.ts` | Título, disciplina, professor, instituição e **nomes do grupo**. |

Cada informação tem uma origem:

- `source: "aula"` + `slides: [17, 18]` → aparece o selo **“Da aula · Slides 17–18”**;
- `source: "complementar"` → selo **“Complementar”** (literatura clássica de radiologia).

Use `**negrito**` e `*itálico*` dentro dos textos.

### Nomes do grupo

Abra [`content/meta.ts`](content/meta.ts) e substitua os placeholders:

```ts
grupo: ["Integrante 1", "Integrante 2", "Integrante 3", "Integrante 4", "Integrante 5"],
```

Os nomes aparecem no rodapé de todas as páginas e na folha de revisão.

## Publicar (GitHub + Vercel)

1. **Repositório local** (já inicializado com os commits de cada fase):
   ```bash
   git status
   ```
2. **Criar o repositório no GitHub**
   - Pelo site: GitHub → *New repository* → copie a URL e rode:
     ```bash
     git remote add origin https://github.com/SEU-USUARIO/radiografia-panoramica.git
     git push -u origin main
     ```
   - Ou pelo GitHub CLI (se instalado e autenticado):
     ```bash
     gh repo create radiografia-panoramica --public --source . --push
     ```
3. **Vercel**: [vercel.com](https://vercel.com) → *Add New… → Project* → importe o repositório → **Deploy**.
   Nenhuma configuração extra é necessária (o Next.js é detectado automaticamente; não há variáveis de ambiente).

## Detalhes técnicos

- Next.js 16 (App Router, 100% estático/SSG) · React 19 · TypeScript estrito · Tailwind CSS 4
- Mapa mental: `@xyflow/react` + `d3-hierarchy`; exportação com `html-to-image`
- Animações: `framer-motion` (respeita “reduzir movimento” do sistema) · Ícones: `lucide-react`
- Progresso em `localStorage` com proteção: se o navegador bloquear o armazenamento, o site continua funcionando
  (o progresso vale só para aquela visita).
- Acessibilidade: navegação por teclado, foco visível, `aria-*` nos componentes interativos, contraste AA.

## Créditos

Baseado na aula de Radiografia Panorâmica do Prof. Dr. Luiz Roberto C. Manhães Jr. — ICT/UNESP São José dos Campos.
Material de estudo produzido com auxílio de IA. Conteúdo complementar marcado como tal; valide dúvidas com o professor.
