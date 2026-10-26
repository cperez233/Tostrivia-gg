/* editorial-ui · Cristian Pérez · cristianperez.me
 * La ruleta: cada gajo es una categoría del mazo, con su portada. El mazo cambia con el filtro.
 * Gira hacia el gajo que ya decidió quien la hizo girar (así todos en la sala ven lo mismo).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, useVelocity } from "framer-motion";
import { CATEGORY_BY_ID } from "../data/categories";
import { coversOf } from "../lib/covers";
import { rng } from "../lib/rng";
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

/** curvas de frenado: arranque seco y cola larga, la clásica, y una más pesada que se arrastra al final */
const CURVES: [number, number, number, number][] = [
  [0.08, 0.7, 0.08, 1],
  [0.12, 0.62, 0.09, 1],
  [0.22, 0.48, 0.1, 1],
];
type Ending = "clean" | "spring" | "push" | "wobble";
/** cómo se asienta: limpia (30 %), se pasa un poco y vuelve (30 %), casi cambia de gajo y la empujan de vuelta (20 %), rebota varias veces (20 %) */
const pickEnding = (x: number): Ending => (x < 0.3 ? "clean" : x < 0.6 ? "spring" : x < 0.8 ? "push" : "wobble");

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
  const spinRef = useRef(spin);
  spinRef.current = spin;
  const spinNonce = spin?.nonce ?? null;

  const n = Math.max(1, deck.length);
  const slice = 360 / n;
  const deckKey = deck.join(",");
  const clipId = `wedge-${size}-${n}`;

  // el puntero es una lengüeta: cada borde que pasa lo dobla, más fuerte y más rápido cuanto más rápido gira la rueda;
  // cuando va despacio se queda doblado un instante y vuelve con un pequeño rebote
  useMotionValueEvent(rot, "change", (v) => {
    const i = Math.round((((-v % 360) + 360) % 360) / slice) % n;
    if (i !== lastIdx.current) {
      lastIdx.current = i;
      if (!pointer.current || reduce) return;
      const speed = Math.abs(vel.get());
      const bend = Math.min(34, 10 + speed / 38);
      if (speed > 520) animate(pointer.current, { rotate: [-bend, 0] }, { duration: 0.11, ease: "easeOut" });
      else animate(pointer.current, { rotate: [-bend, 0] }, { type: "spring", stiffness: 260, damping: 9, mass: 0.7 });
    }
  });

  // mazo nuevo: la rueda se recoge un poco y vuelve
  useEffect(() => {
    setLanded(null);
  }, [deckKey]);

  // si quien manda cierra el resultado (spin = null), se quita el resaltado del gajo
  useEffect(() => {
    if (spinNonce === null) setLanded(null);
  }, [spinNonce]);

  useEffect(() => {
    const spin = spinRef.current;
    if (!spin || spin.nonce === lastNonce.current) return;
    lastNonce.current = spin.nonce;
    if (deck[spin.index] !== spin.cat) return;
    // dónde cae dentro del gajo y cuántas vueltas da salen del nonce: igual en todos los celulares, distinto en cada giro
    // todo sale del nonce (igual en todos los celulares) pero cada giro es distinto: vueltas, duración, curva, impulso inicial y cómo se asienta
    const r = rng(spin.nonce ^ 0x9e3779b9);
    const jitter = (r() - 0.5) * slice * 0.7;
    const turns = 4 + Math.floor(r() * 3);
    const long = 3.8 + r() * 1.3;
    const curve = CURVES[Math.floor(r() * CURVES.length)];
    const windup = r() < 0.6 ? 5 + r() * 8 : 0;
    const ending = pickEnding(r());
    const cur = rot.get();
    const base = cur + 360 * turns;
    const desired = (((-spin.index * slice + jitter) % 360) + 360) % 360;
    const target = base + ((desired - (((base % 360) + 360) % 360) + 360) % 360);
    setLanded(null);
    setSpinning(true);
    let finished = false;
    const done = () => {
      finished = true;
      setSpinning(false);
      setLanded(spin.index);
      landedCb.current?.(spin);
    };
    let current: ReturnType<typeof animate>;
    const settle = () => {
      // el punto de la rueda dentro de su gajo es `jitter` desde el centro; el borde está a slice/2
      if (ending === "clean") return done();
      if (ending === "push") {
        // casi cambia de gajo: la lengüeta la frena y la empuja de vuelta
        const room = slice / 2 - jitter;
        current = animate(rot, target + room * 0.9, { duration: 0.35, ease: "easeOut", onComplete: () => {
          if (pointer.current) animate(pointer.current, { rotate: [-26, 0] }, { type: "spring", stiffness: 240, damping: 8 });
          current = animate(rot, target, { type: "spring", stiffness: 110, damping: 13, mass: 0.9, onComplete: done });
        } });
        return;
      }
      const wobble = ending === "wobble";
      current = animate(rot, target, wobble ? { type: "spring", stiffness: 95, damping: 5.5, mass: 0.9, onComplete: done } : { type: "spring", stiffness: 150, damping: 12, mass: 0.8, onComplete: done });
    };
    if (reduce) {
      current = animate(rot, target, { duration: 0, onComplete: done });
    } else {
      // 1) a veces se echa hacia atrás para tomar impulso, 2) arranca y frena largo, 3) se asienta de una de cuatro maneras
      const over = ending === "spring" ? slice * 0.09 : ending === "wobble" ? slice * 0.2 : 0;
      const run = () => {
        current = animate(rot, ending === "push" ? target - slice * 0.02 : target + over, { duration: long, ease: curve, onComplete: settle });
      };
      if (windup) current = animate(rot, cur - windup, { duration: 0.22 + windup / 80, ease: [0.3, 0, 0.45, 1], onComplete: run });
      else run();
    }
    return () => {
      current.stop();
      if (!finished) {
        // si se cortó (X, cambio de mazo, desmontaje) no puede quedar "girando"
        setSpinning(false);
        if (lastNonce.current === spin.nonce) lastNonce.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinNonce, rot, reduce]);

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
