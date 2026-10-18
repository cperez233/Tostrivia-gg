/* editorial-ui · Cristian Pérez · cristianperez.me
 * 404: el sello cae sobre una página en blanco y se queda torcido, sin nada que sellar.
 */
import { motion } from "framer-motion";
import { Logo, Seal } from "../components/Seal";

export default function NotFound({ onHome }: { onHome: () => void }) {
  return (
    <div className="nf wrap">
      <a href="/" className="solo__logo" onClick={(e) => (e.preventDefault(), onHome())} aria-label="Ir al inicio">
        <Logo size={36} />
      </a>
      <div className="nf__grid">
        <div className="nf__copy">
          <p className="label">Error 404</p>
          <h1 className="nf__title">Esta página no está en el tomo.</h1>
          <p>La dirección no existe o la sala que buscabas ya se cerró. Estas sí existen:</p>
          <nav className="nf__links" aria-label="Páginas">
            <a href="/#categorias">Categorías</a>
            <a href="/#grupo">Jugar en grupo</a>
            <a href="/#reglas">Reglas</a>
          </nav>
          <button type="button" className="btn btn--hanko" onClick={onHome}>
            Volver a la ruleta
          </button>
        </div>
        <div className="nf__page panel tone-dots" aria-hidden>
          <div className="nf__blank" />
          <motion.span
            className="nf__seal"
            initial={{ y: -120, rotate: 0, opacity: 0 }}
            animate={{ y: 0, rotate: [0, -14, -8], opacity: 1 }}
            transition={{ duration: 0.9, times: [0, 0.6, 1], ease: [0.22, 1, 0.36, 1] }}
          >
            <Seal text="?" size={120} />
          </motion.span>
        </div>
      </div>
    </div>
  );
}
