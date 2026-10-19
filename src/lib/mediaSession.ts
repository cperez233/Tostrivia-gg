/* editorial-ui · Cristian Pérez · cristianperez.me
 * En el celular, el centro de notificaciones y la pantalla de bloqueo muestran lo que suena: el reproductor
 * de YouTube publica el título del video (o sea, la respuesta). Mientras hay un video en la partida, la
 * página publica su propia ficha genérica para que ahí no salga el nombre del opening o de la canción.
 * Es lo mejor que deja hacer el navegador: el reproductor vive en un iframe y cada navegador decide cuál
 * ficha muestra, así que no en todos los celulares tapa del todo.
 */
let users = 0;

function hide() {
  try {
    if (!("mediaSession" in navigator) || typeof MediaMetadata === "undefined") return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: "Tostrivia",
      artist: "???",
      album: "",
      artwork: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
    });
  } catch {
    /* navegador sin Media Session */
  }
}

/** se llama al montar el video; devuelve cómo soltarlo */
export function maskMediaSession(): () => void {
  users++;
  hide();
  // el reproductor vuelve a poner el título cuando arranca: se vuelve a tapar un poco después
  const timers = [600, 1800, 4000].map((ms) => setTimeout(hide, ms));
  return () => {
    timers.forEach(clearTimeout);
    if (--users > 0) return;
    try {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.playbackState = "none";
      }
    } catch {
      /* nada */
    }
  };
}
