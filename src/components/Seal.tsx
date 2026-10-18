/* editorial-ui · Cristian Pérez · cristianperez.me
 * El motivo de la marca: el sello hanko del editor. Logo, avatar de jugador, sello de acierto y del puntaje final.
 */
import { memo } from "react";

const SHAPES = ["square", "round", "square", "rounded", "round", "square", "rounded", "round", "square", "rounded"] as const;

interface Props {
  text: string;
  variant?: number;
  size?: number;
  ink?: boolean;
  className?: string;
  title?: string;
}

function SealBase({ text, variant = 0, size = 44, ink, className, title }: Props) {
  const shape = SHAPES[variant % SHAPES.length];
  const color = ink ?? variant % 2 === 1 ? "var(--ink)" : "var(--hanko)";
  const tilt = ((variant * 37) % 11) - 5;
  const chars = [...text.trim()].slice(0, 2).join("").toUpperCase() || "?";
  const fs = chars.length > 1 ? 34 : 46;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ transform: `rotate(${tilt}deg)`, flexShrink: 0 }}
    >
      {shape === "round" ? (
        <>
          <circle cx="50" cy="50" r="46" fill={color} />
          <circle cx="50" cy="50" r="38" fill="none" stroke="var(--paper)" strokeWidth="3" />
        </>
      ) : (
        <>
          <rect x="4" y="4" width="92" height="92" rx={shape === "rounded" ? 18 : 3} fill={color} />
          <rect x="12" y="12" width="76" height="76" rx={shape === "rounded" ? 12 : 1} fill="none" stroke="var(--paper)" strokeWidth="3" />
        </>
      )}
      {/* muescas de tinta gastada: el sello no queda perfecto */}
      <circle cx="20" cy="83" r="3.2" fill="var(--paper)" opacity=".85" />
      <circle cx="86" cy="22" r="2.2" fill="var(--paper)" opacity=".8" />
      <text
        x="50"
        y="51"
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--paper)"
        fontFamily="Dela Gothic One, sans-serif"
        fontSize={fs}
      >
        {chars}
      </text>
    </svg>
  );
}

export const Seal = memo(SealBase);

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <span className="logo">
      <Seal text="T" size={size} variant={0} />
      <span className="logo__word">Tostrivia</span>
    </span>
  );
}
