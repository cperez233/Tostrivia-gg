/* editorial-ui · Cristian Pérez · cristianperez.me
 * Cambio de pantalla: tres paneles (tinta, papel y bermellón) cruzan desde el lado al que vas, cortados en diagonal como
 * viñetas. Sobre el último van las líneas cinéticas, el dibujo del destino (la ruleta, la rejilla, el grupo) y su nombre
 * estampado con el eco en katakana. Al irse, salen en orden contrario.
 */
import { AnimatePresence, motion } from "framer-motion";
import "./wipe.css";

export interface WipeState {
  n: number;
  dir: 1 | -1;
  label: string;
  /** a dónde se va: decide el dibujo y el eco en katakana */
  kind?: "home" | "cats" | "group" | "room" | "other";
}

/** eco del nombre del destino; los caracteres están en el corte japonés de la fuente */
const KANA: Record<string, string> = { home: "ルーレット", cats: "カテゴリ", group: "みんなで", room: "バトル" };

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

const cut = [0.76, 0, 0.24, 1] as [number, number, number, number];
const out = [0.22, 1, 0.36, 1] as [number, number, number, number];
const ink = { stroke: "var(--ink)", strokeWidth: 5, strokeLinejoin: "round" as const };

/** el dibujo del destino, de papel con contorno de tinta; cada uno hace su gesto al llegar */
function Motif({ kind, dir }: { kind: string; dir: 1 | -1 }) {
  if (kind === "home")
    return (
      <motion.svg className="wipe__motif" viewBox="0 0 120 120" aria-hidden initial={{ rotate: -300 * dir, scale: 0.5, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} transition={{ duration: 0.62, delay: 0.06, ease: out }}>
        <circle cx="60" cy="64" r="48" fill="var(--paper)" {...ink} />
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <path key={k} d="M60 64L60 16A48 48 0 0 1 101.6 40z" fill="var(--signal)" transform={`rotate(${k * 60} 60 64)`} {...ink} strokeWidth={3} style={{ display: k % 2 ? "none" : undefined }} />
        ))}
        <circle cx="60" cy="64" r="9" fill="var(--ink)" />
        <path d="M50 2h20L60 22z" fill="var(--ink)" />
      </motion.svg>
    );
  if (kind === "cats")
    return (
      <svg className="wipe__motif" viewBox="0 0 120 120" aria-hidden>
        {[
          [8, 8, 50, 62],
          [64, 8, 48, 36],
          [64, 50, 48, 62],
          [8, 78, 50, 34],
        ].map(([x, y, w, h], k) => (
          <motion.rect key={k} x={x} y={y} width={w} height={h} fill={k === 1 ? "var(--signal)" : "var(--paper)"} {...ink} initial={{ scale: 0.2, opacity: 0, rotate: k % 2 ? 8 : -8 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 520, damping: 20, delay: 0.12 + k * 0.06 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        ))}
      </svg>
    );
  if (kind === "group")
    return (
      <svg className="wipe__motif" viewBox="0 0 140 120" aria-hidden>
        {[
          [38, 46, 18, "var(--paper)"],
          [102, 50, 15, "var(--signal)"],
          [70, 36, 22, "var(--paper)"],
        ].map(([cx, cy, r, fill], k) => (
          <motion.g key={k} initial={{ y: 40, opacity: 0, scale: 0.6 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 480, damping: 19, delay: 0.1 + k * 0.07 }} style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}>
            <path d={`M${+cx - +r * 1.5} 116c0-${+r * 1.6} ${+r * 0.6}-${+r * 2} ${+r * 1.5}-${+r * 2}s${+r * 1.5} ${+r * 0.4} ${+r * 1.5} ${+r * 2}z`} fill={String(fill)} {...ink} />
            <circle cx={cx as number} cy={cy as number} r={r as number} fill={String(fill)} {...ink} />
          </motion.g>
        ))}
      </svg>
    );
  return null;
}

export default function Wipe({ wipe }: { wipe: WipeState | null }) {
  return (
    <AnimatePresence>
      {wipe && <Panels key={wipe.n} wipe={wipe} />}
    </AnimatePresence>
  );
}

function Panels({ wipe }: { wipe: WipeState }) {
  const { dir } = wipe;
  const kind = wipe.kind ?? "other";
  const kana = KANA[kind];
  // cada panel entra con su retraso y se va en orden contrario: el de tinta llega primero y se va el último
  const layer = (enter: number, leave: number) => ({
    initial: { clipPath: edge(dir, "from") },
    animate: { clipPath: edge(dir, "full"), transition: { duration: 0.32, delay: enter, ease: cut } },
    exit: { clipPath: edge(dir, "to"), transition: { duration: 0.34, delay: leave, ease: cut } },
  });
  return (
    <div className="wipe" aria-hidden>
      <motion.div className="wipe__panel wipe__panel--ink" {...layer(0, 0.1)} />
      <motion.div className="wipe__panel wipe__panel--paper" {...layer(0.05, 0.05)} />
      <motion.div className="wipe__panel wipe__panel--hanko" {...layer(0.1, 0)}>
        <motion.span className="wipe__rays" initial={{ scale: 1.25, rotate: dir * 4 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.8, ease: out }}>
          <FocusLines className="wipe__lines" />
        </motion.span>
        {kana && (
          <motion.span className="wipe__kana" initial={{ opacity: 0, x: dir * 120 }} animate={{ opacity: 0.17, x: 0 }} exit={{ opacity: 0, x: -dir * 120 }} transition={{ duration: 0.5, delay: 0.2, ease: out }}>
            {kana}
          </motion.span>
        )}
        <span className="wipe__stage">
          <Motif kind={kind} dir={dir} />
          <motion.span
            className="wipe__label"
            initial={{ scale: 2, rotate: -12, opacity: 0, x: dir * 90 }}
            animate={{ scale: 1, rotate: -4, opacity: 1, x: 0 }}
            exit={{ x: -dir * 120, opacity: 0, transition: { duration: 0.22 } }}
            transition={{ type: "spring", stiffness: 560, damping: 22, delay: 0.2 }}
          >
            {wipe.label}
          </motion.span>
        </span>
      </motion.div>
    </div>
  );
}
