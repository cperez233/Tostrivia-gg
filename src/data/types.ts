/* editorial-ui · Cristian Pérez · cristianperez.me */

export type Difficulty = 1 | 2 | 3;

/** audio: el video queda tapado y solo suena; blur: se ve difuminado; clip: se ve, con la franja del título tapada */
export type MediaMode = "audio" | "blur" | "clip";

export interface Media {
  /** clave en src/data/video-sources.json (y en videos.json una vez resuelta) */
  k: string;
  m: MediaMode;
  /** segundo de inicio */
  s: number;
  /** segundo final */
  e: number;
}

/**
 * Preguntas que no son solo texto (todas llevan sus 4 opciones de siempre):
 *  - emoji:  la primera línea de la pregunta son emojis que se van soltando uno a uno ("🦁👑\n¿Qué película es?")
 *  - quote:  la primera línea es una frase que sale en un globo de cómic ("“Yo seré el Rey…”\n¿Quién lo dijo?")
 *  - poster: el póster de una categoría que se va aclarando mientras corre el reloj (pixel, zoom o desenfoque)
 */
export type PosterFx = "pixel" | "zoom" | "blur" | "zblur";
export type Visual = { v: "emoji" } | { v: "quote" } | { v: "poster"; id: string; fx: PosterFx };

/**
 * Formato compacto de autor: [dificultad, pregunta, correcta, mala1, mala2, mala3, media o visual?]
 * La correcta siempre va primero; el orden se baraja en la partida.
 */
export type RawQuestion =
  | [Difficulty, string, string, string, string, string]
  | [Difficulty, string, string, string, string, string, Media | Visual];

export interface Question {
  id: string;
  cat: string;
  d: Difficulty;
  q: string;
  /** opciones; la 0 es la correcta */
  o: [string, string, string, string];
  media?: Media;
  visual?: Visual;
  /** si la pregunta se corrigió a mano (src/data/bank/fix): la clave de su traducción, calculada con el texto original */
  ko?: string;
  /** y la traducción de lo corregido, cuando no coincide con la que ya había */
  enFix?: { q?: string; o?: [string, string, string, string] };
}

export type FamilyId =
  | "cultura"
  | "clasicos"
  | "d2010"
  | "nuevos"
  | "openings"
  | "portadaAnime"
  | "ost"
  | "portadaJuegos"
  | "aventura"
  | "rol"
  | "mundo"
  | "accion"
  | "shooter"
  | "versus"
  | "series"
  | "portadaSeries"
  | "peliculas";

/** las cuatro pestañas de arriba: cada familia pertenece a una */
export type GroupId = "anime" | "juegos" | "series" | "cultura";

export interface Family {
  id: FamilyId;
  group: GroupId;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  /** nombre corto para la ruleta y las fichas pequeñas */
  short: string;
  family: FamilyId;
  /** sin póster propio: mosaico con los pósters de estas categorías (ver src/lib/covers.ts) */
  mosaic?: string[];
  /** onomatopeya decorativa (aria-hidden) */
  sfx?: string;
}
