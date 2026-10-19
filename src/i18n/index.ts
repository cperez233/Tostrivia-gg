/* editorial-ui · Cristian Pérez · cristianperez.me
 * Idioma de la interfaz. Los textos se escriben en español dentro de t() y el español es la clave:
 * si una frase no tiene traducción, sale en español. El idioma se toma del navegador la primera vez
 * (si no es inglés ni español, queda en español) y después se recuerda la elección.
 */
import { useSyncExternalStore } from "react";
import { EN } from "./en";

export type Lang = "es" | "en";
export const LANGS: { id: Lang; label: string; name: string }[] = [
  { id: "es", label: "ES", name: "Español" },
  { id: "en", label: "EN", name: "English" },
];

const KEY = "tostrivia:lang";

function detect(): Lang {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "es" || saved === "en") return saved;
  } catch {
    /* sin almacenamiento: se detecta cada vez */
  }
  const list = typeof navigator === "undefined" ? [] : navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const l of list) {
    const base = l?.toLowerCase().split("-")[0];
    if (base === "es" || base === "en") return base;
  }
  return "es";
}

let lang: Lang = detect();
const subs = new Set<() => void>();
const notify = () => subs.forEach((f) => f());

/** traducciones de las preguntas: pesan, así que solo se bajan si se juega en inglés */
let questionsEn: Record<string, [string, string, string, string, string]> | null = null;
let loading: Promise<void> | null = null;
function loadQuestions() {
  if (questionsEn || loading) return;
  loading = import("./questions.en.json")
    .then((m) => {
      questionsEn = (m.default ?? m) as unknown as typeof questionsEn;
      notify();
    })
    .catch(() => {
      loading = null;
    });
}

function apply() {
  if (typeof document !== "undefined") document.documentElement.lang = lang;
  if (lang === "en") loadQuestions();
}
apply();

export const getLang = () => lang;

export function setLang(l: Lang) {
  if (l === lang) return;
  lang = l;
  try {
    localStorage.setItem(KEY, l);
  } catch {
    /* no se recuerda, pero cambia igual */
  }
  apply();
  notify();
}

/** suscribe el componente al idioma: al cambiarlo se vuelve a pintar */
export function useLang(): Lang {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    getLang,
    getLang,
  );
}

/** t("Pregunta {n}", { n: 3 }) */
export function t(es: string, vars?: Record<string, string | number>): string {
  let s = lang === "en" ? (EN[es] ?? es) : es;
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
  return s;
}

/** formato de números del idioma actual */
export const locale = () => (lang === "en" ? "en-US" : "es-CO");

/** la misma clave que usa el script que arma questions.en.json: se calcula sobre el texto original */
export function questionKey(q: string, o: readonly string[]) {
  let h = 2166136261;
  for (const ch of [q, ...o].join("|")) h = Math.imul(h ^ ch.codePointAt(0)!, 16777619) >>> 0;
  return h.toString(36);
}

/** pregunta y opciones en el idioma actual (mismo orden: la 0 sigue siendo la correcta) */
export function localizeQuestion<T extends { q: string; o: [string, string, string, string] }>(question: T): T {
  if (lang !== "en" || !questionsEn) return question;
  const tr = questionsEn[questionKey(question.q, question.o)];
  if (!tr) return question;
  return { ...question, q: tr[0], o: [tr[1], tr[2], tr[3], tr[4]] };
}

/** nombres de datos (categorías, familias) que se leen en el momento: el objeto no cambia, el texto sí */
export function translateFields<T extends object>(obj: T, fields: (keyof T)[]) {
  for (const f of fields) {
    const es = obj[f];
    if (typeof es !== "string") continue;
    Object.defineProperty(obj, f, { get: () => t(es), enumerable: true, configurable: true });
  }
  return obj;
}
