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
  { id: "oido", label: "Al oído" },
  { id: "cultura", label: "Cultura" },
];

export const playable = (cat: string) => (BANK.byCat[cat]?.length ?? 0) >= 10;
const poolOf = (g: GroupId) => CATEGORIES.filter((c) => FAMILY_BY_ID[c.family].group === g && playable(c.id)).map((c) => c.id);

export function makeDeck(filter: Filter, seed: number): string[] {
  const rand = rng(seed);
  if (filter === "oido") return Array.from({ length: 8 }, (_, i) => poolOf("oido")[i % 2]).filter(Boolean);
  if (filter === "cultura") return shuffle(poolOf("cultura"), rand);
  if (filter === "anime" || filter === "juegos") return shuffle(poolOf(filter), rand).slice(0, 8);
  // todo: tres de anime, tres de juegos, uno de cultura y uno "al oído", intercalados
  const a = shuffle(poolOf("anime"), rand).slice(0, 3);
  const j = shuffle(poolOf("juegos"), rand).slice(0, 3);
  const c = shuffle(poolOf("cultura"), rand)[0];
  const o = shuffle(poolOf("oido"), rand)[0];
  return [a[0], j[0], c, a[1], j[1], o, a[2], j[2]];
}

export function makeSpin(deck: string[]): Spin {
  const index = Math.floor(Math.random() * deck.length);
  return { cat: deck[index], index, nonce: Math.floor(Math.random() * 1e9) };
}
