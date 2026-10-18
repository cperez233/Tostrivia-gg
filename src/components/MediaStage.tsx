/* editorial-ui · Cristian Pérez · cristianperez.me
 * Reproduce solo el fragmento [s, e] de un video de YouTube.
 *  - audio: el video queda tapado por una viñeta; se oye y se revela al responder.
 *  - blur:  se ve muy difuminado; se aclara al responder.
 *  - clip:  se ve, con la franja del título tapada para no regalar la respuesta.
 * Si el video falla (error del reproductor, API bloqueada o no arranca a tiempo) avisa con onError
 * y la partida cambia la pregunta.
 */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Media } from "../data/types";
import { loadYouTube, YT_ERRORS, type YTPlayer } from "../lib/youtube";
import "./media.css";

interface Props {
  media: Media;
  videoId: string;
  revealed: boolean;
  onPlaying: () => void;
  onError: (reason: string) => void;
}

const START_TIMEOUT = 13_000;

export default function MediaStage({ media, videoId, revealed, onPlaying, onError }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "blocked" | "playing" | "failed">("loading");
  const playerRef = useRef<YTPlayer | null>(null);
  const cb = useRef({ onPlaying, onError });
  cb.current = { onPlaying, onError };

  useEffect(() => {
    let player: YTPlayer | null = null;
    let dead = false;
    let started = false;
    let loop: ReturnType<typeof setInterval> | null = null;
    let blockedTimer: ReturnType<typeof setTimeout> | null = null;
    const fail = (reason: string) => {
      if (dead) return;
      dead = true;
      setState("failed");
      cb.current.onError(reason);
    };
    const startTimer = setTimeout(() => !started && fail("no arrancó a tiempo"), START_TIMEOUT);

    loadYouTube()
      .then((YT) => {
        if (dead || !host.current) return;
        const mount = document.createElement("div");
        host.current.appendChild(mount);
        player = new YT.Player(mount, {
          videoId,
          width: "100%",
          height: "100%",
          playerVars: {
            start: Math.floor(media.s),
            end: Math.ceil(media.e),
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (e) => {
              if (dead) return;
              e.target.unMute();
              e.target.setVolume(85);
              e.target.playVideo();
              // si el navegador bloquea el sonido automático, se pide un toque
              blockedTimer = setTimeout(() => !started && !dead && setState("blocked"), 2500);
            },
            onAutoplayBlocked: () => !started && setState("blocked"),
            onStateChange: (e) => {
              if (dead) return;
              if (e.data === 1 && !started) {
                started = true;
                clearTimeout(startTimer);
                if (blockedTimer) clearTimeout(blockedTimer);
                setState("playing");
                cb.current.onPlaying();
                // bucle manual sobre el fragmento: end solo vale en la primera pasada
                loop = setInterval(() => {
                  try {
                    if (player && player.getCurrentTime() >= media.e - 0.15) player.seekTo(media.s, true);
                  } catch {
                    /* el reproductor ya no existe */
                  }
                }, 250);
              }
              if (e.data === 0 && player) {
                player.seekTo(media.s, true);
                player.playVideo();
              }
            },
            onError: (e) => fail(YT_ERRORS[e.data] || `error ${e.data}`),
          },
        });
        playerRef.current = player;
      })
      .catch((e: Error) => fail(e.message === "youtube-blocked" ? "YouTube bloqueado en esta red" : "YouTube no respondió"));

    return () => {
      dead = true;
      clearTimeout(startTimer);
      if (blockedTimer) clearTimeout(blockedTimer);
      if (loop) clearInterval(loop);
      playerRef.current = null;
      try {
        player?.destroy();
      } catch {
        /* nada */
      }
      if (host.current) host.current.innerHTML = "";
    };
    // un video por montaje: la clave del componente cambia con la pregunta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // el toque del usuario es el gesto que el navegador pide para sonar
  const tapToPlay = () => {
    try {
      playerRef.current?.unMute();
      playerRef.current?.playVideo();
    } catch {
      /* el reproductor no está listo todavía */
    }
  };

  const hidden = !revealed;
  return (
    <div className={`stage stage--${media.m} ${revealed ? "is-revealed" : ""}`} data-state={state}>
      <div className="stage__frame">
        <div
          className="stage__video"
          ref={host}
          style={media.m === "blur" ? { filter: hidden ? "blur(22px) grayscale(1) contrast(1.3)" : "none", transform: hidden ? "scale(1.18)" : "none" } : undefined}
        />
        {/* capa que impide tocar el video (pausar, abrir YouTube) */}
        <div className="stage__shield" aria-hidden />

        {media.m === "clip" && hidden && (
          <>
            <div className="stage__band stage__band--top" aria-hidden />
            <div className="stage__band stage__band--bottom" aria-hidden />
          </>
        )}

        {media.m === "audio" && (
          <motion.div
            className="stage__cover tone-hlines"
            initial={false}
            animate={{ clipPath: hidden ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            aria-hidden={!hidden}
          >
            <div className="stage__cover-card">
              <div className={`eq ${state === "playing" ? "" : "is-paused"}`} aria-hidden>
                {Array.from({ length: 7 }, (_, i) => (
                  <span key={i} className="anim-eq" style={{ animationDelay: `${(i * 137) % 600}ms`, animationDuration: `${620 + ((i * 89) % 380)}ms` }} />
                ))}
              </div>
              <p className="stage__cover-text">
                {state === "playing" ? "Escucha bien. La imagen se revela al responder." : state === "failed" ? "Este video no cargó." : "Cargando el audio…"}
              </p>
            </div>
          </motion.div>
        )}

        {state === "blocked" && (
          <button type="button" className="stage__tap btn btn--hanko" onClick={tapToPlay}>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
            </svg>
            Toca para escuchar
          </button>
        )}
        {state === "loading" && media.m !== "audio" && <div className="stage__loading">Cargando video…</div>}
      </div>
      <p className="stage__hint">
        {media.m === "audio" && "Solo audio"}
        {media.m === "blur" && "Video difuminado"}
        {media.m === "clip" && "Clip sin título"}
        <span className="muted"> · fragmento de {Math.round(media.e - media.s)} s en bucle</span>
      </p>
    </div>
  );
}
