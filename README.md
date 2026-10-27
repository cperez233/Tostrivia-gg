<div align="center">

# 🎡 Tostrivia

**Spin the wheel. Beat the clock. Don't break your streak.**

Anime, video games, series, movies and general knowledge trivia, solo or with friends, straight from your phone.

**🇬🇧 English** · [🇪🇸 Español](#-español)

</div>

---

## ✨ What is Tostrivia?

Tostrivia is a fast, colorful trivia game for fans. Spin the wheel, get 10 questions, and answer before time runs out. The faster you answer and the longer your streak, the more points you score.

No account, no download, no sign-up. Open it, pick a name, and play.

## 🎮 Why you'll love it

- **🎡 A wheel that picks your next round.** Filter by Anime, Games, Series & Movies or Culture, and let luck decide. Or choose a category yourself, or mix several at once.
- **📚 5,300+ questions in 140 categories.** From JoJo and Breaking Bad to Zelda, Skyrim and FNAF. Every question is available in English and Spanish.
- **🎧 Questions you hear before you see.** Guess the anime from its opening, or the game from its OST, with the picture hidden until you answer.
- **🖼️ Guess the poster.** Posters and game covers show up blurred, pixelated or zoomed in on a tiny detail, and clear up as the clock ticks.
- **👥 Rooms for up to 10 players.** Share a code, everyone joins from their own phone, and you get a live scoreboard, chat, emotes and a podium ceremony at the end.
- **🐾 Pick your animal.** 12 chibi pets to play as: capybara, shiba, corgi, pug, husky, axolotl and more.
- **⚙️ Make the rules yours.** Choose the number of questions, the time per question, the difficulty, point multipliers and whether streaks count.

## 🔥 Madness mode

Standard mode is classic trivia. **Madness** turns it into a party, in the spirit of Mario Party and Mario Kart. Earn power-ups with your streak and use them before answering:

| | |
|---|---|
| ✂️ 50/50 | 🎰 Double or nothing |
| ⭐ Star | 🛡️ Shield |
| 🔵 Blue shell | ⚡ Lightning |
| 👻 Boo | 🍌 Banana |
| 🔁 Switcheroo | 🎲 Dice |

...and plenty of ways to mess with your friends' screens: flip them upside down, shake them, fog them up, black them out with a flashlight, scramble their options, or throw a jump scare at them. There's even an **Ultra Madness** mode for when regular chaos isn't enough.

## 🚀 Play it

```bash
npm install
npm run dev      # http://localhost:5173
```

The game is a static web app and deploys to Vercel with no configuration or API keys.

## 🛠️ For contributors

- Questions live in `content/*.mjs`, written once in Spanish and English. Run `npm run content` to turn them into game data.
- `npm run check:bank` reports questions per category and flags problems.
- `npm run videos` finds and verifies the YouTube clips (needs your own `YOUTUBE_API_KEY` in `.env`).
- Rooms use WebRTC through [PeerJS](https://peerjs.com/): no database and no server of our own.

---

<div align="center">

## 🇪🇸 Español

**Gira la ruleta. Gana al reloj. No rompas la racha.**

Trivia de anime, videojuegos, series, películas y cultura general. Solo o con amigos, desde el celular.

[🇬🇧 English](#-tostrivia)

</div>

## ✨ ¿Qué es Tostrivia?

Tostrivia es una trivia rápida y colorida para fans. Giras la ruleta, te salen 10 preguntas y respondes antes de que se acabe el tiempo. Mientras más rápido contestes y más larga sea tu racha, más puntos sumas.

Sin cuentas, sin descargas, sin registro. Abre la página, elige tu nombre y juega.

## 🎮 Por qué te va a gustar

- **🎡 Una ruleta que elige tu próxima ronda.** Filtra por Anime, Juegos, Series y pelis o Cultura y deja que decida la suerte. O elige tú la categoría, o mezcla varias a la vez.
- **📚 Más de 5.300 preguntas en 140 categorías.** De JoJo y Breaking Bad a Zelda, Skyrim y FNAF. Todas están en español y en inglés.
- **🎧 Preguntas que se oyen antes de verse.** Adivina el anime por su opening o el juego por su OST, con la imagen tapada hasta que respondes.
- **🖼️ Adivina el póster.** Pósters y portadas aparecen borrosos, pixelados o con un detalle diminuto, y se van aclarando con el reloj.
- **👥 Salas de hasta 10 jugadores.** Comparte un código, cada quien entra desde su celular y tienen marcador en vivo, chat, emotes y un podio al final.
- **🐾 Elige tu animal.** 12 mascotas chibi para jugar: capibara, shiba, corgi, pug, husky, ajolote y más.
- **⚙️ Arma las reglas a tu gusto.** Cantidad de preguntas, tiempo, dificultad, multiplicador de puntos y si cuenta la racha.

## 🔥 Modo Locura

El modo Estándar es la trivia de siempre. **Locura** la convierte en una fiesta, al estilo Mario Party y Mario Kart. Ganas poderes con tu racha y los usas antes de responder:

| | |
|---|---|
| ✂️ 50/50 | 🎰 Doble o nada |
| ⭐ Estrella | 🛡️ Escudo |
| 🔵 Caparazón azul | ⚡ Rayo |
| 👻 Boo | 🍌 Plátano |
| 🔁 Cambiazo | 🎲 Dado |

...y muchas formas de molestar a tus amigos en pantalla: voltearla, hacerla temblar, llenarla de niebla, apagarla y dejarles solo una linterna, revolverles las opciones o mandarles un susto. Y hay un **Ultra Locura** para cuando el caos normal se queda corto.

## 🚀 A jugar

```bash
npm install
npm run dev      # http://localhost:5173
```

El juego es una web estática y se despliega en Vercel sin configuración ni API keys.

## 🛠️ Para quien quiera colaborar

- Las preguntas están en `content/*.mjs`, escritas una sola vez en español e inglés. `npm run content` las convierte en datos del juego.
- `npm run check:bank` cuenta las preguntas por categoría y avisa de problemas.
- `npm run videos` busca y verifica los videos de YouTube (necesita tu propia `YOUTUBE_API_KEY` en `.env`).
- Las salas usan WebRTC con [PeerJS](https://peerjs.com/): sin base de datos ni servidor propio.

---

<sub>Juego de fans sin afiliación. Los nombres de series, juegos, canciones y personajes son de sus dueños; los videos se reproducen desde YouTube con su reproductor oficial. / Fan-made game, not affiliated. All series, game, song and character names belong to their owners; videos play through YouTube's official player.</sub>
