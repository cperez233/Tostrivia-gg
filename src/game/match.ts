/* editorial-ui · Cristian Pérez · cristianperez.me
 * Motor de partida. Vive en el dispositivo del anfitrión (o en el tuyo si juegas solo)
 * y es la única fuente de verdad: los invitados solo reciben fotos (Snapshot) del estado.
 */
import { BANK } from "../data/bank";
import { ANIMAL_COUNT } from "../components/Avatar";
import { MEDIA_MS, ROUND_SIZE, TEXT_MS, buildRound, optionOrder, pointsFor, textBackups } from "./round";
import { partsOf } from "./mix";
import { markSeen, pruneTo, restartCycle, seenIn } from "../lib/history";

export const MAX_PLAYERS = 10;
const MEDIA_WAIT_MS = 21_000; // tiempo máximo para que el video empiece a sonar en todos
const GRACE_MS = 700; // margen de red para respuestas que llegan justo al final
const AUTO_NEXT_MS = 7_000; // en grupo, la revelación pasa sola

export type Phase = "lobby" | "loading" | "question" | "reveal" | "final";

export interface Player {
  id: string;
  name: string;
  seal: number;
  score: number;
  streak: number;
  best: number;
  correct: number;
  online: boolean;
}

export interface Pick {
  choice: number | null; // índice en pantalla
  ok: boolean;
  gained: number;
  streak: number;
  ms: number;
  /** el video no cargó en su dispositivo: no pierde la racha */
  excused?: boolean;
}

export interface Spin {
  cat: string;
  /** gajo del mazo en el que cae */
  index: number;
  nonce: number;
}

export interface Snapshot {
  v: number;
  mode: "solo" | "group";
  phase: Phase;
  hostId: string;
  cat: string | null;
  spin: Spin | null;
  /** gajos de la ruleta (ids de categoría) */
  deck: string[];
  seed: number;
  ids: string[];
  index: number;
  qid: string | null;
  order: number[];
  duration: number;
  /** ms que quedan en el momento en que se tomó la foto */
  remaining: number;
  answered: string[];
  mediaReady: string[];
  reveal: { correct: number; picks: Record<string, Pick> } | null;
  players: Player[];
  notice: string | null;
  replaced: number;
}

type Listener = (s: Snapshot) => void;

export class Match {
  private s: Snapshot;
  private reserves: string[] = [];
  private backups: string[] = [];
  /** videos que fallaron en esta ronda; con 2 se asume que YouTube no responde en esta red */
  private mediaFails = 0;
  private startedAt = 0;
  private deadline = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private waitTimer: ReturnType<typeof setTimeout> | null = null;
  private nextTimer: ReturnType<typeof setTimeout> | null = null;
  private answers = new Map<string, { choice: number; ms: number }>();
  private mediaFailed = new Set<string>();
  private listeners = new Set<Listener>();

  constructor(mode: "solo" | "group", host: { id: string; name: string; seal: number }) {
    this.s = {
      v: 0,
      mode,
      phase: "lobby",
      hostId: host.id,
      cat: null,
      spin: null,
      deck: [],
      seed: 0,
      ids: [],
      index: -1,
      qid: null,
      order: [0, 1, 2, 3],
      duration: TEXT_MS,
      remaining: 0,
      answered: [],
      mediaReady: [],
      reveal: null,
      players: [newPlayer(host)],
      notice: null,
      replaced: 0,
    };
  }

  /* ───────── suscripción ───────── */
  subscribe(fn: Listener) {
    this.listeners.add(fn);
    fn(this.snapshot());
    return () => this.listeners.delete(fn);
  }
  snapshot(): Snapshot {
    const remaining = this.s.phase === "question" ? Math.max(0, this.deadline - Date.now()) : 0;
    return { ...this.s, remaining };
  }
  private emit(patch: Partial<Snapshot>) {
    this.s = { ...this.s, ...patch, v: this.s.v + 1 };
    const snap = this.snapshot();
    this.listeners.forEach((l) => l(snap));
  }

  /* ───────── jugadores ───────── */
  join(p: { id: string; name: string; seal: number }): "ok" | "full" {
    const existing = this.s.players.find((x) => x.id === p.id);
    if (existing) {
      const seal = this.freeAnimal(p.seal, p.id);
      this.emit({ players: this.s.players.map((x) => (x.id === p.id ? { ...x, name: p.name, seal, online: true } : x)) });
      return "ok";
    }
    if (this.s.players.filter((x) => x.online).length >= MAX_PLAYERS) return "full";
    this.emit({ players: [...this.s.players, newPlayer({ ...p, seal: this.freeAnimal(p.seal, p.id) })] });
    return "ok";
  }
  /** una raza por jugador: si el animal ya lo tiene otro, le toca el siguiente libre */
  private freeAnimal(want: number, id: string) {
    const taken = new Set(this.s.players.filter((x) => x.id !== id).map((x) => x.seal));
    for (let k = 0; k < ANIMAL_COUNT; k++) {
      const a = (want + k) % ANIMAL_COUNT;
      if (!taken.has(a)) return a;
    }
    return want;
  }
  setOnline(id: string, online: boolean) {
    if (!this.s.players.some((p) => p.id === id)) return;
    this.emit({ players: this.s.players.map((p) => (p.id === id ? { ...p, online } : p)) });
    this.checkAllAnswered();
    this.checkMediaReady();
  }
  kick(id: string) {
    if (id === this.s.hostId) return;
    this.emit({ players: this.s.players.filter((p) => p.id !== id) });
    this.checkAllAnswered();
  }
  private active() {
    return this.s.players.filter((p) => p.online);
  }

  /* ───────── categoría ───────── */
  setDeck(deck: string[]) {
    this.emit({ deck, spin: null });
  }
  setSpin(spin: Spin) {
    this.emit({ spin, cat: spin.cat });
  }
  setCategory(cat: string) {
    this.emit({ cat, spin: null });
  }

  /* ───────── flujo ───────── */
  start(seed: number) {
    if (!this.s.cat) return;
    const cat = this.s.cat;
    // en una mezcla, el historial es el de cada categoría que la forma
    const parts = partsOf(cat);
    const seen = new Set<string>();
    for (const c of parts) {
      pruneTo(c, new Set((BANK.byCat[c] || []).map((q) => q.id)));
      seenIn(c).forEach((id) => seen.add(id));
    }
    const { ids, reserves, restart } = buildRound(cat, seed, seen);
    // ya salieron todas: esta ronda abre la vuelta siguiente
    if (restart) parts.forEach(restartCycle);
    this.reserves = reserves;
    this.backups = textBackups(this.s.cat, seed).filter((id) => !ids.includes(id));
    this.mediaFails = 0;
    this.emit({
      seed,
      ids,
      index: -1,
      replaced: 0,
      notice: null,
      players: this.s.players.filter((p) => p.online).map((p) => ({ ...p, score: 0, streak: 0, best: 0, correct: 0 })),
    });
    this.goTo(0);
  }

  private goTo(index: number) {
    this.clearTimers();
    if (index >= this.s.ids.length || index >= ROUND_SIZE) {
      this.emit({ phase: "final", qid: null, reveal: null, notice: null });
      return;
    }
    const qid = this.s.ids[index];
    const q = BANK.byId[qid];
    this.answers.clear();
    this.mediaFailed.clear();
    const order = optionOrder(qid, this.s.seed);
    const duration = q.media ? MEDIA_MS : TEXT_MS;
    if (q.media && this.mediaFails >= 2) {
      // YouTube ya falló dos veces: no se hace esperar a nadie otra vez
      return this.replaceAt(index, "YouTube no responde en esta red. Seguimos con preguntas sin video.", true);
    }
    if (q.media) {
      this.emit({ phase: "loading", index, qid, order, duration, answered: [], mediaReady: [], reveal: null });
      this.waitTimer = setTimeout(() => this.mediaTimeout(), MEDIA_WAIT_MS);
    } else {
      this.emit({ phase: "loading", index, qid, order, duration, answered: [], mediaReady: [], reveal: null });
      this.beginQuestion();
    }
  }

  private beginQuestion() {
    if (this.waitTimer) clearTimeout(this.waitTimer);
    this.startedAt = Date.now();
    this.deadline = this.startedAt + this.s.duration;
    // ya está en pantalla: cuenta como vista para el historial (src/lib/history.ts)
    const shown = this.s.qid ? BANK.byId[this.s.qid] : null;
    if (shown) markSeen(shown.cat, shown.id);
    this.emit({ phase: "question" });
    this.timer = setInterval(() => {
      if (Date.now() > this.deadline + GRACE_MS) this.revealNow();
    }, 200);
  }

  /** un dispositivo avisa del estado de su video */
  media(pid: string, index: number, status: "playing" | "error") {
    if (index !== this.s.index || !this.s.qid) return;
    if (status === "error") {
      this.mediaFailed.add(pid);
      if (this.s.phase === "loading") return this.replaceCurrent();
      // a mitad de pregunta: si es en el anfitrión (o jugando solo) se cambia para todos;
      // si es en un invitado, ese invitado queda excusado y no pierde la racha
      if (this.s.phase === "question" && (pid === this.s.hostId || this.s.mode === "solo") && this.answers.size === 0) return this.replaceCurrent();
      return;
    }
    if (this.s.mediaReady.includes(pid)) return;
    this.emit({ mediaReady: [...this.s.mediaReady, pid] });
    this.checkMediaReady();
  }

  private checkMediaReady() {
    if (this.s.phase !== "loading") return;
    const q = this.s.qid ? BANK.byId[this.s.qid] : null;
    if (!q?.media) return;
    if (this.active().every((p) => this.s.mediaReady.includes(p.id))) this.beginQuestion();
  }

  private mediaTimeout() {
    if (this.s.phase !== "loading") return;
    // alguien no logró reproducir a tiempo: se cambia la pregunta para todos
    this.replaceCurrent();
  }

  /** El video no cargó: la pregunta se cambia por otra sin romper la partida. */
  private replaceCurrent() {
    this.replaceAt(this.s.index, "El video no cargó. Cambiamos la pregunta.", false);
  }

  private replaceAt(index: number, notice: string, known: boolean) {
    this.clearTimers();
    if (!known) this.mediaFails++;
    const taken = new Set(this.s.ids);
    const textReserve = this.reserves.findIndex((id) => !BANK.byId[id].media);
    let next: string | undefined;
    if (this.mediaFails >= 2) {
      next = textReserve >= 0 ? this.reserves.splice(textReserve, 1)[0] : undefined;
      while (!next && this.backups.length) {
        const b = this.backups.shift()!;
        if (!taken.has(b)) next = b;
      }
    } else next = this.reserves.shift();
    while (!next && this.backups.length) {
      const b = this.backups.shift()!;
      if (!taken.has(b)) next = b;
    }
    if (next) {
      const ids = this.s.ids.slice();
      ids[index] = next;
      this.emit({ ids, notice, replaced: this.s.replaced + 1 });
      this.goTo(index);
    } else {
      // sin nada con qué reemplazar: se salta y la ronda queda más corta
      const ids = this.s.ids.filter((_, i) => i !== index);
      this.emit({ ids, notice: "El video no cargó. Pasamos a la siguiente.", replaced: this.s.replaced + 1 });
      this.goTo(index);
    }
  }

  answer(pid: string, index: number, choice: number, clientMs?: number) {
    if (this.s.phase !== "question" || index !== this.s.index || this.answers.has(pid)) return;
    if (!this.s.players.some((p) => p.id === pid)) return;
    const hostMs = Date.now() - this.startedAt;
    // el invitado mide su propio tiempo; se acepta si no es absurdo frente al reloj del anfitrión
    const ms = clientMs != null && clientMs >= 0 && clientMs <= hostMs + 1500 ? clientMs : hostMs;
    this.answers.set(pid, { choice, ms: Math.min(ms, this.s.duration) });
    this.emit({ answered: [...this.s.answered, pid], notice: null });
    this.checkAllAnswered();
  }

  private checkAllAnswered() {
    if (this.s.phase !== "question") return;
    const act = this.active();
    if (act.length && act.every((p) => this.answers.has(p.id))) setTimeout(() => this.revealNow(), 350);
  }

  private revealNow() {
    if (this.s.phase !== "question" || !this.s.qid) return;
    this.clearTimers();
    const q = BANK.byId[this.s.qid];
    const correctDisplay = this.s.order.indexOf(0);
    const picks: Record<string, Pick> = {};
    const players = this.s.players.map((p) => {
      const a = this.answers.get(p.id);
      const ok = !!a && this.s.order[a.choice] === 0;
      const excused = !a && this.mediaFailed.has(p.id);
      const streak = ok ? p.streak + 1 : excused ? p.streak : 0;
      const gained = ok ? pointsFor(q.d, 1 - a!.ms / this.s.duration, streak) : 0;
      picks[p.id] = { choice: a ? a.choice : null, ok, gained, streak, ms: a?.ms ?? this.s.duration, excused };
      return { ...p, score: p.score + gained, streak, best: Math.max(p.best, streak), correct: p.correct + (ok ? 1 : 0) };
    });
    this.emit({ phase: "reveal", reveal: { correct: correctDisplay, picks }, players });
    if (this.s.mode === "group") this.nextTimer = setTimeout(() => this.next(), AUTO_NEXT_MS + (q.media ? 2500 : 0));
  }

  next() {
    if (this.s.phase !== "reveal") return;
    this.goTo(this.s.index + 1);
  }

  /** vuelve a la sala con los mismos jugadores */
  backToLobby() {
    this.clearTimers();
    this.emit({ phase: "lobby", qid: null, index: -1, ids: [], reveal: null, notice: null, spin: null });
  }

  destroy() {
    this.clearTimers();
    this.listeners.clear();
  }

  private clearTimers() {
    if (this.timer) clearInterval(this.timer);
    if (this.waitTimer) clearTimeout(this.waitTimer);
    if (this.nextTimer) clearTimeout(this.nextTimer);
    this.timer = this.waitTimer = this.nextTimer = null;
  }
}

function newPlayer(p: { id: string; name: string; seal: number }): Player {
  return { id: p.id, name: p.name, seal: p.seal, score: 0, streak: 0, best: 0, correct: 0, online: true };
}
