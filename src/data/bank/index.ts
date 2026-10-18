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

export interface ResolvedVideo {
  id: string;
  title: string;
  channel: string;
  durationSec: number;
}

const VIDEOS = (videosFile as { videos: Record<string, ResolvedVideo> }).videos;

export function videoFor(key: string): ResolvedVideo | undefined {
  return VIDEOS[key];
}

const RAW: Record<string, RawQuestion[]> = { ...cultura, ...leyenda, ...nueva, ...culto, ...oido, ...nintendo, ...aaa, ...online };

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
    list.forEach((r, i) => {
      const [d, q, a, b, c, e, media] = r as [RawQuestion[0], string, string, string, string, string, RawQuestion[6]];
      const id = `${cat}-${String(i + 1).padStart(2, "0")}`;
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
