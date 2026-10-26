/* editorial-ui · Cristian Pérez · cristianperez.me
 * El personalizador de partidas: Estándar o Poderes a la vista, y debajo un resumen de las reglas
 * (preguntas, tiempo, multiplicador, dificultad, racha) que se abre para cambiarlas.
 * Lo usan la ruleta y Categorías (al jugar solo) y la sala (lo cambia el anfitrión, los demás lo ven).
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, LayoutGroup, motion, useDragControls, useReducedMotion } from "framer-motion";
import VariantPicker from "./VariantPicker";
import { VARIANT_TEXT, saveVariant, savedVariant, type Variant } from "../game/powers";
import { COUNTS, DEFAULT_RULES, DIFFS, MEDIA_EXTRA, MULTS, TIMES, isDefault, saveRules, savedRules, type Difficulty, type Rules } from "../game/rules";
import { locale, t, useLang } from "../i18n";
import "./setup.css";

interface Props {
  variant: Variant;
  rules: Rules;
  onVariant?: (v: Variant) => void;
  onRules?: (r: Rules) => void;
  disabled?: boolean;
  /** los invitados de la sala solo ven el resumen */
  readOnly?: boolean;
  /** prefijo de ids: puede haber dos montados */
  idp: string;
}

const DIFF_NAME: Record<string, string> = { mix: "Mixta", 1: "Fácil", 2: "Media", 3: "Difícil" };
const num = (n: number) => n.toLocaleString(locale());

/** "10 preguntas · 20 s · ×2 · Difícil · Sin racha": solo lo que importa */
export function rulesSummary(r: Rules) {
  const out = [t("{n} preguntas", { n: r.count }), t("{n} s por pregunta", { n: r.time })];
  if (r.mult !== 1) out.push(t("puntos ×{n}", { n: num(r.mult) }));
  out.push(r.diff === "mix" ? t("dificultad mixta") : t(DIFF_NAME[r.diff]));
  if (!r.streak) out.push(t("sin racha"));
  return out.join(" · ");
}

/** las reglas como fichas sueltas: la que cambia entra de golpe */
export function rulesChips(r: Rules) {
  const out = [t("{n} preguntas", { n: r.count }), t("{n} s por pregunta", { n: r.time })];
  if (r.mult !== 1) out.push(t("puntos ×{n}", { n: num(r.mult) }));
  out.push(r.diff === "mix" ? t("dificultad mixta") : t(DIFF_NAME[r.diff]));
  if (!r.streak) out.push(t("sin racha"));
  return out;
}

const PANEL = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } };
const ROW = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 420, damping: 30 } } };

export default function MatchSetup({ variant, rules, onVariant, onRules, disabled, readOnly, idp }: Props) {
  useLang();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const set = <K extends keyof Rules>(k: K, v: Rules[K]) => onRules?.({ ...rules, [k]: v });

  if (readOnly) {
    return (
      <div className="setup setup--read">
        <p className="setup__line">
          <span className="label">{t("Modo")}</span> {VARIANT_TEXT[variant].name} · {VARIANT_TEXT[variant].desc}
        </p>
        <p className="setup__line">
          <span className="label">{t("Reglas")}</span> {rulesSummary(rules)}
        </p>
      </div>
    );
  }

  return (
    <div className="setup">
      <VariantPicker idp={idp} value={variant} onChange={(v) => onVariant?.(v)} disabled={disabled} />
      <div className="setup__bar">
        <motion.button
          type="button"
          className={`setup__toggle ${open ? "is-open" : ""}`}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={`${idp}-rules`}
          aria-describedby={`${idp}-rules-sum`}
          onClick={() => setOpen((o) => !o)}
          disabled={disabled}
          whileTap={disabled ? undefined : { scale: 0.96, x: 2, y: 2 }}
        >
          <Sliders open={open} />
          <span className="setup__toggle-text">{t("Personalizar")}</span>
          <motion.svg className="setup__chev" width="18" height="18" viewBox="0 0 24 24" aria-hidden animate={{ y: open ? -3 : 0 }} transition={{ type: "spring", stiffness: 380, damping: 22 }}>
            <path d="M5 15l7-7 7 7" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="square" />
          </motion.svg>
        </motion.button>
        <p className="sr-only" id={`${idp}-rules-sum`}>
          {rulesSummary(rules)}
        </p>
        <ul className="setup__chips" aria-hidden>
          <AnimatePresence initial={false} mode="popLayout">
            {rulesChips(rules).map((c) => (
              <motion.li
                key={c}
                layout={!reduce}
                className="setup__chip"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 520, damping: 30 }}
              >
                {c}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <Sheet open={open} onClose={() => setOpen(false)} idp={idp} reduce={!!reduce}>
        <motion.div className="setup__panel" variants={PANEL} initial="hidden" animate="show">
          <LayoutGroup id={`${idp}-rules-pills`}>
            <Row idp={idp} id="count" label={t("Preguntas")} list={COUNTS} value={rules.count} name={(n) => String(n)} onPick={(v) => set("count", v)} disabled={disabled} />
            <Row
              idp={idp}
              id="time"
              label={t("Tiempo por pregunta")}
              hint={t("Las de video tienen {n} s más.", { n: MEDIA_EXTRA })}
              list={TIMES}
              value={rules.time}
              name={(n) => `${n} s`}
              onPick={(v) => set("time", v)}
              disabled={disabled}
            />
            <Row
              idp={idp}
              id="mult"
              label={t("Multiplicador de puntos")}
              hint={t("Multiplica lo que gana cada acierto.")}
              list={MULTS}
              value={rules.mult}
              name={(n) => `×${num(n)}`}
              onPick={(v) => set("mult", v)}
              disabled={disabled}
            />
            <Row<Difficulty> idp={idp} id="diff" label={t("Dificultad")} list={DIFFS} value={rules.diff} name={(d) => t(DIFF_NAME[d])} onPick={(v) => set("diff", v)} disabled={disabled} />
            <Row<boolean>
              idp={idp}
              id="streak"
              label={t("Racha")}
              hint={rules.streak ? t("Acertar seguido multiplica: ×1,25 con 2, ×1,5 con 3, ×2 con 5 y ×3 con 8.") : t("Cada acierto vale lo mismo, vayas como vayas.")}
              list={[true, false]}
              value={rules.streak}
              name={(on) => (on ? t("Multiplica") : t("Sin racha"))}
              onPick={(v) => set("streak", v)}
              disabled={disabled}
            />
          </LayoutGroup>
          <AnimatePresence initial={false}>
            {!isDefault(rules) && (
              <motion.button
                key="reset"
                type="button"
                className="setup__reset"
                onClick={() => onRules?.({ ...DEFAULT_RULES })}
                disabled={disabled}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                {t("Volver a lo normal")}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </Sheet>
    </div>
  );
}

/**
 * Las reglas se abren en una hoja que sube desde abajo, encima de la pantalla: nada de lo que hay detrás se mueve ni se estira.
 * Se cierra con "Listo", con la X, tocando fuera, con Esc o arrastrándola hacia abajo.
 */
function Sheet({ open, onClose, idp, reduce, children }: { open: boolean; onClose: () => void; idp: string; reduce: boolean; children: ReactNode }) {
  const doneRef = useRef<HTMLButtonElement>(null);
  const controls = useDragControls();
  // red de seguridad: si la animación de salida se traba (pasó al cambiar la página detrás mientras se cerraba),
  // la hoja se quita igual poco después y nunca se queda tapando la pantalla
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    if (open) return setMounted(true);
    const t = setTimeout(() => setMounted(false), 600);
    return () => clearTimeout(t);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    doneRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", key);
    };
  }, [open, onClose]);
  if (typeof document === "undefined" || (!open && !mounted)) return null;
  return createPortal(
    // mientras se cierra ya no atrapa toques: lo de detrás se puede usar de inmediato
    // (va por fuera de AnimatePresence, que congela las props de lo que está saliendo)
    <div className="rsheet-root" style={{ pointerEvents: open ? undefined : "none" }}>
      <AnimatePresence>
        {open && (
          <div className="rsheet" key="rsheet">
            <motion.div className="rsheet__back" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} />
            <motion.section
              id={`${idp}-rules`}
              className="rsheet__card"
              role="dialog"
              aria-modal="true"
              aria-label={t("Personalizar")}
              initial={reduce ? { opacity: 0 } : { y: "100%" }}
              animate={reduce ? { opacity: 1 } : { y: 0 }}
              exit={reduce ? { opacity: 0 } : { y: "100%" }}
              transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 380, damping: 38, mass: 0.9 }}
              drag={reduce || !open ? false : "y"}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              dragListener={false}
              dragControls={controls}
              onDragEnd={(_, i) => (i.offset.y > 110 || i.velocity.y > 600) && onClose()}
            >
              <header className="rsheet__head" onPointerDown={(e) => controls.start(e)}>
                <span className="rsheet__grip" aria-hidden />
                <h2 className="rsheet__title">{t("Personalizar")}</h2>
                <button type="button" className="rsheet__x" onClick={onClose} aria-label={t("Cerrar")}>
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                    <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="3.4" strokeLinecap="square" />
                  </svg>
                </button>
              </header>
              <div className="rsheet__body">{children}</div>
              <footer className="rsheet__foot">
                <button type="button" ref={doneRef} className="rsheet__done" onClick={onClose}>
                  {t("Listo")}
                </button>
              </footer>
            </motion.section>
          </div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}

/** para jugar solo: lo elegido se recuerda en el navegador y la partida lo toma al empezar (App.playSolo) */
export function SoloSetup({ idp, disabled }: { idp: string; disabled?: boolean }) {
  const [variant, setVariant] = useState<Variant>(savedVariant);
  const [rules, setRules] = useState<Rules>(savedRules);
  return (
    <MatchSetup
      idp={idp}
      disabled={disabled}
      variant={variant}
      rules={rules}
      onVariant={(v) => {
        setVariant(v);
        saveVariant(v);
      }}
      onRules={(r) => {
        setRules(r);
        saveRules(r);
      }}
    />
  );
}

function Row<T extends string | number | boolean>({
  idp,
  id,
  label,
  hint,
  list,
  value,
  name,
  onPick,
  disabled,
}: {
  idp: string;
  id: string;
  label: string;
  hint?: string;
  list: readonly T[];
  value: T;
  name: (v: T) => string;
  onPick: (v: T) => void;
  disabled?: boolean;
}) {
  const lid = `${idp}-${id}-l`;
  const hid = `${idp}-${id}-h`;
  return (
    <motion.div className="setup__row" variants={ROW}>
      <p className="setup__label" id={lid}>
        {label}
      </p>
      <div className="setup__opts" role="radiogroup" aria-labelledby={lid} aria-describedby={hint ? hid : undefined}>
        {list.map((v) => (
          <motion.button
            key={String(v)}
            type="button"
            role="radio"
            aria-checked={value === v}
            className={`setup__opt ${value === v ? "is-on" : ""}`}
            onClick={() => onPick(v)}
            disabled={disabled}
            whileTap={disabled ? undefined : { scale: 0.88 }}
          >
            {value === v && <motion.span layoutId={`${idp}-${id}-pill`} className="setup__pill" transition={{ type: "spring", stiffness: 520, damping: 34 }} />}
            <span className="setup__opt-text">{name(v)}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {hint && (
          <motion.p key={hint} className="setup__hint" id={hid} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}>
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** el icono de los controles: al abrir, las perillas se corren */
function Sliders({ open }: { open: boolean }) {
  const spring = { type: "spring" as const, stiffness: 380, damping: 18 };
  return (
    <svg className="setup__icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path d="M3 7h18M3 17h18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
      <motion.circle r="3" fill="var(--hanko)" stroke="currentColor" strokeWidth="2.4" cy="7" initial={false} animate={{ cx: open ? 17 : 8 }} transition={spring} />
      <motion.circle r="3" fill="var(--signal)" stroke="currentColor" strokeWidth="2.4" cy="17" initial={false} animate={{ cx: open ? 7 : 16 }} transition={spring} />
    </svg>
  );
}

