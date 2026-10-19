/* editorial-ui · Cristian Pérez · cristianperez.me
 * Reproduce solo el fragmento [s, e] de un video de YouTube.
 *  - audio: el video queda tapado por una viñeta; se oye y se revela al responder.
 *  - blur:  se ve muy difuminado; se aclara al responder.
 *  - clip:  se ve, con la franja del título tapada para no regalar la respuesta.
 * Si un video falla (YouTube no deja insertarlo, lo borraron…) prueba el siguiente de respaldo;
 * solo cuando no queda ninguno, o la API no carga o nada arranca a tiempo, avisa con onError
 * y la partida cambia la pregunta.
 */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Media } from "../data/types";
import type { VideoCandidate } from "../data/bank";
import { loadYouTube, YT_ERRORS, type YTPlayer } from "../lib/youtube";
import "./media.css";

interface Props {
  media: Media;
  /** el principal primero y luego los de respaldo */
  videos: VideoCandidate[];
  revealed: boolean;
  onPlaying: () => void;
  onError: (reason: string) => void;
  /** cuál de los videos se está usando (cambia si entra uno de respaldo) */
  onVideo?: (v: VideoCandidate) => void;
}

const START_TIMEOUT = 18_000;

export default function MediaStage({ media, videos, revealed, onPlaying, onError, onVideo }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "blocked" | "playing" | "failed">("loading");
  const playerRef = useRef<YTPlayer | null>(null);
  const cb = useRef({ onPlaying, onError, onVideo });
  cb.current = { onPlaying, onError, onVideo };

  useEffect(() => {
    let player: YTPlayer | null = null;
    let dead = false;
    let started = false;
    let loop: ReturnType<typeof setInterval> | null = null;
    let blockedTimer: ReturnType<typeof setTimeout> | null = null;
    const fail = (reason: string) => {
      if (dead) return;
      dead = true;
      console.warn(`[tostrivia] el video no cargó: ${reason}`);
      setState("failed");
      cb.current.onError(reason);
    };
    const startTimer = setTimeout(() => !started && fail("no arrancó a tiempo"), START_TIMEOUT);

    let attempt = 0;
    // fragmento ajustado a lo que dura este video (los de respaldo pueden ser un poco más cortos)
    const span = (v: VideoCandidate) => {
      const e = Math.min(media.e, Math.max(5, v.durationSec - 1));
      return { s: Math.max(0, Math.min(media.s, e - (media.e - media.s))), e };
    };
    let clip = span(videos[0]);

    const mount = (YT: Awaited<ReturnType<typeof loadYouTube>>) => {
      if (dead || !host.current) return;
      const v = videos[attempt];
      clip = span(v);
      cb.current.onVideo?.(v);
      host.current.innerHTML = "";
      const el = document.createElement("div");
      host.current.appendChild(el);
      player = new YT.Player(el, {
        videoId: v.id,
        width: "100%",
        height: "100%",
        playerVars: {
          start: Math.floor(clip.s),
          end: Math.ceil(clip.e),
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
            if (blockedTimer) clearTimeout(blockedTimer);
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
              // y vigilancia de atascos: "reproduciendo" pero sin avanzar 5 s cuenta como fallo
              let lastT = -1;
              let stuckSince = Date.now();
              loop = setInterval(() => {
                try {
                  if (!player) return;
                  const t = player.getCurrentTime();
                  if (t >= clip.e - 0.15) player.seekTo(clip.s, true);
                  if (Math.abs(t - lastT) > 0.05 || player.getPlayerState() === 2) stuckSince = Date.now();
                  else if (Date.now() - stuckSince > 5000) fail("el video se quedó atascado");
                  lastT = t;
                } catch {
                  /* el reproductor ya no existe */
                }
              }, 250);
            }
            if (e.data === 0 && player) {
              player.seekTo(clip.s, true);
              player.playVideo();
            }
          },
          onError: (e) => {
            const reason = YT_ERRORS[e.data] || `error ${e.data}`;
            // antes de arrancar, un error del video (no de la red) se arregla con el de respaldo
            if (!started && attempt + 1 < videos.length) {
              console.info(`[tostrivia] ${v.id}: ${reason}; probando el de respaldo`);
              try {
                player?.destroy();
              } catch {
                /* nada */
              }
              attempt++;
              mount(YT);
              return;
            }
            fail(reason);
          },
        },
      });
      playerRef.current = player;
    };

    loadYouTube()
      .then(mount)
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
          // iOS y algunos Android solo dejan sonar si el toque cae en el propio reproductor:
          // la portada deja pasar el toque al iframe sin destaparlo
          <button type="button" className="stage__tap" onClick={tapToPlay}>
            <span className="stage__tap-pill">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
              </svg>
              Toca aquí para escuchar
            </span>
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
