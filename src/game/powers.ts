/* editorial-ui · Cristian Pérez · cristianperez.me
 * Modo Poderes, al estilo de los juegos de fiesta: cada jugador arranca con un poder y gana más
 * con cada racha de 3 o tras fallar tres seguidas. En grupo, el que va atrás recibe los poderes más fuertes.
 * Se usa uno por pregunta, antes de responder (el Bloque ? no cuenta). Estándar es la partida de siempre.
 * Los textos están todos aquí (POWER_TEXT, VARIANT_TEXT, POWER_LINES) para poder traducirlos en un solo sitio.
 */
import { t } from "../i18n";
import { random, weightedIndex } from "../lib/rng";

export type Variant = "vanilla" | "powers" | "ultra";
export const VARIANTS: Variant[] = ["vanilla", "powers", "ultra"];
/** Locura y Ultra Locura juegan con poderes; Estándar no */
export const hasPowers = (v: Variant) => v !== "vanilla";

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
  | "banana"
  | "dark"
  | "mirror"
  | "quake"
  | "tiny"
  | "blur"
  | "spin"
  | "party"
  | "scramble"
  | "blink";

/** efectos que se ven en la pantalla de los demás mientras corre la pregunta */
export type FxId = "ink" | "scare" | "shuffle" | "flip" | "dark" | "mirror" | "quake" | "tiny" | "blur" | "spin" | "party" | "scramble" | "blink";
export const FX_POWERS: FxId[] = ["ink", "scare", "shuffle", "flip", "dark", "mirror", "quake", "tiny", "blur", "spin", "party", "scramble", "blink"];

/** solo: los que no dependen de otros; grupo: los que no cambian la pregunta de todos */
export const POOL: Record<"solo" | "group", PowerId[]> = {
  solo: ["half", "double", "shield", "swap", "dice", "mushroom", "star", "mystery"],
  group: ["half", "double", "shield", "steal", "ink", "dice", "mushroom", "star", "mystery", "redShell", "blueShell", "lightning", "scare", "shuffle", "flip", "swapScore", "banana", "dark", "mirror", "quake", "tiny", "blur", "spin", "party", "scramble", "blink"],
};
/** los que le tocan más seguido al que va en la mitad de abajo (como en Mario Kart) */
export const COMEBACK: PowerId[] = ["blueShell", "lightning", "star", "steal", "redShell", "swapScore"];
/** qué tan seguido sale cada uno: los más fuertes son raros */
export const WEIGHT: Record<PowerId, number> = {
  half: 4,
  double: 3,
  shield: 4,
  swap: 4,
  steal: 2,
  ink: 4,
  dice: 4,
  mushroom: 4,
  star: 2,
  mystery: 2,
  redShell: 3,
  blueShell: 1,
  lightning: 2,
  scare: 3,
  shuffle: 4,
  flip: 4,
  swapScore: 1,
  banana: 4,
  dark: 4,
  mirror: 4,
  quake: 4,
  tiny: 4,
  blur: 3,
  spin: 3,
  party: 3,
  scramble: 3,
  blink: 3,
};
/** los que se ven en la pantalla de los demás y cuánto duran (el Susto con screamer de YouTube dura SCARE_CLIP_MS) */
export const FX_MS: Record<FxId, number> = { ink: 7_000, scare: 1_400, shuffle: 10_000, flip: 10_000, dark: 11_000, mirror: 11_000, quake: 10_000, tiny: 11_000, blur: 10_000, spin: 9_000, party: 10_000, scramble: 11_000, blink: 10_000 };
/** la Tinta no deja responder: siempre quedan al menos estos ms libres al final de la pregunta */
export const INK_FREE_MS = 4_000;
export const SCARE_CLIP_MS = 4_500;
/**
 * Screamers de juegos de terror. Cada clave se busca en YouTube con scripts/find-videos.mjs (src/data/video-sources.json)
 * y solo se usan las que ya tienen un video verificado en videos.json; sin ninguna, sale el susto propio.
 */
export const SCARE_KEYS = [
  "scare-fnaf2-foxy",
  "scare-fnaf1-freddy",
  "scare-fnaf2-mangle",
  "scare-fnaf-goldenfreddy",
  "scare-fnaf3-springtrap",
  "scare-fnaf4-nightmare",
  "scare-poppy-huggy",
  "scare-granny",
  "scare-baldi",
  "scare-doors-seek",
  "scare-scarymaze",
  "scare-slender",
];

/**
 * Cómo se reparten y se usan en cada modo:
 *  - start: con cuántos se arranca · max: cuántos caben en la mano (como en Mario Kart, tres)
 *  - earn: cada cuántos aciertos seguidos se gana uno · cold: tras cuántos fallos seguidos llega uno de consuelo
 *  - uses: cuántos se pueden tirar en una misma pregunta (el Bloque ? no cuenta)
 * Ultra Locura: mano grande, se gana uno con cada acierto y se tiran dos por pregunta.
 */
export const POWER_RULES: Record<Exclude<Variant, "vanilla">, { start: number; max: number; earn: number; cold: number; uses: number }> = {
  powers: { start: 1, max: 3, earn: 3, cold: 3, uses: 1 },
  ultra: { start: 3, max: 6, earn: 1, cold: 2, uses: 2 },
};
export const powerRules = (v: Variant) => POWER_RULES[v === "ultra" ? "ultra" : "powers"];
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
/** Hongo: el bono por rapidez se multiplica por esto */
export const MUSHROOM_SPEED = 3;
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
  dark: "🔦",
  mirror: "🪞",
  quake: "🫨",
  tiny: "🐜",
  blur: "🌫️",
  spin: "😵‍💫",
  party: "🎉",
  scramble: "🔤",
  blink: "💡",
};

/** nombre y descripción en el idioma actual: se leen al pintar, así que cambian con el idioma */
function text(name: string, desc: string, vars?: Record<string, string | number>) {
  return {
    get name() {
      return t(name);
    },
    get desc() {
      return t(desc, vars);
    },
  };
}
const secs = (ms: number) => ms / 1000;

export const POWER_TEXT: Record<PowerId, { name: string; desc: string }> = {
  half: text("50/50", "Quita dos opciones malas."),
  double: text("Doble o nada", "×2 si aciertas, −{n} si fallas.", { n: DOUBLE_RISK }),
  shield: text("Escudo", "Si fallas no pierdes la racha y te cubre de ataques."),
  swap: text("Cambio", "Cambia la pregunta por otra."),
  steal: text("Boo", "Si aciertas, le robas {n} al que va primero.", { n: STEAL_PTS }),
  ink: text("Tinta", "Tapa las opciones de los demás {s} s.", { s: secs(INK_MS) }),
  dice: text("Dado", "Tira un dado: +{n} por punto si aciertas, −{m} si fallas.", { n: DICE_PTS, m: DICE_PTS / 2 }),
  mushroom: text("Hongo", "Responde rápido: el bono de rapidez se multiplica por {n}.", { n: MUSHROOM_SPEED }),
  star: text("Estrella", "×{n} si aciertas y ningún ataque te toca.", { n: STAR_MULT }),
  mystery: text("Bloque ?", "Te da dos poderes al azar. No gasta tu turno."),
  redShell: text("Caparazón rojo", "−{n} al que va justo delante de ti.", { n: RED_PTS }),
  blueShell: text("Caparazón azul", "−{n} al primero. Si el primero eres tú, te pega a ti.", { n: BLUE_PTS }),
  lightning: text("Rayo", "−{n} a todos los demás.", { n: BOLT_PTS }),
  scare: text("Susto", "Un susto en la pantalla de todos los demás, cuando menos lo esperan."),
  shuffle: text("Revoltijo", "Las opciones de los demás bailan {s} s.", { s: secs(FX_MS.shuffle) }),
  flip: text("De cabeza", "La pantalla de los demás se voltea {s} s.", { s: secs(FX_MS.flip) }),
  swapScore: text("Cambiazo", "Cambias tu puntaje con el que va justo delante de ti."),
  banana: text("Plátano", "El primero que responda después de ti resbala: −{n}.", { n: BANANA_PTS }),
  dark: text("Apagón", "Se va la luz donde los demás: solo ven con una linterna {s} s.", { s: secs(FX_MS.dark) }),
  mirror: text("Espejo", "La pantalla de los demás se ve al revés, como en un espejo, {s} s.", { s: secs(FX_MS.mirror) }),
  quake: text("Terremoto", "La pantalla de los demás tiembla {s} s.", { s: secs(FX_MS.quake) }),
  tiny: text("Hormiga", "Las opciones de los demás se encogen {s} s.", { s: secs(FX_MS.tiny) }),
  blur: text("Niebla", "Los demás ven todo borroso {s} s.", { s: secs(FX_MS.blur) }),
  spin: text("Mareo", "La pantalla de los demás da vueltas {s} s.", { s: secs(FX_MS.spin) }),
  party: text("Fiesta", "Confeti, globos y cornetas en la pantalla de los demás {s} s.", { s: secs(FX_MS.party) }),
  scramble: text("Trabalenguas", "Las letras de las opciones de los demás se revuelven {s} s.", { s: secs(FX_MS.scramble) }),
  blink: text("Corto circuito", "La pantalla de los demás parpadea {s} s.", { s: secs(FX_MS.blink) }),
};

export const VARIANT_TEXT: Record<Variant, { name: string; desc: string }> = {
  vanilla: text("Estándar", "Solo preguntas, reloj y racha."),
  powers: text("Locura", "Caparazones, dados, hongos y más. Ganas poderes con rachas de 3."),
  ultra: text("Ultra Locura", "Arrancas con 3 poderes, guardas hasta 6, ganas uno con cada acierto y tiras 2 por pregunta."),
};

const FX_TEXT: Record<FxId, string> = {
  ink: "{who} te echó tinta",
  shuffle: "{who} te revolvió las opciones",
  flip: "{who} te volteó la pantalla",
  dark: "{who} te apagó la luz. Mueve el dedo para alumbrar",
  mirror: "{who} te puso el espejo",
  quake: "{who} hizo temblar tu pantalla",
  tiny: "{who} te encogió las opciones",
  blur: "{who} te echó niebla",
  spin: "{who} te mareó",
  party: "{who} armó una fiesta en tu pantalla",
  scramble: "{who} te revolvió las letras",
  blink: "{who} te hizo un corto circuito",
  scare: "¡BU!",
};

/** frases del modo poderes que salen en la partida (se arman al pintar, en el idioma actual) */
export const POWER_LINES = {
  get label() {
    return t("Poderes");
  },
  empty: (v: Variant) => (v === "ultra" ? t("Sin poderes. Acierta una para ganar otro.") : t("Sin poderes. Acierta 3 seguidas para ganar uno.")),
  /** Ultra Locura: todavía puede tirar otro en esta pregunta */
  more: (n: number) => (n === 1 ? t("Puedes tirar uno más.") : t("Puedes tirar {n} más.", { n })),
  used: (name: string) => t("Usaste {name}.", { name }),
  inked: (who: string) => t("{who} te echó tinta", { who }),
  earned: (name: string) => t("Ganaste {name}.", { name }),
  consolation: (name: string) => t("De consuelo: {name}.", { name }),
  get doubled() {
    return t("Doble o nada: ¡doble!");
  },
  get doubleLost() {
    return t("Doble o nada: −{n}.", { n: DOUBLE_RISK });
  },
  get shielded() {
    return t("El escudo salvó tu racha.");
  },
  dice: (roll: number, pts: number) => t("Sacaste {roll} en el dado: {pts}.", { roll, pts: `${pts >= 0 ? "+" : "−"}${Math.abs(pts)}` }),
  mushroom: (pts: number) => t("Hongo: +{n} por rapidez.", { n: pts }),
  get star() {
    return t("Estrella: ×{n}.", { n: STAR_MULT });
  },
  hit: (p: PowerId, who: string, pts: number) => `${POWER_ICON[p]} ${t("{power} de {who}: −{n}.", { power: POWER_TEXT[p].name, who, n: pts })}`,
  selfHit: (p: PowerId, pts: number) => `${POWER_ICON[p]} ${t("Tu propio {power} te pegó: −{n}.", { power: POWER_TEXT[p].name, n: pts })}`,
  dealt: (p: PowerId, who: string, pts: number) =>
    `${POWER_ICON[p]} ${p === "steal" ? t("Le robaste {n} a {who}.", { n: pts, who }) : t("{power} a {who}: −{n}.", { power: POWER_TEXT[p].name, who, n: pts })}`,
  blocked: (p: PowerId, who: string, by: PowerId) => `${POWER_ICON[by]} ${t("Frenaste {power} de {who}.", { power: POWER_TEXT[p].name, who })}`,
  get noTarget() {
    return t("Ya respondieron todos: no le llegaría a nadie.");
  },
  missed: (p: PowerId) => `${POWER_ICON[p]} ${t("{power} no le hizo nada a nadie.", { power: POWER_TEXT[p].name })}`,
  swappedUp: (who: string, pts: number) => `${POWER_ICON.swapScore} ${t("Cambiazo con {who}: +{n}.", { who, n: pts })}`,
  swappedDown: (who: string, pts: number) => `${POWER_ICON.swapScore} ${t("{who} te hizo cambiazo: −{n}.", { who, n: pts })}`,
  fx: (p: FxId, who: string) => t(FX_TEXT[p], { who }),
  scare: (who: string) => t("Cortesía de {who}", { who }),
  /** se manda tal cual por la red y cada uno lo traduce al pintarlo */
  swapped: "Pregunta cambiada.",
};

export const isPower = (x: unknown): x is PowerId => typeof x === "string" && x in POWER_TEXT;
export const isVariant = (x: unknown): x is Variant => x === "vanilla" || x === "powers" || x === "ultra";

/**
 * Un poder al azar; en grupo, al que va atrás le salen más seguido los fuertes.
 * Los que ya tiene en la mano pesan menos, para que no le salgan tres iguales.
 */
export function drawPower(mode: "solo" | "group", behind = false, rand: () => number = random, hand: readonly PowerId[] = []): PowerId {
  const pool = mode === "group" && behind && rand() < 0.5 ? COMEBACK : POOL[mode];
  return weighted(pool, rand, hand);
}

function weighted(pool: PowerId[], rand: () => number, hand: readonly PowerId[] = []): PowerId {
  return pool[weightedIndex(pool.map((p) => WEIGHT[p] * (hand.includes(p) ? 0.25 : 1)), rand)];
}

/** mano inicial: distintos */
export function startHand(mode: "solo" | "group", size = 1, rand: () => number = random): PowerId[] {
  const pool = POOL[mode].slice();
  const out: PowerId[] = [];
  while (out.length < size && pool.length) out.push(pool.splice(pool.indexOf(weighted(pool, rand)), 1)[0]);
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
