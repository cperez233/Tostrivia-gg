/* editorial-ui · Cristian Pérez · cristianperez.me */
import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

/** Puntaje que cuenta hacia el nuevo valor cuando cambia (sube rápido, sin rebote). */
export default function RollingNumber({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  const reduce = useReducedMotion();
  const [bump, setBump] = useState(0);
  useEffect(() => {
    if (value === from.current) return;
    const start = from.current;
    from.current = value;
    if (reduce) return setShown(value);
    if (value > start) setBump((b) => b + 1);
    const c = animate(start, value, { duration: 0.7, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setShown(Math.round(v)) });
    return () => c.stop();
  }, [value, reduce]);
  return (
    <span key={bump} className="rolling anim-bump" style={{ fontVariantNumeric: "tabular-nums" }}>
      {shown.toLocaleString("es-CO")}
    </span>
  );
}
