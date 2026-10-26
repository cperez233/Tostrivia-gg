/* editorial-ui · Cristian Pérez · cristianperez.me */
import { BANK } from "../data/bank";
import { CATEGORIES, FAMILY_BY_ID } from "../data/categories";
import { partsOf } from "./mix";
import type { Question } from "../data/types";
import { rng, shuffle, weightedShuffle } from "../lib/rng";
import { popularity } from "./popularity";
import { DEFAULT_RULES, MEDIA_EXTRA, type Difficulty, type Rules } from "./rules";

export const ROUND_SIZE = DEFAULT_RULES.count;
export const TEXT_MS = DEFAULT_RULES.time * 1000;
export const MEDIA_MS = (DEFAULT_RULES.time + MEDIA_EXTRA) * 1000;
/** puntos base por dificultad: una difícil rinde más del doble que una fácil */
export const BASE_POINTS = { 1: 100, 2: 200, 3: 350 } as const;

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
  // un póster cuenta como visto si salió en cualquier efecto (pixelado, borroso, detalle): que no vuelva la misma obra en la ronda siguiente
  const seenPosters = new Set([...seen].map((id) => BANK.byId[id]).filter((q): q is Question => !!q).map(posterOf).filter((p): p is string => !!p));
  const wasSeen = (q: Question) => seen.has(q.id) || (posterOf(q) !== null && seenPosters.has(posterOf(q)!));
  const fresh = pool.filter((q) => !wasSeen(q));
  const restart = fresh.length < Math.min(size, pool.length);

  // variedad: entre el 10 % y el 30 % de video en categorías normales (1 a 3 con 10), todas en Openings y OST gaming
  const mediaWanted = audioOnly ? size : Math.max(1, Math.round(size * (0.1 + rand() * 0.2)));
  const picked = pick(fresh, size, mediaWanted, audioOnly, rules.diff);
  if (picked.length < size) {
    const used = picked.filter((q) => q.media).length;
    // de las ya vistas, primero las que salieron hace más tiempo
    const order = [...seen];
    const rest = pool.filter((q) => !picked.includes(q)).sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    picked.push(...pick(rest, size - picked.length, Math.max(0, mediaWanted - used), audioOnly, rules.diff, picked));
  }
  // de menos a más; dentro de cada dificultad, en orden al azar (barajar y luego ordenar estable: sin sesgo)
  const chosen = shuffle(picked, rand).sort((a, b) => a.d - b.d);
  // reservas para cuando un video no carga: también primero las que no han salido y de la dificultad elegida
  const byFreshness = [...fresh.filter(inDiff), ...fresh.filter((q) => !inDiff(q)), ...pool.filter((q) => wasSeen(q))];
  const reserves = byFreshness.filter((q) => !chosen.includes(q) && (audioOnly || !q.media)).slice(0, Math.max(6, Math.ceil(size / 2)));
  return { ids: chosen.map((q) => q.id), reserves: reserves.map((q) => q.id), restart };
}

/**
 * Las preguntas de una categoría, barajadas. En una mezcla se intercalan sus categorías (una de cada una,
 * en orden al azar) para que la ronda no quede llena de la que más preguntas tiene.
 */
export function poolFor(cat: string, rand: () => number): Question[] {
  // en un "al azar" la ronda sale de las primeras categorías del orden: ahí lo más conocido pesa más.
  // Lo que la persona marcó a mano (una mezcla) va parejo, sin pesos.
  const order = cat.startsWith("azar-") ? weightedShuffle(partsOf(cat), popularity, rand) : shuffle(partsOf(cat), rand);
  const lists = order.map((c) => shuffle(BANK.byCat[c] || [], rand));
  const out: Question[] = [];
  for (let i = 0; lists.some((l) => i < l.length); i++) for (const l of lists) if (i < l.length) out.push(l[i]);
  return out;
}

/** texto sin tildes ni signos, para comparar */
const flat = (s: string) => s.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/[^a-z0-9]+/g, " ").trim();
const flatCache = new Map<string, { q: string; a: string }>();
function flatOf(q: Question) {
  let f = flatCache.get(q.id);
  if (!f) flatCache.set(q.id, (f = { q: ` ${flat(q.q)} `, a: flat(q.o[0]) }));
  return f;
}
/**
 * ¿Una de las dos preguntas escribe la respuesta de la otra? Entonces no deben ir en la misma ronda: la segunda se resuelve leyendo la primera.
 * Solo cuentan respuestas de 5 letras o más que no sean un número (un "4" o un "Sí" aparecen en cualquier lado).
 */
function leaks(a: Question, b: Question) {
  const fa = flatOf(a);
  const fb = flatOf(b);
  const hit = (ans: string, text: string) => ans.length >= 5 && !/^\d/.test(ans) && text.includes(` ${ans} `);
  return hit(fa.a, fb.q) || hit(fb.a, fa.q);
}

/** de qué obra es el póster de una pregunta de "Adivina el póster": solo puede salir una vez por ronda, sea cual sea el efecto */
const posterOf = (q: Question) => (q.visual?.v === "poster" ? q.visual.id : null);

/**
 * hasta `n` preguntas de `from`: unas de video y el resto repartido por dificultad.
 * `have` son las que ya van en la ronda: no se repite la obra de un póster (JJK pixelado y JJK borroso en la misma ronda),
 * salvo que no quede otra para llenarla.
 */
function pick(from: Question[], n: number, mediaWanted: number, audioOnly: boolean, diff: Difficulty, have: Question[] = []): Question[] {
  const out: Question[] = [];
  const posters = new Set(have.map(posterOf).filter((p): p is string => !!p));
  const free = (q: Question) => {
    const p = posterOf(q);
    return (!p || !posters.has(p)) && !out.some((x) => leaks(q, x)) && !have.some((x) => leaks(q, x));
  };
  const take = (q: Question) => {
    out.push(q);
    const p = posterOf(q);
    if (p) posters.add(p);
  };
  const fits = (q: Question) => diff === "mix" || q.d === diff;
  if (!audioOnly) {
    let withMedia = 0;
    for (const q of from) {
      if (withMedia >= Math.min(mediaWanted, n)) break;
      if (q.media && fits(q) && free(q)) (take(q), withMedia++);
    }
  }
  const want = mixFor(n, diff);
  for (const q of out) want[q.d] = Math.max(0, want[q.d] - 1);
  const rest = audioOnly ? from : from.filter((q) => !q.media);
  for (const d of [1, 2, 3]) {
    for (const q of rest) {
      if (want[d] <= 0 || out.length >= n) break;
      if (q.d === d && !out.includes(q) && free(q)) {
        take(q);
        want[d]--;
      }
    }
  }
  // si faltan de alguna dificultad, se completa primero con las de la dificultad elegida y luego con lo que haya (sin repetir póster)
  for (const q of [...rest.filter(fits), ...rest]) {
    if (out.length >= n) break;
    if (!out.includes(q) && free(q)) take(q);
  }
  // último recurso (categoría chica): se acepta repetir la obra
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

/** el bono por rapidez llega hasta esta fracción de los puntos base (proporcional al tiempo que sobra) */
export const SPEED_SHARE = 0.7;

/** bono por rapidez de una pregunta de dificultad `d`: escala con la dificultad para que no tape la base */
export const speedBonus = (d: 1 | 2 | 3, remainingFrac: number) =>
  Math.round(BASE_POINTS[d] * SPEED_SHARE * Math.max(0, Math.min(1, remainingFrac)));

/** ×1,25 con 2 seguidas, ×1,5 con 3, ×2 con 5 y ×3 con 8 (×1 siempre si la partida va sin racha) */
export function multiplier(streak: number, rules: Pick<Rules, "streak"> = DEFAULT_RULES) {
  if (!rules.streak) return 1;
  return streak >= 8 ? 3 : streak >= 5 ? 2 : streak >= 3 ? 1.5 : streak >= 2 ? 1.25 : 1;
}

/**
 * Puntos de un acierto: base por dificultad + hasta la mitad de la base por rapidez, por el multiplicador de racha
 * y por el multiplicador de puntos de la partida.
 */
export function pointsFor(d: 1 | 2 | 3, remainingFrac: number, streakAfter: number, rules: Pick<Rules, "streak" | "mult"> = DEFAULT_RULES) {
  const base = BASE_POINTS[d] + speedBonus(d, remainingFrac);
  return Math.round(base * multiplier(streakAfter, rules) * rules.mult);
}
