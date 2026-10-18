#!/usr/bin/env node
/* editorial-ui · Cristian Pérez · cristianperez.me */
/**
 * Resuelve las claves de src/data/video-sources.json a videoIds de YouTube verificados
 * y los guarda en src/data/videos.json. Se corre en tu máquina, nunca en producción:
 *
 *   npm run videos             # resuelve solo las claves que faltan
 *   npm run videos -- --verify # vuelve a revisar los ids guardados (1 unidad por cada 50)
 *   npm run videos -- --force naruto-op-bluebird   # rebusca una clave concreta
 *
 * La key se lee de .env (YOUTUBE_API_KEY). Nunca se imprime: todos los mensajes
 * pasan por safe(), que la tacha si apareciera en un error.
 *
 * Coste: search.list = 100 unidades, videos.list = 1. La cuota diaria por defecto es 10.000,
 * así que el script para solo al acercarse al límite y retoma al día siguiente.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCES = path.join(root, "src/data/video-sources.json");
const OUT = path.join(root, "src/data/videos.json");
const QUOTA_BUDGET = Number(process.env.YT_QUOTA_BUDGET || 9500);

function loadEnv() {
  const file = path.join(root, ".env");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  }
}
loadEnv();
const KEY = process.env.YOUTUBE_API_KEY;
if (!KEY) {
  console.error("Falta YOUTUBE_API_KEY en .env (mira .env.example).");
  process.exit(1);
}
const safe = (s) => String(s).split(KEY).join("[key]");
const log = (...a) => console.log(...a.map(safe));

let quota = 0;
async function api(endpoint, params, cost) {
  if (quota + cost > QUOTA_BUDGET) throw Object.assign(new Error("quota-budget"), { code: "budget" });
  quota += cost;
  const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  url.searchParams.set("key", KEY);
  let res, body;
  // rateLimitExceeded llega a ráfagas: se reintenta con espera creciente (5 s, 10 s, 20 s, 40 s).
  for (let attempt = 0; ; attempt++) {
    res = await fetch(url, { headers: { Accept: "application/json" } });
    body = await res.json().catch(() => ({}));
    const r = body?.error?.errors?.[0]?.reason;
    if (res.ok || r !== "rateLimitExceeded" || attempt >= 3) break;
    await new Promise((ok) => setTimeout(ok, 5000 * 2 ** attempt));
  }
  if (!res.ok) {
    const reason = body?.error?.errors?.[0]?.reason || res.status;
    const err = new Error(`YouTube API ${endpoint}: ${reason} ${body?.error?.message || ""}`);
    const daily = /per day/i.test(body?.error?.message || "");
    err.code = reason === "quotaExceeded" || reason === "dailyLimitExceeded" || (reason === "rateLimitExceeded" && daily) ? "quota" : "api";
    throw err;
  }
  return body;
}

const norm = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’`]/g, "'");

const OFFICIAL = [
  "crunchyroll", "vizmedia", "viz media", "aniplex", "toho animation", "tohoanimation", "mappa", "ufotable",
  "funimation", "netflix anime", "kadokawa", "toei animation", "muse asia", "ani-one", "pony canyon",
  "sony music", "lisa official", "king gnu", "yoasobi", "kenshi yonezu", "米津玄師", "official hige dandism",
  "nintendo", "playstation", "xbox", "rockstar games", "cd projekt red", "the witcher", "bandai namco",
  "riot games", "league of legends", "valorant", "genshin impact", "overwatch", "blizzard", "sega", "sonic the hedgehog",
  "capcom", "fromsoftware", "square enix", "konami", "minecraft", "c418", "epic games", "fortnite",
  "queen official", "luisfonsivevo", "vevo", "imagine dragons", "jamproject", "warner bros", "universal pictures",
  "star wars", "lucasfilm", "halo", "bethesda", "seatbelts", "flying dog", "victor entertainment",
];
const BANNED = [
  "cover", "reaction", "reaccion", "react", "nightcore", "remix", "8 bit", "8-bit", "1 hour", "10 hours", "1 hora",
  "slowed", "sped up", "tutorial", "karaoke", "guitar", "drum", "fandub", "lyrics prank", "amv", "mashup",
  "ranking", "dank", "parody", "parodia", "leak", "leaked", "top 10", "top 20", "tier list", "loop", "extended", "earrape", "bass boosted", "ost compilation",
  "full album", "playlist", "explained", "analysis", "breakdown", "theme was", "music theory", "vs", "piano tutorial", "meme", "short", "shorts",
];

function score(v, src) {
  const t = norm(v.snippet.title);
  const ch = norm(v.snippet.channelTitle);
  let s = 0;
  for (const group of src.must || []) {
    const ok = group.split("|").some((w) => t.includes(norm(w)));
    if (!ok) return -Infinity;
    s += 3;
  }
  const word = (w) => new RegExp(`(^|[^a-z0-9])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`);
  if (BANNED.some((b) => word(b).test(t) && !norm(src.q).includes(b))) return -Infinity;
  if (OFFICIAL.some((o) => ch.includes(o))) s += 6;
  if (/creditless|textless|official|oficial|non-credit|clean/.test(t)) s += 2;
  s += Math.log10(Number(v.statistics?.viewCount || 1));
  return s;
}

/** ISO 8601 PT#H#M#S -> segundos */
function seconds(iso = "") {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  return m ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0) : 0;
}

/** openings y endings: versión TV o videoclip; nada de análisis de 10 minutos */
const defaultMax = (src) => (/opening|ending/i.test(src.q) ? 330 : /trailer|short/i.test(src.q) ? 400 : 600);

/** Comprobaciones que pidió el dueño: embebible, público, sin restricción de edad ni bloqueo en CO. */
function verdict(v, src) {
  if (!v.status?.embeddable) return "no embebible";
  if (v.status?.privacyStatus !== "public") return "no es público";
  if (v.contentDetails?.contentRating?.ytRating === "ytAgeRestricted") return "restringido por edad";
  const rr = v.contentDetails?.regionRestriction;
  if (rr?.blocked?.includes("CO")) return "bloqueado en Colombia";
  if (rr?.allowed && !rr.allowed.includes("CO")) return "no disponible en Colombia";
  const d = seconds(v.contentDetails?.duration);
  if (d < (src.min ?? 45)) return `muy corto (${d}s)`;
  if (d > (src.max ?? defaultMax(src))) return `muy largo (${d}s)`;
  return null;
}

async function details(ids) {
  if (!ids.length) return [];
  const out = [];
  for (let i = 0; i < ids.length; i += 50) {
    const r = await api("videos", { part: "status,contentDetails,snippet,statistics", id: ids.slice(i, i + 50).join(","), maxResults: 50 }, 1);
    out.push(...(r.items || []));
  }
  return out;
}

async function resolve(key, src) {
  const queries = [src.q, ...(src.alt || [])];
  for (const q of queries) {
    const r = await api("search", { part: "id", type: "video", videoEmbeddable: "true", maxResults: 10, q, regionCode: "CO" }, 100);
    const ids = (r.items || []).map((i) => i.id.videoId).filter(Boolean);
    const vids = await details(ids);
    const ranked = vids
      .map((v) => ({ v, why: verdict(v, src), s: score(v, src) }))
      .filter((x) => {
        if (x.why) log(`   descartado ${x.v.id} (${x.why}): ${x.v.snippet.title}`);
        return !x.why && Number.isFinite(x.s);
      })
      .sort((a, b) => b.s - a.s);
    if (ranked.length) {
      const { v } = ranked[0];
      return {
        id: v.id,
        title: v.snippet.title,
        channel: v.snippet.channelTitle,
        durationSec: seconds(v.contentDetails.duration),
        checkedAt: new Date().toISOString().slice(0, 10),
      };
    }
    log(`   sin candidato válido para "${q}", probando otra búsqueda…`);
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const verifyOnly = args.includes("--verify");
  const forceIdx = args.indexOf("--force");
  const forced = new Set(forceIdx >= 0 ? args.slice(forceIdx + 1).filter((a) => !a.startsWith("--")) : []);

  const sources = JSON.parse(fs.readFileSync(SOURCES, "utf8"));
  delete sources._doc;
  const out = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : { videos: {} };
  out.videos ||= {};
  const save = () => {
    out.generatedAt = new Date().toISOString();
    const sorted = Object.fromEntries(Object.keys(out.videos).sort().map((k) => [k, out.videos[k]]));
    fs.writeFileSync(OUT, JSON.stringify({ generatedAt: out.generatedAt, videos: sorted }, null, 2) + "\n");
  };

  // 1. Revisión de los ya guardados: si alguno dejó de ser embebible, se borra y se busca otro.
  const stored = Object.entries(out.videos).filter(([k]) => sources[k]);
  if (stored.length && (verifyOnly || !args.length)) {
    const vids = await details(stored.map(([, v]) => v.id));
    const byId = Object.fromEntries(vids.map((v) => [v.id, v]));
    for (const [k, v] of stored) {
      const live = byId[v.id];
      const why = live ? verdict(live, sources[k]) : "ya no existe";
      if (why) {
        log(`✗ ${k}: ${v.id} ${why}; se buscará otro`);
        delete out.videos[k];
      } else out.videos[k].checkedAt = new Date().toISOString().slice(0, 10);
    }
    save();
  }
  if (verifyOnly) return log(`Verificación lista. Cuota usada: ~${quota} unidades.`);

  // Claves que ya no existen en el registro se eliminan.
  for (const k of Object.keys(out.videos)) if (!sources[k]) delete out.videos[k];

  const pending = Object.keys(sources).filter((k) => forced.has(k) || !out.videos[k]);
  log(`${Object.keys(out.videos).length} resueltas, ${pending.length} pendientes.`);
  let missing = [];
  for (const k of pending) {
    log(`→ ${k}`);
    try {
      const v = await resolve(k, sources[k]);
      if (v) {
        out.videos[k] = v;
        log(`✓ ${k}: ${v.id} · ${v.title} · ${v.channel} · ${v.durationSec}s`);
        save();
      } else {
        missing.push(k);
        log(`✗ ${k}: ningún video embebible pasó los filtros`);
      }
    } catch (e) {
      if (e.code === "budget" || e.code === "quota") {
        log(`Se acabó la cuota de hoy (~${quota} unidades). Vuelve a correr el script mañana para seguir.`);
        missing = missing.concat(pending.slice(pending.indexOf(k)));
        break;
      }
      log(`✗ ${k}: ${e.message}`);
      missing.push(k);
    }
  }
  save();
  log(`Listo. ${Object.keys(out.videos).length}/${Object.keys(sources).length} claves con video. Cuota usada: ~${quota} unidades.`);
  if (missing.length) log(`Sin resolver: ${missing.join(", ")}`);
}

main().catch((e) => {
  console.error(safe(e.stack || e.message));
  process.exit(1);
});
