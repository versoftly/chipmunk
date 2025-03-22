// --- Variables Globales ---
let ganancia;
let acumulador = 0;
const cycleDuration = 3 * 60 * 60 * 1000;
let lastPromptTime = 0;
const porcentajeDeLaComision = 6.95;
const libres = 1;
const porcentajeDelAhorro = 20;
let timerInterval; // To hold the setInterval ID for the timer

// --- Elementos del DOM ---
const timerDisplay = document.getElementById('timerDisplay');
const addButton = document.getElementById('addButton');
const subtractButton = document.getElementById('subtractButton');
const addMinuteButton = document.getElementById('addMinuteButton');
const subtractMinuteButton = document.getElementById('subtractMinuteButton');

// --- Funciones ---

// Formatea el tiempo de milisegundos a HH:MM:SS
function formatTime(milliseconds) {
    let totalSeconds = Math.floor(milliseconds / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    return String(hours).padStart(2, '0') + ':' +
           String(minutes).padStart(2, '0') + ':' +
           String(seconds).padStart(2, '0');
}

// Función para solicitar la ganancia al usuario (con prompt)
function solicitarGanancia() {
    let input = prompt("El temporizador ha llegado a 00:00:00. Ingresa la ganancia:");

    if (input !== null) {
        let nuevaGanancia = parseFloat(input);
        if (!isNaN(nuevaGanancia) && nuevaGanancia >= 0) {
            ganancia = nuevaGanancia;
            acumulador += ganancia;
            calcularYMostrarResultados(); // Calculate and show results in console
            localStorage.setItem('acumulador', acumulador.toString());
            localStorage.setItem('ganancia', ganancia.toString());
        } else {
            console.log("Entrada inválida. Por favor, ingresa un número positivo.");
            solicitarGanancia(); // Recursively prompt again
        }
    } else {
        console.log("Entrada cancelada por el usuario.");
    }
}

// Función para calcular y mostrar los resultados (en la consola)
function calcularYMostrarResultados() {
    if (ganancia !== undefined) {
        const comision = (porcentajeDeLaComision / 100) * ganancia;
        const gananciaNeta = ganancia - comision;
        const guardar = (porcentajeDelAhorro / 100) * gananciaNeta;
        const invertir = gananciaNeta - guardar - libres;

        console.log(`
Total: $${ganancia.toFixed(2)}
Comision: $${comision.toFixed(2)}
Ganancia Neta: $${gananciaNeta.toFixed(2)}
Libres: $${libres.toFixed(2)}
Guardar: $${guardar.toFixed(2)}
Invertir: $${invertir.toFixed(2)}
Acumulado: $${acumulador.toFixed(2)}
`);
    } else {
        console.log("La ganancia aún no ha sido ingresada.");
    }
}

// Función para actualizar el temporizador y manejar el prompt
function updateTimer() {
    let now = new Date().getTime();
    let timeElapsedInCycle = (now % cycleDuration);
    let remainingTime = cycleDuration - timeElapsedInCycle;
    let offset = parseInt(localStorage.getItem('timerOffset') || '0', 10);
    remainingTime += offset;
    remainingTime = (remainingTime % cycleDuration + cycleDuration) % cycleDuration;

    timerDisplay.textContent = formatTime(remainingTime);

    if (remainingTime < 1000 && (now - lastPromptTime >= cycleDuration)) {
        lastPromptTime = now;
        solicitarGanancia();
    }
}

// Funcion para ajustar el temporizador
function adjustTimer(adjustment) {
    let currentOffset = parseInt(localStorage.getItem('timerOffset') || '0', 10);
    let newOffset = currentOffset + adjustment;
    localStorage.setItem('timerOffset', newOffset);
    updateTimer(); // Actualiza inmediatamente
}

// --- Event Listeners ---

addButton.addEventListener('click', () => adjustTimer(1000));
subtractButton.addEventListener('click', () => adjustTimer(-1000));
addMinuteButton.addEventListener('click', () => adjustTimer(60000));
subtractMinuteButton.addEventListener('click', () => adjustTimer(-60000));

// --- Inicialización ---

window.addEventListener('load', () => {
    // Cargar datos de localStorage
    let savedAcumulador = localStorage.getItem('acumulador');
    let savedGanancia = localStorage.getItem('ganancia');
    let savedOffset = localStorage.getItem('timerOffset');

    if (savedAcumulador) {
        acumulador = parseFloat(savedAcumulador);
    }
    if (savedGanancia) {
         ganancia = parseFloat(savedGanancia);
         calcularYMostrarResultados(); // Muestra resultados en la consola
     }
    if(savedOffset){
        offset = parseInt(savedOffset);
    }
    // Iniciar el temporizador
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
});

window.addEventListener('unload', () => {
    localStorage.setItem('acumulador', acumulador.toString());
    if(ganancia !== undefined){
       localStorage.setItem('ganancia', ganancia.toString());
    }

    localStorage.setItem('timerOffset', offset); //Guardar siempre.
});

// --- Variables Globales ---
const startButton = document.getElementById('startButton'); // Obtiene el botón de inicio
const stopButton = document.getElementById('stopButton'); // Obtiene el botón de detención
let intervalId; // Variable para almacenar el ID del intervalo (para poder detenerlo)
let currentPalette = []; // Array para almacenar la paleta de 8 colores actual
let colorValues = []; // Array para almacenar todos los valores de color generados

let colorIndex = 0; // Índice para rastrear el color actual que se está utilizando, para iterar sobre colorValues
let generatingColors = true; // Bandera para controlar si se están generando colores nuevos o no
let r = 0, g = 0, b = 0, a = 0; // Variables para los componentes RGBA (inicialmente 0)
const maxA = 100; // Valor máximo para el componente alfa (multiplicado por 100 para usar enteros)

// Variables para los múltiples generadores de color secuenciales
const numGenerators = 5; // Número de generadores simultáneos.  AJUSTA ESTE VALOR.
let generators = []; // Array para almacenar los objetos generadores

// Función para inicializar los generadores de color
function initializeGenerators() {
    generators = []; // Limpia cualquier generador existente
    for (let i = 0; i < numGenerators; i++) { // Crea el número especificado de generadores
        generators.push({ // Añade un nuevo objeto generador al array
            r: Math.floor(Math.random() * 256), // Valor inicial aleatorio para rojo (0-255)
            g: Math.floor(Math.random() * 256), // Valor inicial aleatorio para verde (0-255)
            b: Math.floor(Math.random() * 256), // Valor inicial aleatorio para azul (0-255)
            a: Math.floor(Math.random() * 101), // Valor inicial aleatorio para alfa (0-100)
            active: true // Bandera para indicar si el generador está activo (aún generando colores)
        });
    }
}

// Función para obtener el siguiente color RGBA, usando múltiples generadores
function getNextRGBA() {
    if (!generatingColors) {
        // Si la generación de colores está detenida, cicla a través de los colores existentes
        if (colorIndex < colorValues.length) {
            const color = colorValues[colorIndex]; // Obtiene el color actual
            colorIndex++; // Incrementa el índice
            return color; // Retorna el color
        } else {
            colorIndex = 0; // Reinicia el índice al llegar al final
            return getNextRGBA(); // Llamada recursiva para obtener el primer color
        }
    }

    // Encuentra los generadores activos
    let activeGenerators = generators.filter(gen => gen.active); // Filtra los generadores y crea un nuevo array solo con los activos
    if (activeGenerators.length === 0) {
        // Si no hay generadores activos, detiene la generación de colores
        generatingColors = false;
        console.log("Se generaron todas las combinaciones RGBA posibles (o se agotaron los generadores).");
		startPermutations(); //Comienza la fase de permutaciones
        return getNextRGBA(); // Comienza a ciclar o a permutar.
    }

    // Escoge un generador aleatorio de entre los activos
    const generatorIndex = Math.floor(Math.random() * activeGenerators.length);
    const gen = activeGenerators[generatorIndex];

    // Crea el string de color RGBA actual, usando los valores del generador seleccionado
    const rgbaColor = `rgba(${gen.r}, ${gen.g}, ${gen.b}, ${(gen.a / 100).toFixed(2)})`;
    if (!colorValues.includes(rgbaColor)) colorValues.push(rgbaColor); // Lo añade a colorValues si no existe.

    // Incrementa los valores del generador seleccionado (lógica de combinación)
    gen.a++; // Incrementa el componente alfa
    if (gen.a > maxA) { // Si alfa llega a su máximo (100)
        gen.a = 0;     // Reinicia alfa
        gen.b++;     // Incrementa el componente azul
        if (gen.b > 255) { // Si azul llega a su máximo (255)
            gen.b = 0;     // Reinicia azul
            gen.g++;     // Incrementa el componente verde
            if (gen.g > 255) { // Si verde llega a su máximo (255)
                gen.g = 0;     // Reinicia verde
                gen.r++;     // Incrementa el componente rojo
                if (gen.r > 255) { // Si rojo llega a su máximo (255)
                    // Desactiva este generador
                    gen.active = false;
                }
            }
        }
    }

    return rgbaColor; // Retorna el color RGBA generado
}

// Variables para las permutaciones
let permutationSourceIndex = 0; // Indice de la combinacion RGBA que se esta permutando
let permutations = []; // Array para almacenar las permutaciones
let permutationIndex = 0; // Index of the current permutation
let generatingPermutations = false;//Bandera para controlar si se estan generando permutaciones.

// Función de permutación (Algoritmo de Heap)
function permute(arr, l, r, result) {
    if (l == r) {
        result.push([...arr]); // Push a *copy* of the array
    } else {
        for (let i = l; i <= r; i++) {
            [arr[l], arr[i]] = [arr[i], arr[l]]; // Swap
            permute(arr, l + 1, r, result);
            [arr[l], arr[i]] = [arr[i], arr[l]]; // Backtrack (restore original order)
        }
    }
}
// Funcion para generar las permutaciones de un color RGBA.
function generatePermutations(rgbaColor) {
    //Separa el string en un array de enteros.
    const rgbaArray = rgbaColor.substring(5, rgbaColor.length - 1).split(",").map(Number);
    //Llama al algoritmo de permutacion
    const result = [];
    permute(rgbaArray, 0, rgbaArray.length - 1, result);

    //Convierte las permutaciones a strings y las añade al array de permutaciones.
    for(let permutation of result){
        permutations.push(`rgba(${permutation.join(", ")})`);
    }
}
//Funcion para empezar la permutacion
function startPermutations(){
    generatingPermutations = true; // Establece la bandera de permutaciones a true
    permutations = [];//Limpia el array de permutaciones.
    permutationIndex = 0;//Establece el index a 0
     //Verifica que existen colores para permutar.
    if (colorValues.length > 0) {
        if (permutationSourceIndex < colorValues.length) { //Verifica el indice de permutacion.
            generatePermutations(colorValues[permutationSourceIndex]); //Genera las permutaciones de la combinacion actual
            permutationSourceIndex++; //Incrementa el indice para la proxima.
        } else {
            // Si ya no hay colores para permutar, reinicia el indice de la fuente
            permutationSourceIndex = 0;
            startPermutations(); // Reinicia el proceso de permutacion.
        }
    }
}

//Funcion para obtener un color
function getColor(){
    if(generatingColors){
        //Si aun se estan generando colores, obtiene el siguiente color
        return getNextRGBA();
    }else if (generatingPermutations){
        //Si se estan generando permutaciones.
        if(permutationIndex < permutations.length){
            //Si hay permutaciones disponibles, devuelve la siguiente
            const color = permutations[permutationIndex];
            permutationIndex++;
            return color;
        }else{
            //Si no hay mas permutaciones, genera mas
            startPermutations();
            return getColor(); //Llamada recursiva.
        }
    }
    else{
        // Si ya no estamos generando colores ni permutaciones, cíclicamente recorre los colores existentes
        if(colorIndex < colorValues.length){
            const color = colorValues[colorIndex];
            colorIndex++;
            return color;
        }else{
            colorIndex = 0; // Reinicia el indice.
            return getColor(); //Llamada recursiva.
        }
    }
}

// Función para generar y asignar colores a la paleta
function generatePalette() {
    currentPalette = []; // Limpia la paleta anterior
    for (let i = 0; i < 8; i++) { // Itera 8 veces para obtener 8 colores
        currentPalette.push(getColor()); // Añade el siguiente color disponible a la paleta
    }
}

// Función para aplicar la paleta de colores
function applyColors() {
    // 1. Fondo del Body
    document.body.style.backgroundColor = currentPalette[0];

    // 2. Encabezado (Header)
    const header = document.querySelector('header');
    if (header) header.style.backgroundColor = currentPalette[1];

    // 3. Pie de página (Footer)
    const footer = document.querySelector('footer');
    if (footer) footer.style.backgroundColor = currentPalette[2];


    // 4. Distribuir los colores restantes
    const remainingElements = [
      document.querySelector('nav'),
      document.querySelector('main'),
      ...document.querySelectorAll('article'),
      document.querySelector('aside'),
      ...document.querySelectorAll('section'),
      ...document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    ];

    let paletteIndex = 3; //Comienza a asignar desde el indice 3.
    for (let el of remainingElements) {
        if (el) {
          el.style.backgroundColor = currentPalette[paletteIndex];
          paletteIndex = (paletteIndex + 1) % currentPalette.length; //Cicla entre los colores.
          if(paletteIndex < 3) paletteIndex = 3; //Reinicia el indice si es necesario.
        }
    }
}

// Función para iniciar el cambio de colores
function startChanging() {
    clearInterval(intervalId); // Detiene cualquier intervalo anterior
    generatePalette(); // Genera la paleta inicial
    applyColors(); // Aplica los colores
    intervalId = setInterval(() => { // Establece el intervalo para cambiar los colores
        generatePalette(); // Genera una nueva paleta en cada intervalo
        applyColors(); // Aplica los colores
    }, 3000); // Cambia cada 3 segundos
    startButton.disabled = true; // Deshabilita el botón de inicio
    stopButton.disabled = false; // Habilita el botón de detención
}

// Función para detener el cambio de colores y guardar la paleta
function stopChanging() {
    clearInterval(intervalId); // Detiene el intervalo
    startButton.disabled = false; // Habilita el botón de inicio
    stopButton.disabled = true; // Deshabilita el botón de detención

    // Genera la cadena CSS
    let cssString = `:root {\n`; // Inicia la regla :root
    for (let i = 0; i < currentPalette.length; i++) { // Itera a través de la paleta actual
        cssString += `  --color-${i + 1}: ${currentPalette[i]};\n`; // Añade cada color como una variable CSS
    }
    cssString += `}\n`; // Cierra la regla :root

    console.log(cssString); // Imprime el CSS generado en la consola

    // Simula la descarga del archivo CSS
    const blob = new Blob([cssString], { type: 'text/css' }); // Crea un Blob con la cadena CSS
    const url = URL.createObjectURL(blob); // Crea una URL para el Blob
    const a = document.createElement('a'); // Crea un elemento <a> (enlace)
    a.href = url; // Establece la URL del enlace como la URL del Blob
    a.download = 'design-system-palette.css'; // Establece el nombre del archivo para la descarga
    document.body.appendChild(a); // Añade el enlace al documento (necesario en Firefox)
    a.click(); // Simula un clic en el enlace para iniciar la descarga
    document.body.removeChild(a); // Elimina el enlace del documento
    URL.revokeObjectURL(url); // Libera la URL del Blob (importante para la gestión de memoria)
}

// Event listeners para los botones
startButton.addEventListener('click', startChanging); // Asocia la función startChanging al evento click del botón de inicio
stopButton.addEventListener('click', stopChanging); // Asocia la función stopChanging al evento click del botón de detención

stopButton.disabled = true;//Deshabilita el boton de stop por defecto.

// Inicializa los múltiples generadores de color al cargar la página
initializeGenerators();

// bug tracker

let bugs = JSON.parse(localStorage.getItem('bugs')) || []; // Load bugs from local storage or initialize an empty array

function saveBugs() {
    localStorage.setItem('bugs', JSON.stringify(bugs));
}

function addBug() {
    const title = document.getElementById('bugTitle').value;
    const description = document.getElementById('bugDescription').value;

    if (title && description) {
        const bug = {
            id: Date.now(),
            title: title,
            description: description
        };

        bugs.push(bug);
        saveBugs(); // Save to local storage
        displayBugs();
        clearForm();
    } else {
        alert('Please enter both title and description.');
    }
}

function displayBugs() {
    const bugsList = document.getElementById('bugs');
    bugsList.innerHTML = '';

    bugs.forEach(bug => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>${bug.title}</strong>: ${bug.description}
            <button onclick="editBug(${bug.id})">Edit</button>
            <button onclick="deleteBug(${bug.id})">Delete</button>
        `;
        bugsList.appendChild(listItem);
    });
}

function clearForm() {
    document.getElementById('bugTitle').value = '';
    document.getElementById('bugDescription').value = '';
}

function editBug(id) {
    const bugToEdit = bugs.find(bug => bug.id === id);

    if (bugToEdit) {
        document.getElementById('bugTitle').value = bugToEdit.title;
        document.getElementById('bugDescription').value = bugToEdit.description;

        const addButton = document.querySelector('#bugForm button');
        addButton.textContent = 'Update Bug';
        addButton.onclick = function() { updateBug(id); };
    }
}

function updateBug(id) {
    const title = document.getElementById('bugTitle').value;
    const description = document.getElementById('bugDescription').value;

    if (title && description) {
        const bugIndex = bugs.findIndex(bug => bug.id === id);
        if (bugIndex !== -1) {
            bugs[bugIndex].title = title;
            bugs[bugIndex].description = description;
            saveBugs(); // Save to local storage
            displayBugs();
            clearForm();

            const addButton = document.querySelector('#bugForm button');
            addButton.textContent = 'Add Bug';
            addButton.onclick = addBug;
        }
    } else {
        alert('Please enter both title and description.');
    }
}

function deleteBug(id) {
    bugs = bugs.filter(bug => bug.id !== id);
    saveBugs(); // Save to local storage
    displayBugs();
}

displayBugs();