/* editorial-ui · Cristian Pérez · cristianperez.me
 * Más preguntas con video: openings, OST gaming y temas de series y películas.
 * Las claves están en src/data/video-sources.json y sus videoIds en videos.json.
 */
import type { RawQuestion } from "../types";

const OP = "¿De qué anime es este opening?";
const OPB = "El opening se ve difuminado. ¿De qué anime es?";
const OST = "¿De qué videojuego es esta música?";

const bank: Record<string, RawQuestion[]> = {
  openings: [
    [1, OP, "Naruto", "Bleach", "D.Gray-man", "Black Clover", { k: "naruto-op-harukakanata", m: "audio", s: 30, e: 52 }],
    [2, OP, "Dragon Ball Super", "Dragon Ball Z", "Dragon Ball GT", "Dragon Ball Daima", { k: "dbs-op-chozetsu", m: "audio", s: 30, e: 52 }],
    [3, OP, "Hunter x Hunter (1999)", "Hunter x Hunter (2011)", "Yu Yu Hakusho", "Rurouni Kenshin", { k: "hxh99-op-ohayou", m: "audio", s: 15, e: 37 }],
    [1, OPB, "Inuyasha", "Rurouni Kenshin", "Ranma ½", "Yu Yu Hakusho", { k: "inuyasha-op-changetheworld", m: "blur", s: 40, e: 62 }],
    [1, OP, "Yu Yu Hakusho", "Rurouni Kenshin", "Saint Seiya", "Slam Dunk", { k: "yyh-op-hohoemi", m: "audio", s: 30, e: 52 }],
    [2, "¿Quién canta este opening?", "Kōji Wada", "Hironobu Kageyama", "Ichirō Mizuki", "Rica Matsumoto", { k: "digimon-op-butterfly", m: "audio", s: 3, e: 25 }],
    [1, OPB, "Pokémon", "Digimon Adventure", "Yu-Gi-Oh!", "Beyblade", { k: "pokemon-op-mezase", m: "blur", s: 3, e: 25 }],
    [3, OP, "Fullmetal Alchemist (2003)", "Fullmetal Alchemist: Brotherhood", "Soul Eater", "D.Gray-man", { k: "fma03-op-melissa", m: "audio", s: 40, e: 62 }],
    [2, OP, "Soul Eater", "D.Gray-man", "Blue Exorcist", "Fire Force", { k: "souleater-op-resonance", m: "audio", s: 30, e: 52 }],
    [2, OP, "Black Clover", "Fairy Tail", "Magi", "Mashle", { k: "blackclover-op-harukamirai", m: "audio", s: 30, e: 52 }],
    [2, "¿Quién canta este opening?", "Official HIGE DANdism", "King Gnu", "Kenshi Yonezu", "Vaundy", { k: "tokrev-op-crybaby", m: "audio", s: 30, e: 52 }],
    [2, OP, "Kaguya-sama: Love is War", "Toradora!", "Horimiya", "Nisekoi", { k: "kaguya-op-lovedramatic", m: "audio", s: 40, e: 62 }],
    [1, "¿Quién canta este opening?", "YOASOBI", "Ado", "Aimer", "LiSA", { k: "oshinoko-op-idol", m: "audio", s: 20, e: 42 }],
    [2, OP, "Bocchi the Rock!", "K-On!", "Girls Band Cry", "Oshi no Ko", { k: "bocchi-op-seishun", m: "audio", s: 30, e: 52 }],
    [3, OP, "Hell's Paradise", "Dororo", "Chainsaw Man", "Sakamoto Days", { k: "hellsparadise-op-work", m: "audio", s: 30, e: 52 }],
    [2, OP, "Mashle", "Black Clover", "Wind Breaker", "Sakamoto Days", { k: "mashle-op-bbb", m: "audio", s: 20, e: 42 }],
    [2, OPB, "Gurren Lagann", "Kill la Kill", "Code Geass", "Darling in the Franxx", { k: "gurren-op-sorairo", m: "blur", s: 40, e: 62 }],
    [3, OP, "Steins;Gate", "Erased", "Psycho-Pass", "Re:Zero", { k: "steinsgate-op-hacking", m: "audio", s: 30, e: 52 }],
    [2, OP, "Fire Force", "Demon Slayer", "Blue Exorcist", "Jujutsu Kaisen", { k: "fireforce-op-inferno", m: "audio", s: 30, e: 52 }],
    [2, OP, "Dr. Stone", "The Promised Neverland", "Food Wars!", "Cells at Work!", { k: "drstone-op-goodmorning", m: "audio", s: 30, e: 52 }],
    [3, "Es el primer opening de Re:Zero. ¿Cómo se llama?", "Redo", "Paradisus-Paradoxum", "Realize", "Long shot", { k: "rezero-op-redo", m: "audio", s: 30, e: 52 }],
    [2, OP, "Your Lie in April", "Anohana", "Clannad", "Toradora!", { k: "kimiuso-op-hikarunara", m: "audio", s: 30, e: 52 }],
  ],
  soundtracks: [
    [1, OST, "Tetris", "Pac-Man", "Space Invaders", "Dr. Mario", { k: "tetris-ost-korobeiniki", m: "audio", s: 2, e: 24 }],
    [1, OST, "Super Mario Bros.", "Donkey Kong", "Kirby's Adventure", "Mega Man 2", { k: "smb-ost-overworld", m: "audio", s: 0, e: 20 }],
    [1, OST, "The Legend of Zelda", "Metroid", "Final Fantasy", "Dragon Quest", { k: "zelda-ost-main", m: "audio", s: 0, e: 22 }],
    [1, OST, "Skyrim", "The Witcher 3", "Dragon Age: Inquisition", "God of War (2018)", { k: "skyrim-ost-dragonborn", m: "audio", s: 25, e: 48 }],
    [2, "¿Cómo se llama este tema de Undertale?", "Megalovania", "Hopes and Dreams", "Spear of Justice", "Death by Glamour", { k: "undertale-ost-megalovania", m: "audio", s: 0, e: 22 }],
    [2, "¿Qué personaje canta esta canción de los créditos de Portal?", "GLaDOS", "Wheatley", "Chell", "Cave Johnson", { k: "portal-ost-stillalive", m: "audio", s: 5, e: 27 }],
    [3, "¿Quién compuso este tema de DOOM (2016)?", "Mick Gordon", "Andrew Hulshult", "Jesper Kyd", "Marty O'Donnell", { k: "doom-ost-bfg", m: "audio", s: 60, e: 85 }],
    [2, OST, "Katamari Damacy", "PaRappa the Rapper", "Patapon", "LocoRoco", { k: "katamari-ost-rocks", m: "audio", s: 0, e: 25 }],
    [3, "¿Qué banda canta este tema de Sonic Adventure 2?", "Crush 40", "Dreams Come True", "Hyper Potions", "DragonForce", { k: "sa2-ost-liveandlearn", m: "audio", s: 0, e: 22 }],
    [3, OST, "Celeste", "Hollow Knight", "Ori and the Blind Forest", "Undertale", { k: "celeste-ost-resurrections", m: "audio", s: 5, e: 30 }],
    [2, OST, "Terraria", "Minecraft", "Stardew Valley", "Starbound", { k: "terraria-ost-day", m: "audio", s: 0, e: 22 }],
    [3, OST, "Donkey Kong Country", "Super Mario World", "Banjo-Kazooie", "Yoshi's Island", { k: "dkc-ost-aquatic", m: "audio", s: 0, e: 25 }],
    [3, OST, "Chrono Trigger", "Final Fantasy VI", "Secret of Mana", "Dragon Quest V", { k: "chrono-ost-main", m: "audio", s: 0, e: 22 }],
    [1, "Esta fanfarria suena al ganar un combate. ¿De qué saga es?", "Final Fantasy", "Dragon Quest", "Pokémon", "Kingdom Hearts", { k: "ff-ost-victory", m: "audio", s: 0, e: 18 }],
    [1, OST, "Mortal Kombat", "Street Fighter", "Tekken", "Killer Instinct", { k: "mk-ost-techno", m: "audio", s: 0, e: 22 }],
    [2, "¿De qué consola es esta música de la tienda?", "Wii", "Nintendo DS", "GameCube", "Wii U", { k: "wii-ost-shop", m: "audio", s: 0, e: 22 }],
    [1, OST, "Among Us", "Fall Guys", "Roblox", "Brawl Stars", { k: "amongus-ost-theme", m: "audio", s: 5, e: 28 }],
    [2, OST, "Kirby", "Yoshi's Story", "Super Mario World", "Pokémon Pinball", { k: "kirby-ost-greengreens", m: "audio", s: 0, e: 20 }],
    [2, OST, "Plants vs. Zombies", "Angry Birds", "Cut the Rope", "Fruit Ninja", { k: "pvz-ost-grasswalk", m: "audio", s: 10, e: 32 }],
    [1, OST, "Angry Birds", "Plants vs. Zombies", "Cut the Rope", "Subway Surfers", { k: "angrybirds-ost-theme", m: "audio", s: 0, e: 20 }],
    [1, OST, "Wii Sports", "Mario Party 8", "Wii Play", "Mario Kart Wii", { k: "wiisports-ost-title", m: "audio", s: 0, e: 22 }],
  ],
  cod: [
    [3, "¿Qué compositor de cine hizo este tema de Modern Warfare 2 (2009)?", "Hans Zimmer", "Harry Gregson-Williams", "Brian Tyler", "Jack Wall", { k: "cod-ost-mw2", m: "audio", s: 20, e: 45 }],
    [2, "Mira el tráiler difuminado. ¿Qué Call of Duty presenta?", "Black Ops 6", "Black Ops Cold War", "Modern Warfare III", "Vanguard", { k: "cod-tr-bo6", m: "blur", s: 10, e: 32 }],
  ],
  fortnite: [
    [3, "Mira el tráiler difuminado. ¿De qué capítulo de Fortnite es?", "Capítulo 2", "Capítulo 1", "Capítulo 3", "Capítulo 4", { k: "fortnite-tr-ch2", m: "blur", s: 15, e: 37 }],
    [3, "Otro tráiler difuminado. ¿De qué capítulo de Fortnite es?", "Capítulo 4", "Capítulo 2", "Capítulo 3", "Capítulo 5", { k: "fortnite-tr-ch4", m: "blur", s: 15, e: 37 }],
  ],
  chavo: [
    [3, "La melodía de esta entrada se basa en una marcha turca. ¿De qué compositor?", "Beethoven", "Mozart", "Bach", "Chopin", { k: "chavo-intro", m: "audio", s: 3, e: 25 }],
  ],
  theoffice: [
    [2, "¿Qué instrumento lleva la melodía de este tema de entrada?", "Piano", "Ukulele", "Guitarra eléctrica", "Saxofón", { k: "theoffice-intro", m: "audio", s: 0, e: 22 }],
  ],
  walkingdead: [
    [3, "¿Quién compuso este tema de entrada?", "Bear McCreary", "Ramin Djawadi", "Gustavo Santaolalla", "Hans Zimmer", { k: "twd-intro", m: "audio", s: 3, e: 25 }],
  ],
  merlina: [
    [3, "¿Qué banda grabó la canción de este baile?", "The Cramps", "The Misfits", "Ramones", "The Damned", { k: "merlina-dance", m: "clip", s: 15, e: 37 }],
    [2, "¿En qué evento del colegio baila Merlina en esta escena?", "El baile Rave'N", "La Copa Poe", "La fiesta de Halloween", "La noche de bienvenida", { k: "merlina-dance", m: "clip", s: 10, e: 32 }],
  ],
  avatar: [
    [2, "Mira la intro difuminada. ¿Qué personaje la narra?", "Katara", "Sokka", "Aang", "Iroh", { k: "avatar-intro", m: "blur", s: 0, e: 22 }],
  ],
  peaky: [
    [2, "Suena el tema de entrada. ¿En qué ciudad inglesa transcurre la serie?", "Birmingham", "Manchester", "Liverpool", "Londres", { k: "peaky-intro", m: "audio", s: 20, e: 42 }],
  ],
  shrek: [
    [2, "¿En qué año se estrenó la película que abre con esta canción?", "2001", "1999", "2003", "2004", { k: "shrek-allstar", m: "audio", s: 45, e: 67 }],
    [2, "¿Qué personaje canta esto en el final de Shrek 2?", "El Hada Madrina", "El Príncipe Encantador", "Lord Farquaad", "Fiona", { k: "shrek2-hero", m: "audio", s: 90, e: 112 }],
  ],
  rapidos: [
    [2, "¿Al final de qué película de la saga suena esta canción?", "Rápidos y furiosos 7", "Rápidos y furiosos 6", "Rápidos y furiosos 8", "Rápidos y furiosos 5", { k: "rapidos-seeyouagain", m: "audio", s: 10, e: 32 }],
    [3, "¿Qué grupo japonés canta este tema de la saga?", "Teriyaki Boyz", "Orange Range", "ONE OK ROCK", "Def Tech", { k: "rapidos-tokyodrift", m: "audio", s: 25, e: 47 }],
  ],
  batman: [
    [2, "¿Quién dirigió la película de Batman que tiene este tema?", "Tim Burton", "Joel Schumacher", "Christopher Nolan", "Sam Raimi", { k: "batman-ost-1989", m: "audio", s: 10, e: 32 }],
    [2, "¿De qué película de Batman es este tema?", "The Batman (2022)", "Batman inicia (2005)", "El caballero de la noche (2008)", "Batman v Superman (2016)", { k: "batman-ost-2022", m: "audio", s: 0, e: 25 }],
  ],
  piratas: [
    [2, "¿Cómo se llama este tema?", "He's a Pirate", "The Medallion Calls", "Up Is Down", "One Day", { k: "piratas-ost-hesapirate", m: "audio", s: 0, e: 22 }],
    [3, "¿A qué personaje pertenece este tema?", "Davy Jones", "Jack Sparrow", "Barbossa", "Calypso", { k: "piratas-ost-davyjones", m: "audio", s: 5, e: 30 }],
  ],
  jurassic: [
    [2, "Mira el tráiler difuminado. ¿Qué película de la saga presenta?", "Jurassic World (2015)", "Jurassic World: El reino caído", "Jurassic World: Dominio", "Jurassic Park III", { k: "jurassic-tr-world", m: "blur", s: 20, e: 42 }],
    [2, "¿Quién compuso este tema?", "John Williams", "Michael Giacchino", "Hans Zimmer", "James Horner", { k: "cine-ost-jurassic", m: "audio", s: 0, e: 25 }],
  ],
  disney: [
    [3, "¿Quién canta esta versión latina?", "Carmen Sarahí", "Danna Paola", "Belinda", "Gisela", { k: "disney-libresoy", m: "audio", s: 55, e: 77 }],
    [1, "¿De qué película de Disney es esta canción?", "El Rey León", "Tarzán", "Mulán", "El libro de la selva", { k: "disney-hakuna", m: "audio", s: 40, e: 62 }],
  ],
};

export default bank;
