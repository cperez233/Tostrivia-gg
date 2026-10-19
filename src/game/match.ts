/* editorial-ui · Cristian Pérez · cristianperez.me
 * Motor de partida. Vive en el dispositivo del anfitrión (o en el tuyo si juegas solo)
 * y es la única fuente de verdad: los invitados solo reciben fotos (Snapshot) del estado.
 */
import { BANK, videoFor } from "../data/bank";
import { ANIMAL_COUNT } from "../components/Avatar";
import { MEDIA_MS, ROUND_SIZE, TEXT_MS, buildRound, multiplier, optionOrder, pointsFor, textBackups } from "./round";
import { partsOf } from "./mix";
import { markSeen, pruneTo, restartCycle, seenIn } from "../lib/history";
import {
  BLUE_PTS,
  BOLT_PTS,
  COLD_EVERY,
  DICE_PTS,
  DOUBLE_RISK,
  EARN_EVERY,
  BANANA_PTS,
  FX_MS,
  FX_POWERS,
  SCARE_CLIP_MS,
  SCARE_KEYS,
  MAX_HAND,
  MUSHROOM_MAX,
  POOL,
  POWER_LINES,
  RED_PTS,
  STAR_MULT,
  STEAL_PTS,
  drawPower,
  startHand,
  type FxId,
  type PowerId,
  type Variant,
} from "./powers";
import { shuffle } from "../lib/rng";

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
  /** modo Poderes: los que tiene en la mano */
  powers: PowerId[];
}

export interface Pick {
  choice: number | null; // índice en pantalla
  ok: boolean;
  gained: number;
  streak: number;
  ms: number;
  /** el video no cargó en su dispositivo: no pierde la racha */
  excused?: boolean;
  /* modo Poderes */
  power?: PowerId;
  /** poder que ganó con esta racha (o de consuelo, tras fallar tres seguidas) */
  earned?: PowerId;
  consolation?: boolean;
  /** falló con escudo y conservó la racha */
  shielded?: boolean;
  /** Dado: lo que salió */
  roll?: number;
  /** lo que sumó o restó su propio poder (Dado, Hongo, Estrella) */
  bonus?: number;
  /** ataques que recibió */
  hits?: { by: string; p: PowerId; pts: number }[];
  /** ataques que hizo */
  dealt?: { to: string; p: PowerId; pts: number }[];
  /** ataques que frenó con su Escudo o Estrella */
  blocked?: { by: string; p: PowerId; with: PowerId }[];
}

/** poder usado en la pregunta actual */
export interface PowerUse {
  p: PowerId;
  /** 50/50: opciones (índice en pantalla) que quedan tachadas */
  cut?: number[];
  /** Dado: lo que salió */
  roll?: number;
  /** ms desde que arrancó el reloj */
  at?: number;
  /** Plátano: cuántos habían respondido cuando lo tiró (lo pisa el siguiente) */
  after?: number;
}

/** un efecto en la pantalla de un jugador: de `from` a `until` (ms desde que arrancó el reloj) */
export interface Fx {
  p: FxId;
  by: string;
  from: number;
  until: number;
  /** Susto: la clave del screamer de YouTube (sin ella sale el susto propio) */
  clip?: string;
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
  /** vanilla: la partida de siempre; powers: con poderes (src/game/powers.ts) */
  variant: Variant;
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
  /** poderes usados en la pregunta actual, por jugador */
  used: Record<string, PowerUse>;
  /** Tinta, Susto, Revoltijo o De cabeza: lo que tiene encima cada jugador en esta pregunta */
  fx: Record<string, Fx>;
}

type Listener = (s: Snapshot) => void;

export class Match {
  private s: Snapshot;
  private reserves: string[] = [];
  private backups: string[] = [];
  /** videos que fallaron en esta ronda; con 2 (4 en Openings y OST) se asume que YouTube no responde en esta red */
  private mediaFails = 0;
  /** la ronda es toda de video (Openings, OST gaming): se insiste más antes de pasar a texto */
  private failLimit = 2;
  private startedAt = 0;
  private deadline = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private waitTimer: ReturnType<typeof setTimeout> | null = null;
  private nextTimer: ReturnType<typeof setTimeout> | null = null;
  private answers = new Map<string, { choice: number; ms: number }>();
  private mediaFailed = new Set<string>();
  /** modo Poderes: fallos seguidos de cada jugador, para el poder de consuelo */
  private misses = new Map<string, number>();
  private listeners = new Set<Listener>();

  constructor(mode: "solo" | "group", host: { id: string; name: string; seal: number }) {
    this.s = {
      v: 0,
      mode,
      variant: "vanilla",
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
      used: {},
      fx: {},
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
  /** se cambia entre partidas, no a mitad de una */
  setVariant(variant: Variant) {
    if (this.s.phase !== "lobby" && this.s.phase !== "final") return;
    this.emit({ variant });
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
    this.misses.clear();
    this.failLimit = ids.every((id) => BANK.byId[id].media) ? 4 : 2;
    this.emit({
      seed,
      ids,
      index: -1,
      replaced: 0,
      notice: null,
      players: this.s.players
        .filter((p) => p.online)
        .map((p) => ({ ...p, score: 0, streak: 0, best: 0, correct: 0, powers: this.s.variant === "powers" ? startHand(this.s.mode) : [] })),
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
    if (q.media && this.mediaFails >= this.failLimit) {
      // YouTube ya falló dos veces: no se hace esperar a nadie otra vez
      return this.replaceAt(index, "YouTube no responde en esta red. Seguimos con preguntas sin video.", true);
    }
    if (q.media) {
      this.emit({ phase: "loading", index, qid, order, duration, answered: [], mediaReady: [], reveal: null, used: {}, fx: {} });
      this.waitTimer = setTimeout(() => this.mediaTimeout(), MEDIA_WAIT_MS);
    } else {
      this.emit({ phase: "loading", index, qid, order, duration, answered: [], mediaReady: [], reveal: null, used: {}, fx: {} });
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
    if (this.mediaFails >= this.failLimit) {
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
    // con tinta encima no se puede responder (el celular ya lo bloquea; esto es por si acaso)
    const fx = this.s.fx[pid];
    if (fx?.p === "ink" && hostMs >= fx.from && hostMs < fx.until - GRACE_MS) return;
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
    const powers = this.s.variant === "powers";
    const used = powers ? this.s.used : {};
    // primero lo de cada uno; los ataques se cobran después, con el marcador de antes de esta pregunta
    for (const p of this.s.players) {
      const a = this.answers.get(p.id);
      const ok = !!a && this.s.order[a.choice] === 0;
      const excused = !a && this.mediaFailed.has(p.id);
      const use = used[p.id];
      const power = use?.p;
      const streak = ok ? p.streak + 1 : excused || power === "shield" ? p.streak : 0;
      const pick: Pick = { choice: a ? a.choice : null, ok, gained: 0, streak, ms: a?.ms ?? this.s.duration, excused };
      const frac = a ? Math.max(0, Math.min(1, 1 - a.ms / this.s.duration)) : 0;
      if (ok) {
        pick.gained = pointsFor(q.d, frac, streak);
        if (power === "mushroom") pick.bonus = Math.round((MUSHROOM_MAX - 100) * frac * multiplier(streak));
        if (power === "star") pick.bonus = Math.round(pick.gained * (STAR_MULT - 1));
        if (power === "double") pick.bonus = pick.gained;
      } else if (!excused && power === "double") pick.bonus = -DOUBLE_RISK;
      if (power === "dice" && use?.roll) {
        pick.roll = use.roll;
        pick.bonus = ok ? use.roll * DICE_PTS : excused ? 0 : -(use.roll * DICE_PTS) / 2;
      }
      pick.gained += pick.bonus ?? 0;
      if (power) {
        pick.power = power;
        if (power === "shield" && !ok && !excused && p.streak > 0) pick.shielded = true;
      }
      picks[p.id] = pick;
    }
    if (powers) {
      const ranking = [...this.s.players].sort((a, b) => b.score - a.score);
      const scoreOf = (id: string) => this.s.players.find((x) => x.id === id)!.score;
      /** un ataque de `from` a `to`: el Escudo y la Estrella lo frenan; con Boo los puntos pasan al que roba */
      const hit = (from: string, to: string | undefined, p: PowerId, pts: number, transfer = false) => {
        if (!to) return;
        const theirs = picks[to];
        const guard = used[to]?.p;
        if (to !== from && (guard === "shield" || guard === "star")) {
          theirs.blocked = [...(theirs.blocked ?? []), { by: from, p, with: guard }];
          return;
        }
        const amount = Math.min(pts, Math.max(0, scoreOf(to) + theirs.gained));
        if (!amount) return;
        theirs.gained -= amount;
        theirs.hits = [...(theirs.hits ?? []), { by: from, p, pts: amount }];
        if (transfer) picks[from].gained += amount;
        if (to !== from) picks[from].dealt = [...(picks[from].dealt ?? []), { to, p, pts: amount }];
      };
      for (const p of this.s.players) {
        const mine = picks[p.id];
        const others = ranking.filter((x) => x.id !== p.id);
        const at = ranking.findIndex((x) => x.id === p.id);
        if (mine.power === "steal" && mine.ok) hit(p.id, others[0]?.id, "steal", STEAL_PTS, true);
        else if (mine.power === "redShell") hit(p.id, (at > 0 ? ranking[at - 1] : others[0])?.id, "redShell", RED_PTS);
        else if (mine.power === "blueShell") hit(p.id, ranking[0]?.id, "blueShell", BLUE_PTS);
        else if (mine.power === "lightning") {
          for (const o of others) if (o.online) hit(p.id, o.id, "lightning", BOLT_PTS);
        } else if (mine.power === "banana") {
          // resbala el primero que respondió después de que lo tiró
          const first = [...this.answers.keys()].slice(used[p.id]?.after ?? 0).find((id) => id !== p.id);
          hit(p.id, first, "banana", BANANA_PTS);
        }
      }
    }
    const order = [...this.s.players].sort((a, b) => b.score - a.score);
    const final = new Map(this.s.players.map((p) => [p.id, Math.max(0, p.score + picks[p.id].gained)]));
    if (powers) {
      // Cambiazo: al final de todo, cambia el puntaje con el que va justo delante
      for (const p of this.s.players) {
        if (picks[p.id].power !== "swapScore") continue;
        const ahead = [...final].filter(([id, sc]) => id !== p.id && sc > final.get(p.id)!).sort((a, b) => a[1] - b[1])[0]?.[0];
        if (!ahead) continue;
        const guard = used[ahead]?.p;
        if (guard === "shield" || guard === "star") {
          picks[ahead].blocked = [...(picks[ahead].blocked ?? []), { by: p.id, p: "swapScore", with: guard }];
          continue;
        }
        const diff = final.get(ahead)! - final.get(p.id)!;
        final.set(ahead, final.get(p.id)!);
        final.set(p.id, final.get(p.id)! + diff);
        picks[ahead].hits = [...(picks[ahead].hits ?? []), { by: p.id, p: "swapScore", pts: diff }];
        picks[p.id].dealt = [...(picks[p.id].dealt ?? []), { to: ahead, p: "swapScore", pts: diff }];
      }
    }
    const players = this.s.players.map((p) => {
      const pick = picks[p.id];
      const score = final.get(p.id)!;
      pick.gained = score - p.score;
      let hand = p.powers;
      if (powers) {
        const cold = pick.ok ? 0 : pick.excused ? (this.misses.get(p.id) ?? 0) : (this.misses.get(p.id) ?? 0) + 1;
        const behind = order.findIndex((x) => x.id === p.id) >= Math.ceil(order.length / 2);
        const earn = pick.ok && pick.streak % EARN_EVERY === 0;
        const comfort = cold >= COLD_EVERY;
        if ((earn || comfort) && hand.length < MAX_HAND) {
          pick.earned = drawPower(this.s.mode, behind);
          if (!earn) pick.consolation = true;
          hand = [...hand, pick.earned];
        }
        this.misses.set(p.id, comfort ? 0 : cold);
      }
      return { ...p, score, streak: pick.streak, best: Math.max(p.best, pick.streak), correct: p.correct + (pick.ok ? 1 : 0), powers: hand };
    });
    this.emit({ phase: "reveal", reveal: { correct: correctDisplay, picks }, players });
    if (this.s.mode === "group") this.nextTimer = setTimeout(() => this.next(), AUTO_NEXT_MS + (q.media ? 2500 : 0));
  }

  /** modo Poderes: uno por pregunta, antes de responder */
  usePower(pid: string, index: number, power: PowerId) {
    if (this.s.variant !== "powers" || this.s.phase !== "question" || index !== this.s.index) return;
    // el Bloque ? no gasta el turno: se puede abrir y después usar otro
    if (this.answers.has(pid) || (this.s.used[pid] && power !== "mystery") || !POOL[this.s.mode].includes(power)) return;
    const player = this.s.players.find((p) => p.id === pid);
    if (!player || !player.powers.includes(power)) return;
    const hand = player.powers.slice();
    hand.splice(hand.indexOf(power), 1);
    const players = this.s.players.map((p) => (p.id === pid ? { ...p, powers: hand } : p));
    if (power === "swap") return this.swapCurrent(players);
    if (power === "mystery") {
      const order = [...this.s.players].sort((a, b) => b.score - a.score);
      const behind = order.findIndex((x) => x.id === pid) >= Math.ceil(order.length / 2);
      const prize: PowerId[] = [];
      while (prize.length < 2) {
        const d = drawPower(this.s.mode, behind);
        if (d !== "mystery") prize.push(d);
      }
      const full = [...hand, ...prize].slice(0, MAX_HAND);
      return this.emit({ players: this.s.players.map((p) => (p.id === pid ? { ...p, powers: full } : p)) });
    }
    const now = Date.now() - this.startedAt;
    const use: PowerUse = { p: power, at: now };
    if (power === "banana") use.after = this.answers.size;
    let fx = this.s.fx;
    if (power === "dice") use.roll = 1 + Math.floor(Math.random() * 6);
    else if (power === "half") {
      const wrong = [0, 1, 2, 3].filter((i) => this.s.order[i] !== 0);
      use.cut = shuffle(wrong, Math.random).slice(0, 2);
    } else if ((FX_POWERS as PowerId[]).includes(power)) {
      const kind = power as FxId;
      // el Susto llega cuando menos lo esperan; con screamer, un poco más tarde para que el video alcance a cargar
      const clips = kind === "scare" ? SCARE_KEYS.filter((k) => videoFor(k)) : [];
      const clip = clips.length ? clips[Math.floor(Math.random() * clips.length)] : undefined;
      const from = kind !== "scare" ? now : now + (clip ? 3000 + Math.floor(Math.random() * 3000) : 1000 + Math.floor(Math.random() * 2500));
      const until = from + (clip ? SCARE_CLIP_MS : FX_MS[kind]);
      fx = { ...fx };
      for (const p of this.active()) {
        const guard = this.s.used[p.id]?.p;
        if (p.id !== pid && !this.answers.has(p.id) && guard !== "shield" && guard !== "star") fx[p.id] = { p: kind, by: pid, from, until, ...(clip ? { clip } : {}) };
      }
    } else if ((power === "shield" || power === "star") && fx[pid]) {
      fx = { ...fx };
      delete fx[pid];
    }
    this.emit({ players, used: { ...this.s.used, [pid]: use }, fx });
  }

  /** Cambio (solo): otra pregunta, mejor sin video y de la misma dificultad */
  private swapCurrent(players: Player[]) {
    const now = this.s.qid ? BANK.byId[this.s.qid] : null;
    const taken = new Set(this.s.ids);
    const text = (id: string) => !BANK.byId[id].media && !taken.has(id);
    let i = this.reserves.findIndex((id) => text(id) && BANK.byId[id].d === now?.d);
    if (i < 0) i = this.reserves.findIndex(text);
    let next = i >= 0 ? this.reserves.splice(i, 1)[0] : undefined;
    if (!next) {
      const j = this.backups.findIndex(text);
      if (j >= 0) next = this.backups.splice(j, 1)[0];
    }
    // no hay con qué cambiarla: el poder no se gasta
    if (!next) return;
    const ids = this.s.ids.slice();
    ids[this.s.index] = next;
    this.emit({ ids, players, notice: POWER_LINES.swapped });
    this.goTo(this.s.index);
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
  return { id: p.id, name: p.name, seal: p.seal, score: 0, streak: 0, best: 0, correct: 0, online: true, powers: [] };
}
