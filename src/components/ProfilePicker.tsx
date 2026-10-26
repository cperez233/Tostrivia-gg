/* editorial-ui · Cristian Pérez · cristianperez.me */
import { useId } from "react";
import { motion } from "framer-motion";
import { ANIMALS, Avatar } from "./Avatar";
import { saveProfile } from "../lib/identity";
import { t } from "../i18n";

interface Props {
  value: { name: string; seal: number };
  onChange: (v: { name: string; seal: number }) => void;
  /** animales que ya tiene otra persona en la sala: salen apagados y no se pueden elegir */
  taken?: number[];
}

export default function ProfilePicker({ value, onChange, taken = [] }: Props) {
  const id = useId();
  const set = (v: { name: string; seal: number }) => {
    onChange(v);
    saveProfile(v.name, v.seal);
  };
  return (
    <div className="profile">
      <div className="field">
        <label htmlFor={`${id}-name`}>{t("Tu nombre")}</label>
        <input
          id={`${id}-name`}
          className="input"
          value={value.name}
          onChange={(e) => set({ ...value, name: e.target.value.slice(0, 18) })}
          placeholder={t("Ej. Kakarot_23")}
          autoComplete="nickname"
          maxLength={18}
          enterKeyHint="done"
        />
      </div>
      <fieldset className="profile__animals">
        <legend>
          {t("Tu animal")} <span className="profile__chosen">{ANIMALS[value.seal]?.name}</span>
        </legend>
        <div className="profile__grid">
          {ANIMALS.map((a, i) => {
            const on = value.seal === i;
            const used = taken.includes(i);
            return (
              <label key={a.name} className={`profile__animal ${on ? "is-on" : ""} ${used ? "is-taken" : ""}`} title={used ? t("{name}: ya lo tiene otra persona", { name: a.name }) : undefined}>
                <input type="radio" name={`${id}-animal`} className="sr-only" checked={on} disabled={used} onChange={() => set({ ...value, seal: i })} />
                {on && <motion.span layoutId={`${id}-ring`} className="profile__ring" transition={{ type: "spring", stiffness: 520, damping: 36 }} />}
                <motion.span className="profile__face" animate={on ? { scale: 0.8, y: [0, -6, 0], rotate: [0, -6, 0] } : { scale: 1, y: 0, rotate: 0 }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}>
                  <Avatar animal={i} size={60} />
                </motion.span>
                <span className="sr-only">{used ? t("{name}: ya lo tiene otra persona", { name: a.name }) : a.name}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
