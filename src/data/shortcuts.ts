/* editorial-ui · Cristian Pérez · cristianperez.me
 * Atajos: mezclas ya armadas con categorías que se parecen (el Big 3, los clásicos de la infancia, Nintendo…).
 * Tocar uno equivale a marcar esas categorías en "Varias a la vez". Los ids viajan como cualquier mezcla (src/game/mix.ts),
 * así que los invitados lo resuelven igual; las categorías que no tengan preguntas suficientes se saltan solas.
 */
import type { GroupId } from "./types";
import { translateFields } from "../i18n";

export interface Shortcut {
  id: string;
  /** en qué pestaña sale; "todas" sale en las cuatro */
  group: GroupId | "todas";
  name: string;
  /** una línea que dice qué trae */
  blurb: string;
  cats: string[];
}

export const SHORTCUTS: Shortcut[] = [
  // Anime
  { id: "big3", group: "anime", name: "El Big 3", blurb: "Naruto, One Piece y Bleach", cats: ["naruto", "onepiece", "bleach"] },
  { id: "shonen", group: "anime", name: "Shonen top", blurb: "Los que todo el mundo vio", cats: ["dragonball", "onepiece", "naruto", "bleach", "hxh", "mha", "jjk", "kimetsu", "aot"] },
  { id: "infancia", group: "anime", name: "Infancia de tarde", blurb: "Caballeros, Pokémon, Digimon, Sailor Moon…", cats: ["dragonball", "saintseiya", "pokemonanime", "digimon", "sailormoon", "yugioh", "doraemon"] },
  { id: "ahora", group: "anime", name: "Los del momento", blurb: "Lo más visto de los últimos años", cats: ["jjk", "csm", "spyfamily", "frieren", "bluelock", "dandadan", "sololeveling", "kimetsu"] },
  { id: "obras", group: "anime", name: "Obras maestras", blurb: "Death Note, Monster, FMA, HxH, Code Geass…", cats: ["deathnote", "monster", "fma", "hxh", "codegeass", "steinsgate", "bebop", "eva", "vinland"] },
  { id: "isekai", group: "anime", name: "Isekai y fantasía", blurb: "SAO, Re:Zero, KonoSuba, Black Clover, Frieren…", cats: ["sao", "rezero", "konosuba", "blackclover", "frieren", "sololeveling", "fairytail"] },
  { id: "risas", group: "anime", name: "Comedia y romance", blurb: "Kaguya, KonoSuba, Ranma, Spy×Family, Bocchi…", cats: ["kaguya", "konosuba", "ranma", "spyfamily", "bocchi", "oshinoko", "doraemon"] },
  { id: "deporte", group: "anime", name: "Anime deportivo", blurb: "Haikyuu, Slam Dunk y Blue Lock", cats: ["haikyuu", "slamdunk", "bluelock"] },

  // Videojuegos
  { id: "nintendo", group: "juegos", name: "Nintendo", blurb: "Mario, Zelda, Pokémon, Smash y Animal Crossing", cats: ["mario", "zelda", "pokemon", "smash", "animalcrossing"] },
  { id: "todosjuegan", group: "juegos", name: "Los que todos jugaron", blurb: "Minecraft, GTA, Fortnite, Mario, Pokémon…", cats: ["minecraft", "gta", "fortnite", "mario", "pokemon", "zelda", "sonic", "cod"] },
  { id: "abiertos", group: "juegos", name: "Mundos abiertos épicos", blurb: "GTA, Red Dead, Witcher, Skyrim, Elden Ring…", cats: ["gta", "rdr", "witcher", "skyrim", "assassins", "cyberpunk", "souls"] },
  { id: "cine", group: "juegos", name: "Juegos de película", blurb: "Last of Us, God of War, Spider-Man, RDR, MGS…", cats: ["tlou", "gow", "spiderman", "rdr", "mgs", "re"] },
  { id: "competitivo", group: "juegos", name: "Competitivos", blurb: "Valorant, Overwatch, CS, LoL y Fortnite", cats: ["valorant", "overwatch", "counterstrike", "lol", "fortnite", "cod"] },
  { id: "indie", group: "juegos", name: "Indies que enamoran", blurb: "Hollow Knight, Undertale, Stardew, Hades, Cuphead…", cats: ["hollowknight", "undertale", "stardew", "terraria", "cuphead", "hades"] },
  { id: "artemando", group: "juegos", name: "Arte con mando", blurb: "Los más aclamados: Witcher, Red Dead, Last of Us…", cats: ["witcher", "rdr", "tlou", "gow", "souls", "hades", "hollowknight", "undertale", "portal", "zelda"] },
  { id: "retro", group: "juegos", name: "Infancia gamer", blurb: "Mario, Sonic, Crash, Pokémon y Los Sims", cats: ["mario", "sonic", "crash", "pokemon", "zelda", "sims", "minecraft"] },

  // Series y películas
  { id: "sitcoms", group: "series", name: "Sitcoms", blurb: "Friends, The Office, HIMYM y Brooklyn 99", cats: ["friends", "theoffice", "himym", "brooklyn99", "betty"] },
  { id: "netflix", group: "series", name: "Las de maratón", blurb: "Stranger Things, La casa de papel, Calamar…", cats: ["strangerthings", "bettercallsaul", "casadepapel", "squidgame", "merlina", "narcos", "peaky", "theboys"] },
  { id: "animadas", group: "series", name: "Animadas", blurb: "Simpson, South Park, Rick y Morty, Bob Esponja…", cats: ["simpsons", "southpark", "rickmorty", "bobesponja", "gravityfalls", "adventuretime", "avatar"] },
  { id: "blockbusters", group: "series", name: "Taquillazos", blurb: "Star Wars, Harry Potter, Vengadores, Jurassic…", cats: ["starwars", "harrypotter", "mcu", "lotr", "jurassic", "piratas", "rapidos"] },
  { id: "escine", group: "series", name: "¡Es cine!", blurb: "Lo mejor según la crítica: Breaking Bad, Saul, Nolan…", cats: ["breakingbad", "bettercallsaul", "got", "peaky", "nolan", "lotr", "ghibli", "matrix", "pixar"] },
  { id: "familia", group: "series", name: "Para toda la familia", blurb: "Pixar, Disney, Shrek y Ghibli", cats: ["pixar", "disney", "shrek", "ghibli"] },
  { id: "epicas", group: "series", name: "Fantasía épica", blurb: "Juego de Tronos, Casa del dragón, Anillos, Harry Potter", cats: ["got", "hotd", "lotr", "harrypotter"] },

  // Cultura general
  { id: "escuela", group: "cultura", name: "Lo de la escuela", blurb: "Historia, Geografía y Ciencia", cats: ["historia", "geografia", "ciencia"] },
  { id: "entretiene", group: "cultura", name: "Entretenimiento", blurb: "Cine, Música y Deportes", cats: ["cine", "musica", "deportes"] },

  // En todas las pestañas
  { id: "famosos", group: "todas", name: "Lo más famoso de todo", blurb: "Naruto, Mario, Minecraft, Los Simpson, Star Wars…", cats: ["naruto", "dragonball", "onepiece", "mario", "pokemon", "minecraft", "simpsons", "starwars", "harrypotter"] },
];

// los nombres se leen en el idioma de la interfaz (ver src/i18n)
for (const s of SHORTCUTS) translateFields(s, ["name", "blurb"]);
