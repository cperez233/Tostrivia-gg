/* editorial-ui · Cristian Pérez · cristianperez.me
 * Portadas: el póster o la carátula oficial de cada categoría, en 2:3, guardado en src/assets/covers
 * (de dónde salió cada una está en src/assets/covers/FUENTES.md). Dos tamaños: 600×900 y 300×450.
 */
import type { Category } from "../data/types";

const FILES = import.meta.glob("../assets/covers/*.webp", { eager: true, query: "?url", import: "default" }) as Record<string, string>;

export interface Poster {
  id: string;
  /** 600×900 */
  lg: string;
  /** 300×450: ruleta, fichas chicas y mosaicos */
  sm: string;
}

export function posterOf(id: string): Poster | null {
  const lg = FILES[`../assets/covers/${id}.webp`];
  const sm = FILES[`../assets/covers/${id}-sm.webp`];
  return lg ? { id, lg, sm: sm ?? lg } : null;
}

/** las categorías de música no tienen póster propio: muestran un mosaico de cuatro de su lado */
export function coversOf(c: Category): Poster[] {
  return (c.mosaic ?? [c.id]).map(posterOf).filter((x): x is Poster => !!x);
}
