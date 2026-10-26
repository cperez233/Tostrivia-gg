/* editorial-ui · Cristian Pérez · cristianperez.me
 * Las dos repisas del explorador de categorías: los atajos (mezclas ya armadas) y las partidas que guardó la persona.
 */
import { motion } from "framer-motion";
import { SHORTCUTS } from "../data/shortcuts";
import type { GroupId } from "../data/types";
import { describe, mixId, partsOf, playable } from "../game/mix";
import { VARIANT_TEXT } from "../game/powers";
import { removePreset, usePresets, type Preset } from "../lib/presets";
import { rulesSummary } from "./MatchSetup";
import { t } from "../i18n";

/** atajos de la pestaña (más los de todas) que tengan al menos dos categorías con preguntas */
export function shortcutsFor(g: GroupId) {
  return SHORTCUTS.filter((s) => (s.group === g || s.group === "todas") && s.cats.filter(playable).length >= 2);
}

export function ShortcutShelf({ g, picking, selected, onTap, idp }: { g: GroupId; picking: boolean; selected: string[]; onTap: (cats: string[], mix: string) => void; idp: string }) {
  const list = shortcutsFor(g);
  if (!list.length) return null;
  return (
    <section className="shelf" aria-labelledby={`${idp}-shortcuts`}>
      <h2 id={`${idp}-shortcuts`} className="shelf__title">
        {t("Atajos")}
        <span className="shelf__sub">{picking ? t("Suman a lo que ya marcaste.") : t("Mezclas ya armadas. Toca y juega.")}</span>
      </h2>
      <ul className="shelf__row">
        {list.map((s) => {
          const cats = s.cats.filter(playable);
          const on = picking && cats.every((c) => selected.includes(c));
          return (
            <li key={s.id}>
              <motion.button whileTap={{ scale: 0.96 }} type="button" className={`chip ${on ? "is-on" : ""}`} aria-pressed={picking ? on : undefined} onClick={() => onTap(cats, mixId(cats))}>
                <span className="chip__name">{s.name}</span>
                <span className="chip__sub">{s.blurb}</span>
              </motion.button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function PresetShelf({ idp, picking, onTap }: { idp: string; picking: boolean; onTap: (p: Preset) => void }) {
  const list = usePresets();
  if (!list.length) return null;
  return (
    <section className="shelf" aria-labelledby={`${idp}-presets`}>
      <h2 id={`${idp}-presets`} className="shelf__title">
        {t("Mis partidas")}
        <span className="shelf__sub">{picking ? t("Cargan sus categorías en la selección.") : t("Guardadas en este dispositivo.")}</span>
      </h2>
      <ul className="shelf__row">
        {list.map((p) => {
          const info = describe(p.cat);
          if (!info || !partsOf(p.cat).length) return null;
          return (
            <li key={p.id} className="chip chip--mine">
              <button type="button" className="chip__main" onClick={() => onTap(p)} title={`${info.name} · ${VARIANT_TEXT[p.variant].name} · ${rulesSummary(p.rules)}`}>
                <span className="chip__name">{p.name}</span>
                <span className="chip__sub">
                  {info.name}
                  {p.variant !== "vanilla" ? ` · ${VARIANT_TEXT[p.variant].name}` : ""}
                </span>
              </button>
              <button type="button" className="chip__del" onClick={() => removePreset(p.id)} aria-label={t("Borrar {name}", { name: p.name })} title={t("Borrar")}>
                <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
                  <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="4" />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
