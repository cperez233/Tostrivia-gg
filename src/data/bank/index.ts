/* editorial-ui · Cristian Pérez · cristianperez.me */
import type { Question, RawQuestion } from "../types";
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
for (const part of [cultura, leyenda, nueva, culto, oido, nintendo, aaa, online, pantalla, masAnime, masJuegos, extra, conVideo, v1PantallaCultura, v1Series, v1Peliculas, v1Anime, v1Juegos, v1Video]) {
  for (const [cat, list] of Object.entries(part)) (RAW[cat] ??= []).push(...list);
}

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
      const [d, q, a, b, c, e, media] = r as [RawQuestion[0], string, string, string, string, string, RawQuestion[6]];
      let id = stableId(cat, q, a, media?.k);
      while (byId[id]) id += "x";
      const question: Question = { id, cat, d, q, o: [a, b, c, e], media: media || undefined };
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
