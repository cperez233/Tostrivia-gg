/* editorial-ui · Cristian Pérez · cristianperez.me
 * El explorador de categorías: pestañas, la versión al azar de cada una y las viñetas con su portada.
 * Lo usan la página de Categorías (tocar = jugar) y la sala (tocar = elegir la de la partida).
 * En "Varias a la vez" las viñetas se marcan y la barra de abajo arma la mezcla.
 */
import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { GROUPS, categoriesOf, familiesOf } from "../data/categories";
import type { Category, GroupId } from "../data/types";
import { describe, mixId, partsOf, playable, randomId } from "../game/mix";
import { Cover } from "./Cover";
import "../pages/categories.css";

interface Props {
  /** recibe un id de categoría, de "al azar" o de mezcla (src/game/mix.ts) */
  onPick: (cat: string) => void;
  /** "Jugar" en la página, "Elegir" en la sala */
  verb: string;
  /** prefijo de ids: puede haber dos exploradores montados a la vez */
  idp: string;
  /** va encima de las pestañas (el título de la página) */
  title?: ReactNode;
  /** dentro de la hoja de la sala: la barra de la mezcla va pegada al fondo de la hoja */
  inSheet?: boolean;
  /** la elección actual: si es una mezcla, el modo "varias" arranca con ella marcada */
  current?: string | null;
}

export default function CategoryBrowser({ onPick, verb, idp, title, inSheet, current }: Props) {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<GroupId>("anime");
  const [dir, setDir] = useState(1);
  const startMix = current?.startsWith("mix-") ? partsOf(current) : [];
  const [picking, setPicking] = useState(startMix.length > 0);
  const [sel, setSel] = useState<string[]>(startMix);
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const tap = (id: string) => (picking ? toggle(id) : onPick(id));
  const go = (g: GroupId) => {
    setDir(GROUPS.findIndex((x) => x.id === g) > GROUPS.findIndex((x) => x.id === tab) ? 1 : -1);
    setTab(g);
  };
  const mode = (many: boolean) => {
    setPicking(many);
    if (!many) setSel([]);
  };

  return (
    <div className={`browser ${inSheet ? "browser--sheet" : ""}`}>
      <header className="cats__head wrap">
        {title}
        <div className="cats__tabs" role="tablist" aria-label="Tipo de categoría">
          {GROUPS.map((g) => (
            <button key={g.id} type="button" role="tab" id={`${idp}-tab-${g.id}`} aria-selected={tab === g.id} aria-controls={`${idp}-panel`} className={`cats__tab ${tab === g.id ? "is-on" : ""}`} onClick={() => go(g.id)}>
              {tab === g.id && <motion.span layoutId={`${idp}-pill`} className="cats__pill" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
              <span className="cats__tablabel">{g.name}</span>
            </button>
          ))}
        </div>
        <div className="cats__tools">
          <div className="modes" role="radiogroup" aria-label="Cuántas categorías">
            <button type="button" role="radio" aria-checked={!picking} className={`modes__opt ${!picking ? "is-on" : ""}`} onClick={() => mode(false)}>
              Una categoría
            </button>
            <button type="button" role="radio" aria-checked={picking} className={`modes__opt ${picking ? "is-on" : ""}`} onClick={() => mode(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v6H4zM13 14h7v6h-7z" fill="none" stroke="currentColor" strokeWidth="2.4" />
              </svg>
              Varias a la vez
            </button>
          </div>
          <button type="button" className="btn btn--small btn--ghost" onClick={() => onPick(randomId("todo"))}>
            Todo al azar
          </button>
        </div>
      </header>

      <div className="cats__body wrap" id={`${idp}-panel`} role="tabpanel" aria-labelledby={`${idp}-tab-${tab}`}>
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={tab}
            custom={dir}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -50 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            {picking ? (
              <p className="cats__hint">Toca las que quieras mezclar. Puedes cambiar de pestaña sin perder lo marcado.</p>
            ) : (
              <RandomTile g={tab} verb={verb} onPick={onPick} />
            )}
            {familiesOf(tab).map((f) => {
              const list = categoriesOf(f.id).filter((c) => playable(c.id));
              if (!list.length) return null;
              return (
                <section key={f.id} className="fam" aria-labelledby={`${idp}-fam-${f.id}`}>
                  {familiesOf(tab).length > 1 && (
                    <h2 id={`${idp}-fam-${f.id}`} className="fam__title">
                      {f.name}
                    </h2>
                  )}
                  <ul className="fam__grid">
                    {list.map((c, i) => (
                      <Tile key={c.id} c={c} i={i} big={i === 0 && list.length >= 4} picking={picking} on={sel.includes(c.id)} verb={verb} onTap={tap} />
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
                {sel.length === 0 ? "Ninguna marcada todavía." : sel.length === 1 ? `1 marcada: ${describe(sel[0])?.short}. Marca otra para mezclar.` : `${sel.length} marcadas: ${sel.map((c) => describe(c)?.short).join(", ")}`}
              </p>
              <button type="button" className="btn btn--hanko" disabled={!sel.length} onClick={() => onPick(mixId(sel))}>
                {verb}
                {sel.length > 1 ? ` ${sel.length}` : ""}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** la versión al azar de cada pestaña: preguntas de todas sus categorías */
function RandomTile({ g, verb, onPick }: { g: GroupId; verb: string; onPick: (cat: string) => void }) {
  const id = randomId(g);
  const info = describe(id)!;
  const count = familiesOf(g).flatMap((f) => categoriesOf(f.id)).filter((c) => playable(c.id)).length;
  return (
    <motion.button whileTap={{ scale: 0.98 }} type="button" className="azar" onClick={() => onPick(id)} aria-label={`${verb} ${info.name}`}>
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
function Tile({ c, i, big, picking, on, verb, onTap }: { c: Category; i: number; big: boolean; picking: boolean; on: boolean; verb: string; onTap: (cat: string) => void }) {
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
        aria-label={picking ? c.name : `${verb} ${c.name}`} aria-pressed={picking ? on : undefined}>
        <span className="tile__img">
          <Cover cat={c} sizes={big ? "(min-width: 1024px) 38vw, (min-width: 640px) 62vw, 46vw" : "(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 46vw"} />
          {picking && (
            <span className="tile__check" aria-hidden>
              {on ? "✓" : ""}
            </span>
          )}
          <span className="tile__play" aria-hidden>
            {picking ? (on ? "Quitar" : "Agregar") : verb}
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
