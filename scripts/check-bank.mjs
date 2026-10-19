#!/usr/bin/env node
/* editorial-ui · Cristian Pérez · cristianperez.me
 * Revisa el banco: mínimos por categoría, opciones repetidas, claves de video sin fuente,
 * y cuántas preguntas de video quedan activas con el videos.json actual.
 *   node scripts/check-bank.mjs
 */
import { build } from "vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "node_modules/.cache/check-bank");
await build({
  root,
  logLevel: "silent",
  configFile: false,
  build: { ssr: true, outDir: out, emptyOutDir: true, rollupOptions: { input: path.join(root, "src/data/bank/index.ts"), output: { format: "es" } } },
});
const file = fs.readdirSync(out).find((f) => f.endsWith(".js"));
const { BANK } = await import(path.join(out, file));
const sources = JSON.parse(fs.readFileSync(path.join(root, "src/data/video-sources.json"), "utf8"));
const catsSrc = fs.readFileSync(path.join(root, "src/data/categories.ts"), "utf8");
const catIds = [...catsSrc.matchAll(/\{ id: "([a-z0-9]+)", name: "([^"]+)", short: "[^"]+", family: "([A-Za-z0-9]+)"/g)].map((m) => ({ id: m[1], name: m[2], family: m[3] }));

let problems = 0;
const warn = (m) => {
  problems++;
  console.log("  ✗ " + m);
};
console.log("Categoría                      total  video  f/m/d  faltan-video");
for (const c of catIds) {
  if (c.family === "categoria") continue;
  const list = BANK.byCat[c.id] || [];
  const missing = BANK.missingVideo.filter((id) => id.startsWith(c.id + "-")).length;
  const d = [1, 2, 3].map((x) => list.filter((q) => q.d === x).length).join("/");
  const min = 15;
  console.log(`${c.name.padEnd(30)} ${String(list.length).padStart(5)}  ${String(list.filter((q) => q.media).length).padStart(5)}  ${d.padStart(7)}  ${missing}`);
  if (list.length < min && !["openings", "ost"].includes(c.family)) warn(`${c.id}: ${list.length} activas (< ${min})`);
  for (const q of list) {
    const set = new Set(q.o.map((o) => o.trim().toLowerCase()));
    if (set.size !== 4) warn(`${q.id}: opciones repetidas → ${q.o.join(" | ")}`);
    if (q.media && !sources[q.media.k]) warn(`${q.id}: clave ${q.media.k} sin fuente`);
    if (q.media && q.media.e - q.media.s < 8) warn(`${q.id}: fragmento muy corto`);
    // la respuesta no debe estar escrita en la pregunta
    if (!q.visual && q.o[0].length >= 4 && q.q.toLowerCase().includes(q.o[0].toLowerCase())) console.log(`  ! ${q.id}: ¿la pregunta ya dice la respuesta? → ${q.q}`);
    if (q.q.length > 140) warn(`${q.id}: pregunta larga (${q.q.length})`);
  }
}
const all = Object.values(BANK.byId);
console.log(`\nTotal activas: ${all.length} · con video: ${all.filter((q) => q.media).length} · sin video resuelto: ${BANK.missingVideo.length}`);
const usedKeys = new Set(all.filter((q) => q.media).map((q) => q.media.k));
const unused = Object.keys(sources).filter((k) => k !== "_doc" && !usedKeys.has(k));
if (unused.length) console.log(`Claves sin usar o sin resolver: ${unused.length}`);
console.log(problems ? `\n${problems} problemas` : "\nSin problemas.");
process.exit(problems ? 1 : 0);
