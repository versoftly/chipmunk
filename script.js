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
