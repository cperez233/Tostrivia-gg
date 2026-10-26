/* editorial-ui · Cristian Pérez · cristianperez.me */
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BANK, videoFor, type VideoCandidate } from "../data/bank";
import { loadYouTube, type YTNamespace, type YTPlayer } from "../lib/youtube";
import { CATEGORY_BY_ID } from "../data/categories";
import type { GameClient } from "../net/client";
import type { Pick, Player, Snapshot } from "./match";
import { FX_POWERS, POWER_ICON, POWER_LINES, POWER_TEXT, VARIANT_TEXT, hasPowers, powerRules, type PowerId, type Variant } from "./powers";
import { multiplier } from "./round";
import { DEFAULT_RULES } from "./rules";
import { fmt } from "./useGame";
import MediaStage from "../components/MediaStage";
import { PosterStage, QuestionText } from "../components/Visuals";
import { Avatar } from "../components/Avatar";
import { Cover } from "../components/Cover";
import { describe } from "./mix";
import { FocusLines } from "../components/Wipe";
import RollingNumber from "../components/RollingNumber";
import Ceremony from "./Ceremony";
import { newSeed, rng, shuffle } from "../lib/rng";
import "./game.css";
import "./ceremony.css";
import { localizeQuestion, locale, t } from "../i18n";

const LETTERS = ["A", "B", "C", "D"];
const DIFF = { 1: "Fácil", 2: "Media", 3: "Difícil" } as const;

interface Props {
  client: GameClient;
  snap: Snapshot;
  at: number;
  onExit: () => void;
  /** solo: salir a Categorías (en la pestaña de lo que se jugaba) */
  onCats: (cat?: string | null) => void;
}

export default function GameScreen({ client, snap, at, onExit, onCats }: Props) {
  const q = snap.qid && BANK.byId[snap.qid] ? localizeQuestion(BANK.byId[snap.qid]) : null;
  const cat = snap.cat ? (describe(snap.cat)?.cover ?? null) : null;
  const reduce = useReducedMotion();
  const me = snap.players.find((p) => p.id === client.me.id);
  const rules = snap.rules ?? DEFAULT_RULES;
  const key = `${snap.index}:${snap.qid}`;
  const [pick, setPick] = useState<{ key: string; choice: number } | null>(null);
  const myPick = pick?.key === key ? pick.choice : null;
  const starts = useRef(new Map<string, number>());
  const [confirmExit, setConfirmExit] = useState(false);

  // momento local en que arrancó el reloj de esta pregunta
  if (snap.phase === "question" && !starts.current.has(key)) starts.current.set(key, at - (snap.duration - snap.remaining));
  const localStart = starts.current.get(key) ?? 0;
  const deadline = localStart + snap.duration;

  // modo Poderes: lo que usé en esta pregunta y lo que me echaron encima (Tinta, Susto, Revoltijo, De cabeza)
  const used = snap.used?.[client.me.id] ?? [];
  const cut = snap.phase === "question" ? used.flatMap((u) => u.cut ?? []) : [];
  const fx = snap.phase === "question" ? snap.fx?.[client.me.id] : undefined;
  const fxFrom = fx ? localStart + fx.from : 0;
  const fxUntil = fx ? localStart + fx.until : 0;
  const [tick, setTick] = useState(0);
  const now = Date.now();
  const fxOn = !!fx && now >= fxFrom && now < fxUntil;
  const fxPending = !!fx && now < fxUntil;
  useEffect(() => {
    if (!fxPending) return;
    // el Revoltijo mueve las opciones cada poco; los demás solo esperan a empezar o terminar
    const next = fxOn && fx?.p === "shuffle" ? 750 : Math.max(0, (Date.now() < fxFrom ? fxFrom : fxUntil) - Date.now()) + 30;
    const t = setTimeout(() => setTick((n) => n + 1), next);
    return () => clearTimeout(t);
  }, [fxPending, fxOn, fxFrom, fxUntil, fx?.p, tick]);
  const inked = fxOn && fx?.p === "ink";
  const shuffled = fxOn && fx?.p === "shuffle" ? shuffle([0, 1, 2, 3], rng(Math.floor(now / 750))) : null;
  // el anfitrión y los líderes que nombró pasan de pregunta
  const lead = client.isHost || !!snap.leaders?.includes(client.me.id);
  const nameOf = (pid: string) => snap.players.find((p) => p.id === pid)?.name ?? "?";

  const answer = (i: number) => {
    if (snap.phase !== "question" || myPick != null || cut.includes(i) || inked) return;
    setPick({ key, choice: i });
    client.answer(snap.index, i, Math.max(0, Date.now() - localStart));
  };

  // teclado: 1-4 / A-D para responder, Enter para seguir
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const n = "1234".indexOf(e.key) + 1 || "abcd".indexOf(e.key.toLowerCase()) + 1;
      if (n && snap.phase === "question") answer(n - 1);
      if (e.key === "Enter" && snap.phase === "reveal" && lead) client.next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // al revelar, si la correcta quedó debajo del borde (pasa en celular con video), se acerca a la vista
  useEffect(() => {
    if (snap.phase !== "reveal") return;
    const t = setTimeout(() => {
      const el = document.querySelector(".opt--correct");
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > innerHeight - 90 || r.top < 60) el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    }, 450);
    return () => clearTimeout(t);
  }, [snap.phase, key, reduce]);

  const video = q?.media ? videoFor(q.media.k) : undefined;
  // el que sonó de verdad: puede ser uno de respaldo si YouTube no dejó el principal
  const [played, setPlayed] = useState<{ key: string; v: VideoCandidate } | null>(null);
  const shown = played?.key === `${snap.index}:${snap.qid}` ? played.v : video;
  const reveal = snap.phase === "reveal" ? snap.reveal : null;
  const mine = reveal?.picks[client.me.id];
  const answeredCount = snap.answered.length;
  const online = snap.players.filter((p) => p.online);

  if (snap.phase === "final") return <FinalScreen client={client} snap={snap} onExit={onExit} onCats={onCats} />;
  if (!q || !cat) return null;

  return (
    <div className="game">
      <header className="game__top">
        <button type="button" className="game__exit" onClick={() => setConfirmExit(true)} aria-label={t("Salir de la partida")}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
          </svg>
          <span>{t("Salir")}</span>
        </button>
        <div className="game__cat">
          <span className="game__cat-img">
            <Cover cat={cat} sizes="30px" />
          </span>
          <span className="game__cat-name">{cat.name}</span>
          {hasPowers(snap.variant) && <span className="game__variant">{VARIANT_TEXT[snap.variant].name}</span>}
          {rules.mult !== 1 && (
            <span className="game__variant game__mult" aria-label={t("Puntos ×{n}", { n: rules.mult.toLocaleString(locale()) })}>
              ×{rules.mult.toLocaleString(locale())}
            </span>
          )}
        </div>
        <div className="game__right">
          <AnimatePresence>
            {me && me.streak >= 2 && (
              <motion.span
                key="streak"
                className={`game__streak ${!rules.streak ? "" : me.streak >= 5 ? "is-x2" : me.streak >= 3 ? "is-x15" : ""}`}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={{ type: "spring", stiffness: 600, damping: 20 }}
                aria-label={t("Racha de {n}", { n: me.streak })}
              >
                <Flame />
                {me.streak}
              </motion.span>
            )}
          </AnimatePresence>
          <div className="game__score" aria-label={t("Puntaje {n}", { n: me?.score ?? 0 })}>
            <RollingNumber value={me?.score ?? 0} />
            <span className="game__score-unit">{t("pts")}</span>
          </div>
        </div>
      </header>

      <Progress snap={snap} me={client.me.id} />
      {snap.mode === "group" && <Strip snap={snap} me={client.me.id} />}

      <Timer key={key} running={snap.phase === "question"} done={snap.phase === "reveal"} deadline={deadline} duration={snap.duration} />

      <AnimatePresence>
        {snap.notice && (
          <motion.p className="game__notice" role="status" initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
            {t(snap.notice)}
          </motion.p>
        )}
      </AnimatePresence>

      <main className={`game__body ${q.media || q.visual?.v === "poster" ? "has-media" : ""} ${fxOn && fx ? `fx-${fx.p}` : ""}`}>
        <section className="game__main">
          <AnimatePresence mode="wait">
            <motion.div
              key={key}
              className="qpanel"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: 90, rotate: 3, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, rotate: -0.5, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: -90, rotate: -3, transition: { duration: 0.22 } }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
            >
              <div className="qpanel__meta">
                <span className="qpanel__n">
                  {t("Pregunta {n}", { n: snap.index + 1 })}
                  <span className="qpanel__of"> {t("de {n}", { n: snap.ids.length })}</span>
                </span>
                <span className="qpanel__diff" aria-label={t("Dificultad {d}", { d: t(DIFF[q.d]) })}>
                  {[1, 2, 3].map((d) => (
                    <i key={d} className={d <= q.d ? "on" : ""} />
                  ))}
                  {t(DIFF[q.d])}
                </span>
                {q.cat !== snap.cat && CATEGORY_BY_ID[q.cat] && (
                  // en las mezclas: de qué obra sale esta pregunta, bien visible
                  <span className="qpanel__from">
                    <span className="qpanel__from-k">{t("Pregunta de")}</span>
                    <b className="qpanel__from-v">{CATEGORY_BY_ID[q.cat].name}</b>
                  </span>
                )}
              </div>
              <QuestionText q={q.q} visual={q.visual} />
              {q.visual?.v === "poster" && (
                <PosterStage key={`poster-${key}`} id={q.visual.id} fx={q.visual.fx} startAt={snap.phase === "question" ? localStart : 0} duration={snap.duration} revealed={snap.phase === "reveal"} qkey={q.id} />
              )}

              {q.media && video && (
                <MediaStage
                  key={key}
                  media={q.media}
                  videos={[video, ...(video.alt ?? [])]}
                  onVideo={(v) => setPlayed({ key, v })}
                  revealed={snap.phase === "reveal"}
                  seconds={snap.duration / 1000}
                  onPlaying={() => client.media(snap.index, "playing")}
                  onError={() => client.media(snap.index, "error")}
                />
              )}
              {q.media && snap.phase === "reveal" && shown && (
                <p className="qpanel__source">
                  {t("Sonó:")} <b>{shown.title}</b> <span className="muted">· {shown.channel}</span>
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="opts-wrap">
            <ol className="opts" aria-label={t("Opciones")}>
              {snap.order.map((orig, i) => {
                const isCorrect = reveal && reveal.correct === i;
                const isMine = myPick === i || (mine && mine.choice === i);
                const isCut = cut.includes(i);
                const state = reveal ? (isCorrect ? "correct" : isMine ? "wrong" : "dim") : isMine ? "picked" : isCut ? "cut" : "idle";
                const who = reveal ? online.filter((p) => reveal.picks[p.id]?.choice === i && p.id !== client.me.id) : [];
                return (
                  <li key={`${key}-${i}`} style={shuffled ? { order: shuffled[i] } : undefined}>
                    <motion.button
                      type="button"
                      className={`opt opt--${state}`}
                      onClick={() => answer(i)}
                      disabled={snap.phase !== "question" || myPick != null || isCut || inked}
                      aria-pressed={isMine || undefined}
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, rotate: i % 2 ? 1.5 : -1.5 }}
                      animate={
                        state === "wrong" && !reduce
                          ? { opacity: 1, y: 0, rotate: 0, x: [0, -12, 10, -7, 5, 0] }
                          : state === "correct" && !reduce
                            ? { opacity: 1, y: 0, rotate: 0, scale: [1, 1.05, 1] }
                            : { opacity: 1, y: 0, rotate: 0 }
                      }
                      transition={state === "wrong" || state === "correct" ? { duration: 0.42 } : { delay: 0.12 + 0.06 * i, type: "spring", stiffness: 420, damping: 26 }}
                      whileTap={snap.phase === "question" && myPick == null ? { scale: 0.96 } : undefined}
                    >
                      <span className="opt__letter" aria-hidden>
                        {LETTERS[i]}
                      </span>
                      <span className="opt__text">{fxOn && fx?.p === "scramble" && !reveal ? jumble(q.o[orig]) : q.o[orig]}</span>
                      {state === "correct" && <Stamp ok />}
                      {state === "wrong" && <Stamp />}
                      {who.length > 0 && (
                        <span className="opt__who" aria-label={t("Eligieron: {list}", { list: who.map((p) => p.name).join(", ") })}>
                          {who.slice(0, 5).map((p) => (
                            <Avatar key={p.id} animal={p.seal} size={26} />
                          ))}
                          {who.length > 5 && <span>+{who.length - 5}</span>}
                        </span>
                      )}
                    </motion.button>
                  </li>
                );
              })}
            </ol>
            <AnimatePresence>
              {inked && fx && (
                <motion.div key="ink" className="ink" role="status" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <span className="ink__text">
                    {POWER_ICON.ink} {POWER_LINES.inked(nameOf(fx.by))}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {hasPowers(snap.variant) && me && snap.phase !== "reveal" && (
            <PowerBar
              variant={snap.variant}
              hand={me.powers ?? []}
              used={used.map((u) => u.p)}
              closed={snap.phase !== "question" || myPick != null}
              left={powerRules(snap.variant).uses - used.length}
              // los de pantalla solo le llegan a quien sigue sin responder (y sin Escudo ni Estrella)
              noTarget={!online.some((p) => p.id !== client.me.id && !snap.answered.includes(p.id) && !snap.used?.[p.id]?.some((u) => u.p === "shield" || u.p === "star"))}
              onUse={(p) => client.power(snap.index, p)}
            />
          )}

          <div className="game__status" aria-live="polite">
            {fxOn && fx && fx.p !== "ink" && fx.p !== "scare" && (
              <p className="game__fx">
                {POWER_ICON[fx.p]} {POWER_LINES.fx(fx.p, nameOf(fx.by))}
              </p>
            )}
            {snap.phase === "loading" && q.media && (
              <p>{snap.mode === "group" ? t("Preparando el video en todos los celulares ({a}/{b})…", { a: snap.mediaReady.length, b: online.length }) : t("Preparando el video…")}</p>
            )}
            {snap.phase === "question" && myPick != null && snap.mode === "group" && (
              <p>
                {t("Respondiste. Faltan {a} de {b}.", { a: Math.max(0, online.length - answeredCount), b: online.length })}
              </p>
            )}
          </div>

          <AnimatePresence>{reveal && mine && <Verdict key={key} pick={mine} notes={powerNotes(mine, client.me.id, nameOf, reveal.picks)} streakOn={rules.streak} />}</AnimatePresence>

          {reveal && (
            <div className="game__next">
              {lead ? (
                <button type="button" className="btn btn--hanko" onClick={() => client.next()} autoFocus>
                  {snap.index + 1 >= snap.ids.length ? t("Ver resultado") : t("Siguiente pregunta")}
                  <Arrow />
                </button>
              ) : (
                <p className="muted">{t("El anfitrión pasa a la siguiente en unos segundos…")}</p>
              )}
            </div>
          )}
        </section>

        {snap.mode === "group" && <Board snap={snap} me={client.me.id} />}
      </main>

      <AnimatePresence>
        {reveal && mine?.ok && !reduce && (
          <motion.div key={`flash-${key}`} className="game__flash" aria-hidden initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.32, ease: "easeIn" }}>
            <FocusLines className="game__flash-lines" />
          </motion.div>
        )}
        {reveal && mine?.ok && rules.streak && (mine.streak === 3 || mine.streak === 5 || mine.streak === 8 || mine.streak === 10) && (
          <StreakBanner key={`streak-${key}`} streak={mine.streak} />
        )}
      </AnimatePresence>

      {/* con screamer se monta antes, escondido, para que el video ya esté cargado cuando toque */}
      {fxPending && fx?.p === "scare" && fx.clip ? (
        <ScareClip key={`clip-${key}`} clip={fx.clip} at={fxFrom} until={fxUntil} who={nameOf(fx.by)} />
      ) : (
        <AnimatePresence>{fxOn && fx?.p === "scare" && <Scare key={`scare-${key}`} who={nameOf(fx.by)} />}</AnimatePresence>
      )}
      {fxOn && fx?.p === "dark" && <Blackout />}
      {fxOn && fx?.p === "party" && <Party key={`party-${key}`} />}

      <AnimatePresence>
        {confirmExit && (
          <motion.div className="dialog" role="dialog" aria-modal="true" aria-labelledby="exit-t" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="dialog__card panel" initial={{ y: 30, rotate: -1 }} animate={{ y: 0, rotate: 0 }}>
              <h2 id="exit-t">{t("¿Salir de la partida?")}</h2>
              <p>{client.isHost && snap.mode === "group" ? t("Eres el anfitrión: si sales, la sala se cierra para todos.") : t("Se pierde el puntaje de esta ronda.")}</p>
              <div className="dialog__actions">
                <button type="button" className="btn" onClick={() => setConfirmExit(false)} autoFocus>
                  {t("Seguir jugando")}
                </button>
                {snap.mode === "solo" && (
                  <button type="button" className="btn" onClick={() => onCats(snap.cat)}>
                    {t("Ir a categorías")}
                  </button>
                )}
                <button type="button" className="btn" onClick={onExit}>
                  {t("Salir")}
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
      aria-label={ok ? t("Correcta") : t("Tu respuesta, incorrecta")}
    >
      {ok ? t("Correcta") : "✕"}
    </motion.span>
  );
}

function Flame() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden>
      <path d="M8 1c1 3.4 5.6 5 5.6 10A5.6 5.6 0 0 1 2.4 11c0-2.4 1.2-3.8 2.4-4.8.2 1.6.9 2.6 1.8 3C6.4 6 7 3.4 8 1z" fill="currentColor" stroke="var(--ink)" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

/** Trabalenguas: cada palabra con sus letras revueltas (siempre igual para la misma palabra) */
function jumble(text: string) {
  return text.replace(/\p{L}{3,}/gu, (w) => {
    let h = 0;
    for (const ch of w) h = Math.imul(h ^ ch.codePointAt(0)!, 2654435761) >>> 0;
    const out = shuffle([...w], rng(h || 1)).join("");
    return out === w ? [...w].reverse().join("") : out;
  });
}

/** Fiesta: lluvia de confeti y globos con corneta */
const PARTY = Array.from({ length: 36 }, (_, i) => ({
  e: ["🎉", "🎊", "🎈", "🥳", "🪅", "🎂"][i % 6],
  x: (i * 29) % 100,
  d: 1.6 + ((i * 7) % 10) / 6,
  delay: ((i * 13) % 20) / 10,
  s: 28 + ((i * 11) % 36),
}));
function Party() {
  useEffect(() => {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const t = ctx.currentTime;
      for (const [i, f] of [440, 554, 660].entries()) {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "square";
        o.frequency.setValueAtTime(f, t + i * 0.18);
        o.frequency.linearRampToValueAtTime(f * 1.06, t + i * 0.18 + 0.15);
        g.gain.setValueAtTime(0.0001, t + i * 0.18);
        g.gain.exponentialRampToValueAtTime(0.12, t + i * 0.18 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.18 + 0.3);
        o.connect(g).connect(ctx.destination);
        o.start(t + i * 0.18);
        o.stop(t + i * 0.18 + 0.32);
      }
      setTimeout(() => ctx.close(), 1200);
    } catch {
      /* sin audio */
    }
  }, []);
  return (
    <div className="party" aria-hidden>
      {PARTY.map((p, i) => (
        <span key={i} style={{ left: `${p.x}%`, fontSize: p.s, animationDuration: `${p.d}s`, animationDelay: `${p.delay}s` }}>
          {p.e}
        </span>
      ))}
    </div>
  );
}

/** Apagón: todo negro menos el círculo de la linterna, que sigue al dedo o al mouse */
function Blackout() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      ref.current?.style.setProperty("--x", `${e.clientX}px`);
      ref.current?.style.setProperty("--y", `${e.clientY}px`);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", move);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
    };
  }, []);
  return <div ref={ref} className="blackout" aria-hidden />;
}

/**
 * Susto con screamer: el video de YouTube se carga escondido apenas llega el poder y salta a pantalla completa
 * con sonido en el momento `at`. Si no alcanzó a cargar o YouTube falla, sale el susto propio.
 */
function ScareClip({ clip, at, until, who }: { clip: string; at: number; until: number; who: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<"wait" | "show" | "fallback" | "done">("wait");
  const player = useRef<YTPlayer | null>(null);
  const ready = useRef(false);
  useEffect(() => {
    const v = videoFor(clip);
    const ids = v ? [v.id, ...(v.alt ?? []).map((a) => a.id)] : [];
    let dead = false;
    let attempt = 0;
    const mount = (YT: YTNamespace) => {
      if (dead || !host.current || attempt >= ids.length) return;
      host.current.innerHTML = "";
      const el = document.createElement("div");
      host.current.appendChild(el);
      player.current = new YT.Player(el, {
        videoId: ids[attempt],
        width: "100%",
        height: "100%",
        playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, modestbranding: 1, playsinline: 1, rel: 0, origin: window.location.origin },
        events: {
          onReady: () => {
            ready.current = true;
          },
          onError: () => {
            ready.current = false;
            attempt++;
            mount(YT);
          },
        },
      });
    };
    if (ids.length) loadYouTube().then(mount, () => undefined);
    const go = setTimeout(() => {
      if (dead) return;
      const p = player.current;
      if (!ready.current || !p) return setStage("fallback");
      try {
        p.unMute();
        p.setVolume(100);
        p.seekTo(0, true);
        p.playVideo();
        setStage("show");
      } catch {
        setStage("fallback");
      }
    }, Math.max(0, at - Date.now()));
    const end = setTimeout(() => setStage("done"), Math.max(0, until - Date.now()));
    return () => {
      dead = true;
      clearTimeout(go);
      clearTimeout(end);
      try {
        player.current?.destroy();
      } catch {
        /* ya no existe */
      }
    };
  }, [clip, at, until]);
  return (
    <>
      <div className={`scare-clip ${stage === "show" ? "is-on" : ""}`} aria-hidden={stage !== "show"}>
        <div ref={host} className="scare-clip__video" />
        {stage === "show" && <span className="scare__who scare-clip__who">{POWER_LINES.scare(who)}</span>}
      </div>
      <AnimatePresence>{stage === "fallback" && <Scare key="fallback" who={who} />}</AnimatePresence>
    </>
  );
}

/** Susto: la pantalla se va a negro, sale la cara y suena un chillido corto */
function Scare({ who }: { who: string }) {
  const reduce = useReducedMotion();
  useEffect(() => {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const t = ctx.currentTime;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.35, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      gain.connect(ctx.destination);
      for (const [type, f0, f1] of [["sawtooth", 180, 1400], ["square", 230, 1100]] as const) {
        const o = ctx.createOscillator();
        o.type = type;
        o.frequency.setValueAtTime(f0, t);
        o.frequency.exponentialRampToValueAtTime(f1, t + 0.25);
        o.frequency.exponentialRampToValueAtTime(f0 * 2, t + 0.9);
        o.connect(gain);
        o.start(t);
        o.stop(t + 0.95);
      }
      setTimeout(() => ctx.close(), 1200);
    } catch {
      /* sin audio: queda el susto visual */
    }
    navigator.vibrate?.([120, 60, 220]);
  }, []);
  return (
    <motion.div className="scare" role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.25 } }} transition={{ duration: 0.04 }}>
      <motion.span
        className="scare__face"
        aria-hidden
        initial={{ scale: 0.3 }}
        animate={reduce ? { scale: 1 } : { scale: [0.3, 1.25, 1.1], x: [0, -18, 14, -10, 8, 0], rotate: [0, -6, 5, -3, 0] }}
        transition={{ duration: 0.45 }}
      >
        👹
      </motion.span>
      <span className="scare__word">¡BU!</span>
      <span className="scare__who">{POWER_LINES.scare(who)}</span>
    </motion.div>
  );
}

/** modo Poderes: barra con los poderes en la mano; se usan antes de responder (uno por pregunta, dos en Ultra Locura) */
function PowerBar({
  variant,
  hand,
  used,
  closed,
  left,
  noTarget,
  onUse,
}: {
  variant: Variant;
  hand: PowerId[];
  used: PowerId[];
  closed: boolean;
  /** cuántos más puede tirar en esta pregunta */
  left: number;
  noTarget: boolean;
  onUse: (p: PowerId) => void;
}) {
  const spent = left <= 0;
  return (
    <section className="powers" aria-label={POWER_LINES.label}>
      <p className="powers__label">
        <span aria-hidden>⚡</span> {used.length ? POWER_LINES.used(used.map((p) => POWER_TEXT[p].name).join(" + ")) : POWER_LINES.label}
        {used.length > 0 && !spent && !closed && hand.length > 0 && <span className="powers__more"> {POWER_LINES.more(left)}</span>}
      </p>
      {hand.length === 0 && !used.length && <p className="powers__empty">{POWER_LINES.empty(variant)}</p>}
      <ul className="powers__hand">
        {hand.map((p, i) => {
          // el Bloque ? se puede abrir aunque ya hayas usado otro
          const idle = noTarget && (FX_POWERS as PowerId[]).includes(p);
          const disabled = closed || (p !== "mystery" && (spent || used.includes(p))) || idle;
          return (
            <li key={`${p}-${i}`}>
              <motion.button
                type="button"
                className="power"
                onClick={() => onUse(p)}
                disabled={disabled}
                title={idle ? POWER_LINES.noTarget : POWER_TEXT[p].desc}
                aria-label={`${POWER_TEXT[p].name}: ${POWER_TEXT[p].desc}`}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileTap={disabled ? undefined : { scale: 0.92 }}
                transition={{ type: "spring", stiffness: 520, damping: 22 }}
              >
                <span className="power__icon" aria-hidden>
                  {POWER_ICON[p]}
                </span>
                <span className="power__name">{POWER_TEXT[p].name}</span>
                <span className="power__desc">{POWER_TEXT[p].desc}</span>
              </motion.button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** lo que pasó con los poderes en esta pregunta, en frases cortas para el veredicto */
/** ataques que se cobran al revelar: pueden no hacer nada (el otro tenía 0, nadie respondió después del Plátano…) */
const POINT_ATTACKS: PowerId[] = ["steal", "redShell", "blueShell", "lightning", "banana", "swapScore"];

function powerNotes(pick: Pick, me: string, nameOf: (pid: string) => string, picks: Record<string, Pick>): string[] {
  const out: string[] = [];
  for (const b of pick.boosts ?? []) {
    if (b.p === "double" && b.pts) out.push(pick.ok ? POWER_LINES.doubled : POWER_LINES.doubleLost);
    if (b.p === "dice" && b.roll) out.push(`${POWER_ICON.dice} ${POWER_LINES.dice(b.roll, b.pts)}`);
    if (b.p === "mushroom" && b.pts) out.push(`${POWER_ICON.mushroom} ${POWER_LINES.mushroom(b.pts)}`);
    if (b.p === "star" && b.pts) out.push(`${POWER_ICON.star} ${POWER_LINES.star}`);
  }
  if (pick.shielded) out.push(POWER_LINES.shielded);
  for (const d of pick.dealt ?? []) out.push(d.p === "swapScore" ? POWER_LINES.swappedUp(nameOf(d.to), d.pts) : POWER_LINES.dealt(d.p, nameOf(d.to), d.pts));
  for (const h of pick.hits ?? [])
    out.push(h.p === "swapScore" ? POWER_LINES.swappedDown(nameOf(h.by), h.pts) : h.by === me ? POWER_LINES.selfHit(h.p, h.pts) : POWER_LINES.hit(h.p, nameOf(h.by), h.pts));
  for (const b of pick.blocked ?? []) out.push(POWER_LINES.blocked(b.p, nameOf(b.by), b.with));
  // el Robo solo se intenta si aciertas; los demás siempre
  for (const p of pick.powers ?? []) {
    if (!POINT_ATTACKS.includes(p) || (p === "steal" && !pick.ok)) continue;
    const landed = pick.dealt?.some((d) => d.p === p) || pick.hits?.some((h) => h.by === me && h.p === p) || Object.values(picks).some((x) => x.blocked?.some((b) => b.by === me && b.p === p));
    if (!landed) out.push(POWER_LINES.missed(p));
  }
  if (pick.earned) out.push(`${POWER_ICON[pick.earned]} ${(pick.consolation ? POWER_LINES.consolation : POWER_LINES.earned)(POWER_TEXT[pick.earned].name)}`);
  return out;
}

/** veredicto: la onomatopeya entra de golpe sobre líneas de concentración */
function Verdict({ pick, notes = [], streakOn = true }: { pick: Pick; notes?: string[]; streakOn?: boolean }) {
  const reduce = useReducedMotion();
  const word = t(pick.ok ? "¡Bien!" : pick.choice == null ? (pick.excused ? "Sin video" : "¡Tiempo!") : "¡Fallaste!");
  const sub = pick.ok
    ? t("+{n} puntos", { n: fmt(pick.gained) }) + (pick.streak >= 2 && streakOn ? ` · ${t("racha de {n}", { n: pick.streak })} (×${multiplier(pick.streak).toLocaleString(locale())})` : "")
    : pick.excused
      ? t("El video no cargó en tu celular: tu racha se mantiene.")
      : pick.shielded || !streakOn
        ? pick.choice == null
          ? t("No respondiste a tiempo.")
          : t("Esta no era.")
        : pick.choice == null
          ? t("No respondiste a tiempo. La racha vuelve a cero.")
          : t("La racha vuelve a cero.");
  return (
    <motion.div
      className={`verdict ${pick.ok ? "is-ok" : "is-bad"}`}
      initial={reduce ? { opacity: 0 } : { scale: 1.6, rotate: -10, opacity: 0 }}
      animate={{ scale: 1, rotate: -2.5, opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 520, damping: 17 }}
      role="status"
    >
      <FocusLines className="verdict__lines" />
      <span className="verdict__word">{word}</span>
      <span className="verdict__sub">{sub}</span>
      {notes.slice(0, 4).map((n) => (
        <span key={n} className="verdict__power">
          {n}
        </span>
      ))}
    </motion.div>
  );
}

/** cuando la racha sube el multiplicador, una franja cruza la pantalla */
function StreakBanner({ streak }: { streak: number }) {
  const reduce = useReducedMotion();
  const text = t(streak >= 10 ? "¡Diez seguidas!" : streak >= 8 ? "¡Racha ×3!" : streak >= 5 ? "¡Racha ×2!" : "¡Racha ×1,5!");
  if (reduce) return null;
  return (
    <motion.div
      className="streakband"
      aria-hidden
      initial={{ x: "110%", rotate: -6 }}
      animate={{ x: ["110%", "0%", "0%", "-110%"] }}
      transition={{ duration: 1.5, times: [0, 0.22, 0.75, 1], ease: [0.76, 0, 0.24, 1] }}
    >
      <span>{text}</span>
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
    <div className={`timer ${urgent ? "is-urgent" : ""} ${done ? "is-done" : ""} ${!running && !done ? "is-waiting" : ""}`} role="timer" aria-label={t("{n} segundos", { n: secs })}>
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
    <ol className={`progress ${snap.ids.length > 15 ? "progress--long" : ""}`} aria-label={t("Pregunta {a} de {b}", { a: snap.index + 1, b: snap.ids.length })}>
      {snap.ids.map((_, i) => (
        <li key={i} className={`${hist.current[i] ?? ""} ${i === snap.index ? "is-now" : ""}`} />
      ))}
    </ol>
  );
}

/** marcador en vivo para celular: una franja arriba, con el puesto, los puntos y quién ya respondió */
function Strip({ snap, me }: { snap: Snapshot; me: string }) {
  const sorted = useMemo(() => [...snap.players].filter((p) => p.online || p.score > 0).sort((a, b) => b.score - a.score), [snap.players]);
  return (
    <ol className="strip" aria-label={t("Marcador en vivo")}>
      {sorted.map((p, i) => {
        const pick = snap.phase === "reveal" ? snap.reveal?.picks[p.id] : undefined;
        const done = snap.phase === "question" && snap.answered.includes(p.id);
        return (
          <motion.li layout key={p.id} className={`strip__p ${p.id === me ? "is-me" : ""} ${done ? "is-done" : ""}`} transition={{ type: "spring", stiffness: 400, damping: 34 }}>
            <span className="strip__rank">{i + 1}</span>
            <span className="strip__face">
              <Avatar animal={p.seal} size={26} />
              {done && (
                <span className="strip__check" aria-label={t("Respondió")}>
                  ✓
                </span>
              )}
            </span>
            <span className="strip__name">{p.id === me ? t("Tú") : p.name}</span>
            <span className="strip__pts">
              {fmt(p.score)}
              {pick && <span className={`strip__delta ${pick.gained > 0 ? "is-ok" : ""}`}>{signed(pick.gained)}</span>}
            </span>
          </motion.li>
        );
      })}
    </ol>
  );
}

/** +150, −100 o 0: en modo Poderes también se pueden perder puntos */
const signed = (n: number) => (n > 0 ? `+${fmt(n)}` : n < 0 ? `−${fmt(-n)}` : "0");

function Board({ snap, me }: { snap: Snapshot; me: string }) {
  const sorted = useMemo(() => [...snap.players].sort((a, b) => b.score - a.score), [snap.players]);
  return (
    <aside className="board" aria-label={t("Marcador")}>
      <p className="label">{t("Marcador")}</p>
      <ol>
        {sorted.map((p, i) => (
          <motion.li layout key={p.id} className={`${p.id === me ? "is-me" : ""} ${p.online ? "" : "is-off"}`} transition={{ type: "spring", stiffness: 400, damping: 34 }}>
            <span className="board__rank">{i + 1}</span>
            <Avatar animal={p.seal} size={34} />
            <span className="board__name">{p.name}</span>
            {snap.phase === "question" && snap.answered.includes(p.id) && <span className="board__done" aria-label={t("Respondió")}>✓</span>}
            {snap.phase === "reveal" && snap.reveal?.picks[p.id] && (
              <span className={`board__delta ${snap.reveal.picks[p.id].gained > 0 ? "is-ok" : ""}`}>{signed(snap.reveal.picks[p.id].gained)}</span>
            )}
            <span className="board__pts">{fmt(p.score)}</span>
          </motion.li>
        ))}
      </ol>
    </aside>
  );
}

// nota por porcentaje de aciertos; con 10 preguntas: 10 S+, 9 S, 8 A, 6-7 B, 5 C, 3-4 D, 0-2 F
const GRADES: [number, string][] = [
  [100, "S+"],
  [90, "S"],
  [75, "A"],
  [60, "B"],
  [45, "C"],
  [30, "D"],
  [0, "F"],
];

function FinalScreen({ client, snap, onExit, onCats }: { client: GameClient; snap: Snapshot; onExit: () => void; onCats: (cat?: string | null) => void }) {
  const me = snap.players.find((p) => p.id === client.me.id);
  const sorted = [...snap.players].sort((a, b) => b.score - a.score);
  const total = snap.ids.length;
  const correct = me?.correct ?? 0;
  const pct = total ? (correct / total) * 100 : 0;
  const grade = GRADES.find(([min]) => pct >= min)![1];
  const cat = snap.cat ? (describe(snap.cat)?.cover ?? null) : null;
  const place = sorted.findIndex((p) => p.id === client.me.id) + 1;
  const [copied, setCopied] = useState(false);
  // en grupo primero va el podio animado; desde ahí se puede ver el detalle de cada uno
  const [details, setDetails] = useState(snap.mode !== "group");
  const again = () => client.start(newSeed());
  const groupActions = client.isHost || snap.leaders?.includes(client.me.id) ? (
    <>
      <button type="button" className="btn btn--hanko" onClick={again}>
        {t("Otra ronda")}
      </button>
      <button type="button" className="btn" onClick={() => client.backToLobby()}>
        {t("Cambiar categoría")}
      </button>
    </>
  ) : (
    <p className="final__wait">{t("Esperando a que el anfitrión arranque otra…")}</p>
  );

  const share = async () => {
    const text = t("Hice {pts} puntos en {cat} en Tostrivia ({ok}/{total}, mejor racha {best}). ¿Me ganas?", { pts: fmt(me?.score ?? 0), cat: cat?.name ?? "", ok: correct, total, best: me?.best ?? 0 });
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

  if (!details) return <Ceremony players={sorted} me={client.me.id} actions={groupActions} onDetails={() => setDetails(true)} />;

  return (
    <div className="final">
      {cat && (
        <span className="final__bg" aria-hidden>
          <Cover cat={cat} sizes="70vw" />
        </span>
      )}
      <FocusLines className="final__lines anim-spin" />
      {pct >= 60 && <Shards />}
      <motion.div className="final__inner wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <p className="final__eyebrow">{t("Fin de la ronda")} · {cat?.name}</p>
        <div className="final__hero">
          <motion.div
            className="final__seal"
            initial={{ scale: 2.4, rotate: -25, opacity: 0 }}
            animate={{ scale: 1, rotate: -9, opacity: 1 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 380, damping: 15 }}
          >
            <span className="final__grade" aria-label={t("Nota {g}", { g: grade })}>
              {grade}
            </span>
          </motion.div>
          <div>
            <p className="final__score">
              <RollingNumber value={me?.score ?? 0} />
              <span>{t("puntos")}</span>
            </p>
          </div>
        </div>

        <dl className="final__stats">
          <div>
            <dt>{t("Aciertos")}</dt>
            <dd>
              {correct}/{total}
            </dd>
          </div>
          <div>
            <dt>{t("Mejor racha")}</dt>
            <dd>{me?.best ?? 0}</dd>
          </div>
          {snap.mode === "group" && (
            <div>
              <dt>{t("Puesto")}</dt>
              <dd>
                {t("{a} de {b}", { a: place, b: sorted.length })}
              </dd>
            </div>
          )}
          {snap.replaced > 0 && (
            <div>
              <dt>{t("Preguntas cambiadas")}</dt>
              <dd>{snap.replaced}</dd>
            </div>
          )}
        </dl>

        {snap.mode === "group" && <Podium players={sorted} me={client.me.id} />}

        <div className="final__actions">
          {client.isHost && snap.mode === "solo" && (
            <button type="button" className="btn btn--hanko" onClick={again}>
              {t("Otra ronda")}
            </button>
          )}
          {snap.mode === "group" && groupActions}
          {snap.mode === "group" && (
            <button type="button" className="btn btn--ghost" onClick={() => setDetails(false)}>
              {t("Ver el podio")}
            </button>
          )}
          {snap.mode === "solo" && (
            <button type="button" className="btn" onClick={() => onCats(snap.cat)}>
              {t("Volver a categorías")}
            </button>
          )}
          <button type="button" className="btn" onClick={share}>
            {copied ? t("Copiado") : t("Compartir resultado")}
          </button>
          <button type="button" className="link final__home" onClick={onExit}>
            {snap.mode === "group" ? t("Salir de la sala") : t("Volver a la ruleta")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/** papelitos de tinta que caen una vez cuando la ronda salió bien (fijos, sin azar) */
const SHARDS = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 37) % 100,
  d: 1.6 + ((i * 13) % 10) / 10,
  delay: ((i * 7) % 10) / 14,
  r: ((i * 53) % 360) - 180,
  c: ["var(--hanko)", "var(--signal)", "var(--paper)"][i % 3],
  w: 10 + ((i * 5) % 12),
}));
function Shards() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div className="shards" aria-hidden>
      {SHARDS.map((p, i) => (
        <motion.span
          key={i}
          style={{ left: `${p.x}%`, width: p.w, height: p.w * 0.6, background: p.c }}
          initial={{ y: -40, rotate: 0, opacity: 1 }}
          animate={{ y: "105vh", rotate: p.r * 3, opacity: [1, 1, 0] }}
          transition={{ duration: p.d + 1, delay: 0.5 + p.delay, ease: [0.3, 0.1, 0.6, 1] }}
        />
      ))}
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
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.7 + i * 0.09, type: "spring", stiffness: 420, damping: 20 }}
        >
          <span className="podium__n">{i + 1}</span>
          <span className="podium__face">
            <Avatar animal={p.seal} size={i === 0 ? 56 : 44} />
          </span>
          <span className="podium__name">{p.name}</span>
          <span className="podium__meta">
            {p.correct} {p.correct === 1 ? t("acierto") : t("aciertos")} · {t("racha")} {p.best}
          </span>
          <span className="podium__pts">{fmt(p.score)}</span>
        </motion.li>
      ))}
    </ol>
  );
}
