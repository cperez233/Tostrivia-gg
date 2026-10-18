/* editorial-ui · Cristian Pérez · cristianperez.me */
import type { Me } from "../net/client";

const get = (store: Storage | undefined, k: string) => {
  try {
    return store?.getItem(k) ?? null;
  } catch {
    return null;
  }
};
const set = (store: Storage | undefined, k: string, v: string) => {
  try {
    store?.setItem(k, v);
  } catch {
    /* modo privado: no pasa nada, solo no se recuerda */
  }
};
const ls = typeof window !== "undefined" ? window.localStorage : undefined;
const ss = typeof window !== "undefined" ? window.sessionStorage : undefined;

/** id estable por pestaña: si se recarga, el anfitrión reconoce al mismo jugador */
export function myId() {
  let id = get(ss, "tostrivia:pid");
  if (!id) {
    id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
    set(ss, "tostrivia:pid", id);
  }
  return id;
}

export function savedProfile(): { name: string; seal: number } {
  const name = get(ls, "tostrivia:name") || "";
  const seal = Number(get(ls, "tostrivia:seal") ?? Math.floor(Math.random() * 10));
  return { name, seal: Number.isFinite(seal) ? Math.min(9, Math.max(0, seal)) : 0 };
}

export function saveProfile(name: string, seal: number) {
  set(ls, "tostrivia:name", name);
  set(ls, "tostrivia:seal", String(seal));
}

export function me(name?: string, seal?: number): Me {
  const p = savedProfile();
  return { id: myId(), name: (name ?? p.name).trim() || "Jugador", seal: seal ?? p.seal };
}
