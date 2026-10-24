/* editorial-ui · Cristian Pérez · cristianperez.me
 * La pestaña de Categorías que se estaba viendo: se recuerda para que "Volver a categorías" deje donde estabas.
 */
import { CATEGORY_BY_ID, GROUPS, groupOf } from "../data/categories";
import type { GroupId } from "../data/types";

const KEY = "tostrivia:cats-tab";
let mem: GroupId = "anime";

const isGroup = (x: unknown): x is GroupId => GROUPS.some((g) => g.id === x);

export function savedTab(): GroupId {
  try {
    const v = localStorage.getItem(KEY);
    if (isGroup(v)) return v;
  } catch {
    /* sin almacenamiento: se usa la memoria de esta pestaña */
  }
  return mem;
}

export function saveTab(g: GroupId) {
  mem = g;
  try {
    localStorage.setItem(KEY, g);
  } catch {
    /* no se recuerda entre visitas */
  }
}

/** al volver de una partida: la pestaña de la categoría jugada (o del "al azar"); en una mezcla, la que ya estaba */
export function rememberTabOf(cat: string | null | undefined) {
  if (!cat) return;
  if (CATEGORY_BY_ID[cat]) return saveTab(groupOf(cat));
  const azar = cat.match(/^azar-(.+)$/);
  if (azar && isGroup(azar[1])) saveTab(azar[1]);
}
