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
 * Formato compacto de autor: [dificultad, pregunta, correcta, mala1, mala2, mala3, media?]
 * La correcta siempre va primero; el orden se baraja en la partida.
 */
export type RawQuestion =
  | [Difficulty, string, string, string, string, string]
  | [Difficulty, string, string, string, string, string, Media];

export interface Question {
  id: string;
  cat: string;
  d: Difficulty;
  q: string;
  /** opciones; la 0 es la correcta */
  o: [string, string, string, string];
  media?: Media;
}

export type FamilyId =
  | "cultura"
  | "clasicos"
  | "d2010"
  | "nuevos"
  | "openings"
  | "ost"
  | "aventura"
  | "rol"
  | "mundo"
  | "accion"
  | "shooter"
  | "versus"
  | "series"
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
