# Material de la ronda de verificación

Estado a 23-oct-2026: los lotes `plot-p8…p19` y las filas de `parked/` se **revisaron contra Wikipedia (en/es) y otras fuentes**.
Lo que se pudo confirmar (con correcciones donde hizo falta) ya está en el juego, en `content/fill-r1…r27.mjs`.
Lo que queda en estos archivos es lo que **no se pudo confirmar** o se descartó por repetida/ambigua: no entra al juego (`pending/` no se lee).
Algunas filas están marcadas en los informes como «correctas pero sobraban»; sirven de reserva si algún día hace falta rellenar una categoría.

- `tools/wp.mjs`: lee Wikipedia/otras URLs como texto sin gastar búsquedas (`page`, `search`, `url`).
- `tools/lint.mjs`: revisa formato, soplos y repetidas de un `fill-rN.mjs`.
- `tools/INSTRUCCIONES3.md`: instrucciones que se dieron a los agentes verificadores.
- Regla: lo que no se confirma en una fuente leída no entra.
