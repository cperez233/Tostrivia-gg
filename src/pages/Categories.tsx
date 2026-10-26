/* editorial-ui · Cristian Pérez · cristianperez.me
 * Todas las categorías como viñetas con su portada. Se toca una y empieza la partida;
 * en "Varias a la vez" se marcan las que se quieran y salen preguntas de todas.
 */
import { motion, useReducedMotion } from "framer-motion";
import CategoryBrowser from "../components/CategoryBrowser";
import { SoloSetup } from "../components/MatchSetup";
import { saveRules } from "../game/rules";
import { saveVariant } from "../game/powers";
import "./categories.css";
import { t } from "../i18n";

export default function Categories({ onPlay }: { onPlay: (cat: string) => void }) {
  const reduce = useReducedMotion();
  return (
    <main className="cats">
      <CategoryBrowser
        idp="cats"
        verb={t("Jugar")}
        onPick={onPlay}
        // una partida guardada trae también su modo y sus reglas
        onPreset={(p) => {
          saveVariant(p.variant);
          saveRules(p.rules);
          onPlay(p.cat);
        }}
        title={
          <>
            <h1 className="cats__title">
              <motion.span initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                {t("Categorías")}
              </motion.span>
            </h1>
            <SoloSetup idp="cats" />
          </>
        }
      />
    </main>
  );
}
