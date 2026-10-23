/* editorial-ui · Cristian Pérez · cristianperez.me
 * Generado por scripts/build-content.mjs a partir de content/fill-r26.mjs: no se edita a mano.
 * Formato: [dificultad, pregunta, correcta, mala, mala, mala, media o visual?]
 */
import type { RawQuestion } from "../types";

const bank: Record<string, RawQuestion[]> = {
  ciencia: [
    [1,"¿Qué proteína de la sangre transporta el oxígeno?","La hemoglobina","La insulina","La queratina","El colágeno"],
    [1,"¿Qué pigmento hace que las plantas sean verdes?","La clorofila","El caroteno","La xantofila","La melanina"],
    [1,"¿Qué parte de la sangre ayuda a defender el cuerpo contra las infecciones?","Los glóbulos blancos","Los glóbulos rojos","Las plaquetas","El plasma"],
    [2,"¿Qué planeta es el más caliente del sistema solar?","Venus","Mercurio","Marte","Júpiter"],
    [2,"¿Qué es la Gran Mancha Roja de Júpiter?","Una tormenta gigante","Un volcán enorme","Un cráter de impacto","Un campo de asteroides"],
    [2,"¿Cómo se llama la conexión por la que una neurona pasa su señal a otra célula?","Sinapsis","Axón","Dendrita","Soma"],
    [2,"¿Por qué siempre vemos la misma cara de la Luna?","Su giro dura igual que su órbita","No gira sobre sí misma","Solo se ilumina ese lado","El Sol siempre la alumbra por esa cara"],
    [2,"¿A cuántos grados Celsius equivale el cero absoluto?","−273,15 °C","−100 °C","−300 °C","−373,15 °C"],
    [2,"¿Qué pH tiene el agua pura a 25 °C?","7","1","10","14"],
    [2,"¿Qué unidad del Sistema Internacional mide la fuerza?","El newton","El julio","El pascal","El vatio"],
    [3,"Entre todas las lunas del sistema solar, ¿cuál es la de mayor tamaño?","Ganímedes","Titán","Calisto","Europa"],
    [3,"Según la teoría del gran impacto, ¿qué protoplaneta chocó con la Tierra y dio origen a la Luna?","Tea (Theia)","Ceres","Vesta","Tritón"],
    [3,"¿Qué mineral ocupa el primer lugar, el más blando, en la escala de Mohs?","El talco","El yeso","La calcita","El cuarzo"],
    [3,"¿Qué químico dejó huecos en su tabla periódica y predijo elementos como el galio?","Dmitri Mendeléyev","Antoine Lavoisier","John Dalton","Henry Moseley"],
    [3,"¿Qué elemento químico tiene el símbolo Pb?","Plomo","Platino","Fósforo","Paladio"],
  ],
  geografia: [
    [1,"¿Qué continente es el más grande por superficie y por población?","Asia","África","América","Europa"],
    [1,"¿Qué país es el más extenso del mundo?","Rusia","Canadá","China","Estados Unidos"],
    [2,"¿En qué país se levanta el Kilimanjaro, la montaña más alta de África?","Tanzania","Kenia","Uganda","Etiopía"],
    [2,"¿Qué país concentra la mayor parte de la selva amazónica?","Brasil","Perú","Colombia","Bolivia"],
    [2,"¿Qué dos países se reparten el archipiélago de Tierra del Fuego?","Chile y Argentina","Chile y Perú","Argentina y Uruguay","Argentina y Brasil"],
    [2,"¿Qué mar de Oriente Medio tiene las orillas más bajas de tierra firme del planeta?","El mar Muerto","El mar Rojo","El mar Caspio","El mar Negro"],
    [2,"¿Qué río colombiano desemboca en el Caribe por Bocas de Ceniza, cerca de Barranquilla?","El Magdalena","El Cauca","El Atrato","El Sinú"],
    [2,"¿Qué gran lago africano comparten Uganda, Kenia y Tanzania?","El lago Victoria","El lago Tanganica","El lago Malaui","El lago Chad"],
    [3,"¿Cuál es el país más extenso de África?","Argelia","Sudán","República Democrática del Congo","Libia"],
    [3,"¿Qué país africano está completamente rodeado por Sudáfrica?","Lesoto","Esuatini","Botsuana","Namibia"],
    [3,"¿Cuál es el único de los Grandes Lagos que queda por completo en territorio estadounidense?","El Míchigan","El Superior","El Hurón","El Erie"],
    [3,"¿Cuál es la isla más grande del Mediterráneo?","Sicilia","Cerdeña","Chipre","Creta"],
    [3,"¿En qué departamento colombiano queda el desierto de la Tatacoa?","Huila","Tolima","La Guajira","Cundinamarca"],
  ],
  historia: [
    [1,"¿Qué pandemia mató a buena parte de Europa entre 1346 y 1353?","La peste negra","La gripe española","La plaga de Justiniano","El cólera"],
    [2,"¿Qué hallazgo de 1799 en el delta del Nilo ayudó a descifrar los jeroglíficos?","La piedra de Rosetta","La piedra del Sol","La piedra de Behistún","La paleta de Narmer"],
    [2,"¿Qué heroína neogranadina, conocida como La Pola, fue fusilada en Bogotá en 1817?","Policarpa Salavarrieta","Manuela Beltrán","Manuela Sáenz","Antonia Santos"],
    [2,"¿Qué rey espartano murió defendiendo el paso de las Termópilas en el 480 a. C.?","Leónidas I","Pausanias","Agesilao","Licurgo"],
    [2,"¿Qué ciudad francesa liberó Juana de Arco del asedio inglés en 1429?","Orleans","París","Reims","Ruan"],
    [2,"¿Qué líder soviético pactó con Fidel Castro instalar misiles nucleares en Cuba en 1962?","Nikita Jruschov","Leonid Brézhnev","Iósif Stalin","Mijaíl Gorbachov"],
    [3,"¿Qué rey inglés selló la Carta Magna en Runnymede en 1215?","Juan sin Tierra","Ricardo Corazón de León","Guillermo el Conquistador","Enrique VIII"],
    [3,"¿Qué emperador romano refundó Bizancio como nueva capital del Imperio en el siglo IV?","Constantino I","Diocleciano","Teodosio I","Justiniano"],
    [3,"¿En qué ciudad alemana se juzgó a los principales jerarcas nazis tras la Segunda Guerra Mundial?","Núremberg","Múnich","Fráncfort","Hamburgo"],
  ],
  deportes: [
    [1,"¿Contra qué selección marcó Maradona el gol de la «Mano de Dios» en el Mundial de 1986?","Inglaterra","Bélgica","Alemania Federal","Italia"],
    [1,"¿Sobre qué superficie se juega Wimbledon?","Césped","Tierra batida","Cemento","Madera"],
    [2,"¿Quién inventó el baloncesto en 1891?","James Naismith","Walter Camp","William Morgan","Abner Doubleday"],
    [2,"¿Qué ciclista colombiano ganó el Giro de Italia de 2014?","Nairo Quintana","Rigoberto Urán","Esteban Chaves","Miguel Ángel López"],
    [2,"¿En qué modalidad ciclista ganó Mariana Pajón sus oros olímpicos?","BMX","Ruta","Pista","Montaña"],
    [2,"¿Cuántos Mundiales ganó Pelé como jugador?","Tres","Dos","Cuatro","Cinco"],
    [2,"¿Qué club colombiano ganó la Copa Libertadores de 1989?","Atlético Nacional","Millonarios","América de Cali","Deportivo Cali"],
    [3,"Según la leyenda, ¿qué mensajero griego corrió de Maratón a Atenas para anunciar la victoria?","Fidípides","Milcíades","Temístocles","Arístides"],
    [3,"¿Quién le dio a Colombia su primer oro olímpico, en las pesas de Sídney 2000?","María Isabel Urrutia","Mariana Pajón","Caterine Ibargüen","Yuri Alvear"],
    [3,"¿Cuántos puntos vale un ensayo (try) en el rugby union?","5","3","4","7"],
  ],
  musica: [
    [1,"¿A quién se le conoce como el Rey del Rock and Roll?","Elvis Presley","Chuck Berry","Little Richard","Buddy Holly"],
    [1,"¿De qué banda británica es vocalista Mick Jagger?","The Rolling Stones","The Who","The Kinks","The Animals"],
    [2,"¿Qué compositor francés escribió el Bolero, de 1928?","Maurice Ravel","Claude Debussy","Erik Satie","Camille Saint-Saëns"],
    [2,"¿Cuál es el instrumento de cuerda frotada más grave de la orquesta sinfónica?","El contrabajo","El violonchelo","La viola","El violín"],
    [2,"¿En qué ciudad estadounidense nació el jazz?","Nueva Orleans","Chicago","Nueva York","Memphis"],
    [2,"¿De qué ópera es la célebre «Habanera» («L'amour est un oiseau rebelle»)?","Carmen","La traviata","Tosca","Madama Butterfly"],
    [2,"¿Qué banda grabó «Stairway to Heaven» en 1971?","Led Zeppelin","Deep Purple","Black Sabbath","The Who"],
    [2,"¿Qué banda de Dublín tiene a Bono como vocalista?","U2","Thin Lizzy","The Cranberries","The Pogues"],
    [2,"¿Cuál es la voz femenina más grave?","Contralto","Soprano","Mezzosoprano","Tenor"],
    [3,"¿Qué ópera de Verdi, ambientada en el antiguo Egipto, se estrenó en El Cairo en 1871?","Aida","Rigoletto","La traviata","Nabucco"],
    [3,"¿Qué compositor colombiano escribió «La piragua» y «Navidad negra»?","José Barros","Lucho Bermúdez","Rafael Escalona","Adolfo Mejía"],
    [3,"¿Qué compositor español escribió el Concierto de Aranjuez para guitarra?","Joaquín Rodrigo","Manuel de Falla","Isaac Albéniz","Enrique Granados"],
  ],
};

export default bank;
