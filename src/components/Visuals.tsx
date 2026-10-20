/* editorial-ui · Cristian Pérez · cristianperez.me
 * Preguntas que no son solo texto (ver Visual en src/data/types.ts):
 *  - emoji:  los emojis de la primera línea se sueltan uno a uno y rebotan al caer
 *  - quote:  la frase sale en un globo de cómic
 *  - poster: el póster de una categoría se va aclarando mientras corre el reloj; al responder se ve entero
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { PosterFx, Visual } from "../data/types";
import posterZoom from "../data/posterZoom.json";
import { posterOf } from "../lib/covers";
import { t } from "../i18n";
import "./visuals.css";

/** "emojis\n¿Qué película es?" → ["emojis", "¿Qué película es?"] */
function splitQ(q: string): [string, string] {
  const i = q.indexOf("\n");
  return i < 0 ? ["", q] : [q.slice(0, i), q.slice(i + 1)];
}

const graphemes = (s: string): string[] => {
  const Seg = (Intl as unknown as { Segmenter?: new (l?: string, o?: { granularity: string }) => { segment(s: string): Iterable<{ segment: string }> } }).Segmenter;
  return Seg ? Array.from(new Seg(undefined, { granularity: "grapheme" }).segment(s), (x) => x.segment) : Array.from(s);
};

export function QuestionText({ q, visual }: { q: string; visual?: Visual }) {
  const reduce = useReducedMotion();
  if (visual?.v === "emoji") {
    const [line, ask] = splitQ(q);
    const list = graphemes(line.replace(/\s+/g, ""));
    return (
      <>
        <div className="emoji" role="img" aria-label={list.join(" ")}>
          {list.map((e, i) => (
            <motion.span
              key={`${i}-${e}`}
              className="emoji__e"
              aria-hidden
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -60, scale: 0.3, rotate: -30 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              transition={{ delay: 0.25 + i * 0.22, type: "spring", stiffness: 460, damping: 12 }}
            >
              <span className="emoji__bob" style={{ animationDelay: `${-i * 0.37}s` }}>
                {e}
              </span>
            </motion.span>
          ))}
        </div>
        <h1 className="qpanel__q">{ask}</h1>
      </>
    );
  }
  if (visual?.v === "quote") {
    const [line, ask] = splitQ(q);
    return (
      <>
        <motion.figure
          className="balloon"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: -3, y: 14 }}
          animate={{ opacity: 1, scale: 1, rotate: -0.6, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 380, damping: 18 }}
        >
          <blockquote>{line}</blockquote>
        </motion.figure>
        <h1 className="qpanel__q balloon__ask">{ask}</h1>
      </>
    );
  }
  return <h1 className="qpanel__q">{q}</h1>;
}

/* ───────── póster que se aclara ───────── */

const hash = (s: string) => [...s].reduce((h, ch) => Math.imul(h ^ ch.codePointAt(0)!, 16777619) >>> 0, 2166136261);

/** pixelado: del primer vistazo (bloques gordos) a bloques todavía lo bastante grandes para no leer el título */
const PIXEL_FROM = 5;
const PIXEL_TO = 34;
/** borroso: formas y colores al principio; al final casi nítido pero el texto sigue sin leerse */
const BLUR_FROM = 20;
const BLUR_TO = 5;
/** detalle difuminado: el filtro se aplica antes del zoom, así que a 4,6x estos px se ven ~14 y al final ~2 */
const ZBLUR_FROM = 3.2;
const ZBLUR_TO = 0.9;
/**
 * detalle: un recorte del póster que se va alejando. Dónde cae se calcula aparte (src/data/posterZoom.json: scripts/zoom-posters.py)
 * para que la ventana final nunca pise el título ni textos; trae la escala final del póster y hasta 3 puntos posibles.
 * La escala inicial es el doble de la final.
 */
const ZOOMS = posterZoom as unknown as Record<string, [number, [number, number][]]>;

interface PosterProps {
  id: string;
  fx: PosterFx;
  /** momento (Date.now) en que arrancó el reloj de la pregunta; 0 si todavía no */
  startAt: number;
  duration: number;
  /** ya se respondió o se acabó el tiempo */
  revealed: boolean;
  qkey: string;
}

export function PosterStage({ id, fx, startAt, duration, revealed, qkey }: PosterProps) {
  const reduce = useReducedMotion();
  const poster = posterOf(id);
  const [ready, setReady] = useState(false);
  const running = startAt > 0 && !revealed;
  // dónde cae el recorte del detalle: arriba y al medio, lejos del título
  const h = useMemo(() => hash(`${id}:${qkey}`), [id, qkey]);
  const [zoomTo, spots] = ZOOMS[id] ?? [2.3, [[50, 50]]];
  const [ox, oy] = spots[h % spots.length];
  // lo que falta del reloj en el momento en que empieza la transición
  const left = useMemo(() => (running ? Math.max(0.2, (startAt + duration - Date.now()) / 1000) : 0), [running, startAt, duration]);
  const instant = reduce ? { duration: 0 } : undefined;

  if (!poster) return null;
  return (
    <div className={`pstage pstage--${fx} ${revealed ? "is-revealed" : ""} ${ready ? "is-ready" : ""}`} role="img" aria-label={t("Póster que se va aclarando")}>
      <div className="pstage__frame">
        {fx === "pixel" ? (
          <PixelCanvas src={poster.lg} running={running} revealed={revealed} startAt={startAt} duration={duration} onReady={() => setReady(true)} />
        ) : (
          <div className="pstage__crop">
            <motion.div
              className="pstage__layer"
              style={{ originX: `${revealed ? 50 : ox}%`, originY: `${revealed ? 50 : oy}%` }}
              initial={false}
              animate={
                fx === "blur"
                  ? { filter: `blur(${revealed ? 0 : running ? BLUR_TO : BLUR_FROM}px)`, scale: revealed ? 1 : 1.08 }
                  : fx === "zblur"
                    ? { scale: revealed ? 1 : running ? zoomTo : zoomTo * 2, filter: `blur(${revealed ? 0 : running ? ZBLUR_TO : ZBLUR_FROM}px)` }
                    : { scale: revealed ? 1 : running ? zoomTo : zoomTo * 2 }
              }
              transition={
                instant ??
                (revealed ? { duration: 0.8, ease: [0.22, 1, 0.36, 1] } : running ? { duration: left, ease: "linear", scale: fx === "blur" ? { duration: 0.3 } : { duration: left, ease: "linear" } } : { duration: 0.2 })
              }
            >
              <img src={poster.lg} alt="" draggable={false} onLoad={() => setReady(true)} ref={(el) => void (el?.complete && el.naturalWidth > 0 && !ready && setReady(true))} />
            </motion.div>
          </div>
        )}
        <div className="pstage__shine" aria-hidden />
      </div>
      <p className="pstage__hint">
        {fx === "pixel" && t("Póster pixelado")}
        {fx === "blur" && t("Póster borroso")}
        {fx === "zoom" && t("Detalle del póster")}
        {fx === "zblur" && t("Detalle borroso")}
        <span className="muted"> · {t("se aclara con el reloj")}</span>
      </p>
    </div>
  );
}

/** pixelado de verdad: se dibuja chiquito y se estira sin suavizar; cada tanto sube la resolución */
function PixelCanvas({ src, running, revealed, startAt, duration, onReady }: { src: string; running: boolean; revealed: boolean; startAt: number; duration: number; onReady: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const img = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const last = useRef(-1);

  useEffect(() => {
    const im = new Image();
    im.decoding = "async";
    im.onload = () => {
      img.current = im;
      setLoaded(true);
      onReady();
    };
    im.src = src;
    return () => {
      im.onload = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => {
    const c = canvas.current;
    const im = img.current;
    if (!c || !im || !loaded) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const W = c.width;
    const H = c.height;
    const draw = (n: number) => {
      if (n === last.current) return;
      last.current = n;
      const tiny = document.createElement("canvas");
      tiny.width = n;
      tiny.height = Math.max(1, Math.round(n * 1.5));
      const tctx = tiny.getContext("2d");
      if (!tctx) return;
      tctx.drawImage(im, 0, 0, tiny.width, tiny.height);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(tiny, 0, 0, W, H);
    };
    if (revealed) {
      last.current = -1;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(im, 0, 0, W, H);
      return;
    }
    if (!running) {
      draw(PIXEL_FROM);
      return;
    }
    let raf = 0;
    const tick = () => {
      const p = Math.max(0, Math.min(1, (Date.now() - startAt) / duration));
      // sube de a pasos: se nota cada vez que cambia
      draw(Math.round(PIXEL_FROM + (PIXEL_TO - PIXEL_FROM) * Math.pow(p, 1.1)));
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [loaded, running, revealed, startAt, duration]);

  return <canvas ref={canvas} className="pstage__canvas" width={300} height={450} />;
}
