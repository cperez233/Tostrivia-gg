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
  | "oido"
  | "aventura"
  | "rol"
  | "mundo"
  | "accion"
  | "shooter"
  | "versus";

/** las cuatro pestañas de arriba: cada familia pertenece a una */
export type GroupId = "anime" | "juegos" | "cultura" | "oido";

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
  /** clave de video (videos.json) cuya miniatura hace de portada; varias = mosaico */
  cover: string | string[];
  /** punto de interés horizontal de la portada, 0 a 100 */
  focus?: number;
  /** onomatopeya decorativa (aria-hidden) */
  sfx?: string;
}
