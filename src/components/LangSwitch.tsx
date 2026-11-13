/* editorial-ui · Cristian Pérez · cristianperez.me
 * Selector de idioma: dos sellos, ES y EN. La primera vez manda el idioma del navegador; luego, lo que se elija aquí.
 * Al cambiar, un sello de tinta nace en el botón pulsado y crece hasta cubrir la pantalla; el saludo del idioma nuevo
 * se estampa, el texto cambia por debajo y el sello se encoge de vuelta al botón (motion-patterns 87).
 */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LANGS, setLang, t, useLang, type Lang } from "../i18n";
import { FocusLines } from "./Wipe";
import "./lang.css";

/** el saludo que se estampa, en el idioma al que se va, con su eco en katakana */
const HELLO: Record<Lang, { word: string; kana: string; name: string }> = {
  en: { word: "Hello!", kana: "ハロー", name: "English" },
  es: { word: "¡Hola!", kana: "オラ", name: "Español" },
};

// tiempos en ms: tapa, cambia el texto con todo cubierto, destapa y desbloquea
const COVER = 520;
const SWAP = 640;
const UNCOVER = 1080;
const UNLOCK = 1640;
const cut = [0.76, 0, 0.24, 1] as [number, number, number, number];

interface Burst {
  n: number;
  lang: Lang;
  cx: number;
  cy: number;
  r: number;
}

export default function LangSwitch() {
  const lang = useLang();
  const reduce = useReducedMotion();
  /** la elección se marca al instante; el texto cambia cuando el sello ya lo tapa */
  const [pending, setPending] = useState<Lang | null>(null);
  const [burst, setBurst] = useState<Burst | null>(null);
  const busy = useRef(false);
  const timers = useRef<number[]>([]);
  const shown = pending ?? lang;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const choose = (l: Lang, e: React.MouseEvent<HTMLButtonElement>) => {
    if (l === shown || busy.current) return;
    if (reduce) return setLang(l);
    busy.current = true;
    const b = e.currentTarget.getBoundingClientRect();
    // si viene del teclado (detail 0) el centro del botón también sirve: nace donde está
    const cx = b.left + b.width / 2;
    const cy = b.top + b.height / 2;
    const r = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) + 40;
    setPending(l);
    setBurst({ n: Date.now(), lang: l, cx, cy, r });
    document.documentElement.classList.add("lang-busy");
    timers.current = [
      window.setTimeout(() => setLang(l), SWAP),
      window.setTimeout(() => setBurst(null), UNCOVER),
      window.setTimeout(() => {
        setPending(null);
        busy.current = false;
        document.documentElement.classList.remove("lang-busy");
      }, UNLOCK),
    ];
  };

  return (
    <>
      <div className="lang" role="radiogroup" aria-label={t("Idioma")}>
        {LANGS.map((l) => (
          <button key={l.id} type="button" role="radio" aria-checked={shown === l.id} lang={l.id} title={l.name} aria-label={l.name} className={`lang__opt ${shown === l.id ? "is-on" : ""}`} onClick={(e) => choose(l.id, e)}>
            {shown === l.id && <motion.span layoutId="lang-pill" className="lang__pill" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
            <span className="lang__label">{l.label}</span>
          </button>
        ))}
      </div>
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>{burst && <Stamp key={burst.n} burst={burst} />}</AnimatePresence>,
          document.body,
        )}
    </>
  );
}

const circle = (b: Burst, r: number) => `circle(${r}px at ${b.cx}px ${b.cy}px)`;

/** dos discos que crecen desde el botón (tinta delante, bermellón detrás) y el saludo estampado encima */
function Stamp({ burst }: { burst: Burst }) {
  const hi = HELLO[burst.lang];
  const layer = (delay: number, exitDelay: number) => ({
    initial: { clipPath: circle(burst, 0) },
    animate: { clipPath: circle(burst, burst.r), transition: { duration: COVER / 1000, delay, ease: cut } },
    exit: { clipPath: circle(burst, 0), transition: { duration: 0.5, delay: exitDelay, ease: cut } },
  });
  return (
    <div className="langcut" aria-hidden>
      {/* el aro de tinta va primero y se va el último: queda como el borde del sello */}
      <motion.div className="langcut__disc langcut__disc--ink" {...layer(0, 0.09)} />
      <motion.div className="langcut__disc langcut__disc--hanko" {...layer(0.07, 0)}>
        <motion.span
          className="langcut__rays"
          style={{ left: burst.cx, top: burst.cy }}
          initial={{ rotate: -8, scale: 0.6 }}
          animate={{ rotate: 6, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <FocusLines className="langcut__lines" />
        </motion.span>
        <span className="langcut__stage">
          <motion.span
            className="langcut__kana"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 0.17, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            {hi.kana}
          </motion.span>
          <motion.span
            className="langcut__word"
            initial={{ scale: 2.4, rotate: -14, opacity: 0 }}
            animate={{ scale: 1, rotate: -5, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0, transition: { duration: 0.16 } }}
            transition={{ type: "spring", stiffness: 640, damping: 24, delay: 0.38 }}
          >
            {hi.word}
          </motion.span>
          <motion.span
            className="langcut__name"
            lang={burst.lang}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
          >
            {hi.name}
          </motion.span>
        </span>
      </motion.div>
    </div>
  );
}
