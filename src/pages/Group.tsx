/* editorial-ui · Cristian Pérez · cristianperez.me
 * Jugar en grupo: crear una sala con tu animal o entrar a una con su código.
 */
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ANIMALS, Avatar } from "../components/Avatar";
import ProfilePicker from "../components/ProfilePicker";
import RoomPreview from "../components/RoomPreview";
import { useRoomPeek } from "../lib/useRoomPeek";
import { normalizeCode } from "../net/client";
import { savedProfile } from "../lib/identity";
import { MAX_PLAYERS } from "../game/match";
import { usePauseOffscreen } from "../lib/usePauseOffscreen";
import "./group.css";
import { t } from "../i18n";

type Mode = "host" | "join";

/** duraciones sin relación entre sí: los animales nunca se mueven al tiempo (motion-patterns 71) */
const BOB = [5.3, 6.1, 7.7, 4.9, 8.3, 6.7, 5.9, 7.1, 9.4, 5.6, 6.4, 8.8];

export default function Group({ onHost, onJoin }: { onHost: (name: string, seal: number) => void; onJoin: (code: string, name: string, seal: number) => void }) {
  const reduce = useReducedMotion();
  const parade = usePauseOffscreen<HTMLUListElement>();
  const [mode, setMode] = useState<Mode>("host");
  const [profile, setProfile] = useState(savedProfile);
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const full = normalizeCode(code);
  const { state, retry } = useRoomPeek(mode === "join" ? full : null);
  const taken = state.k === "found" ? state.peek.players.map((p) => p.seal) : [];
  const clash = taken.includes(profile.seal);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name.trim()) return setErr(t("Escribe tu nombre para que te reconozcan."));
    if (mode === "host") return onHost(profile.name.trim(), profile.seal);
    if (full.length !== 5) return setErr(t("El código tiene 5 letras o números."));
    if (state.k === "found" && !clash && !state.peek.full) onJoin(full, profile.name.trim(), profile.seal);
  };
  const canJoin = state.k === "found" && !clash && !state.peek.full;

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

      <div className="grp__one wrap">
        <motion.form
          className="grp__card panel"
          onSubmit={submit}
          initial={reduce ? false : { y: 40, opacity: 0, rotate: -1 }}
          animate={{ y: 0, opacity: 1, rotate: -0.4 }}
          transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.2 }}
        >
          <div className="grp__modes" role="radiogroup" aria-label={t("Qué quieres hacer")}>
            {(["host", "join"] as const).map((m) => (
              <button key={m} type="button" role="radio" aria-checked={mode === m} className={`grp__mode ${mode === m ? "is-on" : ""}`} onClick={() => (setMode(m), setErr(""))}>
                {mode === m && <motion.span layoutId="grp-mode" className="grp__modepill" transition={{ type: "spring", stiffness: 520, damping: 36 }} />}
                <span className="grp__modelabel">{m === "host" ? t("Crear sala") : t("Unirme con código")}</span>
              </button>
            ))}
          </div>

          {mode === "join" && (
            <div className="field">
              <label htmlFor="join-code">{t("Código de la sala")}</label>
              <input
                id="join-code"
                className="input input--code"
                value={code}
                onChange={(e) => (setCode(normalizeCode(e.target.value)), setErr(""))}
                placeholder="ABC12"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                inputMode="text"
                maxLength={5}
                enterKeyHint="go"
              />
            </div>
          )}
          {mode === "join" && <RoomPreview code={full} state={state} onRetry={retry} />}

          <ProfilePicker value={profile} onChange={(v) => (setProfile(v), setErr(""))} taken={mode === "join" ? taken : []} />
          {mode === "join" && clash && (
            <p className="form-err form-err--paper" role="alert">
              {t("Ese animal ya está en la sala. Elige otro para entrar.")}
            </p>
          )}
          {err && (
            <p className="form-err form-err--paper" role="alert">
              {err}
            </p>
          )}
          <button type="submit" className="btn btn--hanko btn--block" disabled={mode === "join" && !canJoin}>
            {mode === "host" ? t("Crear sala") : t("Entrar a la sala")}
          </button>
          <p className="grp__fine">{mode === "host" ? t("Después compartes el enlace o el código con los demás.") : t("Quien crea la sala te pasa el enlace o el código.")}</p>
        </motion.form>
      </div>
    </main>
  );
}
