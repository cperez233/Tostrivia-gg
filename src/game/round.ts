/* editorial-ui · Cristian Pérez · cristianperez.me */
import { BANK } from "../data/bank";
import { CATEGORIES, FAMILY_BY_ID } from "../data/categories";
import { partsOf } from "./mix";
import type { Question } from "../data/types";
import { rng, shuffle } from "../lib/rng";
import { DEFAULT_RULES, MEDIA_EXTRA, type Difficulty, type Rules } from "./rules";

export const ROUND_SIZE = DEFAULT_RULES.count;
export const TEXT_MS = DEFAULT_RULES.time * 1000;
export const MEDIA_MS = (DEFAULT_RULES.time + MEDIA_EXTRA) * 1000;
export const BASE_POINTS = { 1: 100, 2: 150, 3: 200 } as const;

/** cuánto dura una pregunta con estas reglas */
export const durationFor = (rules: Rules, media: boolean) => (rules.time + (media ? MEDIA_EXTRA : 0)) * 1000;

/** cuántas fáciles, medias y difíciles: 30/40/30 en mixta (3/4/3 con 10), o todas de una */
function mixFor(n: number, diff: Difficulty): Record<number, number> {
  if (diff !== "mix") return { 1: 0, 2: 0, 3: 0, [diff]: n };
  const easy = Math.round(n * 0.3);
  const hard = Math.round(n * 0.3);
  return { 1: easy, 2: n - easy - hard, 3: hard };
}

/**
 * Elige las preguntas de la ronda (de menos a más difícil en mixta) y unas de reserva.
 * Primero van las que no han salido en esta vuelta (`seen`); si no alcanzan para una ronda entran todas
 * y se completa con la vuelta siguiente (`restart`: quien llama empieza el historial de cero).
 * Si la categoría tiene menos preguntas que las pedidas, la ronda queda del tamaño de la categoría.
 */
export function buildRound(cat: string, seed: number, seen: Set<string> = new Set(), rules: Rules = DEFAULT_RULES) {
  const rand = rng(seed);
  const size = rules.count;
  const pool = poolFor(cat, rand);
  const audioOnly = pool.length > 0 && pool.every((q) => q.media);
  // con una dificultad fija, las de esa dificultad van primero (las otras solo rellenan si faltan)
  const inDiff = (q: Question) => rules.diff === "mix" || q.d === rules.diff;
  const fresh = pool.filter((q) => !seen.has(q.id));
  const restart = fresh.length < Math.min(size, pool.length);

  // variedad: entre el 10 % y el 30 % de video en categorías normales (1 a 3 con 10), todas en Openings y OST gaming
  const mediaWanted = audioOnly ? size : Math.max(1, Math.round(size * (0.1 + rand() * 0.2)));
  const picked = pick(fresh, size, mediaWanted, audioOnly, rules.diff);
  if (picked.length < size) {
    const used = picked.filter((q) => q.media).length;
    // de las ya vistas, primero las que salieron hace más tiempo
    const order = [...seen];
    const rest = pool.filter((q) => !picked.includes(q)).sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    picked.push(...pick(rest, size - picked.length, Math.max(0, mediaWanted - used), audioOnly, rules.diff));
  }
  // de menos a más; dentro de cada dificultad, en orden al azar (barajar y luego ordenar estable: sin sesgo)
  const chosen = shuffle(picked, rand).sort((a, b) => a.d - b.d);
  // reservas para cuando un video no carga: también primero las que no han salido y de la dificultad elegida
  const byFreshness = [...fresh.filter(inDiff), ...fresh.filter((q) => !inDiff(q)), ...pool.filter((q) => seen.has(q.id))];
  const reserves = byFreshness.filter((q) => !chosen.includes(q) && (audioOnly || !q.media)).slice(0, Math.max(6, Math.ceil(size / 2)));
  return { ids: chosen.map((q) => q.id), reserves: reserves.map((q) => q.id), restart };
}

/**
 * Las preguntas de una categoría, barajadas. En una mezcla se intercalan sus categorías (una de cada una,
 * en orden al azar) para que la ronda no quede llena de la que más preguntas tiene.
 */
export function poolFor(cat: string, rand: () => number): Question[] {
  const lists = shuffle(partsOf(cat), rand).map((c) => shuffle(BANK.byCat[c] || [], rand));
  const out: Question[] = [];
  for (let i = 0; lists.some((l) => i < l.length); i++) for (const l of lists) if (i < l.length) out.push(l[i]);
  return out;
}

/** hasta `n` preguntas de `from`: unas de video y el resto repartido por dificultad */
function pick(from: Question[], n: number, mediaWanted: number, audioOnly: boolean, diff: Difficulty): Question[] {
  const out: Question[] = [];
  const fits = (q: Question) => diff === "mix" || q.d === diff;
  if (!audioOnly) out.push(...from.filter((q) => q.media && fits(q)).slice(0, Math.min(mediaWanted, n)));
  const want = mixFor(n, diff);
  for (const q of out) want[q.d] = Math.max(0, want[q.d] - 1);
  const rest = audioOnly ? from : from.filter((q) => !q.media);
  for (const d of [1, 2, 3]) {
    for (const q of rest) {
      if (want[d] <= 0 || out.length >= n) break;
      if (q.d === d && !out.includes(q)) {
        out.push(q);
        want[d]--;
      }
    }
  }
  // si faltan de alguna dificultad, se completa primero con las de la dificultad elegida y luego con lo que haya
  for (const q of [...rest.filter(fits), ...rest]) {
    if (out.length >= n) break;
    if (!out.includes(q)) out.push(q);
  }
  return out;
}

/** Preguntas sin video para cuando YouTube no responde. En Openings y OST gaming se toman de su lado (anime o juegos). */
export function textBackups(cat: string, seed: number): string[] {
  const rand = rng(seed ^ 0x5bd1e995);
  const own = partsOf(cat).flatMap((c) => BANK.byCat[c] || []).filter((q) => !q.media);
  let pool = own;
  if (own.length < 10) {
    const side = cat === "openings" ? "anime" : cat === "soundtracks" ? "juegos" : null;
    pool = CATEGORIES.filter((c) => side && FAMILY_BY_ID[c.family].group === side).flatMap((c) => (BANK.byCat[c.id] || []).filter((q) => !q.media));
  }
  return shuffle(pool, rand)
    .sort((a, b) => a.d - b.d)
    .map((q) => q.id);
}

/** Orden de las 4 opciones para una pregunta: el mismo en todos los dispositivos. */
export function optionOrder(qid: string, seed: number): number[] {
  let h = seed >>> 0;
  for (let i = 0; i < qid.length; i++) h = Math.imul(h ^ qid.charCodeAt(i), 2654435761) >>> 0;
  return shuffle([0, 1, 2, 3], rng(h));
}

/** hasta cuánto suma responder rápido (proporcional al tiempo que sobra) */
export const SPEED_POINTS = 200;

/** ×1,25 con 2 seguidas, ×1,5 con 3, ×2 con 5 y ×3 con 8 (×1 siempre si la partida va sin racha) */
export function multiplier(streak: number, rules: Pick<Rules, "streak"> = DEFAULT_RULES) {
  if (!rules.streak) return 1;
  return streak >= 8 ? 3 : streak >= 5 ? 2 : streak >= 3 ? 1.5 : streak >= 2 ? 1.25 : 1;
}

/**
 * Puntos de un acierto: base por dificultad + hasta 200 por rapidez, por el multiplicador de racha
 * y por el multiplicador de puntos de la partida.
 */
export function pointsFor(d: 1 | 2 | 3, remainingFrac: number, streakAfter: number, rules: Pick<Rules, "streak" | "mult"> = DEFAULT_RULES) {
  const base = BASE_POINTS[d] + Math.round(SPEED_POINTS * Math.max(0, Math.min(1, remainingFrac)));
  return Math.round(base * multiplier(streakAfter, rules) * rules.mult);
}
