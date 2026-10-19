/* editorial-ui · Cristian Pérez · cristianperez.me
 * Una partida en marcha (solo o en grupo). En grupo, la fase "lobby" es la sala de espera.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { GameClient, NetStatus } from "../net/client";
import type { Snapshot } from "../game/match";
import { MAX_PLAYERS } from "../game/match";
import { useGame } from "../game/useGame";
import GameScreen from "../game/GameScreen";
import Wheel from "../components/Wheel";
import { Logo } from "../components/Seal";
import { Avatar, animalName } from "../components/Avatar";
import { Cover } from "../components/Cover";
import { describe } from "../game/mix";
import CategoryBrowser from "../components/CategoryBrowser";
import ChatDock from "../components/ChatDock";
import { FILTERS, makeDeck, makeSpin, type Filter } from "../game/deck";
import { newSeed } from "../lib/rng";
import { usePauseOffscreen } from "../lib/usePauseOffscreen";
import "./room.css";

export default function Room({ client, onExit }: { client: GameClient; onExit: () => void }) {
  const { snap, at, status } = useGame(client);
  if (status !== "open" || !snap) return <NetState status={status} code={client.code} onExit={onExit} />;
  const screen = snap.phase === "lobby" ? <Lobby client={client} snap={snap} onExit={onExit} /> : <GameScreen client={client} snap={snap} at={at} onExit={onExit} />;
  if (snap.mode !== "group") return screen;
  // el chat sigue montado entre la sala y la partida: no se pierden los mensajes ni el contador
  return (
    <>
      {screen}
      <ChatDock client={client} place={snap.phase === "lobby" ? "lobby" : "game"} />
    </>
  );
}

const NET_TEXT: Record<NetStatus, [string, string]> = {
  connecting: ["Conectando…", "Abriendo la línea con la sala."],
  open: ["", ""],
  lost: ["Se perdió la conexión", "No llegan datos del anfitrión. Si vuelve en unos segundos, seguimos donde íbamos."],
  closed: ["La sala se cerró", "El anfitrión salió o cerró la pestaña. Puedes crear una sala nueva."],
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
            {[0, 5, 10].map((a) => (
              <span key={a} className="anim-hop">
                <Avatar animal={a} size={40} />
              </span>
            ))}
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
  const reduce = useReducedMotion();
  const rosterRef = usePauseOffscreen<HTMLUListElement>();
  const [copied, setCopied] = useState(false);
  const [choosing, setChoosing] = useState(false);
  const [filter, setFilter] = useState<Filter>("todo");
  const link = `${location.origin}/sala/${client.code}`;
  const host = snap.players.find((p) => p.id === snap.hostId);
  const info = snap.cat ? describe(snap.cat) : null;
  const cat = info?.cover ?? null;
  const online = snap.players.filter((p) => p.online);
  const [landed, setLanded] = useState<number | null>(null);
  const spinShown = !!snap.spin && landed !== snap.spin.nonce;
  const deck = snap.deck.length ? snap.deck : makeDeck("todo", 1);

  // el anfitrión arma el primer mazo al abrir la sala
  const dealt = useRef(false);
  useEffect(() => {
    if (client.isHost && !snap.deck.length && !dealt.current) {
      dealt.current = true;
      client.setDeck(makeDeck("todo", newSeed()));
    }
  }, [client, snap.deck.length]);

  const pickFilter = (f: Filter) => {
    if (spinShown) return;
    setFilter(f);
    client.setDeck(makeDeck(f, newSeed()));
  };

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
        <button type="button" className="btn btn--ghost btn--small" onClick={onExit}>
          {client.isHost ? "Cerrar sala" : "Salir"}
        </button>
      </header>

      <main className="lobby__grid wrap">
        <section className="lobby__code panel" aria-labelledby="code-t">
          <p className="label">Código de la sala</p>
          <h1 id="code-t" className="lobby__codetext" aria-label={`Código ${client.code?.split("").join(" ")}`}>
            {client.code?.split("").map((ch, i) => (
              <motion.span key={i} initial={reduce ? false : { y: 40, opacity: 0, rotate: -14, scale: 1.4 }} animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }} transition={{ delay: 0.25 + 0.07 * i, type: "spring", stiffness: 520, damping: 18 }}>
                {ch}
              </motion.span>
            ))}
          </h1>
          <p className="lobby__link">{link.replace(/^https?:\/\//, "")}</p>
          <button type="button" className="btn btn--hanko btn--small lobby__share" onClick={share}>
            {copied ? "Enlace copiado" : "Compartir enlace"}
          </button>
        </section>

        <section className="lobby__roster" aria-labelledby="roster-t">
          <div className="lobby__roster-head">
            <h2 id="roster-t">Jugadores</h2>
            <span className="lobby__count">
              {online.length}/{MAX_PLAYERS}
            </span>
          </div>
          <ul ref={rosterRef} className="roster">
            <AnimatePresence initial={false}>
              {snap.players.map((p, i) => (
                <motion.li
                  key={p.id}
                  layout
                  className={`${p.online ? "" : "is-off"} ${p.id === client.me.id ? "is-me" : ""}`}
                  initial={{ scale: 0.5, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: p.online ? 1 : 0.45, y: 0 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 480, damping: 22 }}
                >
                  <span className="roster__face anim-bob" style={{ "--d": `${5.3 + ((i * 1.37) % 3.4)}s`, "--delay": `${-i * 0.9}s` } as React.CSSProperties}>
                    <Avatar animal={p.seal} size={58} title={animalName(p.seal)} />
                  </span>
                  <span className="roster__name">{p.name}</span>
                  <span className="roster__tag">{p.id === snap.hostId ? "Anfitrión" : p.id === client.me.id ? "Tú" : p.online ? "" : "Desconectado"}</span>
                  {client.isHost && p.id !== snap.hostId && (
                    <button type="button" className="roster__kick" onClick={() => client.kick(p.id)} aria-label={`Sacar a ${p.name}`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
                        <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="3.4" />
                      </svg>
                    </button>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
            {snap.players.length < MAX_PLAYERS && (
              <li className="roster__empty" aria-hidden>
                <span className="roster__hole">?</span>
                <span>Esperando…</span>
              </li>
            )}
          </ul>
        </section>

        <section className="lobby__cat" aria-labelledby="cat-t">
          <h2 id="cat-t" className="sr-only">
            Categoría
          </h2>
          {client.isHost && (
            <div className="filters lobby__filters" role="radiogroup" aria-label="Qué entra en la ruleta">
              {FILTERS.map((f) => (
                <button key={f.id} type="button" role="radio" aria-checked={filter === f.id} className={`filter ${filter === f.id ? "is-on" : ""}`} onClick={() => pickFilter(f.id)} disabled={spinShown}>
                  {filter === f.id && <motion.span layoutId="lobby-filter" className="filter__pill" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
                  <span className="filter__label">{f.label}</span>
                </button>
              ))}
            </div>
          )}
          <Wheel size="compact" deck={deck} spin={snap.spin} canSpin={client.isHost} onRequest={() => client.setSpin(makeSpin(deck))} onLanded={(s) => setLanded(s.nonce)} />
          <div className="lobby__chosen" aria-live="polite">
            <AnimatePresence mode="wait">
              {cat && !spinShown ? (
                <motion.div key={snap.cat} className="lobby__pick panel" initial={reduce ? false : { scale: 1.3, rotate: -6, opacity: 0 }} animate={{ scale: 1, rotate: -1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 420, damping: 20 }}>
                  <span className="lobby__pick-img">
                    <Cover cat={cat} sizes="64px" />
                  </span>
                  <span>
                    <span className="lobby__pick-fam">{info?.label}</span>
                    <span className="lobby__catname">{cat.name}</span>
                  </span>
                </motion.div>
              ) : (
                <motion.p key="wait" className="lobby__waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {spinShown ? "Girando…" : client.isHost ? "Gira la ruleta o elige de la lista." : `${host?.name ?? "El anfitrión"} está eligiendo la categoría.`}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          {client.isHost && (
            <>
              <button type="button" className="btn lobby__choose" onClick={() => setChoosing(true)} disabled={spinShown}>
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v6H4zM13 14h7v6h-7z" fill="none" stroke="currentColor" strokeWidth="2.4" />
                </svg>
                {cat ? "Cambiar categoría" : "O elige la categoría"}
              </button>
              <CategorySheet
                open={choosing}
                current={snap.cat}
                onClose={() => setChoosing(false)}
                onPick={(c) => {
                  setChoosing(false);
                  client.setCategory(c);
                }}
              />
            </>
          )}
        </section>
      </main>

      <div className="lobby__dock">
        <div className="wrap lobby__dock-in">
          {client.isHost ? (
            <>
              <p className="lobby__hint">{!cat ? "Falta la categoría." : online.length < 2 ? "Puedes empezar solo o esperar a los demás." : `Listos: ${online.length}.`}</p>
              <button type="button" className="btn btn--hanko" disabled={!cat || spinShown} onClick={() => client.start(newSeed())}>
                Empezar
              </button>
            </>
          ) : (
            <p className="lobby__hint">Esperando a que {host?.name ?? "el anfitrión"} empiece…</p>
          )}
        </div>
      </div>
    </div>
  );
}

/** la sala elige con el mismo explorador de Categorías, en una hoja a pantalla completa */
function CategorySheet({ open, current, onClose, onPick }: { open: boolean; current: string | null; onClose: () => void; onPick: (cat: string) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="sheet" aria-labelledby="sheet-t" onClose={onClose} onCancel={onClose}>
      <div className="sheet__top wrap">
        <h2 id="sheet-t">Elige la categoría</h2>
        <button type="button" className="sheet__close" onClick={onClose} aria-label="Cerrar">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="3" />
          </svg>
        </button>
      </div>
      {/* se monta al abrir: cada vez arranca limpio (o con la mezcla actual marcada) */}
      {open && <CategoryBrowser idp="sheet" verb="Elegir" inSheet current={current} onPick={onPick} />}
    </dialog>
  );
}
