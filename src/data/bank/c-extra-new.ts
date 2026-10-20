/* editorial-ui · Cristian Pérez · cristianperez.me
 * Generado por scripts/build-content.mjs a partir de content/extra-new.mjs: no se edita a mano.
 * Formato: [dificultad, pregunta, correcta, mala, mala, mala, media o visual?]
 */
import type { RawQuestion } from "../types";

const bank: Record<string, RawQuestion[]> = {
  cuphead: [
    [3,"¿Quiénes son los hermanos fundadores de Studio MDHR?","Chad y Jared Moldenhauer","Chad y Jared Smith","Tom y Jerry Moldenhauer","Mark y Jared Hill"],
    [3,"¿En qué año salió Cuphead?","2017","2014","2019","2012"],
    [2,"¿Qué jefe es un grupo de verduras (papa, cebolla, zanahoria)?","The Root Pack","Cagney Carnation","Goopy Le Grande","Hilda Berg"],
    [2,"¿Qué jefe es una flor gigante?","Cagney Carnation","The Root Pack","Baroness Von Bon Bon","Wally Warbles"],
    [1,"¿De qué color es la pajilla de Cuphead?","Roja","Azul","Verde","Amarilla"],
    [3,"¿Qué estilo de música tiene Cuphead?","Jazz de big band de los años 30","Rock duro","Música electrónica","Ópera"],
    [2,"¿Qué técnica usas para saltar sobre objetos rosas y cargar tu energía?","Parry","Dash","Super","Charm"],
    [2,"¿Cómo se llama el jefe baboso del primer bosque (Forest Follies)?","Goopy Le Grande","Hilda Berg","Djimmi","Rumor Honeybottoms"],
  ],
  sims: [
    [1,"¿Qué significa \"Sul sul\" en Simlish?","Hola","Adiós","Gracias","Comida"],
    [2,"¿Qué significa \"Dag dag\" en Simlish?","Adiós","Hola","Perdón","Quiero"],
    [2,"¿En qué año salió Los Sims 4?","2014","2008","2011","2017"],
    [2,"¿En qué año salió el primer Los Sims?","2000","1996","2004","1998"],
    [2,"¿En qué año salió Los Sims 2?","2004","2002","2007","2009"],
    [2,"¿De qué color se pone el Plumbob cuando el Sim está muy mal?","Rojo","Azul","Morado","Negro"],
    [2,"¿Quién aparece cuando un Sim muere?","La Parca","Un ángel","Un policía","Un doctor"],
  ],
  amongus: [
    [2,"¿Qué sabotaje, si no se arregla a tiempo, hace ganar a los impostores?","El reactor","Las luces","Las puertas","Las cámaras"],
    [2,"¿En qué sala del Skeld puedes vigilar a los demás con cámaras?","Seguridad","Cafetería","Motores","Navegación"],
    [3,"¿Cuántos jugadores admite como máximo una partida?","15","10","20","8"],
    [3,"¿Cuántos impostores puede haber como máximo?","Tres","Dos","Cuatro","Uno"],
    [2,"¿En qué año se hizo viral Among Us?","2020","2018","2022","2019"],
    [2,"¿Qué pueden hacer los tripulantes muertos?","Seguir haciendo tareas como fantasmas","Votar","Eliminar a otros","Nada"],
    [3,"¿Qué rol del juego puede cambiar de apariencia?","Cambiaformas","Ingeniero","Científico","Ángel de la guarda"],
    [1,"¿Cuántas tareas hay que completar para ganar sin votar?","Todas las de la tripulación","Cinco","Tres","Diez"],
  ],
  narcos: [
    [3,"¿Qué hermanos lideraban el Cartel de Cali?","Los Rodríguez Orejuela","Los Ochoa","Los Moncada","Los Castaño"],
    [3,"¿Qué grupo paramilitar formado por enemigos de Escobar lo persiguió al margen de la ley?","Los Pepes","Los Extraditables","Los Priscos","Los Rastrojos"],
    [3,"¿Cómo se llamó el grupo de Escobar que luchaba contra la extradición a EE. UU.?","Los Extraditables","Los Pepes","Los Priscos","Los Chulavitas"],
    [3,"¿Quién interpreta al agente Steve Murphy?","Boyd Holbrook","Pedro Pascal","Wagner Moura","Damián Alcázar"],
    [3,"¿Quién interpreta a Félix Gallardo en Narcos: México?","Diego Luna","Gael García Bernal","Michael Peña","Alfonso Herrera"],
    [2,"¿Cómo le dicen a la esposa de Escobar?","Tata","Nena","Mona","Flaca"],
    [1,"¿En qué país está ambientada la primera temporada?","Colombia","México","Perú","Bolivia"],
  ],
  ghibli: [
    [1,"¿Qué película trata de dos hermanas que conocen a un espíritu del bosque?","Mi vecino Totoro","Ponyo","Kiki","Mononoke"],
    [1,"¿Qué hace Kiki, la aprendiz de bruja, para ganarse la vida?","Reparte encargos volando en escoba","Vende pociones","Es maestra","Cocina pasteles"],
    [2,"¿Quién es convertida en anciana por una maldición en El castillo ambulante?","Sophie","Kiki","Chihiro","Sheeta"],
    [3,"¿Cómo se llama la película de Ghibli sobre un castillo flotante en el cielo?","El castillo en el cielo","El castillo ambulante","Nausicaä","Porco Rosso"],
    [3,"¿Qué película tiene a un piloto con cabeza de cerdo?","Porco Rosso","Ponyo","Totoro","Mononoke"],
    [3,"¿Quién compone la música de casi todas las películas de Miyazaki?","Joe Hisaishi","Hans Zimmer","Yoko Kanno","Ryuichi Sakamoto"],
    [3,"¿De quién trata El viento se levanta?","De un diseñador de aviones","De un samurái","De un pintor","De un cocinero"],
  ],
  matrix: [
    [2,"¿Quién traiciona a la tripulación a cambio de volver a la Matrix?","Cypher","Tank","Apoc","Switch"],
    [2,"¿Qué le ofrece el Oráculo a Neo?","Una galleta","Un té","Una manzana","Un caramelo"],
    [3,"¿Cómo se llama el creador de la Matrix en la segunda película?","El Arquitecto","El Oráculo","El Merovingio","El Constructor"],
    [2,"¿Quién interpreta a Morfeo?","Laurence Fishburne","Samuel L. Jackson","Morgan Freeman","Denzel Washington"],
    [2,"¿En qué año salieron Reloaded y Revolutions?","2003","2001","1999","2005"],
    [1,"¿Qué debes hacer para despertar de la Matrix?","Tomar la pastilla roja","Dormir","Apagar la computadora","Cerrar los ojos"],
  ],
  indiana: [
    [2,"¿Quién es la primera pareja de Indy en En busca del arca perdida?","Marion Ravenwood","Willie Scott","Elsa Schneider","Helena Shaw"],
    [3,"¿Quién interpreta a Mutt en El reino de la calavera de cristal?","Shia LaBeouf","Chris Pratt","Sam Rockwell","Tom Holland"],
    [2,"¿Cómo se llama el amigo excavador egipcio de Indy?","Sallah","Marcus","Short Round","Toht"],
    [3,"¿Cómo se llama el villano de El templo maldito?","Mola Ram","Belloq","Toht","Donovan"],
    [1,"¿Qué lo persigue en la famosa escena inicial de la cueva?","Una roca gigante","Un tren","Un dinosaurio","Un helicóptero"],
    [2,"¿Quién interpreta a Indy joven en La última cruzada?","River Phoenix","Keanu Reeves","Johnny Depp","Leonardo DiCaprio"],
  ],
  nolan: [
    [3,"¿Cuál fue la primera película de Nolan, de 1998?","Following","Memento","Insomnia","Batman Begins"],
    [3,"¿Qué película de Nolan, de 2002, protagoniza Al Pacino?","Insomnia","Memento","Following","El truco final"],
    [2,"¿Quiénes interpretan a los magos rivales de El truco final?","Hugh Jackman y Christian Bale","Leonardo DiCaprio y Tom Hardy","Matthew McConaughey y Anne Hathaway","Cillian Murphy y Michael Caine"],
    [1,"¿Quién protagoniza El origen?","Leonardo DiCaprio","Brad Pitt","Tom Hardy","Matt Damon"],
    [2,"¿Quién protagoniza Interstellar?","Matthew McConaughey","Matt Damon","Anne Hathaway","Christian Bale"],
    [2,"¿Quién es el villano de El caballero oscuro: La leyenda renace?","Bane","El Joker","Dos Caras","El Espantapájaros"],
  ],
  gravityfalls: [
    [1,"¿Qué le gusta usar a Mabel?","Suéteres de colores","Gorras","Trajes","Botas de goma"],
    [2,"¿Cómo se llama la pelirroja empleada de la Cabaña del Misterio?","Wendy","Pacífica","Tambry","Candy"],
    [3,"¿Cómo se llama completo el hermano gemelo de Stan?","Stanford Pines","Stanley Pines","Fiddleford","Bud Gleeful"],
    [3,"¿Quién escribió los tres diarios?","Ford","Stan","Dipper","Soos"],
  ],
  adventuretime: [
    [2,"¿Quién es la novia de Finn con poderes de fuego?","La Princesa Flama","Marceline","La Dulce Princesa","Arcoíris"],
    [2,"¿Cómo se llama el reino que gobierna la Dulce Princesa?","El Dulce Reino","El Reino Flama","El Reino Helado","El Espacio Grumoso"],
    [2,"¿Quién es la princesa con forma de nube púrpura?","Princesa del Espacio Grumoso","Princesa Flama","Princesa Nube","Princesa Lila"],
    [1,"¿Qué hace el Rey Helado en los primeros capítulos?","Secuestra princesas","Cocina","Canta","Vende helados"],
  ],
  terraria: [
    [3,"¿Qué jefe es un cerdo-dragón-pez?","Duke Fishron","Golem","Plantera","Skeletron"],
    [1,"¿Qué herramienta usas para cavar en el inicio?","Un pico","Una pala","Una azada","Un martillo"],
    [2,"¿Qué jefe es un gusano gigante de la Corrupción?","El Devorador de Mundos","Plantera","El Ojo de Cthulhu","La Reina Abeja"],
    [3,"¿Qué jefe aparece en el Carmesí?","El Cerebro de Cthulhu","El Devorador de Mundos","Skeletron","Golem"],
    [2,"¿Quién vende bombas y explosivos?","El Demoledor","El Mercader","El Guía","La Enfermera"],
  ],
  portal: [
    [3,"¿Quién pone la voz a Wheatley?","Stephen Merchant","J. K. Simmons","Ellen McLain","Nolan North"],
    [3,"¿Quién pone la voz a GLaDOS?","Ellen McLain","Ellen Page","Scarlett Johansson","Julia Roberts"],
    [2,"Según Cave Johnson, ¿qué hay que hacer cuando la vida te da limones?","Enfurecerse y exigir que se los lleve de vuelta","Hacer limonada","Venderlos","Comérselos"],
    [1,"¿De qué color es el traje de Chell?","Naranja","Azul","Blanco","Verde"],
    [2,"¿Qué esfera de personalidad solo piensa en el espacio?","Space Core","Fact Core","Adventure Core","Rick"],
  ],
  hades: [
    [2,"¿Cómo se llama el esqueleto de entrenamiento en la casa de Hades?","Skelly","Bones","Sans","Dusa"],
    [3,"¿Quién es la cabeza de gorgona que flota en la casa?","Dusa","Medusa","Aracne","Gorgo"],
    [2,"¿Cómo se llama la personificación de la muerte, amigo de Zagreus?","Tánatos","Caronte","Ares","Orfeo"],
  ],
  southpark: [
    [2,"¿Cómo se llama el padre de Stan?","Randy","Gerald","Stuart","Chef"],
    [2,"¿Quién dice \"Respeten mi autoridad\"?","Cartman","Kyle","Kenny","Butters"],
    [2,"¿Cómo se llaman los comediantes canadienses del programa favorito de los niños?","Terrance y Phillip","Cartman y Kyle","Stan y Wendy","Jimbo y Ned"],
  ],
  squidgame: [
    [3,"¿Cómo se llama el policía infiltrado que busca a su hermano?","Hwang Jun-ho","Park Gyeong-seok","Han Mi-nyeo","Deok-su"],
    [2,"¿Quiénes miran los juegos con máscaras de animales dorados?","Los VIP","Los jueces","Los doctores","Los soldados"],
    [2,"¿De qué color se tiñe el pelo Gi-hun al final de la primera temporada?","Rojo","Azul","Rubio","Verde"],
    [3,"¿Cómo se llama el trabajador pakistaní que se hace amigo de Gi-hun?","Ali Abdul","Il-nam","Sang-woo","Deok-su"],
  ],
  betty: [
    [2,"¿Quién es la novia de Armando al comienzo, de la alta sociedad?","Marcela Valencia","Aura María","Patricia Fernández","Lucía"],
    [2,"¿En qué ciudad ocurre la historia?","Bogotá","Medellín","Cali","Cartagena"],
    [3,"¿Qué plataforma estrenó en 2024 la secuela \"la historia continúa\"?","Prime Video","Netflix","Disney+","HBO Max"],
  ],
  ranma: [
    [3,"¿Cómo se llama la anciana amazona, abuela de Shampoo?","Cologne","Happosai","Kodachi","Nabiki"],
  ],
  bocchi: [
    [2,"¿Quién dirige el local STARRY y es la hermana mayor de Nijika?","Seika Ijichi","Kikuri Hiroi","Ikuyo Kita","PA-san"],
  ],
  mcu: [
    [1,"¿Cómo se llama el árbol humanoide de los Guardianes de la Galaxia?","Groot","Rocket","Drax","Mantis"],
  ],
};

export default bank;
