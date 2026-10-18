/* editorial-ui · Cristian Pérez · cristianperez.me
 * El pie es el colofón (okuzuke) de un tomo de manga: los datos de la edición, en su caja, con el sello del editor.
 */
import { motion } from "framer-motion";
import { Seal } from "./Seal";
import { firmaInvisible } from "../lib/signature";
import "./colophon.css";

export default function Colophon({ totals }: { totals: { q: number; v: number; c: number } }) {
  return (
    <footer className="colophon">
      <div className="colophon__in wrap">
        <div className="colophon__box">
          <div className="colophon__title">
            <span className="colophon__name">Tostrivia</span>
            <span className="colophon__ed">Primera edición · octubre de 2026</span>
          </div>
          <dl className="colophon__rows">
            <div>
              <dt>Contenido</dt>
              <dd>
                {totals.q.toLocaleString("es-CO")} preguntas en {totals.c} categorías; {totals.v} con video.
              </dd>
            </div>
            <div>
              <dt>Videos</dt>
              <dd>Se reproducen desde YouTube con su reproductor oficial. Si alguno no carga, la pregunta se cambia.</dd>
            </div>
            <div>
              <dt>Salas</dt>
              <dd>Conexión directa entre navegadores (WebRTC). La sala vive en el dispositivo de quien la crea.</dd>
            </div>
            <div>
              <dt>Derechos</dt>
              <dd>Juego de fans sin afiliación. Los nombres de series, juegos, canciones y personajes son de sus dueños.</dd>
            </div>
          </dl>
          <nav className="colophon__nav" aria-label="Pie">
            <a href="#inicio">Ruleta</a>
            <a href="#categorias">Categorías</a>
            <a href="#grupo">Jugar en grupo</a>
            <a href="#reglas">Reglas</a>
          </nav>
          <motion.span
            className="colophon__stamp"
            aria-hidden
            initial={{ scale: 1.9, rotate: 14, opacity: 0 }}
            whileInView={{ scale: 1, rotate: -9, opacity: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ type: "spring", stiffness: 420, damping: 15 }}
          >
            <Seal text="T" size={78} variant={0} />
          </motion.span>
        </div>
        <p className="colophon__legal">
          <span>© 2026 Tostrivia</span>
          <span className="colophon__credit">
            Entintado viñeta a viñeta por{" "}
            <a href="https://cristianperez.me" target="_blank" rel="noopener">
              Cristian Pérez
            </a>
            {firmaInvisible}
          </span>
        </p>
      </div>
    </footer>
  );
}
