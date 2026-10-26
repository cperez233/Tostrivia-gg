/* editorial-ui · Cristian Pérez · cristianperez.me
 * La mini sala que se ve antes de entrar: quién la creó, quién está dentro con su animal y si hay lugar.
 */
import { motion, useReducedMotion } from "framer-motion";
import { Avatar, animalName } from "./Avatar";
import type { PeekState } from "../lib/useRoomPeek";
import { t } from "../i18n";

export default function RoomPreview({ code, state, onRetry }: { code: string; state: PeekState; onRetry: () => void }) {
  const reduce = useReducedMotion();
  if (state.k === "idle") return null;
  if (state.k === "loading")
    return (
      <p className="peek peek--wait" role="status">
        <span className="peek__dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        {t("Buscando la sala {code}…", { code })}
      </p>
    );
  if (state.k !== "found")
    return (
      <div className="peek peek--bad" role="alert">
        <p>{state.k === "missing" ? t("No encontramos esa sala. Revisa el código: si el anfitrión cerró la pestaña, ya no existe.") : t("No se pudo conectar. Prueba otra vez o cambia de red.")}</p>
        <button type="button" className="link" onClick={onRetry}>
          {t("Volver a buscar")}
        </button>
      </div>
    );
  const { peek } = state;
  const online = peek.players.filter((p) => p.online).length;
  return (
    <motion.section className="peek" aria-label={t("Sala {code}", { code })} initial={reduce ? false : { y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 380, damping: 26 }}>
      <header className="peek__head">
        <p className="peek__host">{peek.hostName ? t("Sala de {name}", { name: peek.hostName }) : t("Sala {code}", { code })}</p>
        <p className="peek__count">
          {online}/{peek.max}
        </p>
      </header>
      <ul className="peek__list">
        {peek.players.map((p, i) => (
          <li key={i} className={p.online ? "" : "is-off"}>
            <Avatar animal={p.seal} size={40} title={animalName(p.seal)} />
            <span className="peek__name">{p.name}</span>
          </li>
        ))}
      </ul>
      <p className="peek__note">
        {peek.full ? t("La sala está llena.") : peek.phase !== "lobby" ? t("Hay una partida en marcha.") : t("Esperando a que empiece. Los animales apagados ya están tomados.")}
      </p>
    </motion.section>
  );
}
