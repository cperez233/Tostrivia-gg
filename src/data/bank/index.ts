/* editorial-ui · Cristian Pérez · cristianperez.me */
import type { Difficulty, Media, PosterFx, Question, RawQuestion, Visual } from "../types";
import { CATEGORIES, FAMILY_BY_ID, NAME_ES } from "../categories";
import posterZoom from "../posterZoom.json";
import { rng, shuffle } from "../../lib/rng";
import videosFile from "../videos.json";
import cultura from "./cultura";
import leyenda from "./leyenda";
import nueva from "./nueva";
import culto from "./culto";
import oido from "./oido";
import nintendo from "./nintendo";
import aaa from "./aaa";
import online from "./online";
import pantalla from "./pantalla";
import masAnime from "./mas-anime";
import masJuegos from "./mas-juegos";
import extra from "./extra";
import conVideo from "./con-video";
import v1PantallaCultura from "./v1-pantalla-cultura";
import v1Series from "./v1-series";
import v1Anime from "./v1-anime";
import v1Juegos from "./v1-juegos";
import v1Video from "./v1-video";
import v1Peliculas from "./v1-peliculas";

export interface VideoCandidate {
  id: string;
  title: string;
  channel: string;
  durationSec: number;
}

/** el video de una clave y los de respaldo, por si YouTube no deja reproducir el primero */
export interface ResolvedVideo extends VideoCandidate {
  alt?: VideoCandidate[];
}

const VIDEOS = (videosFile as { videos: Record<string, ResolvedVideo> }).videos;

export function videoFor(key: string): ResolvedVideo | undefined {
  return VIDEOS[key];
}

// varios archivos pueden aportar a la misma categoría: se suman, no se pisan
const RAW: Record<string, RawQuestion[]> = {};
// lo que genera scripts/build-content.mjs (preguntas en español e inglés escritas en content/)
const GENERATED = Object.values(import.meta.glob<{ default: Record<string, RawQuestion[]> }>("./c-*.ts", { eager: true })).map((m) => m.default);
for (const part of [...GENERATED, cultura, leyenda, nueva, culto, oido, nintendo, aaa, online, pantalla, masAnime, masJuegos, extra, conVideo, v1PantallaCultura, v1Series, v1Peliculas, v1Anime, v1Juegos, v1Video]) {
  for (const [cat, list] of Object.entries(part)) (RAW[cat] ??= []).push(...list);
}

/**
 * Adivina el póster: una pregunta por póster y por efecto (pixelado, detalle o borroso), armadas aquí con las
 * portadas que ya hay. Cada lado (anime, juegos, series y películas) tiene su categoría.
 */
const POSTER_CATS = { anime: "posteranime", juegos: "posterjuegos", series: "posterseries" } as const;
const POSTER_Q: Record<keyof typeof POSTER_CATS, Record<PosterFx, string>> = {
  anime: { blur: "¿De qué anime es este póster borroso?", pixel: "¿De qué anime es este póster pixelado?", zoom: "¿De qué anime es este detalle de su póster?" },
  juegos: { blur: "¿De qué juego es esta portada borrosa?", pixel: "¿De qué juego es esta portada pixelada?", zoom: "¿De qué juego es este detalle de su portada?" },
  series: { blur: "¿De qué serie o película es este póster borroso?", pixel: "¿De qué serie o película es este póster pixelado?", zoom: "¿De qué serie o película es este detalle de su póster?" },
};
/** categorías que no son una sola obra (el póster no tiene una respuesta única) o cuyo póster es solo el título (undertale, jurassic) */
const NO_POSTER = new Set(["pelea", "pixar", "disney", "ghibli", "nolan", "mcu", "undertale", "jurassic"]);
const POSTER_D: Record<PosterFx, Difficulty> = { blur: 1, pixel: 2, zoom: 3 };

/**
 * Ajustes de dificultad hechos a mano (src/data/bank/rerate/*.json), por si una pregunta pesa distinto de lo que dice su archivo:
 *   d:    { idDePregunta: 1|2|3 }
 *   fame: { categoria: 1|2|3 }  qué tan famosa es la obra (1 mainstream, 3 de nicho); mueve la dificultad de sus pósters
 */
const RERATE: { d: Record<string, Difficulty>; fame: Record<string, number> } = { d: {}, fame: {} };
for (const m of Object.values(import.meta.glob<{ default: { d?: Record<string, Difficulty>; fame?: Record<string, number> } }>("./rerate/*.json", { eager: true }))) {
  Object.assign(RERATE.d, m.default.d);
  Object.assign(RERATE.fame, m.default.fame);
}
const posterD = (cat: string, fx: PosterFx) => Math.min(3, Math.max(1, POSTER_D[fx] + (RERATE.fame[cat] ?? 2) - 2)) as Difficulty;

function posterQuestions(): Record<string, RawQuestion[]> {
  const out: Record<string, RawQuestion[]> = {};
  for (const side of Object.keys(POSTER_CATS) as (keyof typeof POSTER_CATS)[]) {
    // solo las que tienen póster propio (no mosaico) y preguntas de sobra para que valga la pena
    const pool = CATEGORIES.filter((c) => FAMILY_BY_ID[c.family].group === side && !c.mosaic && !NO_POSTER.has(c.id) && (RAW[c.id]?.length ?? 0) >= 10);
    const list: RawQuestion[] = [];
    for (const c of pool) {
      for (const fx of ["blur", "pixel", "zoom"] as PosterFx[]) {
        if (fx === "zoom" && !(c.id in posterZoom)) continue; // sin ventana que evite el título
        const rand = rng([...`${c.id}|${fx}`].reduce((h, ch) => Math.imul(h ^ ch.codePointAt(0)!, 16777619) >>> 0, 2166136261));
        const bad = shuffle(pool.filter((x) => x.id !== c.id), rand).slice(0, 3);
        list.push([posterD(c.id, fx), POSTER_Q[side][fx], NAME_ES[c.id], NAME_ES[bad[0].id], NAME_ES[bad[1].id], NAME_ES[bad[2].id], { v: "poster", id: c.id, fx }]);
      }
    }
    out[POSTER_CATS[side]] = list;
  }
  return out;
}
for (const [cat, list] of Object.entries(posterQuestions())) (RAW[cat] ??= []).push(...list);

/** id estable que sale del contenido: reordenar o sumar preguntas no cambia el de las demás (el historial lo usa) */
function stableId(cat: string, q: string, answer: string, media?: string) {
  let h = 2166136261;
  for (const ch of `${q}|${answer}|${media ?? ""}`) h = Math.imul(h ^ ch.codePointAt(0)!, 16777619) >>> 0;
  return `${cat}-${h.toString(36)}`;
}

export interface Bank {
  byId: Record<string, Question>;
  byCat: Record<string, Question[]>;
  /** preguntas de video que se quedaron fuera porque su clave no tiene videoId */
  missingVideo: string[];
}

function build(): Bank {
  const byId: Record<string, Question> = {};
  const byCat: Record<string, Question[]> = {};
  const missingVideo: string[] = [];
  for (const [cat, list] of Object.entries(RAW)) {
    byCat[cat] = [];
    list.forEach((r) => {
      const [d, q, a, b, c, e, extra] = r as [RawQuestion[0], string, string, string, string, string, Media | Visual | undefined];
      const media = extra && "k" in extra ? extra : undefined;
      const visual = extra && "v" in extra ? extra : undefined;
      let id = stableId(cat, q, a, media?.k ?? (visual?.v === "poster" ? `${visual.id}:${visual.fx}` : undefined));
      while (byId[id]) id += "x";
      const question: Question = { id, cat, d: RERATE.d[id] ?? d, q, o: [a, b, c, e], media: media || undefined, visual };
      if (media) {
        const v = VIDEOS[media.k];
        if (!v) {
          missingVideo.push(id);
          return;
        }
        // si el video resultó más corto que el fragmento pedido, se ajusta al final real
        if (media.e > v.durationSec - 1) {
          const len = media.e - media.s;
          question.media = { ...media, e: Math.max(5, v.durationSec - 1), s: Math.max(0, v.durationSec - 1 - len) };
        }
      }
      byId[id] = question;
      byCat[cat].push(question);
    });
  }
  return { byId, byCat, missingVideo };
}

export const BANK: Bank = build();

export function countFor(cat: string) {
  const list = BANK.byCat[cat] || [];
  return { total: list.length, media: list.filter((q) => q.media).length };
}
