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
import Reshuffle from "../components/Reshuffle";
import { Logo } from "../components/Seal";
import { Avatar, animalName } from "../components/Avatar";
import { Cover } from "../components/Cover";
import { describe } from "../game/mix";
import CategoryBrowser from "../components/CategoryBrowser";
import ChatDock from "../components/ChatDock";
import HowTo from "../components/HowTo";
import { FILTERS, makeDeck, makeSpin, type Filter } from "../game/deck";
import { newSeed } from "../lib/rng";
import { usePauseOffscreen } from "../lib/usePauseOffscreen";
import MatchSetup from "../components/MatchSetup";
import { saveVariant, type Variant } from "../game/powers";
import type { Preset } from "../lib/presets";
import { DEFAULT_RULES, saveRules, type Rules } from "../game/rules";
import "./room.css";
import { t } from "../i18n";

export default function Room({ client, onExit, onCats }: { client: GameClient; onExit: () => void; onCats: (cat?: string | null) => void }) {
  const { snap, at, status } = useGame(client);
  if (status !== "open" || !snap) return <NetState status={status} code={client.code} onExit={onExit} />;
  const screen = snap.phase === "lobby" ? <Lobby client={client} snap={snap} onExit={onExit} /> : <GameScreen client={client} snap={snap} at={at} onExit={onExit} onCats={onCats} />;
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
  connecting: ["Conectando…", "Conectando con la sala."],
  open: ["", ""],
  lost: ["Se perdió la conexión", "No llegan datos del anfitrión. Si vuelve en unos segundos, seguimos donde íbamos."],
  closed: ["La sala se cerró", "El anfitrión salió o cerró la pestaña. Puedes crear una sala nueva."],
  full: ["La sala está llena", "Ya hay {n} personas jugando. Pídele al anfitrión que abra otra."],
  taken: ["Ese animal ya está en la sala", "Vuelve atrás y elige otro."],
  missing: ["No encontramos esa sala", "Revisa el código. Si el anfitrión cerró la pestaña, la sala ya no existe."],
  error: ["No se pudo conectar", "La red bloqueó la conexión entre navegadores o el servidor de enlace no respondió. Prueba con otra red o vuelve a intentarlo."],
};

function NetState({ status, code, onExit }: { status: NetStatus; code: string | null; onExit: () => void }) {
  const [title, d] = NET_TEXT[status].map((s) => t(s, { n: MAX_PLAYERS }));
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
        <h1>{title}</h1>
        <p>{d}</p>
        {code && <p className="muted">{t("Sala")} {code}</p>}
        <button type="button" className="btn" onClick={onExit}>
          {t("Volver al inicio")}
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
  const leaders = snap.leaders ?? [];
  // el anfitrión y los líderes que nombró manejan la sala
  const lead = client.isHost || leaders.includes(client.me.id);
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

  const reshuffle = () => {
    if (!spinShown) client.setDeck(makeDeck(filter, newSeed()));
  };

  const share = async () => {
    const text = t("Entra a mi sala de Tostrivia. Código {code}", { code: client.code ?? "" });
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
        <div className="lobby__top-end">
          <button type="button" className="btn btn--ghost btn--small" onClick={onExit}>
            {client.isHost ? t("Cerrar sala") : t("Salir")}
          </button>
        </div>
      </header>

      <main className="lobby__grid wrap">
        <section className="lobby__code panel" aria-labelledby="code-t">
          <p className="label">{t("Código de la sala")}</p>
          <h1 id="code-t" className="lobby__codetext" aria-label={t("Código {code}", { code: client.code?.split("").join(" ") ?? "" })}>
            {client.code?.split("").map((ch, i) => (
              <motion.span key={i} initial={reduce ? false : { y: 40, opacity: 0, rotate: -14, scale: 1.4 }} animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }} transition={{ delay: 0.25 + 0.07 * i, type: "spring", stiffness: 520, damping: 18 }}>
                {ch}
              </motion.span>
            ))}
          </h1>
          <p className="lobby__link">{link.replace(/^https?:\/\//, "")}</p>
          <button type="button" className="btn btn--hanko btn--small lobby__share" onClick={share}>
            {copied ? t("Enlace copiado") : t("Compartir enlace")}
          </button>
        </section>

        <section className="lobby__roster" aria-labelledby="roster-t">
          <div className="lobby__roster-head">
            <h2 id="roster-t">{t("Jugadores")}</h2>
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
                  <span className="roster__tag">
                    {p.id === snap.hostId ? t("Anfitrión") : leaders.includes(p.id) ? t("Líder") : p.id === client.me.id ? t("Tú") : p.online ? "" : t("Desconectado")}
                  </span>
                  {/* corona: dorada para el anfitrión y los líderes (la ven todos); gris para que el anfitrión se la ponga a alguien */}
                  {client.isHost && p.id !== snap.hostId ? (
                    <button
                      type="button"
                      className={`roster__lead ${leaders.includes(p.id) ? "is-on" : ""}`}
                      onClick={() => client.setLeader(p.id, !leaders.includes(p.id))}
                      aria-pressed={leaders.includes(p.id)}
                      aria-label={leaders.includes(p.id) ? t("Quitarle el mando a {name}", { name: p.name }) : t("Hacer líder a {name}", { name: p.name })}
                      title={leaders.includes(p.id) ? t("Quitarle el mando a {name}", { name: p.name }) : t("Hacer líder a {name}", { name: p.name })}
                    >
                      <Crown on={leaders.includes(p.id)} />
                    </button>
                  ) : (
                    (p.id === snap.hostId || leaders.includes(p.id)) && (
                      <span className="roster__lead is-on is-badge" title={p.id === snap.hostId ? t("Anfitrión") : t("Líder")}>
                        <Crown on />
                      </span>
                    )
                  )}
                  {lead && p.id !== snap.hostId && p.id !== client.me.id && (
                    <button type="button" className="roster__kick" onClick={() => client.kick(p.id)} aria-label={t("Sacar a {name}", { name: p.name })}>
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
                <span>{t("Esperando…")}</span>
              </li>
            )}
          </ul>
          <HowTo variant="card" />
        </section>

        <section className="lobby__cat" aria-labelledby="cat-t">
          <h2 id="cat-t" className="sr-only">
            {t("Categoría")}
          </h2>
          {lead && (
            <div className="filters lobby__filters" role="radiogroup" aria-label={t("Qué entra en la ruleta")}>
              {FILTERS.map((f) => (
                <button key={f.id} type="button" role="radio" aria-checked={filter === f.id} className={`filter ${filter === f.id ? "is-on" : ""}`} onClick={() => pickFilter(f.id)} disabled={spinShown}>
                  {filter === f.id && <motion.span layoutId="lobby-filter" className="filter__pill" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
                  <span className="filter__label">{t(f.label)}</span>
                </button>
              ))}
            </div>
          )}
          <div className="wheelbox">
            <Wheel size="compact" deck={deck} spin={snap.spin} canSpin={lead} onRequest={() => client.setSpin(makeSpin(deck))} onLanded={(s) => setLanded(s.nonce)} />
            {lead && filter !== "cultura" && <Reshuffle onClick={reshuffle} disabled={spinShown} />}
          </div>
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
                  {spinShown ? t("Girando…") : lead ? t("Gira la ruleta o elige de la lista.") : t("{name} está eligiendo la categoría.", { name: host?.name ?? t("El anfitrión") })}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <MatchSetup
            idp="lobby"
            readOnly={!lead}
            variant={snap.variant}
            rules={snap.rules ?? DEFAULT_RULES}
            onVariant={(v) => {
              client.setVariant(v);
              saveVariant(v);
            }}
            onRules={(r) => {
              client.setRules(r);
              saveRules(r);
            }}
            disabled={spinShown}
          />
          {lead && (
            <>
              <button type="button" className="btn lobby__choose" onClick={() => setChoosing(true)} disabled={spinShown}>
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v6H4zM13 14h7v6h-7z" fill="none" stroke="currentColor" strokeWidth="2.4" />
                </svg>
                {cat ? t("Cambiar categoría") : t("O elige la categoría")}
              </button>
              <CategorySheet
                open={choosing}
                current={snap.cat}
                setup={{ variant: snap.variant, rules: snap.rules ?? DEFAULT_RULES }}
                onClose={() => setChoosing(false)}
                onPick={(c) => {
                  setChoosing(false);
                  client.setCategory(c);
                }}
                onPreset={(p) => {
                  setChoosing(false);
                  client.setCategory(p.cat);
                  client.setVariant(p.variant);
                  client.setRules(p.rules);
                  saveVariant(p.variant);
                  saveRules(p.rules);
                }}
              />
            </>
          )}
        </section>
      </main>

      <div className="lobby__dock">
        <div className="wrap lobby__dock-in">
          {lead ? (
            <>
              <p className="lobby__hint">{!cat ? t("Falta la categoría.") : online.length < 2 ? t("Puedes empezar solo o esperar a los demás.") : t("Listos: {n}.", { n: online.length })}</p>
              <button type="button" className="btn btn--hanko" disabled={!cat || spinShown} onClick={() => client.start(newSeed())}>
                {t("Empezar")}
              </button>
            </>
          ) : (
            <p className="lobby__hint">{t("Esperando a que {name} empiece…", { name: host?.name ?? t("el anfitrión") })}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Crown({ on }: { on: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path d="M3 18h18l-1.5-10-5 4L12 5l-2.5 7-5-4z" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  );
}

/** la sala elige con el mismo explorador de Categorías, en una hoja a pantalla completa */
function CategorySheet({ open, current, setup, onClose, onPick, onPreset }: { open: boolean; current: string | null; setup: { variant: Variant; rules: Rules }; onClose: () => void; onPick: (cat: string) => void; onPreset: (p: Preset) => void }) {
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
        <h2 id="sheet-t">{t("Elige la categoría")}</h2>
        <button type="button" className="sheet__close" onClick={onClose} aria-label={t("Cerrar")}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="3" />
          </svg>
        </button>
      </div>
      {/* se monta al abrir: cada vez arranca limpio (o con la mezcla actual marcada) */}
      {open && <CategoryBrowser idp="sheet" verb={t("Elegir")} inSheet current={current} onPick={onPick} onPreset={onPreset} getSetup={() => setup} />}
    </dialog>
  );
}
