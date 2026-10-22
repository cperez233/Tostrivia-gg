# Tostrivia · verificar y completar categorías (RONDA 3)

Juego de trivia en español (Colombia). El dueño exige **datos 100 % correctos**: un dato dudoso es peor que no tener pregunta.
Solo tocas los archivos que se te indican. NO hagas git, NO ejecutes `npm run …`, NO edites otros archivos del repo.

## Cómo leer fuentes (sin gastar búsquedas)
Usa la herramienta local, que lee Wikipedia/otros sitios como texto (cachea en /tmp/wpcache):
```
node content/pending/tools/wp.mjs search en "bocchi the rock"            # títulos de Wikipedia que coinciden
node content/pending/tools/wp.mjs page en "Bocchi the Rock!"               # texto de una página (en o es)
node content/pending/tools/wp.mjs page en "List of Bocchi the Rock! episodes"  # resúmenes episodio por episodio
node content/pending/tools/wp.mjs url "https://stardewvalleywiki.com/Abigail"  # otras URLs abiertas
```
- Páginas largas: redirige a un archivo y léelo por partes (`> /tmp/x.txt`, luego Read con offset/limit o `grep -n`). No vuelques 60 000 caracteres de una vez; busca la sección que necesitas (Plot, Characters, Episodes, Gameplay…).
- Fuentes que abren: en/es.wikipedia.org (la principal: trama, lista de personajes, lista de episodios, "Plot" de videojuegos), stardewvalleywiki.com, hollowknight.wiki, myanimelist.net (`url` con la ruta completa; necesitas el ID). Fandom, wiki.gg, tvtropes, IMDb, ANN: bloqueados.
- WebSearch existe pero es escaso y compartido entre todos los agentes: úsalo solo para encontrar un título/ID que `wp.mjs search` no halla (máx. 2 por categoría).
- Los datos que no estén en una fuente que LEÍSTE se borran. Nada de "creo que es así".

## Tu encargo
Tu archivo de encargo (`brief-N.txt` en la ruta que te den) lista, por categoría: lo que ya hay activo en el juego (para no repetir), las filas **pendientes** de verificar (escritas de memoria; vienen como arreglos JS listos para copiar) y cuántas faltan para 50.
Para cada categoría:
1. Lee las fuentes (1-3 páginas suelen bastar: trama/personajes/episodios).
2. Revisa cada fila pendiente contra lo leído: correcta Y que ninguna mala también sea correcta. Si es correcta y de buen nivel → cópiala a tu fill. Si el dato está mal pero la idea sirve → corrígela. Si no se puede confirmar → no la copies (queda fuera).
3. Escribe preguntas NUEVAS, solo de lo que leíste, hasta llegar a **≥ 50 activas** (apunta a 51-52). Si no logras 50 verificadas, deja las que sí y dilo en tu respuesta; no rellenes con dudosas.
4. Si ves una pregunta ya ACTIVA claramente falsa/ambigua/con dos respuestas, retírala (ver «drop») y repón la cuenta.

## Archivos que escribes
- `content/fill-rN.mjs` (N = tu número): filas nuevas + pendientes rescatadas. Formato:
```js
const N = null;
export default {
  idcategoria: [
    [dificultad, "Pregunta", "Correcta", "Mala", "Mala", "Mala", ["Question EN", "Correct EN", "Wrong EN", "Wrong EN", "Wrong EN"]],
  ],
};
```
  La correcta SIEMPRE primera (el juego baraja). `N` en la traducción = igual que en español. Traducción inglesa obligatoria (array de 5).
- `src/data/bank/drop/rN.json` solo si retiras activas: `{ "ids": ["cat-xxxx"] }`.
- Revisión de formato: `node content/pending/tools/lint.mjs content/fill-rN.mjs src/data/bank/drop/rN.json` → proyecta el conteo por categoría y avisa de soplos, repetidas y opciones raras. Déjalo sin avisos (un aviso que sea falso positivo se justifica en tu respuesta final).
- `node --check content/fill-rN.mjs` debe pasar.
Guarda el archivo conforme avanzas (por si te cortan).

## Estilo (que suene HUMANO)
- Cortas, de fan a fan (ideal ≤ 90 caracteres, máx. 120). Varía los arranques: «¿Quién…», «¿Qué pasa cuando…», «¿Por qué…», «¿Cómo…», «¿Dónde…», «¿Cuántos…», «¿Con qué…», «¿A quién…», «¿Qué…». «¿Cómo se llama…?» y «¿Qué personaje…?» en máx. ~20 %.
- Sobre lo que PASA en la obra (trama, personajes, lore, mecánicas, escenas famosas). Máx. 2 preguntas «meta» por categoría (estudio, año, actor, compositor).
- La respuesta (ni su raíz) NO aparece en el enunciado; el enunciado no la describe tanto que sobren las opciones.
- Distractores del mismo tipo y largo parecido, plausibles y de la misma obra. NINGUNO puede ser también correcto. Nada de relleno ni de otra obra.
- No dependas de diferencias manga/anime/novela sin decirlo en el enunciado («en el anime…»). No uses datos que cambien con el tiempo (récords, clasificaciones, «el más reciente»).
- Sin redundancias: no dos preguntas que se contesten con el mismo dato, ni que una delate la respuesta de otra.
- Nombres en español como los usa el público latino (doblaje) cuando lo confirmas (p. ej. en es.wikipedia); si no, el nombre original.
- Dificultad: 1 = la sabe cualquiera que vio/jugó la obra; 2 = la sabe quien la siguió con atención; 3 = detalle que solo un fan recuerda (sin ser arbitrario). Las NUEVAS reparte aprox. **20 % / 45 % / 35 %** (hay muchas fáciles ya; faltan medias y difíciles). Evita fáciles estúpidas («¿cómo se llama el protagonista?»).

## Respuesta final (breve)
Por categoría: pendientes rescatadas / corregidas / descartadas, nuevas añadidas, conteo final proyectado, activas retiradas; y qué quedó sin poder verificar o dudas para el dueño.
