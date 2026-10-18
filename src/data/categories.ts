/* editorial-ui · Cristian Pérez · cristianperez.me
 * Familias: anime por año de estreno del anime; juegos por género.
 */
import type { Category, Family, FamilyId, GroupId } from "./types";

export const GROUPS: { id: GroupId; name: string }[] = [
  { id: "anime", name: "Anime" },
  { id: "juegos", name: "Videojuegos" },
  { id: "oido", name: "Al oído" },
  { id: "cultura", name: "Cultura general" },
];

export const FAMILIES: Family[] = [
  { id: "clasicos", group: "anime", name: "Clásicos" },
  { id: "d2010", group: "anime", name: "Los de la década de 2010" },
  { id: "nuevos", group: "anime", name: "De 2020 para acá" },
  { id: "aventura", group: "juegos", name: "Aventura y plataformas" },
  { id: "rol", group: "juegos", name: "Rol" },
  { id: "mundo", group: "juegos", name: "Mundo abierto y sandbox" },
  { id: "accion", group: "juegos", name: "Acción" },
  { id: "shooter", group: "juegos", name: "Shooters" },
  { id: "versus", group: "juegos", name: "Pelea y MOBA" },
  { id: "oido", group: "oido", name: "Adivina por la música" },
  { id: "cultura", group: "cultura", name: "Cultura general" },
];

export const CATEGORIES: Category[] = [
  // Anime clásico: el anime se estrenó antes de 2010
  { id: "dragonball", name: "Dragon Ball", short: "Dragon Ball", family: "clasicos", cover: "db-op-chala", focus: 72, sfx: "ドドド" },
  { id: "onepiece", name: "One Piece", short: "One Piece", family: "clasicos", cover: "op-op-weare", focus: 64, sfx: "ドン" },
  { id: "naruto", name: "Naruto", short: "Naruto", family: "clasicos", cover: "naruto-op-bluebird", focus: 50, sfx: "ドン" },
  { id: "bleach", name: "Bleach", short: "Bleach", family: "clasicos", cover: "bleach-op-asterisk", focus: 50, sfx: "ザン" },
  { id: "hxh", name: "Hunter x Hunter", short: "HxH", family: "clasicos", cover: "hxh-op-departure", focus: 62, sfx: "ゴゴ" },
  { id: "fma", name: "Fullmetal Alchemist", short: "Fullmetal", family: "clasicos", cover: "fma-op-again", focus: 30, sfx: "バチ" },
  { id: "deathnote", name: "Death Note", short: "Death Note", family: "clasicos", cover: "dn-op-whatsup", focus: 50, sfx: "カリ" },
  { id: "codegeass", name: "Code Geass", short: "Code Geass", family: "clasicos", cover: "cover-codegeass", focus: 50, sfx: "キン" },
  { id: "eva", name: "Evangelion", short: "Evangelion", family: "clasicos", cover: "eva-op-thesis", focus: 50, sfx: "ギギ" },
  { id: "bebop", name: "Cowboy Bebop", short: "Bebop", family: "clasicos", cover: "bebop-op-tank", focus: 50, sfx: "バン" },

  // Década de 2010
  { id: "jojo", name: "JoJo's Bizarre Adventure", short: "JoJo", family: "d2010", cover: "jojo-op-sonochi", focus: 50, sfx: "ゴゴゴ" },
  { id: "aot", name: "Attack on Titan", short: "Shingeki", family: "d2010", cover: "aot-op-guren", focus: 50, sfx: "ドォン" },
  { id: "tokyoghoul", name: "Tokyo Ghoul", short: "Tokyo Ghoul", family: "d2010", cover: "tg-op-unravel", focus: 50, sfx: "ガリ" },
  { id: "haikyuu", name: "Haikyuu!!", short: "Haikyuu!!", family: "d2010", cover: "haikyuu-op-imagination", focus: 50, sfx: "バシ" },
  { id: "opm", name: "One Punch Man", short: "One Punch", family: "d2010", cover: "opm-op-thehero", focus: 45, sfx: "パン" },
  { id: "mha", name: "My Hero Academia", short: "My Hero", family: "d2010", cover: "mha-op-theday", focus: 32, sfx: "ドカ" },
  { id: "mob", name: "Mob Psycho 100", short: "Mob Psycho", family: "d2010", cover: "mob-op-99", focus: 45, sfx: "ゴゴ" },
  { id: "kimetsu", name: "Demon Slayer", short: "Kimetsu", family: "d2010", cover: "kimetsu-op-gurenge", focus: 58, sfx: "シュ" },

  // De 2020 para acá
  { id: "jjk", name: "Jujutsu Kaisen", short: "Jujutsu", family: "nuevos", cover: "jjk-op-kaikai", focus: 42, sfx: "ズン" },
  { id: "csm", name: "Chainsaw Man", short: "Chainsaw", family: "nuevos", cover: "csm-op-kickback", focus: 50, sfx: "ブイーン" },
  { id: "spyfamily", name: "Spy x Family", short: "Spy×Family", family: "nuevos", cover: "cover-spyfamily", focus: 58, sfx: "ワク" },
  { id: "frieren", name: "Frieren", short: "Frieren", family: "nuevos", cover: "frieren-op-yuusha", focus: 62, sfx: "シン" },
  { id: "sololeveling", name: "Solo Leveling", short: "Solo Leveling", family: "nuevos", cover: "solo-op-level", focus: 50, sfx: "ゴゴ" },
  { id: "dandadan", name: "Dandadan", short: "Dandadan", family: "nuevos", cover: "dandadan-op-otonoke", focus: 38, sfx: "ダダン" },

  // Aventura y plataformas
  { id: "mario", name: "Super Mario", short: "Mario", family: "aventura", cover: "mario-tr-wonder", focus: 56 },
  { id: "zelda", name: "The Legend of Zelda", short: "Zelda", family: "aventura", cover: "zelda-tr-totk", focus: 62 },
  { id: "sonic", name: "Sonic", short: "Sonic", family: "aventura", cover: "sonic-ost-greenhill", focus: 50 },
  { id: "hollowknight", name: "Hollow Knight", short: "Hollow Knight", family: "aventura", cover: "hk-ost-cityoftears", focus: 50 },

  // Rol
  { id: "pokemon", name: "Pokémon", short: "Pokémon", family: "rol", cover: "pokemon-tr-sv", focus: 50 },
  { id: "ff", name: "Final Fantasy", short: "Final Fantasy", family: "rol", cover: "cover-ff", focus: 42 },
  { id: "witcher", name: "The Witcher", short: "Witcher", family: "rol", cover: "witcher-tr-killing", focus: 50 },
  { id: "souls", name: "Elden Ring y Souls", short: "Souls", family: "rol", cover: "souls-tr-erdtree", focus: 50 },
  { id: "genshin", name: "Genshin Impact", short: "Genshin", family: "rol", cover: "genshin-tr-raiden", focus: 45 },
  { id: "cyberpunk", name: "Cyberpunk 2077", short: "Cyberpunk", family: "rol", cover: "cyber-ost-neverfade", focus: 60 },

  // Mundo abierto y sandbox
  { id: "gta", name: "Grand Theft Auto", short: "GTA", family: "mundo", cover: "gta-tr-vi", focus: 50 },
  { id: "rdr", name: "Red Dead Redemption", short: "Red Dead", family: "mundo", cover: "rdr-ost-thatstheway", focus: 30 },
  { id: "minecraft", name: "Minecraft", short: "Minecraft", family: "mundo", cover: "cover-minecraft", focus: 50 },

  // Acción
  { id: "gow", name: "God of War", short: "God of War", family: "accion", cover: "gow-ost-main", focus: 45 },
  { id: "tlou", name: "The Last of Us", short: "Last of Us", family: "accion", cover: "tlou-ost-main", focus: 40 },
  { id: "re", name: "Resident Evil", short: "Resident Evil", family: "accion", cover: "re-ost-saferoom", focus: 50 },
  { id: "mgs", name: "Metal Gear Solid", short: "Metal Gear", family: "accion", cover: "cover-mgs", focus: 34 },

  // Shooters
  { id: "halo", name: "Halo", short: "Halo", family: "shooter", cover: "cover-halo", focus: 30 },
  { id: "cod", name: "Call of Duty", short: "CoD", family: "shooter", cover: "cover-cod", focus: 50 },
  { id: "fortnite", name: "Fortnite", short: "Fortnite", family: "shooter", cover: "cover-fortnite", focus: 50 },
  { id: "valorant", name: "Valorant", short: "Valorant", family: "shooter", cover: "valorant-tr-neon", focus: 40 },
  { id: "overwatch", name: "Overwatch", short: "Overwatch", family: "shooter", cover: "ow-tr-dragons", focus: 40 },

  // Pelea y MOBA
  { id: "smash", name: "Super Smash Bros.", short: "Smash", family: "versus", cover: "smash-tr-sora", focus: 56 },
  { id: "pelea", name: "Juegos de pelea", short: "Pelea", family: "versus", cover: "pelea-ost-guile", focus: 55 },
  { id: "lol", name: "League of Legends", short: "LoL", family: "versus", cover: "lol-ost-enemy", focus: 60 },

  // Al oído
  { id: "openings", name: "Openings de anime", short: "Openings", family: "oido", cover: ["jojo-op-sonochi", "aot-op-guren", "kimetsu-op-gurenge", "op-op-weare"], sfx: "♪" },
  { id: "soundtracks", name: "Música de videojuegos", short: "OST gamer", family: "oido", cover: ["rdr-ost-thatstheway", "mario-ost-jumpup", "hk-ost-cityoftears", "sonic-ost-greenhill"], sfx: "♪" },

  // Cultura general
  { id: "historia", name: "Historia", short: "Historia", family: "cultura", cover: "cover-historia", focus: 50 },
  { id: "geografia", name: "Geografía", short: "Geografía", family: "cultura", cover: "cover-geografia", focus: 30 },
  { id: "ciencia", name: "Ciencia", short: "Ciencia", family: "cultura", cover: "cover-ciencia", focus: 50 },
  { id: "deportes", name: "Deportes", short: "Deportes", family: "cultura", cover: "cover-deportes", focus: 36 },
  { id: "cine", name: "Cine", short: "Cine", family: "cultura", cover: "cine-ost-starwars", focus: 50 },
  { id: "musica", name: "Música", short: "Música", family: "cultura", cover: "musica-queen-bohemian", focus: 50 },
];

export const CATEGORY_BY_ID: Record<string, Category> = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
export const FAMILY_BY_ID = Object.fromEntries(FAMILIES.map((f) => [f.id, f])) as Record<FamilyId, Family>;
export const categoriesOf = (f: FamilyId) => CATEGORIES.filter((c) => c.family === f);
export const groupOf = (cat: string): GroupId => FAMILY_BY_ID[CATEGORY_BY_ID[cat].family].group;
export const familiesOf = (g: GroupId) => FAMILIES.filter((f) => f.group === g);
