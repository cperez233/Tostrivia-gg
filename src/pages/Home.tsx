/* editorial-ui · Cristian Pérez · cristianperez.me */
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { CATEGORIES, CATEGORY_BY_ID, FAMILIES, FAMILY_BY_ID, categoriesOf } from "../data/categories";
import { BANK, countFor } from "../data/bank";
import type { FamilyId } from "../data/types";
import type { Spin } from "../game/match";
import Wheel from "../components/Wheel";
import { Logo, Seal } from "../components/Seal";
import Colophon from "../components/Colophon";
import ProfilePicker from "../components/ProfilePicker";
import { normalizeCode } from "../net/client";
import { savedProfile } from "../lib/identity";
import "./home.css";

type Filter = "todo" | "anime" | "juegos" | "cultura";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "todo", label: "Todo" },
  { id: "anime", label: "Anime" },
  { id: "juegos", label: "Juegos" },
  { id: "cultura", label: "Cultura" },
];
const FILTER_FAMS: Record<Filter, FamilyId[]> = {
  todo: FAMILIES.map((f) => f.id),
  anime: ["leyenda", "nueva", "culto", "oido"],
  juegos: ["nintendo", "aaa", "online", "oido"],
  cultura: ["cultura"],
};
function eligible(f: Filter) {
  return CATEGORIES.filter(
    (c) =>
      FILTER_FAMS[f].includes(c.family) &&
      (f !== "anime" || c.id !== "soundtracks") &&
      (f !== "juegos" || c.id !== "openings") &&
      (BANK.byCat[c.id]?.length ?? 0) >= 10,
  );
}

interface Props {
  onPlay: (cat: string) => void;
  onHost: (name: string, seal: number) => void;
  onJoin: (code: string) => void;
}

export default function Home({ onPlay, onHost, onJoin }: Props) {
  const [spin, setSpin] = useState<Spin | null>(null);
  const [landed, setLanded] = useState<Spin | null>(null);
  const [filter, setFilter] = useState<Filter>("todo");

  const doSpin = () => {
    const pool = eligible(filter);
    const cat = pool[Math.floor(Math.random() * pool.length)];
    setLanded(null);
    setSpin({ family: cat.family, cat: cat.id, nonce: Math.floor(Math.random() * 1e9) });
  };

  const totals = useMemo(() => {
    const qs = Object.values(BANK.byId);
    return { q: qs.length, v: qs.filter((q) => q.media).length, c: CATEGORIES.filter((c) => BANK.byCat[c.id]?.length).length };
  }, []);

  return (
    <>
      <TopBar onHost={() => document.getElementById("grupo")?.scrollIntoView({ behavior: "smooth", block: "start" })} />
      <main id="inicio">
        <section className="hero wrap" aria-labelledby="hero-t">
          <div className="hero__head panel">
            <p className="label">Trivia de anime, videojuegos y cultura general</p>
            <h1 id="hero-t" className="hero__title">
              Gira, responde y no rompas la racha.
            </h1>
            <p className="hero__lead">
              Diez preguntas por partida y veinte segundos para cada una. En las de video suena el opening con la pantalla tapada; la imagen se revela cuando respondes.
            </p>
          </div>

          <div className="hero__wheel panel">
            <div className="hero__filter" role="radiogroup" aria-label="Qué entra en la ruleta">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="radio"
                  aria-checked={filter === f.id}
                  className={`seg ${filter === f.id ? "is-on" : ""}`}
                  onClick={() => setFilter(f.id)}
                >
                  {filter === f.id && <motion.span layoutId="seg-pill" className="seg__pill" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
                  <span className="seg__label">{f.label}</span>
                </button>
              ))}
            </div>
            <Wheel spin={spin} canSpin onRequest={doSpin} onLanded={setLanded} />
          </div>

          <ResultPanel spin={spin} landed={landed} onPlay={onPlay} onSpin={doSpin} />
        </section>

        <CategoryIndex onPlay={onPlay} totals={totals} />
        <GroupSection onHost={onHost} onJoin={onJoin} />
        <Rules />
      </main>
      <Colophon totals={totals} />
    </>
  );
}

function TopBar({ onHost }: { onHost: () => void }) {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setCompact(v > 40));
  return (
    <header className={`topbar ${compact ? "is-compact" : ""}`}>
      <div className="topbar__in wrap">
        <a href="/" className="topbar__logo" aria-label="Tostrivia, inicio">
          <Logo size={compact ? 34 : 40} />
        </a>
        <nav className="topbar__nav" aria-label="Secciones">
          <a href="#categorias">Categorías</a>
          <a href="#grupo">En grupo</a>
          <a href="#reglas">Reglas</a>
        </nav>
        <button type="button" className="btn btn--small" onClick={onHost}>
          Jugar en grupo
        </button>
      </div>
    </header>
  );
}

function ResultPanel({ spin, landed, onPlay, onSpin }: { spin: Spin | null; landed: Spin | null; onPlay: (c: string) => void; onSpin: () => void }) {
  const cat = landed ? CATEGORY_BY_ID[landed.cat] : null;
  const fam = cat ? FAMILY_BY_ID[cat.family] : null;
  const count = cat ? countFor(cat.id) : null;
  const spinning = !!spin && !landed;
  return (
    <div className={`hero__result panel ${cat ? "has-result" : ""}`} aria-live="polite">
      <AnimatePresence mode="wait">
        {!spin && (
          <motion.div key="idle" className="result__idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="result__kicker">Toca el centro de la ruleta</p>
            <p className="result__help">
              Cae en una de las ocho familias y luego en una categoría. Si prefieres elegir, están todas{" "}
              <a className="link" href="#categorias">
                aquí abajo
              </a>
              .
            </p>
            <span className="result__sfx sfx" aria-hidden>
              ドドド
            </span>
          </motion.div>
        )}
        {spinning && spin && (
          <motion.div key={`spin-${spin.nonce}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="result__kicker">Girando…</p>
            <Reel family={spin.family as FamilyId} target={spin.cat} />
          </motion.div>
        )}
        {cat && fam && count && (
          <motion.div key={`res-${landed!.nonce}`} className="result__done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p className="result__kicker">
              Te tocó · <span className="muted">{fam.name}</span>
            </p>
            <motion.h2
              className="result__name"
              initial={{ scale: 1.25, rotate: -3, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 20 }}
            >
              {cat.name}
            </motion.h2>
            <p className="result__blurb">{cat.blurb}</p>
            <p className="result__meta">
              {count.total} preguntas{count.media ? ` · ${count.media} con video` : ""}
            </p>
            <div className="result__actions">
              <button type="button" className="btn btn--hanko" onClick={() => onPlay(cat.id)}>
                Jugar {cat.name.length > 18 ? "" : cat.name}
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>
              </button>
              <button type="button" className="btn btn--paper" onClick={onSpin}>
                Girar otra vez
              </button>
            </div>
            <motion.span
              className="result__stamp"
              aria-hidden
              initial={{ scale: 2, opacity: 0, rotate: 10 }}
              animate={{ scale: 1, opacity: 1, rotate: -12 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 500, damping: 16 }}
            >
              <Seal text="¡!" size={64} variant={0} />
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** carrete que repasa las categorías de la familia mientras gira la ruleta */
function Reel({ family, target }: { family: FamilyId; target: string }) {
  const cats = categoriesOf(family);
  const list = [...cats, ...cats, ...cats, ...cats].map((c) => c.name);
  const idx = cats.length * 3 + cats.findIndex((c) => c.id === target);
  return (
    <div className="reel" aria-hidden>
      <motion.ul initial={{ y: 0 }} animate={{ y: `-${idx * 1.3}em` }} transition={{ duration: 4, ease: [0.12, 0.62, 0.08, 1] }}>
        {list.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </motion.ul>
    </div>
  );
}

function CategoryIndex({ onPlay, totals }: { onPlay: (c: string) => void; totals: { q: number; v: number; c: number } }) {
  const [fam, setFam] = useState<FamilyId>("leyenda");
  const family = FAMILY_BY_ID[fam];
  const cats = categoriesOf(fam).filter((c) => (BANK.byCat[c.id]?.length ?? 0) > 0);
  return (
    <section id="categorias" className="cats wrap" aria-labelledby="cats-t">
      <div className="cats__head">
        <p className="label">Elige tú</p>
        <h2 id="cats-t" className="section-title">
          {totals.c} categorías, {totals.q.toLocaleString("es-CO")} preguntas.
        </h2>
        <p className="section-lead">
          {totals.v} preguntas tienen video: openings, bandas sonoras y tráileres que se oyen o se ven difuminados.
        </p>
      </div>

      <div className="tabs" role="tablist" aria-label="Familias">
        {FAMILIES.map((f) => (
          <button key={f.id} type="button" role="tab" aria-selected={fam === f.id} className={`tab ${fam === f.id ? "is-on" : ""}`} onClick={() => setFam(f.id)}>
            <span className={`tab__tone tone-${f.tone}`} aria-hidden />
            <span className="tab__label">{f.name}</span>
            {fam === f.id && <motion.span layoutId="tab-ink" className="tab__ink" transition={{ type: "spring", stiffness: 520, damping: 40 }} />}
          </button>
        ))}
      </div>

      <div className="cats__body" role="tabpanel" aria-label={family.name}>
        <p className="cats__blurb">{family.blurb}</p>
        <ul className="rows">
          <AnimatePresence initial={false} mode="popLayout">
            {cats.map((c, i) => {
              const n = countFor(c.id);
              return (
                <motion.li
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.035, duration: 0.3 } }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                >
                  <button type="button" className="row" onClick={() => onPlay(c.id)}>
                    <span className={`row__sweep tone-${family.tone}`} aria-hidden />
                    <span className="row__name">{c.name}</span>
                    <span className="row__blurb">{c.blurb}</span>
                    <span className="row__meta">
                      {n.total} preguntas{n.media ? ` · ${n.media} con video` : ""}
                    </span>
                    <span className="row__go" aria-hidden>
                      Jugar
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="3" />
                      </svg>
                    </span>
                    {c.sfx && (
                      <span className="row__sfx sfx" aria-hidden>
                        {c.sfx}
                      </span>
                    )}
                  </button>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  );
}

function GroupSection({ onHost, onJoin }: { onHost: (name: string, seal: number) => void; onJoin: (code: string) => void }) {
  const [profile, setProfile] = useState(savedProfile);
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => setErr(null), [code, profile.name]);
  const host = () => {
    if (!profile.name.trim()) return setErr("Escribe tu nombre para que los demás te reconozcan.");
    onHost(profile.name.trim(), profile.seal);
  };
  const join = (e: React.FormEvent) => {
    e.preventDefault();
    const c = normalizeCode(code);
    if (c.length !== 5) return setErr("El código de sala tiene 5 letras o números.");
    onJoin(c);
  };
  return (
    <section id="grupo" className="group" aria-labelledby="group-t">
      <div className="group__in wrap">
        <div className="group__copy">
          <p className="label label--on-ink">En grupo</p>
          <h2 id="group-t" className="section-title">
            Una sala, hasta 10 celulares.
          </h2>
          <p className="section-lead">
            Creas la sala, compartes el código y cada quien juega desde su celular. Todos ven la misma pregunta al mismo tiempo y el marcador se mueve al revelar la respuesta.
          </p>
          <p className="group__fine">
            La sala vive en el navegador de quien la crea: si lo cierra, la partida termina. Los celulares se conectan entre sí directamente; no guardamos nombres ni puntajes.
          </p>
        </div>
        <div className="group__form panel">
          <ProfilePicker value={profile} onChange={setProfile} />
          <button type="button" className="btn btn--hanko btn--block" onClick={host}>
            Crear sala
          </button>
          <div className="group__or" aria-hidden>
            <span>o entra a una</span>
          </div>
          <form className="group__join" onSubmit={join}>
            <div className="field">
              <label htmlFor="code">Código de sala</label>
              <input
                id="code"
                className="input input--code"
                value={code}
                onChange={(e) => setCode(normalizeCode(e.target.value))}
                placeholder="ABCDE"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                inputMode="text"
                maxLength={5}
              />
            </div>
            <button type="submit" className="btn btn--block">
              Entrar
            </button>
          </form>
          {err && (
            <p className="form-err" role="alert">
              {err}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function Rules() {
  const rows: [string, string][] = [
    ["Partida", "10 preguntas de la categoría que elijas, de fácil a difícil."],
    ["Tiempo", "20 segundos por pregunta. En las de video son 25 y el reloj arranca cuando empieza a sonar."],
    ["Puntos", "Fácil 100, media 150, difícil 200, más hasta 100 por responder rápido."],
    ["Racha", "×1,5 desde 3 aciertos seguidos y ×2 desde 5. Fallar o quedarte sin tiempo la reinicia."],
    ["Videos", "Se reproduce solo un fragmento. Si un video no carga, la pregunta se cambia por otra y la partida sigue."],
    ["Teclado", "En computador puedes responder con 1, 2, 3 y 4, y pasar con Enter."],
  ];
  return (
    <section id="reglas" className="rules wrap" aria-labelledby="rules-t">
      <div className="rules__head">
        <p className="label">Reglas</p>
        <h2 id="rules-t" className="section-title">
          Cómo se cuentan los puntos.
        </h2>
      </div>
      <dl className="rules__list">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
