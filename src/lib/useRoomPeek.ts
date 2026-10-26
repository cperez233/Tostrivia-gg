/* editorial-ui · Cristian Pérez · cristianperez.me
 * Mira una sala por su código antes de entrar: quién hay y qué animales están ocupados.
 * Se vuelve a consultar al cambiar el código; si se escribe otro mientras busca, la consulta vieja se cancela.
 */
import { useCallback, useEffect, useState } from "react";
import { peekRoom, type RoomPeek } from "../net/client";

export type PeekState = { k: "idle" } | { k: "loading" } | { k: "found"; peek: RoomPeek } | { k: "missing" } | { k: "error" };

export function useRoomPeek(code: string | null) {
  const [state, setState] = useState<PeekState>({ k: "idle" });
  const [tick, setTick] = useState(0);
  const retry = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    if (!code || code.length !== 5) return setState({ k: "idle" });
    const ctl = new AbortController();
    setState({ k: "loading" });
    peekRoom(code, ctl.signal).then(
      (peek) => !ctl.signal.aborted && setState({ k: "found", peek }),
      (e: Error) => !ctl.signal.aborted && setState({ k: e.message === "missing" ? "missing" : "error" }),
    );
    return () => ctl.abort();
  }, [code, tick]);

  return { state, retry };
}
