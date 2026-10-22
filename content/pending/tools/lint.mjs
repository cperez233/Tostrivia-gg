#!/usr/bin/env node
/* Revisa un fill-rN.mjs sin tocar el juego:  node content/pending/tools/lint.mjs content/fill-r1.mjs [drop.json]
 * Proyecta el conteo por categoría (activas - retiradas + nuevas) y avisa de formato, soplos y repetidas. */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
const W = process.env.WORK || "/tmp/claude-0/-home-user-Tostrivia-gg/1e8a84a4-7119-5f83-941d-b8e99ebcb592/scratchpad/work";
const bank = JSON.parse(fs.readFileSync(W + "/bank.json", "utf8"));
const [file, dropFile] = process.argv.slice(2);
const { default: c } = await import(pathToFileURL(path.resolve(file)).href);
const drop = new Set(dropFile && fs.existsSync(dropFile) ? JSON.parse(fs.readFileSync(dropFile, "utf8")).ids : []);
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const words = (s) => new Set(norm(s).split(" ").filter((w) => w.length > 3));
const jac = (a, b) => { let i = 0; for (const w of a) if (b.has(w)) i++; return i / (a.size + b.size - i || 1); };
let bad = 0;
for (const [cat, rows] of Object.entries(c)) {
  const b = bank[cat];
  if (!b) { console.log(`✗ categoría desconocida: ${cat}`); bad++; continue; }
  const act = b.active.filter((q) => !drop.has(q.id));
  const dist = [1, 2, 3].map((d) => rows.filter((r) => r[0] === d).length);
  const total = act.length + rows.length;
  console.log(`${total >= 50 ? "OK " : "FALTAN " + (50 - total) + " "}${cat}: activas ${b.active.length} - retiradas ${b.active.length - act.length} + nuevas ${rows.length} = ${total}  (f/m/d nuevas ${dist.join("/")})`);
  const seen = [];
  for (const r of rows) {
    const [d, q, a, x, y, z, tr] = r;
    const w = (m) => { console.log(`   ✗ ${String(q).slice(0, 60)}: ${m}`); bad++; };
    if (![1, 2, 3].includes(d)) w("dificultad");
    const o = [a, x, y, z];
    if (o.some((s) => typeof s !== "string" || !s.trim())) { w("opción vacía"); continue; }
    if (new Set(o.map(norm)).size !== 4) w("opciones repetidas");
    if (!Array.isArray(tr) || tr.length !== 5 || typeof tr[0] !== "string") w("traducción EN mal (array de 5)");
    else if (new Set(o.map((s, i) => norm(tr[i + 1] ?? s))).size !== 4) w("opciones EN repetidas");
    if (q.length > 120) w(`larga (${q.length})`);
    const nq = norm(q);
    const root = norm(a);
    if (root.length >= 4 && (nq.includes(root) || root.split(" ").some((p) => p.length >= 5 && nq.split(" ").some((t) => t === p)))) w(`¿soplo? la pregunta contiene «${a}»`);
    const L = o.map((s) => s.length);
    if (Math.max(...L) > 3 * Math.max(8, Math.min(...L)) + 10) w("opciones de largo muy distinto");
    const wq = words(q);
    for (const old of act) if (jac(wq, words(old.q)) >= 0.6 || (norm(old.o[0]) === root && jac(wq, words(old.q)) >= 0.35)) { w(`parecida a activa ${old.id}: ${old.q}`); break; }
    for (const [pq, pa] of seen) if (jac(wq, words(pq)) >= 0.6 || (pa === root && jac(wq, words(pq)) >= 0.35)) { w(`parecida a otra nueva: ${pq}`); break; }
    seen.push([q, root]);
  }
}
console.log(bad ? `\n${bad} avisos` : "\nSin avisos");
