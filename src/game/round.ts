/* editorial-ui · Cristian Pérez · cristianperez.me */
import { BANK } from "../data/bank";
import { CATEGORIES, FAMILY_BY_ID } from "../data/categories";
import type { Question } from "../data/types";
import { rng, shuffle } from "../lib/rng";

export const ROUND_SIZE = 10;
export const TEXT_MS = 20_000;
export const MEDIA_MS = 25_000;
export const BASE_POINTS = { 1: 100, 2: 150, 3: 200 } as const;

/** Elige 10 preguntas (3 fáciles, 4 medias, 3 difíciles, ordenadas de menos a más) y unas de reserva. */
export function buildRound(cat: string, seed: number) {
  const rand = rng(seed);
  const pool = shuffle(BANK.byCat[cat] || [], rand);
  const audioOnly = pool.length > 0 && pool.every((q) => q.media);
  const media = pool.filter((q) => q.media);
  const text = pool.filter((q) => !q.media);

  const picked: Question[] = [];
  // variedad: 1 a 3 preguntas de video en categorías normales, todas en Openings y OST gaming
  if (!audioOnly) picked.push(...media.slice(0, Math.min(media.length, 1 + Math.floor(rand() * 3))));
  const want = { 1: 3, 2: 4, 3: 3 } as Record<number, number>;
  for (const q of picked) want[q.d] = Math.max(0, want[q.d] - 1);
  const rest = audioOnly ? media : text;
  for (const d of [1, 2, 3]) {
    for (const q of rest) {
      if (want[d] <= 0) break;
      if (q.d === d && !picked.includes(q)) {
        picked.push(q);
        want[d]--;
      }
    }
  }
  // si faltan de alguna dificultad, se completa con lo que haya
  for (const q of rest) {
    if (picked.length >= ROUND_SIZE) break;
    if (!picked.includes(q)) picked.push(q);
  }
  const chosen = picked.slice(0, ROUND_SIZE).sort((a, b) => a.d - b.d || (rand() < 0.5 ? -1 : 1));
  const reserves = pool.filter((q) => !chosen.includes(q) && (audioOnly || !q.media)).slice(0, 6);
  return { ids: chosen.map((q) => q.id), reserves: reserves.map((q) => q.id) };
}

/** Preguntas sin video para cuando YouTube no responde. En Openings y OST gaming se toman de su lado (anime o juegos). */
export function textBackups(cat: string, seed: number): string[] {
  const rand = rng(seed ^ 0x5bd1e995);
  const own = (BANK.byCat[cat] || []).filter((q) => !q.media);
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

export function multiplier(streak: number) {
  return streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1;
}

/** Puntos de un acierto: base por dificultad + hasta 100 por rapidez, por el multiplicador de racha. */
export function pointsFor(d: 1 | 2 | 3, remainingFrac: number, streakAfter: number) {
  const base = BASE_POINTS[d] + Math.round(100 * Math.max(0, Math.min(1, remainingFrac)));
  return Math.round(base * multiplier(streakAfter));
}
