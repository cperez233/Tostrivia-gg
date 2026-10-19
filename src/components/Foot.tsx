/* editorial-ui · Cristian Pérez · cristianperez.me */
import { firmaInvisible } from "../lib/signature";
import { t } from "../i18n";

export default function Foot() {
  return (
    <footer className="foot">
      <p className="foot__in wrap">
        <span>{t("Tostrivia es un juego de fans. Las series, juegos y canciones son de sus dueños; los videos suenan desde YouTube.")}</span>
        <span>
          {t("Entintado por")}{" "}
          <a href="https://cristianperez.me" target="_blank" rel="noopener">
            Cristian Pérez
          </a>
          {firmaInvisible}
        </span>
      </p>
    </footer>
  );
}
