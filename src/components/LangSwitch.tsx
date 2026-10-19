/* editorial-ui · Cristian Pérez · cristianperez.me
 * Selector de idioma: dos sellos, ES y EN. La primera vez manda el idioma del navegador; luego, lo que se elija aquí.
 */
import { motion } from "framer-motion";
import { LANGS, setLang, t, useLang } from "../i18n";
import "./lang.css";

export default function LangSwitch() {
  const lang = useLang();
  return (
    <div className="lang" role="radiogroup" aria-label={t("Idioma")}>
      {LANGS.map((l) => (
        <button key={l.id} type="button" role="radio" aria-checked={lang === l.id} lang={l.id} title={l.name} aria-label={l.name} className={`lang__opt ${lang === l.id ? "is-on" : ""}`} onClick={() => setLang(l.id)}>
          {lang === l.id && <motion.span layoutId="lang-pill" className="lang__pill" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
          <span className="lang__label">{l.label}</span>
        </button>
      ))}
    </div>
  );
}
