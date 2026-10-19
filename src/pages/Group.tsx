/* editorial-ui · Cristian Pérez · cristianperez.me
 * Jugar en grupo: crear una sala con tu animal o entrar a una con su código.
 */
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ANIMALS, Avatar } from "../components/Avatar";
import ProfilePicker from "../components/ProfilePicker";
import { normalizeCode } from "../net/client";
import { savedProfile } from "../lib/identity";
import { MAX_PLAYERS } from "../game/match";
import { usePauseOffscreen } from "../lib/usePauseOffscreen";
import "./group.css";
import { t } from "../i18n";

/** duraciones sin relación entre sí: los animales nunca se mueven al tiempo (motion-patterns 71) */
const BOB = [5.3, 6.1, 7.7, 4.9, 8.3, 6.7, 5.9, 7.1, 9.4, 5.6, 6.4, 8.8];

export default function Group({ onHost, onJoin }: { onHost: (name: string, seal: number) => void; onJoin: (code: string) => void }) {
  const reduce = useReducedMotion();
  const parade = usePauseOffscreen<HTMLUListElement>();
  const [profile, setProfile] = useState(savedProfile);
  const [code, setCode] = useState("");
  const [err, setErr] = useState<{ host?: string; join?: string }>({});

  const host = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name.trim()) return setErr({ host: t("Escribe tu nombre para que te reconozcan.") });
    onHost(profile.name.trim(), profile.seal);
  };
  const join = (e: React.FormEvent) => {
    e.preventDefault();
    const c = normalizeCode(code);
    if (c.length !== 5) return setErr({ join: t("El código tiene 5 letras o números.") });
    onJoin(c);
  };

  return (
    <main className="grp">
      <header className="grp__head wrap">
        <ul ref={parade} className="parade" aria-hidden>
          {ANIMALS.map((a, i) => (
            <motion.li
              key={a.name}
              initial={reduce ? false : { y: 60, opacity: 0, rotate: i % 2 ? 12 : -12 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 16, delay: 0.15 + i * 0.045 }}
            >
              <span className="parade__bob anim-bob" style={{ "--d": `${BOB[i]}s`, "--delay": `${-i * 0.7}s` } as React.CSSProperties}>
                <Avatar animal={i} size={84} />
              </span>
            </motion.li>
          ))}
        </ul>
        <h1 className="grp__title">
          <motion.span initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            {t("En grupo")}
          </motion.span>
        </h1>
        <p className="grp__sub">{t("Hasta {n} personas, cada una desde su celular. Todos ven la misma pregunta al mismo tiempo.", { n: MAX_PLAYERS })}</p>
      </header>

      <div className="grp__grid wrap">
        <motion.form
          className="grp__card panel"
          onSubmit={host}
          initial={reduce ? false : { y: 40, opacity: 0, rotate: -1.5 }}
          animate={{ y: 0, opacity: 1, rotate: -0.6 }}
          transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.2 }}
        >
          <h2 className="grp__h">{t("Crear sala")}</h2>
          <ProfilePicker value={profile} onChange={(v) => (setProfile(v), setErr({}))} />
          {err.host && (
            <p className="form-err form-err--paper" role="alert">
              {err.host}
            </p>
          )}
          <button type="submit" className="btn btn--hanko btn--block">
            {t("Crear sala")}
          </button>
        </motion.form>

        <motion.form
          className="grp__card grp__card--join panel"
          onSubmit={join}
          initial={reduce ? false : { y: 40, opacity: 0, rotate: 1.5 }}
          animate={{ y: 0, opacity: 1, rotate: 0.6 }}
          transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.3 }}
        >
          <h2 className="grp__h">{t("Tengo un código")}</h2>
          <div className="field">
            <label htmlFor="join-code">{t("Código de la sala")}</label>
            <input
              id="join-code"
              className="input input--code"
              value={code}
              onChange={(e) => (setCode(normalizeCode(e.target.value)), setErr({}))}
              placeholder="ABC12"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              inputMode="text"
              maxLength={5}
              enterKeyHint="go"
            />
          </div>
          {err.join && (
            <p className="form-err form-err--paper" role="alert">
              {err.join}
            </p>
          )}
          <button type="submit" className="btn btn--block">
            {t("Entrar")}
          </button>
          <p className="grp__fine">{t("Quien crea la sala te pasa el enlace o el código.")}</p>
        </motion.form>
      </div>
    </main>
  );
}
