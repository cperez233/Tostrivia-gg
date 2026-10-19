/* editorial-ui · Cristian Pérez · cristianperez.me
 * Todas las categorías como viñetas con su portada. Se toca una y empieza la partida;
 * con "Elegir varias" se marcan las que se quieran y salen preguntas de todas.
 */
import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { GROUPS, categoriesOf, familiesOf } from "../data/categories";
import type { Category, GroupId } from "../data/types";
import { describe, mixId, playable, randomId } from "../game/mix";
import { Cover } from "../components/Cover";
import "./categories.css";

export default function Categories({ onPlay }: { onPlay: (cat: string) => void }) {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<GroupId>("anime");
  const [dir, setDir] = useState(1);
  const [picking, setPicking] = useState(false);
  const [sel, setSel] = useState<string[]>([]);
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const tap = (id: string) => (picking ? toggle(id) : onPlay(id));
  const go = (g: GroupId) => {
    setDir(GROUPS.findIndex((x) => x.id === g) > GROUPS.findIndex((x) => x.id === tab) ? 1 : -1);
    setTab(g);
  };

  return (
    <main className="cats">
      <header className="cats__head wrap">
        <h1 className="cats__title">
          <motion.span initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            Categorías
          </motion.span>
        </h1>
        <div className="cats__tabs" role="tablist" aria-label="Tipo de categoría">
          {GROUPS.map((g) => (
            <button key={g.id} type="button" role="tab" id={`tab-${g.id}`} aria-selected={tab === g.id} aria-controls="cats-panel" className={`cats__tab ${tab === g.id ? "is-on" : ""}`} onClick={() => go(g.id)}>
              {tab === g.id && <motion.span layoutId="cats-pill" className="cats__pill" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
              <span className="cats__tablabel">{g.name}</span>
            </button>
          ))}
        </div>
        <div className="cats__tools">
          <button type="button" className={`btn btn--small ${picking ? "btn--hanko" : ""}`} aria-pressed={picking} onClick={() => (setPicking((p) => !p), setSel([]))}>
            {picking ? "Cancelar" : "Elegir varias"}
          </button>
          <button type="button" className="btn btn--small btn--ghost" onClick={() => onPlay(randomId("todo"))}>
            Todo al azar
          </button>
        </div>
      </header>

      <div className="cats__body wrap" id="cats-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={tab}
            custom={dir}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -50 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            {!picking && <RandomTile g={tab} onPlay={onPlay} />}
            {familiesOf(tab).map((f) => {
              const list = categoriesOf(f.id).filter((c) => playable(c.id));
              if (!list.length) return null;
              return (
                <section key={f.id} className="fam" aria-labelledby={`fam-${f.id}`}>
                  {familiesOf(tab).length > 1 && (
                    <h2 id={`fam-${f.id}`} className="fam__title">
                      {f.name}
                    </h2>
                  )}
                  <ul className="fam__grid">
                    {list.map((c, i) => (
                      <Tile key={c.id} c={c} i={i} big={i === 0 && list.length >= 4} picking={picking} on={sel.includes(c.id)} onTap={tap} />
                    ))}
                  </ul>
                </section>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {picking && (
          <motion.div className="pickbar" initial={{ y: "120%" }} animate={{ y: 0 }} exit={{ y: "120%" }} transition={{ type: "spring", stiffness: 420, damping: 34 }}>
            <div className="pickbar__in wrap">
              <p className="pickbar__text" aria-live="polite">
                {sel.length === 0 ? "Toca las categorías que quieras mezclar." : sel.length === 1 ? "1 elegida. Elige otra o juega solo esa." : `${sel.length} elegidas: ${sel.map((c) => describe(c)?.short).join(", ")}`}
              </p>
              <button type="button" className="btn btn--hanko" disabled={!sel.length} onClick={() => onPlay(mixId(sel))}>
                Jugar{sel.length > 1 ? ` con ${sel.length}` : ""}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/** la versión al azar de cada pestaña: preguntas de todas sus categorías */
function RandomTile({ g, onPlay }: { g: GroupId; onPlay: (cat: string) => void }) {
  const id = randomId(g);
  const info = describe(id)!;
  const count = familiesOf(g).flatMap((f) => categoriesOf(f.id)).filter((c) => playable(c.id)).length;
  return (
    <motion.button whileTap={{ scale: 0.98 }} type="button" className="azar" onClick={() => onPlay(id)} aria-label={`Jugar ${info.name}`}>
      <span className="azar__img">
        <Cover cat={info.cover} sizes="90px" />
      </span>
      <span className="azar__text">
        <span className="azar__name">{info.name}</span>
        <span className="azar__sub">Preguntas de las {count} categorías, mezcladas</span>
      </span>
      <svg className="azar__go" width="22" height="22" viewBox="0 0 24 24" aria-hidden>
        <path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="3" />
      </svg>
    </motion.button>
  );
}

// una viñeta grande por familia, como en la página de un manga (si la familia tiene con qué rodearla)
function Tile({ c, i, big, picking, on, onTap }: { c: Category; i: number; big: boolean; picking: boolean; on: boolean; onTap: (cat: string) => void }) {
  const reduce = useReducedMotion();
  // se observa el <li> sin recortar; la viñeta de adentro es la que se destapa (regla 17)
  const ref = useRef<HTMLLIElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.15 });
  return (
    <li ref={ref} className={`tile ${big ? "tile--big" : ""}`}>
      <motion.button
        // el recorte deja 3% de aire a los lados para que el borde blanco se destape junto con la viñeta
        initial={reduce ? false : { clipPath: "inset(-3% -3% 103% -3%)", y: 24 }}
        animate={seen || reduce ? { clipPath: "inset(-3% -3% -3% -3%)", y: 0, transitionEnd: { clipPath: "none" } } : undefined}
        transition={{ duration: 0.55, delay: (i % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
        whileTap={{ scale: 0.97 }} type="button" className={`tile__btn ${on ? "is-on" : ""}`} onClick={() => onTap(c.id)}
        aria-label={picking ? c.name : `Jugar ${c.name}`} aria-pressed={picking ? on : undefined}>
        <span className="tile__img">
          <Cover cat={c} sizes={big ? "(min-width: 1024px) 38vw, (min-width: 640px) 62vw, 46vw" : "(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 46vw"} />
          {picking && (
            <span className="tile__check" aria-hidden>
              {on ? "✓" : ""}
            </span>
          )}
          <span className="tile__play" aria-hidden>
            {picking ? (on ? "Quitar" : "Agregar") : "Jugar"}
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
          </span>
          {c.sfx && c.sfx !== "♪" && (
            <span className="tile__sfx sfx" aria-hidden>
              {c.sfx}
            </span>
          )}
        </span>
        <span className="tile__name">{c.name}</span>
      </motion.button>
    </li>
  );
}
