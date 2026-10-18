/* editorial-ui · Cristian Pérez · cristianperez.me
 * Navegación: arriba en escritorio, dock abajo en celular. El bloque de tinta se desliza a la pestaña activa.
 */
import { motion } from "framer-motion";
import { Logo } from "./Seal";
import "./nav.css";

export type Tab = "home" | "cats" | "group";
export const TABS: { id: Tab; path: string; label: string; wipe: string }[] = [
  { id: "home", path: "/", label: "Ruleta", wipe: "¡A girar!" },
  { id: "cats", path: "/categorias", label: "Categorías", wipe: "Categorías" },
  { id: "group", path: "/grupo", label: "En grupo", wipe: "En grupo" },
];

function Icon({ id }: { id: Tab }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 2.4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  if (id === "home")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="13" r="9" {...p} />
        <path d="M12 4v18M3 13h18M5.6 6.6l12.8 12.8M18.4 6.6L5.6 19.4" {...p} strokeWidth={1.6} />
        <path d="M9 1.5h6L12 6z" fill="currentColor" />
      </svg>
    );
  if (id === "cats")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
        <path d="M3 3h8v10H3zM13 3h8v6h-8zM13 11h8v10h-8zM3 15h8v6H3z" {...p} />
      </svg>
    );
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <circle cx="8.5" cy="9" r="3.6" {...p} />
      <circle cx="16.5" cy="10" r="3" {...p} />
      <path d="M2.5 20c.6-3.6 3-5.6 6-5.6s5.4 2 6 5.6M14.5 15.2c.6-.3 1.3-.4 2-.4 2.6 0 4.4 1.8 5 5.2" {...p} />
    </svg>
  );
}

export default function Nav({ active, onGo }: { active: Tab | null; onGo: (t: Tab) => void }) {
  const click = (t: Tab) => (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (t !== active) onGo(t);
  };
  return (
    <>
      <header className="topnav">
        <div className="topnav__in wrap">
          <a href="/" className="topnav__logo" onClick={click("home")} aria-label="Tostrivia, ir a la ruleta">
            <Logo size={38} />
          </a>
          <nav className="topnav__tabs" aria-label="Secciones">
            {TABS.map((t) => (
              <a key={t.id} href={t.path} className={`topnav__tab ${active === t.id ? "is-on" : ""}`} aria-current={active === t.id ? "page" : undefined} onClick={click(t.id)}>
                {active === t.id && <motion.span layoutId="topnav-pill" className="topnav__pill" transition={{ type: "spring", stiffness: 480, damping: 34 }} />}
                <span className="topnav__label">{t.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </header>
      <nav className="dock" aria-label="Secciones">
        {TABS.map((t) => (
          <a key={t.id} href={t.path} className={`dock__item ${active === t.id ? "is-on" : ""}`} aria-current={active === t.id ? "page" : undefined} onClick={click(t.id)}>
            {active === t.id && <motion.span layoutId="dock-pill" className="dock__pill" transition={{ type: "spring", stiffness: 480, damping: 32 }} />}
            <motion.span className="dock__icon" animate={active === t.id ? { y: -2, rotate: [0, -10, 0] } : { y: 0, rotate: 0 }} transition={{ duration: 0.4 }}>
              <Icon id={t.id} />
            </motion.span>
            <span className="dock__label">{t.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
