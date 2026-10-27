<div align="center">

<img src="docs/banner-es.png" alt="Tostrivia" width="100%">

[English](README.md) · **Español**

<img src="https://img.shields.io/badge/preguntas-5300%2B-ff4b1f?style=for-the-badge&labelColor=121110" alt="preguntas 5300%2B">
<img src="https://img.shields.io/badge/categorías-140-ffd23f?style=for-the-badge&labelColor=121110" alt="categorías 140">
<img src="https://img.shields.io/badge/jugadores-hasta%2010-f4f1e8?style=for-the-badge&labelColor=121110" alt="jugadores hasta%2010">

</div>

## ¿Qué es Tostrivia?

Tostrivia es una trivia para fans. Giras una ruleta, te salen 10 preguntas y respondes antes de que se acabe el tiempo. Mientras más rápido contestes y más larga sea tu racha, más puntos sumas.

Funciona en el navegador, así que no hay nada que descargar ni cuenta que crear. Abres la página, eliges un nombre y juegas.

<img src="docs/covers-es.png" alt="Algunas de las 140 categorías" width="100%">

## Qué puedes hacer

- Dejar que la ruleta elija tu próxima ronda. La puedes filtrar por Anime, Juegos, Series y pelis o Cultura, elegir tú la categoría, o mezclar varias en una misma ronda.
- Jugar más de 5.300 preguntas en 140 categorías, de JoJo y Breaking Bad a Zelda, Skyrim y FNAF. Todas están en español y en inglés.
- Adivinar un anime por su opening o un juego por su banda sonora. La imagen queda tapada hasta que respondes.
- Adivinar una serie, película o juego por su póster. Empieza borroso, pixelado o con zoom a una esquina diminuta, y se va aclarando mientras corre el reloj.
- Abrir una sala de hasta 10 jugadores. Todos entran con un código desde su celular, y la sala tiene marcador en vivo, chat, emotes y un podio al final.
- Jugar con uno de 12 animales chibi, como capibara, shiba, corgi, pug, husky o ajolote.
- Armar tus propias reglas: cantidad de preguntas, tiempo por pregunta, dificultad, multiplicador de puntos y si cuenta la racha.

## Modo Locura

El modo Estándar es la trivia de siempre. Locura se parece más a Mario Party y Mario Kart: tu racha te da poderes y los usas antes de responder.

| | |
|---|---|
| ✂️ 50/50 | 🎰 Doble o nada |
| ⭐ Estrella | 🛡️ Escudo |
| 🔵 Caparazón azul | ⚡ Rayo |
| 👻 Boo | 🍌 Plátano |
| 🔁 Cambiazo | 🎲 Dado |

En una sala, otros poderes caen sobre las pantallas de tus amigos: pueden voltearse, temblar, llenarse de niebla, quedar en negro con solo una linterna, revolver las opciones o recibir un susto. Ultra Locura da más poderes y deja usar dos por pregunta.

## Correrlo en local

```bash
npm install
npm run dev      # http://localhost:5173
```

Es una web estática. Se despliega en Vercel sin configuración ni API keys.

## Colaborar

- Las preguntas están en `content/*.mjs`, escritas una sola vez en español e inglés. `npm run content` las convierte en datos del juego.
- `npm run check:bank` cuenta las preguntas por categoría y avisa de problemas.
- `npm run videos` busca y verifica los videos de YouTube. Necesita tu propia `YOUTUBE_API_KEY` en `.env`.
- Las salas usan WebRTC con [PeerJS](https://peerjs.com/), así que no hay base de datos ni servidor propio.

<sub>Juego de fans sin afiliación con ninguna de las obras que menciona. Los nombres de series, juegos, canciones y personajes son de sus dueños. Los videos se reproducen con el reproductor oficial de YouTube.</sub>
