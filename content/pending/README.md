# Preguntas pendientes de verificar

Estas preguntas se escribieron de memoria (sin fuente leída) y **no están en el juego** hasta que se confirmen con una fuente.
- `plot-p8.mjs … plot-p19.mjs`: lotes de trama aún sin verificar (mismas categorías que el plan original).
- `parked/`: filas de los lotes 1-7 que se quitaron por no poder confirmarlas (Bocchi, Yu Yu Hakusho, Edgerunners, Kaguya, FMA, JoJo, JJK, Pokémon anime, Eva, Bebop, Spy x Family, Ranma, Inuyasha, KonoSuba, Yu-Gi-Oh!, Black Clover, Dandadan, Tokyo Ghoul, Vinland, One Piece, AoT…).

Para devolver una pregunta al juego: confirmar el dato en una fuente, copiar la fila a `content/plot-pN.mjs` (o a un `fill-fN.mjs`) y correr `npm run content`.
Los `content/*.mjs` de primer nivel son los únicos que entran al juego (`pending/` no se lee).
