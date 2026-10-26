// Preguntas que se soplaban solas (la respuesta, o una palabra que solo tenía la correcta, venía escrita en el enunciado).
// Se reescriben sin la pista; las viejas se retiran en src/data/bank/drop/giveaway.json.
// Formato: [dificultad, pregunta, correcta, mala, mala, mala, [pregunta EN, correcta EN, mala EN, mala EN, mala EN], extra?] (null = igual que en español)
const N = null;

export default {
  rdr: [
    [1, "¿Quién es el gran enemigo de toda la vida de Dutch en RDR2, líder de una banda rival?", "Colm O'Driscoll", "Angelo Bronte", "Leviticus Cornwall", "Javier Escuella", ["Who is Dutch's lifelong nemesis in RDR2, the leader of a rival gang?", N, N, N, N]],
  ],
  konosuba: [
    [1, "¿Qué clase tiene Kazuma?", "Aventurero", "Mago", "Cruzado", "Sacerdote", ["What class is Kazuma?", "Adventurer", "Mage", "Crusader", "Priest"]],
  ],
  yugioh: [
    [1, "¿Cómo se llama el gran rival de Yugi, el joven millonario de los Dragones Blancos?", "Seto Kaiba", "Maximillion Pegasus", "Marik Ishtar", "Bakura", ["Who is Yugi's great rival, the young millionaire with the Blue-Eyes White Dragons?", N, N, N, N]],
    [2, "¿Cómo se llama la aprendiz del Mago Oscuro que aparece como carta propia?", "Maga Oscura", "Hechicera Oscura", "Bruja Oscura", "Princesa Oscura", ["What is the Dark Magician's apprentice, who has her own card, called?", "Dark Magician Girl", "Dark Sorceress", "Dark Witch", "Dark Princess"]],
    [2, "¿Cómo se llama la fusión de tres copias del dragón insignia de Kaiba?", "Dragón de Ojos Azules Definitivo", "Dragón Alado de Ra", "Exodia el Prohibido", "Dragón Negro de Ojos Rojos", ["What is the fusion of three copies of Kaiba's signature dragon called?", "Blue-Eyes Ultimate Dragon", "Winged Dragon of Ra", "Exodia the Forbidden One", "Red-Eyes Black Dragon"]],
    [2, "¿Quién adoptó a Seto y a Mokuba cuando eran niños?", "Gozaburo Kaiba", "Noa Kaiba", "Maximillion Pegasus", "Solomon Muto", ["Who adopted Seto and Mokuba as children?", N, N, N, N]],
    [2, "¿Qué tipo de cartas usa Mako Tsunami?", "Marinas", "Zombis", "Máquinas", "Dinosaurios", ["What type of cards does Mako Tsunami use?", "Sea creatures", "Zombies", "Machines", "Dinosaurs"]],
    [3, "¿Cómo se llama la tienda de la familia de Yugi?", "Kame Game Shop", "Duelo Plaza", "Kaiba Land", "Game Heart", ["What is the name of Yugi's family store?", N, N, N, N]],
  ],
  yuyuhakusho: [
    [2, "¿Qué espada de Kuwabara puede cortar el espacio mismo?", "La Espada Dimensional", "La Espada de las Pruebas", "La Espada del Dragón", "La Espada Fantasma", ["Which of Kuwabara's swords can cut through space itself?", "The Dimension Sword", "The Sword of Trials", "The Dragon Sword", "The Ghost Sword"]],
  ],
  ranma: [
    [2, "Además de Akane, ¿quién más le roba el corazón a Kuno?", "La chica de la trenza", "Kasumi", "Shampoo", "Nabiki", ["Besides Akane, who else has stolen Kuno's heart?", "The pigtailed girl", N, N, N]],
  ],
  bocchi: [
    [1, "¿Cómo se llama el grupo en el que toca Bocchi?", "Kessoku Band", "Poppin'Party", "Afterglow", "Roselia", ["What is the group Bocchi plays in called?", N, N, N, N]],
  ],
  mario: [
    [2, "¿Qué objeto da a Mario las orejas y la cola de mapache en Super Mario Bros. 3?", "La Super Hoja", "La Flor de Hielo", "La Pluma Capa", "El Super Champiñón", ["Which item gives Mario raccoon ears and a tail in Super Mario Bros. 3?", "The Super Leaf", "The Ice Flower", "The Cape Feather", "The Super Mushroom"]],
    [1, "¿Qué puede hacer Mario después de agarrar la flor roja y blanca?", "Lanzar bolas de fuego", "Volar", "Respirar bajo el agua", "Hacerse gigante", ["What can Mario do after grabbing the red-and-white flower?", "Throw fireballs", "Fly", "Breathe underwater", "Become giant"]],
  ],
  lotr: [
    [2, "¿Qué regalo de los elfos de Lothlórien usa Sam contra Ella-Laraña?", "El Frasco de Galadriel", "El Palantír", "El cuerno de Boromir", "La Estrella de la Tarde", ["Which gift from the elves of Lothlórien does Sam use against Shelob?", "The Phial of Galadriel", "The Palantír", "Boromir's horn", "The Evenstar"]],
  ],
  nolan: [
    [2, "¿Quién coescribió el guion de El caballero oscuro junto al director?", "Jonathan Nolan", "Wally Pfister", "Hoyte van Hoytema", "Lee Smith", ["Who co-wrote the screenplay of The Dark Knight with the director?", N, N, N, N]],
  ],
  southpark: [
    [1, "¿Qué gritan sus amigos cada vez que muere el chico de la capucha naranja?", "\"¡Dios mío, mataron a Kenny!\"", "\"Respeten mi autoridad\"", "\"No me digas\"", "\"Chicos, aprendí algo hoy\"", ["What do his friends shout every time the boy in the orange hood dies?", "\"Oh my God, they killed Kenny!\"", "\"Respect my authoritah\"", "\"You don't say\"", "\"Boys, I learned something today\""]],
    [1, "¿Cómo se llama el niño más rico de la clase de los protagonistas?", "Token Black", "Clyde Donovan", "Jimmy Valmer", "Tweek Tweak", ["What is the name of the richest kid in the main boys' class?", N, N, N, N]],
  ],
  strangerthings: [
    [1, "🔄🙃🌌\n¿Cómo se llama la dimensión paralela de la serie?", "El Mundo del Revés", "El Vacío", "La Zona Gris", "El Laboratorio", ["🔄🙃🌌\nWhat is the show's parallel dimension called?", "The Upside Down", "The Void", "The Gray Zone", "The Laboratory"], {"v": "emoji"}],
  ],
  haikyuu: [
    [3, "¿Cómo se llama de nombre el hermano mayor de Tsukishima?", "Akiteru", "Tadashi", "Takeru", "Yuji", ["What is the first name of Tsukishima's older brother?", N, N, N, N]],
  ],
  jurassic: [
    [3, "¿Cerca de qué país está la isla del parque?", "Costa Rica", "Panamá", "Honduras", "Belice", ["Near which country is the park's island?", "Costa Rica", "Panama", "Honduras", "Belize"]],
  ],
  sonic: [
    [1, "¿Qué le pasa a Sonic si lo golpean mientras lleva anillos?", "Se le caen todos y salen volando", "Pierde una vida", "Se hace pequeño", "Se vuelve más lento", ["What happens to Sonic if he gets hit while carrying rings?", "He drops them all and they scatter", "He loses a life", "He shrinks", "He slows down"]],
  ],
  bleach: [
    [1, "¿Cómo se llama el lugar donde viven los Hollow?", "Hueco Mundo", "La Sociedad de Almas", "Rukongai", "Dangai", ["What is the place where Hollows live called?", "Hueco Mundo", "The Soul Society", "Rukongai", "Dangai"]],
  ],
  opm: [
    [3, "¿En qué parte del examen de la Asociación de Héroes saca Saitama una nota mala?", "La prueba escrita", "La prueba de fuerza", "La prueba de resistencia", "La prueba de velocidad", ["Which part of the Hero Association exam does Saitama score badly on?", "The written test", "The strength test", "The endurance test", "The speed test"]],
    [2, "¿Qué héroe de Clase S es un genio de 10 años?", "Child Emperor", "Metal Knight", "Tanktop Master", "Puri-Puri Prisoner", ["Which S-Class hero is a 10-year-old genius?", N, N, N, N]],
  ],
  cuphead: [
    [2, "¿Qué ventaja de movimiento tiene Ms. Chalice en el aire?", "Puede hacer doble salto", "Puede planear", "Se agarra de las paredes", "Vuela unos segundos", ["What movement advantage does Ms. Chalice have in the air?", "She can double jump", "She can glide", "She can cling to walls", "She can fly for a few seconds"]],
  ],
  jjk: [
    [3, "¿Cómo se llama la hermana gemela de Maki Zen'in?", "Mai", "Kasumi", "Momo", "Nobara", ["What is the name of Maki Zen'in's twin sister?", N, N, N, N]],
  ],
  csm: [
    [3, "¿Con qué demonio pacta Aki para saber lo que va a pasar unos segundos antes?", "Con el Demonio del Futuro", "Con el Demonio Zorro", "Con el Demonio de la Maldición", "Con el Demonio Ángel", ["Which devil does Aki make a contract with to know what will happen a few seconds ahead?", "The Future Devil", "The Fox Devil", "The Curse Devil", "The Angel Devil"]],
  ],
  valorant: [
    [2, "¿Cómo se llama el torneo que corona cada año al campeón mundial de Valorant?", "Valorant Champions", "Valorant Masters", "Valorant Worlds", "Valorant Global Finals", ["What is the tournament that crowns Valorant's world champion each year called?", N, N, N, N]],
    [3, "¿Qué agente ghanesa controla el mapa desde una vista cósmica?", "Astra", "Omen", "Harbor", "Clove", ["Which Ghanaian agent controls the map from a cosmic view?", N, N, N, N]],
  ],
  hotd: [
    [1, "¿Cómo se llama la hija de Otto Hightower que se casa con el rey?", "Alicent", "Rhaenyra", "Laena", "Helaena", ["What is the name of Otto Hightower's daughter who marries the king?", N, N, N, N]],
    [1, "¿Qué cargo ocupa Otto Hightower como principal consejero de Viserys?", "Mano del Rey", "Gran maestre", "Lord Comandante", "Consejero de la Moneda", ["What position does Otto Hightower hold as Viserys's chief advisor?", "Hand of the King", "Grand Maester", "Lord Commander", "Master of Coin"]],
  ],
  starwars: [
    [2, "¿Qué cyborg separatista tose y colecciona sables de luz de los Jedi?", "Grievous", "Conde Dooku", "Asajj Ventress", "Nute Gunray", ["Which Separatist cyborg coughs and collects Jedi lightsabers?", "Grievous", "Count Dooku", "Asajj Ventress", "Nute Gunray"]],
  ],
  fortnite: [
    [2, "¿Qué objeto azul se bebe para llenar la barra que protege tu vida?", "La poción de escudo", "El botiquín", "La venda", "La manzana", ["Which blue item do you drink to fill the bar that protects your health?", "The shield potion", "The med kit", "The bandage", "The apple"]],
  ],
  crash: [
    [3, "¿Cómo se llama de nombre la sobrina de Neo Cortex?", "Nina", "Coco", "Tawna", "Pasadena", ["What is the first name of Neo Cortex's niece?", N, N, N, N]],
    [2, "¿Qué persigue a Crash cuesta abajo en algunos niveles?", "Una roca enorme", "Un tren", "Un camión", "Una ola", ["What chases Crash downhill in some levels?", "A huge boulder", "A train", "A truck", "A wave"]],
    [1, "¿Qué recoge Crash por montones en cada nivel?", "Frutas Wumpa", "Manzanas doradas", "Mangos", "Bayas", ["What does Crash collect by the bunch in every level?", "Wumpa Fruit", "Golden apples", "Mangoes", "Berries"]],
  ],
  avatar: [
    [1, "¿Cómo se llama la serie secuela de Avatar: la leyenda de Aang?", "La leyenda de Korra", "La leyenda de Kyoshi", "La leyenda de Zuko", "La leyenda de Roku", ["What is the sequel series to Avatar: The Last Airbender called?", "The Legend of Korra", "The Legend of Kyoshi", "The Legend of Zuko", "The Legend of Roku"]],
  ],
  pixar: [
    [2, "En Coco, ¿qué flor guía a las almas de los muertos hasta el mundo de los vivos?", "El cempasúchil", "La rosa roja", "El girasol", "La orquídea", ["In Coco, what flower guides the souls of the dead to the world of the living?", "The marigold", "The red rose", "The sunflower", "The orchid"]],
  ],
  deathnote: [
    [1, "¿Qué frase dice Light mientras escribe nombres a escondidas, en una de las escenas más famosas?", "\"Tomaré una papa frita… ¡y me la comeré!\"", "\"Yo soy la justicia\"", "\"Todo según el plan\"", "\"Eres L, ¿verdad?\"", ["What line does Light say while secretly writing names, in one of the most famous scenes?", "\"I'll take a potato chip… and eat it!\"", "\"I am justice\"", "\"Just as planned\"", "\"You're L, aren't you?\""]],
  ],
  spyfamily: [
    [2, "¿Cómo se llama de nombre el compañero de clase que es hijo de Donovan Desmond?", "Damian", "Ewen", "Emile", "George", ["What is the first name of the classmate who is Donovan Desmond's son?", N, N, N, N]],
  ],
  souls: [
    [2, "¿Quién es el anciano de la silla de ruedas que vive en el Sueño del Cazador?", "Gehrman", "El Padre Gascoigne", "Maese Willem", "Logarius", ["Who is the old man in the wheelchair who lives in the Hunter's Dream?", "Gehrman", "Father Gascoigne", "Master Willem", "Logarius"]],
    [1, "¿Qué mensaje rojo aparece en pantalla cuando caes en combate?", "\"Has muerto\"", "\"Fin del juego\"", "\"Inténtalo otra vez\"", "\"Derrota\"", ["What red message appears on screen when you fall in battle?", "\"YOU DIED\"", "\"GAME OVER\"", "\"TRY AGAIN\"", "\"DEFEAT\""]],
  ],
  stardew: [
    [2, "¿En qué evento de primavera compiten los vecinos por encontrar cosas escondidas en la plaza?", "El Festival del Huevo", "La Danza de las Flores", "El Luau", "El Baile de las Medusas Lunares", ["In which spring event do villagers compete to find hidden items around the town square?", "The Egg Festival", "The Flower Dance", "The Luau", "The Dance of the Moonlight Jellies"]],
  ],
  mha: [
    [3, "¿Cómo se llama de nombre el hermano mayor de Iida que queda herido por Stain?", "Tensei", "Natsuo", "Hitoshi", "Toya", ["What is the first name of Iida's older brother, wounded by Stain?", N, N, N, N]],
  ],
  jojo: [
    [2, "¿Cuál es el Stand de Jolyne Cujoh, la protagonista de la parte 6?", "Stone Free", "Star Platinum", "Gold Experience", "Killer Queen", ["What is the Stand of Jolyne Cujoh, the protagonist of Part 6?", N, N, N, N]],
  ],
  genshin: [
    [2, "¿Quién es la hermana de Kamisato Ayato?", "Ayaka", "Sara", "Yoimiya", "Kokomi", ["Who is Kamisato Ayato's sister?", N, N, N, N]],
  ],
  piratas: [
    [3, "¿Quién es el padre de Elizabeth en Piratas del Caribe?", "Weatherby Swann", "James Norrington", "Lord Beckett", "Joshamee Gibbs", ["Who is Elizabeth's father in Pirates of the Caribbean?", N, N, N, N]],
  ],
  kingdomhearts: [
    [1, "¿Cómo se llama la nave en la que viajan Sora, Donald y Goofy?", "Gumi", "Highwind", "Ragnarok", "Invincible", ["What is the ship Sora, Donald and Goofy travel in called?", "Gummi Ship", "Highwind", "Ragnarok", "Invincible"]],
  ],
  theoffice: [
    [3, "¿Cómo se llama el héroe de «Threat Level Midnight», la película de Michael?", "Agente Michael Scarn", "Agente Michael Danger", "Agente Michael Power", "Agente Michael Steel", ["What is the name of the hero of \"Threat Level Midnight\", Michael's movie?", "Agent Michael Scarn", "Agent Michael Danger", "Agent Michael Power", "Agent Michael Steel"]],
    [2, "¿Cómo se llama la empresa que funda Michael tras renunciar a Dunder Mifflin?", "Michael Scott Paper Company", "Michael Scott & Asociados", "Prestige Paper", "Scranton Paper Co.", ["What is the company Michael founds after quitting Dunder Mifflin called?", "Michael Scott Paper Company", "Michael Scott & Associates", "Prestige Paper", "Scranton Paper Co."]],
  ],
  kimetsu: [
    [1, "¿Qué lleva Inosuke puesto todo el tiempo?", "Una cabeza de jabalí", "Una máscara de zorro", "Un casco de samurái", "Un cráneo de lobo", ["What does Inosuke wear all the time?", "A boar's head", "A fox mask", "A samurai helmet", "A wolf skull"]],
  ],
  gta: [
    [2, "¿Qué primo invita a Niko a Liberty City con promesas de una vida de lujos?", "Roman", "Packie", "Little Jacob", "Vlad", ["Which cousin invites Niko to Liberty City with promises of a life of luxury?", N, N, N, N]],
  ],
  mgs: [
    [2, "¿Qué sistema de MGS V permite a Snake extraer soldados enemigos con un globo?", "El Fulton", "El Códec", "El Solid Eye", "El Cypher", ["Which MGS V system lets Snake extract enemy soldiers with a balloon?", "The Fulton", "The Codec", "The Solid Eye", "The Cypher"]],
    [2, "¿Cómo se llama el cuartel de Big Boss en Metal Gear Solid V?", "Mother Base", "Outer Heaven", "Zanzibar Land", "Shadow Moses", ["What is the name of Big Boss's headquarters in Metal Gear Solid V?", N, N, N, N]],
    [1, "¿Cómo se llama el protagonista del primer MGS de PlayStation?", "Solid Snake", "Raiden", "Revolver Ocelot", "Otacon", ["Who is the protagonist of the first MGS on PlayStation?", N, N, N, N]],
    [2, "¿Quién fue la mentora de Naked Snake?", "The Boss", "EVA", "Quiet", "Sniper Wolf", ["Who was Naked Snake's mentor?", N, N, N, N]],
    [3, "¿Qué tiradora de élite enfrenta Snake en Metal Gear Solid?", "Sniper Wolf", "Quiet", "The End", "Fortune", ["Which elite marksman does Snake face in Metal Gear Solid?", N, N, N, N]],
  ],
  matrix: [
    [2, "¿Qué le pasa al cuerpo real si mueres dentro de la Matrix?", "Deja de vivir también", "Despierta ileso", "Queda en coma", "Se libera de la Matrix", ["What happens to your real body if you die inside the Matrix?", "It stops living too", "It wakes up unharmed", "It falls into a coma", "It is freed from the Matrix"]],
    [1, "¿Cómo se conectan los humanos a la Matrix?", "Con un puerto en la nuca", "Con un casco", "Con unas gafas", "Con un cable en el brazo", ["How are humans hooked up to the Matrix?", "With a port in the back of the neck", "With a helmet", "With goggles", "With a cable in the arm"]],
  ],
  betty: [
    [1, "¿Cómo se llama el grupo de amigas que apoyan a Betty en la oficina?", "El cuartel de las feas", "Las Divinas", "Las Chicas Ecomoda", "Las Pinzón", ["What is the group of friends who support Betty at the office called?", "The Ugly Squad", "The Divas", "The Ecomoda Girls", "The Pinzóns"]],
  ],
  minecraft: [
    [1, "¿Qué criatura grande protege a los aldeanos?", "El gólem de hierro", "El gólem de nieve", "El Wither", "El ravager", ["Which big creature protects villagers?", "The iron golem", "The snow golem", "The Wither", "The ravager"]],
    [1, "¿Qué herramienta usas para sacar peces del agua en Minecraft?", "Una caña", "Una red", "Un arpón", "Unas tijeras", ["Which tool do you use to catch fish in Minecraft?", "A rod", "A net", "A harpoon", "Shears"]],
  ],
  gow: [
    [1, "¿Qué arma usa Kratos en God of War (2018)?", "El Hacha Leviatán", "Mjolnir", "Las Espadas del Caos", "Gungnir", ["Which weapon does Kratos use in God of War (2018)?", "The Leviathan Axe", "Mjolnir", "The Blades of Chaos", "Gungnir"]],
  ],
  spiderman: [
    [3, "¿Cómo se llama de nombre la madre de Miles Morales?", "Rio", "Yuri", "Hailey", "Mary Jane", ["What is the first name of Miles Morales's mother?", N, N, N, N]],
  ],
  animalcrossing: [
    [2, "¿Qué aparece en la playa tras una noche de lluvia de meteoros en New Horizons?", "Fragmentos de estrella", "Fósiles", "Bayas", "Conchas", ["What washes up on the beach after a night of meteor showers in New Horizons?", "Star fragments", "Fossils", "Bells", "Seashells"]],
  ],
  aot: [
    [2, "¿A qué cuerpo quería unirse Jean para vivir cómodo en el interior de las murallas?", "La Policía Militar", "La Legión de Reconocimiento", "La Tropa Estacionaria", "La Guardia Real", ["Which branch did Jean want to join to live comfortably inside the walls?", "The Military Police", "The Survey Corps", "The Garrison", "The Royal Guard"]],
    [1, "¿Qué apodo le ponen a Sasha por comer a escondidas en plena formación?", "La Chica Papa", "La Glotona", "La Cazadora", "La Chica del Pan", ["What nickname does Sasha get for sneaking food in the middle of formation?", "Potato Girl", "The Glutton", "The Huntress", "Bread Girl"]],
  ],
  harrypotter: [
    [2, "¿Cómo se llama esta pieza?", "Hedwig's Theme", "Harry's Wondrous World", "Double Trouble", "Leaving Hogwarts", ["What is this piece called?", N, N, N, N], {"k": "hp-ost-hedwig", "m": "audio", "s": 0, "e": 25}],
  ],
  sailormoon: [
    [3, "Este tema es el de la quinta temporada. ¿Cómo se llama?", "Sailor Star Song", "Moonlight Densetsu", "Moon Pride", "Otome no Policy", ["This theme is from the fifth season. What is it called?", N, N, N, N], {"k": "sailormoon-op-starsong", "m": "audio", "s": 3, "e": 25}],
    [2, "¿Qué joya legendaria buscan los enemigos en la serie?", "El Cristal de Plata", "La Piedra Lunar", "El Diamante Estelar", "El Zafiro Real", ["Which legendary jewel do the enemies seek in the series?", "The Silver Crystal", "The Moonstone", "The Star Diamond", "The Royal Sapphire"]],
    [2, "¿Qué enemigos llegan del futuro en Sailor Moon R?", "La Familia de la Luna Negra", "El Reino Oscuro", "Los Death Busters", "El Circo Dead Moon", ["Which enemies arrive from the future in Sailor Moon R?", "The Black Moon Clan", "The Dark Kingdom", "The Death Busters", "The Dead Moon Circus"]],
  ],
  sololeveling: [
    [2, "¿Cómo se llama el fenómeno en que los monstruos escapan de un portal al mundo real?", "Ruptura de mazmorra", "Invasión de portal", "Colapso espacial", "Marea oscura", ["What is it called when monsters escape from a gate into the real world?", "Dungeon Break", "Gate Invasion", "Spatial Collapse", "Dark Tide"]],
  ],
  chavo: [
    [2, "¿Qué actriz interpretó a la mamá de Quico?", "Florinda Meza", "Angelines Fernández", "María Antonieta de las Nieves", "Ana Lilia Cortés", ["Which actress played Quico's mom?", N, N, N, N]],
    [2, "¿Qué actor interpretó al papá de la Chilindrina?", "Ramón Valdés", "Carlos Villagrán", "Rubén Aguirre", "Germán Valdés", ["Which actor played la Chilindrina's dad?", N, N, N, N]],
  ],
  skyrim: [
    [1, "¿Quién lidera a los Capas de la Tormenta?", "Ulfric", "Tullius", "Jarl Balgruuf", "Esbern", ["Who leads the Stormcloaks?", "Ulfric", "General Tullius", "Jarl Balgruuf", "Esbern"]],
    [2, "¿En qué comarca está el Colegio de Hechiceros?", "En Hibernalia", "En Carrera Blanca", "En Riften", "En Soledad", ["In which hold is the mages' college?", "In Winterhold", "In Whiterun", "In Riften", "In Solitude"]],
  ],
  hades: [
    [3, "¿Con qué arma empieza Zagreus?", "La Espada Estigia", "El Arco Coronación", "El Escudo de Caos", "Las Garras de Malphon", ["Which weapon does Zagreus start with?", "The Stygian Blade", "The Heart-Seeking Bow", "The Shield of Chaos", "The Twin Fists of Malphon"]],
  ],
  ghibli: [
    [2, "¿Qué película de Ghibli sigue a Sheeta y Pazu en busca de una isla flotante?", "El castillo en el cielo", "El castillo ambulante", "Nausicaä", "Porco Rosso", ["Which Ghibli film follows Sheeta and Pazu searching for a floating island?", "Castle in the Sky", "Howl's Moving Castle", "Nausicaä", "Porco Rosso"]],
    [2, "¿Qué película de Ghibli trata de unos seres de pocos centímetros que viven bajo el suelo de una casa?", "Arrietty y el mundo de los diminutos", "Susurros del corazón", "Cuentos de Terramar", "El recuerdo de Marnie", ["Which Ghibli film is about beings a few centimeters tall living under the floor of a house?", "The Secret World of Arrietty", "Whisper of the Heart", "Tales from Earthsea", "When Marnie Was There"]],
    [2, "¿Qué película de 2013 de Isao Takahata adapta un relato japonés sobre una niña hallada dentro de un bambú?", "El cuento de la princesa Kaguya", "La tumba de las luciérnagas", "Mis vecinos los Yamada", "Pompoko", ["Which 2013 Isao Takahata film adapts a Japanese folk story about a girl found inside a bamboo stalk?", "The Tale of the Princess Kaguya", "Grave of the Fireflies", "My Neighbors the Yamadas", "Pom Poko"]],
  ],
  disney: [
    [2, "En Pinocho, ¿cómo se llama el insecto que hace de conciencia del muñeco?", "Pepe Grillo", "Gepetto", "Fígaro", "Mechita", ["In Pinocchio, what is the name of the insect who acts as the puppet's conscience?", "Jiminy Cricket", "Geppetto", "Figaro", "Cleo"]],
  ],
  pokemonanime: [
    [1, "¿De dónde es Ash?", "Pueblo Paleta", "Ciudad Verde", "Ciudad Plateada", "Ciudad Celeste", ["Where is Ash from?", "Pallet Town", "Viridian City", "Pewter City", "Cerulean City"]],
  ],
  portal: [
    [1, "¿Qué esfera de personalidad de Portal 2 está obsesionada con salir al cosmos?", "Space Core", "Fact Core", "Adventure Core", "Morality Core", ["Which Portal 2 personality core is obsessed with going to the cosmos?", N, N, N, N]],
  ],
};
