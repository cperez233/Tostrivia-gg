/* editorial-ui · Cristian Pérez · cristianperez.me
 * 404: el sello cae sobre una viñeta vacía y se queda torcido, sin nada que sellar.
 */
import { motion } from "framer-motion";
import { Seal } from "../components/Seal";
import { FocusLines } from "../components/Wipe";
import type { Tab } from "../components/Nav";

export default function NotFound({ onGo }: { onGo: (t: Tab) => void }) {
  const link = (t: Tab) => (e: React.MouseEvent) => {
    e.preventDefault();
    onGo(t);
  };
  return (
    <main className="nf wrap">
      <div className="nf__grid">
        <div className="nf__copy">
          <p className="label">Error 404</p>
          <h1 className="nf__title">Esta página no está en el tomo.</h1>
          <p className="muted">La dirección no existe o la sala que buscabas ya se cerró.</p>
          <nav className="nf__links" aria-label="Páginas">
            <a href="/categorias" onClick={link("cats")}>
              Categorías
            </a>
            <a href="/grupo" onClick={link("group")}>
              Jugar en grupo
            </a>
          </nav>
          <a href="/" className="btn btn--hanko" onClick={link("home")}>
            Volver a la ruleta
          </a>
        </div>
        <div className="nf__page panel" aria-hidden>
          <FocusLines className="nf__lines" />
          <motion.span
            className="nf__seal"
            initial={{ y: -160, rotate: 0, opacity: 0 }}
            animate={{ y: 0, rotate: [0, -16, -8], opacity: 1 }}
            transition={{ duration: 0.9, times: [0, 0.6, 1], ease: [0.22, 1, 0.36, 1] }}
          >
            <Seal text="?" size={120} />
          </motion.span>
        </div>
      </div>
    </main>
  );
}
