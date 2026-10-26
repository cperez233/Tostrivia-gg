// Preguntas difíciles de verdad (datos concretos): Deportes, Geografía, Música y Ciencia.
// Formato: [dificultad, pregunta, correcta, mala, mala, mala, [pregunta EN, correcta EN, mala EN, mala EN, mala EN]] (null = igual que en español)
const N = null;

export default {
  deportes: [
    [3, "¿Quién ganó el Balón de Oro de 2007?", "Kaká", "Cristiano Ronaldo", "Lionel Messi", "Ronaldinho", ["Who won the 2007 Ballon d'Or?", N, N, N, N]],
    [3, "¿Cuántos Mundiales de fútbol masculino ha ganado Italia?", "Cuatro", "Tres", "Cinco", "Dos", ["How many men's football World Cups has Italy won?", "Four", "Three", "Five", "Two"]],
    [3, "¿Cuántos puntos anotó Wilt Chamberlain en su famoso partido de 1962?", "100", "81", "73", "69", ["How many points did Wilt Chamberlain score in his famous 1962 game?", N, N, N, N]],
    [3, "¿Qué selección es la única que ha jugado todos los Mundiales de fútbol masculino?", "Brasil", "Alemania", "Italia", "Argentina", ["Which team is the only one to have played in every men's football World Cup?", "Brazil", "Germany", "Italy", "Argentina"]],
    [3, "¿Qué maratonista etíope ganó descalzo el oro olímpico en Roma 1960?", "Abebe Bikila", "Haile Gebrselassie", "Kipchoge Keino", "Emil Zátopek", ["Which Ethiopian marathon runner won Olympic gold barefoot in Rome 1960?", N, N, N, N]],
    [2, "¿Cuántas medallas de oro olímpicas ganó Michael Phelps?", "23", "18", "28", "15", ["How many Olympic gold medals did Michael Phelps win?", N, N, N, N]],
    [3, "¿Qué club tiene más títulos de Copa Libertadores?", "Independiente", "Boca Juniors", "Peñarol", "River Plate", ["Which club has the most Copa Libertadores titles?", N, N, N, N]],
  ],
  geografia: [
    [3, "¿Cuál es la capital de Bután?", "Timbu", "Katmandú", "Daca", "Colombo", ["What is the capital of Bhutan?", "Thimphu", "Kathmandu", "Dhaka", "Colombo"]],
    [3, "¿Cuál es la capital de Myanmar (Birmania)?", "Naipyidó", "Rangún", "Mandalay", "Bangkok", ["What is the capital of Myanmar (Burma)?", "Naypyidaw", "Yangon", "Mandalay", "Bangkok"]],
    [3, "¿Cuál es la capital de Nigeria?", "Abuya", "Lagos", "Accra", "Kano", ["What is the capital of Nigeria?", "Abuja", "Lagos", "Accra", "Kano"]],
    [3, "¿Cuántos países independientes tiene Sudamérica?", "12", "10", "13", "14", ["How many independent countries does South America have?", N, N, N, N]],
    [3, "¿Cuál es la capital de Eritrea?", "Asmara", "Adís Abeba", "Yibuti", "Jartum", ["What is the capital of Eritrea?", "Asmara", "Addis Ababa", "Djibouti", "Khartoum"]],
    [3, "¿Cuál es el país más pequeño de África?", "Seychelles", "Gambia", "Mauricio", "Esuatini", ["What is the smallest country in Africa?", N, "The Gambia", "Mauritius", "Eswatini"]],
  ],
  musica: [
    [3, "¿Qué compositor ruso escribió Cuadros de una exposición?", "Modest Músorgski", "Serguéi Rajmáninov", "Nikolái Rimski-Kórsakov", "Dmitri Shostakóvich", ["Which Russian composer wrote Pictures at an Exhibition?", "Modest Mussorgsky", "Sergei Rachmaninoff", "Nikolai Rimsky-Korsakov", "Dmitri Shostakovich"]],
    [3, "¿Qué compositor escribió el oratorio El Mesías?", "Georg Friedrich Händel", "Johann Sebastian Bach", "Joseph Haydn", "Antonio Vivaldi", ["Which composer wrote the oratorio Messiah?", "George Frideric Handel", "Johann Sebastian Bach", "Joseph Haydn", "Antonio Vivaldi"]],
    [3, "¿En qué año se separaron The Beatles?", "1970", "1968", "1972", "1975", ["In what year did The Beatles break up?", N, N, N, N]],
    [3, "¿Qué compositor italiano escribió El barbero de Sevilla?", "Gioachino Rossini", "Giuseppe Verdi", "Giacomo Puccini", "Gaetano Donizetti", ["Which Italian composer wrote The Barber of Seville?", N, N, N, N]],
  ],
  ciencia: [
    [3, "¿Qué elemento químico tiene el símbolo W?", "El wolframio (tungsteno)", "El vanadio", "El wismuto", "El xenón", ["Which chemical element has the symbol W?", "Tungsten (wolfram)", "Vanadium", "Bismuth", "Xenon"]],
    [3, "¿Qué científico descubrió el neutrón en 1932?", "James Chadwick", "Ernest Rutherford", "Niels Bohr", "J. J. Thomson", ["Which scientist discovered the neutron in 1932?", N, N, N, N]],
    [3, "¿Cuánto vale aproximadamente el número de Avogadro?", "6,022 × 10²³", "3,14 × 10⁸", "1,6 × 10⁻¹⁹", "9,81 × 10²", ["What is the approximate value of Avogadro's number?", "6.022 × 10²³", "3.14 × 10⁸", "1.6 × 10⁻¹⁹", "9.81 × 10²"]],
  ],
};
