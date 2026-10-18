/* editorial-ui · Cristian Pérez · cristianperez.me
 * Una partida en marcha (solo o en grupo). En grupo, la fase "lobby" es la sala de espera.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import type { GameClient, NetStatus } from "../net/client";
import type { Snapshot } from "../game/match";
import { MAX_PLAYERS } from "../game/match";
import { useGame } from "../game/useGame";
import GameScreen from "../game/GameScreen";
import Wheel, { makeSpin } from "../components/Wheel";
import { Logo, Seal } from "../components/Seal";
import { CATEGORIES, CATEGORY_BY_ID, FAMILIES, FAMILY_BY_ID } from "../data/categories";
import { BANK } from "../data/bank";
import { newSeed } from "../lib/rng";
import "./room.css";

export default function Room({ client, onExit }: { client: GameClient; onExit: () => void }) {
  const { snap, at, status } = useGame(client);
  if (status !== "open" || !snap) return <NetState status={status} code={client.code} onExit={onExit} />;
  if (snap.phase === "lobby") return <Lobby client={client} snap={snap} onExit={onExit} />;
  return <GameScreen client={client} snap={snap} at={at} onExit={onExit} />;
}

const NET_TEXT: Record<NetStatus, [string, string]> = {
  connecting: ["Conectando…", "Abriendo la línea con la sala."],
  open: ["", ""],
  lost: ["Se perdió la conexión", "No llegan datos del anfitrión. Si vuelve en unos segundos, seguimos donde íbamos."],
  closed: ["La sala se cerró", "El anfitrión salió o cerró la pestaña. Puedes crear una sala nueva desde el inicio."],
  full: ["La sala está llena", `Ya hay ${MAX_PLAYERS} personas jugando. Pídele al anfitrión que abra otra.`],
  missing: ["No encontramos esa sala", "Revisa el código. Si el anfitrión cerró la pestaña, la sala ya no existe."],
  error: ["No se pudo conectar", "La red bloqueó la conexión entre navegadores o el servidor de enlace no respondió. Prueba con otra red o vuelve a intentarlo."],
};

function NetState({ status, code, onExit }: { status: NetStatus; code: string | null; onExit: () => void }) {
  const [t, d] = NET_TEXT[status];
  return (
    <div className="netstate wrap">
      <Logo size={36} />
      <motion.div className="netstate__card panel" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        {status === "connecting" && (
          <div className="netstate__dots" aria-hidden>
            <span className="anim-dot" />
            <span className="anim-dot" />
            <span className="anim-dot" />
          </div>
        )}
        <h1>{t}</h1>
        <p>{d}</p>
        {code && <p className="muted">Sala {code}</p>}
        <button type="button" className="btn" onClick={onExit}>
          Volver al inicio
        </button>
      </motion.div>
    </div>
  );
}

function Lobby({ client, snap, onExit }: { client: GameClient; snap: Snapshot; onExit: () => void }) {
  const [copied, setCopied] = useState(false);
  const link = `${location.origin}/sala/${client.code}`;
  const host = snap.players.find((p) => p.id === snap.hostId);
  const cat = snap.cat ? CATEGORY_BY_ID[snap.cat] : null;
  const online = snap.players.filter((p) => p.online);
  const [landed, setLanded] = useState<number | null>(null);
  const spinShown = snap.spin && landed !== snap.spin.nonce;

  const share = async () => {
    const text = `Entra a mi sala de Tostrivia. Código ${client.code}`;
    try {
      if (navigator.share) await navigator.share({ text, url: link });
      else {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      /* cancelado */
    }
  };

  return (
    <div className="lobby">
      <header className="lobby__top wrap">
        <Logo size={34} />
        <button type="button" className="link" onClick={onExit}>
          {client.isHost ? "Cerrar sala" : "Salir"}
        </button>
      </header>

      <main className="lobby__grid wrap">
        <section className="lobby__code panel" aria-labelledby="code-t">
          <p className="label">Código de la sala</p>
          <h1 id="code-t" className="lobby__codetext" aria-label={`Código ${client.code?.split("").join(" ")}`}>
            {client.code?.split("").map((ch, i) => (
              <motion.span key={i} initial={{ y: 30, opacity: 0, rotate: -8 }} animate={{ y: 0, opacity: 1, rotate: 0 }} transition={{ delay: 0.05 * i, type: "spring", stiffness: 500, damping: 22 }}>
                {ch}
              </motion.span>
            ))}
          </h1>
          <p className="lobby__link">{link.replace(/^https?:\/\//, "")}</p>
          <div className="lobby__actions">
            <button type="button" className="btn btn--small" onClick={share}>
              {copied ? "Enlace copiado" : "Compartir enlace"}
            </button>
          </div>
        </section>

        <section className="lobby__roster panel" aria-labelledby="roster-t">
          <div className="lobby__roster-head">
            <h2 id="roster-t">Jugadores</h2>
            <span className="lobby__count">
              {online.length}/{MAX_PLAYERS}
            </span>
          </div>
          <ul className="roster">
            {snap.players.map((p) => (
              <motion.li key={p.id} layout initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: p.online ? 1 : 0.4 }} transition={{ type: "spring", stiffness: 480, damping: 24 }}>
                <Seal text={p.name} variant={p.seal} size={44} />
                <span className="roster__name">
                  {p.name}
                  {p.id === client.me.id && <span className="muted"> (tú)</span>}
                </span>
                <span className="roster__tag">{p.id === snap.hostId ? "anfitrión" : p.online ? "" : "desconectado"}</span>
                {client.isHost && p.id !== snap.hostId && (
                  <button type="button" className="roster__kick" onClick={() => client.kick(p.id)} aria-label={`Sacar a ${p.name}`}>
                    ✕
                  </button>
                )}
              </motion.li>
            ))}
            {Array.from({ length: Math.max(0, Math.min(3, MAX_PLAYERS - snap.players.length)) }, (_, i) => (
              <li key={`empty-${i}`} className="roster__empty" aria-hidden>
                <span />
                <span>Lugar libre</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="lobby__cat panel" aria-labelledby="cat-t">
          <h2 id="cat-t">Categoría</h2>
          <Wheel
            size="compact"
            spin={snap.spin}
            canSpin={client.isHost}
            onRequest={() => client.setSpin(makeSpin())}
            onLanded={(s) => setLanded(s.nonce)}
          />
          <div className="lobby__chosen" aria-live="polite">
            {cat && !spinShown ? (
              <>
                <p className="muted">{FAMILY_BY_ID[cat.family].name}</p>
                <p className="lobby__catname">{cat.name}</p>
              </>
            ) : spinShown ? (
              <p className="lobby__catname">Girando…</p>
            ) : (
              <p className="muted">{client.isHost ? "Gira la ruleta o elige de la lista." : `${host?.name ?? "El anfitrión"} está eligiendo la categoría.`}</p>
            )}
          </div>
          {client.isHost && (
            <div className="field">
              <label htmlFor="cat-select">O elige de la lista</label>
              <select id="cat-select" className="input select" value={snap.cat ?? ""} onChange={(e) => e.target.value && client.setCategory(e.target.value)}>
                <option value="">Elegir categoría…</option>
                {FAMILIES.map((f) => (
                  <optgroup key={f.id} label={f.name}>
                    {CATEGORIES.filter((c) => c.family === f.id && (BANK.byCat[c.id]?.length ?? 0) >= 10).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({BANK.byCat[c.id].length})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          )}
        </section>
      </main>

      <div className="lobby__dock">
        <div className="wrap lobby__dock-in">
          {client.isHost ? (
            <>
              <p className="lobby__hint">{!cat ? "Falta elegir la categoría." : online.length < 2 ? "Puedes empezar solo o esperar a que entren más." : `Listos ${online.length}.`}</p>
              <button type="button" className="btn btn--hanko" disabled={!cat || !!spinShown} onClick={() => client.start(newSeed())}>
                Empezar partida
              </button>
            </>
          ) : (
            <p className="lobby__hint">Esperando a que {host?.name ?? "el anfitrión"} empiece la partida…</p>
          )}
        </div>
      </div>
    </div>
  );
}
