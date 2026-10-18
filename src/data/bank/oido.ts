/* editorial-ui · Cristian Pérez · cristianperez.me
 * Openings (anime) y OST gaming (juegos): todas las preguntas suenan. Formato: [dificultad, pregunta, correcta, mala, mala, mala, media]
 */
import type { RawQuestion } from "../types";

const OP = "¿De qué anime es este opening?";
const OPB = "El opening se ve difuminado. ¿De qué anime es?";
const OST = "¿De qué videojuego es esta música?";

const bank: Record<string, RawQuestion[]> = {
  openings: [
    [1, OPB, "Naruto Shippuden", "Bleach", "One Piece", "Boruto", { k: "naruto-op-bluebird", m: "blur", s: 30, e: 52 }],
    [1, OP, "One Piece", "Fairy Tail", "Naruto", "Dragon Ball Super", { k: "op-op-weare", m: "audio", s: 30, e: 52 }],
    [1, OPB, "Dragon Ball Z", "Saint Seiya", "Yu Yu Hakusho", "Dragon Ball GT", { k: "db-op-chala", m: "blur", s: 30, e: 52 }],
    [1, OP, "Demon Slayer", "Jujutsu Kaisen", "Sword Art Online", "Fire Force", { k: "kimetsu-op-gurenge", m: "audio", s: 60, e: 82 }],
    [1, OP, "Attack on Titan", "Vinland Saga", "Tokyo Ghoul", "Kabaneri of the Iron Fortress", { k: "aot-op-guren", m: "audio", s: 30, e: 52 }],
    [1, OP, "Neon Genesis Evangelion", "Gurren Lagann", "Code Geass", "Darling in the Franxx", { k: "eva-op-thesis", m: "audio", s: 60, e: 82 }],
    [1, OP, "Tokyo Ghoul", "Parasyte", "Death Note", "Hellsing", { k: "tg-op-unravel", m: "audio", s: 25, e: 47 }],
    [2, OP, "Bleach", "Naruto", "Soul Eater", "D.Gray-man", { k: "bleach-op-asterisk", m: "audio", s: 30, e: 52 }],
    [2, OP, "Jujutsu Kaisen", "Chainsaw Man", "Hell's Paradise", "Mob Psycho 100", { k: "jjk-op-kaikai", m: "audio", s: 35, e: 57 }],
    [2, OP, "Chainsaw Man", "Jujutsu Kaisen", "Fire Force", "Tokyo Revengers", { k: "csm-op-kickback", m: "audio", s: 35, e: 57 }],
    [2, OP, "My Hero Academia", "Black Clover", "One Punch Man", "The Promised Neverland", { k: "mha-op-theday", m: "audio", s: 30, e: 52 }],
    [2, OP, "Death Note", "Code Geass", "Monster", "Psycho-Pass", { k: "dn-op-theworld", m: "audio", s: 50, e: 72 }],
    [2, OP, "Fullmetal Alchemist: Brotherhood", "Soul Eater", "Blue Exorcist", "D.Gray-man", { k: "fma-op-again", m: "audio", s: 60, e: 82 }],
    [2, OPB, "JoJo's Bizarre Adventure", "Hokuto no Ken", "Berserk", "Baki", { k: "jojo-op-sonochi", m: "blur", s: 30, e: 52 }],
    [2, OP, "Spy x Family", "Kaguya-sama", "Oshi no Ko", "Bocchi the Rock!", { k: "spy-op-mixednuts", m: "audio", s: 60, e: 82 }],
    [2, OP, "Frieren", "Mushoku Tensei", "Re:Zero", "Violet Evergarden", { k: "frieren-op-yuusha", m: "audio", s: 60, e: 82 }],
    [2, OP, "One Punch Man", "Mob Psycho 100", "My Hero Academia", "Gintama", { k: "opm-op-thehero", m: "audio", s: 30, e: 52 }],
    [3, OP, "Cowboy Bebop", "Samurai Champloo", "Trigun", "Lupin III", { k: "bebop-op-tank", m: "audio", s: 40, e: 62 }],
    [3, OP, "Code Geass", "Gundam 00", "Eureka Seven", "Guilty Crown", { k: "cg-op-colors", m: "audio", s: 60, e: 82 }],
    [3, OP, "Haikyuu!!", "Kuroko no Basket", "Blue Lock", "Yowamushi Pedal", { k: "haikyuu-op-imagination", m: "audio", s: 30, e: 52 }],
    [3, OP, "Solo Leveling", "The Eminence in Shadow", "Tower of God", "Overlord", { k: "solo-op-level", m: "audio", s: 30, e: 52 }],
    [3, OP, "Dandadan", "Mashle", "Hell's Paradise", "Kaiju No. 8", { k: "dandadan-op-otonoke", m: "audio", s: 30, e: 52 }],
    [3, OP, "Mob Psycho 100", "One Punch Man", "Gintama", "Saiki Kusuo", { k: "mob-op-99", m: "audio", s: 30, e: 52 }],
    [3, "Esto es un ending. ¿De qué anime es?", "Hunter x Hunter (2011)", "Yu Yu Hakusho", "Black Clover", "Fairy Tail", { k: "hxh-ed-justawake", m: "audio", s: 30, e: 52 }],
    [3, OP, "Naruto Shippuden", "Boruto", "Black Clover", "Fire Force", { k: "naruto-op-silhouette", m: "audio", s: 60, e: 82 }],
  ],
  soundtracks: [
    [1, OST, "Super Mario Odyssey", "Super Mario Galaxy", "Super Mario 64", "Super Mario Sunshine", { k: "mario-ost-jumpup", m: "audio", s: 15, e: 40 }],
    [1, OST, "Sonic the Hedgehog", "Super Mario Bros.", "Crash Bandicoot", "Mega Man", { k: "sonic-ost-greenhill", m: "audio", s: 0, e: 20 }],
    [1, OST, "Minecraft", "Terraria", "Stardew Valley", "Roblox", { k: "mc-ost-sweden", m: "audio", s: 0, e: 25 }],
    [1, OST, "Halo", "Destiny", "Gears of War", "Mass Effect", { k: "halo-ost-theme", m: "audio", s: 0, e: 25 }],
    [1, OST, "Pokémon", "Digimon", "Dragon Quest", "Yo-kai Watch", { k: "pokemon-ost-wildbattle", m: "audio", s: 0, e: 20 }],
    [1, OST, "Street Fighter II", "Tekken", "Mortal Kombat", "The King of Fighters", { k: "pelea-ost-guile", m: "audio", s: 0, e: 22 }],
    [1, OST, "Grand Theft Auto: San Andreas", "Saints Row 2", "Mafia", "Need for Speed: Underground", { k: "gta-ost-sa", m: "audio", s: 0, e: 22 }],
    [2, OST, "The Legend of Zelda: Ocarina of Time", "Final Fantasy VII", "Chrono Trigger", "Kingdom Hearts", { k: "zelda-ost-gerudo", m: "audio", s: 0, e: 22 }],
    [2, OST, "Hollow Knight", "Ori and the Blind Forest", "Celeste", "Dead Cells", { k: "hk-ost-cityoftears", m: "audio", s: 5, e: 30 }],
    [2, OST, "Super Smash Bros. Ultimate", "Mario Kart 8", "Kirby Star Allies", "Splatoon 3", { k: "smash-ost-lifelight", m: "audio", s: 20, e: 45 }],
    [2, OST, "The Witcher 3", "Skyrim", "Dragon Age: Inquisition", "Kingdom Come: Deliverance", { k: "witcher-ost-wolven", m: "audio", s: 10, e: 35 }],
    [2, OST, "God of War (2018)", "Assassin's Creed Valhalla", "Hellblade", "Skyrim", { k: "gow-ost-main", m: "audio", s: 20, e: 45 }],
    [2, OST, "The Last of Us", "Red Dead Redemption", "Days Gone", "Uncharted 4", { k: "tlou-ost-main", m: "audio", s: 0, e: 25 }],
    [2, OST, "Final Fantasy VII", "Kingdom Hearts", "Chrono Trigger", "Dark Souls", { k: "ff-ost-onewinged", m: "audio", s: 5, e: 30 }],
    [2, OST, "Metal Gear Solid 3", "007 GoldenEye", "Splinter Cell", "Hitman", { k: "mgs-ost-snakeeater", m: "audio", s: 0, e: 25 }],
    [2, "Esta canción sonó en una serie basada en un videojuego. ¿Cuál es el juego?", "League of Legends", "Dota 2", "Overwatch", "Valorant", { k: "lol-ost-enemy", m: "audio", s: 30, e: 55 }],
    [3, OST, "Red Dead Redemption", "The Last of Us", "Mafia III", "Far Cry 5", { k: "rdr-ost-faraway", m: "audio", s: 20, e: 45 }],
    [3, OST, "Red Dead Redemption 2", "The Last of Us Part II", "Days Gone", "Ghost of Tsushima", { k: "rdr-ost-thatstheway", m: "audio", s: 15, e: 40 }],
    [3, OST, "Dark Souls", "Bloodborne", "Demon's Souls", "Elden Ring", { k: "souls-ost-gwyn", m: "audio", s: 0, e: 25 }],
    [3, OST, "Final Fantasy X", "Final Fantasy VII", "Kingdom Hearts", "Xenoblade Chronicles", { k: "ff-ost-zanarkand", m: "audio", s: 0, e: 25 }],
    [3, OST, "Resident Evil", "Silent Hill", "Dead Space", "Alone in the Dark", { k: "re-ost-saferoom", m: "audio", s: 0, e: 25 }],
    [3, OST, "Cyberpunk 2077", "Deus Ex", "Watch Dogs 2", "Ghostrunner", { k: "cyber-ost-neverfade", m: "audio", s: 10, e: 35 }],
    [3, "Esta canción fue el himno de un Mundial de esports. ¿De qué juego?", "League of Legends", "Dota 2", "Counter-Strike", "Fortnite", { k: "lol-ost-warriors", m: "audio", s: 20, e: 45 }],
    [1, "Mira el tráiler difuminado. ¿Qué juego es?", "Grand Theft Auto VI", "Grand Theft Auto V", "Watch Dogs", "Mafia", { k: "gta-tr-vi", m: "blur", s: 15, e: 40 }],
  ],
};

export default bank;
