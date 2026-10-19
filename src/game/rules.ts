/* editorial-ui · Cristian Pérez · cristianperez.me
 * Reglas de la partida que se pueden personalizar: cuántas preguntas, cuánto tiempo, multiplicador de
 * puntos, dificultad y si la racha multiplica. El modo (Vanilla o Poderes) va aparte, en powers.ts.
 * Las elige quien juega solo o el anfitrión; viajan en la foto del estado, así que los invitados las ven igual.
 */

export type Difficulty = "mix" | 1 | 2 | 3;

export interface Rules {
  /** preguntas por partida */
  count: number;
  /** segundos por pregunta de texto; las de video tienen MEDIA_EXTRA más */
  time: number;
  /** multiplica todo lo que se gana */
  mult: number;
  /** mixta (de menos a más) o solo de una dificultad */
  diff: Difficulty;
  /** la racha multiplica los puntos (×1,25 … ×3) */
  streak: boolean;
}

export const COUNTS = [5, 10, 15, 20, 30] as const;
export const TIMES = [10, 15, 20, 30, 45] as const;
export const MULTS = [1, 1.5, 2, 3, 5] as const;
export const DIFFS: Difficulty[] = ["mix", 1, 2, 3];
/** las de video dan unos segundos más: el reloj arranca cuando empieza a sonar */
export const MEDIA_EXTRA = 5;

export const DEFAULT_RULES: Rules = { count: 10, time: 20, mult: 1, diff: "mix", streak: true };

export const isDefault = (r: Rules) => (Object.keys(DEFAULT_RULES) as (keyof Rules)[]).every((k) => r[k] === DEFAULT_RULES[k]);

const oneOf = <T>(list: readonly T[], v: unknown, fallback: T): T => (list.includes(v as T) ? (v as T) : fallback);

/** reglas válidas a partir de cualquier cosa (lo guardado en el navegador o lo que llega por la red) */
export function cleanRules(x: unknown): Rules {
  const r = (x && typeof x === "object" ? x : {}) as Partial<Record<keyof Rules, unknown>>;
  return {
    count: oneOf(COUNTS, r.count, DEFAULT_RULES.count),
    time: oneOf(TIMES, r.time, DEFAULT_RULES.time),
    mult: oneOf(MULTS, r.mult, DEFAULT_RULES.mult),
    diff: oneOf(DIFFS, r.diff, DEFAULT_RULES.diff),
    streak: typeof r.streak === "boolean" ? r.streak : DEFAULT_RULES.streak,
  };
}

const KEY = "tostrivia:rules";
/** las últimas reglas que eligió (solo o como anfitrión) */
export function savedRules(): Rules {
  try {
    const raw = localStorage.getItem(KEY);
    return cleanRules(raw ? JSON.parse(raw) : null);
  } catch {
    return { ...DEFAULT_RULES };
  }
}
export function saveRules(r: Rules) {
  try {
    localStorage.setItem(KEY, JSON.stringify(r));
  } catch {
    /* modo privado: no se recuerda */
  }
}
