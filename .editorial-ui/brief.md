# Brief (editorial-ui)

Project: Tostrivia-gg
Page: home + juego + sala (app de trivia)
Date: 2026-10-18

## Direction (step 2)
World: revista shōnen semanal impresa: papel prensa, tinta negra, tramas de semitono (screentone), líneas cinéticas, viñetas con borde grueso, onomatopeyas, el sello hanko del editor.
Palette: bg #EEEEEA, ink #0D0D0D, accent #E2401C
Display font: Dela Gothic One (gótica japonesa pesada, se lee como onomatopeya de manga)
Text font: Zen Kaku Gothic New (gótica japonesa de texto, Latin limpio)
Navigation: Split top bar → compact on scroll (logo-sello a la izquierda, "Jugar en grupo" y "Unirse a sala" a la derecha); en celular barra compacta con un solo botón de sala
Hero content: la ruleta misma (herramienta), una viñeta circular entramada que se gira
Composition: Tool because lo primero que hace quien llega es girar la ruleta y el resultado (la categoría) es el protagonista; rejected Cover (no hay una escena propia que mostrar), Type window (el nombre no dice nada del juego), Index list (queda como sección de categorías debajo).
Candidates: 1) Tool: la ruleta-viñeta gira bajo un titular corto y el sector ganador se sella en bermellón; 2) Index list: filas de títulos de anime/juegos en Dela Gothic que muestran su trama detrás; 3) Scatter collage: viñetas inclinadas de distintas categorías apiladas como recortes de revista.
Split test: n/a
Footer composition: An object from the world: el colofón (okuzuke) de un tomo de manga, con título, edición, "impreso en", créditos y el sello
Motif: el sello hanko bermellón (logo, puntero de la ruleta, sello de acierto, puntaje final, colofón, 404)
Name: proper name, because "Tostrivia" es un nombre propio (Tostu + trivia) que no describe el juego; el mundo sale de la actividad (anime, manga, juegos).
Repeats: none (no history)
Previous pages read: none found (repo vacío)
Galleries: skipped because es una app de juego con tema elegido por el usuario (manga/anime); la referencia es el propio medio impreso
Story: Gira la ruleta, responde 10 preguntas contra el reloj (algunas con el opening sonando a ciegas) y compara tu racha con hasta 9 amigos en una sala.

## Facts (step 3)
Given by the user: categorías (cultura general, 16 animes, 7+ juegos), 10 preguntas por partida, 4 opciones, temporizador, racha, puntaje, grupal hasta 10, preguntas de video con start/end, todo en español.
Placeholders to mark: ninguno de negocio; los videos dependen del JSON generado por el script.
Not invented: no hay precios, usuarios, ranking global ni reseñas.

## Flags
Flags: interactive, error-pages
