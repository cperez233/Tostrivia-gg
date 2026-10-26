/* editorial-ui · Cristian Pérez · cristianperez.me */

/** PRNG determinista (mulberry32): el anfitrión y los invitados barajan igual con la misma semilla. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: readonly T[], rand: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Azar de verdad para lo que no tiene que repetirse en otros dispositivos (semillas, ruleta, dados):
 * usa el generador criptográfico del navegador, que no se queda en ciclos como Math.random en algunos
 * navegadores viejos. Devuelve un número en [0, 1) con 32 bits de azar.
 */
export function random(): number {
  try {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / 4294967296;
  } catch {
    return Math.random();
  }
}

/** entero en [0, n) sin sesgo */
export const randomInt = (n: number) => Math.floor(random() * n);

/** semilla para una partida o un mazo (positiva, como antes) */
export const newSeed = () => randomInt(2 ** 31);

/**
 * Elige un índice con pesos. Sirve para que la ruleta y los poderes no repitan tanto:
 * lo que salió hace poco pesa menos, pero nunca cero si es lo único que queda.
 */
export function weightedIndex(weights: readonly number[], rand: () => number = random): number {
  const total = weights.reduce((n, w) => n + Math.max(0, w), 0);
  if (total <= 0) return Math.floor(rand() * weights.length);
  let r = rand() * total;
  for (let i = 0; i < weights.length; i++) if ((r -= Math.max(0, weights[i])) < 0) return i;
  return weights.length - 1;
}

/**
 * Baraja con pesos (sin repetir): cada elemento tiene más probabilidad de quedar al principio mientras más pesa,
 * pero ninguno queda fuera por completo. Es el método de Efraimidis y Spirakis: se ordena por u^(1/peso).
 */
export function weightedShuffle<T>(items: readonly T[], weightOf: (x: T) => number, rand: () => number): T[] {
  return items
    .map((x) => ({ x, k: Math.pow(Math.max(rand(), 1e-12), 1 / Math.max(weightOf(x), 1e-6)) }))
    .sort((a, b) => b.k - a.k)
    .map((e) => e.x);
}
