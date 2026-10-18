/* editorial-ui · Cristian Pérez · cristianperez.me */
import { useId } from "react";
import { Seal } from "./Seal";
import { saveProfile } from "../lib/identity";

interface Props {
  value: { name: string; seal: number };
  onChange: (v: { name: string; seal: number }) => void;
}

export default function ProfilePicker({ value, onChange }: Props) {
  const id = useId();
  const set = (v: { name: string; seal: number }) => {
    onChange(v);
    saveProfile(v.name, v.seal);
  };
  return (
    <div className="profile">
      <div className="field">
        <label htmlFor={`${id}-name`}>Tu nombre en la sala</label>
        <input
          id={`${id}-name`}
          className="input"
          value={value.name}
          onChange={(e) => set({ ...value, name: e.target.value.slice(0, 18) })}
          placeholder="Ej. Kakarot_23"
          autoComplete="nickname"
          maxLength={18}
          enterKeyHint="done"
        />
      </div>
      <fieldset className="profile__seals">
        <legend>Tu sello</legend>
        <div className="profile__grid">
          {Array.from({ length: 10 }, (_, i) => (
            <label key={i} className={`profile__seal ${value.seal === i ? "is-on" : ""}`}>
              <input type="radio" name={`${id}-seal`} className="sr-only" checked={value.seal === i} onChange={() => set({ ...value, seal: i })} />
              <Seal text={value.name || "?"} variant={i} size={40} />
              <span className="sr-only">Sello {i + 1}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
