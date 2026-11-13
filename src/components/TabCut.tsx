/* editorial-ui · Cristian Pérez · cristianperez.me
 * El golpe al cambiar de pestaña en Categorías: una franja bermellón cruza la pantalla en diagonal, con el nombre
 * de la pestaña estampado y cuántas categorías trae; detrás van rayas de velocidad y una segunda franja de tinta.
 * Las viñetas nuevas entran cuando la franja ya se va (ver Tile en CategoryBrowser).
 */
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { t } from "../i18n";
import "./tabcut.css";

export interface TabCutState {
  n: number;
  dir: 1 | -1;
  name: string;
  count: number;
}

/** cuánto dura la franja a la vista (ms): las viñetas arrancan a mitad de este tiempo */
export const CUT_MS = 820;

// rayas de velocidad: posición vertical, grosor, retraso y duración; fijas, sin azar
const STREAKS = [
  { top: 18, h: 5, w: 46, d: 0.02, t: 0.5 },
  { top: 27, h: 3, w: 30, d: 0.1, t: 0.46 },
  { top: 66, h: 6, w: 52, d: 0.05, t: 0.52 },
  { top: 76, h: 3, w: 34, d: 0.13, t: 0.44 },
  { top: 86, h: 4, w: 40, d: 0.08, t: 0.5 },
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function TabCut({ cut }: { cut: TabCutState | null }) {
  if (typeof document === "undefined") return null;
  return createPortal(<AnimatePresence>{cut && <Band key={cut.n} cut={cut} />}</AnimatePresence>, document.body);
}

function Band({ cut }: { cut: TabCutState }) {
  const { dir } = cut;
  // entra por el lado al que se va, se planta en el centro y sale por el contrario
  const sweep = (delay: number, dur: number) => ({
    initial: { x: `${dir * 112}%` },
    animate: { x: [`${dir * 112}%`, "0%", "0%", `${-dir * 112}%`], transition: { duration: dur, delay, times: [0, 0.3, 0.64, 1], ease: [ease, "linear", [0.5, 0, 0.75, 0.4]] as never } },
  });
  return (
    <motion.div className="tabcut" aria-hidden initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
      {STREAKS.map((s, k) => (
        <motion.span
          key={k}
          className="tabcut__streak"
          style={{ top: `${s.top}%`, height: s.h, width: `${s.w}vw`, [dir === 1 ? "right" : "left"]: "-2vw" } as React.CSSProperties}
          initial={{ x: `${dir * 140}%`, opacity: 0 }}
          animate={{ x: `${-dir * 330}%`, opacity: [0, 1, 1, 0] }}
          transition={{ duration: s.t, delay: s.d, ease: [0.4, 0, 0.2, 1] }}
        />
      ))}
      <motion.div className="tabcut__shadow" {...sweep(0.045, 0.74)} />
      <motion.div className="tabcut__band" {...sweep(0, 0.74)}>
        <motion.span
          className="tabcut__label"
          initial={{ scale: 1.7, rotate: -9, opacity: 0, x: dir * 70 }}
          animate={{ scale: 1, rotate: 0, opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 600, damping: 22, delay: 0.17 }}
        >
          {cut.name}
        </motion.span>
        <motion.span
          className="tabcut__count"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.26, delay: 0.3, ease }}
        >
          {t("{n} categorías", { n: cut.count })}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
