/* editorial-ui · Cristian Pérez · cristianperez.me
 * Qué preguntas ya salieron, por categoría, guardado en este navegador.
 * Dentro de una categoría no se repite ninguna hasta que hayan salido todas; ahí empieza otra vuelta.
 * En grupo cuenta el historial del anfitrión, que es quien arma las rondas.
 */
const KEY = "tostrivia:vistas:v1";

type Seen = Record<string, string[]>;

function load(): Seen {
  try {
    const raw = window.localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : {};
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

function save(data: Seen) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* modo privado o sin espacio: la vuelta solo dura lo que dure la pestaña */
  }
}

// copia en memoria: si el navegador no deja guardar, igual no se repiten mientras la pestaña siga abierta
let memory: Seen | null = null;
const data = () => (memory ??= typeof window === "undefined" ? {} : load());

/** ids que ya salieron en la vuelta actual de esta categoría */
export function seenIn(cat: string): Set<string> {
  return new Set(data()[cat] ?? []);
}

/** empieza una vuelta nueva: lo de la ronda que se está armando cuenta desde cero */
export function restartCycle(cat: string) {
  const d = data();
  d[cat] = [];
  save(d);
}

/** una pregunta apareció en pantalla */
export function markSeen(cat: string, qid: string) {
  const d = data();
  const list = (d[cat] ??= []);
  if (list.includes(qid)) return;
  list.push(qid);
  save(d);
}

/** borra lo guardado de las preguntas que ya no existen en el banco */
export function pruneTo(cat: string, valid: Set<string>) {
  const d = data();
  if (!d[cat]) return;
  const next = d[cat].filter((id) => valid.has(id));
  if (next.length !== d[cat].length) {
    d[cat] = next;
    save(d);
  }
}
