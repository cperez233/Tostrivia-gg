/* editorial-ui · Cristian Pérez · cristianperez.me */
import type { Difficulty, Media, PosterFx, Question, RawQuestion, Visual } from "../types";
import { CATEGORIES, FAMILY_BY_ID, NAME_ES } from "../categories";
import posterLevel from "../posterLevel.json";
import posterZoom from "../posterZoom.json";
import { rng, shuffle } from "../../lib/rng";
import { questionKey } from "../../i18n";
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
const GENERATED_FILES = import.meta.glob<{ default: Record<string, RawQuestion[]> }>("./c-*.ts", { eager: true });
const GENERATED = Object.values(GENERATED_FILES).map((m) => m.default);
/** filas que vienen de las auditorías (content/audit-*.mjs): son la versión revisada, no se retiran por id y reemplazan a la vieja que comparte id */
const FROM_AUDIT = new Set<RawQuestion>();
for (const [file, m] of Object.entries(GENERATED_FILES)) {
  if (/\/c-audit-/.test(file)) for (const list of Object.values(m.default)) list.forEach((r) => FROM_AUDIT.add(r));
}
for (const part of [...GENERATED, cultura, leyenda, nueva, culto, oido, nintendo, aaa, online, pantalla, masAnime, masJuegos, extra, conVideo, v1PantallaCultura, v1Series, v1Peliculas, v1Anime, v1Juegos, v1Video]) {
  for (const [cat, list] of Object.entries(part)) (RAW[cat] ??= []).push(...list);
}

/**
 * Adivina el póster: una pregunta por póster y por efecto (pixelado, detalle o borroso), armadas aquí con las
 * portadas que ya hay. Cada lado (anime, juegos, series y películas) tiene su categoría.
 */
const POSTER_CATS = { anime: "posteranime", juegos: "posterjuegos", series: "posterseries" } as const;
const POSTER_Q: Record<keyof typeof POSTER_CATS, string> = {
  anime: "¿De qué anime es este póster?",
  juegos: "¿De qué juego es esta portada?",
  series: "¿De qué serie o película es este póster?",
};
/** categorías que no son una sola obra (el póster no tiene una respuesta única) o cuyo póster es solo el título (undertale, jurassic) */
const NO_POSTER = new Set(["pelea", "pixar", "disney", "ghibli", "nolan", "mcu", "undertale", "jurassic"]);
/**
 * Dificultad de "Adivina el póster": depende de qué tan reconocible es la obra (src/data/posterLevel.json) y del efecto.
 * 0 icono que todos conocen, 1 muy famosa, 2 conocida, 3 de nicho. El detalle cae en una orilla o esquina (sin la cara), así que nunca es de lo más fácil.
 */
const POSTER_D: Record<number, Record<PosterFx, Difficulty>> = {
  0: { blur: 1, pixel: 1, zblur: 1, zoom: 2 },
  1: { blur: 1, pixel: 1, zblur: 1, zoom: 2 },
  2: { blur: 1, pixel: 2, zblur: 2, zoom: 3 },
  3: { blur: 2, pixel: 3, zblur: 3, zoom: 3 },
};
const POSTER_LEVEL = posterLevel as Record<string, number>;
const posterD = (id: string, fx: PosterFx): Difficulty => POSTER_D[POSTER_LEVEL[id] ?? 2][fx];

/**
 * Ajustes de dificultad hechos a mano (src/data/bank/rerate/*.json), por si una pregunta pesa distinto de lo que dice su archivo:
 *   d:    { idDePregunta: 1|2|3 }
 */
const RERATE: { d: Record<string, Difficulty> } = { d: {} };
for (const m of Object.values(import.meta.glob<{ default: { d?: Record<string, Difficulty> } }>("./rerate/*.json", { eager: true }))) {
  Object.assign(RERATE.d, m.default.d);
}

/**
 * Correcciones hechas a mano (src/data/bank/fix/*.json): { idDePregunta: { q?, o?, d?, en?: { q?, o? } } }.
 * Cambian el enunciado, las cuatro opciones (la 0 es la correcta) o la dificultad sin tocar el archivo de origen.
 * `en` trae la traducción de lo que cambió; la clave de la traducción vieja se sigue calculando con el texto original (`ko`).
 */
interface Fix {
  q?: string;
  o?: [string, string, string, string];
  d?: Difficulty;
  en?: { q?: string; o?: [string, string, string, string] };
}
const FIXES: Record<string, Fix> = {};
for (const m of Object.values(import.meta.glob<{ default: Record<string, Fix> }>("./fix/*.json", { eager: true }))) Object.assign(FIXES, m.default);

/** preguntas retiradas a mano (src/data/bank/drop/*.json: { "ids": [...] }), por ejemplo las que se soplaban solas */
const DROPPED = new Set<string>();
for (const m of Object.values(import.meta.glob<{ default: { ids?: string[] } }>("./drop/*.json", { eager: true }))) m.default.ids?.forEach((id) => DROPPED.add(id));

function posterQuestions(): Record<string, RawQuestion[]> {
  const out: Record<string, RawQuestion[]> = {};
  for (const side of Object.keys(POSTER_CATS) as (keyof typeof POSTER_CATS)[]) {
    // solo las que tienen póster propio (no mosaico) y preguntas de sobra para que valga la pena
    const pool = CATEGORIES.filter((c) => FAMILY_BY_ID[c.family].group === side && !c.mosaic && !NO_POSTER.has(c.id) && (RAW[c.id]?.length ?? 0) >= 10);
    const list: RawQuestion[] = [];
    for (const c of pool) {
      for (const fx of ["blur", "pixel", "zoom", "zblur"] as PosterFx[]) {
        if ((fx === "zoom" || fx === "zblur") && !(c.id in posterZoom)) continue; // sin ventana que evite el título
        const rand = rng([...`${c.id}|${fx}`].reduce((h, ch) => Math.imul(h ^ ch.codePointAt(0)!, 16777619) >>> 0, 2166136261));
        const bad = shuffle(pool.filter((x) => x.id !== c.id), rand).slice(0, 3);
        list.push([posterD(c.id, fx), POSTER_Q[side], NAME_ES[c.id], NAME_ES[bad[0].id], NAME_ES[bad[1].id], NAME_ES[bad[2].id], { v: "poster", id: c.id, fx }]);
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
  // ids de las preguntas revisadas: si una pregunta vieja tiene el mismo id (mismo enunciado y respuesta), manda la revisada
  const auditIds = new Set<string>();
  for (const [cat, list] of Object.entries(RAW)) {
    for (const r of list) {
      if (!FROM_AUDIT.has(r)) continue;
      const x = r[6] as Media | Visual | undefined;
      auditIds.add(stableId(cat, r[1] as string, r[2] as string, x && "k" in x ? x.k : x && "v" in x && x.v === "poster" ? `${x.id}:${x.fx}` : undefined));
    }
  }
  for (const [cat, list] of Object.entries(RAW)) {
    byCat[cat] = [];
    list.forEach((r) => {
      const [d, q, a, b, c, e, extra] = r as [RawQuestion[0], string, string, string, string, string, Media | Visual | undefined];
      const media = extra && "k" in extra ? extra : undefined;
      const visual = extra && "v" in extra ? extra : undefined;
      let id = stableId(cat, q, a, media?.k ?? (visual?.v === "poster" ? `${visual.id}:${visual.fx}` : undefined));
      const baseId = id;
      while (byId[id]) id += "x";
      const question: Question = { id, cat, d: RERATE.d[id] ?? d, q, o: [a, b, c, e], media: media || undefined, visual };
      const fix = FIXES[id];
      if (fix) {
        question.ko = questionKey(q, [a, b, c, e]);
        if (fix.q) question.q = fix.q;
        if (fix.o) question.o = fix.o;
        if (fix.d) question.d = fix.d;
        if (fix.en) question.enFix = fix.en;
      }
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
      const audited = FROM_AUDIT.has(r);
      if (!audited && auditIds.has(baseId)) return; // la versión revisada ya cubre esta pregunta
      if (DROPPED.has(id) && !audited) return;
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
