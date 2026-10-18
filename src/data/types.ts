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
  | "leyenda"
  | "nueva"
  | "culto"
  | "oido"
  | "nintendo"
  | "aaa"
  | "online";

export type Tone = "dots" | "lines" | "bigdots" | "cross" | "hlines" | "checker" | "vlines" | "grid";

export interface Family {
  id: FamilyId;
  name: string;
  /** nombre corto para la ruleta */
  wheel: string;
  tone: Tone;
  blurb: string;
}

export interface Category {
  id: string;
  name: string;
  family: FamilyId;
  /** una línea, qué cubre */
  blurb: string;
  /** onomatopeya decorativa (aria-hidden) */
  sfx?: string;
}
