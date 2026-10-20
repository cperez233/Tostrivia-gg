/* editorial-ui · Cristian Pérez · cristianperez.me
 * Generado por scripts/build-content.mjs a partir de content/visual.mjs: no se edita a mano.
 * Formato: [dificultad, pregunta, correcta, mala, mala, mala, media o visual?]
 */
import type { RawQuestion } from "../types";

const bank: Record<string, RawQuestion[]> = {
  disney: [
    [1,"🦁👑🌅\n¿Qué película es?","El Rey León","Aladdín","La Bella y la Bestia","Pocahontas",{"v":"emoji"}],
    [1,"🪔🧞🐵\n¿Qué película es?","Aladdín","El Rey León","Mulán","Hércules",{"v":"emoji"}],
    [1,"❄️👸⛄\n¿Qué película es?","Frozen","La Sirenita","Rapunzel","Moana",{"v":"emoji"}],
    [1,"🧜‍♀️🦀🌊\n¿Qué película es?","La Sirenita","Moana","Pocahontas","Peter Pan",{"v":"emoji"}],
    [2,"🌹🕯️🫖\n¿Qué película es?","La Bella y la Bestia","Cenicienta","La Bella Durmiente","Blancanieves",{"v":"emoji"}],
    [2,"🐶🍝❤️\n¿Qué película es?","La dama y el vagabundo","101 dálmatas","Bolt","Dumbo",{"v":"emoji"}],
    [2,"🐘🎪🪶\n¿Qué película es?","Dumbo","Bambi","El libro de la selva","Tarzán",{"v":"emoji"}],
    [2,"🎶🌴🐗\n¿Quiénes cantan \"Hakuna Matata\"?","Timón y Pumba","Simba y Nala","Rafiki y Zazú","Mufasa y Scar",{"v":"emoji"}],
  ],
  pixar: [
    [1,"🤠🚀🧸\n¿Qué película es?","Toy Story","Cars","Up","Monsters, Inc.",{"v":"emoji"}],
    [1,"🐠🔍🌊\n¿Qué película es?","Buscando a Nemo","Moana","La Sirenita","Luca",{"v":"emoji"}],
    [1,"🏠🎈👴\n¿Qué película es?","Up","Coco","Soul","Onward",{"v":"emoji"}],
    [1,"🐀👨‍🍳🍲\n¿Qué película es?","Ratatouille","Cars","Soul","Luca",{"v":"emoji"}],
    [2,"🤖🌱🗑️\n¿Qué película es?","WALL-E","Big Hero 6","Robots","Toy Story",{"v":"emoji"}],
    [1,"💀🎸🌼\n¿Qué película es?","Coco","Soul","La novia cadáver","Encanto",{"v":"emoji"}],
    [2,"😀😢😡🤢😨\n¿Qué película es?","Intensamente","Soul","Up","Valiente",{"v":"emoji"}],
    [2,"👾🚪😱\n¿Qué película es?","Monsters, Inc.","Los Increíbles","Bichos","Cars",{"v":"emoji"}],
  ],
  harrypotter: [
    [1,"🧙‍♂️🪨🪄\n¿Qué libro es?","La piedra filosofal","La cámara secreta","El cáliz de fuego","Las reliquias de la muerte",{"v":"emoji"}],
    [2,"🐍🗝️🚪\n¿Qué libro es?","La cámara secreta","La piedra filosofal","El prisionero de Azkaban","El misterio del príncipe",{"v":"emoji"}],
    [2,"🐺🌕⛓️\n¿Qué libro es?","El prisionero de Azkaban","La cámara secreta","La Orden del Fénix","El cáliz de fuego",{"v":"emoji"}],
    [2,"🏆🔥🐉\n¿Qué libro es?","El cáliz de fuego","La cámara secreta","La piedra filosofal","Las reliquias de la muerte",{"v":"emoji"}],
  ],
  starwars: [
    [2,"🪖🔫👶\n¿Qué serie es?","The Mandalorian","Andor","Obi-Wan Kenobi","Ahsoka",{"v":"emoji"}],
    [2,"🔴👹⚔️\n¿Qué villano es?","Darth Maul","Darth Vader","Conde Dooku","Kylo Ren",{"v":"emoji"}],
    [1,"🐻🧸🌲\n¿Qué criaturas son?","Ewoks","Wookiees","Jawas","Gungans",{"v":"emoji"}],
  ],
  mcu: [
    [1,"🔨⚡👑\n¿Qué héroe es?","Thor","Loki","Hulk","Ojo de Halcón",{"v":"emoji"}],
    [1,"🛡️⭐🇺🇸\n¿Qué héroe es?","Capitán América","Iron Man","Ant-Man","Falcon",{"v":"emoji"}],
    [1,"💚💪😡\n¿Qué héroe es?","Hulk","Thor","La Cosa","Groot",{"v":"emoji"}],
    [2,"🧤💜♾️\n¿Qué villano es?","Thanos","Ultrón","Loki","Hela",{"v":"emoji"}],
  ],
  lotr: [
    [1,"👁️🔥🗼\n¿Quién es?","Sauron","Saruman","Gollum","Smaug",{"v":"emoji"}],
    [1,"🧙‍♂️🎆🌲\n¿Quién es?","Gandalf","Saruman","Elrond","Radagast",{"v":"emoji"}],
    [1,"🧝‍♂️🏹\n¿Quién es?","Legolas","Aragorn","Gimli","Boromir",{"v":"emoji"}],
  ],
  shrek: [
    [1,"🍪🏃\n¿Qué personaje es?","Pan de Jengibre (Gingy)","Burro","El Gato con Botas","Pinocho",{"v":"emoji"}],
    [1,"🐴🗣️🤪\n¿Qué personaje es?","Burro","Shrek","Lord Farquaad","Gato con Botas",{"v":"emoji"}],
  ],
  jurassic: [
    [2,"🦟🟠🧬\n¿De dónde sale el ADN de los dinosaurios?","De un mosquito atrapado en ámbar","De un fósil de hueso","De un huevo congelado","De una pluma",{"v":"emoji"}],
    [2,"🌋🦖🏝️\n¿Qué película es?","Jurassic World: El reino caído","Jurassic Park","El mundo perdido","Jurassic Park III",{"v":"emoji"}],
  ],
  batman: [
    [1,"🃏😂🎭\n¿Qué villano es?","El Joker","El Pingüino","Dos Caras","Bane",{"v":"emoji"}],
    [1,"🐧☂️\n¿Qué villano es?","El Pingüino","El Joker","Mr. Freeze","El Acertijo",{"v":"emoji"}],
  ],
  piratas: [
    [1,"🏴‍☠️🍾🧭\n¿Quién es?","Jack Sparrow","Will Turner","Barbossa","Davy Jones",{"v":"emoji"}],
    [2,"🐙🦑🐚\n¿Quién es?","Davy Jones","Barbossa","Barbanegra","Will Turner",{"v":"emoji"}],
  ],
  rapidos: [
    [1,"👨‍👩‍👧‍👦🏎️\n¿Qué palabra repite Dom una y otra vez?","Familia","Velocidad","Lealtad","Honor",{"v":"emoji"}],
  ],
  simpsons: [
    [1,"🍩😋👨\n¿Quién es?","Homero","Bart","Ned Flanders","Moe",{"v":"emoji"}],
    [1,"🎷👧\n¿Quién es?","Lisa","Maggie","Marge","Patty",{"v":"emoji"}],
    [2,"🏭⚡👴\n¿Quién es?","El Sr. Burns","Abraham Simpson","Moe","Krusty",{"v":"emoji"}],
  ],
  got: [
    [1,"🐺❄️🏰\n¿Qué casa es?","Stark","Lannister","Targaryen","Baratheon",{"v":"emoji"}],
    [1,"🦁💰\n¿Qué casa es?","Lannister","Stark","Tyrell","Greyjoy",{"v":"emoji"}],
    [1,"🐉🔥👸\n¿Quién es?","Daenerys","Cersei","Sansa","Arya",{"v":"emoji"}],
  ],
  breakingbad: [
    [1,"🥼🕶️🎩\n¿Quién es?","Heisenberg","Saul Goodman","Gus Fring","Hank",{"v":"emoji"}],
    [2,"🍗🏪\n¿Qué negocio es?","Los Pollos Hermanos","Dunder Mifflin","Madrigal","Saul Goodman & Associates",{"v":"emoji"}],
  ],
  strangerthings: [
    [1,"🧇👧🧠\n¿Quién es?","Once (Eleven)","Max","Joyce","Nancy",{"v":"emoji"}],
    [2,"🔄🙃🌌\n¿Cómo se llama el otro mundo?","El Mundo del Revés","El Vacío","La Zona Gris","El Laboratorio",{"v":"emoji"}],
    [2,"🎄💡🔤\n¿Con qué se comunica Will?","Luces de Navidad","Radios","Mensajes de texto","Walkie-talkies",{"v":"emoji"}],
  ],
  friends: [
    [1,"☕🛋️👯\n¿Cuál es el café donde se reúnen?","Central Perk","Monk's Café","MacLaren's","Luke's",{"v":"emoji"}],
    [1,"🎸🐱🧘‍♀️\n¿Quién es?","Phoebe","Rachel","Monica","Emily",{"v":"emoji"}],
    [2,"🦖👨‍🔬\n¿Quién es?","Ross","Chandler","Joey","Gunther",{"v":"emoji"}],
  ],
  casadepapel: [
    [2,"🎶✊🇮🇹\n¿Qué canción es?","Bella ciao","La Marsellesa","Despacito","Resistiré",{"v":"emoji"}],
  ],
  theoffice: [
    [2,"🥬🐻\n¿Quién es?","Dwight","Jim","Creed","Kevin",{"v":"emoji"}],
    [2,"📄📦🏢\n¿Cómo se llama la empresa?","Dunder Mifflin","Sabre","Vance Refrigeration","Prestige Paper",{"v":"emoji"}],
  ],
  walkingdead: [
    [2,"🧟🏹🏍️\n¿Quién es?","Daryl","Rick","Negan","Glenn",{"v":"emoji"}],
  ],
  merlina: [

  ],
  peaky: [
    [2,"🧢🪒🥃\n¿Quién es?","Tommy Shelby","Arthur Shelby","Alfie Solomons","John Shelby",{"v":"emoji"}],
  ],
  mario: [
    [1,"🐢👑🔥\n¿Quién es?","Bowser","Wario","Donkey Kong","Koopa Troopa",{"v":"emoji"}],
    [1,"🦖🥚\n¿Quién es?","Yoshi","Toad","Bowser Jr.","Birdo",{"v":"emoji"}],
    [2,"🧱❓🪙\n¿Qué objeto es?","El bloque ?","La tubería","La estrella","La flor de fuego",{"v":"emoji"}],
  ],
  zelda: [
    [1,"🔺🔺🔺\n¿Qué objeto es?","La Trifuerza","La Espada Maestra","La Ocarina del Tiempo","El Escudo Hylian",{"v":"emoji"}],
    [2,"🐴🌾\n¿Quién es?","Epona","Link","Navi","Midna",{"v":"emoji"}],
    [2,"🐗👹🔱\n¿Quién es?","Ganondorf","Link","Zant","Vaati",{"v":"emoji"}],
  ],
  pokemon: [
    [1,"🔥🦎\n¿Qué Pokémon es?","Charmander","Squirtle","Bulbasaur","Vulpix",{"v":"emoji"}],
    [1,"💧🐢\n¿Qué Pokémon es?","Squirtle","Charmander","Psyduck","Totodile",{"v":"emoji"}],
    [1,"💤🐻🍖\n¿Qué Pokémon es?","Snorlax","Teddiursa","Slowpoke","Munchlax",{"v":"emoji"}],
    [1,"🔴⚪🎯\n¿Qué objeto es?","Una Poké Ball","Una Master Ball","Una Pokédex","Una MO",{"v":"emoji"}],
  ],
  minecraft: [
    [1,"🟩💥😱\n¿Qué mob es?","Creeper","Zombi","Enderman","Esqueleto",{"v":"emoji"}],
    [2,"🟣🌌🐉\n¿Qué jefe es?","El Dragón del Fin","El Wither","El Guardián","El Warden",{"v":"emoji"}],
  ],
  gta: [
    [2,"🌴🚗🌇\n¿Qué ciudad es?","Vice City","Los Santos","Liberty City","San Fierro",{"v":"emoji"}],
    [2,"🌉🌫️🏙️\n¿Qué ciudad es?","San Fierro","Vice City","Los Santos","Las Venturas",{"v":"emoji"}],
  ],
  ff: [
    [1,"🐤🏃\n¿Qué criatura es?","Un chocobo","Un moguri","Un cactilio","Un bomb",{"v":"emoji"}],
    [2,"☁️⚔️\n¿Quién es?","Cloud Strife","Squall Leonhart","Sephiroth","Tidus",{"v":"emoji"}],
  ],
  sonic: [
    [1,"💍💍💍🏃\n¿Qué recoge Sonic?","Anillos","Monedas","Estrellas","Frutas",{"v":"emoji"}],
    [1,"🦊✈️\n¿Quién es?","Tails","Knuckles","Shadow","Amy",{"v":"emoji"}],
    [1,"🥚🔬🤖\n¿Quién es?","Dr. Eggman","Dr. Robotnik Jr.","Metal Sonic","Dr. Wily",{"v":"emoji"}],
  ],
  animalcrossing: [
    [1,"🦝💰🏠\n¿Quién es?","Tom Nook","Isabelle","Blathers","K.K. Slider",{"v":"emoji"}],
  ],
  fortnite: [
    [1,"🚌🎈🪂\n¿Cómo llegas a la isla?","En el autobús de batalla","En avión","En helicóptero","En un barco",{"v":"emoji"}],
  ],
  undertale: [
    [1,"🍝💀\n¿Quién es?","Papyrus","Sans","Toriel","Flowey",{"v":"emoji"}],
  ],
  onepiece: [
    [1,"🏴‍☠️👒🍖\n¿Quién es?","Luffy","Zoro","Sanji","Ace",{"v":"emoji"}],
    [1,"🗡️🗡️🗡️🍶\n¿Quién es?","Zoro","Luffy","Dracule Mihawk","Law",{"v":"emoji"}],
    [1,"🍊🌊🗺️\n¿Quién es?","Nami","Robin","Vivi","Hancock",{"v":"emoji"}],
    [1,"🦌🌸🩺\n¿Quién es?","Chopper","Brook","Franky","Usopp",{"v":"emoji"}],
  ],
  naruto: [
    [1,"👁️🔴\n¿Qué técnica ocular es?","El Sharingan","El Byakugan","El Rinnegan","El Mangekyō",{"v":"emoji"}],
    [2,"🐍👁️🧪\n¿Quién es?","Orochimaru","Kabuto","Kakashi","Madara",{"v":"emoji"}],
    [1,"🌀🖐️🔵\n¿Qué técnica es?","Rasengan","Chidori","Kamehameha","Amaterasu",{"v":"emoji"}],
    [2,"⚡🐦🖐️\n¿Qué técnica es?","Chidori","Rasengan","Katon","Susanoo",{"v":"emoji"}],
  ],
  dragonball: [
    [1,"💥🖐️🔵\n¿Qué ataque es?","Kamehameha","Final Flash","Kienzan","Genkidama",{"v":"emoji"}],
    [2,"🐒🌕💥\n¿Qué transformación es?","Gran Mono (Oozaru)","Super Saiyajin","Kaio-ken","Ultra Instinto",{"v":"emoji"}],
    [2,"🌰🩹\n¿Qué objeto es?","La semilla del ermitaño","La esfera del dragón","El radar del dragón","La nube voladora",{"v":"emoji"}],
  ],
  aot: [
    [2,"🌀🗡️⚙️\n¿Qué equipo es?","El equipo de maniobras tridimensionales","El mazo de Marley","El arma de trueno","La armadura colosal",{"v":"emoji"}],
    [2,"🧱🧍‍♂️🔥\n¿Quién es?","El Titán Colosal","El Titán Acorazado","El Titán Bestia","El Titán Mandíbula",{"v":"emoji"}],
  ],
  deathnote: [
    [1,"📓🍎💀\n¿Quién es?","Ryuk","L","Light","Rem",{"v":"emoji"}],
    [1,"🍰🕶️🔍\n¿Quién es?","L","Near","Mello","Watari",{"v":"emoji"}],
  ],
  jojo: [
    [2,"⏱️🛑🧛‍♂️\n¿Qué Stand es?","The World","Star Platinum","Crazy Diamond","Killer Queen",{"v":"emoji"}],
  ],
  kimetsu: [
    [1,"🌸🎋📦\n¿Quién es?","Nezuko","Shinobu","Mitsuri","Kanao",{"v":"emoji"}],
    [2,"⚡😴\n¿Quién es?","Zenitsu","Inosuke","Tanjiro","Genya",{"v":"emoji"}],
    [2,"🌊🗡️\n¿Qué respiración es?","Respiración del agua","Respiración del fuego","Respiración del trueno","Respiración del viento",{"v":"emoji"}],
  ],
  mha: [
    [1,"💚👊💥\n¿Quién es?","Deku","Bakugo","Todoroki","All Might",{"v":"emoji"}],
    [1,"💥🔥😡\n¿Quién es?","Bakugo","Deku","Endeavor","Kirishima",{"v":"emoji"}],
  ],
  fma: [
    [1,"⚙️🦾🔴\n¿Quién es?","Edward Elric","Alphonse Elric","Roy Mustang","Scar",{"v":"emoji"}],
  ],
  hxh: [
    [1,"🎣🍃🌱\n¿Quién es?","Gon","Killua","Kurapika","Leorio",{"v":"emoji"}],
    [2,"🃏🎩🩸\n¿Quién es?","Hisoka","Illumi","Chrollo","Kite",{"v":"emoji"}],
  ],
  spyfamily: [
    [1,"🥜🧠🕵️‍♀️\n¿Quién es?","Anya","Yor","Becky","Damian",{"v":"emoji"}],
  ],
  csm: [
    [1,"🪚😈🩸\n¿Quién es?","Denji","Aki","Power","Makima",{"v":"emoji"}],
    [1,"🐕🪚\n¿Quién es?","Pochita","Kon","Meowy","Cosmo",{"v":"emoji"}],
  ],
  jjk: [
    [2,"🟣🔵🖐️\n¿Quién usa esta técnica?","Satoru Gojo","Sukuna","Yuji Itadori","Megumi Fushiguro",{"v":"emoji"}],
  ],
  eva: [
    [2,"🤖🟣🟢👦\n¿Quién la pilota?","Shinji Ikari","Asuka","Rei","Kaworu",{"v":"emoji"}],
  ],
};

export default bank;
