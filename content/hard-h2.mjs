// Preguntas difíciles de verdad (datos concretos de la obra): Marvel, Breaking Bad, Pokémon, Disney, Dragon Ball y Mario.
// Formato: [dificultad, pregunta, correcta, mala, mala, mala, [pregunta EN, correcta EN, mala EN, mala EN, mala EN]] (null = igual que en español)
const N = null;

export default {
  mcu: [
    [3, "¿Qué personaje interpreta Jon Favreau, director de la primera Iron Man, en las películas?", "Happy Hogan", "Pepper Potts", "Phil Coulson", "Rhodey", ["Which character does Jon Favreau, director of the first Iron Man, play in the movies?", N, N, N, N]],
    [2, "¿Quiénes dirigieron Vengadores: Endgame?", "Anthony y Joe Russo", "Joss Whedon", "James Gunn y Taika Waititi", "Jon Watts y Ryan Coogler", ["Who directed Avengers: Endgame?", "Anthony and Joe Russo", N, "James Gunn and Taika Waititi", "Jon Watts and Ryan Coogler"]],
    [3, "¿Cómo se llama la inteligencia artificial del traje de Spider-Man en Homecoming?", "Karen", "Friday", "Edith", "Jarvis", ["What is the artificial intelligence in Spider-Man's suit in Homecoming called?", N, N, N, N]],
    [3, "¿Qué canción baila Star-Lord en la escena inicial de Guardianes de la Galaxia?", "«Come and Get Your Love»", "«Hooked on a Feeling»", "«Mr. Blue Sky»", "«Spirit in the Sky»", ["What song does Star-Lord dance to in the opening scene of Guardians of the Galaxy?", N, N, N, N]],
    [3, "¿Dónde forja Thor su hacha Rompetormentas?", "En Nidavellir", "En Asgard", "En Svartalfheim", "En Muspelheim", ["Where does Thor forge his axe Stormbreaker?", "In Nidavellir", "In Asgard", "In Svartalfheim", "In Muspelheim"]],
    [2, "¿Quién interpretó a Hulk en El increíble Hulk (2008)?", "Edward Norton", "Mark Ruffalo", "Eric Bana", "Liev Schreiber", ["Who played Hulk in The Incredible Hulk (2008)?", N, N, N, N]],
  ],
  breakingbad: [
    [3, "¿Cuál es la dirección de la casa de los White?", "308 Negra Arroyo Lane", "316 Negra Arroyo Lane", "308 Pinon Street", "4901 Los Pollos Drive", ["What is the address of the White family home?", N, N, N, N]],
    [3, "¿Cómo se llama el episodio de la tercera temporada centrado casi entero en una mosca?", "Fly", "Caballo", "Más", "Salud", ["What is the third-season episode almost entirely about a fly called?", "Fly", "Caballo", "Mas", "Salud"]],
    [3, "¿Cómo se llama el episodio de la quinta temporada en el que muere Hank, considerado por muchos el mejor de la serie?", "Ozymandias", "Granite State", "Felina", "Say My Name", ["What is the fifth-season episode in which Hank dies, considered by many the best of the series, called?", N, N, N, N]],
    [3, "¿Qué canción suena mientras Walter mira el laboratorio en la escena final?", "«Baby Blue», de Badfinger", "«Crystal Blue Persuasion»", "«Dead Man's Party»", "«Magic Carpet Ride»", ["Which song plays while Walter looks at the lab in the final scene?", "\"Baby Blue\" by Badfinger", "\"Crystal Blue Persuasion\"", "\"Dead Man's Party\"", "\"Magic Carpet Ride\""]],
    [3, "¿Qué cumpleaños celebra Walter en el primer episodio?", "El 50.º", "El 40.º", "El 45.º", "El 55.º", ["Which birthday does Walter celebrate in the first episode?", "His 50th", "His 40th", "His 45th", "His 55th"]],
  ],
  pokemon: [
    [2, "¿Qué número tiene Mewtwo en la Pokédex nacional?", "150", "149", "151", "144", ["What number is Mewtwo in the National Pokédex?", N, N, N, N]],
    [3, "¿Qué medalla se gana al vencer a Misty en Rojo y Azul?", "La Medalla Cascada", "La Medalla Trueno", "La Medalla Arcoíris", "La Medalla Pantano", ["Which badge do you earn by beating Misty in Red and Blue?", "The Cascade Badge", "The Thunder Badge", "The Rainbow Badge", "The Marsh Badge"]],
    [3, "¿Qué dragón es el as de Cynthia, campeona de Sinnoh?", "Garchomp", "Salamence", "Dragonite", "Haxorus", ["Which dragon is the ace of Cynthia, Sinnoh's champion?", N, N, N, N]],
    [3, "¿Qué legendario aparece en la portada de Pokémon Perla?", "Palkia", "Dialga", "Giratina", "Arceus", ["Which legendary is on the cover of Pokémon Pearl?", N, N, N, N]],
    [3, "¿Qué legendario aparece en la portada de Pokémon Cristal?", "Suicune", "Raikou", "Entei", "Celebi", ["Which legendary is on the cover of Pokémon Crystal?", N, N, N, N]],
    [2, "¿Qué dos tipos tiene Gengar?", "Fantasma y Veneno", "Fantasma y Siniestro", "Fantasma y Psíquico", "Veneno y Siniestro", ["What two types is Gengar?", "Ghost and Poison", "Ghost and Dark", "Ghost and Psychic", "Poison and Dark"]],
  ],
  disney: [
    [2, "¿Cómo se llama el mapache de Pocahontas?", "Meeko", "Flit", "Percy", "Terk", ["What is Pocahontas' raccoon called?", N, N, N, N]],
    [3, "¿Cómo se llaman las gárgolas amigas de Quasimodo?", "Victor, Hugo y Laverne", "Gus, Jaq y Perla", "Timón, Pumba y Rafiki", "Flit, Meeko y Percy", ["What are Quasimodo's gargoyle friends called?", "Victor, Hugo and Laverne", "Gus, Jaq and Perla", "Timon, Pumbaa and Rafiki", "Flit, Meeko and Percy"]],
    [2, "¿Qué número de experimento es Stitch?", "626", "625", "627", "600", ["Which experiment number is Stitch?", N, N, N, N]],
    [3, "¿Cómo se llama el elefante amigo de Tarzán?", "Tantor", "Terk", "Kerchak", "Tuke", ["What is Tarzan's elephant friend called?", N, N, N, N]],
    [3, "¿Cómo se llama el ratón amigo de Dumbo?", "Timoteo", "Jaq", "Mickey", "Basil", ["What is Dumbo's mouse friend called?", "Timothy", "Jaq", "Mickey", "Basil"]],
    [2, "¿Qué canción de Pocahontas ganó el Óscar?", "«Colors of the Wind»", "«Just Around the Riverbend»", "«Mine, Mine, Mine»", "«Savages»", ["Which song from Pocahontas won the Oscar?", "\"Colors of the Wind\"", "\"Just Around the Riverbend\"", "\"Mine, Mine, Mine\"", "\"Savages\""]],
  ],
  dragonball: [
    [2, "¿Cuántos deseos concede Porunga, el dragón de Namek?", "Tres", "Uno", "Dos", "Cinco", ["How many wishes does Porunga, Namek's dragon, grant?", "Three", "One", "Two", "Five"]],
    [3, "¿Quién le corta la cola a Vegeta cuando es un Ozaru?", "Yajirobe", "Krilin", "Yamcha", "Tenshinhan", ["Who cuts off Vegeta's tail when he is an Oozaru?", N, N, N, N]],
    [3, "¿Qué edad tiene Gohan en los Juegos de Cell?", "11 años", "9 años", "13 años", "15 años", ["How old is Gohan during the Cell Games?", "11", "9", "13", "15"]],
    [3, "¿Cuántos episodios tiene Dragon Ball Z?", "291", "153", "200", "325", ["How many episodes does Dragon Ball Z have?", N, N, N, N]],
    [2, "¿Qué edad tiene Goku al empezar el manga de Dragon Ball?", "12 años", "8 años", "10 años", "14 años", ["How old is Goku at the start of the Dragon Ball manga?", "12", "8", "10", "14"]],
  ],
  mario: [
    [3, "¿De qué juego japonés es una adaptación el Super Mario Bros. 2 que salió en Occidente?", "Doki Doki Panic", "Adventure Island", "Wrecking Crew", "Kid Icarus", ["Which Japanese game was the Western Super Mario Bros. 2 adapted from?", N, N, N, N]],
    [3, "¿Cómo se llamaba Mario originalmente, en Donkey Kong?", "Jumpman", "Mr. Video", "Jumpy", "Carpenter Mario", ["What was Mario originally called, in Donkey Kong?", N, N, N, N]],
    [2, "¿En qué nivel te enfrentas a Bowser al final del Super Mario Bros. original?", "8-4", "7-4", "8-3", "9-1", ["Which level do you face Bowser in at the end of the original Super Mario Bros.?", N, N, N, N]],
    [3, "¿En qué año salió el primer Mario Party?", "1998", "1996", "2000", "2002", ["In what year did the first Mario Party come out?", N, N, N, N]],
    [2, "¿Quién dio voz a Mario durante más de 30 años, hasta 2023?", "Charles Martinet", "Kevin Afghani", "Chris Pratt", "Billy West", ["Who voiced Mario for over 30 years, until 2023?", N, N, N, N]],
  ],
};
