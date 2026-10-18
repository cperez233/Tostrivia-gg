/* editorial-ui · Cristian Pérez · cristianperez.me
 * Tres formas de jugar con la misma interfaz:
 *  - LocalClient: partida solo, el motor corre aquí.
 *  - HostClient: el motor corre aquí y se reparte a los invitados por WebRTC (PeerJS).
 *  - GuestClient: recibe fotos del estado del anfitrión y le manda respuestas.
 */
import type { DataConnection, Peer as PeerType, PeerOptions } from "peerjs";
import { Match, type Snapshot, type Spin } from "../game/match";

export type NetStatus = "connecting" | "open" | "lost" | "closed" | "full" | "missing" | "error";

export interface Me {
  id: string;
  name: string;
  seal: number;
}

export interface GameClient {
  me: Me;
  isHost: boolean;
  mode: "solo" | "group";
  code: string | null;
  subscribe(fn: (s: Snapshot, recvAt: number) => void): () => void;
  onStatus(fn: (s: NetStatus) => void): () => void;
  status: NetStatus;
  answer(index: number, choice: number, ms: number): void;
  media(index: number, status: "playing" | "error"): void;
  next(): void;
  start(seed: number): void;
  setSpin(spin: Spin): void;
  setDeck(deck: string[]): void;
  setCategory(cat: string): void;
  backToLobby(): void;
  kick(id: string): void;
  leave(): void;
}

type GuestMsg =
  | { t: "hello"; me: Me }
  | { t: "answer"; i: number; c: number; ms: number }
  | { t: "media"; i: number; st: "playing" | "error" }
  | { t: "ping" };

type HostMsg = { t: "snap"; s: Snapshot } | { t: "full" } | { t: "ping" } | { t: "bye" } | { t: "kicked" };

const PREFIX = "tostrivia-v1-";
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const newCode = () => Array.from({ length: 5 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");
export const normalizeCode = (c: string) => c.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);

function peerOptions(): PeerOptions {
  const env = import.meta.env;
  const opts: PeerOptions = {
    debug: 0,
    config: {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
    },
  };
  if (env.VITE_PEER_HOST) {
    opts.host = env.VITE_PEER_HOST;
    opts.port = Number(env.VITE_PEER_PORT || 443);
    opts.path = env.VITE_PEER_PATH || "/";
    opts.secure = (env.VITE_PEER_SECURE ?? "true") !== "false";
  }
  return opts;
}

async function loadPeer() {
  const mod = await import("peerjs");
  return mod.Peer;
}

class Emitter<T> {
  private fns = new Set<(v: T) => void>();
  on(fn: (v: T) => void) {
    this.fns.add(fn);
    return () => {
      this.fns.delete(fn);
    };
  }
  emit(v: T) {
    this.fns.forEach((f) => f(v));
  }
}

/* ───────────────── Solo ───────────────── */
export class LocalClient implements GameClient {
  isHost = true;
  mode: "solo" | "group" = "solo";
  code: string | null = null;
  status: NetStatus = "open";
  match: Match;
  constructor(public me: Me) {
    this.match = new Match("solo", me);
  }
  subscribe(fn: (s: Snapshot, at: number) => void) {
    return this.match.subscribe((s) => fn(s, Date.now()));
  }
  onStatus(_fn: (s: NetStatus) => void): () => void {
    return () => {};
  }
  answer(i: number, c: number, ms: number) {
    this.match.answer(this.me.id, i, c, ms);
  }
  media(i: number, st: "playing" | "error") {
    this.match.media(this.me.id, i, st);
  }
  next() {
    this.match.next();
  }
  start(seed: number) {
    this.match.start(seed);
  }
  setDeck(deck: string[]) {
    this.match.setDeck(deck);
  }
  setSpin(spin: Spin) {
    this.match.setSpin(spin);
  }
  setCategory(cat: string) {
    this.match.setCategory(cat);
  }
  backToLobby() {
    this.match.backToLobby();
  }
  kick(_id: string) {}
  leave() {
    this.match.destroy();
  }
}

/* ───────────────── Anfitrión ───────────────── */
export class HostClient extends LocalClient {
  private peer: PeerType | null = null;
  private conns = new Map<string, { conn: DataConnection; pid: string | null; seen: number }>();
  private statusE = new Emitter<NetStatus>();
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private unsub: (() => void) | null = null;

  constructor(me: Me) {
    super(me);
    this.match.destroy();
    this.match = new Match("group", me);
    this.mode = "group";
    this.status = "connecting";
  }

  onStatus(fn: (s: NetStatus) => void) {
    return this.statusE.on(fn);
  }
  private setStatus(s: NetStatus) {
    this.status = s;
    this.statusE.emit(s);
  }

  async open(attempt = 0): Promise<string> {
    const Peer = await loadPeer();
    const code = newCode();
    return new Promise((resolve, reject) => {
      const peer = new Peer(PREFIX + code, peerOptions());
      let opened = false;
      peer.on("open", () => {
        opened = true;
        this.peer = peer;
        this.code = code;
        this.setStatus("open");
        this.wire(peer);
        resolve(code);
      });
      peer.on("error", (err: { type?: string }) => {
        if (!opened) {
          peer.destroy();
          if (err.type === "unavailable-id" && attempt < 4) this.open(attempt + 1).then(resolve, reject);
          else {
            this.setStatus("error");
            reject(err);
          }
        }
      });
    });
  }

  private wire(peer: PeerType) {
    peer.on("connection", (conn) => {
      const entry = { conn, pid: null as string | null, seen: Date.now() };
      conn.on("data", (raw) => this.onGuest(entry, raw as GuestMsg));
      conn.on("close", () => this.drop(entry));
      conn.on("error", () => this.drop(entry));
      this.conns.set(conn.connectionId, entry);
    });
    peer.on("disconnected", () => {
      // se cayó la señalización; las conexiones directas siguen, pero hay que volver para aceptar nuevas
      if (!peer.destroyed) peer.reconnect();
    });
    this.unsub = this.match.subscribe((s) => this.broadcast({ t: "snap", s }));
    this.pingTimer = setInterval(() => {
      const now = Date.now();
      for (const e of this.conns.values()) {
        if (now - e.seen > 12_000) this.drop(e);
        else safeSend(e.conn, { t: "ping" });
      }
    }, 3000);
  }

  private onGuest(entry: { conn: DataConnection; pid: string | null; seen: number }, msg: GuestMsg) {
    entry.seen = Date.now();
    if (!msg || typeof msg !== "object") return;
    if (msg.t === "hello") {
      const me = sanitizeMe(msg.me);
      if (!me) return;
      const res = this.match.join(me);
      if (res === "full") {
        safeSend(entry.conn, { t: "full" });
        setTimeout(() => entry.conn.close(), 300);
        return;
      }
      entry.pid = me.id;
      safeSend(entry.conn, { t: "snap", s: this.match.snapshot() });
      return;
    }
    if (!entry.pid) return;
    if (msg.t === "answer") this.match.answer(entry.pid, msg.i, msg.c, msg.ms);
    else if (msg.t === "media") this.match.media(entry.pid, msg.i, msg.st);
  }

  private drop(entry: { conn: DataConnection; pid: string | null }) {
    if (!this.conns.has(entry.conn.connectionId)) return;
    this.conns.delete(entry.conn.connectionId);
    try {
      entry.conn.close();
    } catch {
      /* ya cerrada */
    }
    if (entry.pid && ![...this.conns.values()].some((e) => e.pid === entry.pid)) this.match.setOnline(entry.pid, false);
  }

  private broadcast(msg: HostMsg) {
    for (const e of this.conns.values()) if (e.pid) safeSend(e.conn, msg);
  }

  kick(id: string) {
    for (const e of this.conns.values())
      if (e.pid === id) {
        safeSend(e.conn, { t: "kicked" });
        setTimeout(() => this.drop(e), 200);
      }
    this.match.kick(id);
  }

  leave() {
    this.broadcast({ t: "bye" });
    if (this.pingTimer) clearInterval(this.pingTimer);
    this.unsub?.();
    setTimeout(() => this.peer?.destroy(), 250);
    this.match.destroy();
    this.setStatus("closed");
  }
}

/* ───────────────── Invitado ───────────────── */
export class GuestClient implements GameClient {
  isHost = false;
  mode = "group" as const;
  status: NetStatus = "connecting";
  private peer: PeerType | null = null;
  private conn: DataConnection | null = null;
  private snapE = new Emitter<[Snapshot, number]>();
  private statusE = new Emitter<NetStatus>();
  private last: [Snapshot, number] | null = null;
  private seen = Date.now();
  private watch: ReturnType<typeof setInterval> | null = null;

  constructor(public me: Me, public code: string) {}

  async connect(): Promise<void> {
    const Peer = await loadPeer();
    return new Promise((resolve, reject) => {
      const peer = new Peer(peerOptions());
      this.peer = peer;
      const fail = (s: NetStatus) => {
        this.setStatus(s);
        reject(new Error(s));
      };
      const timeout = setTimeout(() => this.status === "connecting" && fail("missing"), 15_000);
      peer.on("error", (err: { type?: string }) => {
        if (err.type === "peer-unavailable") fail("missing");
        else if (this.status === "connecting") fail("error");
      });
      peer.on("open", () => {
        const conn = peer.connect(PREFIX + this.code, { reliable: true, serialization: "json" });
        this.conn = conn;
        conn.on("open", () => {
          clearTimeout(timeout);
          safeSend(conn, { t: "hello", me: this.me });
        });
        conn.on("data", (raw) => {
          const msg = raw as HostMsg;
          this.seen = Date.now();
          if (msg.t === "snap") {
            if (this.status !== "open") {
              this.setStatus("open");
              resolve();
            }
            this.last = [msg.s, Date.now()];
            this.snapE.emit(this.last);
          } else if (msg.t === "full") fail("full");
          else if (msg.t === "bye" || msg.t === "kicked") this.setStatus("closed");
        });
        conn.on("close", () => this.status !== "full" && this.setStatus("closed"));
      });
      this.watch = setInterval(() => {
        if (this.conn?.open) safeSend(this.conn, { t: "ping" });
        if (this.status === "open" && Date.now() - this.seen > 12_000) this.setStatus("lost");
        else if (this.status === "lost" && Date.now() - this.seen < 4000) this.setStatus("open");
      }, 3000);
    });
  }

  private setStatus(s: NetStatus) {
    this.status = s;
    this.statusE.emit(s);
  }
  subscribe(fn: (s: Snapshot, at: number) => void) {
    if (this.last) fn(...this.last);
    return this.snapE.on(([s, at]) => fn(s, at));
  }
  onStatus(fn: (s: NetStatus) => void) {
    return this.statusE.on(fn);
  }
  private send(m: GuestMsg) {
    if (this.conn) safeSend(this.conn, m);
  }
  answer(i: number, c: number, ms: number) {
    this.send({ t: "answer", i, c, ms });
  }
  media(i: number, st: "playing" | "error") {
    this.send({ t: "media", i, st });
  }
  next() {}
  start() {}
  setSpin() {}
  setDeck() {}
  setCategory() {}
  backToLobby() {}
  kick() {}
  leave() {
    if (this.watch) clearInterval(this.watch);
    try {
      this.conn?.close();
    } catch {
      /* nada */
    }
    setTimeout(() => this.peer?.destroy(), 200);
    this.setStatus("closed");
  }
}

function safeSend(conn: DataConnection, msg: unknown) {
  try {
    if (conn.open) conn.send(msg);
  } catch {
    /* la conexión se cerró entre medias */
  }
}

/** Lo que llega de otro navegador no es de fiar: nombre corto, sin control, sello en rango. */
function sanitizeMe(me: unknown): Me | null {
  if (!me || typeof me !== "object") return null;
  const m = me as Record<string, unknown>;
  const id = typeof m.id === "string" ? m.id.slice(0, 40) : "";
  const name = typeof m.name === "string" ? m.name.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 18) : "";
  const seal = Number.isInteger(m.seal) ? Math.min(11, Math.max(0, m.seal as number)) : 0;
  if (!id || !name) return null;
  return { id, name, seal };
}
