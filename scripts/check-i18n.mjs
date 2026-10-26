#!/usr/bin/env node
/* editorial-ui · Cristian Pérez · cristianperez.me
 * Revisa la traducción al inglés:
 *   - las frases de t("…") del código que no están en src/i18n/en.ts
 *   - las preguntas del banco sin traducción en src/i18n/questions.en.json (si se edita una pregunta, su
 *     traducción deja de coincidir y sale en español hasta que se traduzca otra vez)
 *   node scripts/check-i18n.mjs            → informe
 *   node scripts/check-i18n.mjs --pending  → además escribe las preguntas pendientes en node_modules/.cache/i18n-pending.json
 */
import { build } from "vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "node_modules/.cache/check-i18n");
await build({
  root,
  logLevel: "silent",
  configFile: false,
  build: { ssr: true, outDir: out, emptyOutDir: true, rollupOptions: { input: { bank: path.join(root, "src/data/bank/index.ts"), en: path.join(root, "src/i18n/en.ts") }, output: { format: "es" } } },
});
const { BANK } = await import(path.join(out, "bank.js"));
const { EN } = await import(path.join(out, "en.js"));
const questions = JSON.parse(fs.readFileSync(path.join(root, "src/i18n/questions.en.json"), "utf8"));

// misma clave que questionKey() en src/i18n/index.ts
function key(q, o) {
  let h = 2166136261;
  for (const ch of [q, ...o].join("|")) h = Math.imul(h ^ ch.codePointAt(0), 16777619) >>> 0;
  return h.toString(36);
}

// Adivina el póster se traduce solo (la pregunta y los nombres están en src/i18n/en.ts)
const pending = Object.values(BANK.byId).filter((q) => q.visual?.v !== "poster" && !questions[q.ko ?? key(q.q, q.o)] && !q.enFix);
const total = Object.keys(BANK.byId).length;
console.log(`Preguntas: ${total - pending.length}/${total} traducidas`);
for (const q of pending.slice(0, 20)) console.log(`  ✗ [${q.cat}] ${q.q}`);
if (pending.length > 20) console.log(`  … y ${pending.length - 20} más`);
if (process.argv.includes("--pending")) {
  const file = path.join(root, "node_modules/.cache/i18n-pending.json");
  fs.writeFileSync(file, JSON.stringify(pending.map((q) => ({ k: key(q.q, q.o), cat: q.cat, q: q.q, o: q.o })), null, 1));
  console.log(`  → ${path.relative(root, file)}`);
}

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : /\.tsx?$/.test(e.name) ? [path.join(d, e.name)] : []));
const missing = new Set();
for (const f of walk(path.join(root, "src"))) {
  const src = fs.readFileSync(f, "utf8");
  for (const m of src.matchAll(/\bt\("((?:[^"\\]|\\.)*)"/g)) if (!(m[1] in EN)) missing.add(m[1]);
  // text("nombre", "descripción") de src/game/powers.ts
  for (const m of src.matchAll(/\btext\("((?:[^"\\]|\\.)*)", "((?:[^"\\]|\\.)*)"/g)) for (const k of [m[1], m[2]]) if (!(k in EN)) missing.add(k);
}
console.log(`Interfaz: ${missing.size ? `${missing.size} frases sin traducir` : "todo traducido"}`);
for (const s of missing) console.log(`  ✗ ${s}`);
process.exitCode = missing.size ? 1 : 0;
