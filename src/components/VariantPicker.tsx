/* editorial-ui · Cristian Pérez · cristianperez.me
 * Estándar o Locura: dos botones y una línea que dice qué cambia.
 */
import { AnimatePresence, motion } from "framer-motion";
import { VARIANTS, VARIANT_TEXT, type Variant } from "../game/powers";
import { t } from "../i18n";
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
      <div className="variant__opts" role="radiogroup" aria-label={t("Modo de juego")} aria-describedby={`${idp}-variant-d`}>
        {VARIANTS.map((v) => (
          <motion.button
            key={v}
            type="button"
            role="radio"
            aria-checked={value === v}
            className={`variant__opt ${value === v ? "is-on" : ""}`}
            onClick={() => onChange(v)}
            disabled={disabled}
            whileTap={disabled ? undefined : { scale: 0.94 }}
          >
            {value === v && <motion.span layoutId={`${idp}-variant-pill`} className="variant__pill" transition={{ type: "spring", stiffness: 520, damping: 34 }} />}
            <span className="variant__name">{VARIANT_TEXT[v].name}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p key={value} className="variant__desc" id={`${idp}-variant-d`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.16 }}>
          {VARIANT_TEXT[value].desc}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
