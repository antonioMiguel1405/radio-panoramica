"use client";

import { Check, CircleCheck, CircleX, Eye, MapPin, RefreshCw, Search, Trophy, ZoomIn, ZoomOut } from "lucide-react";
import { useMemo, useState } from "react";
import { recordAnatomyScore, useProgress } from "@/lib/progress";
import { shuffle } from "@/lib/shuffle";
import { SourceBadge } from "../SourceBadge";
import { GROUP_COLORS, anatomyGroups, hotspots, type Hotspot } from "./anatomyHotspots";
import { NORMAL, warp } from "./panorama";
import { PanoramaSchematic } from "./PanoramaSchematic";

type Mode = "explorar" | "onde" | "qual";
const ROUNDS = 10;

interface Game {
  mode: "onde" | "qual";
  queue: Hotspot[];
  index: number;
  hits: number;
  answered: string | null; // id escolhido
  options: Hotspot[];
}

const byId = new Map(hotspots.map((h) => [h.id, h]));

function optionsFor(target: Hotspot) {
  const sameGroup = hotspots.filter((h) => h.groupId === target.groupId && h.id !== target.id);
  const others = shuffle(sameGroup.length >= 3 ? sameGroup : hotspots.filter((h) => h.id !== target.id)).slice(0, 3);
  return shuffle([target, ...others]);
}

export function AnatomyExplorer({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<Mode>("explorar");
  const [group, setGroup] = useState<string>("todos");
  const [selected, setSelected] = useState<string | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [zoom, setZoom] = useState(false);
  const progress = useProgress();

  const visible = useMemo(
    () => (group === "todos" ? hotspots : hotspots.filter((h) => h.groupId === group)),
    [group],
  );

  const startGame = (m: "onde" | "qual") => {
    const pool = visible.length >= 4 ? visible : hotspots;
    const queue = shuffle(pool).slice(0, ROUNDS);
    setMode(m);
    setSelected(null);
    setGame({ mode: m, queue, index: 0, hits: 0, answered: null, options: optionsFor(queue[0]) });
  };

  const current = game ? game.queue[game.index] : null;
  const finished = game && game.index >= game.queue.length;

  const answer = (id: string) => {
    if (!game || !current || game.answered) return;
    const hits = game.hits + (id === current.id ? 1 : 0);
    setGame({ ...game, answered: id, hits });
    if (game.index === game.queue.length - 1) recordAnatomyScore(hits);
  };

  const nextRound = () => {
    if (!game) return;
    const index = game.index + 1;
    setGame({
      ...game,
      index,
      answered: null,
      options: index < game.queue.length ? optionsFor(game.queue[index]) : [],
    });
  };

  const onHotspot = (h: Hotspot) => {
    if (mode === "explorar") setSelected(h.id === selected ? null : h.id);
    else if (game?.mode === "onde" && !game.answered) answer(h.id);
  };

  const sel = selected ? byId.get(selected) : null;
  const shownSpots = mode === "qual" && current ? [current] : visible;

  return (
    <div className="space-y-4">
      {/* Modos */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap rounded-xl border border-line bg-surface-2 p-1" role="group" aria-label="Modo">
          {(
            [
              ["explorar", "Explorar", Eye],
              ["onde", "Treino: onde está?", MapPin],
              ["qual", "Treino: qual é?", Search],
            ] as const
          ).map(([m, label, Icon]) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => (m === "explorar" ? (setMode("explorar"), setGame(null)) : startGame(m))}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold ${
                mode === m ? "bg-surface text-fg shadow-sm" : "text-muted"
              }`}
            >
              <Icon className="size-4" aria-hidden /> {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setZoom((z) => !z)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-2 text-sm font-medium text-fg lg:hidden"
          aria-pressed={zoom}
        >
          {zoom ? <ZoomOut className="size-4" aria-hidden /> : <ZoomIn className="size-4" aria-hidden />}
          {zoom ? "Reduzir" : "Ampliar"}
        </button>
        {progress.anatomyBest > 0 && (
          <span className="inline-flex items-center gap-1 text-sm text-muted">
            <Trophy className="size-4 text-warning" aria-hidden /> recorde {progress.anatomyBest}/{ROUNDS}
          </span>
        )}
      </div>

      {/* Grupos */}
      <div role="group" aria-label="Grupo de estruturas" className="flex flex-wrap gap-2">
        <GroupChip active={group === "todos"} onClick={() => setGroup("todos")} color="#94a3b8">
          Todos ({hotspots.length})
        </GroupChip>
        {anatomyGroups.map((g) => (
          <GroupChip key={g.id} active={group === g.id} onClick={() => setGroup(g.id)} color={GROUP_COLORS[g.id]}>
            {g.title} ({hotspots.filter((h) => h.groupId === g.id).length})
          </GroupChip>
        ))}
      </div>

      <div className={`grid gap-4 ${compact ? "" : "lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]"}`}>
        <div className="min-w-0">
          <div className="overflow-x-auto rounded-2xl border border-[#1d3b44] bg-[#040708]">
            <div style={{ width: zoom ? "200%" : "100%" }}>
              <PanoramaSchematic params={NORMAL} title="Panorâmica esquemática com marcadores anatômicos">
                {shownSpots.map((h, i) => {
                  const [x, y] = warp(NORMAL, h.pos[0], h.pos[1]);
                  const isSel = h.id === selected;
                  const isAnswer = game?.answered && current && h.id === current.id;
                  const isWrong = game?.answered && h.id === game.answered && current && h.id !== current.id;
                  const color = isAnswer ? "#4ade80" : isWrong ? "#f87171" : GROUP_COLORS[h.groupId];
                  const clickable = mode === "explorar" || (game?.mode === "onde" && !game.answered);
                  return (
                    <g
                      key={h.id}
                      role={clickable ? "button" : undefined}
                      tabIndex={clickable ? 0 : -1}
                      aria-label={mode === "explorar" ? h.label : `Marcador ${i + 1} — ${h.group}`}
                      onClick={() => onHotspot(h)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onHotspot(h);
                        }
                      }}
                      className={clickable ? "cursor-pointer outline-none [&:focus-visible>circle:nth-child(2)]:stroke-white" : ""}
                    >
                      <circle cx={x} cy={y} r={20} fill="transparent" />
                      <circle
                        cx={x}
                        cy={y}
                        r={isSel || isAnswer || (mode === "qual" && current) ? 12 : 8}
                        fill={color}
                        fillOpacity={0.9}
                        stroke="#041014"
                        strokeWidth={3}
                      />
                      {(isSel || isAnswer || (mode === "qual" && current)) && (
                        <circle cx={x} cy={y} r={20} fill="none" stroke={color} strokeWidth={2.5} className="motion-safe:animate-pulse" />
                      )}
                    </g>
                  );
                })}
              </PanoramaSchematic>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted">
            Esquema didático com marcação própria; posições aproximadas — confira na radiografia da aula. Lado esquerdo
            da imagem = lado direito do paciente.
          </p>
        </div>

        {/* Painel */}
        <div className="min-w-0" aria-live="polite">
          {mode === "explorar" && (
            <div className="rounded-2xl border border-line bg-surface p-4 shadow-card">
              {sel ? (
                <>
                  <p className="text-xs font-bold tracking-wide uppercase" style={{ color: GROUP_COLORS[sel.groupId] }}>
                    {sel.group}
                  </p>
                  <p className="mt-1 font-display text-xl font-bold text-fg">{sel.label}</p>
                </>
              ) : (
                <p className="text-sm text-fg">Toque em um marcador para ver o nome — ou escolha na lista.</p>
              )}
              <SourceBadge source="aula" slides={[4, 57, 58, 59, 60]} size="xs" className="mt-2" />
              <ul className="mt-3 max-h-72 space-y-0.5 overflow-y-auto pr-1 text-sm">
                {visible.map((h) => (
                  <li key={h.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(h.id)}
                      aria-pressed={h.id === selected}
                      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left ${
                        h.id === selected ? "bg-surface-2 font-semibold text-fg" : "text-muted hover:bg-surface-2 hover:text-fg"
                      }`}
                    >
                      <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ background: GROUP_COLORS[h.groupId] }} />
                      {h.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {game && !finished && current && (
            <div className="rounded-2xl border border-line bg-surface p-4 shadow-card">
              <p className="text-sm text-muted tabular-nums">
                Rodada {game.index + 1} de {game.queue.length} · {game.hits} acerto(s)
              </p>
              {game.mode === "onde" ? (
                <>
                  <p className="mt-2 text-sm text-fg">Toque no marcador de:</p>
                  <p className="font-display text-xl font-bold text-fg">{current.label}</p>
                  {!game.answered && (
                    <p className="mt-2 text-xs text-muted">
                      Teclado: use Tab para percorrer os marcadores e Enter para escolher.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="mt-2 text-sm text-fg">Qual estrutura está destacada?</p>
                  <ul className="mt-2 space-y-2">
                    {game.options.map((o) => {
                      const st = !game.answered
                        ? "border-line hover:border-accent/60"
                        : o.id === current.id
                          ? "border-success bg-success-soft"
                          : o.id === game.answered
                            ? "border-danger bg-danger-soft"
                            : "border-line opacity-70";
                      return (
                        <li key={o.id}>
                          <button
                            type="button"
                            disabled={!!game.answered}
                            onClick={() => answer(o.id)}
                            className={`flex w-full items-center gap-2 rounded-xl border-2 bg-surface px-3 py-2 text-left text-sm font-medium text-fg ${st}`}
                          >
                            {game.answered && o.id === current.id && <Check className="size-4 text-success" aria-hidden />}
                            {o.label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
              {game.answered && (
                <div className="mt-3 space-y-2">
                  <p className={`flex items-center gap-2 font-semibold ${game.answered === current.id ? "text-success" : "text-danger"}`}>
                    {game.answered === current.id ? <CircleCheck className="size-5" aria-hidden /> : <CircleX className="size-5" aria-hidden />}
                    {game.answered === current.id ? "Acertou!" : `Era: ${current.label} (marcador verde)`}
                  </p>
                  <button
                    type="button"
                    onClick={nextRound}
                    className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent"
                  >
                    {game.index === game.queue.length - 1 ? "Ver resultado" : "Próxima"}
                  </button>
                </div>
              )}
            </div>
          )}

          {game && finished && (
            <div className="rounded-2xl border border-line bg-surface p-5 text-center shadow-card">
              <Trophy className="mx-auto size-8 text-warning" aria-hidden />
              <p className="mt-2 font-display text-2xl font-extrabold">
                {game.hits} de {game.queue.length}
              </p>
              <p className="text-sm text-muted">Recorde: {Math.max(progress.anatomyBest, game.hits)}</p>
              <button
                type="button"
                onClick={() => startGame(game.mode)}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent"
              >
                <RefreshCw className="size-4" aria-hidden /> Jogar de novo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GroupChip({
  active,
  onClick,
  color,
  children,
}: {
  active: boolean;
  onClick: () => void;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${
        active ? "border-accent bg-accent-soft font-semibold text-fg" : "border-line bg-surface text-muted hover:text-fg"
      }`}
    >
      <span aria-hidden className="size-2.5 rounded-full" style={{ background: color }} />
      {children}
    </button>
  );
}
