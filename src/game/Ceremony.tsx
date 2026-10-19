/* editorial-ui · Cristian Pérez · cristianperez.me
 * El cierre de una partida en grupo: el podio se arma de a uno (tercero, segundo y, con su pausa, el primero),
 * cada puntaje cuenta hasta su total y al final quedan los botones para seguir jugando.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, animate, motion, useReducedMotion } from "framer-motion";
import type { Player } from "./match";
import { Avatar } from "../components/Avatar";
import { FocusLines } from "../components/Wipe";
import { locale, t } from "../i18n";

interface Props {
  players: Player[];
  me: string;
  /** lo que se puede hacer cuando termina el desfile */
  actions: React.ReactNode;
  onDetails: () => void;
}

// cuándo entra cada cosa (s): tercero, segundo, la pausa del primero, el primero y los botones
const AT = { third: 0.9, second: 2.3, drum: 3.5, first: 4.9, done: 6.4 };

export default function Ceremony({ players, me, actions, onDetails }: Props) {
  const reduce = useReducedMotion();
  const [time, setT] = useState(reduce ? 99 : 0);
  useEffect(() => {
    if (reduce) return;
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const s = (performance.now() - start) / 1000;
      setT(s);
      if (s < AT.done + 0.2) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);
  const skip = () => setT(99);

  const [first, second, third] = players;
  const rest = players.slice(3);
  const done = time >= AT.done;
  const mine = players.findIndex((p) => p.id === me) + 1;

  return (
    <div className="ceremony">
      <FocusLines className={`ceremony__lines anim-spin ${time >= AT.first ? "is-on" : ""}`} />
      <div className="ceremony__in wrap">
        <motion.h1 className="ceremony__title" initial={reduce ? false : { y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          {t("Resultados")}
        </motion.h1>

        <AnimatePresence>
          {time >= AT.drum && time < AT.first && (
            <motion.p key="drum" className="ceremony__drum" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: [0.6, 1.08, 1], opacity: 1 }} exit={{ opacity: 0, scale: 1.3 }} transition={{ duration: 0.5 }}>
              {t("Y el primer lugar es…")}
            </motion.p>
          )}
        </AnimatePresence>

        <ol className="stands" aria-label={t("Podio")}>
          {/* orden visual: segundo, primero, tercero */}
          {second && <Stand p={second} n={2} show={time >= AT.second} me={me} />}
          {first && <Stand p={first} n={1} show={time >= AT.first} me={me} />}
          {third && <Stand p={third} n={3} show={time >= AT.third} me={me} />}
        </ol>

        {!done && (
          <button type="button" className="link ceremony__skip" onClick={skip}>
            {t("Saltar")}
          </button>
        )}

        <AnimatePresence>
          {done && (
            <motion.div className="ceremony__after" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 360, damping: 28 }}>
              {rest.length > 0 && (
                <ol className="ceremony__rest" start={4}>
                  {rest.map((p, i) => (
                    <li key={p.id} className={p.id === me ? "is-me" : ""}>
                      <span className="ceremony__restn">{i + 4}</span>
                      <Avatar animal={p.seal} size={30} />
                      <span className="ceremony__restname">{p.name}</span>
                      <span className="ceremony__restpts">{p.score.toLocaleString(locale())}</span>
                    </li>
                  ))}
                </ol>
              )}
              <p className="ceremony__mine">{mine === 1 ? t("¡Ganaste la ronda!") : t("Quedaste de {n}.º", { n: mine })}</p>
              <div className="ceremony__actions">
                {actions}
                <button type="button" className="btn btn--ghost" onClick={onDetails}>
                  {t("Ver mis resultados")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Stand({ p, n, show, me }: { p: Player; n: 1 | 2 | 3; show: boolean; me: string }) {
  const reduce = useReducedMotion();
  const [pts, setPts] = useState(reduce ? p.score : 0);
  useEffect(() => {
    if (!show || reduce) return;
    const c = animate(0, p.score, { duration: n === 1 ? 1.3 : 0.9, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setPts(Math.round(v)) });
    return () => c.stop();
  }, [show, p.score, n, reduce]);
  return (
    <li className={`stand stand--${n} ${p.id === me ? "is-me" : ""}`} aria-label={t("{n}.º {name}, {pts} puntos", { n, name: p.name, pts: p.score })}>
      <div className="stand__who">
        <AnimatePresence>
          {show && (
            <motion.div
              className="stand__player"
              initial={reduce ? false : { y: -220, opacity: 0, rotate: n === 1 ? -10 : 8 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: n === 1 ? 11 : 16 }}
            >
              {n === 1 && (
                <motion.span className="stand__crown" initial={reduce ? false : { scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: -12 }} transition={{ delay: 0.35, type: "spring", stiffness: 500, damping: 12 }} aria-hidden>
                  👑
                </motion.span>
              )}
              <Avatar animal={p.seal} size={n === 1 ? 84 : 64} />
              <span className="stand__name">{p.id === me ? t("{name} (tú)", { name: p.name }) : p.name}</span>
              <span className="stand__pts">{pts.toLocaleString(locale())}</span>
              <span className="stand__meta">
                {p.correct} {p.correct === 1 ? t("acierto") : t("aciertos")}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.div
        className="stand__block"
        initial={reduce ? false : { scaleY: 0 }}
        animate={{ scaleY: show ? 1 : 0.08 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
      >
        <span>{n}</span>
      </motion.div>
    </li>
  );
}
