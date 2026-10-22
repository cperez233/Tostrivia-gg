#!/usr/bin/env node
/* Lee Wikipedia (o MAL) como texto plano, sin gastar búsquedas web.
 *   node content/pending/tools/wp.mjs page en "Bocchi the Rock!"      → texto de la página
 *   node content/pending/tools/wp.mjs search en "bocchi the rock"      → títulos que coinciden
 *   node content/pending/tools/wp.mjs url "https://myanimelist.net/anime/47917/x/characters"
 * Guarda en /tmp/wpcache para no repetir.  */
import fs from "node:fs";
import crypto from "node:crypto";
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";
const cache = "/tmp/wpcache";
fs.mkdirSync(cache, { recursive: true });
async function get(url) {
  const f = `${cache}/${crypto.createHash("md5").update(url).digest("hex")}`;
  if (fs.existsSync(f)) return fs.readFileSync(f, "utf8");
  for (let i = 0; i < 4; i++) {
    const r = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "en,es" } });
    if (r.status === 429) { await new Promise((ok) => setTimeout(ok, 1500 * (i + 1))); continue; }
    if (!r.ok) throw new Error(`${r.status} ${url}`);
    const t = await r.text();
    fs.writeFileSync(f, t);
    return t;
  }
  throw new Error("429 " + url);
}
const ent = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&nbsp;": " ", "&#160;": " " };
function text(html) {
  html = html.replace(/<(script|style|sup|noscript)[\s\S]*?<\/\1>/gi, "").replace(/<!--[\s\S]*?-->/g, "");
  const main = html.match(/<div id="mw-content-text"[\s\S]*<\/div>\s*<div class="printfooter"/i);
  if (main) html = main[0];
  return html
    .replace(/<\/(p|div|li|tr|h[1-6]|dd|dt|table)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&[#\w]+;/g, (m) => ent[m] ?? (m.startsWith("&#") ? String.fromCodePoint(parseInt(m.slice(2, -1), m[2] === "x" ? 16 : 10)) : m))
    .replace(/\[\d+\]|\[edit\]|\[editar\]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}
const [mode, a, b] = process.argv.slice(2);
if (mode === "page") {
  const html = await get(`https://${a}.wikipedia.org/wiki/${encodeURIComponent(b.replace(/ /g, "_"))}`);
  console.log(text(html));
} else if (mode === "search") {
  const j = JSON.parse(await get(`https://${a}.wikipedia.org/w/api.php?action=opensearch&limit=8&format=json&search=${encodeURIComponent(b)}`));
  j[1].forEach((t, i) => console.log(t, "—", j[3][i]));
} else if (mode === "url") {
  console.log(text(await get(a)));
} else console.log("uso: page|search|url");
