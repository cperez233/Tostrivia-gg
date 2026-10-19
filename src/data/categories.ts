/* editorial-ui · Cristian Pérez · cristianperez.me
 * Familias: anime por año de estreno del anime; juegos por género; series y películas aparte.
 * Los openings van con anime y el OST con juegos. El póster de cada categoría está en src/assets/covers/<id>.webp.
 */
import type { Category, Family, FamilyId, GroupId } from "./types";

export const GROUPS: { id: GroupId; name: string }[] = [
  { id: "anime", name: "Anime" },
  { id: "juegos", name: "Videojuegos" },
  { id: "series", name: "Series y películas" },
  { id: "cultura", name: "Cultura general" },
];

export const FAMILIES: Family[] = [
  { id: "openings", group: "anime", name: "Openings" },
  { id: "clasicos", group: "anime", name: "Clásicos" },
  { id: "d2010", group: "anime", name: "Los de la década de 2010" },
  { id: "nuevos", group: "anime", name: "De 2020 para acá" },
  { id: "ost", group: "juegos", name: "OST gaming" },
  { id: "aventura", group: "juegos", name: "Aventura y plataformas" },
  { id: "rol", group: "juegos", name: "Rol" },
  { id: "mundo", group: "juegos", name: "Mundo abierto y sandbox" },
  { id: "accion", group: "juegos", name: "Acción" },
  { id: "shooter", group: "juegos", name: "Shooters" },
  { id: "versus", group: "juegos", name: "Pelea y MOBA" },
  { id: "series", group: "series", name: "Series" },
  { id: "peliculas", group: "series", name: "Películas" },
  { id: "cultura", group: "cultura", name: "Cultura general" },
];

export const CATEGORIES: Category[] = [
  // Openings: todas las preguntas suenan
  { id: "openings", name: "Openings de anime", short: "Openings", family: "openings", mosaic: ["jojo", "aot", "kimetsu", "onepiece"], sfx: "♪" },

  // Anime clásico: el anime se estrenó antes de 2010
  { id: "dragonball", name: "Dragon Ball", short: "Dragon Ball", family: "clasicos", sfx: "ドドド" },
  { id: "onepiece", name: "One Piece", short: "One Piece", family: "clasicos", sfx: "ドン" },
  { id: "naruto", name: "Naruto", short: "Naruto", family: "clasicos", sfx: "ドン" },
  { id: "bleach", name: "Bleach", short: "Bleach", family: "clasicos", sfx: "ザン" },
  { id: "hxh", name: "Hunter x Hunter", short: "HxH", family: "clasicos", sfx: "ゴゴ" },
  { id: "fma", name: "Fullmetal Alchemist", short: "Fullmetal", family: "clasicos", sfx: "バチ" },
  { id: "deathnote", name: "Death Note", short: "Death Note", family: "clasicos", sfx: "カリ" },
  { id: "codegeass", name: "Code Geass", short: "Code Geass", family: "clasicos", sfx: "キン" },
  { id: "eva", name: "Evangelion", short: "Evangelion", family: "clasicos", sfx: "ギギ" },
  { id: "bebop", name: "Cowboy Bebop", short: "Bebop", family: "clasicos", sfx: "バン" },
  { id: "saintseiya", name: "Los Caballeros del Zodiaco", short: "Caballeros", family: "clasicos", sfx: "ゴゴ" },
  { id: "sailormoon", name: "Sailor Moon", short: "Sailor Moon", family: "clasicos", sfx: "キラ" },
  { id: "fairytail", name: "Fairy Tail", short: "Fairy Tail", family: "clasicos", sfx: "ボォ" },

  // Década de 2010
  { id: "jojo", name: "JoJo's Bizarre Adventure", short: "JoJo", family: "d2010", sfx: "ゴゴゴ" },
  { id: "aot", name: "Attack on Titan", short: "Shingeki", family: "d2010", sfx: "ドォン" },
  { id: "tokyoghoul", name: "Tokyo Ghoul", short: "Tokyo Ghoul", family: "d2010", sfx: "ガリ" },
  { id: "haikyuu", name: "Haikyuu!!", short: "Haikyuu!!", family: "d2010", sfx: "バシ" },
  { id: "opm", name: "One Punch Man", short: "One Punch", family: "d2010", sfx: "パン" },
  { id: "mha", name: "My Hero Academia", short: "My Hero", family: "d2010", sfx: "ドカ" },
  { id: "mob", name: "Mob Psycho 100", short: "Mob Psycho", family: "d2010", sfx: "ゴゴ" },
  { id: "kimetsu", name: "Demon Slayer", short: "Kimetsu", family: "d2010", sfx: "シュ" },
  { id: "sao", name: "Sword Art Online", short: "SAO", family: "d2010", sfx: "キン" },
  { id: "vinland", name: "Vinland Saga", short: "Vinland", family: "d2010", sfx: "ザッ" },

  // De 2020 para acá
  { id: "jjk", name: "Jujutsu Kaisen", short: "Jujutsu", family: "nuevos", sfx: "ズン" },
  { id: "csm", name: "Chainsaw Man", short: "Chainsaw", family: "nuevos", sfx: "ブイーン" },
  { id: "spyfamily", name: "Spy x Family", short: "Spy×Family", family: "nuevos", sfx: "ワク" },
  { id: "frieren", name: "Frieren", short: "Frieren", family: "nuevos", sfx: "シン" },
  { id: "sololeveling", name: "Solo Leveling", short: "Solo Leveling", family: "nuevos", sfx: "ゴゴ" },
  { id: "dandadan", name: "Dandadan", short: "Dandadan", family: "nuevos", sfx: "ダダン" },
  { id: "bluelock", name: "Blue Lock", short: "Blue Lock", family: "nuevos", sfx: "ドン" },

  // OST gaming: todas las preguntas suenan
  { id: "soundtracks", name: "Música de videojuegos", short: "OST gaming", family: "ost", mosaic: ["rdr", "mario", "hollowknight", "sonic"], sfx: "♪" },

  // Aventura y plataformas
  { id: "mario", name: "Super Mario", short: "Mario", family: "aventura" },
  { id: "zelda", name: "The Legend of Zelda", short: "Zelda", family: "aventura" },
  { id: "sonic", name: "Sonic", short: "Sonic", family: "aventura" },
  { id: "hollowknight", name: "Hollow Knight", short: "Hollow Knight", family: "aventura" },
  { id: "crash", name: "Crash Bandicoot", short: "Crash", family: "aventura" },

  // Rol
  { id: "pokemon", name: "Pokémon", short: "Pokémon", family: "rol" },
  { id: "ff", name: "Final Fantasy", short: "Final Fantasy", family: "rol" },
  { id: "witcher", name: "The Witcher", short: "Witcher", family: "rol" },
  { id: "souls", name: "Elden Ring y Souls", short: "Souls", family: "rol" },
  { id: "genshin", name: "Genshin Impact", short: "Genshin", family: "rol" },
  { id: "cyberpunk", name: "Cyberpunk 2077", short: "Cyberpunk", family: "rol" },
  { id: "kingdomhearts", name: "Kingdom Hearts", short: "Kingdom Hearts", family: "rol" },
  { id: "persona", name: "Persona", short: "Persona", family: "rol" },

  // Mundo abierto y sandbox
  { id: "gta", name: "Grand Theft Auto", short: "GTA", family: "mundo" },
  { id: "rdr", name: "Red Dead Redemption", short: "Red Dead", family: "mundo" },
  { id: "minecraft", name: "Minecraft", short: "Minecraft", family: "mundo" },
  { id: "assassins", name: "Assassin's Creed", short: "Assassin's", family: "mundo" },
  { id: "animalcrossing", name: "Animal Crossing", short: "Animal Crossing", family: "mundo" },

  // Acción
  { id: "gow", name: "God of War", short: "God of War", family: "accion" },
  { id: "tlou", name: "The Last of Us", short: "Last of Us", family: "accion" },
  { id: "re", name: "Resident Evil", short: "Resident Evil", family: "accion" },
  { id: "mgs", name: "Metal Gear Solid", short: "Metal Gear", family: "accion" },
  { id: "spiderman", name: "Marvel's Spider-Man", short: "Spider-Man", family: "accion" },

  // Shooters
  { id: "halo", name: "Halo", short: "Halo", family: "shooter" },
  { id: "cod", name: "Call of Duty", short: "CoD", family: "shooter" },
  { id: "fortnite", name: "Fortnite", short: "Fortnite", family: "shooter" },
  { id: "valorant", name: "Valorant", short: "Valorant", family: "shooter" },
  { id: "overwatch", name: "Overwatch", short: "Overwatch", family: "shooter" },
  { id: "counterstrike", name: "Counter-Strike", short: "Counter-Strike", family: "shooter" },

  // Pelea y MOBA
  { id: "smash", name: "Super Smash Bros.", short: "Smash", family: "versus" },
  { id: "pelea", name: "Juegos de pelea", short: "Pelea", family: "versus" },
  { id: "lol", name: "League of Legends", short: "LoL", family: "versus" },

  // Series
  { id: "simpsons", name: "Los Simpson", short: "Los Simpson", family: "series" },
  { id: "breakingbad", name: "Breaking Bad", short: "Breaking Bad", family: "series" },
  { id: "got", name: "Juego de Tronos", short: "Juego de Tronos", family: "series" },
  { id: "strangerthings", name: "Stranger Things", short: "Stranger Things", family: "series" },
  { id: "friends", name: "Friends", short: "Friends", family: "series" },
  { id: "casadepapel", name: "La casa de papel", short: "Casa de papel", family: "series" },
  { id: "chavo", name: "El Chavo del 8", short: "El Chavo", family: "series" },
  { id: "theoffice", name: "The Office", short: "The Office", family: "series" },
  { id: "walkingdead", name: "The Walking Dead", short: "Walking Dead", family: "series" },
  { id: "merlina", name: "Merlina", short: "Merlina", family: "series" },
  { id: "avatar", name: "Avatar: la leyenda de Aang", short: "Avatar", family: "series" },
  { id: "peaky", name: "Peaky Blinders", short: "Peaky Blinders", family: "series" },

  // Películas
  { id: "starwars", name: "Star Wars", short: "Star Wars", family: "peliculas" },
  { id: "harrypotter", name: "Harry Potter", short: "Harry Potter", family: "peliculas" },
  { id: "mcu", name: "Marvel: los Vengadores", short: "Vengadores", family: "peliculas" },
  { id: "lotr", name: "El Señor de los Anillos", short: "Señor Anillos", family: "peliculas" },
  { id: "pixar", name: "Pixar", short: "Pixar", family: "peliculas" },
  { id: "disney", name: "Clásicos de Disney", short: "Disney", family: "peliculas" },
  { id: "shrek", name: "Shrek", short: "Shrek", family: "peliculas" },
  { id: "rapidos", name: "Rápidos y furiosos", short: "Rápidos", family: "peliculas" },
  { id: "batman", name: "Batman en el cine", short: "Batman", family: "peliculas" },
  { id: "piratas", name: "Piratas del Caribe", short: "Piratas", family: "peliculas" },
  { id: "jurassic", name: "Jurassic Park", short: "Jurassic Park", family: "peliculas" },

  // Cultura general
  { id: "historia", name: "Historia", short: "Historia", family: "cultura" },
  { id: "geografia", name: "Geografía", short: "Geografía", family: "cultura" },
  { id: "ciencia", name: "Ciencia", short: "Ciencia", family: "cultura" },
  { id: "deportes", name: "Deportes", short: "Deportes", family: "cultura" },
  { id: "cine", name: "Cine", short: "Cine", family: "cultura" },
  { id: "musica", name: "Música", short: "Música", family: "cultura" },
];

export const CATEGORY_BY_ID: Record<string, Category> = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
export const FAMILY_BY_ID = Object.fromEntries(FAMILIES.map((f) => [f.id, f])) as Record<FamilyId, Family>;
export const categoriesOf = (f: FamilyId) => CATEGORIES.filter((c) => c.family === f);
export const groupOf = (cat: string): GroupId => FAMILY_BY_ID[CATEGORY_BY_ID[cat].family].group;
export const familiesOf = (g: GroupId) => FAMILIES.filter((f) => f.group === g);
