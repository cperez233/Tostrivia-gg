/* editorial-ui · Cristian Pérez · cristianperez.me
 * El personalizador de partidas: Vanilla o Poderes a la vista, y debajo un resumen de las reglas
 * (preguntas, tiempo, multiplicador, dificultad, racha) que se abre para cambiarlas.
 * Lo usan la ruleta y Categorías (al jugar solo) y la sala (lo cambia el anfitrión, los demás lo ven).
 */
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
        <p className="setup__sum" id={`${idp}-rules-sum`}>
          {rulesSummary(rules)}
        </p>
        <button
          type="button"
          className={`setup__toggle ${open ? "is-open" : ""}`}
          aria-expanded={open}
          aria-controls={`${idp}-rules`}
          aria-describedby={`${idp}-rules-sum`}
          onClick={() => setOpen((o) => !o)}
          disabled={disabled}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
            <path d="M4 7h10M18 7h2M4 17h2M10 17h10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
            <circle cx="16" cy="7" r="2.4" fill="none" stroke="currentColor" strokeWidth="2.4" />
            <circle cx="8" cy="17" r="2.4" fill="none" stroke="currentColor" strokeWidth="2.4" />
          </svg>
          {open ? t("Listo") : t("Personalizar")}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="rules"
            id={`${idp}-rules`}
            className="setup__panel"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
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
            {!isDefault(rules) && (
              <button type="button" className="setup__reset" onClick={() => onRules?.({ ...DEFAULT_RULES })} disabled={disabled}>
                {t("Volver a lo normal")}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
    <div className="setup__row">
      <p className="setup__label" id={lid}>
        {label}
      </p>
      <div className="setup__opts" role="radiogroup" aria-labelledby={lid} aria-describedby={hint ? hid : undefined}>
        {list.map((v) => (
          <button key={String(v)} type="button" role="radio" aria-checked={value === v} className={`setup__opt ${value === v ? "is-on" : ""}`} onClick={() => onPick(v)} disabled={disabled}>
            {name(v)}
          </button>
        ))}
      </div>
      {hint && (
        <p className="setup__hint" id={hid}>
          {hint}
        </p>
      )}
    </div>
  );
}
