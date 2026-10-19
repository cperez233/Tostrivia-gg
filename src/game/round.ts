/* editorial-ui · Cristian Pérez · cristianperez.me */
import { BANK } from "../data/bank";
import { CATEGORIES, FAMILY_BY_ID } from "../data/categories";
import { partsOf } from "./mix";
import type { Question } from "../data/types";
import { rng, shuffle } from "../lib/rng";

export const ROUND_SIZE = 10;
export const TEXT_MS = 20_000;
export const MEDIA_MS = 25_000;
export const BASE_POINTS = { 1: 100, 2: 150, 3: 200 } as const;

/**
 * Elige 10 preguntas (3 fáciles, 4 medias, 3 difíciles, ordenadas de menos a más) y unas de reserva.
 * Primero van las que no han salido en esta vuelta (`seen`); si no alcanzan para una ronda entran todas
 * y se completa con la vuelta siguiente (`restart`: quien llama empieza el historial de cero).
 */
export function buildRound(cat: string, seed: number, seen: Set<string> = new Set()) {
  const rand = rng(seed);
  const pool = poolFor(cat, rand);
  const audioOnly = pool.length > 0 && pool.every((q) => q.media);
  const fresh = pool.filter((q) => !seen.has(q.id));
  const restart = fresh.length < ROUND_SIZE;

  // variedad: 1 a 3 preguntas de video en categorías normales, todas en Openings y OST gaming
  const mediaWanted = audioOnly ? ROUND_SIZE : 1 + Math.floor(rand() * 3);
  const picked = pick(fresh, ROUND_SIZE, mediaWanted, audioOnly);
  if (picked.length < ROUND_SIZE) {
    const used = picked.filter((q) => q.media).length;
    // de las ya vistas, primero las que salieron hace más tiempo
    const order = [...seen];
    const rest = pool.filter((q) => !picked.includes(q)).sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    picked.push(...pick(rest, ROUND_SIZE - picked.length, Math.max(0, mediaWanted - used), audioOnly));
  }
  const chosen = picked.sort((a, b) => a.d - b.d || (rand() < 0.5 ? -1 : 1));
  // reservas para cuando un video no carga: también primero las que no han salido
  const byFreshness = [...fresh, ...pool.filter((q) => seen.has(q.id))];
  const reserves = byFreshness.filter((q) => !chosen.includes(q) && (audioOnly || !q.media)).slice(0, 6);
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

/** hasta `n` preguntas de `from`: unas de video y el resto repartido por dificultad (3/4/3 en una ronda completa) */
function pick(from: Question[], n: number, mediaWanted: number, audioOnly: boolean): Question[] {
  const out: Question[] = [];
  if (!audioOnly) out.push(...from.filter((q) => q.media).slice(0, Math.min(mediaWanted, n)));
  const want = { 1: 3, 2: 4, 3: 3 } as Record<number, number>;
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
  // si faltan de alguna dificultad, se completa con lo que haya
  for (const q of rest) {
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

/** ×1,25 con 2 seguidas, ×1,5 con 3, ×2 con 5 y ×3 con 8 */
export function multiplier(streak: number) {
  return streak >= 8 ? 3 : streak >= 5 ? 2 : streak >= 3 ? 1.5 : streak >= 2 ? 1.25 : 1;
}

/** Puntos de un acierto: base por dificultad + hasta 200 por rapidez, por el multiplicador de racha. */
export function pointsFor(d: 1 | 2 | 3, remainingFrac: number, streakAfter: number) {
  const base = BASE_POINTS[d] + Math.round(SPEED_POINTS * Math.max(0, Math.min(1, remainingFrac)));
  return Math.round(base * multiplier(streakAfter));
}
