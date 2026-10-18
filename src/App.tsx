/* editorial-ui · Cristian Pérez · cristianperez.me */
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Home from "./pages/Home";
import Room from "./pages/Room";
import { GuestClient, HostClient, LocalClient, normalizeCode, type GameClient } from "./net/client";
import { me as myself, savedProfile } from "./lib/identity";
import { newSeed } from "./lib/rng";
import { CATEGORY_BY_ID } from "./data/categories";
import { BANK, countFor } from "./data/bank";
import { Logo, Seal } from "./components/Seal";
import ProfilePicker from "./components/ProfilePicker";
import NotFound from "./pages/NotFound";

type View =
  | { k: "home" }
  | { k: "room"; client: GameClient }
  | { k: "join"; code: string }
  | { k: "solo-start"; cat: string }
  | { k: "404" };

function fromPath(path: string): View {
  const sala = path.match(/^\/sala\/([A-Za-z0-9]{5})\/?$/);
  if (sala) return { k: "join", code: normalizeCode(sala[1]) };
  const jugar = path.match(/^\/jugar\/([a-z0-9-]+)\/?$/);
  if (jugar && BANK.byCat[jugar[1]]?.length) return { k: "solo-start", cat: jugar[1] };
  if (path === "/" || path === "/index.html" || path === "") return { k: "home" };
  return { k: "404" };
}

export default function App() {
  const [view, setView] = useState<View>(() => fromPath(location.pathname));
  const [curtain, setCurtain] = useState(0);

  const go = useCallback((v: View, path?: string) => {
    setCurtain((c) => c + 1);
    setView(v);
    if (path != null && path !== location.pathname) history.pushState(null, "", path);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  useEffect(() => {
    const onPop = () => {
      setView((cur) => {
        if (cur.k === "room") cur.client.leave();
        return fromPath(location.pathname);
      });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    const titles: Record<View["k"], string> = {
      home: "Tostrivia · Trivia de anime, videojuegos y cultura general",
      room: "Tostrivia · Partida",
      join: "Tostrivia · Entrar a la sala",
      "solo-start": "Tostrivia · Partida",
      "404": "Tostrivia · Página no encontrada",
    };
    document.title = titles[view.k];
    let robots = document.querySelector('meta[name="robots"]');
    if (view.k === "404") {
      if (!robots) {
        robots = document.createElement("meta");
        robots.setAttribute("name", "robots");
        document.head.appendChild(robots);
      }
      robots.setAttribute("content", "noindex");
    } else robots?.remove();
  }, [view.k]);

  const exitRoom = () => {
    if (view.k === "room") view.client.leave();
    go({ k: "home" }, "/");
  };

  const playSolo = (cat: string) => {
    const c = new LocalClient(myself());
    c.setCategory(cat);
    c.start(newSeed());
    go({ k: "room", client: c }, location.pathname === "/" ? undefined : "/");
  };

  const host = async (name: string, seal: number) => {
    const c = new HostClient(myself(name, seal));
    go({ k: "room", client: c });
    try {
      await c.open();
    } catch {
      /* el estado de error lo muestra la sala */
    }
  };

  const join = async (code: string, name?: string, seal?: number) => {
    const c = new GuestClient(myself(name, seal), code);
    go({ k: "room", client: c }, `/sala/${code}`);
    try {
      await c.connect();
    } catch {
      /* idem */
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <Curtain n={curtain} />
      {/* sin AnimatePresence aquí: la cortina tapa el cambio y la vista nueva entra con un fundido corto */}
      <motion.div key={view.k === "room" ? `room-${view.client.me.id}-${curtain}` : view.k} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: 0.12 }}>
          {view.k === "home" && <Home onPlay={playSolo} onHost={host} onJoin={(code) => go({ k: "join", code }, `/sala/${code}`)} />}
          {view.k === "room" && <Room client={view.client} onExit={exitRoom} />}
          {view.k === "join" && <JoinScreen code={view.code} onJoin={(n, s) => join(view.code, n, s)} onHome={() => go({ k: "home" }, "/")} />}
          {view.k === "solo-start" && <SoloStart cat={view.cat} onPlay={() => playSolo(view.cat)} onHome={() => go({ k: "home" }, "/")} />}
          {view.k === "404" && <NotFound onHome={() => go({ k: "home" }, "/")} />}
      </motion.div>
    </MotionConfig>
  );
}

/** cambio de pantalla: una viñeta de trama cruza la página, como pasar la hoja */
function Curtain({ n }: { n: number }) {
  return (
    <AnimatePresence>
      {n > 0 && (
        <motion.div
          key={n}
          className="curtain tone-lines"
          aria-hidden
          initial={{ clipPath: "polygon(0 0, 0 0, -20% 100%, -20% 100%)" }}
          animate={{ clipPath: ["polygon(0 0, 0 0, -20% 100%, -20% 100%)", "polygon(0 0, 120% 0, 100% 100%, -20% 100%)", "polygon(120% 0, 120% 0, 100% 100%, 100% 100%)"] }}
          transition={{ duration: 0.62, times: [0, 0.45, 1], ease: [0.76, 0, 0.24, 1] }}
        />
      )}
    </AnimatePresence>
  );
}

function JoinScreen({ code, onJoin, onHome }: { code: string; onJoin: (name: string, seal: number) => void; onHome: () => void }) {
  const [profile, setProfile] = useState(savedProfile);
  const [err, setErr] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name.trim()) return setErr("Escribe tu nombre para que los demás te reconozcan.");
    onJoin(profile.name.trim(), profile.seal);
  };
  return (
    <div className="solo wrap">
      <button type="button" className="solo__logo" onClick={onHome} aria-label="Ir al inicio">
        <Logo size={36} />
      </button>
      <form className="solo__card panel" onSubmit={submit}>
        <p className="label">Te invitaron a una sala</p>
        <h1 className="solo__title">
          Sala <span className="solo__code">{code}</span>
        </h1>
        <ProfilePicker value={profile} onChange={setProfile} />
        {err && (
          <p className="form-err" role="alert">
            {err}
          </p>
        )}
        <button type="submit" className="btn btn--hanko btn--block">
          Entrar a la sala
        </button>
        <p className="muted solo__fine">Te conectas directamente al celular de quien creó la sala. Tu nombre solo lo ven los demás jugadores.</p>
      </form>
    </div>
  );
}

function SoloStart({ cat, onPlay, onHome }: { cat: string; onPlay: () => void; onHome: () => void }) {
  const c = CATEGORY_BY_ID[cat];
  const n = countFor(cat);
  return (
    <div className="solo wrap">
      <button type="button" className="solo__logo" onClick={onHome} aria-label="Ir al inicio">
        <Logo size={36} />
      </button>
      <div className="solo__card panel">
        <p className="label">Te retaron a esta categoría</p>
        <h1 className="solo__title">{c.name}</h1>
        <p>{c.blurb}</p>
        <p className="muted">
          10 preguntas de {n.total}
          {n.media ? `; ${n.media} tienen video y suenan con la pantalla tapada` : ""}.
        </p>
        <button type="button" className="btn btn--hanko btn--block" onClick={onPlay} autoFocus>
          Empezar
        </button>
        <button type="button" className="link" onClick={onHome}>
          Ver todas las categorías
        </button>
        <span className="solo__seal" aria-hidden>
          <Seal text="¡!" size={60} />
        </span>
      </div>
    </div>
  );
}
