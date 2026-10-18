/* editorial-ui · Cristian Pérez · cristianperez.me
 * Cambio de pantalla: un cuadro de líneas cinéticas cruza desde el lado al que vas, con el nombre del destino.
 */
import { AnimatePresence, motion } from "framer-motion";
import "./wipe.css";

export interface WipeState {
  n: number;
  dir: 1 | -1;
  label: string;
}

/** líneas de concentración (shūchūsen): triángulos finos que salen de un punto. Fijas, sin azar. */
const LINES = Array.from({ length: 72 }, (_, k) => {
  const a = (k / 72) * Math.PI * 2 + (k % 3) * 0.013;
  const w = k % 4 === 0 ? 0.034 : k % 2 ? 0.012 : 0.02;
  const r0 = k % 5 === 0 ? 18 : k % 3 === 0 ? 26 : 34;
  const p = (ang: number, r: number) => `${(50 + Math.cos(ang) * r).toFixed(2)},${(50 + Math.sin(ang) * r * 0.62).toFixed(2)}`;
  return `${p(a - w, 120)} ${p(a, r0)} ${p(a + w, 120)}`;
});

export function FocusLines({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      {LINES.map((pts, k) => (
        <polygon key={k} points={pts} fill="currentColor" />
      ))}
    </svg>
  );
}

const edge = (dir: 1 | -1, phase: "from" | "full" | "to") => {
  // borde inclinado, como el corte de una viñeta
  if (phase === "full") return "polygon(-30% 0, 130% 0, 130% 100%, -30% 100%)";
  const enter = dir === 1;
  if (phase === "from") return enter ? "polygon(115% 0, 130% 0, 130% 100%, 100% 100%)" : "polygon(-30% 0, -15% 0, 0% 100%, -30% 100%)";
  return enter ? "polygon(-30% 0, -15% 0, -30% 100%, -30% 100%)" : "polygon(130% 0, 130% 0, 130% 100%, 115% 100%)";
};

export default function Wipe({ wipe }: { wipe: WipeState | null }) {
  return (
    <AnimatePresence>
      {wipe && (
        <motion.div
          key={wipe.n}
          className="wipe"
          aria-hidden
          initial={{ clipPath: edge(wipe.dir, "from") }}
          animate={{ clipPath: edge(wipe.dir, "full") }}
          exit={{ clipPath: edge(wipe.dir, "to") }}
          transition={{ duration: 0.36, ease: [0.76, 0, 0.24, 1] }}
        >
          <FocusLines className="wipe__lines" />
          <motion.span
            className="wipe__slash"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{ originX: wipe.dir === 1 ? 1 : 0 }}
          />
          <motion.span
            className="wipe__label"
            initial={{ scale: 1.5, rotate: -9, opacity: 0, x: wipe.dir * 60 }}
            animate={{ scale: 1, rotate: -4, opacity: 1, x: 0 }}
            exit={{ x: -wipe.dir * 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 22, delay: 0.1 }}
          >
            {wipe.label}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
