/* editorial-ui · Cristian Pérez · cristianperez.me
 * Preguntas con video para las categorías que entraron después: openings, temas y tráilers.
 * Las claves están en src/data/video-sources.json y sus videoIds en videos.json.
 */
import type { RawQuestion } from "../types";

const bank: Record<string, RawQuestion[]> = {
  saintseiya: [
    [1, "¿Cómo se llama este opening?", "Pegasus Fantasy", "Soldier Dream", "Blue Forever", "Chikyūgi", { k: "saintseiya-op-pegasus", m: "audio", s: 4, e: 26 }],
    [2, "Suena otro opening de la serie clásica. ¿Cuál es?", "Soldier Dream", "Pegasus Fantasy", "Blue Dream", "Megami no Senshi", { k: "saintseiya-op-soldier", m: "audio", s: 20, e: 42 }],
  ],
  sailormoon: [
    [1, "¿Cómo se llama esta canción de Sailor Moon?", "Moonlight Densetsu", "Moon Revenge", "Sailor Star Song", "Ai no Senshi", { k: "sailormoon-op-moonlight", m: "audio", s: 3, e: 25 }],
    [2, "Este tema es el de la etapa de las Sailor Starlights. ¿Cómo se llama?", "Sailor Star Song", "Moonlight Densetsu", "Moon Pride", "Otome no Policy", { k: "sailormoon-op-starsong", m: "audio", s: 3, e: 25 }],
  ],
  fairytail: [
    [2, "¿Cómo se llama este primer opening?", "Snow Fairy", "Fiesta", "Strike Back", "Masayume Chasing", { k: "fairytail-op-snowfairy", m: "audio", s: 25, e: 47 }],
    [3, "¿Quién compuso este tema principal?", "Yasuharu Takanashi", "Hiroyuki Sawano", "Yuki Kajiura", "Kohei Tanaka", { k: "fairytail-ost-main", m: "audio", s: 5, e: 30 }],
  ],
  sao: [
    [1, "¿Cómo se llama este opening?", "Crossing Field", "Innocence", "Ignite", "Adamas", { k: "sao-op-crossing", m: "audio", s: 20, e: 42 }],
    [2, "¿De qué arco es este opening?", "Alicization", "Aincrad", "Fairy Dance", "Phantom Bullet", { k: "sao-op-adamas", m: "audio", s: 20, e: 42 }],
  ],
  vinland: [
    [2, "¿Cómo se llama este opening?", "Mukanjyo", "Dark Crow", "River", "Paradox", { k: "vinland-op-mukanjyo", m: "audio", s: 3, e: 25 }],
    [2, "¿Quién canta este ending?", "Aimer", "LiSA", "Eir Aoi", "milet", { k: "vinland-ed-torches", m: "audio", s: 3, e: 25 }],
  ],
  bluelock: [
    [2, "¿Quién canta este opening?", "UNISON SQUARE GARDEN", "SPYAIR", "King Gnu", "Survive Said the Prophet", { k: "bluelock-op-chaos", m: "audio", s: 15, e: 37 }],
    [3, "¿Cómo se llama este segundo opening?", "Judgement", "Chaos ga Kiwamaru", "Kaika", "Blue Bird", { k: "bluelock-op-judgement", m: "audio", s: 15, e: 37 }],
  ],
  assassins: [
    [2, "¿Cómo se llama este tema de Assassin's Creed II?", "Ezio's Family", "Venice Rooftops", "Earth", "Flight Over Masyaf", { k: "assassins-ost-ezio", m: "audio", s: 0, e: 25 }],
    [1, "Mira el tráiler difuminado. ¿Qué Assassin's Creed es?", "Valhalla", "Odyssey", "Origins", "Mirage", { k: "assassins-tr-valhalla", m: "blur", s: 20, e: 45 }],
  ],
  kingdomhearts: [
    [1, "¿Quién canta este tema?", "Hikaru Utada", "Ayumi Hamasaki", "Namie Amuro", "Ai Otsuka", { k: "kh-ost-simple", m: "audio", s: 5, e: 28 }],
    [2, "¿Quién compuso este tema?", "Yoko Shimomura", "Nobuo Uematsu", "Yasunori Mitsuda", "Motoi Sakuraba", { k: "kh-ost-dearly", m: "audio", s: 0, e: 25 }],
  ],
  persona: [
    [1, "¿De qué Persona es este tema de batalla?", "Persona 5", "Persona 4", "Persona 3", "Persona 2", { k: "persona-ost-lastsurprise", m: "audio", s: 5, e: 30 }],
    [2, "¿De qué Persona es este tema de batalla?", "Persona 4", "Persona 5", "Persona 3", "Persona Q", { k: "persona-ost-reachout", m: "audio", s: 10, e: 35 }],
  ],
  crash: [
    [3, "¿En qué nivel del primer Crash suena esta música?", "N. Sanity Beach", "Hog Wild", "The Lost City", "Road to Nowhere", { k: "crash-ost-nsanity", m: "audio", s: 0, e: 25 }],
    [2, "Mira el tráiler difuminado. ¿Qué juego presenta?", "Crash Bandicoot 4: It's About Time", "Crash Bandicoot N. Sane Trilogy", "Crash Team Racing Nitro-Fueled", "Crash Team Rumble", { k: "crash-tr-4", m: "blur", s: 20, e: 45 }],
  ],
  spiderman: [
    [1, "Mira el tráiler difuminado. ¿Qué juego presenta?", "Marvel's Spider-Man 2", "Marvel's Spider-Man: Miles Morales", "Marvel's Spider-Man (2018)", "Spider-Man: Web of Shadows", { k: "spiderman-tr-2", m: "blur", s: 15, e: 40 }],
    [3, "¿Quién compuso este tema principal del juego de 2018?", "John Paesano", "Michael Giacchino", "Danny Elfman", "Daniel Pemberton", { k: "spiderman-ost-main", m: "audio", s: 5, e: 30 }],
  ],
  animalcrossing: [
    [1, "Mira el tráiler difuminado. ¿Qué Animal Crossing presenta?", "New Horizons", "New Leaf", "Wild World", "City Folk", { k: "ac-tr-nh", m: "blur", s: 15, e: 40 }],
  ],
  counterstrike: [
    [1, "Mira el tráiler difuminado. ¿Qué juego presenta?", "Counter-Strike 2", "Counter-Strike: Global Offensive", "Counter-Strike: Source", "Counter-Strike: Condition Zero", { k: "cs-tr-cs2", m: "blur", s: 10, e: 35 }],
  ],
  simpsons: [
    [2, "¿Quién compuso este tema de entrada?", "Danny Elfman", "Alf Clausen", "Hans Zimmer", "John Williams", { k: "simpsons-intro", m: "audio", s: 0, e: 22 }],
    [1, "Mira la entrada difuminada. ¿Qué castigo cumple Bart al principio?", "Escribir en el pizarrón", "Barrer el patio", "Limpiar los borradores", "Quedarse sin recreo", { k: "simpsons-intro", m: "blur", s: 0, e: 20 }],
  ],
  breakingbad: [
    [3, "¿Quién compuso esta entrada?", "Dave Porter", "Ramin Djawadi", "Jeff Russo", "Kyle Dixon", { k: "bb-intro", m: "audio", s: 0, e: 15 }],
  ],
  got: [
    [2, "¿Quién compuso este tema principal?", "Ramin Djawadi", "Hans Zimmer", "Howard Shore", "Bear McCreary", { k: "got-intro", m: "audio", s: 10, e: 35 }],
    [1, "Mira la entrada difuminada. ¿Qué se ve en ella?", "Un mapa mecánico que se arma solo", "Un dragón volando sobre el mar", "El Trono de Hierro derritiéndose", "Una batalla en la nieve", { k: "got-intro", m: "blur", s: 15, e: 40 }],
  ],
  strangerthings: [
    [3, "¿Quiénes compusieron este tema?", "Kyle Dixon y Michael Stein", "Trent Reznor y Atticus Ross", "Daft Punk", "Vangelis", { k: "st-intro", m: "audio", s: 5, e: 30 }],
    [1, "¿A qué personaje salva esta canción en la temporada 4?", "Max", "Eleven", "Nancy", "Robin", { k: "st-runningup", m: "audio", s: 60, e: 85 }],
  ],
  friends: [
    [2, "¿Qué banda canta este tema de entrada?", "The Rembrandts", "Hootie & the Blowfish", "Barenaked Ladies", "Gin Blossoms", { k: "friends-theme", m: "audio", s: 5, e: 28 }],
  ],
  casadepapel: [
    [2, "Esta canción se volvió el himno de la banda. ¿De qué país es originalmente?", "Italia", "España", "Francia", "Argentina", { k: "lcdp-bellaciao", m: "audio", s: 10, e: 35 }],
    [3, "¿Quién canta este tema de la serie?", "Cecilia Krull", "Rosalía", "Bebe", "Nathy Peluso", { k: "lcdp-intro", m: "audio", s: 10, e: 35 }],
  ],
  starwars: [
    [1, "¿Quién compuso esta música?", "John Williams", "Hans Zimmer", "Howard Shore", "Danny Elfman", { k: "sw-ost-main", m: "audio", s: 0, e: 22 }],
    [1, "¿A qué personaje acompaña esta marcha?", "Darth Vader", "Boba Fett", "Kylo Ren", "Jabba el Hutt", { k: "sw-ost-imperial", m: "audio", s: 3, e: 25 }],
    [2, "¿En qué película suena por primera vez este tema?", "La amenaza fantasma", "El ataque de los clones", "La venganza de los Sith", "El regreso del Jedi", { k: "sw-ost-duel", m: "audio", s: 30, e: 55 }],
  ],
  harrypotter: [
    [2, "¿Cómo se llama este tema?", "El tema de Hedwig", "Harry's Wondrous World", "Double Trouble", "Leaving Hogwarts", { k: "hp-ost-hedwig", m: "audio", s: 0, e: 25 }],
    [2, "Mira el tráiler difuminado. ¿Qué película es?", "Las Reliquias de la Muerte: parte 2", "Las Reliquias de la Muerte: parte 1", "El misterio del príncipe", "La Orden del Fénix", { k: "hp-tr-deathly2", m: "blur", s: 20, e: 45 }],
  ],
  mcu: [
    [1, "Mira el tráiler difuminado. ¿Qué película presenta?", "Avengers: Endgame", "Avengers: Infinity War", "Avengers: Era de Ultrón", "Capitán América: Civil War", { k: "mcu-tr-endgame", m: "blur", s: 20, e: 45 }],
    [3, "¿Quién compuso este tema de Los Vengadores?", "Alan Silvestri", "Hans Zimmer", "Ludwig Göransson", "Michael Giacchino", { k: "mcu-ost-avengers", m: "audio", s: 10, e: 35 }],
  ],
  lotr: [
    [1, "¿Qué lugar evoca este tema?", "La Comarca", "Rivendel", "Rohan", "Mordor", { k: "lotr-ost-shire", m: "audio", s: 0, e: 25 }],
    [2, "¿Quién canta esta canción de La Comunidad del Anillo?", "Enya", "Annie Lennox", "Loreena McKennitt", "Sinéad O'Connor", { k: "lotr-ost-mayit", m: "audio", s: 15, e: 40 }],
  ],
  pixar: [
    [1, "¿De qué película es esta canción?", "Toy Story", "Bichos", "Monsters, Inc.", "Cars", { k: "pixar-ost-friend", m: "audio", s: 5, e: 28 }],
    [2, "¿En qué película suena este tema?", "Up", "WALL·E", "Ratatouille", "Intensa-Mente", { k: "pixar-ost-married", m: "audio", s: 5, e: 30 }],
  ],
};

export default bank;
