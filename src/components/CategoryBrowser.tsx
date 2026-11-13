/* editorial-ui · Cristian Pérez · cristianperez.me
 * El explorador de categorías: pestañas, la versión al azar de cada una y las viñetas con su portada.
 * Lo usan la página de Categorías (tocar = jugar) y la sala (tocar = elegir la de la partida).
 * En "Varias a la vez" las viñetas se marcan y la barra de abajo arma la mezcla.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { GROUPS, categoriesOf, familiesOf } from "../data/categories";
import type { Category, GroupId } from "../data/types";
import { describe, mixId, partsOf, playable, randomId } from "../game/mix";
import { saveTab, savedTab } from "../lib/catsTab";
import { addPreset, MAX_PRESETS, NAME_MAX, savedPresets, type Preset } from "../lib/presets";
import { savedVariant, type Variant } from "../game/powers";
import { savedRules, type Rules } from "../game/rules";
import { PresetShelf, ShortcutShelf } from "./Shelves";
import { Cover } from "./Cover";
import TabCut, { CUT_MS, type TabCutState } from "./TabCut";
import "../pages/categories.css";
import { t } from "../i18n";

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
  /** tocar una partida guardada: por defecto solo elige su categoría; la página la usa para cargar también el modo y las reglas */
  onPreset?: (p: Preset) => void;
  /** modo y reglas que se guardan junto a las categorías (por defecto, los que recuerda el navegador para jugar solo) */
  getSetup?: () => { variant: Variant; rules: Rules };
}

export default function CategoryBrowser({ onPick, verb, idp, title, inSheet, current, onPreset, getSetup }: Props) {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<GroupId>(savedTab);
  const [dir, setDir] = useState(1);
  const startMix = current?.startsWith("mix-") ? partsOf(current) : [];
  const [picking, setPicking] = useState(startMix.length > 0);
  const [sel, setSel] = useState<string[]>(startMix);
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState<string | null>(null);
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const tap = (id: string) => (picking ? toggle(id) : onPick(id));
  /** el golpe de la pestaña: la franja cruza y las viñetas nuevas entran detrás de ella */
  const [cut, setCut] = useState<TabCutState | null>(null);
  /** ya se cambió de pestaña al menos una vez: las viñetas nuevas entran con golpe, no solo al verse */
  const [swapped, setSwapped] = useState(false);
  const cutTimer = useRef<number>();
  useEffect(() => () => clearTimeout(cutTimer.current), []);
  const go = (g: GroupId) => {
    if (g === tab) return;
    const d = GROUPS.findIndex((x) => x.id === g) > GROUPS.findIndex((x) => x.id === tab) ? 1 : -1;
    setDir(d);
    setTab(g);
    saveTab(g);
    if (reduce) return;
    setSwapped(true);
    // en la hoja de la sala no se cruza toda la pantalla: solo entran las viñetas
    if (inSheet) return;
    const count = familiesOf(g).flatMap((f) => categoriesOf(f.id)).filter((c) => playable(c.id)).length;
    setCut({ n: Date.now(), dir: d, name: GROUPS.find((x) => x.id === g)!.name, count });
    clearTimeout(cutTimer.current);
    cutTimer.current = window.setTimeout(() => setCut(null), CUT_MS);
  };
  const mode = (many: boolean) => {
    setPicking(many);
    if (!many) {
      setSel([]);
      setNaming(false);
    }
  };
  const addAll = (cats: string[]) => setSel((s) => [...new Set([...s, ...cats])]);
  const save = () => {
    const setup = getSetup?.() ?? { variant: savedVariant(), rules: savedRules() };
    const made = addPreset({ name, cat: mixId(sel), ...setup });
    if (!made) return;
    setSaved(made.name);
    setTimeout(() => setSaved(null), 2600);
    setNaming(false);
    setName("");
  };
  const tapPreset = (p: Preset) => {
    if (picking) {
      setSel(partsOf(p.cat));
      return;
    }
    (onPreset ?? ((x: Preset) => onPick(x.cat)))(p);
  };

  return (
    <div className={`browser ${inSheet ? "browser--sheet" : ""}`}>
      <header className="cats__head wrap">
        {title}
        <div className="cats__tabs" role="tablist" aria-label={t("Tipo de categoría")}>
          {GROUPS.map((g) => (
            <motion.button key={g.id} type="button" role="tab" id={`${idp}-tab-${g.id}`} aria-selected={tab === g.id} aria-controls={`${idp}-panel`} className={`cats__tab ${tab === g.id ? "is-on" : ""}`} onClick={() => go(g.id)} whileTap={{ scale: 0.95 }}>
              {tab === g.id && <motion.span layoutId={`${idp}-pill`} className="cats__pill" transition={{ type: "spring", stiffness: 520, damping: 30 }} />}
              {/* al quedar elegida, la etiqueta se estampa: baja un poco, rebota y queda */}
              <motion.span key={tab === g.id ? "on" : "off"} className="cats__tablabel" initial={tab === g.id && swapped && !reduce ? { scale: 1.28, rotate: -4 } : false} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 700, damping: 17, delay: 0.06 }}>
                {g.name}
              </motion.span>
            </motion.button>
          ))}
        </div>
        <div className="cats__tools">
          <div className="modes" role="radiogroup" aria-label={t("Cuántas categorías")}>
            <button type="button" role="radio" aria-checked={!picking} className={`modes__opt ${!picking ? "is-on" : ""}`} onClick={() => mode(false)}>
              {t("Una categoría")}
            </button>
            <button type="button" role="radio" aria-checked={picking} className={`modes__opt ${picking ? "is-on" : ""}`} onClick={() => mode(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v6H4zM13 14h7v6h-7z" fill="none" stroke="currentColor" strokeWidth="2.4" />
              </svg>
              {t("Varias a la vez")}
            </button>
          </div>
          <button type="button" className="btn btn--small btn--ghost" onClick={() => onPick(randomId("todo"))}>
            {t("Todo al azar")}
          </button>
        </div>
      </header>

      <div className="cats__body wrap" id={`${idp}-panel`} role="tabpanel" aria-labelledby={`${idp}-tab-${tab}`}>
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={tab}
            custom={dir}
            // la página nueva se destapa pegada a la cola de la franja, del lado por el que esta se va
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 50, clipPath: dir === 1 ? "inset(-4% -4% -4% 104%)" : "inset(-4% 104% -4% -4%)" }}
            animate={reduce ? { opacity: 1, x: 0 } : { opacity: 1, x: 0, clipPath: "inset(-4% -4% -4% -4%)", transitionEnd: { clipPath: "none" } }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -70, skewX: dir * 4, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}
            transition={reduce ? { duration: 0.26 } : { duration: 0.32, delay: 0.16, ease: [0.22, 1, 0.36, 1], clipPath: { duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.1, delay: 0.16 } }}
          >
            <PresetShelf idp={idp} picking={picking} onTap={tapPreset} />
            <ShortcutShelf g={tab} idp={idp} picking={picking} selected={sel} onTap={(cats, mix) => (picking ? addAll(cats) : onPick(mix))} />
            {picking ? (
              <p className="cats__hint">{t("Toca las que quieras mezclar. Puedes cambiar de pestaña sin perder lo marcado.")}</p>
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
                      <Tile key={c.id} c={c} i={i} slam={swapped && !reduce ? (dir as 1 | -1) : 0} big={i === 0 && list.length >= 4} picking={picking} on={sel.includes(c.id)} verb={verb} onTap={tap} />
                    ))}
                  </ul>
                </section>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <TabCut cut={cut} />

      <AnimatePresence>
        {picking && (
          <motion.div className="pickbar" initial={{ y: "120%" }} animate={{ y: 0 }} exit={{ y: "120%" }} transition={{ type: "spring", stiffness: 420, damping: 34 }}>
            <div className="pickbar__in wrap">
              <p className="pickbar__text" aria-live="polite">
                {saved ? t("Guardada: {name}", { name: saved }) : sel.length === 0 ? t("Ninguna marcada todavía.") : sel.length === 1 ? t("1 marcada: {c}. Marca otra para mezclar.", { c: describe(sel[0])?.short ?? "" }) : t("{n} marcadas: {list}", { n: sel.length, list: sel.map((c) => describe(c)?.short).join(", ") })}
              </p>
              {sel.length > 0 && (
                <button type="button" className="btn btn--small btn--ghost" onClick={() => setSel([])}>
                  {t("Limpiar")}
                </button>
              )}
              {sel.length > 0 && savedPresets().length < MAX_PRESETS && (
                <button type="button" className="btn btn--small btn--ghost" aria-expanded={naming} onClick={() => setNaming((n) => !n)}>
                  {t("Guardar")}
                </button>
              )}
              <button type="button" className="btn btn--hanko" disabled={!sel.length} onClick={() => onPick(mixId(sel))}>
                {verb}
                {sel.length > 1 ? ` ${sel.length}` : ""}
              </button>
            </div>
            {naming && (
              <form
                className="pickbar__name wrap"
                onSubmit={(e) => {
                  e.preventDefault();
                  save();
                }}
              >
                <label className="sr-only" htmlFor={`${idp}-presetname`}>
                  {t("Nombre de la partida")}
                </label>
                <input id={`${idp}-presetname`} className="input" value={name} maxLength={NAME_MAX} onChange={(e) => setName(e.target.value)} placeholder={t("Nombre: Noche de anime")} autoComplete="off" enterKeyHint="done" autoFocus />
                <button type="submit" className="btn btn--small" disabled={!name.trim()}>
                  {t("Guardar partida")}
                </button>
              </form>
            )}
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
        <span className="azar__sub">{t("Mezcla de las {n} categorías, con más peso a las más conocidas", { n: count })}</span>
      </span>
      <svg className="azar__go" width="22" height="22" viewBox="0 0 24 24" aria-hidden>
        <path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="3" />
      </svg>
    </motion.button>
  );
}

// una viñeta grande por familia, como en la página de un manga (si la familia tiene con qué rodearla)
function Tile({ c, i, slam, big, picking, on, verb, onTap }: { c: Category; i: number; slam: 0 | 1 | -1; big: boolean; picking: boolean; on: boolean; verb: string; onTap: (cat: string) => void }) {
  const reduce = useReducedMotion();
  // se observa el <li> sin recortar; la viñeta de adentro es la que se destapa (regla 17)
  const ref = useRef<HTMLLIElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.15 });
  // tras un cambio de pestaña la viñeta entra con golpe, siguiendo a la franja; si se ve más tarde (al bajar), entra sin esperar
  const born = useRef(performance.now());
  const wait = useRef<number | null>(null);
  if (seen && wait.current === null) wait.current = slam && performance.now() - born.current < 700 ? 0.22 + Math.min(i, 9) * 0.05 : 0;
  const delay = slam ? (wait.current ?? 0) : (i % 4) * 0.06;
  return (
    <li ref={ref} className={`tile ${big ? "tile--big" : ""}`}>
      <motion.button
        // el recorte deja 3% de aire a los lados para que el borde blanco se destape junto con la viñeta
        initial={reduce ? false : slam ? { clipPath: slam === 1 ? "inset(-3% -3% -3% 103%)" : "inset(-3% 103% -3% -3%)", scale: 1.16, rotate: i % 2 ? 2.5 : -2.5, y: 16 } : { clipPath: "inset(-3% -3% 103% -3%)", y: 24 }}
        animate={seen || reduce ? { clipPath: "inset(-3% -3% -3% -3%)", y: 0, scale: 1, rotate: 0, transitionEnd: { clipPath: "none" } } : undefined}
        transition={slam ? { clipPath: { duration: 0.42, delay, ease: [0.22, 1, 0.36, 1] }, default: { type: "spring", stiffness: 380, damping: 24, delay } } : { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
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
            {picking ? (on ? t("Quitar") : t("Agregar")) : verb}
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
