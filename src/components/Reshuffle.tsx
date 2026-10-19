/* editorial-ui · Cristian Pérez · cristianperez.me
 * "Cambiar": pone otras categorías en la ruleta. Está en la ruleta de siempre y en la de la sala (solo el anfitrión).
 */
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { t, useLang } from "../i18n";
import "./wheel.css";

export default function Reshuffle({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  useLang();
  const reduce = useReducedMotion();
  const [turns, setTurns] = useState(0);
  return (
    <motion.button
      type="button"
      className="reshuffle"
      onClick={() => {
        setTurns((n) => n + 1);
        onClick();
      }}
      disabled={disabled}
      aria-label={t("Poner otras categorías en la rueda")}
      whileTap={disabled ? undefined : { scale: 0.92, rotate: -7 }}
      initial={reduce ? false : { opacity: 0, x: -16, rotate: -12 }}
      animate={{ opacity: 1, x: 0, rotate: -4 }}
      transition={{ type: "spring", stiffness: 420, damping: 22, delay: 0.5 }}
    >
      <motion.svg width="20" height="20" viewBox="0 0 24 24" aria-hidden animate={{ rotate: turns * 360 }} transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 13 }}>
        <path d="M3 7h4c4 0 6 10 10 10h4M3 17h4c1.6 0 2.8-1.6 4-3.6M13 9.6C14.2 7.6 15.4 7 17 7h4M18 4l3 3-3 3M18 14l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
      {t("Cambiar")}
    </motion.button>
  );
}
