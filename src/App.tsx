/* editorial-ui · Cristian Pérez · cristianperez.me */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Group from "./pages/Group";
import Room from "./pages/Room";
import NotFound from "./pages/NotFound";
import { GuestClient, HostClient, LocalClient, normalizeCode, type GameClient } from "./net/client";
import { me as myself, savedProfile } from "./lib/identity";
import { newSeed } from "./lib/rng";
import { describe, isValidCat } from "./game/mix";
import { Logo } from "./components/Seal";
import { Cover } from "./components/Cover";
import ProfilePicker from "./components/ProfilePicker";
import Nav, { TABS, type Tab } from "./components/Nav";
import Foot from "./components/Foot";
import Wipe, { type WipeState } from "./components/Wipe";
import { savedVariant } from "./game/powers";

type View =
  | { k: "home" }
  | { k: "cats" }
  | { k: "group" }
  | { k: "room"; client: GameClient }
  | { k: "join"; code: string }
  | { k: "solo-start"; cat: string }
  | { k: "404" };

function fromPath(path: string): View {
  const sala = path.match(/^\/sala\/([A-Za-z0-9]{5})\/?$/);
  if (sala) return { k: "join", code: normalizeCode(sala[1]) };
  const jugar = path.match(/^\/jugar\/([a-z0-9.-]+)\/?$/);
  if (jugar && isValidCat(jugar[1])) return { k: "solo-start", cat: jugar[1] };
  if (path === "/" || path === "/index.html" || path === "") return { k: "home" };
  if (/^\/categorias\/?$/.test(path)) return { k: "cats" };
  if (/^\/grupo\/?$/.test(path)) return { k: "group" };
  return { k: "404" };
}
const isTab = (k: View["k"]): k is Tab => k === "home" || k === "cats" || k === "group";
const order = (k: View["k"]) => (isTab(k) ? TABS.findIndex((t) => t.id === k) : 3);

const TITLES: Record<View["k"], string> = {
  home: "Tostrivia · Trivia de anime, videojuegos y cultura general",
  cats: "Tostrivia · Categorías",
  group: "Tostrivia · Jugar en grupo",
  room: "Tostrivia · Partida",
  join: "Tostrivia · Entrar a la sala",
  "solo-start": "Tostrivia · Te retaron",
  "404": "Tostrivia · Página no encontrada",
};

const COVER_MS = 380;
const scrollKey = (k: string) => `tostrivia:scroll:${k}`;

export default function App() {
  const reduce = useReducedMotion();
  const [view, setView] = useState<View>(() => fromPath(location.pathname));
  const [wipe, setWipe] = useState<WipeState | null>(null);
  const [entry, setEntry] = useState(0);
  const timers = useRef<number[]>([]);
  const viewRef = useRef(view);
  viewRef.current = view;
  const restore = useRef<number | null>(null);

  useEffect(() => {
    history.scrollRestoration = "manual";
  }, []);

  /** cambio de pantalla: tapa, cambia detrás del cuadro y destapa. Las fases van con temporizadores. */
  const go = useCallback(
    (v: View, path?: string | null, opts: { label?: string; push?: boolean } = {}) => {
      timers.current.forEach(clearTimeout);
      const from = viewRef.current;
      try {
        if (isTab(from.k)) sessionStorage.setItem(scrollKey(from.k), String(scrollY));
      } catch {
        /* sin almacenamiento: vuelve arriba */
      }
      const swap = () => {
        if (from.k === "room" && (v.k !== "room" || v.client !== from.client)) from.client.leave();
        let y = 0;
        if (isTab(v.k) && opts.push === false) {
          try {
            y = Number(sessionStorage.getItem(scrollKey(v.k)) || 0);
          } catch {
            y = 0;
          }
        }
        restore.current = y;
        setView(v);
        setEntry((e) => e + 1);
        if (path != null && opts.push !== false && path !== location.pathname) history.pushState(null, "", path);
      };
      if (reduce) return swap();
      const label = opts.label ?? (isTab(v.k) ? TABS.find((t) => t.id === v.k)!.wipe : v.k === "room" ? "¡A jugar!" : v.k === "404" ? "¿Eh?" : "Sala");
      setWipe({ n: Date.now(), dir: order(v.k) >= order(from.k) ? 1 : -1, label });
      timers.current = [
        window.setTimeout(swap, COVER_MS),
        window.setTimeout(() => setWipe(null), COVER_MS + 140),
      ];
    },
    [reduce],
  );

  // la nueva pantalla se coloca en su sitio mientras el cuadro la tapa
  useLayoutEffect(() => {
    if (restore.current == null) return;
    window.scrollTo({ top: restore.current, behavior: "instant" as ScrollBehavior });
    restore.current = null;
  }, [entry]);

  useEffect(() => {
    const onPop = () => go(fromPath(location.pathname), null, { push: false });
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [go]);

  useEffect(() => {
    document.title = TITLES[view.k];
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

  const tab = (t: Tab) => go({ k: t } as View, TABS.find((x) => x.id === t)!.path);
  const exitRoom = () => go({ k: "home" }, "/");

  const playSolo = (cat: string) => {
    const c = new LocalClient(myself());
    c.setCategory(cat);
    c.setVariant(savedVariant());
    c.start(newSeed());
    go({ k: "room", client: c }, location.pathname.startsWith("/jugar/") ? "/" : null, { label: describe(cat)?.short ?? "¡A jugar!" });
  };

  const host = async (name: string, seal: number) => {
    const c = new HostClient(myself(name, seal));
    go({ k: "room", client: c }, null, { label: "¡Sala!" });
    try {
      await c.open();
    } catch {
      /* el estado de error lo muestra la sala */
    }
  };

  const join = async (code: string, name?: string, seal?: number) => {
    const c = new GuestClient(myself(name, seal), code);
    go({ k: "room", client: c }, `/sala/${code}`, { label: "¡Sala!" });
    try {
      await c.connect();
    } catch {
      /* idem */
    }
  };

  const active = isTab(view.k) ? view.k : null;
  const showChrome = active != null;

  return (
    <MotionConfig reducedMotion="user">
      <Wipe wipe={wipe} />
      {showChrome && <Nav active={active} onGo={tab} />}
      {/* la vista nueva entra cuando el cuadro se va */}
      <motion.div
        key={view.k === "room" ? `room-${view.client.me.id}-${entry}` : `${view.k}-${entry}`}
        initial={reduce || entry === 0 ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: entry === 0 ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        {view.k === "home" && <Home onPlay={playSolo} />}
        {view.k === "cats" && <Categories onPlay={playSolo} />}
        {view.k === "group" && <Group onHost={host} onJoin={(code) => go({ k: "join", code }, `/sala/${code}`)} />}
        {view.k === "room" && <Room client={view.client} onExit={exitRoom} />}
        {view.k === "join" && <JoinScreen code={view.code} onJoin={(n, s) => join(view.code, n, s)} onHome={() => go({ k: "home" }, "/")} />}
        {view.k === "solo-start" && <SoloStart cat={view.cat} onPlay={() => playSolo(view.cat)} onHome={() => go({ k: "cats" }, "/categorias")} />}
        {view.k === "404" && <NotFound onGo={(t) => tab(t)} />}
      </motion.div>
      {showChrome && <Foot />}
    </MotionConfig>
  );
}

function JoinScreen({ code, onJoin, onHome }: { code: string; onJoin: (name: string, seal: number) => void; onHome: () => void }) {
  const [profile, setProfile] = useState(savedProfile);
  const [err, setErr] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name.trim()) return setErr("Escribe tu nombre para que te reconozcan.");
    onJoin(profile.name.trim(), profile.seal);
  };
  return (
    <div className="solo wrap">
      <a href="/" className="solo__logo" onClick={(e) => (e.preventDefault(), onHome())} aria-label="Ir a la ruleta">
        <Logo size={36} />
      </a>
      <motion.form className="solo__card panel" onSubmit={submit} initial={{ y: 30, rotate: -2 }} animate={{ y: 0, rotate: -0.6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
        <p className="label">Te invitaron a una sala</p>
        <h1 className="solo__title">
          Sala <span className="solo__code">{code}</span>
        </h1>
        <ProfilePicker value={profile} onChange={setProfile} />
        {err && (
          <p className="form-err form-err--paper" role="alert">
            {err}
          </p>
        )}
        <button type="submit" className="btn btn--hanko btn--block">
          Entrar a la sala
        </button>
      </motion.form>
    </div>
  );
}

function SoloStart({ cat, onPlay, onHome }: { cat: string; onPlay: () => void; onHome: () => void }) {
  const info = describe(cat)!;
  const c = info.cover;
  return (
    <div className="solo wrap">
      <a href="/categorias" className="solo__logo" onClick={(e) => (e.preventDefault(), onHome())} aria-label="Ver las categorías">
        <Logo size={36} />
      </a>
      <motion.div className="solo__card panel" initial={{ scale: 1.2, rotate: -6, opacity: 0 }} animate={{ scale: 1, rotate: -1, opacity: 1 }} transition={{ type: "spring", stiffness: 380, damping: 20 }}>
        <div className="solo__cover">
          <Cover cat={c} sizes="min(100vw, 520px)" backdrop eager />
        </div>
        <p className="label">Te retaron · {info.label}</p>
        <h1 className="solo__title">{c.name}</h1>
        <button type="button" className="btn btn--hanko btn--block" onClick={onPlay} autoFocus>
          Aceptar el reto
        </button>
        <button type="button" className="link" onClick={onHome}>
          Ver todas las categorías
        </button>
      </motion.div>
    </div>
  );
}
