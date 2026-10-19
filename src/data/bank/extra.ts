/* editorial-ui · Cristian Pérez · cristianperez.me
 * Preguntas sumadas a categorías que ya existían (se agregan a las de su archivo, no las reemplazan).
 * Formato: [dificultad, pregunta, correcta, mala, mala, mala, media?]
 */
import type { RawQuestion } from "../types";

const bank: Record<string, RawQuestion[]> = {
  historia: [
    [1, "¿Qué barco se hundió en 1912 tras chocar con un iceberg?", "El Titanic", "El Lusitania", "El Britannic", "El Queen Mary"],
    [1, "¿Quién lideró la independencia de buena parte de Sudamérica y fundó la Gran Colombia?", "Simón Bolívar", "José de San Martín", "Antonio Nariño", "Bernardo O'Higgins"],
    [2, "¿Quién fue el primer emperador romano?", "Augusto", "Julio César", "Nerón", "Calígula"],
    [2, "¿Qué día se celebra la independencia de Colombia?", "El 20 de julio", "El 7 de agosto", "El 12 de octubre", "El 16 de septiembre"],
    [1, "¿Quién fue el primer ser humano en pisar la Luna?", "Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "Michael Collins"],
    [2, "¿Qué imperio tenía su capital en Cusco?", "El Imperio inca", "El Imperio azteca", "El Imperio maya", "El Imperio chimú"],
    [3, "¿En qué año terminó la Segunda Guerra Mundial?", "1945", "1944", "1946", "1939"],
  ],
  geografia: [
    [1, "¿Cuál es la capital de Colombia?", "Bogotá", "Medellín", "Cali", "Cartagena"],
    [1, "¿Cuál es el país más poblado de América?", "Estados Unidos", "Brasil", "México", "Canadá"],
    [2, "¿Qué cordillera recorre Sudamérica de norte a sur?", "Los Andes", "Los Alpes", "Las Rocosas", "El Himalaya"],
    [2, "¿En qué país está la Torre Eiffel?", "Francia", "Bélgica", "Italia", "Suiza"],
    [2, "¿Cuál es la capital de Japón?", "Tokio", "Kioto", "Osaka", "Seúl"],
    [3, "¿Cuál es el país más pequeño del mundo?", "El Vaticano", "Mónaco", "San Marino", "Liechtenstein"],
    [3, "¿Qué río pasa por Londres?", "El Támesis", "El Sena", "El Danubio", "El Rin"],
  ],
  ciencia: [
    [1, "¿Cuántos planetas tiene el sistema solar?", "Ocho", "Nueve", "Siete", "Diez"],
    [1, "¿Qué órgano bombea la sangre por el cuerpo?", "El corazón", "El hígado", "Los pulmones", "El riñón"],
    [2, "¿Cuál es la fórmula química del agua?", "H₂O", "CO₂", "O₂", "H₂O₂"],
    [2, "¿Quién formuló la ley de la gravitación universal?", "Isaac Newton", "Galileo Galilei", "Albert Einstein", "Johannes Kepler"],
    [2, "¿A qué temperatura hierve el agua al nivel del mar?", "100 °C", "90 °C", "80 °C", "120 °C"],
    [3, "¿Qué científico propuso la teoría de la evolución por selección natural?", "Charles Darwin", "Gregor Mendel", "Louis Pasteur", "Jean-Baptiste Lamarck"],
    [3, "¿Cuál es el planeta más cercano al Sol?", "Mercurio", "Venus", "Marte", "Tierra"],
  ],
  deportes: [
    [1, "¿Cuántos puntos vale un touchdown en fútbol americano, sin contar el extra?", "6", "7", "3", "5"],
    [1, "¿Qué jugador argentino ganó el Mundial de 2022 como capitán?", "Lionel Messi", "Ángel Di María", "Diego Maradona", "Sergio Agüero"],
    [2, "¿Qué jugador colombiano fue goleador del Mundial de Brasil 2014?", "James Rodríguez", "Radamel Falcao", "Juan Guillermo Cuadrado", "Carlos Bacca"],
    [2, "¿Cuántos anillos tiene la bandera olímpica?", "Cinco", "Seis", "Cuatro", "Siete"],
    [2, "¿En qué deporte es famoso Michael Jordan?", "Baloncesto", "Béisbol", "Golf", "Fútbol americano"],
    [3, "¿Qué país organizó el Mundial de fútbol de 2010?", "Sudáfrica", "Alemania", "Brasil", "Corea del Sur"],
    [3, "¿Cuánto dura un partido de baloncesto de la NBA, sin tiempos extra?", "48 minutos", "40 minutos", "60 minutos", "36 minutos"],
  ],
  cine: [
    [1, "¿Qué película animada tiene a Elsa y Anna como protagonistas?", "Frozen", "Enredados", "Moana", "Encanto"],
    [1, "¿En qué película de Disney una familia colombiana vive en una casa mágica?", "Encanto", "Coco", "Elementos", "Luca"],
    [2, "¿Qué director hizo Jurassic Park y E.T.?", "Steven Spielberg", "George Lucas", "James Cameron", "Robert Zemeckis"],
    [2, "¿Qué película de 1999 pregunta si eliges la pastilla roja o la azul?", "Matrix", "El club de la pelea", "Inception", "Blade Runner"],
    [2, "¿En qué película el DeLorean viaja en el tiempo?", "Volver al futuro", "Terminator", "Los Cazafantasmas", "Tron"],
    [3, "¿Qué película ganó el primer Óscar a mejor película animada?", "Shrek", "Toy Story", "El viaje de Chihiro", "Monsters, Inc."],
    [3, "¿Qué actor protagoniza Oppenheimer (2023)?", "Cillian Murphy", "Matt Damon", "Robert Downey Jr.", "Christian Bale"],
  ],
  musica: [
    [1, "¿Qué cantante colombiana canta \"Hips Don't Lie\"?", "Shakira", "Karol G", "Fanny Lú", "Greeicy"],
    [1, "¿De qué ciudad colombiana es Karol G?", "Medellín", "Bogotá", "Cali", "Barranquilla"],
    [2, "¿Qué instrumento tocaba Jimi Hendrix?", "La guitarra eléctrica", "La batería", "El bajo", "El saxofón"],
    [2, "¿Qué grupo sueco cantó \"Dancing Queen\"?", "ABBA", "Roxette", "Ace of Base", "Europe"],
    [2, "¿Qué cantante es conocida por sus \"eras\" y su gira The Eras Tour?", "Taylor Swift", "Beyoncé", "Adele", "Dua Lipa"],
    [3, "¿Qué ritmo colombiano nació en la región Caribe y se toca con acordeón, caja y guacharaca?", "El vallenato", "La cumbia", "El bambuco", "El joropo"],
    [3, "¿Cuántos músicos tiene un cuarteto de cuerdas?", "Cuatro", "Tres", "Cinco", "Seis"],
  ],

  dragonball: [
    [2, "¿Qué deseo pide Oolong a Shenlong en el primer Dragon Ball?", "Unos calzones", "Ser inmortal", "Mucho dinero", "Una novia"],
    [3, "¿Cómo se llama el hijo menor de Goku?", "Goten", "Gohan", "Pan", "Uub"],
  ],
  onepiece: [
    [2, "¿Qué cocinero entrenó a Sanji en el Baratie?", "Zeff", "Wapol", "Kuro", "Arlong"],
    [3, "¿Qué miembro de la tripulación es un ciborg?", "Franky", "Usopp", "Brook", "Jinbe"],
  ],
  naruto: [
    [2, "¿Qué ninja médica forma parte del Equipo 7?", "Sakura Haruno", "Ino Yamanaka", "Hinata Hyūga", "Tenten"],
    [3, "¿Qué Uchiha masacró a su propio clan?", "Itachi", "Obito", "Madara", "Shisui"],
  ],
  aot: [
    [1, "¿Quién es la hermana adoptiva de Eren que lo protege siempre?", "Mikasa Ackerman", "Annie Leonhart", "Sasha Braus", "Historia Reiss"],
    [3, "¿Qué titán hereda Eren de su padre, además del Titán Fundador?", "El Titán de Ataque", "El Titán Mandíbula", "El Titán Bestia", "El Titán Acorazado"],
  ],
  kimetsu: [
    [2, "¿Qué Pilar usa la Respiración de la Niebla?", "Muichiro Tokito", "Giyu Tomioka", "Sanemi Shinazugawa", "Obanai Iguro"],
    [3, "¿Qué Pilar usa la Respiración del Agua y salva a Tanjiro al principio?", "Giyu Tomioka", "Kyojuro Rengoku", "Shinobu Kocho", "Gyomei Himejima"],
  ],
  jjk: [
    [2, "¿Qué dice Gojo de sí mismo una y otra vez?", "\"Soy el más fuerte\"", "\"Nada es imposible\"", "\"Estoy aburrido\"", "\"Ríndete ya\""],
    [3, "¿Cómo se llama el mejor amigo de Gojo cuando eran estudiantes?", "Suguru Geto", "Kento Nanami", "Yuta Okkotsu", "Aoi Todo"],
  ],
  deathnote: [
    [2, "¿Qué trae escrito la Death Note en sus primeras páginas?", "Las reglas de uso", "El nombre de Ryuk", "Una maldición", "Una lista de víctimas"],
    [3, "¿En qué país vive Light Yagami?", "Japón", "Estados Unidos", "Inglaterra", "Corea del Sur"],
  ],
  hxh: [
    [2, "¿Qué examinador del examen de cazador es un cocinero gourmet?", "Menchi", "Satotz", "Lippo", "Beans"],
    [3, "¿Quién es el abuelo de Killua?", "Zeno Zoldyck", "Silva Zoldyck", "Maha Zoldyck", "Illumi Zoldyck"],
  ],
  mha: [
    [2, "¿Qué héroe estudiante de tercer año puede atravesar objetos?", "Mirio Togata", "Tamaki Amajiki", "Nejire Hado", "Eijiro Kirishima"],
    [3, "¿Qué compañero de Deku se endurece como roca?", "Eijiro Kirishima", "Tetsutetsu", "Mezo Shoji", "Rikido Sato"],
  ],
  spyfamily: [
    [2, "¿Cómo consigue Anya entrar a la Academia Eden?", "Aprobando el examen y la entrevista", "Con una beca deportiva", "Por un sorteo", "Gracias a Damian"],
    [3, "¿Cómo se llamaba el perro antes de que los Forger lo adoptaran?", "Proyecto Apple, sujeto 8", "Bond desde siempre", "Max", "Rocky"],
  ],
  frieren: [
    [2, "¿Qué maga del examen de primera clase corta todo lo que cree que se puede cortar?", "Übel", "Lawine", "Kanne", "Methode"],
    [3, "¿Qué edad aproximada tiene Frieren?", "Más de mil años", "Unos doscientos años", "Unos cincuenta años", "Unos quinientos años"],
  ],
  mario: [
    [1, "¿Qué color de gorra usa Luigi?", "Verde", "Rojo", "Azul", "Amarillo"],
    [2, "¿Cómo se llama el mono rival de Mario en los arcades?", "Donkey Kong", "Diddy Kong", "Funky Kong", "Cranky Kong"],
  ],
  zelda: [
    [2, "¿Qué princesa da nombre a la saga?", "Zelda", "Midna", "Impa", "Ruto"],
    [3, "¿Qué raza tiene a Mipha como princesa en Breath of the Wild?", "Los Zora", "Los Goron", "Los Gerudo", "Los Rito"],
  ],
  pokemon: [
    [1, "¿En qué evoluciona Pikachu con una piedra trueno?", "Raichu", "Pichu", "Jolteon", "Electabuzz"],
    [2, "¿Qué Pokémon duerme bloqueando el camino en Rojo y Azul?", "Snorlax", "Slowpoke", "Jigglypuff", "Lapras"],
  ],
  minecraft: [
    [1, "¿Qué herramienta usas para pescar en Minecraft?", "Una caña de pescar", "Una red", "Un arpón", "Un balde"],
    [2, "¿Qué criatura deja pólvora al morir?", "El creeper", "El zombi", "La araña", "El esqueleto"],
  ],
  fortnite: [
    [2, "¿Qué baile famoso hace la victoria de muchos jugadores?", "El Floss", "El Moonwalk", "La Macarena", "El Gangnam Style"],
    [3, "¿Cómo se llama el barrio de casas con una cancha de fútbol en el mapa original?", "Parque Placentero", "Pisos Picados", "Lomas Lúgubres", "Cruce Chatarra"],
  ],
  gta: [
    [2, "¿Qué protagonista de GTA V es un exladrón de bancos con familia?", "Michael De Santa", "Franklin Clinton", "Trevor Philips", "Lamar Davis"],
    [3, "¿Cómo se llama el amigo inseparable de Franklin?", "Lamar Davis", "Big Smoke", "Ryder", "Roman Bellic"],
  ],
  lol: [
    [2, "¿Cómo se llama el torneo mundial anual de League of Legends?", "Worlds", "The International", "Masters", "Champions Cup"],
    [3, "¿Qué campeona de Arcane es la hermana menor de Vi?", "Jinx", "Caitlyn", "Ekko", "Mel"],
  ],
  sonic: [
    [1, "¿De qué color son los zapatos de Sonic?", "Rojos", "Azules", "Verdes", "Negros"],
    [2, "¿Qué personaje es un camaleón detective del Team Chaotix?", "Espio", "Vector", "Charmy", "Silver"],
  ],
  re: [
    [2, "¿Qué hierba se combina con la verde para curar más?", "La roja", "La azul", "La amarilla", "La morada"],
    [3, "¿Qué pueblo español infectado aparece en Resident Evil 4?", "Un pueblo controlado por Los Iluminados", "Raccoon City", "Una base en la Antártida", "Una isla de Umbrella"],
  ],
  gow: [
    [1, "¿De qué color es el tatuaje que cruza el cuerpo de Kratos?", "Rojo", "Negro", "Azul", "Dorado"],
    [2, "¿Qué dios del Olimpo es mensajero y muy veloz en God of War III?", "Hermes", "Hades", "Poseidón", "Helios"],
  ],
  halo: [
    [1, "¿Qué dispositivo usa el Jefe Maestro en la cabeza?", "Un casco con visor dorado", "Una máscara de gas", "Unas gafas de visión nocturna", "Un sombrero"],
    [2, "¿Qué raza Covenant es pequeña y lleva tanques de metano?", "Los grunts", "Los élites", "Los brutes", "Los jackals"],
  ],
};

export default bank;
