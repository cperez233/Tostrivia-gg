#!/usr/bin/env node
/* editorial-ui · Cristian Pérez · cristianperez.me
 * Preguntas nuevas: se escriben una sola vez, en español y en inglés, en content/*.mjs:
 *   [dificultad, pregunta, correcta, mala, mala, mala, [pregunta EN, correcta EN, mala EN, mala EN, mala EN], extra?]
 * En la traducción, null en una opción quiere decir "igual que en español" (nombres propios).
 * `extra` es el video ({k, m, s, e}) o la clase de pregunta visual ({v: "emoji"} o {v: "quote"}).
 * Este script escribe src/data/bank/c-<archivo>.ts (lo que usa el juego) y suma las traducciones a
 * src/i18n/questions.en.json (la clave es la misma de questionKey() en src/i18n/index.ts).
 *   node scripts/build-content.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "content");
const enFile = path.join(root, "src/i18n/questions.en.json");

function key(q, o) {
  let h = 2166136261;
  for (const ch of [q, ...o].join("|")) h = Math.imul(h ^ ch.codePointAt(0), 16777619) >>> 0;
  return h.toString(36);
}

const en = JSON.parse(fs.readFileSync(enFile, "utf8"));
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mjs")).sort();
let problems = 0;
let total = 0;
const warn = (m) => {
  problems++;
  console.log("  ✗ " + m);
};
const seenKeys = new Map();

for (const f of files) {
  const { default: content } = await import(pathToFileURL(path.join(dir, f)).href);
  const out = {};
  for (const [cat, rows] of Object.entries(content)) {
    out[cat] = [];
    for (const row of rows) {
      const [d, q, a, b, c, e, tr, extra] = row;
      const label = `${f}:${cat}: ${String(q).slice(0, 50)}`;
      const o = [a, b, c, e];
      if (![1, 2, 3].includes(d)) warn(`${label}: dificultad ${d}`);
      if (o.some((x) => typeof x !== "string" || !x.trim())) warn(`${label}: opción vacía`);
      if (new Set(o.map((x) => String(x).trim().toLowerCase())).size !== 4) warn(`${label}: opciones repetidas`);
      if (!Array.isArray(tr) || tr.length !== 5) {
        warn(`${label}: falta la traducción`);
        continue;
      }
      const k = key(q, o);
      if (seenKeys.has(k)) warn(`${label}: repetida (${seenKeys.get(k)})`);
      seenKeys.set(k, label);
      en[k] = [tr[0], ...o.map((x, i) => tr[i + 1] ?? x)];
      out[cat].push(extra ? [d, q, a, b, c, e, extra] : [d, q, a, b, c, e]);
      total++;
    }
  }
  const name = "c-" + f.replace(/\.mjs$/, "");
  const lines = Object.entries(out).map(([cat, rows]) => `  ${cat}: [\n${rows.map((r) => "    " + JSON.stringify(r) + ",").join("\n")}\n  ],`);
  fs.writeFileSync(
    path.join(root, "src/data/bank", name + ".ts"),
    `/* editorial-ui · Cristian Pérez · cristianperez.me
 * Generado por scripts/build-content.mjs a partir de content/${f}: no se edita a mano.
 * Formato: [dificultad, pregunta, correcta, mala, mala, mala, media o visual?]
 */
import type { RawQuestion } from "../types";

const bank: Record<string, RawQuestion[]> = {
${lines.join("\n")}
};

export default bank;
`,
  );
  console.log(`${f}: ${Object.values(out).reduce((n, l) => n + l.length, 0)} preguntas → src/data/bank/${name}.ts`);
}
fs.writeFileSync(enFile, JSON.stringify(en));
console.log(`Total: ${total}${problems ? ` · ${problems} problemas` : ""}`);
process.exit(problems ? 1 : 0);
