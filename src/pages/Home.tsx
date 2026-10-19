/* editorial-ui · Cristian Pérez · cristianperez.me
 * La ruleta: el filtro arma el mazo, la rueda gira y la categoría que cae entra de golpe.
 */
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useAnimate, useReducedMotion } from "framer-motion";
import { CATEGORY_BY_ID, FAMILY_BY_ID } from "../data/categories";
import type { Spin } from "../game/match";
import { FILTERS, makeDeck, makeSpin, type Filter } from "../game/deck";
import Wheel from "../components/Wheel";
import { Cover } from "../components/Cover";
import { FocusLines } from "../components/Wipe";
import { newSeed } from "../lib/rng";
import { usePauseOffscreen } from "../lib/usePauseOffscreen";
import "./home.css";

interface Props {
  onPlay: (cat: string) => void;
}

const SFX = ["ドン", "ドドド", "バン", "ゴゴゴ"];

export default function Home({ onPlay }: Props) {
  const reduce = useReducedMotion();
  const arena = usePauseOffscreen<HTMLElement>();
  const [filter, setFilter] = useState<Filter>("todo");
  const [seed, setSeed] = useState(() => newSeed());
  const deck = useMemo(() => makeDeck(filter, seed), [filter, seed]);
  const [spin, setSpin] = useState<Spin | null>(null);
  const [landed, setLanded] = useState<Spin | null>(null);
  const [hits, setHits] = useState(0);
  const spinning = !!spin && landed?.nonce !== spin.nonce;
  const [scope, shake] = useAnimate();

  const doSpin = () => {
    if (spinning) return;
    setLanded(null);
    setSpin(makeSpin(deck));
  };
  const pick = (f: Filter) => {
    if (spinning) return;
    setSpin(null);
    setLanded(null);
    if (f === filter) setSeed(newSeed());
    setFilter(f);
  };
  const reshuffle = () => {
    if (spinning) return;
    setSpin(null);
    setLanded(null);
    setSeed(newSeed());
  };
  const onLanded = (s: Spin) => {
    setLanded(s);
    setHits((h) => h + 1);
    if (!reduce && scope.current) shake(scope.current, { x: [0, -10, 9, -6, 4, 0], y: [0, 6, -5, 3, -1, 0] }, { duration: 0.38, ease: "easeOut" });
  };

  const cat = landed ? CATEGORY_BY_ID[landed.cat] : null;

  return (
    <main ref={arena} className="arena" id="inicio">
      <FocusLines className={`arena__lines anim-spin ${spinning ? "is-fast" : ""}`} />

      {/* el golpe: un cuadro invertido y la pantalla tiembla, como en el anime */}
      <AnimatePresence>
        {hits > 0 && !reduce && landed && (
          <motion.div key={hits} className="impact" aria-hidden initial={{ opacity: 1 }} animate={{ opacity: [1, 1, 0] }} transition={{ duration: 0.34, times: [0, 0.4, 1] }}>
            <FocusLines className="impact__lines" />
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={scope} className="arena__in wrap">
        <div className="arena__head">
          <h1 className="arena__title">
            {["Gira", "la ruleta."].map((w, i) => (
              <span className="arena__line" key={w}>
                <motion.span
                  initial={reduce ? false : { y: "110%", rotate: 4 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ delay: 0.1 + i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>
          <p className="arena__sub">Diez preguntas, veinte segundos cada una.</p>

          <div className="filters" role="radiogroup" aria-label="Qué entra en la ruleta">
            {FILTERS.map((f) => (
              <button key={f.id} type="button" role="radio" aria-checked={filter === f.id} className={`filter ${filter === f.id ? "is-on" : ""}`} onClick={() => pick(f.id)} disabled={spinning && filter !== f.id}>
                {filter === f.id && <motion.span layoutId="filter-pill" className="filter__pill" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
                <span className="filter__label">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="arena__wheel">
          <Wheel deck={deck} spin={spin} canSpin onRequest={doSpin} onLanded={onLanded} />
          {filter !== "cultura" && (
            <button type="button" className="reshuffle" onClick={reshuffle} disabled={spinning} aria-label="Poner otras categorías en la rueda">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <path d="M3 7h4c4 0 6 10 10 10h4M3 17h4c1.6 0 2.8-1.6 4-3.6M13 9.6C14.2 7.6 15.4 7 17 7h4M18 4l3 3-3 3M18 14l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Otras
            </button>
          )}
          <AnimatePresence>
            {landed && cat && !reduce && (
              <motion.span
                key={`sfx-${hits}`}
                className="arena__sfx sfx"
                aria-hidden
                initial={{ scale: 2.2, opacity: 0, rotate: -18 }}
                animate={{ scale: 1, opacity: 1, rotate: -10 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 520, damping: 14 }}
              >
                {cat.sfx && cat.sfx !== "♪" ? cat.sfx : SFX[hits % SFX.length]}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="arena__side" aria-live="polite">
          <AnimatePresence mode="wait">
            {cat && landed ? (
              <Result key={`r-${landed.nonce}`} cat={cat.id} onPlay={() => onPlay(cat.id)} onAgain={doSpin} onClose={() => setLanded(null)} />
            ) : (
              <Deal key={`d-${deck.join()}`} deck={deck} spinning={spinning} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

/** antes de girar: tres portadas del mazo, tiradas sobre la mesa */
function Deal({ deck, spinning }: { deck: string[]; spinning: boolean }) {
  const reduce = useReducedMotion();
  const three = deck.filter((d, i) => deck.indexOf(d) === i).slice(0, 3);
  const pose = [
    { r: -7, x: 0, y: 0 },
    { r: 5, x: 78, y: 22 },
    { r: -2, x: 34, y: 50 },
  ];
  return (
    <motion.div className="deal" exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.2 }}>
      <p className="sr-only">{spinning ? "Girando…" : ""}</p>
      <div className="deal__pile" aria-hidden>
        {three.map((id, i) => (
          <motion.div
            key={id}
            className="deal__card"
            style={{ zIndex: 3 - i }}
            initial={reduce ? false : { x: 160, y: -40, rotate: 30, opacity: 0 }}
            animate={{ x: pose[i].x, y: pose[i].y, rotate: pose[i].r, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.06 * i }}
          >
            <Cover cat={CATEGORY_BY_ID[id]} sizes="196px" />
            <span className="deal__name">{CATEGORY_BY_ID[id].short}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function Result({ cat, onPlay, onAgain, onClose }: { cat: string; onPlay: () => void; onAgain: () => void; onClose: () => void }) {
  const reduce = useReducedMotion();
  const c = CATEGORY_BY_ID[cat];
  return (
    <motion.section
      className="result panel"
      aria-labelledby="result-t"
      initial={reduce ? { opacity: 0 } : { scale: 1.35, rotate: -8, opacity: 0, y: 30 }}
      animate={{ scale: 1, rotate: -1.5, opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40, transition: { duration: 0.18 } }}
      transition={{ type: "spring", stiffness: 420, damping: 20 }}
    >
      <div className="result__cover">
        <Cover cat={c} sizes="(min-width: 900px) 140px, 36vw" eager />
        <span className="result__fam">{FAMILY_BY_ID[c.family].name}</span>
      </div>
      <div className="result__body">
        <h2 id="result-t" className="result__name">
          {c.name}
        </h2>
        <div className="result__actions">
          <button type="button" className="btn btn--hanko" onClick={onPlay} ref={(el) => el?.focus({ preventScroll: true })}>
            Jugar
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
          </button>
          <button type="button" className="btn btn--small result__again" onClick={onAgain}>
            Girar otra vez
          </button>
        </div>
      </div>
      <button type="button" className="result__close" onClick={onClose} aria-label="Cerrar">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="3" />
        </svg>
      </button>
    </motion.section>
  );
}
