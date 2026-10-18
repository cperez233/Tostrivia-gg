# Tostrivia

Trivia en español de anime, videojuegos y cultura general. Gira la ruleta, responde 10 preguntas contra el reloj y no rompas la racha. Algunas preguntas suenan antes de verse: el opening empieza con la pantalla tapada y la imagen se revela al responder. Se juega solo o en sala con hasta 10 personas, cada una desde su celular.

- **57 categorías**: cultura general (historia, geografía, ciencia, deportes, cine, música), 24 animes agrupados por año de estreno del anime (clásicos, década de 2010, de 2020 para acá), 25 sagas de videojuegos agrupadas por género (aventura y plataformas, rol, mundo abierto y sandbox, acción, shooters, pelea y MOBA). Anime trae además "Openings" y juegos "OST gaming", donde todas las preguntas suenan.
- **Ruleta**: el filtro (Todo, Anime, Juegos, Cultura) arma los gajos; cada gajo lleva la imagen de su categoría. En Anime siempre sale el gajo de Openings y en Juegos el de OST gaming. En sala, el anfitrión elige el filtro y todos ven la misma rueda.
- **Jugadores**: cada persona elige uno de 12 animales chibi (capibara, shiba, corgi, pug, husky, salchicha, gato naranja, gato negro, siamés, bulldog, panda rojo y ajolote). En una sala no se repite raza: si ya está tomada, le toca la siguiente libre.
- **10 preguntas por partida** (3 fáciles, 4 medias, 3 difíciles), 20 s cada una, 25 s las de video (el reloj arranca cuando empieza a sonar).
- **Puntos**: fácil 100, media 150, difícil 200, más hasta 100 por rapidez. **Racha**: ×1,5 desde 3 aciertos seguidos, ×2 desde 5.
- **Video**: cada pregunta trae su clave de video y su fragmento `s`–`e` en segundos, en tres modos: `audio` (tapado), `blur` (difuminado) y `clip` (visible, con la franja del título tapada).

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

Las imágenes de las categorías son las miniaturas de esos mismos videos oficiales (`i.ytimg.com/vi/ID/...`), cargadas desde YouTube; no hay archivos de imagen de terceros en el repo. Cada categoría dice qué clave usa en `cover` dentro de `src/data/categories.ts` (las claves `cover-*` existen solo para eso).

## Videos: el script de YouTube (solo en tu máquina)

`scripts/fetch-videos.mjs` busca cada clave de `src/data/video-sources.json` con la YouTube Data API v3. Antes de guardar un video comprueba con `videos.list` que `status.embeddable` sea verdadero, que el video sea público, que no tenga restricción de edad, que no esté bloqueado en Colombia y que dure lo razonable. Si un candidato no pasa, lo descarta y prueba el siguiente. Guarda lo que encuentra en `src/data/videos.json`.

```bash
cp .env.example .env              # y pon tu YOUTUBE_API_KEY
npm run videos                    # resuelve las claves que faltan (retoma donde quedó)
npm run videos -- --verify        # revisa que los ids guardados sigan siendo embebibles
npm run videos -- --force naruto-op-bluebird   # vuelve a buscar una clave concreta
```

- La key se lee de `.env`, que está en `.gitignore`, y el script nunca la imprime.
- Cuota: cada búsqueda cuesta 100 unidades y el límite diario por defecto es de 10.000. Si se acaba, el script para solo y la siguiente ejecución sigue donde quedó.
- Las preguntas cuyo video no se ha resuelto se omiten automáticamente; el resto de la categoría sigue funcionando.
- Después de correrlo, haz commit de `src/data/videos.json` y Vercel desplegará los videos nuevos.

### Si un video falla en la web

El reproductor avisa cuando un video no carga: error de YouTube, bloqueo de la red o que no empiece a sonar en 13 s. En ese caso la pregunta se cambia por una de reserva y la partida sigue. Si fallan dos videos en la misma ronda, se asume que YouTube no responde en esa red y el resto de la ronda sigue con preguntas sin video del mismo lado (anime o juegos). Si el navegador bloquea el sonido automático, aparece un botón "Toca para escuchar".

## Salas en grupo

Las salas usan WebRTC con [PeerJS](https://peerjs.com/). La sala vive en el navegador de quien la crea: ese dispositivo corre el motor de la partida y los demás le mandan sus respuestas. No hay base de datos, cuentas ni servidor propio.

- Por defecto se usa el servidor de enlace público de PeerJS (`0.peerjs.com`), que solo sirve para presentar a los navegadores.
- Para usar uno propio, despliega [peerjs-server](https://github.com/peers/peerjs-server) y define `VITE_PEER_HOST`, `VITE_PEER_PORT`, `VITE_PEER_PATH` y `VITE_PEER_SECURE` en Vercel. Añade también ese host a `connect-src` en la CSP de `vercel.json`.
- Solo hay servidores STUN, sin TURN. En algunas redes muy cerradas (ciertas redes corporativas o datos móviles con NAT simétrico) dos dispositivos pueden no llegar a conectarse.

## Estructura

```
src/data/categories.ts      familias, categorías y su portada
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
