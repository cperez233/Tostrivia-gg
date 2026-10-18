/* editorial-ui · Cristian Pérez · cristianperez.me
 * La ruleta: una viñeta circular dividida en 8 familias, cada una con su trama.
 * Gira hacia el resultado que ya decidió quien la hizo girar (así todos en la sala ven lo mismo).
 */
import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { FAMILIES, categoriesOf } from "../data/categories";
import type { Spin } from "../game/match";
import type { FamilyId, Tone } from "../data/types";
import { Seal } from "./Seal";
import "./wheel.css";

const N = FAMILIES.length;
const SLICE = 360 / N;

export function makeSpin(only?: FamilyId[]): Spin {
  const fams = only?.length ? FAMILIES.filter((f) => only.includes(f.id)) : FAMILIES;
  const fam = fams[Math.floor(Math.random() * fams.length)];
  const cats = categoriesOf(fam.id);
  const cat = cats[Math.floor(Math.random() * cats.length)];
  return { family: fam.id, cat: cat.id, nonce: Math.floor(Math.random() * 1e9) };
}

function polar(r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [50 + r * Math.cos(a), 50 + r * Math.sin(a)];
}
function slicePath(i: number) {
  const [x1, y1] = polar(48, i * SLICE);
  const [x2, y2] = polar(48, (i + 1) * SLICE);
  return `M50 50 L${x1} ${y1} A48 48 0 0 1 ${x2} ${y2} Z`;
}

function TonePattern({ id, tone }: { id: string; tone: Tone }) {
  const ink = "#0d0d0d";
  switch (tone) {
    case "dots":
      return (
        <pattern id={id} width="2.2" height="2.2" patternUnits="userSpaceOnUse">
          <circle cx="1.1" cy="1.1" r=".42" fill={ink} />
        </pattern>
      );
    case "bigdots":
      return (
        <pattern id={id} width="3.6" height="3.6" patternUnits="userSpaceOnUse">
          <circle cx="1.8" cy="1.8" r=".95" fill={ink} />
        </pattern>
      );
    case "lines":
      return (
        <pattern id={id} width="2" height="2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width=".5" height="2" fill={ink} />
        </pattern>
      );
    case "cross":
      return (
        <pattern id={id} width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width=".35" height="2.4" fill={ink} />
          <rect width="2.4" height=".35" fill={ink} />
        </pattern>
      );
    case "hlines":
      return (
        <pattern id={id} width="2" height="2" patternUnits="userSpaceOnUse">
          <rect width="2" height=".55" fill={ink} />
        </pattern>
      );
    case "vlines":
      return (
        <pattern id={id} width="2.3" height="2.3" patternUnits="userSpaceOnUse">
          <rect width=".55" height="2.3" fill={ink} />
        </pattern>
      );
    case "checker":
      return (
        <pattern id={id} width="3.2" height="3.2" patternUnits="userSpaceOnUse">
          <rect width="1.6" height="1.6" fill={ink} />
          <rect x="1.6" y="1.6" width="1.6" height="1.6" fill={ink} />
        </pattern>
      );
    case "grid":
      return (
        <pattern id={id} width="3" height="3" patternUnits="userSpaceOnUse">
          <rect width="3" height=".4" fill={ink} />
          <rect width=".4" height="3" fill={ink} />
        </pattern>
      );
  }
}

interface Props {
  spin: Spin | null;
  /** solo quien manda puede girar */
  canSpin: boolean;
  onRequest: () => void;
  onLanded?: (spin: Spin) => void;
  size?: "hero" | "compact";
}

export default function Wheel({ spin, canSpin, onRequest, onLanded, size = "hero" }: Props) {
  const rot = useMotionValue(0);
  const reduce = useReducedMotion();
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState<FamilyId | null>(null);
  const lastNonce = useRef<number | null>(null);
  const landedCb = useRef(onLanded);
  landedCb.current = onLanded;

  useEffect(() => {
    if (!spin || spin.nonce === lastNonce.current) return;
    lastNonce.current = spin.nonce;
    const i = FAMILIES.findIndex((f) => f.id === spin.family);
    const jitter = ((spin.nonce % 1000) / 1000 - 0.5) * SLICE * 0.6;
    const center = i * SLICE + SLICE / 2;
    const cur = rot.get();
    const base = cur + 360 * 5;
    const desired = (((360 - center + jitter) % 360) + 360) % 360;
    const target = base + ((desired - (base % 360) + 360) % 360);
    setLanded(null);
    setSpinning(true);
    const controls = animate(rot, target, {
      duration: reduce ? 0 : 4.2,
      ease: [0.12, 0.62, 0.08, 1],
      onComplete: () => {
        setSpinning(false);
        setLanded(spin.family as FamilyId);
        landedCb.current?.(spin);
      },
    });
    return () => controls.stop();
  }, [spin, rot, reduce]);

  return (
    <div className={`wheel wheel--${size} ${spinning ? "is-spinning" : ""}`}>
      <svg className="wheel__speed" viewBox="0 0 100 100" aria-hidden>
        {Array.from({ length: 48 }, (_, k) => {
          const [x1, y1] = polar(51, k * 7.5);
          const [x2, y2] = polar(k % 3 === 0 ? 70 : 62, k * 7.5);
          return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink)" strokeWidth={k % 2 ? 0.5 : 0.9} />;
        })}
      </svg>

      <motion.div className="wheel__disc" style={{ rotate: rot }}>
        <svg viewBox="0 0 100 100" role="img" aria-label="Ruleta de categorías">
          <defs>
            {FAMILIES.map((f) => (
              <TonePattern key={f.id} id={`tone-${f.id}`} tone={f.tone} />
            ))}
          </defs>
          <circle cx="50" cy="50" r="49.2" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.6" />
          {FAMILIES.map((f, i) => {
            const on = landed === f.id;
            return (
              <g key={f.id}>
                <path d={slicePath(i)} fill="var(--paper)" />
                <path d={slicePath(i)} fill={on ? "var(--ink)" : `url(#tone-${f.id})`} opacity={on ? 1 : 0.75} />
                <path d={slicePath(i)} fill="none" stroke="var(--ink)" strokeWidth=".9" />
              </g>
            );
          })}
          {FAMILIES.map((f, i) => {
            const mid = i * SLICE + SLICE / 2;
            const [x, y] = polar(31, mid);
            const on = landed === f.id;
            const w = Math.max(14, f.wheel.length * 3.25 + 4);
            const turn = mid < 180 ? mid - 90 : mid + 90;
            return (
              <g key={`l-${f.id}`} transform={`translate(${x} ${y}) rotate(${turn})`}>
                <rect x={-w / 2} y="-3.6" width={w} height="7.2" fill={on ? "var(--hanko)" : "var(--paper)"} stroke="var(--ink)" strokeWidth=".6" />
                <text
                  x="0"
                  y=".2"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="Dela Gothic One, sans-serif"
                  fontSize="4.1"
                  fill={on ? "var(--paper)" : "var(--ink)"}
                >
                  {f.wheel}
                </text>
              </g>
            );
          })}
          <circle cx="50" cy="50" r="10.5" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.4" />
        </svg>
      </motion.div>

      {/* el puntero es el sello */}
      <div className="wheel__pointer" aria-hidden>
        <svg viewBox="0 0 40 52" width="40" height="52">
          <path d="M4 2h32v30L20 50 4 32z" fill="var(--hanko)" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" />
          <text x="20" y="19" textAnchor="middle" dominantBaseline="central" fontFamily="Dela Gothic One" fontSize="17" fill="var(--paper)">
            T
          </text>
        </svg>
      </div>

      <button
        type="button"
        className="wheel__hub"
        onClick={onRequest}
        disabled={!canSpin || spinning}
        aria-label={spinning ? "Girando" : "Girar la ruleta"}
      >
        <Seal text={spinning ? "…" : "¿?"} size={size === "hero" ? 76 : 56} variant={0} />
        <span className="wheel__hub-label">{spinning ? "Gira…" : canSpin ? "Girar" : "Espera"}</span>
      </button>
    </div>
  );
}
