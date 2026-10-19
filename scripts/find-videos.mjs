#!/usr/bin/env node
/* editorial-ui · Cristian Pérez · cristianperez.me */
/**
 * Igual que fetch-videos.mjs pero sin API key: busca en la página de resultados de YouTube y
 * comprueba en la página de inserción (/embed/) que el video se deje reproducir fuera de YouTube.
 * Escribe en el mismo src/data/videos.json. Sirve cuando no hay key o se acabó la cuota.
 *
 *   npm run videos:sin-key                    # resuelve las claves que faltan
 *   npm run videos:sin-key -- --force sao-op-crossing
 *
 * Lo que no puede ver sin la API: el bloqueo por país. La partida ya cambia la pregunta
 * si un video no carga, y `npm run videos -- --verify` (con key) lo revisa cuando haya cuota.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defaultMax, score } from "./video-rules.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCES = path.join(root, "src/data/video-sources.json");
const OUT = path.join(root, "src/data/videos.json");
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const wait = (ms) => new Promise((ok) => setTimeout(ok, ms));

async function get(url, headers = {}) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "es-CO,es;q=0.9", ...headers } });
    if (res.ok) return res.text();
    if (attempt >= 3 || ![429, 500, 503].includes(res.status)) throw new Error(`${res.status} ${url}`);
    await wait(4000 * 2 ** attempt);
  }
}

/** "1:02:03" -> 3723 */
const clock = (t = "") => t.split(":").reduce((acc, n) => acc * 60 + Number(n), 0);

function videoRenderers(html) {
  const m = html.match(/var ytInitialData = (\{.*?\});<\/script>/s);
  if (!m) return [];
  const out = [];
  const walk = (o) => {
    if (Array.isArray(o)) return o.forEach(walk);
    if (!o || typeof o !== "object") return;
    if (o.videoRenderer) out.push(o.videoRenderer);
    for (const v of Object.values(o)) walk(v);
  };
  walk(JSON.parse(m[1]));
  return out.map((v) => ({
    id: v.videoId,
    title: v.title?.runs?.map((r) => r.text).join("") ?? "",
    channel: v.ownerText?.runs?.[0]?.text ?? "",
    durationSec: clock(v.lengthText?.simpleText),
    views: Number((v.viewCountText?.simpleText || "").replace(/\D/g, "")) || 1,
    live: !v.lengthText,
  }));
}

/** lo que dice el reproductor insertado: null si se puede reproducir, o el motivo */
async function embedVerdict(id) {
  const html = await get(`https://www.youtube.com/embed/${id}`, { Referer: "https://tostrivia.vercel.app/" });
  const m = html.match(/PlayabilityStatus\\?":\{\\?"status\\?":\\?"([A-Z_]+)\\?"(?:,\\?"playableInEmbed\\?":(true|false))?/);
  if (!m) return "sin datos del reproductor";
  if (m[1] !== "OK") return `reproductor: ${m[1]}`;
  if (m[2] === "false") return "no embebible";
  return null;
}

async function resolve(src) {
  for (const q of [src.q, ...(src.alt || [])]) {
    const html = await get(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}&gl=CO&hl=es`);
    const ranked = videoRenderers(html)
      .filter((v) => !v.live)
      .map((v) => ({ v, s: score(v, src) }))
      .filter(({ v, s }) => Number.isFinite(s) && v.durationSec >= (src.min ?? 45) && v.durationSec <= (src.max ?? defaultMax(src)))
      .sort((a, b) => b.s - a.s);
    for (const { v } of ranked.slice(0, 5)) {
      const why = await embedVerdict(v.id);
      if (why) {
        console.log(`   descartado ${v.id} (${why}): ${v.title}`);
        continue;
      }
      return { id: v.id, title: v.title, channel: v.channel, durationSec: v.durationSec, checkedAt: new Date().toISOString().slice(0, 10) };
    }
    console.log(`   sin candidato válido para "${q}"`);
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
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
  const pending = Object.keys(sources).filter((k) => forced.has(k) || !out.videos[k]);
  console.log(`${Object.keys(out.videos).length} resueltas, ${pending.length} pendientes.`);
  const missing = [];
  for (const k of pending) {
    console.log(`→ ${k}`);
    try {
      const v = await resolve(sources[k]);
      if (v) {
        out.videos[k] = v;
        console.log(`✓ ${k}: ${v.id} · ${v.title} · ${v.channel} · ${v.durationSec}s`);
        save();
      } else missing.push(k);
    } catch (e) {
      console.log(`✗ ${k}: ${e.message}`);
      missing.push(k);
    }
    await wait(1200);
  }
  save();
  console.log(`Listo. ${Object.keys(out.videos).length}/${Object.keys(sources).length} claves con video.`);
  if (missing.length) console.log(`Sin resolver: ${missing.join(", ")}`);
}

main().catch((e) => {
  console.error(e.stack || e.message);
  process.exit(1);
});
