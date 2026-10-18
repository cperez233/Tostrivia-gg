/* editorial-ui · Cristian Pérez · cristianperez.me
 * Carga única de la YouTube IFrame Player API. Sin API key: el cliente solo reproduce ids ya verificados.
 */

export interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(s: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getPlayerState(): number;
  setVolume(v: number): void;
  unMute(): void;
  isMuted(): boolean;
  destroy(): void;
}

export interface YTNamespace {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      width?: string | number;
      height?: string | number;
      host?: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (e: { target: YTPlayer }) => void;
        onStateChange?: (e: { data: number; target: YTPlayer }) => void;
        onError?: (e: { data: number }) => void;
        onAutoplayBlocked?: () => void;
      };
    },
  ) => YTPlayer;
  PlayerState: { UNSTARTED: -1; ENDED: 0; PLAYING: 1; PAUSED: 2; BUFFERING: 3; CUED: 5 };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let loading: Promise<YTNamespace> | null = null;

export function loadYouTube(timeoutMs = 10_000): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (loading) return loading;
  loading = new Promise<YTNamespace>((resolve, reject) => {
    const t = setTimeout(() => {
      loading = null;
      reject(new Error("youtube-timeout"));
    }, timeoutMs);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      clearTimeout(t);
      resolve(window.YT!);
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    s.onerror = () => {
      clearTimeout(t);
      loading = null;
      s.remove();
      reject(new Error("youtube-blocked"));
    };
    document.head.appendChild(s);
  });
  return loading;
}

/** Códigos de error del reproductor, en palabras */
export const YT_ERRORS: Record<number, string> = {
  2: "id inválido",
  5: "error del reproductor HTML5",
  100: "video eliminado o privado",
  101: "el dueño no permite incrustarlo",
  150: "el dueño no permite incrustarlo",
  153: "falta la cabecera Referer",
};
