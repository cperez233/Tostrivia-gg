/* editorial-ui · Cristian Pérez · cristianperez.me
 * Todas las categorías como viñetas con su portada. Se toca una y empieza la partida.
 */
import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { GROUPS, categoriesOf, familiesOf } from "../data/categories";
import type { Category, GroupId } from "../data/types";
import { playable } from "../game/deck";
import { Cover } from "../components/Cover";
import "./categories.css";

export default function Categories({ onPlay }: { onPlay: (cat: string) => void }) {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<GroupId>("anime");
  const [dir, setDir] = useState(1);
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
                      <Tile key={c.id} c={c} i={i} big={i === 0 && list.length >= 4} onPlay={onPlay} />
                    ))}
                  </ul>
                </section>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

// una viñeta grande por familia, como en la página de un manga (si la familia tiene con qué rodearla)
function Tile({ c, i, big, onPlay }: { c: Category; i: number; big: boolean; onPlay: (cat: string) => void }) {
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
        whileTap={{ scale: 0.97 }} type="button" className="tile__btn" onClick={() => onPlay(c.id)} aria-label={`Jugar ${c.name}`}>
        <span className="tile__img">
          <Cover cat={c} sizes={big ? "(min-width: 1024px) 38vw, (min-width: 640px) 62vw, 46vw" : "(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 46vw"} />
          <span className="tile__play" aria-hidden>
            Jugar
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
