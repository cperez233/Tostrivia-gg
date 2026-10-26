/* editorial-ui · Cristian Pérez · cristianperez.me
 * Generado por scripts/build-content.mjs a partir de content/audit-a9.mjs: no se edita a mano.
 * Formato: [dificultad, pregunta, correcta, mala, mala, mala, media o visual?]
 */
import type { RawQuestion } from "../types";

const bank: Record<string, RawQuestion[]> = {
  aot: [
    [2,"¿Qué nación infiltra guerreros en Paradis?","Marley","Hizuru","Paradis","Eldia"],
    [2,"¿Quién manda la Legión de Reconocimiento al principio?","Erwin Smith","Dot Pixis","Keith Shadis","Kenny Ackerman"],
    [3,"¿De qué aldea es Sasha Braus?","Dauper","Ragako","Trost","Stohess"],
    [2,"¿Qué cadete de la 104.ª promoción tiene la cabeza rapada?","Connie Springer","Jean Kirstein","Floch Forster","Marco Bott"],
    [2,"¿Qué apellido comparten Mikasa y Levi?","Ackerman","Jaeger","Arlert","Braun"],
    [1,"¿A qué cadete le dicen cara de caballo?","Jean Kirstein","Connie Springer","Reiner Braun","Marco Bott"],
  ],
  harrypotter: [
    [2,"¿Qué pelota del quidditch vale 150 puntos al atraparla?","La snitch dorada","La quaffle","La bludger","La recordadora"],
    [2,"¿Quién enseña Defensa Contra las Artes Oscuras en El prisionero de Azkaban?","Remus Lupin","Gilderoy Lockhart","Quirinus Quirrell","Alastor Moody"],
    [2,"¿Cómo se llama el fénix de Dumbledore?","Fawkes","Buckbeak","Hedwig","Pigwidgeon"],
    [2,"¿Cómo se llama el gato de Hermione?","Crookshanks","Señora Norris","Trevor","Fang"],
    [2,"¿Qué mago se esconde transformado en rata?","Peter Pettigrew","Sirius Black","Remus Lupin","Barty Crouch Jr."],
    [3,"¿Quién dirige Durmstrang durante el Torneo de los Tres Magos?","Igor Karkaroff","Olympe Maxime","Ludo Bagman","Barty Crouch"],
  ],
  witcher: [
    [2,"¿Cuál es el juego de cartas de The Witcher 3?","Gwent","Triple Triad","Pazaak","Hearthstone"],
    [2,"¿Qué Señal empuja a los enemigos con una onda de fuerza?","Aard","Igni","Quen","Yrden"],
    [2,"¿Qué Señal crea una trampa mágica que ralentiza a los enemigos?","Yrden","Aard","Igni","Quen"],
    [3,"¿Quién es el villano vampiro de Blood and Wine?","Dettlaff","Gaunter O'Dimm","Eredin","Imlerith"],
    [3,"¿Quién pone la voz a Geralt en inglés en los juegos?","Doug Cockle","Henry Cavill","Troy Baker","Nolan North"],
    [3,"¿Qué ciudad de Redania alberga una gran universidad?","Oxenfurt","Novigrado","Vizima","Beauclair"],
  ],
  re: [
    [2,"¿Qué corporación creó el virus T?","Umbrella","Tricell","WilPharma","B.S.A.A."],
    [2,"¿Qué ciudad sufre el brote más famoso de la saga?","Raccoon City","Tall Oaks","Harvardville","Kijuju"],
    [3,"¿Quién pilota el helicóptero del equipo Alpha en el primer juego?","Brad Vickers","Barry Burton","Joseph Frost","Rebecca Chambers"],
    [2,"¿Quién es la compañera de Chris en Resident Evil 5?","Sheva Alomar","Rebecca Chambers","Ada Wong","Claire Redfield"],
    [2,"¿Quién es la antagonista final de Resident Evil Village?","Madre Miranda","Lady Dimitrescu","Donna Beneviento","Eveline"],
    [3,"¿Qué hermanos gemelos aparecen en Code: Veronica?","Alexia y Alfred Ashford","Chris y Claire Redfield","Jack y Marguerite Baker","William y Annette Birkin"],
    [3,"¿Quién fundó Umbrella junto a Marcus y Ashford?","Oswell E. Spencer","Albert Wesker","William Birkin","Osmund Saddler"],
  ],
  saintseiya: [
    [3,"¿Qué caballero dorado es el hermano mayor de Aioria?","Aioros de Sagitario","Shura de Capricornio","Milo de Escorpio","Mu de Aries"],
    [2,"¿Qué caballero dorado protege la casa de Piscis?","Afrodita","Camus","Shaka","Máscara de la Muerte"],
    [3,"¿Qué caballero dorado protege la casa de Cáncer?","Máscara de la Muerte","Aldebarán","Shura","Afrodita"],
    [3,"¿Quién gobierna Asgard como representante de Odín?","Hilda de Polaris","Pandora","Saori Kido","Shaina"],
    [3,"¿Quién guía a los Espectros en nombre de Hades?","Pandora","Hilda","Saori Kido","Shaina"],
  ],
  sailormoon: [
    [2,"¿Quién era la reina de la Luna en el Milenio de Plata?","La reina Serenity","La reina Beryl","La reina Neherenia","La reina Galaxia"],
    [3,"¿Qué Sailor Starlight es Seiya Kou?","Sailor Star Fighter","Sailor Star Healer","Sailor Star Maker","Sailor Chibi Moon"],
    [3,"¿Cuál es la identidad civil de Sailor Uranus?","Haruka Tenoh","Michiru Kaioh","Setsuna Meioh","Hotaru Tomoe"],
    [3,"¿Qué instrumento toca Michiru Kaioh, Sailor Neptune?","Violín","Piano","Flauta","Arpa"],
    [1,"¿En qué ciudad vive Serena?","Tokio","Osaka","Kioto","Yokohama"],
    [3,"¿Dónde trabaja Andrew?","El Crown Arcade","El Templo Hikawa","La Torre de Tokio","El Colegio Juban"],
  ],
  sololeveling: [
    [3,"¿Cuál es la sombra más poderosa de Jinwoo?","Bellion","Igris","Beru","Tusk"],
    [3,"¿Qué dragón arrasó la costa oeste de Estados Unidos?","Kamish","Antares","Ashborn","Baran"],
    [1,"¿Qué rango tiene Cha Hae-in?","S","A","B","C"],
    [3,"¿Quién pone la voz japonesa a Jinwoo en el anime?","Taito Ban","Yuki Kaji","Hiroshi Kamiya","Natsuki Hanae"],
    [3,"¿Qué animal es la sombra Tank?","Un oso","Un lobo","Un tigre","Un jabalí"],
  ],
  chavo: [
    [1,"¿Quién es el dueño de la vecindad?","El Señor Barriga","El Profesor Jirafales","Jaimito el cartero","Ñoño"],
    [3,"¿Quién interpretaba a Jaimito el Cartero?","Raúl «Chato» Padilla","Rubén Aguirre","Ramón Valdés","Édgar Vivar"],
    [3,"¿Cuál es el nombre de pila de Quico?","Federico","Francisco","Enrique","Ernesto"],
    [2,"¿Con qué apodo se conocía a Roberto Gómez Bolaños?","Chespirito","Cantinflas","Tin Tan","Capulina"],
    [2,"¿Qué significa «chavo» en el español de México?","Muchacho","Huérfano","Travieso","Pobre"],
  ],
  skyrim: [
    [2,"¿Contra quién luchan los Capas de la Tormenta en la guerra civil?","La Legión Imperial","Los Compañeros","La Hermandad Oscura","Los Vigilantes de Stendarr"],
    [2,"¿Qué facción élfica persigue a los seguidores de Talos?","Los Thalmor","Los Falmer","Los Dwemer","Los Forsworn"],
    [2,"¿Quién es el jarl de Carrera Blanca?","Balgruuf el Grande","Ulfric Capa de la Tormenta","Elisif la Bella","Igmund"],
    [2,"¿Dónde viven los Barbas Grises?","Alto Hrothgar","Jorrvaskr","Hibernalia","El Palacio Azul"],
    [2,"¿Qué raza de piel gris y ojos rojos habita Skyrim?","Dunmer","Bosmer","Altmer","Argonianos"],
    [2,"¿Qué expansión permite construir casas y adoptar niños?","Hearthfire","Dawnguard","Dragonborn","Creation Club"],
    [3,"¿Cuántos maestros Barbas Grises hay?","Cuatro","Tres","Cinco","Siete"],
  ],
  hades: [
    [3,"¿Cómo se llama el esqueleto de entrenamiento de la casa?","Skelly","Hipnos","Dusa","Patroclo"],
    [2,"¿Qué dios ofrece la bendición Resaca?","Dioniso","Hermes","Apolo","Ares"],
    [2,"¿Qué dios ofrece bendiciones de velocidad y esquiva?","Hermes","Ares","Atenea","Afrodita"],
    [3,"¿Qué diosa ofrece bendiciones que ralentizan con frío?","Deméter","Artemisa","Afrodita","Atenea"],
    [2,"¿Quién es el último jefe antes de salir del Inframundo?","Hades","Teseo","Megera","Cerbero"],
    [3,"¿Qué monstruo es el jefe de Asfódelo?","La Hidra de Lerna","Cerbero","Asterio","Megera"],
    [2,"¿Qué regalo te da un recuerdo la primera vez que se lo das a un personaje?","Néctar","Ambrosía","Óbolos","Oscuridad"],
  ],
  sims: [
    [1,"¿Cómo se llama la moneda de Los Sims?","Simoleones","Dólares","Créditos","Monedas"],
    [3,"¿Cuál es la ciudad inicial de Los Sims 3?","Sunset Valley","Willow Creek","Strangetown","Veronaville"],
    [2,"¿Qué entrega de Los Sims introdujo la genética?","Los Sims 2","Los Sims","Los Sims 3","Los Sims 4"],
    [3,"¿Qué expansión de Los Sims 2 añade la vida universitaria?","Universitarios","Noctámbulos","Abren negocios","Cuatro estaciones"],
    [1,"¿Qué necesidad se cubre usando el inodoro?","Vejiga","Higiene","Energía","Hambre"],
    [3,"¿Cómo se llama la hija de Mortimer y Bella Goth?","Cassandra","Dina Caliente","Nina Caliente","Lilith Pleasant"],
    [1,"¿Qué llega por correo y hay que pagar cada pocos días?","Las facturas","Las multas","Los impuestos","Las cartas de amor"],
  ],
  ranma: [
    [2,"¿Qué hermana de Akane es experta en negocios y dinero?","Nabiki","Kasumi","Ukyo","Kodachi"],
    [3,"¿Qué apodo tiene Kodachi Kuno?","La Rosa Negra","La Rosa Azul","La Rosa Blanca","La Dama Negra"],
    [2,"¿Qué arma usa Tatewaki Kuno?","Una espada de madera","Una espada de acero","Un arco","Una lanza"],
    [3,"¿Quién dirige el instituto Furinkan?","El director Kuno","Soun Tendo","Happosai","Genma Saotome"],
  ],
  doraemon: [
    [1,"¿Qué invento permite ir al instante a cualquier lugar?","La Puerta Mágica","La Máquina del Tiempo","El Sombrero Volador","El Mapa Mágico"],
    [2,"¿Cómo se llama la mamá de Nobita?","Tamako","Jaiko","Dorami","Shizuka"],
    [2,"¿Cómo se llama la hermana de Gigante?","Jaiko","Shizuka","Dorami","Tamako"],
    [2,"¿Cuál es el apellido del protagonista humano de Doraemon?","Nobi","Goda","Honekawa","Minamoto"],
    [3,"¿Qué estudio produce el anime de Doraemon?","Shin-Ei Animation","Toei Animation","Sunrise","Madhouse"],
    [3,"¿De qué color era Doraemon al principio?","Amarillo","Rojo","Blanco","Verde"],
  ],
};

export default bank;
