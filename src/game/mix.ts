/* editorial-ui · Cristian Pérez · cristianperez.me
 * Partidas con varias categorías. El id viaja como texto en la foto del estado, así que los invitados
 * lo resuelven igual que el anfitrión:
 *   "azar-anime", "azar-juegos", "azar-series", "azar-cultura", "azar-todo": todo un lado (o todo el banco)
 *   "mix-jojo.breakingbad.deportes": las que eligió la persona, en orden alfabético
 */
import { BANK } from "../data/bank";
import { CATEGORIES, CATEGORY_BY_ID, FAMILY_BY_ID, GROUPS } from "../data/categories";
import type { Category, GroupId } from "../data/types";

export type RandomScope = GroupId | "todo";

export const playable = (cat: string) => (BANK.byCat[cat]?.length ?? 0) >= 10;

const RANDOM_NAME: Record<RandomScope, string> = {
  anime: "Anime al azar",
  juegos: "Videojuegos al azar",
  series: "Series y películas al azar",
  cultura: "Cultura general al azar",
  todo: "Todo al azar",
};
/** portadas del mosaico de cada "al azar" */
const RANDOM_MOSAIC: Record<RandomScope, string[]> = {
  anime: ["onepiece", "jojo", "frieren", "dragonball"],
  juegos: ["zelda", "gta", "hollowknight", "minecraft"],
  series: ["breakingbad", "starwars", "chavo", "shrek"],
  cultura: ["historia", "geografia", "ciencia", "deportes"],
  todo: ["jojo", "zelda", "breakingbad", "historia"],
};

export const randomId = (scope: RandomScope) => `azar-${scope}`;

export function mixId(cats: string[]) {
  const list = [...new Set(cats)].filter((c) => CATEGORY_BY_ID[c] && playable(c)).sort();
  return list.length === 1 ? list[0] : `mix-${list.join(".")}`;
}

/** categorías reales que entran en la partida (una sola si no es mezcla) */
export function partsOf(cat: string): string[] {
  const azar = cat.match(/^azar-(anime|juegos|series|cultura|todo)$/);
  if (azar) {
    const g = azar[1] as RandomScope;
    return CATEGORIES.filter((c) => (g === "todo" || FAMILY_BY_ID[c.family].group === g) && playable(c.id)).map((c) => c.id);
  }
  if (cat.startsWith("mix-")) return cat.slice(4).split(".").filter((c) => CATEGORY_BY_ID[c] && playable(c));
  return CATEGORY_BY_ID[cat] ? [cat] : [];
}

export const isMix = (cat: string) => cat.startsWith("azar-") || cat.startsWith("mix-");
export const isValidCat = (cat: string) => (isMix(cat) ? partsOf(cat).length >= 1 : playable(cat));

export interface CatInfo {
  /** lo que pinta la portada: para una mezcla, un mosaico de sus categorías */
  cover: Category;
  name: string;
  short: string;
  /** la etiqueta de arriba: la familia, o "Al azar" / "Mezcla" */
  label: string;
}

export function describe(cat: string): CatInfo | null {
  const real = CATEGORY_BY_ID[cat];
  if (real) return { cover: real, name: real.name, short: real.short, label: FAMILY_BY_ID[real.family].name };
  const parts = partsOf(cat);
  if (!parts.length) return null;
  const first = CATEGORY_BY_ID[parts[0]];
  const azar = cat.match(/^azar-(.+)$/);
  if (azar) {
    const g = azar[1] as RandomScope;
    const name = RANDOM_NAME[g];
    const group = GROUPS.find((x) => x.id === g)?.name ?? "Todas las categorías";
    return { cover: { ...first, id: cat, name, mosaic: RANDOM_MOSAIC[g] }, name, short: "Al azar", label: `Al azar · ${group}` };
  }
  const shorts = parts.map((p) => CATEGORY_BY_ID[p].short);
  const name = parts.length <= 3 ? shorts.join(" + ") : `Mezcla de ${parts.length} temas`;
  // mosaico con las portadas de lo elegido (las de música no tienen póster propio: se saltan)
  const mosaic = parts.filter((p) => !CATEGORY_BY_ID[p].mosaic).slice(0, 4);
  return {
    cover: { ...first, id: cat, name, mosaic: mosaic.length > 1 ? mosaic : undefined },
    name,
    short: "Mezcla",
    label: parts.length <= 3 ? "Mezcla" : `Mezcla · ${shorts.slice(0, 3).join(", ")}…`,
  };
}
