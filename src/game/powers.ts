/* editorial-ui · Cristian Pérez · cristianperez.me
 * Modo Poderes: cada jugador arranca con dos poderes y gana uno más con cada racha de 3.
 * Se usa uno por pregunta, antes de responder. Vanilla es la partida de siempre, sin poderes.
 * Los textos están todos aquí (POWER_TEXT, VARIANT_TEXT) para poder traducirlos en un solo sitio.
 */

export type Variant = "vanilla" | "powers";
export const VARIANTS: Variant[] = ["vanilla", "powers"];

export type PowerId = "half" | "double" | "shield" | "swap" | "steal" | "ink";

/** solo: los que no dependen de otros; grupo: los que no cambian la pregunta de todos */
export const POOL: Record<"solo" | "group", PowerId[]> = {
  solo: ["half", "double", "shield", "swap"],
  group: ["half", "double", "shield", "steal", "ink"],
};

export const START_HAND = 2;
export const MAX_HAND = 3;
/** cada cuántos aciertos seguidos se gana un poder */
export const EARN_EVERY = 3;
/** Doble o nada: si fallas con él puesto, pierdes esto */
export const DOUBLE_RISK = 100;
/** Robo: lo que se le quita al líder si aciertas */
export const STEAL_PTS = 150;
/** Tinta: cuánto tiempo quedan tapadas las opciones de los demás */
export const INK_MS = 5_000;

export const POWER_ICON: Record<PowerId, string> = {
  half: "✂️",
  double: "🎲",
  shield: "🛡️",
  swap: "🔄",
  steal: "🦝",
  ink: "🖋️",
};

export const POWER_TEXT: Record<PowerId, { name: string; desc: string }> = {
  half: { name: "50/50", desc: "Quita dos opciones malas." },
  double: { name: "Doble o nada", desc: `×2 si aciertas, −${DOUBLE_RISK} si fallas.` },
  shield: { name: "Escudo", desc: "Si fallas no pierdes la racha. Te cubre de Robo y Tinta." },
  swap: { name: "Cambio", desc: "Cambia la pregunta por otra." },
  steal: { name: "Robo", desc: `Si aciertas, le quitas ${STEAL_PTS} al que va primero.` },
  ink: { name: "Tinta", desc: `Tapa las opciones de los demás ${INK_MS / 1000} s.` },
};

export const VARIANT_TEXT: Record<Variant, { name: string; desc: string }> = {
  vanilla: { name: "Vanilla", desc: "Solo preguntas, reloj y racha." },
  powers: { name: "Poderes", desc: "Empiezas con 2 poderes y ganas uno por cada racha de 3." },
};

/** frases del modo poderes que salen en la partida */
export const POWER_LINES = {
  label: "Poderes",
  empty: "Sin poderes. Acierta 3 seguidas para ganar uno.",
  used: (name: string) => `Usaste ${name}.`,
  inked: (who: string) => `${who} te echó tinta`,
  earned: (name: string) => `Ganaste ${name}.`,
  doubled: "Doble o nada",
  doubleLost: `Doble o nada: −${DOUBLE_RISK}.`,
  shielded: "El escudo salvó tu racha.",
  stole: (pts: number, who: string) => `Le robaste ${pts} a ${who}.`,
  robbed: (pts: number, who: string) => `${who} te robó ${pts}.`,
  blocked: (who: string) => `Tu escudo frenó el robo de ${who}.`,
  swapped: "Pregunta cambiada.",
};

export const isPower = (x: unknown): x is PowerId => typeof x === "string" && x in POWER_TEXT;
export const isVariant = (x: unknown): x is Variant => x === "vanilla" || x === "powers";

export function drawPower(mode: "solo" | "group", rand: () => number = Math.random): PowerId {
  const pool = POOL[mode];
  return pool[Math.floor(rand() * pool.length)];
}

/** mano inicial: dos distintos */
export function startHand(mode: "solo" | "group", rand: () => number = Math.random): PowerId[] {
  const pool = POOL[mode].slice();
  const out: PowerId[] = [];
  while (out.length < START_HAND && pool.length) out.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]);
  return out;
}

const KEY = "tostrivia:variant";
/** el último modo que eligió para jugar solo */
export function savedVariant(): Variant {
  try {
    const v = localStorage.getItem(KEY);
    return isVariant(v) ? v : "vanilla";
  } catch {
    return "vanilla";
  }
}
export function saveVariant(v: Variant) {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* modo privado: no se recuerda */
  }
}
