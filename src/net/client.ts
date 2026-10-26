/* editorial-ui · Cristian Pérez · cristianperez.me
 * Tres formas de jugar con la misma interfaz:
 *  - LocalClient: partida solo, el motor corre aquí.
 *  - HostClient: el motor corre aquí y se reparte a los invitados por WebRTC (PeerJS).
 *  - GuestClient: recibe fotos del estado del anfitrión y le manda respuestas.
 */
import type { DataConnection, Peer as PeerType, PeerOptions } from "peerjs";
import { MAX_PLAYERS, Match, type Snapshot, type Spin } from "../game/match";
import { isPower, isVariant, type PowerId, type Variant } from "../game/powers";
import { isValidCat } from "../game/mix";
import type { Rules } from "../game/rules";
import { randomInt } from "../lib/rng";

export type NetStatus = "connecting" | "open" | "lost" | "closed" | "full" | "taken" | "missing" | "error";

export interface Me {
  id: string;
  name: string;
  seal: number;
}

/** reacciones rápidas: un toque y salen flotando en la pantalla de todos */
export const EMOTES = ["🔥", "😂", "😱", "👏", "💀", "🤯", "😭", "🫡"] as const;

export interface ChatMsg {
  id: string;
  pid: string;
  name: string;
  seal: number;
  kind: "text" | "emote";
  body: string;
  at: number;
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
  /** modo Poderes: usar uno en la pregunta `index` */
  power(index: number, p: PowerId): void;
  next(): void;
  start(seed: number): void;
  setSpin(spin: Spin): void;
  setDeck(deck: string[]): void;
  setCategory(cat: string): void;
  setVariant(v: Variant): void;
  /** reglas de la partida (solo quien juega solo o el anfitrión) */
  setRules(r: Rules): void;
  backToLobby(): void;
  kick(id: string): void;
  /** solo el anfitrión: darle o quitarle el mando de la sala a alguien */
  setLeader(id: string, on: boolean): void;
  leave(): void;
  /** chat y emotes (solo en grupo): pasan por el anfitrión, que los reparte */
  say(text: string): void;
  react(emote: string): void;
  onChat(fn: (m: ChatMsg) => void): () => void;
  chatLog(): ChatMsg[];
}

type GuestMsg =
  | { t: "hello"; me: Me }
  /** mirar quién hay en la sala sin entrar */
  | { t: "peek" }
  | { t: "answer"; i: number; c: number; ms: number }
  | { t: "media"; i: number; st: "playing" | "error" }
  | { t: "power"; i: number; p: PowerId }
  | { t: "ping" }
  | { t: "chat"; body: string }
  | { t: "emote"; e: string }
  /** un líder maneja la sala: el anfitrión lo ejecuta solo si de verdad es líder */
  | { t: "ctl"; op: "start" | "next" | "lobby" | "spin" | "deck" | "cat" | "variant" | "rules" | "kick"; a?: unknown };

type HostMsg =
  | { t: "snap"; s: Snapshot }
  | { t: "full" }
  /** el animal que traías ya lo tiene otra persona: estos son los ocupados */
  | { t: "taken"; seals: number[] }
  | { t: "preview"; hostId: string; players: { id: string; name: string; seal: number; online: boolean }[]; max: number; phase: string }
  | { t: "ping" }
  | { t: "bye" }
  | { t: "kicked" }
  | { t: "chat"; m: ChatMsg }
  | { t: "chatlog"; list: ChatMsg[] };

const CHAT_KEEP = 60;

const PREFIX = "tostrivia-v1-";
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const newCode = () => Array.from({ length: 5 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
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
  power(i: number, p: PowerId) {
    this.match.usePower(this.me.id, i, p);
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
  setVariant(v: Variant) {
    this.match.setVariant(v);
  }
  setRules(r: Rules) {
    this.match.setRules(r);
  }
  backToLobby() {
    this.match.backToLobby();
  }
  kick(_id: string) {}
  setLeader(_id: string, _on: boolean) {}
  leave() {
    this.match.destroy();
  }
  say(_text: string) {}
  react(_emote: string) {}
  onChat(_fn: (m: ChatMsg) => void): () => void {
    return () => {};
  }
  chatLog(): ChatMsg[] {
    return [];
  }
}

/* ───────────────── Anfitrión ───────────────── */
export class HostClient extends LocalClient {
  private peer: PeerType | null = null;
  private conns = new Map<string, { conn: DataConnection; pid: string | null; seen: number }>();
  private statusE = new Emitter<NetStatus>();
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private unsub: (() => void) | null = null;
  private chatE = new Emitter<ChatMsg>();
  private chat: ChatMsg[] = [];
  /** último mensaje de cada jugador: un poco de freno contra el spam */
  private lastSaid = new Map<string, number>();

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
    if (msg.t === "peek") {
      const s = this.match.snapshot();
      safeSend(entry.conn, { t: "preview", hostId: s.hostId, players: s.players.map((p) => ({ id: p.id, name: p.name, seal: p.seal, online: p.online })), max: MAX_PLAYERS, phase: s.phase });
      return;
    }
    if (msg.t === "hello") {
      const me = sanitizeMe(msg.me);
      if (!me) return;
      const res = this.match.join(me);
      if (res === "full") {
        safeSend(entry.conn, { t: "full" });
        setTimeout(() => entry.conn.close(), 300);
        return;
      }
      if (res === "taken") {
        // no entra: se le dice qué animales están ocupados y la conexión se cierra y vuelve a entrar con otro animal
        safeSend(entry.conn, { t: "taken", seals: this.match.takenSeals() });
        setTimeout(() => entry.conn.close(), 300);
        return;
      }
      entry.pid = me.id;
      safeSend(entry.conn, { t: "snap", s: this.match.snapshot() });
      if (this.chat.length) safeSend(entry.conn, { t: "chatlog", list: this.chat.filter((m) => m.kind === "text") });
      return;
    }
    if (!entry.pid) return;
    if (msg.t === "answer") this.match.answer(entry.pid, msg.i, msg.c, msg.ms);
    else if (msg.t === "media") this.match.media(entry.pid, msg.i, msg.st);
    else if (msg.t === "power" && isPower(msg.p)) this.match.usePower(entry.pid, msg.i, msg.p);
    else if (msg.t === "chat") this.post(entry.pid, "text", msg.body);
    else if (msg.t === "emote") this.post(entry.pid, "emote", msg.e);
    else if (msg.t === "ctl" && this.match.isLeader(entry.pid)) this.control(msg.op, msg.a);
  }

  /** lo que manda un líder: se revisa como cualquier cosa que llega por la red */
  private control(op: string, a: unknown) {
    const str = (x: unknown) => (typeof x === "string" && x.length <= 400 ? x : null);
    if (op === "start") this.match.start(typeof a === "number" && Number.isFinite(a) ? a : randomInt(2 ** 31));
    else if (op === "next") this.match.next();
    else if (op === "lobby") this.match.backToLobby();
    else if (op === "cat") {
      const c = str(a);
      if (c && isValidCat(c)) this.match.setCategory(c);
    } else if (op === "deck") {
      if (Array.isArray(a) && a.length <= 60 && a.every((c) => str(c) && isValidCat(c as string))) this.match.setDeck(a as string[]);
    } else if (op === "spin") {
      const x = a as Partial<Spin> | null;
      if (x && str(x.cat) && isValidCat(x.cat!) && Number.isInteger(x.index) && Number.isFinite(x.nonce)) this.match.setSpin({ cat: x.cat!, index: x.index!, nonce: x.nonce! });
    } else if (op === "variant") {
      if (isVariant(a)) this.match.setVariant(a);
    } else if (op === "rules") {
      if (a && typeof a === "object") this.match.setRules(a as Rules);
    } else if (op === "kick") {
      const id = str(a);
      if (id) this.kick(id);
    }
  }

  /** todo mensaje pasa por aquí: se limpia, se le pone el nombre que tiene en la partida y se reparte */
  private post(pid: string, kind: ChatMsg["kind"], raw: unknown) {
    const player = this.match.snapshot().players.find((p) => p.id === pid);
    if (!player || typeof raw !== "string") return;
    const body = kind === "emote" ? raw : raw.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, 140);
    if (!body || (kind === "emote" && !(EMOTES as readonly string[]).includes(body))) return;
    const now = Date.now();
    if (now - (this.lastSaid.get(pid) ?? 0) < (kind === "emote" ? 250 : 600)) return;
    this.lastSaid.set(pid, now);
    const m: ChatMsg = { id: `${pid}-${now}`, pid, name: player.name, seal: player.seal, kind, body, at: now };
    if (kind === "text") this.chat = [...this.chat, m].slice(-CHAT_KEEP);
    this.chatE.emit(m);
    this.broadcast({ t: "chat", m });
  }

  say(text: string) {
    this.post(this.me.id, "text", text);
  }
  react(emote: string) {
    this.post(this.me.id, "emote", emote);
  }
  onChat(fn: (m: ChatMsg) => void) {
    return this.chatE.on(fn);
  }
  chatLog() {
    return this.chat;
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

  setLeader(id: string, on: boolean) {
    this.match.setLeader(id, on);
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
  private chatE = new Emitter<ChatMsg>();
  private chat: ChatMsg[] = [];

  /** si la sala no lo dejó entrar por el animal: los que ya están ocupados */
  takenSeals: number[] = [];

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
          } else if (msg.t === "chat") {
            const m = cleanChat(msg.m);
            if (!m) return;
            if (m.kind === "text") this.chat = [...this.chat, m].slice(-CHAT_KEEP);
            this.chatE.emit(m);
          } else if (msg.t === "chatlog" && Array.isArray(msg.list)) {
            this.chat = msg.list.map(cleanChat).filter((m): m is ChatMsg => !!m).slice(-CHAT_KEEP);
          } else if (msg.t === "full") fail("full");
          else if (msg.t === "taken") {
            this.takenSeals = Array.isArray(msg.seals) ? msg.seals.filter((x) => Number.isInteger(x)) : [];
            fail("taken");
          }
          else if (msg.t === "bye" || msg.t === "kicked") this.setStatus("closed");
        });
        conn.on("close", () => this.status !== "full" && this.status !== "taken" && this.setStatus("closed"));
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
  power(i: number, p: PowerId) {
    this.send({ t: "power", i, p });
  }
  say(text: string) {
    const body = text.trim().slice(0, 140);
    if (body) this.send({ t: "chat", body });
  }
  react(emote: string) {
    this.send({ t: "emote", e: emote });
  }
  onChat(fn: (m: ChatMsg) => void) {
    return this.chatE.on(fn);
  }
  chatLog() {
    return this.chat;
  }
  // si el anfitrión lo hizo líder, puede manejar la sala; si no, el anfitrión lo ignora
  next() {
    this.send({ t: "ctl", op: "next" });
  }
  start(seed: number) {
    this.send({ t: "ctl", op: "start", a: seed });
  }
  setSpin(spin: Spin) {
    this.send({ t: "ctl", op: "spin", a: spin });
  }
  setDeck(deck: string[]) {
    this.send({ t: "ctl", op: "deck", a: deck });
  }
  setCategory(cat: string) {
    this.send({ t: "ctl", op: "cat", a: cat });
  }
  setVariant(v: Variant) {
    this.send({ t: "ctl", op: "variant", a: v });
  }
  setRules(r: Rules) {
    this.send({ t: "ctl", op: "rules", a: r });
  }
  backToLobby() {
    this.send({ t: "ctl", op: "lobby" });
  }
  kick(id: string) {
    this.send({ t: "ctl", op: "kick", a: id });
  }
  setLeader() {}
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

/** el anfitrión ya los limpió, pero lo que llega por la red se revisa igual */
function cleanChat(m: unknown): ChatMsg | null {
  if (!m || typeof m !== "object") return null;
  const x = m as Record<string, unknown>;
  if (typeof x.body !== "string" || typeof x.name !== "string" || typeof x.pid !== "string") return null;
  const kind = x.kind === "emote" ? "emote" : "text";
  if (kind === "emote" && !(EMOTES as readonly string[]).includes(x.body)) return null;
  return {
    id: String(x.id ?? Math.random()),
    pid: x.pid.slice(0, 40),
    name: x.name.slice(0, 18),
    seal: Number.isInteger(x.seal) ? Math.min(11, Math.max(0, x.seal as number)) : 0,
    kind,
    body: x.body.slice(0, 140),
    at: Number(x.at) || Date.now(),
  };
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

/* ───────────────── Mirar una sala sin entrar ───────────────── */
export interface RoomPeek {
  hostName: string;
  players: { name: string; seal: number; online: boolean; host: boolean }[];
  max: number;
  /** "lobby" = sala de espera; cualquier otra cosa = hay partida en marcha */
  phase: string;
  /** ya no cabe nadie más conectado */
  full: boolean;
}

/** Abre una conexión corta con el anfitrión, le pregunta quién hay y la cierra. Falla con "missing" (no existe) o "error". */
export async function peekRoom(code: string, signal?: AbortSignal): Promise<RoomPeek> {
  const Peer = await loadPeer();
  return new Promise<RoomPeek>((resolve, reject) => {
    const peer = new Peer(peerOptions());
    let over = false;
    const finish = (fn: () => void) => {
      if (over) return;
      over = true;
      clearTimeout(timer);
      try {
        peer.destroy();
      } catch {
        /* ya cerrado */
      }
      fn();
    };
    const timer = setTimeout(() => finish(() => reject(new Error("missing"))), 12_000);
    signal?.addEventListener("abort", () => finish(() => reject(new Error("abort"))));
    peer.on("error", (err: { type?: string }) => finish(() => reject(new Error(err.type === "peer-unavailable" ? "missing" : "error"))));
    peer.on("open", () => {
      const conn = peer.connect(PREFIX + code, { reliable: true, serialization: "json" });
      conn.on("open", () => safeSend(conn, { t: "peek" }));
      conn.on("data", (raw) => {
        const m = raw as HostMsg;
        if (m?.t !== "preview" || !Array.isArray(m.players)) return;
        const players = m.players.slice(0, 40).map((p) => ({
          name: typeof p.name === "string" ? p.name.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 18) : "",
          seal: Number.isInteger(p.seal) ? Math.min(11, Math.max(0, p.seal)) : 0,
          online: !!p.online,
          host: p.id === m.hostId,
        }));
        const max = Number.isInteger(m.max) ? m.max : 10;
        const host = players.find((p) => p.host);
        finish(() => resolve({ hostName: host?.name || "", players, max, phase: typeof m.phase === "string" ? m.phase : "lobby", full: players.filter((p) => p.online).length >= max }));
      });
    });
  });
}
