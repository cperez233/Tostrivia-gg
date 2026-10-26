/* editorial-ui · Cristian Pérez · cristianperez.me
 * "¿Cómo se juega?": un botón discreto que abre una hoja corta con las reglas en tres pestañas (lo básico, poderes, armar la partida).
 * No se abre sola ni tapa nada: está en la barra de arriba y en la sala de espera. Los números salen de las mismas constantes del juego.
 */
import { useEffect, useId, useRef, useState } from "react";
import { BASE_POINTS } from "../game/round";
import { MEDIA_EXTRA } from "../game/rules";
import { POWER_ICON, POWER_TEXT, POWER_RULES, type PowerId } from "../game/powers";
import { t, useLang } from "../i18n";
import "./howto.css";

type TabId = "basics" | "powers" | "build";
const TABS: { id: TabId; label: string }[] = [
  { id: "basics", label: "Lo básico" },
  { id: "powers", label: "Poderes" },
  { id: "build", label: "Armar la partida" },
];

/** unos cuantos de cada tipo, para que se entienda la idea sin leer los 27 */
const EXAMPLES: { title: string; blurb: string; list: PowerId[] }[] = [
  { title: "Para ti", blurb: "Te ayudan a ti: aciertas más o pierdes menos.", list: ["half", "star", "shield", "mushroom"] },
  { title: "Contra los demás", blurb: "Les quitan puntos. Si vas primero, ojo.", list: ["redShell", "blueShell", "lightning", "banana"] },
  { title: "Caos en su pantalla", blurb: "Les estorban 15 s mientras responden.", list: ["ink", "flip", "dark", "scramble"] },
];

export default function HowTo({ variant = "icon" }: { variant?: "icon" | "text" }) {
  useLang();
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabId>("basics");
  const id = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  // al cerrar, el <dialog> devuelve el foco al botón por su cuenta (y un toque no deja aro)
  const close = () => setOpen(false);
  const tabKey = (e: React.KeyboardEvent, i: number) => {
    const to = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
    if (to === null) return;
    e.preventDefault();
    const next = TABS[(to + TABS.length) % TABS.length].id;
    setTab(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <>
      <button
        type="button"
        className={`howto__open howto__open--${variant}`}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={t("¿Cómo se juega?")}
        title={t("¿Cómo se juega?")}
      >
        <span className="howto__mark" aria-hidden>
          ?
        </span>
        {variant === "text" && <span>{t("¿Cómo se juega?")}</span>}
      </button>

      <dialog
        ref={ref}
        className="howto"
        aria-labelledby={`${id}-title`}
        onClose={() => setOpen(false)}
        // tocar la sombra de afuera la cierra
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className="howto__card">
          <header className="howto__head">
            <div>
              <p className="label">{t("Reglas rápidas")}</p>
              <h2 id={`${id}-title`} className="howto__title">
                {t("¿Cómo se juega?")}
              </h2>
            </div>
            <button type="button" className="howto__x" onClick={close} aria-label={t("Cerrar")}>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="3" />
              </svg>
            </button>
          </header>

          <div className="howto__tabs" role="tablist" aria-label={t("Reglas rápidas")}>
            {TABS.map((x, i) => (
              <button key={x.id} type="button" role="tab" id={`${id}-tab-${x.id}`} aria-selected={tab === x.id} aria-controls={`${id}-panel`} tabIndex={tab === x.id ? 0 : -1} className={`howto__tab ${tab === x.id ? "is-on" : ""}`} onClick={() => setTab(x.id)} onKeyDown={(e) => tabKey(e, i)}>
                {t(x.label)}
              </button>
            ))}
          </div>

          <div className="howto__body" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${tab}`} key={tab}>
            {tab === "basics" && <Basics />}
            {tab === "powers" && <Powers />}
            {tab === "build" && <Build />}
          </div>

          <footer className="howto__foot">
            <button type="button" className="btn btn--hanko" onClick={close}>
              {t("Entendido")}
            </button>
          </footer>
        </div>
      </dialog>
    </>
  );
}

function Steps({ items }: { items: { head: string; text: string }[] }) {
  return (
    <ol className="howto__steps">
      {items.map((s) => (
        <li key={s.head}>
          <h3>{s.head}</h3>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

function Basics() {
  return (
    <Steps
      items={[
        { head: t("Responde antes de que se acabe el reloj"), text: t("Cada pregunta tiene 4 opciones y solo una es la buena. Las de video o audio dan {n} s más.", { n: MEDIA_EXTRA }) },
        { head: t("Entre más rápido, más puntos"), text: t("Un acierto vale {a}, {b} o {c} según qué tan difícil sea la pregunta, y le sumas un bono por rapidez.", { a: BASE_POINTS[1], b: BASE_POINTS[2], c: BASE_POINTS[3] }) },
        { head: t("La racha multiplica"), text: t("Acertar seguido sube el multiplicador: ×1,25 con 2, ×1,5 con 3, ×2 con 5 y ×3 con 8. Fallar la rompe.") },
        { head: t("Gana el que más puntos junte"), text: t("Al final de las preguntas se cuentan los puntos. En grupo, todos juegan la misma pregunta a la vez.") },
      ]}
    />
  );
}

function Powers() {
  const p = POWER_RULES.powers;
  const u = POWER_RULES.ultra;
  return (
    <div className="howto__stack">
      <p className="howto__lead">
        {t("Solo en los modos Locura y Ultra Locura. Los poderes se usan antes de responder, tocándolos en tu mano.")}
      </p>
      <Steps
        items={[
          { head: t("Cómo se consiguen"), text: t("Empiezas con {n}. Ganas otro con {earn} aciertos seguidos, y si fallas {cold} seguidas te llega uno de consuelo. Caben {max} en la mano.", { n: p.start, earn: p.earn, cold: p.cold, max: p.max }) },
          { head: t("Uno por pregunta"), text: t("Se tira un poder por pregunta. El Bloque ? no cuenta: te da dos más y sigues.") },
          { head: t("Ultra Locura, a lo grande"), text: t("Arrancas con {s}, guardas hasta {m}, ganas uno con cada acierto y tiras {u} por pregunta.", { s: u.start, m: u.max, u: u.uses }) },
        ]}
      />
      {EXAMPLES.map((g) => (
        <section key={g.title} className="howto__group" aria-label={t(g.title)}>
          <h3>{t(g.title)}</h3>
          <p>{t(g.blurb)}</p>
          <ul>
            {g.list.map((id) => (
              <li key={id}>
                <span className="howto__ico" aria-hidden>
                  {POWER_ICON[id]}
                </span>
                <span>
                  <strong>{POWER_TEXT[id].name}</strong> {POWER_TEXT[id].desc}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="howto__note">{t("En grupo, el que va atrás recibe los poderes más fuertes. El Escudo frena los ataques que te lleguen.")}</p>
    </div>
  );
}

function Build() {
  return (
    <Steps
      items={[
        { head: t("Una categoría, o varias"), text: t("Gira la ruleta o entra a Categorías. Con “Varias a la vez” marcas las que quieras y salen preguntas de todas.") },
        { head: t("Atajos"), text: t("Son mezclas ya armadas con temas parecidos: el Big 3, Nintendo, sitcoms… Tócalos y listo.") },
        { head: t("Tus partidas"), text: t("Marca categorías, toca Guardar y ponle nombre. Queda en Mis partidas, con su modo y sus reglas, en este dispositivo.") },
        { head: t("En grupo"), text: t("Uno crea la sala y comparte el código. Cada quien tiene su propio animal. El anfitrión puede darle la corona a alguien para que también maneje la sala.") },
      ]}
    />
  );
}
