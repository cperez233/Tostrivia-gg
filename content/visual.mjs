// Preguntas con emojis y frases en globo, repartidas en categorías que ya existían.
// La primera línea de la pregunta es lo que se ve grande (los emojis o la frase); la segunda, lo que se pregunta.
const N = null;
const E = { v: "emoji" };

export default {
  // ───────── Pelis ─────────
  disney: [
    [1, "🦁👑🌅\n¿Qué película es?", "El Rey León", "Aladdín", "La Bella y la Bestia", "Pocahontas", ["🦁👑🌅\nWhich movie is it?", "The Lion King", "Aladdin", "Beauty and the Beast", "Pocahontas"], E],
    [1, "🪔🧞🐵\n¿Qué película es?", "Aladdín", "El Rey León", "Mulán", "Hércules", ["🪔🧞🐵\nWhich movie is it?", "Aladdin", "The Lion King", "Mulan", "Hercules"], E],
    [1, "❄️👸⛄\n¿Qué película es?", "Frozen", "La Sirenita", "Rapunzel", "Moana", ["❄️👸⛄\nWhich movie is it?", "Frozen", "The Little Mermaid", "Tangled", "Moana"], E],
    [1, "🧜‍♀️🦀🌊\n¿Qué película es?", "La Sirenita", "Moana", "Pocahontas", "Peter Pan", ["🧜‍♀️🦀🌊\nWhich movie is it?", "The Little Mermaid", "Moana", "Pocahontas", "Peter Pan"], E],
    [2, "🌹🕯️🫖\n¿Qué película es?", "La Bella y la Bestia", "Cenicienta", "La Bella Durmiente", "Blancanieves", ["🌹🕯️🫖\nWhich movie is it?", "Beauty and the Beast", "Cinderella", "Sleeping Beauty", "Snow White"], E],
    [2, "🐶🍝❤️\n¿Qué película es?", "La dama y el vagabundo", "101 dálmatas", "Bolt", "Dumbo", ["🐶🍝❤️\nWhich movie is it?", "Lady and the Tramp", "101 Dalmatians", "Bolt", "Dumbo"], E],
    [2, "🐘🎪🪶\n¿Qué película es?", "Dumbo", "Bambi", "El libro de la selva", "Tarzán", ["🐘🎪🪶\nWhich movie is it?", "Dumbo", "Bambi", "The Jungle Book", "Tarzan"], E],
    [2, "🎶🌴🐗\n¿Quiénes cantan \"Hakuna Matata\"?", "Timón y Pumba", "Simba y Nala", "Rafiki y Zazú", "Mufasa y Scar", ["🎶🌴🐗\nWho sings \"Hakuna Matata\"?", "Timon and Pumbaa", "Simba and Nala", "Rafiki and Zazu", "Mufasa and Scar"], E],
  ],

  pixar: [
    [1, "🤠🚀🧸\n¿Qué película es?", "Toy Story", "Cars", "Up", "Monsters, Inc.", ["🤠🚀🧸\nWhich movie is it?", "Toy Story", "Cars", "Up", "Monsters, Inc."], E],
    [1, "🐠🔍🌊\n¿Qué película es?", "Buscando a Nemo", "Moana", "La Sirenita", "Luca", ["🐠🔍🌊\nWhich movie is it?", "Finding Nemo", "Moana", "The Little Mermaid", "Luca"], E],
    [1, "🏠🎈👴\n¿Qué película es?", "Up", "Coco", "Soul", "Onward", ["🏠🎈👴\nWhich movie is it?", "Up", "Coco", "Soul", "Onward"], E],
    [1, "🐀👨‍🍳🍲\n¿Qué película es?", "Ratatouille", "Cars", "Soul", "Luca", ["🐀👨‍🍳🍲\nWhich movie is it?", "Ratatouille", "Cars", "Soul", "Luca"], E],
    [2, "🤖🌱🗑️\n¿Qué película es?", "WALL-E", "Big Hero 6", "Robots", "Toy Story", ["🤖🌱🗑️\nWhich movie is it?", "WALL-E", "Big Hero 6", "Robots", "Toy Story"], E],
    [1, "💀🎸🌼\n¿Qué película es?", "Coco", "Soul", "La novia cadáver", "Encanto", ["💀🎸🌼\nWhich movie is it?", "Coco", "Soul", "Corpse Bride", "Encanto"], E],
    [2, "😀😢😡🤢😨\n¿Qué película es?", "Intensamente", "Soul", "Up", "Valiente", ["😀😢😡🤢😨\nWhich movie is it?", "Inside Out", "Soul", "Up", "Brave"], E],
    [2, "👾🚪😱\n¿Qué película es?", "Monsters, Inc.", "Los Increíbles", "Bichos", "Cars", ["👾🚪😱\nWhich movie is it?", "Monsters, Inc.", "The Incredibles", "A Bug's Life", "Cars"], E],
  ],

  harrypotter: [
    [1, "🧙‍♂️🪨🪄\n¿Qué libro es?", "La piedra filosofal", "La cámara secreta", "El cáliz de fuego", "Las reliquias de la muerte", ["🧙‍♂️🪨🪄\nWhich book is it?", "The Philosopher's Stone", "The Chamber of Secrets", "The Goblet of Fire", "The Deathly Hallows"], E],
    [2, "🐍🗝️🚪\n¿Qué libro es?", "La cámara secreta", "La piedra filosofal", "El prisionero de Azkaban", "El misterio del príncipe", ["🐍🗝️🚪\nWhich book is it?", "The Chamber of Secrets", "The Philosopher's Stone", "The Prisoner of Azkaban", "The Half-Blood Prince"], E],
    [2, "🐺🌕⛓️\n¿Qué libro es?", "El prisionero de Azkaban", "La cámara secreta", "La Orden del Fénix", "El cáliz de fuego", ["🐺🌕⛓️\nWhich book is it?", "The Prisoner of Azkaban", "The Chamber of Secrets", "The Order of the Phoenix", "The Goblet of Fire"], E],
    [2, "🏆🔥🐉\n¿Qué libro es?", "El cáliz de fuego", "La cámara secreta", "La piedra filosofal", "Las reliquias de la muerte", ["🏆🔥🐉\nWhich book is it?", "The Goblet of Fire", "The Chamber of Secrets", "The Philosopher's Stone", "The Deathly Hallows"], E],
  ],

  starwars: [
    [2, "🪖🔫👶\n¿Qué serie es?", "The Mandalorian", "Andor", "Obi-Wan Kenobi", "Ahsoka", ["🪖🔫👶\nWhich series is it?", "The Mandalorian", "Andor", "Obi-Wan Kenobi", "Ahsoka"], E],
    [2, "🔴👹⚔️\n¿Qué villano es?", "Darth Maul", "Darth Vader", "Conde Dooku", "Kylo Ren", ["🔴👹⚔️\nWhich villain is it?", "Darth Maul", "Darth Vader", "Count Dooku", "Kylo Ren"], E],
    [1, "🐻🧸🌲\n¿Qué criaturas son?", "Ewoks", "Wookiees", "Jawas", "Gungans", ["🐻🧸🌲\nWhich creatures are they?", "Ewoks", "Wookiees", "Jawas", "Gungans"], E],
  ],

  mcu: [
    [1, "🔨⚡👑\n¿Qué héroe es?", "Thor", "Loki", "Hulk", "Ojo de Halcón", ["🔨⚡👑\nWhich hero is it?", "Thor", "Loki", "Hulk", "Hawkeye"], E],
    [1, "🛡️⭐🇺🇸\n¿Qué héroe es?", "Capitán América", "Iron Man", "Ant-Man", "Falcon", ["🛡️⭐🇺🇸\nWhich hero is it?", "Captain America", "Iron Man", "Ant-Man", "Falcon"], E],
    [1, "💚💪😡\n¿Qué héroe es?", "Hulk", "Thor", "La Cosa", "Groot", ["💚💪😡\nWhich hero is it?", "Hulk", "Thor", "The Thing", "Groot"], E],
    [2, "🧤💜♾️\n¿Qué villano es?", "Thanos", "Ultrón", "Loki", "Hela", ["🧤💜♾️\nWhich villain is it?", "Thanos", "Ultron", "Loki", "Hela"], E],
  ],

  lotr: [
    [1, "👁️🔥🗼\n¿Quién es?", "Sauron", "Saruman", "Gollum", "Smaug", ["👁️🔥🗼\nWho is it?", "Sauron", "Saruman", "Gollum", "Smaug"], E],
    [1, "🧙‍♂️🎆🌲\n¿Quién es?", "Gandalf", "Saruman", "Elrond", "Radagast", ["🧙‍♂️🎆🌲\nWho is it?", "Gandalf", "Saruman", "Elrond", "Radagast"], E],
    [1, "🧝‍♂️🏹\n¿Quién es?", "Legolas", "Aragorn", "Gimli", "Boromir", ["🧝‍♂️🏹\nWho is it?", "Legolas", "Aragorn", "Gimli", "Boromir"], E],
  ],

  shrek: [
    [1, "🍪🏃\n¿Qué personaje es?", "Pan de Jengibre (Gingy)", "Burro", "El Gato con Botas", "Pinocho", ["🍪🏃\nWhich character is it?", "Gingerbread Man (Gingy)", "Donkey", "Puss in Boots", "Pinocchio"], E],
    [1, "🐴🗣️🤪\n¿Qué personaje es?", "Burro", "Shrek", "Lord Farquaad", "Gato con Botas", ["🐴🗣️🤪\nWhich character is it?", "Donkey", "Shrek", "Lord Farquaad", "Puss in Boots"], E],
  ],

  jurassic: [
    [2, "🦟🟠🧬\n¿De dónde sale el ADN de los dinosaurios?", "De un mosquito atrapado en ámbar", "De un fósil de hueso", "De un huevo congelado", "De una pluma", ["🦟🟠🧬\nWhere does the dinosaur DNA come from?", "A mosquito trapped in amber", "A fossil bone", "A frozen egg", "A feather"], E],
    [2, "🌋🦖🏝️\n¿Qué película es?", "Jurassic World: El reino caído", "Jurassic Park", "El mundo perdido", "Jurassic Park III", ["🌋🦖🏝️\nWhich movie is it?", "Jurassic World: Fallen Kingdom", "Jurassic Park", "The Lost World", "Jurassic Park III"], E],
  ],

  batman: [
    [1, "🃏😂🎭\n¿Qué villano es?", "El Joker", "El Pingüino", "Dos Caras", "Bane", ["🃏😂🎭\nWhich villain is it?", "The Joker", "The Penguin", "Two-Face", "Bane"], E],
    [1, "🐧☂️\n¿Qué villano es?", "El Pingüino", "El Joker", "Mr. Freeze", "El Acertijo", ["🐧☂️\nWhich villain is it?", "The Penguin", "The Joker", "Mr. Freeze", "The Riddler"], E],
  ],

  piratas: [
    [1, "🏴‍☠️🍾🧭\n¿Quién es?", "Jack Sparrow", "Will Turner", "Barbossa", "Davy Jones", ["🏴‍☠️🍾🧭\nWho is it?", "Jack Sparrow", "Will Turner", "Barbossa", "Davy Jones"], E],
    [2, "🐙🦑🐚\n¿Quién es?", "Davy Jones", "Barbossa", "Barbanegra", "Will Turner", ["🐙🦑🐚\nWho is it?", "Davy Jones", "Barbossa", "Blackbeard", "Will Turner"], E],
  ],

  rapidos: [
    [1, "👨‍👩‍👧‍👦🏎️\n¿Qué palabra repite Dom una y otra vez?", "Familia", "Velocidad", "Lealtad", "Honor", ["👨‍👩‍👧‍👦🏎️\nWhat word does Dom keep repeating?", "Family", "Speed", "Loyalty", "Honor"], E],
  ],

  // ───────── Series ─────────
  simpsons: [
    [1, "🍩😋👨\n¿Quién es?", "Homero", "Bart", "Ned Flanders", "Moe", ["🍩😋👨\nWho is it?", "Homer", "Bart", "Ned Flanders", "Moe"], E],
    [1, "🎷👧\n¿Quién es?", "Lisa", "Maggie", "Marge", "Patty", ["🎷👧\nWho is it?", "Lisa", "Maggie", "Marge", "Patty"], E],
    [2, "🏭⚡👴\n¿Quién es?", "El Sr. Burns", "Abraham Simpson", "Moe", "Krusty", ["🏭⚡👴\nWho is it?", "Mr. Burns", "Abe Simpson", "Moe", "Krusty"], E],
  ],

  got: [
    [1, "🐺❄️🏰\n¿Qué casa es?", "Stark", "Lannister", "Targaryen", "Baratheon", ["🐺❄️🏰\nWhich house is it?", "Stark", "Lannister", "Targaryen", "Baratheon"], E],
    [1, "🦁💰\n¿Qué casa es?", "Lannister", "Stark", "Tyrell", "Greyjoy", ["🦁💰\nWhich house is it?", "Lannister", "Stark", "Tyrell", "Greyjoy"], E],
    [1, "🐉🔥👸\n¿Quién es?", "Daenerys", "Cersei", "Sansa", "Arya", ["🐉🔥👸\nWho is it?", "Daenerys", "Cersei", "Sansa", "Arya"], E],
  ],

  breakingbad: [
    [1, "🥼🕶️🎩\n¿Quién es?", "Heisenberg", "Saul Goodman", "Gus Fring", "Hank", ["🥼🕶️🎩\nWho is it?", "Heisenberg", "Saul Goodman", "Gus Fring", "Hank"], E],
    [2, "🍗🏪\n¿Qué negocio es?", "Los Pollos Hermanos", "Dunder Mifflin", "Madrigal", "Saul Goodman & Associates", ["🍗🏪\nWhich business is it?", "Los Pollos Hermanos", "Dunder Mifflin", "Madrigal", "Saul Goodman & Associates"], E],
  ],

  strangerthings: [
    [1, "🧇👧🧠\n¿Quién es?", "Once (Eleven)", "Max", "Joyce", "Nancy", ["🧇👧🧠\nWho is it?", "Eleven", "Max", "Joyce", "Nancy"], E],
    [2, "🔄🙃🌌\n¿Cómo se llama el otro mundo?", "El Mundo del Revés", "El Vacío", "La Zona Gris", "El Laboratorio", ["🔄🙃🌌\nWhat is the other world called?", "The Upside Down", "The Void", "The Gray Zone", "The Laboratory"], E],
    [2, "🎄💡🔤\n¿Con qué se comunica Will?", "Luces de Navidad", "Radios", "Mensajes de texto", "Walkie-talkies", ["🎄💡🔤\nWhat does Will communicate with?", "Christmas lights", "Radios", "Text messages", "Walkie-talkies"], E],
  ],

  friends: [
    [1, "☕🛋️👯\n¿Cuál es el café donde se reúnen?", "Central Perk", "Monk's Café", "MacLaren's", "Luke's", ["☕🛋️👯\nWhich café do they hang out in?", "Central Perk", "Monk's Café", "MacLaren's", "Luke's"], E],
    [1, "🎸🐱🧘‍♀️\n¿Quién es?", "Phoebe", "Rachel", "Monica", "Emily", ["🎸🐱🧘‍♀️\nWho is it?", "Phoebe", "Rachel", "Monica", "Emily"], E],
    [2, "🦖👨‍🔬\n¿Quién es?", "Ross", "Chandler", "Joey", "Gunther", ["🦖👨‍🔬\nWho is it?", "Ross", "Chandler", "Joey", "Gunther"], E],
  ],

  casadepapel: [
    [2, "🎶✊🇮🇹\n¿Qué canción es?", "Bella ciao", "La Marsellesa", "Despacito", "Resistiré", ["🎶✊🇮🇹\nWhich song is it?", "Bella ciao", "La Marseillaise", "Despacito", "Resistiré"], E],
  ],

  theoffice: [
    [2, "🥬🐻\n¿Quién es?", "Dwight", "Jim", "Creed", "Kevin", ["🥬🐻\nWho is it?", "Dwight", "Jim", "Creed", "Kevin"], E],
    [2, "📄📦🏢\n¿Cómo se llama la empresa?", "Dunder Mifflin", "Sabre", "Vance Refrigeration", "Prestige Paper", ["📄📦🏢\nWhat is the company called?", "Dunder Mifflin", "Sabre", "Vance Refrigeration", "Prestige Paper"], E],
  ],

  walkingdead: [
    [2, "🧟🏹🏍️\n¿Quién es?", "Daryl", "Rick", "Negan", "Glenn", ["🧟🏹🏍️\nWho is it?", "Daryl", "Rick", "Negan", "Glenn"], E],
  ],

  merlina: [
  ],

  peaky: [
    [2, "🧢🪒🥃\n¿Quién es?", "Tommy Shelby", "Arthur Shelby", "Alfie Solomons", "John Shelby", ["🧢🪒🥃\nWho is it?", "Tommy Shelby", "Arthur Shelby", "Alfie Solomons", "John Shelby"], E],
  ],

  // ───────── Juegos ─────────
  mario: [
    [1, "🐢👑🔥\n¿Quién es?", "Bowser", "Wario", "Donkey Kong", "Koopa Troopa", ["🐢👑🔥\nWho is it?", "Bowser", "Wario", "Donkey Kong", "Koopa Troopa"], E],
    [1, "🦖🥚\n¿Quién es?", "Yoshi", "Toad", "Bowser Jr.", "Birdo", ["🦖🥚\nWho is it?", "Yoshi", "Toad", "Bowser Jr.", "Birdo"], E],
    [2, "🧱❓🪙\n¿Qué objeto es?", "El bloque ?", "La tubería", "La estrella", "La flor de fuego", ["🧱❓🪙\nWhich object is it?", "The ? Block", "The pipe", "The star", "The fire flower"], E],
  ],

  zelda: [
    [1, "🔺🔺🔺\n¿Qué objeto es?", "La Trifuerza", "La Espada Maestra", "La Ocarina del Tiempo", "El Escudo Hylian", ["🔺🔺🔺\nWhich object is it?", "The Triforce", "The Master Sword", "The Ocarina of Time", "The Hylian Shield"], E],
    [2, "🐴🌾\n¿Quién es?", "Epona", "Link", "Navi", "Midna", ["🐴🌾\nWho is it?", "Epona", "Link", "Navi", "Midna"], E],
    [2, "🐗👹🔱\n¿Quién es?", "Ganondorf", "Link", "Zant", "Vaati", ["🐗👹🔱\nWho is it?", "Ganondorf", "Link", "Zant", "Vaati"], E],
  ],

  pokemon: [
    [1, "🔥🦎\n¿Qué Pokémon es?", "Charmander", "Squirtle", "Bulbasaur", "Vulpix", ["🔥🦎\nWhich Pokémon is it?", "Charmander", "Squirtle", "Bulbasaur", "Vulpix"], E],
    [1, "💧🐢\n¿Qué Pokémon es?", "Squirtle", "Charmander", "Psyduck", "Totodile", ["💧🐢\nWhich Pokémon is it?", "Squirtle", "Charmander", "Psyduck", "Totodile"], E],
    [1, "💤🐻🍖\n¿Qué Pokémon es?", "Snorlax", "Teddiursa", "Slowpoke", "Munchlax", ["💤🐻🍖\nWhich Pokémon is it?", "Snorlax", "Teddiursa", "Slowpoke", "Munchlax"], E],
    [1, "🔴⚪🎯\n¿Qué objeto es?", "Una Poké Ball", "Una Master Ball", "Una Pokédex", "Una MO", ["🔴⚪🎯\nWhich object is it?", "A Poké Ball", "A Master Ball", "A Pokédex", "An HM"], E],
  ],

  minecraft: [
    [1, "🟩💥😱\n¿Qué mob es?", "Creeper", "Zombi", "Enderman", "Esqueleto", ["🟩💥😱\nWhich mob is it?", "Creeper", "Zombie", "Enderman", "Skeleton"], E],
    [2, "🟣🌌🐉\n¿Qué jefe es?", "El Dragón del Fin", "El Wither", "El Guardián", "El Warden", ["🟣🌌🐉\nWhich boss is it?", "The Ender Dragon", "The Wither", "The Guardian", "The Warden"], E],
  ],

  gta: [
    [2, "🌴🚗🌇\n¿Qué ciudad es?", "Vice City", "Los Santos", "Liberty City", "San Fierro", ["🌴🚗🌇\nWhich city is it?", "Vice City", "Los Santos", "Liberty City", "San Fierro"], E],
    [2, "🌉🌫️🏙️\n¿Qué ciudad es?", "San Fierro", "Vice City", "Los Santos", "Las Venturas", ["🌉🌫️🏙️\nWhich city is it?", "San Fierro", "Vice City", "Los Santos", "Las Venturas"], E],
  ],

  ff: [
    [1, "🐤🏃\n¿Qué criatura es?", "Un chocobo", "Un moguri", "Un cactilio", "Un bomb", ["🐤🏃\nWhich creature is it?", "A chocobo", "A moogle", "A cactuar", "A bomb"], E],
    [2, "☁️⚔️\n¿Quién es?", "Cloud Strife", "Squall Leonhart", "Sephiroth", "Tidus", ["☁️⚔️\nWho is it?", "Cloud Strife", "Squall Leonhart", "Sephiroth", "Tidus"], E],
  ],

  sonic: [
    [1, "💍💍💍🏃\n¿Qué recoge Sonic?", "Anillos", "Monedas", "Estrellas", "Frutas", ["💍💍💍🏃\nWhat does Sonic collect?", "Rings", "Coins", "Stars", "Fruit"], E],
    [1, "🦊✈️\n¿Quién es?", "Tails", "Knuckles", "Shadow", "Amy", ["🦊✈️\nWho is it?", "Tails", "Knuckles", "Shadow", "Amy"], E],
    [1, "🥚🔬🤖\n¿Quién es?", "Dr. Eggman", "Dr. Robotnik Jr.", "Metal Sonic", "Dr. Wily", ["🥚🔬🤖\nWho is it?", "Dr. Eggman", "Dr. Robotnik Jr.", "Metal Sonic", "Dr. Wily"], E],
  ],

  animalcrossing: [
    [1, "🦝💰🏠\n¿Quién es?", "Tom Nook", "Isabelle", "Blathers", "K.K. Slider", ["🦝💰🏠\nWho is it?", N, N, N, N], E],
  ],

  fortnite: [
    [1, "🚌🎈🪂\n¿Cómo llegas a la isla?", "En el autobús de batalla", "En avión", "En helicóptero", "En un barco", ["🚌🎈🪂\nHow do you get to the island?", "On the Battle Bus", "By plane", "By helicopter", "By boat"], E],
  ],

  undertale: [
    [1, "🍝💀\n¿Quién es?", "Papyrus", "Sans", "Toriel", "Flowey", ["🍝💀\nWho is it?", N, N, N, N], E],
  ],

  // ───────── Anime ─────────
  onepiece: [
    [1, "🏴‍☠️👒🍖\n¿Quién es?", "Luffy", "Zoro", "Sanji", "Ace", ["🏴‍☠️👒🍖\nWho is it?", N, N, N, N], E],
    [1, "🗡️🗡️🗡️🍶\n¿Quién es?", "Zoro", "Luffy", "Dracule Mihawk", "Law", ["🗡️🗡️🗡️🍶\nWho is it?", N, N, N, N], E],
    [1, "🍊🌊🗺️\n¿Quién es?", "Nami", "Robin", "Vivi", "Hancock", ["🍊🌊🗺️\nWho is it?", N, N, N, N], E],
    [1, "🦌🌸🩺\n¿Quién es?", "Chopper", "Brook", "Franky", "Usopp", ["🦌🌸🩺\nWho is it?", N, N, N, N], E],
  ],

  naruto: [
    [1, "👁️🔴\n¿Qué técnica ocular es?", "El Sharingan", "El Byakugan", "El Rinnegan", "El Mangekyō", ["👁️🔴\nWhich eye technique is it?", "The Sharingan", "The Byakugan", "The Rinnegan", "The Mangekyō"], E],
    [2, "🐍👁️🧪\n¿Quién es?", "Orochimaru", "Kabuto", "Kakashi", "Madara", ["🐍👁️🧪\nWho is it?", N, N, N, N], E],
    [1, "🌀🖐️🔵\n¿Qué técnica es?", "Rasengan", "Chidori", "Kamehameha", "Amaterasu", ["🌀🖐️🔵\nWhich technique is it?", N, N, "Kamehameha", N], E],
    [2, "⚡🐦🖐️\n¿Qué técnica es?", "Chidori", "Rasengan", "Katon", "Susanoo", ["⚡🐦🖐️\nWhich technique is it?", N, N, "Fire Style", N], E],
  ],

  dragonball: [
    [1, "💥🖐️🔵\n¿Qué ataque es?", "Kamehameha", "Final Flash", "Kienzan", "Genkidama", ["💥🖐️🔵\nWhich attack is it?", N, N, N, N], E],
    [2, "🐒🌕💥\n¿Qué transformación es?", "Gran Mono (Oozaru)", "Super Saiyajin", "Kaio-ken", "Ultra Instinto", ["🐒🌕💥\nWhich transformation is it?", "Great Ape (Oozaru)", "Super Saiyan", "Kaio-ken", "Ultra Instinct"], E],
    [2, "🌰🩹\n¿Qué objeto es?", "La semilla del ermitaño", "La esfera del dragón", "El radar del dragón", "La nube voladora", ["🌰🩹\nWhich item is it?", "The senzu bean", "The dragon ball", "The dragon radar", "The flying nimbus"], E],
  ],

  aot: [
    [2, "🌀🗡️⚙️\n¿Qué equipo es?", "El equipo de maniobras tridimensionales", "El mazo de Marley", "El arma de trueno", "La armadura colosal", ["🌀🗡️⚙️\nWhich gear is it?", "The 3D maneuver gear", "The Marley mace", "The thunder spear", "The colossal armor"], E],
    [2, "🧱🧍‍♂️🔥\n¿Quién es?", "El Titán Colosal", "El Titán Acorazado", "El Titán Bestia", "El Titán Mandíbula", ["🧱🧍‍♂️🔥\nWho is it?", "The Colossal Titan", "The Armored Titan", "The Beast Titan", "The Jaw Titan"], E],
  ],

  deathnote: [
    [1, "📓🍎💀\n¿Quién es?", "Ryuk", "L", "Light", "Rem", ["📓🍎💀\nWho is it?", N, N, N, N], E],
    [1, "🍰🕶️🔍\n¿Quién es?", "L", "Near", "Mello", "Watari", ["🍰🕶️🔍\nWho is it?", N, N, N, N], E],
  ],

  jojo: [
    [2, "⏱️🛑🧛‍♂️\n¿Qué Stand es?", "The World", "Star Platinum", "Crazy Diamond", "Killer Queen", ["⏱️🛑🧛‍♂️\nWhich Stand is it?", N, N, N, N], E],
  ],

  kimetsu: [
    [1, "🌸🎋📦\n¿Quién es?", "Nezuko", "Shinobu", "Mitsuri", "Kanao", ["🌸🎋📦\nWho is it?", N, N, N, N], E],
    [2, "⚡😴\n¿Quién es?", "Zenitsu", "Inosuke", "Tanjiro", "Genya", ["⚡😴\nWho is it?", N, N, N, N], E],
    [2, "🌊🗡️\n¿Qué respiración es?", "Respiración del agua", "Respiración del fuego", "Respiración del trueno", "Respiración del viento", ["🌊🗡️\nWhich breathing style is it?", "Water Breathing", "Flame Breathing", "Thunder Breathing", "Wind Breathing"], E],
  ],

  mha: [
    [1, "💚👊💥\n¿Quién es?", "Deku", "Bakugo", "Todoroki", "All Might", ["💚👊💥\nWho is it?", N, N, N, N], E],
    [1, "💥🔥😡\n¿Quién es?", "Bakugo", "Deku", "Endeavor", "Kirishima", ["💥🔥😡\nWho is it?", N, N, N, N], E],
  ],

  fma: [
    [1, "⚙️🦾🔴\n¿Quién es?", "Edward Elric", "Alphonse Elric", "Roy Mustang", "Scar", ["⚙️🦾🔴\nWho is it?", N, N, N, N], E],
  ],

  hxh: [
    [1, "🎣🍃🌱\n¿Quién es?", "Gon", "Killua", "Kurapika", "Leorio", ["🎣🍃🌱\nWho is it?", N, N, N, N], E],
    [2, "🃏🎩🩸\n¿Quién es?", "Hisoka", "Illumi", "Chrollo", "Kite", ["🃏🎩🩸\nWho is it?", N, N, N, N], E],
  ],

  spyfamily: [
    [1, "🥜🧠🕵️‍♀️\n¿Quién es?", "Anya", "Yor", "Becky", "Damian", ["🥜🧠🕵️‍♀️\nWho is it?", N, N, N, N], E],
  ],

  csm: [
    [1, "🪚😈🩸\n¿Quién es?", "Denji", "Aki", "Power", "Makima", ["🪚😈🩸\nWho is it?", N, N, N, N], E],
    [1, "🐕🪚\n¿Quién es?", "Pochita", "Kon", "Meowy", "Cosmo", ["🐕🪚\nWho is it?", N, N, N, N], E],
  ],

  jjk: [
    [2, "🟣🔵🖐️\n¿Quién usa esta técnica?", "Satoru Gojo", "Sukuna", "Yuji Itadori", "Megumi Fushiguro", ["🟣🔵🖐️\nWho uses this technique?", N, N, N, N], E],
  ],

  eva: [
    [2, "🤖🟣🟢👦\n¿Quién la pilota?", "Shinji Ikari", "Asuka", "Rei", "Kaworu", ["🤖🟣🟢👦\nWho pilots it?", N, "Asuka", "Rei", "Kaworu"], E],
  ],
};
