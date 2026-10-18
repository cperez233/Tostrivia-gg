/* editorial-ui · Cristian Pérez · cristianperez.me
 * Portadas: miniaturas de videos oficiales de YouTube, servidas por i.ytimg.com (no se guardan en el repo).
 */
import { videoFor } from "../data/bank";
import type { Category } from "../data/types";

/** videos 4:3 (o sin miniatura grande): su hqdefault no trae franjas negras */
const FOUR_THREE = new Set(["cine-ost-starwars", "musica-queen-bohemian", "re-ost-saferoom", "sonic-ost-greenhill", "cover-historia"]);

export interface CoverImg {
  key: string;
  /** 480×360; en videos 16:9 trae franjas arriba y abajo que hay que recortar */
  hq: string;
  /** 640×480 (con franjas en 16:9): fichas de tamaño medio en celulares de 3x */
  sd: string;
  /** 1280×720 cuando existe */
  big: string;
  wide: boolean;
}

export function coverImg(key: string): CoverImg | null {
  const v = videoFor(key);
  if (!v) return null;
  const wide = !FOUR_THREE.has(key);
  return {
    key,
    hq: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
    sd: wide ? `https://i.ytimg.com/vi/${v.id}/sddefault.jpg` : `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
    big: wide ? `https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg` : `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
    wide,
  };
}

export function coversOf(c: Category): CoverImg[] {
  const keys = Array.isArray(c.cover) ? c.cover : [c.cover];
  return keys.map(coverImg).filter((x): x is CoverImg => !!x);
}
