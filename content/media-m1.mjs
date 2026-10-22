const N = null;
const OP = "¿De qué anime es este opening?";
const OPe = "Which anime is this opening from?";
const OST = "¿De qué videojuego es esta música?";
const OSTe = "Which video game is this music from?";
export default {
  openings: [
    [2, OP, "Madoka Magica", "Mirai Nikki", "Higurashi", "Fate/Zero", [OPe, N, N, N, N], { k: "madoka-op-connect", m: "audio", s: 40, e: 62 }],
    [3, OP, "Samurai Champloo", "Afro Samurai", "Trigun", "Gintama", [OPe, N, N, N, N], { k: "champloo-op-battlecry", m: "audio", s: 25, e: 47 }],
    [3, OP, "Death Parade", "Another", "Mirai Nikki", "Hell Girl", [OPe, N, N, N, N], { k: "deathparade-op-flyers", m: "audio", s: 25, e: 47 }],
    [2, OP, "Parasyte: The Maxim", "Tokyo Ghoul", "Elfen Lied", "Claymore", [OPe, N, N, N, N], { k: "parasyte-op-letmehear", m: "audio", s: 30, e: 52 }],
    [3, OP, "Psycho-Pass", "Ghost in the Shell", "Serial Experiments Lain", "Ergo Proxy", [OPe, N, N, N, N], { k: "psychopass-op-abnormalize", m: "audio", s: 30, e: 52 }],
    [2, OP, "Overlord", "Log Horizon", "Mushoku Tensei", "Sword Art Online", [OPe, N, N, N, N], { k: "overlord-op-clattanoia", m: "audio", s: 25, e: 47 }],
    [2, OP, "KonoSuba", "Re:Zero", "No Game No Life", "The Rising of the Shield Hero", [OPe, N, N, N, N], { k: "konosuba-op-fantasticdreamer", m: "audio", s: 25, e: 47 }],
  ],
  soundtracks: [
    [2, OST, "Persona 5", "Catherine", "Shin Megami Tensei V", "Yakuza 0", [OSTe, N, N, N, N], { k: "persona5-ost-lifewillchange", m: "audio", s: 10, e: 35 }],
    [2, OST, "Doom", "Quake", "Wolfenstein 3D", "Duke Nukem 3D", [OSTe, N, N, N, N], { k: "doom-ost-atdoomsgate", m: "audio", s: 0, e: 22 }],
    [2, OST, "Stardew Valley", "Harvest Moon", "Cozy Grove", "Slime Rancher", [OSTe, N, N, N, N], { k: "stardew-ost-overture", m: "audio", s: 20, e: 45 }],
    [3, OST, "Mega Man 2", "Castlevania", "Contra", "Ninja Gaiden", [OSTe, N, N, N, N], { k: "megaman2-ost-wily1", m: "audio", s: 0, e: 22 }],
    [3, OST, "NieR: Automata", "Final Fantasy XV", "Bayonetta", "Astral Chain", [OSTe, N, N, N, N], { k: "nier-ost-cityruins", m: "audio", s: 10, e: 35 }],
    [3, OST, "Shovel Knight", "Cave Story", "Celeste", "Mega Man 11", [OSTe, N, N, N, N], { k: "shovelknight-ost-striketheearth", m: "audio", s: 0, e: 25 }],
  ],
};
