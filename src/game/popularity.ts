/* editorial-ui · Cristian Pérez · cristianperez.me
 * Qué tan conocida es cada categoría. Se usa donde el azar elige por la persona (la ruleta y los "al azar"):
 * lo que casi todos conocen sale más seguido, pero sin tapar al resto. Lo que la persona marca a mano no cambia.
 *   1,9 = lo conoce casi todo el mundo · 1,35 = muy conocido · 1 = el resto (nicho o de nostalgia)
 */
const FAMOUS = [
  // anime
  "dragonball", "onepiece", "naruto", "bleach", "aot", "jjk", "kimetsu", "mha", "deathnote", "pokemonanime",
  // juegos
  "mario", "zelda", "pokemon", "minecraft", "gta", "fortnite", "sonic", "cod", "lol",
  // series y películas
  "simpsons", "breakingbad", "got", "strangerthings", "friends", "starwars", "harrypotter", "mcu", "pixar", "disney",
  // cultura general y la música/póster de cada lado
  "historia", "geografia", "ciencia", "deportes", "cine", "musica", "openings", "soundtracks",
];
const KNOWN = [
  // anime
  "hxh", "fma", "jojo", "tokyoghoul", "haikyuu", "opm", "csm", "spyfamily", "frieren", "bluelock", "digimon", "saintseiya", "sailormoon", "eva", "codegeass", "yugioh", "doraemon", "sao", "posteranime",
  // juegos
  "ff", "witcher", "souls", "genshin", "rdr", "assassins", "gow", "tlou", "re", "spiderman", "valorant", "overwatch", "smash", "amongus", "crash", "animalcrossing", "undertale", "hollowknight", "cyberpunk", "posterjuegos", "stardew", "terraria",
  // series y películas
  "casadepapel", "chavo", "theoffice", "merlina", "squidgame", "rickmorty", "bobesponja", "southpark", "avatar", "peaky", "narcos", "theboys", "lotr", "shrek", "rapidos", "batman", "piratas", "jurassic", "ghibli", "matrix", "nolan", "posterseries",
];
const W: Record<string, number> = {};
for (const id of KNOWN) W[id] = 1.35;
for (const id of FAMOUS) W[id] = 1.9;

export const popularity = (cat: string) => W[cat] ?? 1;
