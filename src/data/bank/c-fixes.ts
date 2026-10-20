/* editorial-ui · Cristian Pérez · cristianperez.me
 * Generado por scripts/build-content.mjs a partir de content/fixes.mjs: no se edita a mano.
 * Formato: [dificultad, pregunta, correcta, mala, mala, mala, media o visual?]
 */
import type { RawQuestion } from "../types";

const bank: Record<string, RawQuestion[]> = {
  frieren: [
    [3,"¿Qué se revela sobre la espada con la que se hizo famoso Himmel?","Era una réplica: él nunca logró sacar la Espada del Héroe original","La forjó Eisen","Se la regaló Frieren","Era la Espada del Héroe original"],
  ],
  ff: [
    [3,"¿Cuál de estos Final Fantasy es un juego de rol multijugador masivo en línea (MMORPG)?","Final Fantasy XIV","Final Fantasy XII","Final Fantasy XIII","Final Fantasy XV"],
  ],
  eva: [
    [1,"¿Qué aparato usa Shinji para aislarse escuchando música?","Un reproductor de audio S-DAT (cinta digital)","Un iPod","Una radio de pilas","Un tocadiscos"],
  ],
};

export default bank;
