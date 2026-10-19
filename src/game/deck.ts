/* editorial-ui · Cristian Pérez · cristianperez.me
 * Qué gajos lleva la ruleta según el filtro. El anfitrión arma el mazo y lo reparte en la foto del estado.
 */
import { BANK } from "../data/bank";
import { CATEGORIES, FAMILY_BY_ID } from "../data/categories";
import type { GroupId } from "../data/types";
import { rng, shuffle } from "../lib/rng";
import type { Spin } from "./match";

export type Filter = "todo" | GroupId;

export const FILTERS: { id: Filter; label: string }[] = [
  { id: "todo", label: "Todo" },
  { id: "anime", label: "Anime" },
  { id: "juegos", label: "Juegos" },
  { id: "series", label: "Series y pelis" },
  { id: "cultura", label: "Cultura" },
];

export const playable = (cat: string) => (BANK.byCat[cat]?.length ?? 0) >= 10;
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

export function makeSpin(deck: string[]): Spin {
  const index = Math.floor(Math.random() * deck.length);
  return { cat: deck[index], index, nonce: Math.floor(Math.random() * 1e9) };
}
