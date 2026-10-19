/* editorial-ui · Cristian Pérez · cristianperez.me
 * Todas las categorías como viñetas con su portada. Se toca una y empieza la partida;
 * en "Varias a la vez" se marcan las que se quieran y salen preguntas de todas.
 */
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import CategoryBrowser from "../components/CategoryBrowser";
import VariantPicker from "../components/VariantPicker";
import { saveVariant, savedVariant, type Variant } from "../game/powers";
import "./categories.css";

export default function Categories({ onPlay }: { onPlay: (cat: string) => void }) {
  const reduce = useReducedMotion();
  const [variant, setVariant] = useState<Variant>(savedVariant);
  return (
    <main className="cats">
      <CategoryBrowser
        idp="cats"
        verb="Jugar"
        onPick={onPlay}
        title={
          <>
            <h1 className="cats__title">
              <motion.span initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                Categorías
              </motion.span>
            </h1>
            <VariantPicker
              idp="cats"
              value={variant}
              onChange={(v) => {
                setVariant(v);
                saveVariant(v);
              }}
            />
          </>
        }
      />
    </main>
  );
}
