/* editorial-ui · Cristian Pérez · cristianperez.me
 * Vanilla o Poderes: dos botones y una línea que dice qué cambia.
 */
import { VARIANTS, VARIANT_TEXT, type Variant } from "../game/powers";
import "./variant.css";

interface Props {
  value: Variant;
  onChange: (v: Variant) => void;
  disabled?: boolean;
  /** prefijo del id de la descripción: puede haber dos montados */
  idp: string;
}

export default function VariantPicker({ value, onChange, disabled, idp }: Props) {
  return (
    <div className="variant">
      <div className="variant__opts" role="radiogroup" aria-label="Modo de juego" aria-describedby={`${idp}-variant-d`}>
        {VARIANTS.map((v) => (
          <button key={v} type="button" role="radio" aria-checked={value === v} className={`variant__opt ${value === v ? "is-on" : ""}`} onClick={() => onChange(v)} disabled={disabled}>
            {v === "powers" && <span aria-hidden>⚡</span>}
            {VARIANT_TEXT[v].name}
          </button>
        ))}
      </div>
      <p className="variant__desc" id={`${idp}-variant-d`}>
        {VARIANT_TEXT[value].desc}
      </p>
    </div>
  );
}
