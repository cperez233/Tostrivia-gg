/* editorial-ui · Cristian Pérez · cristianperez.me
 * Chat y emotes de la sala. Abajo a la derecha: el botón de emotes (salen flotando en la pantalla de todos)
 * y el del chat, con un globo que avisa de los mensajes nuevos mientras está cerrado.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EMOTES, type ChatMsg, type GameClient } from "../net/client";
import { Avatar } from "./Avatar";
import "./chat.css";
import { t } from "../i18n";

/** cuánto flota una reacción antes de desvanecerse del todo */
const FLOAT_MS = 4200;

interface Float {
  id: string;
  body: string;
  seal: number;
  name: string;
  x: number;
}

export default function ChatDock({ client, place }: { client: GameClient; place: "lobby" | "game" }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [tray, setTray] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>(() => client.chatLog());
  const [unread, setUnread] = useState(0);
  const [toast, setToast] = useState<ChatMsg | null>(null);
  const [floats, setFloats] = useState<Float[]>([]);
  const [text, setText] = useState("");
  const openRef = useRef(open);
  openRef.current = open;
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    let toastTimer: ReturnType<typeof setTimeout> | undefined;
    const off = client.onChat((m) => {
      if (m.kind === "emote") {
        const f = { id: m.id, body: m.body, seal: m.seal, name: m.pid === client.me.id ? t("Tú") : m.name, x: 8 + Math.random() * 64 };
        setFloats((l) => [...l.slice(-14), f]);
        setTimeout(() => setFloats((l) => l.filter((x) => x.id !== f.id)), FLOAT_MS + 300);
        return;
      }
      setMsgs(client.chatLog().slice());
      if (!openRef.current && m.pid !== client.me.id) {
        setUnread((u) => u + 1);
        setToast(m);
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => setToast(null), 3500);
      }
    });
    return () => {
      off();
      clearTimeout(toastTimer);
    };
  }, [client]);

  // al abrir o llegar algo nuevo, al final de la conversación
  useEffect(() => {
    if (open) list.current?.scrollTo({ top: list.current.scrollHeight });
  }, [open, msgs]);

  const toggle = () => {
    setOpen((o) => !o);
    setUnread(0);
    setToast(null);
    setTray(false);
  };
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    client.say(text);
    setText("");
  };

  return (
    <>
      {/* las reacciones suben por el lado derecho, por encima de todo pero sin tapar los toques */}
      <div className="floats" aria-hidden>
        <AnimatePresence>
          {floats.map((f) => (
            <motion.div
              key={f.id}
              className="float"
              style={{ right: `${f.x}px` }}
              initial={{ y: 0, opacity: 0, scale: 0.4 }}
              animate={reduce ? { opacity: [0, 1, 1, 0] } : { y: -300, opacity: [0, 1, 1, 0], scale: [0.4, 1.25, 1, 1], rotate: [0, -8, 6, 0] }}
              transition={{ duration: FLOAT_MS / 1000, ease: "easeOut", opacity: { duration: FLOAT_MS / 1000, times: [0, 0.08, 0.8, 1] }, scale: { duration: 0.6, times: [0, 0.4, 0.7, 1] }, rotate: { duration: 0.9 } }}
            >
              <span className="float__emo">{f.body}</span>
              <span className="float__who">
                <Avatar animal={f.seal} size={18} />
                {f.name}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className={`chatdock chatdock--${place}`}>
        <AnimatePresence>
          {toast && !open && (
            <motion.button
              type="button"
              key={toast.id}
              className="chatdock__toast"
              onClick={toggle}
              initial={{ y: 12, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: 6 }}
            >
              <Avatar animal={toast.seal} size={22} />
              <span>
                <b>{toast.name}:</b> {toast.body}
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {tray && (
            <motion.div className="emotes" role="group" aria-label={t("Emotes")} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              {EMOTES.map((e) => (
                <motion.button key={e} type="button" whileTap={{ scale: 1.4 }} className="emotes__b" onClick={() => client.react(e)} aria-label={t("Mandar {e}", { e })}>
                  {e}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="chatdock__btns">
          <button type="button" className={`chatdock__btn ${tray ? "is-on" : ""}`} onClick={() => setTray((t) => !t)} aria-expanded={tray} aria-label={t("Emotes")}>
            <span aria-hidden>😀</span>
          </button>
          <button type="button" className={`chatdock__btn chatdock__btn--chat ${open ? "is-on" : ""}`} onClick={toggle} aria-expanded={open} aria-controls="chat-panel">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
              <path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
            </svg>
            {t("Chat")}
            {unread > 0 && <span className="chatdock__badge">{unread > 9 ? "9+" : unread}</span>}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.section
            id="chat-panel"
            className={`chatpanel chatpanel--${place}`}
            aria-label={t("Chat de la sala")}
            initial={reduce ? { opacity: 0 } : { y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            <header className="chatpanel__head">
              <h2>{t("Chat")}</h2>
              <button type="button" className="chatpanel__close" onClick={toggle} aria-label={t("Cerrar el chat")}>
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="3" />
                </svg>
              </button>
            </header>
            <ol ref={list} className="chatpanel__list" aria-live="polite">
              {msgs.length === 0 && <li className="chatpanel__empty">{t("Nadie ha escrito todavía. Rompe el hielo.")}</li>}
              {msgs.map((m) => (
                <li key={m.id} className={`msg ${m.pid === client.me.id ? "is-me" : ""}`}>
                  <Avatar animal={m.seal} size={28} />
                  <div className="msg__body">
                    <span className="msg__name">{m.pid === client.me.id ? t("Tú") : m.name}</span>
                    <p>{m.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <form className="chatpanel__form" onSubmit={send}>
              <label htmlFor="chat-input" className="sr-only">
                {t("Mensaje")}
              </label>
              <input id="chat-input" className="input chatpanel__input" value={text} onChange={(e) => setText(e.target.value)} maxLength={140} placeholder={t("Escribe algo…")} autoComplete="off" enterKeyHint="send" />
              <button type="submit" className="btn btn--hanko btn--small" disabled={!text.trim()}>
                {t("Enviar")}
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
