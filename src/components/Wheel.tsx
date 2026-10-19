/* editorial-ui · Cristian Pérez · cristianperez.me
 * La ruleta: cada gajo es una categoría del mazo, con su portada. El mazo cambia con el filtro.
 * Gira hacia el gajo que ya decidió quien la hizo girar (así todos en la sala ven lo mismo).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, useVelocity } from "framer-motion";
import { CATEGORY_BY_ID } from "../data/categories";
import { coversOf } from "../lib/covers";
import type { Spin } from "../game/match";
import "./wheel.css";
import { t } from "../i18n";

interface Props {
  deck: string[];
  spin: Spin | null;
  /** solo quien manda puede girar */
  canSpin: boolean;
  onRequest: () => void;
  onLanded?: (spin: Spin) => void;
  size?: "hero" | "compact";
}

const FS = 3.8;
/** del borde al botón central caben unas 28 unidades */
const MAXLEN = 23;

function polar(r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [50 + r * Math.cos(a), 50 + r * Math.sin(a)] as const;
}

/** gajo centrado arriba (0°); cada gajo se dibuja así y luego se rota */
function topWedge(n: number, r = 48) {
  const half = 180 / n;
  const [x1, y1] = polar(r, -half);
  const [x2, y2] = polar(r, half);
  return `M50 50 L${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2} Z`;
}

export default function Wheel({ deck, spin, canSpin, onRequest, onLanded, size = "hero" }: Props) {
  const rot = useMotionValue(0);
  const vel = useVelocity(rot);
  const blur = useTransform(vel, (v) => Math.min(0.85, Math.abs(v) / 1400));
  const reduce = useReducedMotion();
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState<number | null>(null);
  const pointer = useRef<SVGSVGElement>(null);
  const lastNonce = useRef<number | null>(null);
  const lastIdx = useRef(0);
  const landedCb = useRef(onLanded);
  landedCb.current = onLanded;

  const n = Math.max(1, deck.length);
  const slice = 360 / n;
  const deckKey = deck.join(",");
  const clipId = `wedge-${size}-${n}`;

  // el puntero da un golpecito cada vez que pasa un borde
  useMotionValueEvent(rot, "change", (v) => {
    const i = Math.round((((-v % 360) + 360) % 360) / slice) % n;
    if (i !== lastIdx.current) {
      lastIdx.current = i;
      if (pointer.current && !reduce) animate(pointer.current, { rotate: [-18, 0] }, { duration: 0.16, ease: "easeOut" });
    }
  });

  // mazo nuevo: la rueda se recoge un poco y vuelve
  useEffect(() => {
    setLanded(null);
  }, [deckKey]);

  useEffect(() => {
    if (!spin || spin.nonce === lastNonce.current) return;
    lastNonce.current = spin.nonce;
    if (deck[spin.index] !== spin.cat) return;
    // dónde cae dentro del gajo y cuántas vueltas da salen del nonce: igual en todos los celulares, distinto en cada giro
    const jitter = ((spin.nonce % 1000) / 1000 - 0.5) * slice * 0.7;
    const turns = 4 + (Math.floor(spin.nonce / 1000) % 3);
    const cur = rot.get();
    const base = cur + 360 * turns;
    const desired = (((-spin.index * slice + jitter) % 360) + 360) % 360;
    const target = base + ((desired - (((base % 360) + 360) % 360) + 360) % 360);
    setLanded(null);
    setSpinning(true);
    const controls = animate(rot, target, {
      duration: reduce ? 0 : 4.4,
      ease: [0.15, 0.6, 0.08, 1],
      onComplete: () => {
        setSpinning(false);
        setLanded(spin.index);
        landedCb.current?.(spin);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spin, rot, reduce]);

  const wedges = useMemo(
    () =>
      deck.map((id, i) => {
        const c = CATEGORY_BY_ID[id];
        const img = coversOf(c)[0];
        // el póster (2:3) ocupa todo el ancho del gajo en su borde exterior y se recorta hacia el centro
        const w = Math.min(64, 2 * 48.6 * Math.sin(Math.PI / n) + 2);
        return { id, c, img, i, x: 50 - w / 2, y: 1, w, h: w * 1.5 };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deckKey],
  );

  return (
    <div className={`wheel wheel--${size} ${spinning ? "is-spinning" : ""} ${landed != null ? "has-landed" : ""}`}>
      <motion.div
        key={deckKey}
        className="wheel__disc"
        style={{ rotate: rot }}
        initial={reduce ? false : { scale: 0.86, opacity: 0.4 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        <svg viewBox="0 0 100 100" role="img" aria-label={`Ruleta con ${deck.map((d) => CATEGORY_BY_ID[d]?.name).join(", ")}`}>
          <defs>
            <clipPath id={clipId}>
              <path d={topWedge(n, 48.6)} />
            </clipPath>
          </defs>
          <circle cx="50" cy="50" r="49.4" fill="var(--ink)" />
          {wedges.map((w, k) => (
            <motion.g
              key={`${w.id}-${k}`}
              transform={`rotate(${k * slice} 50 50)`}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.04 * k, duration: 0.3 }}
            >
              <g clipPath={`url(#${clipId})`}>
                <rect x="0" y="0" width="100" height="52" fill="var(--paper)" />
                {w.img && <image href={w.img.sm} x={w.x} y={w.y} width={w.w} height={w.h} preserveAspectRatio="xMidYMin slice" />}
                {landed != null && landed !== k && <rect x="0" y="0" width="100" height="52" fill="var(--ink)" opacity=".55" />}
              </g>
              <path d={topWedge(n, 48.6)} fill="none" stroke="var(--ink)" strokeWidth="1.1" />
              <text
                x="0"
                y="0"
                transform="translate(50 12.4) rotate(90)"
                textAnchor="start"
                dominantBaseline="central"
                fontFamily="Dela Gothic One, sans-serif"
                fontSize={FS}
                {...(w.c.short.length * FS * 0.95 > MAXLEN ? { textLength: MAXLEN, lengthAdjust: "spacingAndGlyphs" } : {})}
                fill={landed === k ? "var(--signal)" : "var(--paper)"}
                stroke="var(--ink)"
                strokeWidth="1.5"
                strokeLinejoin="round"
                paintOrder="stroke"
              >
                {w.c.short}
              </text>
            </motion.g>
          ))}
          {landed != null && <path d={topWedge(n, 47.6)} fill="none" stroke="var(--signal)" strokeWidth="1.6" transform={`rotate(${landed * slice} 50 50)`} />}
          <circle cx="50" cy="50" r="48.8" fill="none" stroke="var(--ink)" strokeWidth="1.8" />
          {Array.from({ length: n * 3 }, (_, k) => {
            const [x, y] = polar(46.6, (k * 360) / (n * 3));
            return <circle key={k} cx={x} cy={y} r={k % 3 === 0 ? 0.9 : 0.5} fill="var(--paper)" />;
          })}
        </svg>
      </motion.div>

      {/* líneas de velocidad sobre la rueda mientras gira rápido */}
      <motion.div className="wheel__blur" style={{ opacity: blur }} aria-hidden />

      {/* el puntero es el sello: da un golpecito en cada borde */}
      <div className="wheel__pointer" aria-hidden>
        <svg ref={pointer} viewBox="0 0 40 52" width="40" height="52">
          <path d="M4 2h32v30L20 50 4 32z" fill="var(--hanko)" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" />
          <text x="20" y="18" textAnchor="middle" dominantBaseline="central" fontFamily="Dela Gothic One" fontSize="16" fill="var(--paper)">
            T
          </text>
        </svg>
      </div>

      <motion.button
        type="button"
        className="wheel__hub"
        onClick={onRequest}
        disabled={!canSpin || spinning}
        aria-label={spinning ? t("Girando") : t("Girar la ruleta")}
        whileTap={canSpin && !spinning ? { scale: 0.9 } : undefined}
        whileHover={canSpin && !spinning ? { scale: 1.06, rotate: -4 } : undefined}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
      >
        <span className={`wheel__hub-face ${!canSpin && !spinning ? "is-wait" : ""}`}>{spinning ? "…" : canSpin ? t("Gira") : t("Espera")}</span>
      </motion.button>
    </div>
  );
}
