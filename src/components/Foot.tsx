/* editorial-ui · Cristian Pérez · cristianperez.me */
import { firmaInvisible } from "../lib/signature";

export default function Foot() {
  return (
    <footer className="foot">
      <p className="foot__in wrap">
        <span>Tostrivia es un juego de fans. Las series, juegos y canciones son de sus dueños; los videos suenan desde YouTube.</span>
        <span>
          Entintado por{" "}
          <a href="https://cristianperez.me" target="_blank" rel="noopener">
            Cristian Pérez
          </a>
          {firmaInvisible}
        </span>
      </p>
    </footer>
  );
}
