/* editorial-ui · Cristian Pérez · cristianperez.me */
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BANK, videoFor } from "../data/bank";
import { CATEGORY_BY_ID, FAMILY_BY_ID } from "../data/categories";
import type { GameClient } from "../net/client";
import type { Player, Snapshot } from "./match";
import { multiplier } from "./round";
import { fmt } from "./useGame";
import MediaStage from "../components/MediaStage";
import { Seal } from "../components/Seal";
import RollingNumber from "../components/RollingNumber";
import "./game.css";

const LETTERS = ["A", "B", "C", "D"];
const DIFF = { 1: "Fácil", 2: "Media", 3: "Difícil" } as const;

interface Props {
  client: GameClient;
  snap: Snapshot;
  at: number;
  onExit: () => void;
}

export default function GameScreen({ client, snap, at, onExit }: Props) {
  const q = snap.qid ? BANK.byId[snap.qid] : null;
  const cat = snap.cat ? CATEGORY_BY_ID[snap.cat] : null;
  const fam = cat ? FAMILY_BY_ID[cat.family] : null;
  const me = snap.players.find((p) => p.id === client.me.id);
  const key = `${snap.index}:${snap.qid}`;
  const [pick, setPick] = useState<{ key: string; choice: number } | null>(null);
  const myPick = pick?.key === key ? pick.choice : null;
  const starts = useRef(new Map<string, number>());
  const [confirmExit, setConfirmExit] = useState(false);

  // momento local en que arrancó el reloj de esta pregunta
  if (snap.phase === "question" && !starts.current.has(key)) starts.current.set(key, at - (snap.duration - snap.remaining));
  const localStart = starts.current.get(key) ?? 0;
  const deadline = localStart + snap.duration;

  const answer = (i: number) => {
    if (snap.phase !== "question" || myPick != null) return;
    setPick({ key, choice: i });
    client.answer(snap.index, i, Math.max(0, Date.now() - localStart));
  };

  // teclado: 1-4 / A-D para responder, Enter para seguir
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const n = "1234".indexOf(e.key) + 1 || "abcd".indexOf(e.key.toLowerCase()) + 1;
      if (n && snap.phase === "question") answer(n - 1);
      if (e.key === "Enter" && snap.phase === "reveal" && client.isHost) client.next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const video = q?.media ? videoFor(q.media.k) : undefined;
  const reveal = snap.phase === "reveal" ? snap.reveal : null;
  const mine = reveal?.picks[client.me.id];
  const answeredCount = snap.answered.length;
  const online = snap.players.filter((p) => p.online);

  if (snap.phase === "final") return <FinalScreen client={client} snap={snap} onExit={onExit} />;
  if (!q || !cat) return null;

  return (
    <div className="game">
      <header className="game__top">
        <button type="button" className="game__exit" onClick={() => setConfirmExit(true)} aria-label="Salir de la partida">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
          </svg>
          <span>Salir</span>
        </button>
        <div className="game__cat">
          <span className={`game__cat-tone tone-${fam?.tone}`} aria-hidden />
          <span className="game__cat-name">{cat.name}</span>
        </div>
        <div className="game__score" aria-label={`Puntaje ${me?.score ?? 0}`}>
          <RollingNumber value={me?.score ?? 0} />
          <span className="game__score-unit">pts</span>
        </div>
      </header>

      <Progress snap={snap} me={client.me.id} />

      <Timer key={key} running={snap.phase === "question"} done={snap.phase === "reveal"} deadline={deadline} duration={snap.duration} />

      <AnimatePresence>
        {snap.notice && (
          <motion.p className="game__notice" role="status" initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
            {snap.notice}
          </motion.p>
        )}
      </AnimatePresence>

      <main className={`game__body ${q.media ? "has-media" : ""}`}>
        <section className="game__main">
          <AnimatePresence mode="wait">
            <motion.div
              key={key}
              className="qpanel"
              initial={{ opacity: 0, x: 40, rotate: 0.6 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="qpanel__meta">
                <span className="qpanel__n">
                  {snap.index + 1}
                  <span className="muted">/{snap.ids.length}</span>
                </span>
                <span className="qpanel__diff" aria-label={`Dificultad ${DIFF[q.d]}`}>
                  {[1, 2, 3].map((d) => (
                    <i key={d} className={d <= q.d ? "on" : ""} />
                  ))}
                  {DIFF[q.d]}
                </span>
                {q.cat !== snap.cat && CATEGORY_BY_ID[q.cat] && <span className="qpanel__from">De {CATEGORY_BY_ID[q.cat].name}</span>}
                {me && me.streak >= 2 && snap.phase !== "reveal" && (
                  <span className="qpanel__streak">
                    Racha {me.streak}
                    {multiplier(me.streak + 1) > 1 && <b> · ×{String(multiplier(me.streak + 1)).replace(".", ",")}</b>}
                  </span>
                )}
              </div>
              <h1 className="qpanel__q">{q.q}</h1>

              {q.media && video && (
                <MediaStage
                  key={key}
                  media={q.media}
                  videoId={video.id}
                  revealed={snap.phase === "reveal"}
                  onPlaying={() => client.media(snap.index, "playing")}
                  onError={() => client.media(snap.index, "error")}
                />
              )}
              {q.media && snap.phase === "reveal" && video && (
                <p className="qpanel__source">
                  Sonó: <b>{video.title}</b> <span className="muted">· {video.channel}</span>
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          <ol className="opts" aria-label="Opciones">
            {snap.order.map((orig, i) => {
              const isCorrect = reveal && reveal.correct === i;
              const isMine = myPick === i || (mine && mine.choice === i);
              const state = reveal ? (isCorrect ? "correct" : isMine ? "wrong" : "dim") : isMine ? "picked" : "idle";
              const who = reveal ? online.filter((p) => reveal.picks[p.id]?.choice === i && p.id !== client.me.id) : [];
              return (
                <li key={`${key}-${i}`}>
                  <motion.button
                    type="button"
                    className={`opt opt--${state}`}
                    onClick={() => answer(i)}
                    disabled={snap.phase !== "question" || myPick != null}
                    aria-pressed={isMine || undefined}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * i, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    whileTap={snap.phase === "question" && myPick == null ? { scale: 0.97 } : undefined}
                  >
                    <span className="opt__letter" aria-hidden>
                      {LETTERS[i]}
                    </span>
                    <span className="opt__text">{q.o[orig]}</span>
                    {state === "correct" && <Stamp ok />}
                    {state === "wrong" && <Stamp />}
                    {who.length > 0 && (
                      <span className="opt__who" aria-label={`Eligieron: ${who.map((p) => p.name).join(", ")}`}>
                        {who.slice(0, 5).map((p) => (
                          <Seal key={p.id} text={p.name} variant={p.seal} size={22} />
                        ))}
                        {who.length > 5 && <span>+{who.length - 5}</span>}
                      </span>
                    )}
                  </motion.button>
                </li>
              );
            })}
          </ol>

          <div className="game__status" aria-live="polite">
            {snap.phase === "loading" && q.media && (
              <p>{snap.mode === "group" ? `Preparando el video en todos los celulares (${snap.mediaReady.length}/${online.length})…` : "Preparando el video…"}</p>
            )}
            {snap.phase === "question" && myPick != null && snap.mode === "group" && (
              <p>
                Respondiste. Faltan {Math.max(0, online.length - answeredCount)} de {online.length}.
              </p>
            )}
          </div>

          <AnimatePresence>{reveal && mine && <Verdict key={key} pick={mine} />}</AnimatePresence>

          {reveal && (
            <div className="game__next">
              {client.isHost ? (
                <button type="button" className="btn btn--hanko" onClick={() => client.next()} autoFocus>
                  {snap.index + 1 >= snap.ids.length ? "Ver resultado" : "Siguiente pregunta"}
                  <Arrow />
                </button>
              ) : (
                <p className="muted">El anfitrión pasa a la siguiente en unos segundos…</p>
              )}
            </div>
          )}
        </section>

        {snap.mode === "group" && <Board snap={snap} me={client.me.id} />}
      </main>

      <AnimatePresence>
        {confirmExit && (
          <motion.div className="dialog" role="dialog" aria-modal="true" aria-labelledby="exit-t" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="dialog__card panel" initial={{ y: 30, rotate: -1 }} animate={{ y: 0, rotate: 0 }}>
              <h2 id="exit-t">¿Salir de la partida?</h2>
              <p>{client.isHost && snap.mode === "group" ? "Eres el anfitrión: si sales, la sala se cierra para todos." : "Se pierde el puntaje de esta ronda."}</p>
              <div className="dialog__actions">
                <button type="button" className="btn btn--paper" onClick={() => setConfirmExit(false)} autoFocus>
                  Seguir jugando
                </button>
                <button type="button" className="btn" onClick={onExit}>
                  Salir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function Stamp({ ok }: { ok?: boolean }) {
  return (
    <motion.span
      className={`opt__stamp ${ok ? "is-ok" : "is-bad"}`}
      initial={{ scale: 1.8, opacity: 0, rotate: -18 }}
      animate={{ scale: 1, opacity: 1, rotate: -8 }}
      transition={{ type: "spring", stiffness: 520, damping: 18 }}
      aria-label={ok ? "Correcta" : "Tu respuesta, incorrecta"}
    >
      {ok ? "Correcta" : "✕"}
    </motion.span>
  );
}

function Verdict({ pick }: { pick: { ok: boolean; gained: number; streak: number; choice: number | null; excused?: boolean } }) {
  const reduce = useReducedMotion();
  const word = pick.ok ? "¡Bien!" : pick.choice == null ? (pick.excused ? "Sin video" : "¡Tiempo!") : "¡Fallaste!";
  const sub = pick.ok
    ? `+${fmt(pick.gained)} puntos${pick.streak >= 3 ? ` · racha de ${pick.streak} (×${String(multiplier(pick.streak)).replace(".", ",")})` : ""}`
    : pick.excused
      ? "El video no cargó en tu celular: tu racha se mantiene."
      : pick.choice == null
        ? "No respondiste a tiempo. La racha vuelve a cero."
        : "La racha vuelve a cero.";
  return (
    <motion.div
      className={`verdict ${pick.ok ? "is-ok" : "is-bad"}`}
      initial={reduce ? { opacity: 0 } : { scale: 0.6, rotate: -6, opacity: 0 }}
      animate={{ scale: 1, rotate: -2, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 16 }}
      role="status"
    >
      <span className="verdict__word">{word}</span>
      <span className="verdict__sub">{sub}</span>
    </motion.div>
  );
}

function Timer({ running, done, deadline, duration }: { running: boolean; done: boolean; deadline: number; duration: number }) {
  const bar = useRef<HTMLDivElement>(null);
  const [secs, setSecs] = useState(Math.ceil(duration / 1000));
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = -1;
    const loop = () => {
      const left = Math.max(0, deadline - Date.now());
      if (bar.current) bar.current.style.transform = `scaleX(${left / duration})`;
      const s = Math.ceil(left / 1000);
      if (s !== last) {
        last = s;
        setSecs(s);
      }
      if (left > 0) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, deadline, duration]);
  const urgent = running && secs <= 5;
  return (
    <div className={`timer ${urgent ? "is-urgent" : ""} ${done ? "is-done" : ""} ${!running && !done ? "is-waiting" : ""}`} role="timer" aria-label={`${secs} segundos`}>
      <div className="timer__track">
        <div className="timer__bar" ref={bar} />
      </div>
      <span className="timer__n">{running || done ? secs : "··"}</span>
    </div>
  );
}

function Progress({ snap, me }: { snap: Snapshot; me: string }) {
  // historial propio: se arma con las revelaciones vistas
  const hist = useRef<Record<number, "ok" | "bad">>({});
  if (snap.phase === "reveal" && snap.reveal) hist.current[snap.index] = snap.reveal.picks[me]?.ok ? "ok" : "bad";
  if (snap.index === 0 && snap.phase !== "reveal") hist.current = {};
  return (
    <ol className="progress" aria-label={`Pregunta ${snap.index + 1} de ${snap.ids.length}`}>
      {snap.ids.map((_, i) => (
        <li key={i} className={`${hist.current[i] ?? ""} ${i === snap.index ? "is-now" : ""}`} />
      ))}
    </ol>
  );
}

function Board({ snap, me }: { snap: Snapshot; me: string }) {
  const sorted = useMemo(() => [...snap.players].sort((a, b) => b.score - a.score), [snap.players]);
  return (
    <aside className="board" aria-label="Marcador">
      <p className="label">Marcador</p>
      <ol>
        {sorted.map((p, i) => (
          <motion.li layout key={p.id} className={`${p.id === me ? "is-me" : ""} ${p.online ? "" : "is-off"}`} transition={{ type: "spring", stiffness: 400, damping: 34 }}>
            <span className="board__rank">{i + 1}</span>
            <Seal text={p.name} variant={p.seal} size={30} />
            <span className="board__name">{p.name}</span>
            {snap.phase === "question" && snap.answered.includes(p.id) && <span className="board__done" aria-label="Respondió">✓</span>}
            {snap.phase === "reveal" && snap.reveal?.picks[p.id] && (
              <span className={`board__delta ${snap.reveal.picks[p.id].ok ? "is-ok" : ""}`}>
                {snap.reveal.picks[p.id].ok ? `+${snap.reveal.picks[p.id].gained}` : "0"}
              </span>
            )}
            <span className="board__pts">{fmt(p.score)}</span>
          </motion.li>
        ))}
      </ol>
    </aside>
  );
}

const RANKS: [number, string, string][] = [
  [10, "Perfecto", "Diez de diez. Nada que corregir en este tomo."],
  [8, "Maestro", "Te pasaste la categoría casi sin despeinarte."],
  [6, "Veterano", "Sabes de esto. Otra ronda y llegas a maestro."],
  [4, "Aprendiz", "Vas bien. Repite la categoría y verás preguntas nuevas."],
  [0, "Novato", "Todo maestro empezó aquí. Otra ronda."],
];

function FinalScreen({ client, snap, onExit }: { client: GameClient; snap: Snapshot; onExit: () => void }) {
  const me = snap.players.find((p) => p.id === client.me.id);
  const sorted = [...snap.players].sort((a, b) => b.score - a.score);
  const total = snap.ids.length;
  const correct = me?.correct ?? 0;
  const scaled = total ? Math.round((correct / total) * 10) : 0;
  const rank = RANKS.find(([min]) => scaled >= min)!;
  const cat = snap.cat ? CATEGORY_BY_ID[snap.cat] : null;
  const place = sorted.findIndex((p) => p.id === client.me.id) + 1;
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const text = `Hice ${fmt(me?.score ?? 0)} puntos en ${cat?.name} en Tostrivia (${correct}/${total}, mejor racha ${me?.best ?? 0}). ¿Me ganas?`;
    const url = `${location.origin}/jugar/${snap.cat}`;
    try {
      if (navigator.share) await navigator.share({ text, url });
      else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        setCopied(true);
      }
    } catch {
      /* el usuario canceló */
    }
  };

  return (
    <div className="final">
      <div className="final__speed" aria-hidden />
      <motion.div className="final__inner wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <p className="final__eyebrow">Fin de la ronda · {cat?.name}</p>
        <div className="final__hero">
          <motion.div
            className="final__seal"
            initial={{ scale: 2.4, rotate: -25, opacity: 0 }}
            animate={{ scale: 1, rotate: -9, opacity: 1 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 380, damping: 15 }}
          >
            <span>{rank[1]}</span>
          </motion.div>
          <div>
            <p className="final__score">
              <RollingNumber value={me?.score ?? 0} />
              <span>puntos</span>
            </p>
            <p className="final__line">{rank[2]}</p>
          </div>
        </div>

        <dl className="final__stats">
          <div>
            <dt>Aciertos</dt>
            <dd>
              {correct}/{total}
            </dd>
          </div>
          <div>
            <dt>Mejor racha</dt>
            <dd>{me?.best ?? 0}</dd>
          </div>
          {snap.mode === "group" && (
            <div>
              <dt>Puesto</dt>
              <dd>
                {place}.º de {sorted.length}
              </dd>
            </div>
          )}
          {snap.replaced > 0 && (
            <div>
              <dt>Preguntas cambiadas</dt>
              <dd>{snap.replaced}</dd>
            </div>
          )}
        </dl>

        {snap.mode === "group" && <Podium players={sorted} me={client.me.id} />}

        <div className="final__actions">
          {client.isHost && snap.mode === "solo" && (
            <button type="button" className="btn btn--hanko" onClick={() => client.start(Math.floor(Math.random() * 2 ** 31))}>
              Otra ronda de {cat?.name}
            </button>
          )}
          {client.isHost && snap.mode === "group" && (
            <button type="button" className="btn btn--hanko" onClick={() => client.backToLobby()}>
              Volver a la sala
            </button>
          )}
          {!client.isHost && <p className="final__wait">Esperando a que el anfitrión arme otra ronda…</p>}
          <button type="button" className="btn btn--paper" onClick={share}>
            {copied ? "Copiado" : "Compartir resultado"}
          </button>
          <button type="button" className="link final__home" onClick={onExit}>
            {snap.mode === "group" ? "Salir de la sala" : "Volver a la ruleta"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Podium({ players, me }: { players: Player[]; me: string }) {
  return (
    <ol className="podium">
      {players.map((p, i) => (
        <motion.li
          key={p.id}
          className={`${i < 3 ? `is-top is-${i + 1}` : ""} ${p.id === me ? "is-me" : ""}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + i * 0.08 }}
        >
          <span className="podium__n">{i + 1}</span>
          <Seal text={p.name} variant={p.seal} size={36} />
          <span className="podium__name">{p.name}</span>
          <span className="podium__meta">
            {p.correct} aciertos · racha {p.best}
          </span>
          <span className="podium__pts">{fmt(p.score)}</span>
        </motion.li>
      ))}
    </ol>
  );
}
