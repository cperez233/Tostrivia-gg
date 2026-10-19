# Tostrivia

Trivia en español de anime, videojuegos, series, películas y cultura general. Gira la ruleta, responde 10 preguntas contra el reloj y no rompas la racha. Algunas preguntas suenan antes de verse: el opening empieza con la pantalla tapada y la imagen se revela al responder. Se juega solo o en sala con hasta 10 personas, cada una desde su celular.

- **139 categorías y más de 5.200 preguntas (235 con video)**: 49 de anime (con Openings y "Adivina el póster"), 44 de videojuegos (con OST gaming y "Adivina la portada"), 40 de series y películas (con "Adivina la serie o película por su póster") y 6 de cultura general. En Openings y OST gaming todas las preguntas suenan. Hay 1.000 preguntas nuevas con su versión en inglés (se escriben en `content/`, ver más abajo).
- **Ruleta**: el filtro (Todo, Anime, Juegos, Series y pelis, Cultura) arma los gajos; cada gajo lleva el póster de su categoría. En Anime siempre sale Openings y en Juegos, OST gaming. En sala, el anfitrión elige el filtro y todos ven la misma rueda.
- **Jugadores**: cada persona elige uno de 12 animales chibi (capibara, shiba, corgi, pug, husky, salchicha, gato naranja, gato negro, siamés, bulldog, panda rojo y ajolote). En una sala no se repite raza: si ya está tomada, le toca la siguiente libre.
- **Varias categorías a la vez**: en Categorías, "Varias a la vez" deja marcar las que quieras (por ejemplo JoJo, Breaking Bad y Deportes) y salen preguntas de todas, intercaladas. Cada pestaña tiene su versión al azar (Anime al azar, Videojuegos al azar…) y hay un "Todo al azar". En sala, el anfitrión elige con el mismo explorador (pestañas, al azar y "Varias a la vez") en una hoja a pantalla completa. Los ids viajan como texto (`azar-anime`, `mix-breakingbad.deportes.jojo`) y se resuelven en `src/game/mix.ts`.
- **En grupo**: marcador en vivo (al lado en pantalla grande, en una franja fija arriba en celular) con quién ya respondió y lo que sumó cada uno; chat y emotes que pasan por el anfitrión (`src/components/ChatDock.tsx`, protocolo en `src/net/client.ts`); y al final un podio que se arma de a uno (`src/game/Ceremony.tsx`) con "Jugar otra" y "Cambiar categoría".
- **Sin repeticiones**: dentro de una categoría no vuelve a salir una pregunta hasta que hayan salido todas; el historial queda guardado en el navegador (`src/lib/history.ts`). En sala cuenta el del anfitrión.
- **Personalizador de partidas** (`src/components/MatchSetup.tsx`, reglas en `src/game/rules.ts`): debajo de Estándar/Locura, "Personalizar" (botón grande, con fichas que muestran las reglas y un panel que se despliega) abre las reglas. Por defecto, 10 preguntas (3 fáciles, 4 medias, 3 difíciles), 20 s cada una y 25 s las de video (el reloj arranca cuando empieza a sonar).
  - **Preguntas**: 5, 10, 15, 20 o 30. Si la categoría tiene menos, la ronda queda del tamaño de la categoría.
  - **Tiempo por pregunta**: 10, 15, 20, 30 o 45 s (las de video, 5 s más).
  - **Multiplicador de puntos**: ×1, ×1,5, ×2, ×3 o ×5 sobre lo que gana cada acierto (los poderes suman y restan lo que dice su carta).
  - **Dificultad**: mixta (30 % fáciles, 40 % medias, 30 % difíciles, de menos a más) o solo fáciles, medias o difíciles (si no alcanzan, se completa con las otras).
  - **Racha**: multiplica (como siempre) o sin racha (cada acierto vale lo mismo; en Poderes la racha sigue contando para ganar poderes).
  - Las temáticas se eligen como siempre: la ruleta, una categoría o "Varias a la vez" en Categorías y en la sala. Al jugar solo, lo elegido se recuerda en el navegador; en sala lo elige el anfitrión, viaja en la foto del estado y los invitados ven el resumen.
- **Azar**: semillas, ruleta, dados y poderes usan el generador criptográfico del navegador (`random()` en `src/lib/rng.ts`). La ruleta recuerda los últimos 6 giros: la que acaba de salir casi nunca repite y las recientes pesan menos (`makeSpin` en `src/game/deck.ts`); también varía cuántas vueltas da. Dentro de cada dificultad las preguntas salen en orden al azar sin sesgo, y los poderes que ya tienes en la mano salen menos.
- **Puntos**: fácil 100, media 150, difícil 200, más hasta 200 por rapidez. **Racha**: ×1,25 con 2 aciertos seguidos, ×1,5 desde 3, ×2 desde 5 y ×3 desde 8.
- **Modos**: Estándar (la partida de siempre) o Locura (el modo con poderes). Se elige en la ruleta y en Categorías al jugar solo (queda recordado en el navegador), y en sala lo elige el anfitrión.
- **Locura y sus poderes** (al estilo Mario Party y Mario Kart): cada jugador arranca con 1 al azar, gana uno cada vez que su racha llega a 3, 6, 9 y uno de consuelo tras fallar tres seguidas (máximo 3 en la mano, como en Mario Kart). En grupo, al que va en la mitad de abajo le salen más seguido los fuertes (caparazón azul, rayo, estrella, Boo, Cambiazo). Se usa uno por pregunta, antes de responder; el Bloque ? no gasta el turno. El puntaje nunca baja de 0. Todos los textos están en `src/game/powers.ts`.
  - ✂️ **50/50**: tacha dos opciones malas.
  - 🎰 **Doble o nada**: ×2 si aciertas, −300 si fallas.
  - 🎲 **Dado**: +100 por punto del dado si aciertas, −50 por punto si fallas.
  - 🍄 **Hongo**: el bono por rapidez sube de 200 a 500.
  - ⭐ **Estrella**: ×2 si aciertas y ningún ataque te toca.
  - 🛡️ **Escudo**: si fallas no pierdes la racha y te cubre de ataques.
  - ❓ **Bloque ?**: te da dos poderes al azar.
  - 🔄 **Cambio** (solo): cambia la pregunta por otra sin video, de la misma dificultad si hay.
  - 👻 **Boo** (grupo): si aciertas, le robas 400 al que va primero.
  - 🔴 **Caparazón rojo** (grupo): −400 al que va justo delante de ti.
  - 🔵 **Caparazón azul** (grupo): −600 al primero; si el primero eres tú, te pega a ti.
  - ⚡ **Rayo** (grupo): −200 a todos los demás.
  - 🦑 **Tinta** (grupo): tapa las opciones de los demás durante 5 s.
  - 😱 **Susto** (grupo): un screamer de un juego de terror (FNAF, Poppy Playtime, Granny, Baldi, Doors, Slender…) a pantalla completa y con sonido en la pantalla de los demás, unos segundos después de usarlo. Los videos salen de YouTube como los de las preguntas: las claves `scare-*` de `src/data/video-sources.json` se resuelven con `npm run videos:sin-key` y solo se usan las que quedaron verificadas. Si no hay ninguna o el video no alcanza a cargar, sale el susto propio (cara, chillido sintetizado y vibración).
  - 🌀 **Revoltijo** (grupo): las opciones de los demás cambian de lugar cada segundo durante 6 s.
  - 🙃 **De cabeza** (grupo): la pantalla de los demás se voltea 6 s.
  - 🔁 **Cambiazo** (grupo): cambias tu puntaje con el que va justo delante de ti (al final de la pregunta).
  - 🍌 **Plátano** (grupo): el primero que responda después de que lo tiras pierde 300.
  - 🔦 **Apagón** (grupo): la pantalla de los demás se va a negro y solo ven con una linterna que sigue el dedo, 7 s.
  - 🪞 **Espejo** (grupo): la pantalla de los demás se ve al revés de izquierda a derecha, 7 s.
  - 🫨 **Terremoto** (grupo): la pantalla de los demás tiembla 6 s.
  - 🐜 **Hormiga** (grupo): las opciones de los demás se encogen, 7 s.
  - 🌫️ **Niebla** (grupo): los demás ven todo borroso, 6 s.
  - 😵‍💫 **Mareo** (grupo): la pantalla de los demás da vueltas, 6 s.
  - 🎉 **Fiesta** (grupo): lluvia de confeti y globos con corneta en la pantalla de los demás, 6 s.
  - 🔤 **Trabalenguas** (grupo): las letras de cada palabra de las opciones se revuelven, 7 s.
  - 💡 **Corto circuito** (grupo): la pantalla de los demás parpadea, 6 s.
- **Qué tan seguido sale cada poder**: los más fuertes son raros. Caparazón azul y Cambiazo pesan 1; Boo, Estrella, Bloque ? y Rayo, 2; Doble o nada, Caparazón rojo, Susto, Niebla, Mareo, Fiesta, Trabalenguas y Corto circuito, 3; el resto, 4 (`WEIGHT` en `src/game/powers.ts`).
- **Preguntas que no son solo texto** (`src/components/Visuals.tsx`, tipos en `src/data/types.ts`):
  - **Emojis**: los emojis de la primera línea de la pregunta se sueltan uno a uno ("🦁👑🌅 ¿Qué película es?").
  - **Frases en globo de cómic**: "¿Quién lo dijo?" con la frase en un globo.
  - **Adivina el póster / la portada**: una categoría por lado (anime, juegos, series y películas) armada con las portadas que ya hay. Cada póster sale tres veces: borroso, pixelado o un detalle que se aleja, y se va aclarando mientras corre el reloj (sin llegar a mostrar el título impreso); al responder se ve entero. Se arman solas en `src/data/bank/index.ts` y se traducen solas.
- **Video**: cada pregunta trae su clave de video y su fragmento `s`–`e` en segundos, en tres modos: `audio` (tapado), `blur` (difuminado, se va aclarando con el reloj sin llegar a ser ilegible) y `clip` (visible, con la franja del título tapada).

## Agregar preguntas

Las preguntas nuevas se escriben una sola vez, en español y en inglés, en `content/*.mjs`:

```js
[1, "¿Quién es el protagonista de Dr. Stone?", "Senku Ishigami", "Taiju Oki", "Tsukasa Shishio", "Gen Asagiri",
  ["Who is the protagonist of Dr. Stone?", null, null, null, null]],   // null = igual que en español
```

La última posición puede ser un video (`{ k, m, s, e }`) o una clase visual (`{ v: "emoji" }`, `{ v: "quote" }`). `npm run content` escribe `src/data/bank/c-*.ts` (lo que usa el juego) y suma las traducciones a `src/i18n/questions.en.json`. Una categoría nueva se agrega en `src/data/categories.ts` con su póster en `src/assets/covers`.

## Correr en local

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # verificación de tipos + build de producción en dist/
npm run check:bank   # cuenta preguntas por categoría y avisa de problemas
```

## Desplegar en Vercel

El repo ya trae `vercel.json` (framework Vite, salida `dist`, reescritura SPA para `/sala/CODIGO` y `/jugar/categoria`, y cabeceras de seguridad con CSP).

1. Importa el repo en Vercel. No hace falta ninguna variable de entorno.
2. Deploy.

La web en producción **no lleva ninguna API key**. Solo reproduce, con el IFrame Player de YouTube, los `videoId` ya verificados que están en `src/data/videos.json`.

Las portadas son el póster, la carátula o el arte de caja oficial de cada serie, película o juego, recortados a 2:3 y guardados en `src/assets/covers` (600×900 y 300×450 en WebP). De dónde salió cada una está en `src/assets/covers/FUENTES.md`.

## Videos: el script de YouTube (solo en tu máquina)

`scripts/fetch-videos.mjs` busca cada clave de `src/data/video-sources.json` con la YouTube Data API v3. Antes de guardar un video comprueba con `videos.list` que `status.embeddable` sea verdadero, que el video sea público, que no tenga restricción de edad, que no esté bloqueado en Colombia y que dure lo razonable. Si un candidato no pasa, lo descarta y prueba el siguiente. Guarda lo que encuentra en `src/data/videos.json`.

```bash
cp .env.example .env              # y pon tu YOUTUBE_API_KEY
npm run videos                    # resuelve las claves que faltan (retoma donde quedó)
npm run videos -- --verify        # revisa que los ids guardados sigan siendo embebibles
npm run videos -- --force naruto-op-bluebird   # vuelve a buscar una clave concreta
npm run videos:sin-key            # sin API key: busca en YouTube y revisa la página /embed/ (no ve bloqueos por país)
npm run videos:sin-key -- --all   # revisa todas las claves, cambia las que ya no se dejan insertar y guarda 2 de respaldo
```

- La key se lee de `.env`, que está en `.gitignore`, y el script nunca la imprime.
- Cuota: cada búsqueda cuesta 100 unidades y el límite diario por defecto es de 10.000. Si se acaba, el script para solo y la siguiente ejecución sigue donde quedó.
- Las preguntas cuyo video no se ha resuelto se omiten automáticamente; el resto de la categoría sigue funcionando.
- Cada clave puede traer videos de respaldo (`alt` en videos.json). Si YouTube no deja reproducir el principal (las disqueras suelen bloquear la inserción), el reproductor prueba el siguiente antes de cambiar la pregunta. En Openings y OST gaming la partida insiste hasta 4 fallos antes de pasar a preguntas sin video.
- Después de correrlo, haz commit de `src/data/videos.json` y Vercel desplegará los videos nuevos.

### Lo que se ve en el centro de notificaciones

En el celular, el reproductor de YouTube publica el título del video en el centro de notificaciones y en la pantalla de bloqueo (o sea, la respuesta). Mientras hay un video en la partida, la página publica su propia ficha genérica ("Tostrivia · ???") con la Media Session API (`src/lib/mediaSession.ts`). Es lo mejor que deja hacer el navegador: el reproductor vive en un iframe y cada navegador decide qué ficha muestra, así que puede no taparlo del todo en algunos celulares.

### Si un video falla en la web

El reproductor avisa cuando un video no carga: error de YouTube, bloqueo de la red o que no empiece a sonar en 13 s. En ese caso la pregunta se cambia por una de reserva y la partida sigue. Si fallan dos videos en la misma ronda, se asume que YouTube no responde en esa red y el resto de la ronda sigue con preguntas sin video del mismo lado (anime o juegos). Si el navegador bloquea el sonido automático, aparece un botón "Toca para escuchar".

## Salas en grupo

Las salas usan WebRTC con [PeerJS](https://peerjs.com/). La sala vive en el navegador de quien la crea: ese dispositivo corre el motor de la partida y los demás le mandan sus respuestas. No hay base de datos, cuentas ni servidor propio.

- Por defecto se usa el servidor de enlace público de PeerJS (`0.peerjs.com`), que solo sirve para presentar a los navegadores.
- Para usar uno propio, despliega [peerjs-server](https://github.com/peers/peerjs-server) y define `VITE_PEER_HOST`, `VITE_PEER_PORT`, `VITE_PEER_PATH` y `VITE_PEER_SECURE` en Vercel. Añade también ese host a `connect-src` en la CSP de `vercel.json`.
- Solo hay servidores STUN, sin TURN. En algunas redes muy cerradas (ciertas redes corporativas o datos móviles con NAT simétrico) dos dispositivos pueden no llegar a conectarse.

## Estructura

```
src/data/categories.ts      familias y categorías
src/assets/covers/          póster de cada categoría (FUENTES.md dice de dónde salió)
src/lib/history.ts          historial de preguntas vistas por categoría
src/data/bank/*.ts          preguntas: [dificultad, pregunta, correcta, mala, mala, mala, media?]
src/data/video-sources.json clave de video -> búsqueda para el script
src/data/videos.json        clave -> videoId verificado (lo escribe el script)
src/game/match.ts           motor de partida (solo y grupo)
src/game/deck.ts            gajos de la ruleta según el filtro
src/components/Avatar.tsx   los 12 animales (calcomanías en src/assets/animals)
src/net/client.ts           solo, anfitrión e invitado (PeerJS)
src/components/MediaStage   reproductor de fragmentos con modo audio, blur y clip
scripts/fetch-videos.mjs    búsqueda y verificación de videos (local)
```

Juego de fans sin afiliación. Los nombres de series, juegos, canciones y personajes son de sus dueños; los videos se reproducen desde YouTube con su reproductor oficial.
