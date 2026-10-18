/* editorial-ui · Cristian Pérez · cristianperez.me */
import { useEffect, useState } from "react";
import type { Snapshot } from "./match";
import type { GameClient, NetStatus } from "../net/client";

export function useGame(client: GameClient) {
  const [snap, setSnap] = useState<{ s: Snapshot; at: number } | null>(null);
  const [status, setStatus] = useState<NetStatus>(client.status);
  useEffect(() => {
    const off1 = client.subscribe((s, at) => setSnap({ s, at }));
    const off2 = client.onStatus(setStatus);
    setStatus(client.status);
    return () => {
      off1();
      off2();
    };
  }, [client]);
  return { snap: snap?.s ?? null, at: snap?.at ?? 0, status };
}

export const fmt = (n: number) => n.toLocaleString("es-CO");
