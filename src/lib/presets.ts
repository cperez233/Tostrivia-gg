/* editorial-ui · Cristian Pérez · cristianperez.me
 * Partidas guardadas en este navegador (la página no tiene servidor): nombre, categorías, modo y reglas.
 * Se leen de localStorage y se avisa a quien las pinte al cambiar, aunque haya dos exploradores montados.
 */
import { useSyncExternalStore } from "react";
import { isValidCat } from "../game/mix";
import { cleanRules, type Rules } from "../game/rules";
import { isVariant, type Variant } from "../game/powers";

export interface Preset {
  id: string;
  name: string;
  /** id de categoría, de "al azar" o de mezcla (src/game/mix.ts) */
  cat: string;
  variant: Variant;
  rules: Rules;
}

const KEY = "tostrivia:presets";
export const MAX_PRESETS = 12;
export const NAME_MAX = 24;

let cache: Preset[] | null = null;
const subs = new Set<() => void>();

function clean(x: unknown): Preset[] {
  if (!Array.isArray(x)) return [];
  const out: Preset[] = [];
  for (const p of x) {
    if (!p || typeof p !== "object") continue;
    const r = p as Record<string, unknown>;
    if (typeof r.id !== "string" || typeof r.name !== "string" || typeof r.cat !== "string" || !isValidCat(r.cat)) continue;
    out.push({ id: r.id.slice(0, 20), name: r.name.slice(0, NAME_MAX), cat: r.cat, variant: isVariant(r.variant) ? r.variant : "vanilla", rules: cleanRules(r.rules) });
  }
  return out.slice(0, MAX_PRESETS);
}

function load(): Preset[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = clean(raw ? JSON.parse(raw) : []);
  } catch {
    cache = [];
  }
  return cache;
}

function commit(list: Preset[]) {
  cache = list;
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* modo privado: dura hasta cerrar la pestaña */
  }
  subs.forEach((f) => f());
}

export const savedPresets = () => load();

export function addPreset(p: Omit<Preset, "id">): Preset | null {
  const list = load();
  const name = p.name.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, NAME_MAX);
  if (!name || list.length >= MAX_PRESETS) return null;
  const made: Preset = { ...p, name, id: Math.random().toString(36).slice(2, 10) };
  commit([...list, made]);
  return made;
}

export function removePreset(id: string) {
  commit(load().filter((p) => p.id !== id));
}

/** la lista de partidas guardadas; se vuelve a pintar al guardar o borrar */
export function usePresets(): Preset[] {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    load,
    load,
  );
}
