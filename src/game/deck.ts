/* editorial-ui · Cristian Pérez · cristianperez.me
 * Qué gajos lleva la ruleta según el filtro. El anfitrión arma el mazo y lo reparte en la foto del estado.
 */
import { playable } from "./mix";
import { CATEGORIES, FAMILY_BY_ID } from "../data/categories";
import type { GroupId } from "../data/types";
import { randomInt, rng, shuffle, weightedIndex } from "../lib/rng";
import type { Spin } from "./match";

export type Filter = "todo" | GroupId;

export const FILTERS: { id: Filter; label: string }[] = [
  { id: "todo", label: "Todo" },
  { id: "anime", label: "Anime" },
  { id: "juegos", label: "Juegos" },
  { id: "series", label: "Series y pelis" },
  { id: "cultura", label: "Cultura" },
];

export { playable };
const poolOf = (g: GroupId) => CATEGORIES.filter((c) => FAMILY_BY_ID[c.family].group === g && playable(c.id)).map((c) => c.id);

/** la categoría de música de cada lado: siempre tiene gajo en su rueda */
const MUSIC = { anime: "openings", juegos: "soundtracks" } as const;
const isMusic = (cat: string) => cat === MUSIC.anime || cat === MUSIC.juegos;

export function makeDeck(filter: Filter, seed: number): string[] {
  const rand = rng(seed);
  if (filter === "cultura") return shuffle(poolOf("cultura"), rand);
  if (filter === "series") return shuffle(poolOf("series"), rand).slice(0, 8);
  if (filter === "anime" || filter === "juegos") {
    const music = playable(MUSIC[filter]) ? [MUSIC[filter]] : [];
    const rest = shuffle(poolOf(filter).filter((c) => !isMusic(c)), rand).slice(0, 8 - music.length);
    return shuffle([...music, ...rest], rand);
  }
  // todo: tres de anime, tres de juegos, dos de series o películas, uno de cultura y uno de música (openings u OST), intercalados
  const a = shuffle(poolOf("anime").filter((c) => !isMusic(c)), rand).slice(0, 3);
  const j = shuffle(poolOf("juegos").filter((c) => !isMusic(c)), rand).slice(0, 3);
  const s = shuffle(poolOf("series"), rand).slice(0, 2);
  const c = shuffle(poolOf("cultura"), rand)[0];
  const o = shuffle([MUSIC.anime, MUSIC.juegos].filter(playable), rand)[0];
  return [a[0], j[0], s[0], a[1], c, j[1], a[2], s[1], j[2], o].filter(Boolean);
}

const RECENT_KEY = "tostrivia:spins";
const RECENT_KEEP = 6;
let recentMem: string[] = [];
function recentSpins(): string[] {
  try {
    const list = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    if (Array.isArray(list)) return list.filter((x): x is string => typeof x === "string").slice(0, RECENT_KEEP);
  } catch {
    /* sin almacenamiento: se usa la memoria de esta pestaña */
  }
  return recentMem;
}
function remember(cat: string) {
  recentMem = [cat, ...recentSpins().filter((c) => c !== cat)].slice(0, RECENT_KEEP);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recentMem));
  } catch {
    /* no se recuerda entre visitas */
  }
}

/**
 * Hacia dónde cae la ruleta. Azar criptográfico y con memoria: la categoría que acaba de salir casi
 * nunca repite y las de los últimos giros pesan menos, para que no se sienta que siempre cae lo mismo.
 * Si el mazo es todo de lo reciente, cae en cualquiera.
 */
export function makeSpin(deck: string[]): Spin {
  const recent = recentSpins();
  const weights = deck.map((c) => {
    const k = recent.indexOf(c);
    return k < 0 ? 1 : k === 0 ? 0.08 : k < 3 ? 0.35 : 0.7;
  });
  const index = weightedIndex(weights);
  remember(deck[index]);
  return { cat: deck[index], index, nonce: randomInt(1e9) };
}
