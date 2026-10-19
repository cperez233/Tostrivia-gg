/* editorial-ui · Cristian Pérez · cristianperez.me
 * Modo Poderes, al estilo de los juegos de fiesta: cada jugador arranca con un poder y gana más
 * con cada racha de 3 o tras fallar tres seguidas. En grupo, el que va atrás recibe los poderes más fuertes.
 * Se usa uno por pregunta, antes de responder (el Bloque ? no cuenta). Vanilla es la partida de siempre.
 * Los textos están todos aquí (POWER_TEXT, VARIANT_TEXT, POWER_LINES) para poder traducirlos en un solo sitio.
 */

export type Variant = "vanilla" | "powers";
export const VARIANTS: Variant[] = ["vanilla", "powers"];

export type PowerId =
  | "half"
  | "double"
  | "shield"
  | "swap"
  | "steal"
  | "ink"
  | "dice"
  | "mushroom"
  | "star"
  | "mystery"
  | "redShell"
  | "blueShell"
  | "lightning"
  | "scare"
  | "shuffle"
  | "flip"
  | "swapScore"
  | "banana";

/** efectos que se ven en la pantalla de los demás mientras corre la pregunta */
export type FxId = "ink" | "scare" | "shuffle" | "flip";

/** solo: los que no dependen de otros; grupo: los que no cambian la pregunta de todos */
export const POOL: Record<"solo" | "group", PowerId[]> = {
  solo: ["half", "double", "shield", "swap", "dice", "mushroom", "star", "mystery"],
  group: ["half", "double", "shield", "steal", "ink", "dice", "mushroom", "star", "mystery", "redShell", "blueShell", "lightning", "scare", "shuffle", "flip", "swapScore", "banana"],
};
/** los que le tocan más seguido al que va en la mitad de abajo (como en Mario Kart) */
export const COMEBACK: PowerId[] = ["blueShell", "lightning", "star", "steal", "redShell", "swapScore"];
/** los que se ven en la pantalla de los demás y cuánto duran */
export const FX_MS: Record<FxId, number> = { ink: 5_000, scare: 1_400, shuffle: 6_000, flip: 6_000 };

export const START_HAND = 1;
/** como en Mario Kart: tres en la mano */
export const MAX_HAND = 3;
/** cada cuántos aciertos seguidos se gana un poder */
export const EARN_EVERY = 3;
/** tras cuántos fallos seguidos llega un poder de consuelo */
export const COLD_EVERY = 3;
/** Doble o nada: si fallas con él puesto, pierdes esto */
export const DOUBLE_RISK = 300;
/** Robo: lo que se le quita al líder si aciertas */
export const STEAL_PTS = 400;
/** Tinta: cuánto tiempo quedan tapadas las opciones de los demás */
export const INK_MS = FX_MS.ink;
export const BANANA_PTS = 300;
export const RED_PTS = 400;
export const BLUE_PTS = 600;
export const BOLT_PTS = 200;
/** Dado: cada punto del dado vale esto si aciertas (y la mitad en contra si fallas) */
export const DICE_PTS = 100;
/** Hongo: el bono por rapidez llega hasta esto (normal: 100) */
export const MUSHROOM_MAX = 500;
/** Estrella: multiplica lo que ganes */
export const STAR_MULT = 2;

export const POWER_ICON: Record<PowerId, string> = {
  half: "✂️",
  double: "🎰",
  shield: "🛡️",
  swap: "🔄",
  steal: "👻",
  ink: "🦑",
  dice: "🎲",
  mushroom: "🍄",
  star: "⭐",
  mystery: "❓",
  redShell: "🔴",
  blueShell: "🔵",
  lightning: "⚡",
  scare: "😱",
  shuffle: "🌀",
  flip: "🙃",
  swapScore: "🔁",
  banana: "🍌",
};

export const POWER_TEXT: Record<PowerId, { name: string; desc: string }> = {
  half: { name: "50/50", desc: "Quita dos opciones malas." },
  double: { name: "Doble o nada", desc: `×2 si aciertas, −${DOUBLE_RISK} si fallas.` },
  shield: { name: "Escudo", desc: "Si fallas no pierdes la racha y te cubre de ataques." },
  swap: { name: "Cambio", desc: "Cambia la pregunta por otra." },
  steal: { name: "Boo", desc: `Si aciertas, le robas ${STEAL_PTS} al que va primero.` },
  ink: { name: "Tinta", desc: `Tapa las opciones de los demás ${INK_MS / 1000} s.` },
  dice: { name: "Dado", desc: `Tira un dado: +${DICE_PTS} por punto si aciertas, −${DICE_PTS / 2} si fallas.` },
  mushroom: { name: "Hongo", desc: `Responde rápido: el bono de rapidez sube hasta +${MUSHROOM_MAX}.` },
  star: { name: "Estrella", desc: `×${String(STAR_MULT).replace(".", ",")} si aciertas y ningún ataque te toca.` },
  mystery: { name: "Bloque ?", desc: "Te da dos poderes al azar. No gasta tu turno." },
  redShell: { name: "Caparazón rojo", desc: `−${RED_PTS} al que va justo delante de ti.` },
  blueShell: { name: "Caparazón azul", desc: `−${BLUE_PTS} al primero. Si el primero eres tú, te pega a ti.` },
  lightning: { name: "Rayo", desc: `−${BOLT_PTS} a todos los demás.` },
  scare: { name: "Susto", desc: "Un susto en la pantalla de todos los demás, cuando menos lo esperan." },
  shuffle: { name: "Revoltijo", desc: `Las opciones de los demás bailan ${FX_MS.shuffle / 1000} s.` },
  flip: { name: "De cabeza", desc: `La pantalla de los demás se voltea ${FX_MS.flip / 1000} s.` },
  swapScore: { name: "Cambiazo", desc: "Cambias tu puntaje con el que va justo delante de ti." },
  banana: { name: "Plátano", desc: `El primero que responda después de ti resbala: −${BANANA_PTS}.` },
};

export const VARIANT_TEXT: Record<Variant, { name: string; desc: string }> = {
  vanilla: { name: "Vanilla", desc: "Solo preguntas, reloj y racha." },
  powers: { name: "Poderes", desc: "Caparazones, dados, hongos y más. Ganas poderes con rachas de 3." },
};

/** frases del modo poderes que salen en la partida */
export const POWER_LINES = {
  label: "Poderes",
  empty: "Sin poderes. Acierta 3 seguidas para ganar uno.",
  used: (name: string) => `Usaste ${name}.`,
  inked: (who: string) => `${who} te echó tinta`,
  earned: (name: string) => `Ganaste ${name}.`,
  consolation: (name: string) => `De consuelo: ${name}.`,
  doubled: "Doble o nada: ¡doble!",
  doubleLost: `Doble o nada: −${DOUBLE_RISK}.`,
  shielded: "El escudo salvó tu racha.",
  dice: (roll: number, pts: number) => `Sacaste ${roll} en el dado: ${pts >= 0 ? "+" : "−"}${Math.abs(pts)}.`,
  mushroom: (pts: number) => `Hongo: +${pts} por rapidez.`,
  star: `Estrella: ×${String(STAR_MULT).replace(".", ",")}.`,
  hit: (p: PowerId, who: string, pts: number) => `${POWER_ICON[p]} ${POWER_TEXT[p].name} de ${who}: −${pts}.`,
  selfHit: (p: PowerId, pts: number) => `${POWER_ICON[p]} Tu propio ${POWER_TEXT[p].name} te pegó: −${pts}.`,
  dealt: (p: PowerId, who: string, pts: number) => (p === "steal" ? `${POWER_ICON[p]} Le robaste ${pts} a ${who}.` : `${POWER_ICON[p]} ${POWER_TEXT[p].name} a ${who}: −${pts}.`),
  blocked: (p: PowerId, who: string, by: PowerId) => `${POWER_ICON[by]} Frenaste ${POWER_TEXT[p].name} de ${who}.`,
  missed: (p: PowerId) => `${POWER_ICON[p]} ${POWER_TEXT[p].name} no le hizo nada a nadie.`,
  swappedUp: (who: string, pts: number) => `${POWER_ICON.swapScore} Cambiazo con ${who}: +${pts}.`,
  swappedDown: (who: string, pts: number) => `${POWER_ICON.swapScore} ${who} te hizo cambiazo: −${pts}.`,
  fx: (p: FxId, who: string) =>
    p === "ink" ? `${who} te echó tinta` : p === "shuffle" ? `${who} te revolvió las opciones` : p === "flip" ? `${who} te volteó la pantalla` : "¡BU!",
  scare: (who: string) => `Cortesía de ${who}`,
  swapped: "Pregunta cambiada.",
};

export const isPower = (x: unknown): x is PowerId => typeof x === "string" && x in POWER_TEXT;
export const isVariant = (x: unknown): x is Variant => x === "vanilla" || x === "powers";

/** un poder al azar; en grupo, al que va atrás le salen más seguido los fuertes */
export function drawPower(mode: "solo" | "group", behind = false, rand: () => number = Math.random): PowerId {
  const pool = mode === "group" && behind && rand() < 0.5 ? COMEBACK : POOL[mode];
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
