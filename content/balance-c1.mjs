/* Revisión de equilibrio (oct-2026): subtemas que se quedaron cortos y categorías con pocas difíciles.
 * Souls: casi todo era Elden Ring; Final Fantasy: casi todo FFVII; JoJo: casi todo parte 3 y 5.
 * Formato: [dificultad, pregunta, correcta, mala, mala, mala, [pregunta EN, correcta EN, mala EN, mala EN, mala EN]] (null = igual que en español) */
const N = null;
export default {
  souls: [
    // Dark Souls
    [1, "¿Cuál es el primer jefe que enfrentas en Dark Souls?", "El Demonio del Asilo", "Ornstein y Smough", "Gwyn, Señor de la Ceniza", "Artorias", ["What is the first boss you fight in Dark Souls?", "The Asylum Demon", "Ornstein and Smough", "Gwyn, Lord of Cinder", "Artorias"]],
    [2, "¿Qué jefe con cuernos te espera en el puente del Burgo de los No Muertos?", "El Demonio Taurus", "El Demonio Capra", "El Demonio del Asilo", "El Gaping Dragon", ["Which horned boss waits for you on the bridge of the Undead Burg?", "The Taurus Demon", "The Capra Demon", "The Asylum Demon", "The Gaping Dragon"]],
    [2, "¿Quién mata a la Guardiana del Fuego en el Santuario de Firelink?", "Lautrec de Carim", "Solaire de Astora", "Siegmeyer de Catarina", "Havel el Roca", ["Who kills the Fire Keeper at Firelink Shrine?", "Lautrec of Carim", "Solaire of Astora", "Siegmeyer of Catarina", "Havel the Rock"]],
    [2, "¿Qué jefa mitad araña y mitad mujer enfrentas tras cruzar Blighttown?", "Quelaag, la Bruja del Caos", "Priscilla, la Mestiza", "La Bruja de Izalith", "Gwyndolin", ["Which half-spider, half-woman boss do you fight after Blighttown?", "Chaos Witch Quelaag", "Priscilla the Halfbreed", "The Witch of Izalith", "Gwyndolin"]],
    [3, "¿Dónde vive Priscilla, la dragona mestiza de la cola larga y el pelo blanco?", "En el Mundo Pintado de Ariamis", "En Anor Londo", "En la Cripta de los Gigantes", "En la Cueva de Cristal", ["Where does Priscilla, the half-dragon with the long tail and white hair, live?", "In the Painted World of Ariamis", "In Anor Londo", "In the Tomb of the Giants", "In the Crystal Cave"]],
    [2, "¿Cómo se llama el DLC de Dark Souls que transcurre en Oolacile?", "Artorias of the Abyss", "The Ringed City", "Ashes of Ariandel", "Crown of the Sunken King", ["What is the Dark Souls DLC set in Oolacile called?", N, "The Ringed City", "Ashes of Ariandel", "Crown of the Sunken King"]],
    [2, "¿Qué jefe de Dark Souls es una masa de ramas corruptas nacida de la Bruja de Izalith?", "El Lecho del Caos", "Seath el Descamado", "Nito", "Los Cuatro Reyes", ["Which Dark Souls boss is a mass of corrupted branches born from the Witch of Izalith?", "The Bed of Chaos", "Seath the Scaleless", "Nito", "The Four Kings"]],
    // Dark Souls II
    [2, "¿En qué reino transcurre Dark Souls II?", "Drangleic", "Lordran", "Lothric", "Boletaria", ["In which kingdom is Dark Souls II set?", N, "Lordran", "Lothric", "Boletaria"]],
    [2, "¿Cómo se llama el pueblo que hace de centro de operaciones en Dark Souls II?", "Majula", "Santuario de Firelink", "El Nexus", "El Sueño del Cazador", ["What is the hub town of Dark Souls II called?", N, "Firelink Shrine", "The Nexus", "The Hunter's Dream"]],
    [2, "¿Quién te sube de nivel en Majula, en Dark Souls II?", "La Heraldo Esmeralda", "La Doncella de Negro", "La Muñeca", "La Guardiana del Fuego", ["Who levels you up in Majula, in Dark Souls II?", "The Emerald Herald", "The Maiden in Black", "The Doll", "The Fire Keeper"]],
    // Dark Souls III
    [2, "¿En qué reino transcurre Dark Souls III?", "Lothric", "Lordran", "Drangleic", "Boletaria", ["In which kingdom is Dark Souls III set?", N, "Lordran", "Drangleic", "Boletaria"]],
    [2, "¿Cuál es el jefe final de Dark Souls III?", "El Alma de la Ceniza", "El Rey Sin Nombre", "El Pontífice Sulyvahn", "Los Vigilantes del Abismo", ["Who is the final boss of Dark Souls III?", "The Soul of Cinder", "The Nameless King", "Pontiff Sulyvahn", "The Abyss Watchers"]],
    [3, "¿Qué jefe opcional de Dark Souls III es el primogénito de Gwyn y cabalga un wyvern?", "El Rey Sin Nombre", "Yhorm el Gigante", "Gael, el Caballero Esclavo", "Aldrich, el Devorador de Dioses", ["Which optional Dark Souls III boss is Gwyn's firstborn and rides a wyvern?", "The Nameless King", "Yhorm the Giant", "Slave Knight Gael", "Aldrich, Devourer of Gods"]],
    [2, "¿Cómo se llaman los dos DLC de Dark Souls III?", "Ashes of Ariandel y The Ringed City", "Artorias of the Abyss y Old Hunters", "Crown of the Sunken King y Ivory King", "Shadow of the Erdtree y Nightreign", ["What are the two Dark Souls III DLC called?", "Ashes of Ariandel and The Ringed City", "Artorias of the Abyss and The Old Hunters", "Crown of the Sunken King and Crown of the Ivory King", "Shadow of the Erdtree and Nightreign"]],
    // Demon's Souls
    [2, "¿Cómo se llama el reino de Demon's Souls?", "Boletaria", "Lordran", "Drangleic", "Lothric", ["What is the kingdom of Demon's Souls called?", N, "Lordran", "Drangleic", "Lothric"]],
    [2, "¿Cómo se llama el santuario central donde subes de nivel en Demon's Souls?", "El Nexus", "Majula", "El Santuario de Firelink", "El Sueño del Cazador", ["What is the central hub where you level up in Demon's Souls called?", "The Nexus", "Majula", "Firelink Shrine", "The Hunter's Dream"]],
    [2, "¿Qué estudio hizo el remake de Demon's Souls de 2020 para PS5?", "Bluepoint Games", "FromSoftware", "Naughty Dog", "Santa Monica Studio", ["Which studio made the 2020 Demon's Souls remake for PS5?", N, "FromSoftware", "Naughty Dog", "Santa Monica Studio"]],
    // Bloodborne
    [1, "¿Qué se obtiene al derrotar enemigos en Bloodborne?", "Ecos de Sangre", "Almas", "Runas", "Esencias", ["What do you get for defeating enemies in Bloodborne?", "Blood Echoes", "Souls", "Runes", "Essences"]],
    [2, "¿Cuál es el primer jefe de Bloodborne?", "La Bestia Clérigo", "El Padre Gascoigne", "La Vicaria Amelia", "Rom, la Araña Vacía", ["What is the first boss of Bloodborne?", "The Cleric Beast", "Father Gascoigne", "Vicar Amelia", "Rom, the Vacuous Spider"]],
    [2, "¿Quién es el anciano de la silla de ruedas que vive en el Sueño del Cazador?", "Gehrman, el Primer Cazador", "El Padre Gascoigne", "Maese Willem", "Logarius", ["Who is the old man in the wheelchair who lives in the Hunter's Dream?", "Gehrman, the First Hunter", "Father Gascoigne", "Master Willem", "Logarius"]],
    [2, "¿En qué año salió Bloodborne?", "2015", "2013", "2014", "2016", ["In what year was Bloodborne released?", N, "2013", "2014", "2016"]],
    [1, "¿En qué consola salió Bloodborne?", "PlayStation 4", "Xbox One", "PlayStation 3", "Nintendo Switch", ["Which console was Bloodborne released on?", N, "Xbox One", "PlayStation 3", "Nintendo Switch"]],
    [3, "¿En qué lugar enfrentas a Lady María?", "En la Torre del Reloj Astral", "En la Catedral de Yharnam", "En el Sueño del Cazador", "En el Laboratorio Byrgenwerth", ["Where do you fight Lady Maria?", "In the Astral Clocktower", "In the Yharnam Cathedral", "In the Hunter's Dream", "In the Byrgenwerth Lecture Building"]],
    [3, "¿Qué jefe final del DLC The Old Hunters es un enorme recién nacido?", "El Huérfano de Kos", "La Presencia de la Luna", "Ludwig el Maldito", "Rom, la Araña Vacía", ["Which final boss of The Old Hunters DLC is an enormous newborn?", "The Orphan of Kos", "The Moon Presence", "Ludwig, the Accursed", "Rom, the Vacuous Spider"]],
    // Sekiro
    [1, "¿Qué barra, además de la vida, hay que romper para derrotar a un jefe en Sekiro?", "La de postura", "La de aguante", "La de estamina", "La de fe", ["Besides health, which bar must you break to defeat a boss in Sekiro?", "The posture bar", "The endurance bar", "The stamina bar", "The faith bar"]],
    [2, "¿Cómo se llama la katana de Lobo en Sekiro?", "Kusabimaru", "Masamune", "Tessaiga", "Muramasa", ["What is Wolf's katana called in Sekiro?", N, "Masamune", "Tessaiga", "Muramasa"]],
    [2, "¿A quién jura proteger Lobo en Sekiro?", "A Kuro, el Heredero Divino", "A Genichiro Ashina", "A Emma, la médica", "Al Búho", ["Who does Wolf swear to protect in Sekiro?", "Kuro, the Divine Heir", "Genichiro Ashina", "Emma, the physician", "The Owl"]],
    [2, "¿Cómo se llama la enfermedad que se contagia a los personajes cuando mueres en Sekiro?", "La Pudrición del Dragón", "La Peste Escarlata", "La Podredumbre Roja", "La Maldición Sin Muerte", ["What is the illness that spreads to characters when you die in Sekiro called?", "Dragonrot", "The Scarlet Plague", "The Scarlet Rot", "The Undead Curse"]],
    [3, "¿Qué premio ganó Sekiro en The Game Awards 2019?", "Juego del Año", "Mejor Dirección", "Mejor Banda Sonora", "Mejor Juego de Acción", ["Which award did Sekiro win at The Game Awards 2019?", "Game of the Year", "Best Game Direction", "Best Score/Music", "Best Action Game"]],
  ],

  ff: [
    [2, "¿Quién es el Caballero Oscuro protagonista de Final Fantasy IV?", "Cecil Harvey", "Cloud Strife", "Zidane Tribal", "Bartz Klauser", ["Who is the Dark Knight protagonist of Final Fantasy IV?", N, "Cloud Strife", "Zidane Tribal", "Bartz Klauser"]],
    [3, "¿Cómo se llama el protagonista de Final Fantasy V?", "Bartz Klauser", "Terra Branford", "Cecil Harvey", "Squall Leonhart", ["Who is the protagonist of Final Fantasy V?", N, "Terra Branford", "Cecil Harvey", "Squall Leonhart"]],
    [2, "¿Qué heroína mitad esper protagoniza Final Fantasy VI?", "Terra Branford", "Celes Chere", "Rydia", "Yuna", ["Which half-esper heroine stars in Final Fantasy VI?", N, "Celes Chere", "Rydia", "Yuna"]],
    [3, "¿Quién es el emperador del Imperio en Final Fantasy VI?", "Gestahl", "Kefka", "Golbez", "Seymour", ["Who is the emperor of the Empire in Final Fantasy VI?", N, "Kefka", "Golbez", "Seymour"]],
    [2, "¿Cómo se llama el cuerpo mercenario de élite al que aspira Squall en Final Fantasy VIII?", "SeeD", "SOLDADO", "Los Turcos", "Avalancha", ["What is the elite mercenary corps Squall aspires to join in Final Fantasy VIII called?", N, "SOLDIER", "The Turks", "Avalanche"]],
    [2, "¿Cómo se llama el minijuego de cartas de Final Fantasy VIII?", "Triple Triad", "Tetra Master", "Gwent", "Blitzbol", ["What is the card minigame in Final Fantasy VIII called?", N, "Tetra Master", "Gwent", "Blitzball"]],
    [3, "¿Cómo se llama la compañía de teatro de Zidane en Final Fantasy IX?", "Tantalus", "Shinra", "Avalancha", "Los Turcos", ["What is Zidane's theater troupe called in Final Fantasy IX?", N, "Shinra", "Avalanche", "The Turks"]],
    [2, "¿Cómo se llama el deporte acuático que juega Tidus en Final Fantasy X?", "Blitzbol", "Triple Triad", "Waterpolo", "Surfball", ["What is the underwater sport Tidus plays in Final Fantasy X called?", "Blitzball", "Triple Triad", "Water polo", "Surfball"]],
    [2, "¿Cómo se llama el monstruo colosal que azota Spira en Final Fantasy X?", "Sin", "Omega", "Bahamut", "Ultimecia", ["What is the colossal monster that ravages Spira in Final Fantasy X called?", N, "Omega", "Bahamut", "Ultimecia"]],
    [3, "¿Quién es el pirata del aire que acompaña a Vaan en Final Fantasy XII?", "Balthier", "Basch", "Cid", "Vayne", ["Who is the sky pirate who travels with Vaan in Final Fantasy XII?", N, "Basch", "Cid", "Vayne"]],
    [3, "¿Cómo se llama el relanzamiento de 2013 que rescató a Final Fantasy XIV?", "A Realm Reborn", "Shadowbringers", "Heavensward", "Endwalker", ["What is the 2013 relaunch that rescued Final Fantasy XIV called?", N, "Shadowbringers", "Heavensward", "Endwalker"]],
    [2, "¿Quiénes acompañan a Noctis en su viaje en Final Fantasy XV?", "Gladiolus, Ignis y Prompto", "Cloud, Tifa y Barret", "Zidane, Vivi y Steiner", "Squall, Zell y Quistis", ["Who travels with Noctis in Final Fantasy XV?", "Gladiolus, Ignis and Prompto", "Cloud, Tifa and Barret", "Zidane, Vivi and Steiner", "Squall, Zell and Quistis"]],
    [3, "¿Cómo se llama el auto de lujo en el que viajan Noctis y sus amigos?", "Regalia", "Highwind", "Ragnarok", "Falcon", ["What is the luxury car that Noctis and his friends travel in called?", N, "Highwind", "Ragnarok", "Falcon"]],
    [3, "¿Cómo se llama el hermano menor de Clive en Final Fantasy XVI?", "Joshua", "Cid", "Dion", "Hugo", ["What is Clive's younger brother called in Final Fantasy XVI?", N, "Cid", "Dion", "Hugo"]],
  ],

  jojo: [
    [2, "¿Con quién se casa Jonathan Joestar?", "Con Erina Pendleton", "Con Lisa Lisa", "Con Suzi Q", "Con Trish Una", ["Who does Jonathan Joestar marry?", "Erina Pendleton", "Lisa Lisa", "Suzi Q", "Trish Una"]],
    [3, "¿Cómo se llama el perro de Jonathan en Phantom Blood?", "Danny", "Iggy", "Coco Jumbo", "Fido", ["What is Jonathan's dog called in Phantom Blood?", N, "Iggy", "Coco Jumbo", "Fido"]],
    [2, "¿Qué frase suele soltar Joseph Joestar antes de adivinar lo que dirá su rival?", "«¡Tu siguiente línea será…!»", "«¡Yare yare daze!»", "«¡Oh, mi Dios!»", "«¡Arrivederci!»", ["What does Joseph Joestar often say before predicting what his opponent will say?", "\"Your next line is...!\"", "\"Yare yare daze!\"", "\"Oh my god!\"", "\"Arrivederci!\""]],
    [3, "¿Cuál de estos personajes NO es uno de los Hombres Pilares de Battle Tendency?", "Straizo", "Wamuu", "Esidisi", "Kars", ["Which of these characters is NOT one of the Pillar Men of Battle Tendency?", N, N, N, N]],
    [3, "¿Quién es el dueño del Stand Red Hot Chili Pepper en Diamond is Unbreakable?", "Akira Otoishi", "Yoshikage Kira", "Keicho Nijimura", "Toshikazu Hazamada", ["Who owns the Stand Red Hot Chili Pepper in Diamond is Unbreakable?", N, "Yoshikage Kira", "Keicho Nijimura", "Toshikazu Hazamada"]],
    [2, "¿Cuál es el Stand de Jolyne Cujoh en Stone Ocean?", "Stone Free", "Star Platinum", "Gold Experience", "Killer Queen", ["What is Jolyne Cujoh's Stand in Stone Ocean?", N, "Star Platinum", "Gold Experience", "Killer Queen"]],
    [2, "¿Quién protagoniza Steel Ball Run, la séptima parte de JoJo?", "Johnny Joestar", "Jotaro Kujo", "Giorno Giovanna", "Josuke Higashikata", ["Who is the protagonist of Steel Ball Run, the seventh part of JoJo?", N, "Jotaro Kujo", "Giorno Giovanna", "Josuke Higashikata"]],
    [2, "¿En qué consiste la carrera de Steel Ball Run?", "Una carrera a caballo a través de Estados Unidos", "Un torneo de artes marciales en Japón", "Una carrera de autos en Italia", "Una expedición al Polo Norte", ["What is the Steel Ball Run race?", "A horse race across the United States", "A martial arts tournament in Japan", "A car race in Italy", "An expedition to the North Pole"]],
    [3, "¿Cómo se llama la octava parte de JoJo's Bizarre Adventure?", "JoJolion", "Steel Ball Run", "Stone Ocean", "Vento Aureo", ["What is the eighth part of JoJo's Bizarre Adventure called?", N, "Steel Ball Run", "Stone Ocean", "Golden Wind"]],
  ],

  pokemon: [
    [3, "¿Qué Pokémon tiene el número 493 en la Pokédex, el último de la cuarta generación?", "Arceus", "Dialga", "Giratina", "Darkrai", ["Which Pokémon is number 493 in the Pokédex, the last of the fourth generation?", N, "Dialga", "Giratina", "Darkrai"]],
    [3, "¿Cómo se llama el profesor Pokémon de Hoenn?", "Abedul", "Elm", "Oak", "Serbal", ["What is the Hoenn Pokémon professor called?", "Birch", "Elm", "Oak", "Rowan"]],
    [3, "¿Cuáles son los tres Pokémon iniciales de Teselia (Unova)?", "Snivy, Tepig y Oshawott", "Chikorita, Cyndaquil y Totodile", "Treecko, Torchic y Mudkip", "Turtwig, Chimchar y Piplup", ["Which are the three starter Pokémon of Unova?", "Snivy, Tepig and Oshawott", "Chikorita, Cyndaquil and Totodile", "Treecko, Torchic and Mudkip", "Turtwig, Chimchar and Piplup"]],
    [3, "¿Qué ciudad real inspira a Ciudad Castelia, la mayor ciudad de Teselia?", "Nueva York", "París", "Tokio", "Londres", ["Which real city inspired Castelia City, the biggest city in Unova?", "New York", "Paris", "Tokyo", "London"]],
    [2, "¿Qué mecánica de Espada y Escudo permite agrandar a los Pokémon durante el combate?", "Dinamax", "Teracristalización", "Megaevolución", "Movimiento Z", ["Which Sword and Shield mechanic lets Pokémon grow huge in battle?", "Dynamax", "Terastallization", "Mega Evolution", "Z-Move"]],
    [2, "¿Qué mecánica nueva estrenan Escarlata y Púrpura?", "Teracristalización", "Dinamax", "Megaevolución", "Movimiento Z", ["Which new mechanic do Scarlet and Violet introduce?", "Terastallization", "Dynamax", "Mega Evolution", "Z-Move"]],
    [2, "¿Qué legendario de Diamante y Perla controla el tiempo?", "Dialga", "Palkia", "Giratina", "Arceus", ["Which legendary Pokémon of Diamond and Pearl controls time?", N, "Palkia", "Giratina", "Arceus"]],
    [2, "¿Qué tipo es inmune a los ataques de tipo Psíquico?", "Siniestro", "Fantasma", "Normal", "Acero", ["Which type is immune to Psychic-type moves?", "Dark", "Ghost", "Normal", "Steel"]],
  ],

  ciencia: [
    [3, "¿Cuál es el elemento más abundante en la corteza terrestre?", "El oxígeno", "El silicio", "El hierro", "El aluminio", ["What is the most abundant element in the Earth's crust?", "Oxygen", "Silicon", "Iron", "Aluminium"]],
    [3, "¿Qué científico descubrió la radiactividad en 1896?", "Henri Becquerel", "Marie Curie", "Ernest Rutherford", "Wilhelm Röntgen", ["Which scientist discovered radioactivity in 1896?", N, "Marie Curie", "Ernest Rutherford", "Wilhelm Röntgen"]],
    [3, "¿Cuántos elementos tiene la tabla periódica actual?", "118", "92", "103", "126", ["How many elements does the current periodic table have?", N, N, N, N]],
    [3, "¿Quién propuso en 1543 que la Tierra gira alrededor del Sol?", "Nicolás Copérnico", "Galileo Galilei", "Johannes Kepler", "Isaac Newton", ["Who proposed in 1543 that the Earth revolves around the Sun?", "Nicolaus Copernicus", "Galileo Galilei", "Johannes Kepler", "Isaac Newton"]],
    [3, "¿Cuál es el metal que mejor conduce la electricidad?", "La plata", "El cobre", "El oro", "El aluminio", ["Which metal conducts electricity best?", "Silver", "Copper", "Gold", "Aluminium"]],
    [3, "¿Quién formuló las tres leyes del movimiento de los planetas?", "Johannes Kepler", "Nicolás Copérnico", "Tycho Brahe", "Galileo Galilei", ["Who formulated the three laws of planetary motion?", N, "Nicolaus Copernicus", "Tycho Brahe", "Galileo Galilei"]],
    [3, "¿Qué elemento químico tiene número atómico 79?", "El oro", "La plata", "El platino", "El mercurio", ["Which chemical element has atomic number 79?", "Gold", "Silver", "Platinum", "Mercury"]],
    [3, "¿Cómo se llama la capa externa del Sol que se ve durante un eclipse total?", "La corona", "La fotosfera", "La cromosfera", "El núcleo", ["What is the Sun's outer layer visible during a total eclipse called?", "The corona", "The photosphere", "The chromosphere", "The core"]],
    [2, "¿Qué efecto hace que una sirena suene más aguda al acercarse y más grave al alejarse?", "El efecto Doppler", "El efecto Joule", "El efecto Zeeman", "El efecto Coriolis", ["Which effect makes a siren sound higher as it approaches and lower as it moves away?", "The Doppler effect", "The Joule effect", "The Zeeman effect", "The Coriolis effect"]],
    [2, "¿Cuántos pares de cromosomas tiene el ser humano?", "23", "46", "21", "48", ["How many pairs of chromosomes do humans have?", N, N, N, N]],
  ],

  deportes: [
    [3, "¿Cuántos títulos de Grand Slam ganó Rafael Nadal?", "22", "20", "24", "18", ["How many Grand Slam titles did Rafael Nadal win?", N, N, N, N]],
    [3, "¿Cuántos títulos de Grand Slam ha ganado Novak Djokovic?", "24", "20", "22", "26", ["How many Grand Slam titles has Novak Djokovic won?", N, N, N, N]],
    [3, "¿En qué país se inventó el voleibol?", "En Estados Unidos", "En Brasil", "En Japón", "En Rusia", ["In which country was volleyball invented?", "In the United States", "In Brazil", "In Japan", "In Russia"]],
    [3, "¿Qué club ganó la primera Copa de Europa, en 1956?", "Real Madrid", "Milan", "Benfica", "Manchester United", ["Which club won the first European Cup, in 1956?", N, "Milan", "Benfica", "Manchester United"]],
    [3, "¿Qué selección ganó el Mundial de 1966?", "Inglaterra", "Alemania Occidental", "Brasil", "Portugal", ["Which team won the 1966 World Cup?", "England", "West Germany", "Brazil", "Portugal"]],
    [3, "¿Cuántos Balones de Oro ganó Cristiano Ronaldo?", "5", "4", "6", "7", ["How many Ballon d'Or awards did Cristiano Ronaldo win?", N, N, N, N]],
    [2, "¿En qué ciudad se celebraron los Juegos Olímpicos de 1992?", "Barcelona", "Atlanta", "Seúl", "Sídney", ["In which city were the 1992 Olympic Games held?", N, "Atlanta", "Seoul", "Sydney"]],
    [2, "¿Qué piloto igualó los siete campeonatos de F1 de Michael Schumacher?", "Lewis Hamilton", "Sebastian Vettel", "Ayrton Senna", "Max Verstappen", ["Which driver matched Michael Schumacher's seven F1 titles?", N, "Sebastian Vettel", "Ayrton Senna", "Max Verstappen"]],
  ],

  harrypotter: [
    [3, "¿Cuál es el apellido de soltera de Molly Weasley?", "Prewett", "Black", "Longbottom", "Lovegood", ["What is Molly Weasley's maiden name?", N, "Black", "Longbottom", "Lovegood"]],
    [3, "¿Cómo se llama el fantasma de la casa Ravenclaw?", "La Dama Gris", "El Barón Sanguinario", "Nick Casi Decapitado", "El Fraile Gordo", ["What is the Ravenclaw house ghost called?", "The Grey Lady", "The Bloody Baron", "Nearly Headless Nick", "The Fat Friar"]],
    [3, "¿Cómo se llama el fantasma de la casa Slytherin?", "El Barón Sanguinario", "La Dama Gris", "El Fraile Gordo", "Myrtle la Llorona", ["What is the Slytherin house ghost called?", "The Bloody Baron", "The Grey Lady", "The Fat Friar", "Moaning Myrtle"]],
    [3, "¿Cuál es el segundo nombre de Ron Weasley?", "Bilius", "Arthur", "Sirius", "Septimus", ["What is Ron Weasley's middle name?", N, "Arthur", "Sirius", "Septimus"]],
    [3, "¿En qué año nació Harry Potter, según los libros?", "1980", "1979", "1981", "1982", ["In what year was Harry Potter born, according to the books?", N, N, N, N]],
    [2, "¿Cómo se llama la sala secreta donde se reúne el Ejército de Dumbledore?", "La Sala de los Menesteres", "La Cámara de los Secretos", "La Sala Común", "El Cuarto de Mapas", ["What is the secret room where Dumbledore's Army meets called?", "The Room of Requirement", "The Chamber of Secrets", "The Common Room", "The Map Room"]],
    [2, "¿Qué maldición imperdonable permite controlar la voluntad de otra persona?", "Imperius", "Cruciatus", "Avada Kedavra", "Crucio", ["Which Unforgivable Curse lets you control another person's will?", "Imperius", "Cruciatus", "Avada Kedavra", "Sectumsempra"]],
    [2, "¿Qué Horrocrux destruye Harry en la Cámara de los Secretos con el colmillo de un basilisco?", "El diario de Tom Riddle", "El guardapelo de Slytherin", "La copa de Hufflepuff", "El anillo de Gaunt", ["Which Horcrux does Harry destroy in the Chamber of Secrets with a basilisk fang?", "Tom Riddle's diary", "Slytherin's locket", "Hufflepuff's cup", "Gaunt's ring"]],
  ],

  skyrim: [
    [3, "¿Cómo se llama el dragón lugarteniente de Alduin que se alía con el Sangre de Dragón?", "Odahviing", "Paarthurnax", "Nahagliiv", "Viinturuth", ["What is the name of Alduin's dragon lieutenant who allies with the Dragonborn?", N, "Paarthurnax", "Nahagliiv", "Viinturuth"]],
    [3, "¿Qué significan las tres palabras del Grito «Fus Ro Dah»?", "Fuerza, Equilibrio, Empuje", "Fuego, Rayo, Hielo", "Aliento, Llama, Muerte", "Viento, Tierra, Mar", ["What do the three words of the «Fus Ro Dah» Shout mean?", "Force, Balance, Push", "Fire, Lightning, Ice", "Breath, Flame, Death", "Wind, Earth, Sea"]],
    [3, "¿En qué año de la Cuarta Era comienza la historia de Skyrim?", "El 201", "El 101", "El 1", "El 301", ["In what year of the Fourth Era does the story of Skyrim begin?", "201", "101", "1", "301"]],
    [2, "¿A qué dios, antes un hombre, veneran los nórdicos y prohíben los Thalmor?", "Talos", "Akatosh", "Shor", "Kynareth", ["Which god, once a man, do the Nords worship and the Thalmor ban?", N, "Akatosh", "Shor", "Kynareth"]],
  ],

  starwars: [
    [3, "¿En qué año se estrenó El Imperio contraataca?", "1980", "1979", "1983", "1977", ["In what year was The Empire Strikes Back released?", N, N, N, N]],
    [3, "¿En qué año se estrenó El retorno del Jedi?", "1983", "1980", "1985", "1981", ["In what year was Return of the Jedi released?", N, N, N, N]],
    [3, "¿Quién es el padre de Anakin Skywalker?", "No tiene padre: fue concebido por la Fuerza", "Qui-Gon Jinn", "Shmi Skywalker", "Cliegg Lars", ["Who is Anakin Skywalker's father?", "He has no father: he was conceived by the Force", "Qui-Gon Jinn", "Shmi Skywalker", "Cliegg Lars"]],
    [3, "¿Cómo se llama la luna donde está la base rebelde que destruye la primera Estrella de la Muerte?", "Yavin 4", "Endor", "Hoth", "Dantooine", ["What is the moon with the rebel base that destroys the first Death Star called?", N, "Endor", "Hoth", "Dantooine"]],
    [2, "¿Cuál es el planeta natal de Padmé Amidala?", "Naboo", "Alderaan", "Tatooine", "Coruscant", ["What is Padmé Amidala's home planet?", N, "Alderaan", "Tatooine", "Coruscant"]],
    [2, "¿Qué almirante rebelde grita «¡Es una trampa!»?", "Ackbar", "Mon Mothma", "Piett", "Rieekan", ["Which rebel admiral shouts \"It's a trap!\"?", "Ackbar", "Mon Mothma", "Piett", "Rieekan"]],
  ],
};
