/* editorial-ui · Cristian Pérez · cristianperez.me
 * Reglas compartidas por fetch-videos.mjs (con API key) y find-videos.mjs (sin key):
 * qué canales cuentan como oficiales, qué títulos se descartan y cómo se ordenan los candidatos.
 */

export const norm = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’`]/g, "'");

export const OFFICIAL = [
  "crunchyroll", "vizmedia", "viz media", "aniplex", "toho animation", "tohoanimation", "mappa", "ufotable",
  "funimation", "netflix anime", "kadokawa", "toei animation", "muse asia", "ani-one", "pony canyon",
  "sony music", "lisa official", "king gnu", "yoasobi", "kenshi yonezu", "米津玄師", "official hige dandism",
  "nintendo", "playstation", "xbox", "rockstar games", "cd projekt red", "the witcher", "bandai namco",
  "riot games", "league of legends", "valorant", "genshin impact", "overwatch", "blizzard", "sega", "sonic the hedgehog",
  "capcom", "fromsoftware", "square enix", "konami", "minecraft", "c418", "epic games", "fortnite",
  "queen official", "luisfonsivevo", "vevo", "imagine dragons", "jamproject", "warner bros", "universal pictures",
  "star wars", "lucasfilm", "halo", "bethesda", "seatbelts", "flying dog", "victor entertainment",
  "netflix", "hbo", "max latinoamerica", "disney", "pixar", "marvel", "ubisoft", "atlus", "activision", "valve",
  "counter-strike", "insomniac", "naughty dog", "the simpsons", "sony pictures", "toei animation", "aniplex usa",
];
export const BANNED = [
  "cover", "reaction", "reaccion", "react", "nightcore", "remix", "8 bit", "8-bit", "1 hour", "10 hours", "1 hora",
  "slowed", "sped up", "tutorial", "karaoke", "guitar", "drum", "fandub", "lyrics prank", "amv", "mashup",
  "ranking", "dank", "parody", "parodia", "leak", "leaked", "top 10", "top 20", "tier list", "loop", "extended", "earrape", "bass boosted", "ost compilation",
  "full album", "playlist", "session", "jazz", "arrangement", "acapella", "a cappella", "but it", "but its", "every time", "reacts", "reactions", "epic version", "italian version", "muppet", "dissecting", "analizando", "things you missed", "voice-over", "voz de", "ateez", "gta iv", "just another", "tribute", "orchestral cover", "lofi", "lo-fi", "explained", "analysis", "breakdown", "theme was", "music theory", "vs", "piano tutorial", "meme", "short", "shorts",
];

export function score(v, src) {
  const t = norm(v.title);
  const ch = norm(v.channel);
  let s = 0;
  for (const group of src.must || []) {
    const ok = group.split("|").some((w) => t.includes(norm(w)));
    if (!ok) return -Infinity;
    s += 3;
  }
  const word = (w) => new RegExp(`(^|[^a-z0-9])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`);
  if ([...BANNED, ...(src.ban || [])].some((b) => word(norm(b)).test(t) && !norm(src.q).includes(norm(b)))) return -Infinity;
  if (OFFICIAL.some((o) => ch.includes(o))) s += 6;
  if (/creditless|textless|official|oficial|non-credit|clean/.test(t)) s += 2;
  s += Math.log10(Number(v.views || 1));
  return s;
}

/** ISO 8601 PT#H#M#S -> segundos */
export function seconds(iso = "") {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  return m ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0) : 0;
}

/** openings y endings: versión TV o videoclip; nada de análisis de 10 minutos */
export const defaultMax = (src) => (/opening|ending/i.test(src.q) ? 330 : /trailer|short/i.test(src.q) ? 400 : 600);

