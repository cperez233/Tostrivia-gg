/* editorial-ui · Cristian Pérez · cristianperez.me */
import type { Category, Family, FamilyId } from "./types";

export const FAMILIES: Family[] = [
  { id: "cultura", name: "Cultura general", wheel: "Cultura", tone: "dots", blurb: "Historia, geografía, ciencia, deportes, cine y música." },
  { id: "leyenda", name: "Shōnen de leyenda", wheel: "Leyendas", tone: "lines", blurb: "Los que llenaron la Jump durante décadas." },
  { id: "nueva", name: "Nueva era", wheel: "Nueva era", tone: "bigdots", blurb: "Lo que se estrenó después de 2015 y no deja de sonar." },
  { id: "culto", name: "Culto y seinen", wheel: "Culto", tone: "cross", blurb: "Clásicos raros, obras maestras y los que te rompen la cabeza." },
  { id: "oido", name: "Al oído", wheel: "Al oído", tone: "hlines", blurb: "Suena un opening o una banda sonora. Tú adivinas." },
  { id: "nintendo", name: "Consolas clásicas", wheel: "Clásicos", tone: "checker", blurb: "Nintendo, Sega y las sagas que crecieron contigo." },
  { id: "aaa", name: "Mundos abiertos y sagas", wheel: "Sagas", tone: "vlines", blurb: "Rockstar, FromSoftware, Santa Monica y compañía." },
  { id: "online", name: "Online y competitivo", wheel: "Online", tone: "grid", blurb: "Partidas rankeadas, construcciones y gachas." },
];

export const CATEGORIES: Category[] = [
  // Cultura general
  { id: "historia", name: "Historia", family: "cultura", blurb: "De Mesopotamia a la Guerra Fría." },
  { id: "geografia", name: "Geografía", family: "cultura", blurb: "Capitales, ríos, fronteras y mapas." },
  { id: "ciencia", name: "Ciencia", family: "cultura", blurb: "Física, química, biología y espacio." },
  { id: "deportes", name: "Deportes", family: "cultura", blurb: "Fútbol, Juegos Olímpicos y más." },
  { id: "cine", name: "Cine", family: "cultura", blurb: "Directores, Óscar y bandas sonoras." },
  { id: "musica", name: "Música", family: "cultura", blurb: "Del rock al reguetón." },

  // Shōnen de leyenda
  { id: "jojo", name: "JoJo's Bizarre Adventure", family: "leyenda", blurb: "Stands, poses y la sangre Joestar.", sfx: "ゴゴゴ" },
  { id: "naruto", name: "Naruto", family: "leyenda", blurb: "Konoha, Akatsuki y el camino ninja.", sfx: "ドン" },
  { id: "dragonball", name: "Dragon Ball", family: "leyenda", blurb: "Saiyajin, esferas y transformaciones.", sfx: "ドドド" },
  { id: "onepiece", name: "One Piece", family: "leyenda", blurb: "Piratas, frutas del diablo y el One Piece.", sfx: "ドン" },
  { id: "bleach", name: "Bleach", family: "leyenda", blurb: "Shinigamis, zanpakutō y bankai.", sfx: "ザン" },
  { id: "hxh", name: "Hunter x Hunter", family: "leyenda", blurb: "Nen, licencias y la Hormiga Quimera.", sfx: "ゴゴ" },
  { id: "fma", name: "Fullmetal Alchemist", family: "leyenda", blurb: "Equivalencia, homúnculos y la Verdad.", sfx: "バチ" },

  // Nueva era
  { id: "kimetsu", name: "Demon Slayer", family: "nueva", blurb: "Respiraciones, Pilares y Muzan.", sfx: "シュ" },
  { id: "jjk", name: "Jujutsu Kaisen", family: "nueva", blurb: "Maldiciones, técnicas y expansiones de dominio.", sfx: "ズン" },
  { id: "csm", name: "Chainsaw Man", family: "nueva", blurb: "Demonios, contratos y Pochita.", sfx: "ブイーン" },
  { id: "mha", name: "My Hero Academia", family: "nueva", blurb: "Dones, la U.A. y el One For All.", sfx: "ドカ" },
  { id: "spyfamily", name: "Spy x Family", family: "nueva", blurb: "Twilight, Yor, Anya y la operación Strix.", sfx: "ワク" },
  { id: "frieren", name: "Frieren", family: "nueva", blurb: "Lo que pasa después de derrotar al Rey Demonio.", sfx: "シン" },
  { id: "sololeveling", name: "Solo Leveling", family: "nueva", blurb: "Portales, cazadores y el Monarca de las Sombras.", sfx: "ゴゴ" },
  { id: "dandadan", name: "Dandadan", family: "nueva", blurb: "Fantasmas, alienígenas y Okarun.", sfx: "ダダン" },

  // Culto y seinen
  { id: "aot", name: "Attack on Titan", family: "culto", blurb: "Murallas, titanes y la libertad.", sfx: "ドォン" },
  { id: "deathnote", name: "Death Note", family: "culto", blurb: "Kira, L y una libreta.", sfx: "カリ" },
  { id: "opm", name: "One Punch Man", family: "culto", blurb: "Saitama, la Asociación de Héroes y un puñetazo.", sfx: "パン" },
  { id: "eva", name: "Evangelion", family: "culto", blurb: "NERV, Ángeles y el Proyecto de Instrumentalización.", sfx: "ギギ" },
  { id: "bebop", name: "Cowboy Bebop", family: "culto", blurb: "Cazarrecompensas, jazz y See you space cowboy.", sfx: "バン" },
  { id: "codegeass", name: "Code Geass", family: "culto", blurb: "Zero, el Geass y los Knightmare Frames.", sfx: "キン" },
  { id: "tokyoghoul", name: "Tokyo Ghoul", family: "culto", blurb: "Ghouls, kagune y el café Anteiku.", sfx: "ガリ" },
  { id: "mob", name: "Mob Psycho 100", family: "culto", blurb: "Mob, Reigen y el porcentaje que sube.", sfx: "ゴゴ" },
  { id: "haikyuu", name: "Haikyuu!!", family: "culto", blurb: "Karasuno y el voleibol más intenso.", sfx: "バシ" },

  // Al oído
  { id: "openings", name: "Openings de anime", family: "oido", blurb: "Suena el opening con la pantalla tapada. ¿De qué anime es?", sfx: "♪" },
  { id: "soundtracks", name: "Bandas sonoras gamer", family: "oido", blurb: "Suena la música de un juego. ¿Cuál es?", sfx: "♪" },

  // Consolas clásicas
  { id: "zelda", name: "The Legend of Zelda", family: "nintendo", blurb: "Hyrule, la Trifuerza y Ganon." },
  { id: "pokemon", name: "Pokémon", family: "nintendo", blurb: "Regiones, tipos y ¿quién es ese Pokémon?" },
  { id: "mario", name: "Super Mario", family: "nintendo", blurb: "El Reino Champiñón y sus tuberías." },
  { id: "sonic", name: "Sonic", family: "nintendo", blurb: "Anillos, esmeraldas y velocidad." },
  { id: "smash", name: "Super Smash Bros.", family: "nintendo", blurb: "Peleadores, escenarios y Final Smash." },
  { id: "hollowknight", name: "Hollow Knight", family: "nintendo", blurb: "Hallownest, el Caballero y Silksong." },
  { id: "pelea", name: "Juegos de pelea", family: "nintendo", blurb: "Street Fighter, Tekken y Mortal Kombat." },

  // Mundos abiertos y sagas
  { id: "gta", name: "Grand Theft Auto", family: "aaa", blurb: "Liberty City, Vice City, San Andreas y Los Santos." },
  { id: "rdr", name: "Red Dead Redemption", family: "aaa", blurb: "Arthur, John y la banda de Van der Linde." },
  { id: "witcher", name: "The Witcher", family: "aaa", blurb: "Geralt, Ciri y el Camino." },
  { id: "souls", name: "Elden Ring y Souls", family: "aaa", blurb: "FromSoftware: morir, aprender, repetir." },
  { id: "gow", name: "God of War", family: "aaa", blurb: "Kratos, Atreus y dos panteones." },
  { id: "tlou", name: "The Last of Us", family: "aaa", blurb: "Joel, Ellie y los infectados." },
  { id: "halo", name: "Halo", family: "aaa", blurb: "El Jefe Maestro, Cortana y el Covenant." },
  { id: "ff", name: "Final Fantasy", family: "aaa", blurb: "Cristales, chocobos y espadas imposibles." },
  { id: "re", name: "Resident Evil", family: "aaa", blurb: "Umbrella, Raccoon City y zombis." },
  { id: "mgs", name: "Metal Gear Solid", family: "aaa", blurb: "Snake, cajas de cartón y Kojima." },
  { id: "cyberpunk", name: "Cyberpunk 2077", family: "aaa", blurb: "Night City, V y Johnny Silverhand." },

  // Online y competitivo
  { id: "minecraft", name: "Minecraft", family: "online", blurb: "Bloques, creepers y el End." },
  { id: "fortnite", name: "Fortnite", family: "online", blurb: "Battle bus, temporadas y bailes." },
  { id: "lol", name: "League of Legends", family: "online", blurb: "Runaterra, campeones y Worlds." },
  { id: "genshin", name: "Genshin Impact", family: "online", blurb: "Teyvat, elementos y deseos." },
  { id: "valorant", name: "Valorant", family: "online", blurb: "Agentes, Spike y rondas." },
  { id: "overwatch", name: "Overwatch", family: "online", blurb: "Héroes, cargas y Overwatch 2." },
  { id: "cod", name: "Call of Duty", family: "online", blurb: "Modern Warfare, Black Ops y Warzone." },
];

export const CATEGORY_BY_ID: Record<string, Category> = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
export const FAMILY_BY_ID = Object.fromEntries(FAMILIES.map((f) => [f.id, f])) as Record<FamilyId, Family>;
export const categoriesOf = (f: FamilyId) => CATEGORIES.filter((c) => c.family === f);
