# Tostrivia: verificar datos y completar categorías a 50 preguntas (RONDA 2)

Repo: /home/claude/tostrivia-gg (juego de trivia en español). El dueño exige: **los datos deben ser 100 % correctos**. Una pregunta con un dato dudoso es peor que no tener pregunta. NO hagas git commit/push, NO ejecutes `npm run content`/build/typecheck. Solo tocas los archivos listados abajo.

Tu agente es el número N (te lo dicen en el encargo). Tu archivo de trabajo con lo que hay hoy en tus categorías:
`/tmp/claude-0/-home-claude/39116402-d613-5ab6-99f0-dd320e16e13e/scratchpad/plot/cur-N.txt`
Formato: `- [P] id | pregunta => correcta (mal: a / b / c)`.
- `[P]` = pregunta nueva escrita de MEMORIA por un agente anterior en `content/plot-pN.mjs` (sin verificar o verificada a medias). Tu primera prioridad es verificarlas TODAS.
- `[ ]` = pregunta que ya existía (en su mayoría auditada). No hace falta verificarlas todas, pero si al leerlas ves una claramente falsa, ambigua o con dos respuestas posibles, retírala (ver abajo).

## Tarea 1 · Verificar las `[P]` de tus categorías
Para cada categoría, busca fuentes y confirma cada dato (correcta Y que ningún distractor también sea correcto).
- Fuentes: WebSearch → luego WebFetch de los enlaces que salgan en los resultados (Wikipedia en inglés/español, wikis de Fandom, páginas oficiales). WebFetch solo abre URLs que aparecieron en resultados de WebSearch o que ya estén permitidas; si una URL da `URL_NOT_ON_ALLOWLIST`, busca otra vía, no repitas la misma. Truco de eficiencia: abre UNA página de trama/lista de personajes y verifica muchas preguntas con ella (pregunta a WebFetch con un prompt que enumere los datos que necesitas).
- Si un dato es **incorrecto** → corrige la fila en `content/plot-pN.mjs` (o bórrala si no se puede arreglar bien).
- Si un dato **no se puede confirmar** con una fuente → **BORRA la fila**. No hay "creo que es así".
- Cuida los nombres en español: usa el que usa el público hispano (doblaje latino o España). Si no puedes confirmar el nombre en español, usa el nombre original o reformula para evitarlo.
- Edita `content/plot-pN.mjs` directamente (Edit). Mantén `node --check` verde.

## Tarea 2 · Llegar a ≥ 50 preguntas por categoría
Cada categoría tiene en su encabezado cuántas "faltan para llegar a 50", pero OJO: cada fila de `[P]` que borres o `[ ]` que retires resta, y hay que reponerla. Meta: **cada una de tus categorías termina con ≥ 50 preguntas activas** (apunta a 52 por margen). El script de comprobación (abajo) te proyecta el conteo.
- Crea `content/fill-fN.mjs` con las preguntas nuevas (mismo formato que plot-pN, ver abajo).
- **No inventes ni rellenes por rellenar.** Cada pregunta nueva debe estar confirmada en una fuente que hayas leído. Prefiere temas de trama/personajes/lore/mecánicas que un fan responde de memoria. No repitas lo que ya hay (ni parecido: revisa tu cur-N.txt completo antes de escribir cada una).
- Si de verdad no logras verificar suficientes para llegar a 50 en una categoría, deja lo que sí verificaste y dilo en tu respuesta final; no rellenes con dudosas.

## Retirar preguntas viejas incorrectas (solo `[ ]`)
Crea/edita `src/data/bank/drop/fN.json` con `{ "ids": ["cat-xxxx", ...] }` (los ids salen en cur-N.txt). Si la idea de la pregunta vale pero el dato estaba mal, escribe la versión correcta en tu `fill-fN.mjs`.

## Estilo (que suene HUMANO) y reglas anti-soplo
- Pregunta corta, de fan a fan (ideal ≤ 90 caracteres, máx. 120). A veces menos es más. Varía arranques: «¿Quién…», «¿Qué pasa cuando…», «¿Por qué…», «¿Cómo…», «¿Dónde…», «¿Cuántos…», «¿Con qué…», «¿A quién…». Evita «¿Cómo se llama…?» y «¿Qué personaje…?» en masa (máx. ~20 % de tus preguntas).
- La respuesta (ni su raíz) NO puede aparecer en el enunciado. No describas la respuesta tan bien que sobren las opciones.
- Distractores del MISMO tipo y de largo parecido, plausibles, de la misma obra, y ninguno puede ser también correcto. Nada de relleno ni de otra obra.
- Correcta SIEMPRE primera en la fila (el juego baraja). Dificultad ~30 % 1, ~40 % 2, ~30 % 3. Evita trivialidades («¿cómo se llama el protagonista?») y preguntas «meta» (estudio, año, actor de voz): máx. 2 por categoría.
- Sin redundancias: no dos preguntas que se respondan con el mismo dato, ni que una pregunta delate la respuesta de otra.

## Formato de content/fill-fN.mjs
```js
const N = null;
export default {
  idcategoria: [
    [dificultad, "Pregunta", "Correcta", "Mala", "Mala", "Mala", ["Question EN", "Correct EN", "Wrong EN", "Wrong EN", "Wrong EN"]],
  ],
};
```
Traducción inglesa obligatoria (array de 5; `N` donde la opción es igual que en español). Opciones sin repetir dentro de la pregunta.

## Antes de terminar
1. `node --check content/plot-pN.mjs content/fill-fN.mjs` (si existen).
2. `node /tmp/claude-0/-home-claude/39116402-d613-5ab6-99f0-dd320e16e13e/scratchpad/plot/chk.mjs N` → debe decir "OK" en todas tus categorías (≥ 50) y sin avisos (los falsos positivos por palabras genéricas como «ciudad», «magia», «demonio» puedes ignorarlos si de verdad no soplan nada).
3. Relee cada pregunta nueva: ¿suena humana?, ¿regala la respuesta?, ¿alguna mala podría ser correcta?, ¿la verificaste?
4. Trabaja por categorías y guarda el archivo conforme avanzas (por si te cortan el límite de uso).

RESPUESTA FINAL breve: por categoría → cuántas `[P]` verificadas / corregidas / borradas, cuántas nuevas añadiste, conteo final; y lista corta de lo que quedó sin poder verificar o cualquier duda que el dueño deba mirar.
