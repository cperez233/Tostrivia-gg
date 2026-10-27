<div align="center">

# Tostrivia

Spin the wheel and answer against the clock.

Trivia about anime, video games, series, movies and general knowledge. Play solo or with friends, each on their own phone.

English · [Español](#español)

</div>

## What is Tostrivia?

Tostrivia is a trivia game for fans. You spin a wheel, get 10 questions and answer before time runs out. Faster answers and longer streaks earn more points.

It runs in the browser, so there is nothing to download and no account to make. Open it, pick a name and play.

## What you can do

- Let the wheel pick your next round. You can filter it by Anime, Games, Series & Movies or Culture, choose a category yourself, or mix several categories in one round.
- Play over 5,300 questions across 140 categories, from JoJo and Breaking Bad to Zelda, Skyrim and FNAF. Every question is in English and Spanish.
- Guess an anime from its opening or a game from its soundtrack. The picture stays hidden until you answer.
- Guess a series, movie or game from its poster. It starts blurred, pixelated or zoomed in on a tiny corner, and clears up while the clock runs.
- Open a room for up to 10 players. Everyone joins from their own phone with a code, and the room has a live scoreboard, chat, emotes and a podium at the end.
- Play as one of 12 chibi animals, such as a capybara, shiba, corgi, pug, husky or axolotl.
- Set your own rules: number of questions, time per question, difficulty, point multiplier, and whether streaks count.

## Madness mode

Standard mode is classic trivia. Madness is closer to Mario Party and Mario Kart: your streak earns power-ups, and you use them before answering.

| | |
|---|---|
| ✂️ 50/50 | 🎰 Double or nothing |
| ⭐ Star | 🛡️ Shield |
| 🔵 Blue shell | ⚡ Lightning |
| 👻 Boo | 🍌 Banana |
| 🔁 Switcheroo | 🎲 Dice |

In a room, other power-ups hit your friends' screens: they can flip upside down, shake, fill with fog, go black except for a flashlight, scramble the answer options, or get a jump scare. Ultra Madness gives you more power-ups and lets you use two per question.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:5173
```

It is a static web app. It deploys to Vercel without configuration or API keys.

## Contributing

- Questions live in `content/*.mjs`, written once in Spanish and English. `npm run content` turns them into game data.
- `npm run check:bank` counts questions per category and reports problems.
- `npm run videos` finds and verifies the YouTube clips. It needs your own `YOUTUBE_API_KEY` in `.env`.
- Rooms use WebRTC through [PeerJS](https://peerjs.com/), so there is no database or server of our own.

<sub>Fan-made game, not affiliated with any of the works it mentions. Names of series, games, songs and characters belong to their owners. Videos play through YouTube's official player.</sub>

<div align="center">

## Español

Gira la ruleta y responde contra el reloj.

Trivia de anime, videojuegos, series, películas y cultura general. Se juega solo o con amigos, cada quien en su celular.

[English](#tostrivia) · Español

</div>

## ¿Qué es Tostrivia?

Tostrivia es una trivia para fans. Giras una ruleta, te salen 10 preguntas y respondes antes de que se acabe el tiempo. Mientras más rápido contestes y más larga sea tu racha, más puntos sumas.

Funciona en el navegador, así que no hay nada que descargar ni cuenta que crear. Abres la página, eliges un nombre y juegas.

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
