# CHIPMUNK

# Calculadora de Ganancias con Temporizador y Generador de Paletas de Colores

Este proyecto combina dos funcionalidades principales:

1.  **Calculadora de Ganancias:** Calcula y muestra un desglose de ganancias, comisiones, ahorros e inversiones basado en una ganancia ingresada por el usuario.  La entrada de la ganancia se solicita cada 3 horas mediante un cuadro de diálogo (`prompt`).
2.  **Temporizador con Ajuste Manual:**  Un temporizador que realiza una cuenta regresiva en ciclos de 3 horas.  El usuario puede ajustar manualmente el tiempo usando botones.
3. **Generador de Paleta de Colores:** Generates a new palette of colors and apply to the different tags of the document every 3 seconds.

## Características

*   **Cálculo de Ganancias:**
    *   Solicita la ganancia al usuario cada 3 horas.
    *   Calcula la comisión (6.95% por defecto).
    *   Calcula la ganancia neta (ganancia - comisión).
    *   Calcula el ahorro (20% de la ganancia neta, por defecto).
    *   Calcula la cantidad a invertir (ganancia neta - ahorro - 1 unidad monetaria "libre", por defecto).
    *   Muestra un desglose de todos los cálculos en la consola.
    *   Mantiene un acumulador de ganancias totales.
*   **Temporizador:**
    *   Cuenta regresiva de 3 horas (configurable).
    *   Se sincroniza con la solicitud de ganancias (el prompt aparece cuando el temporizador llega a 00:00:00).
    *   Botones para ajustar manualmente el tiempo (+1 segundo, -1 segundo, +1 minuto, -1 minuto).
    *   El ajuste de tiempo se guarda en `localStorage`, por lo que persiste entre sesiones.
*   **Persistencia de Datos:**
    *   La ganancia ingresada, el acumulador y el ajuste del temporizador se guardan en `localStorage`.  Estos datos se cargan automáticamente al recargar la página.
* **Generador de Paletas:**
    * Generates multiple secuential palettes using RGBA colors.
    * The colors changes every 3 seconds.
    * The generation of colors goes first by combinations of the RGBA components, second by permutations of them, and at the end a loop of all the generated colors.
    * Button to stop the color change and create a CSS file with the last generated palette of colors.

## Estructura del Código

El código está organizado en varias funciones para una mejor legibilidad y mantenibilidad:

*   **`solicitarGanancia()`:**  Maneja la solicitud de la ganancia al usuario a través de un `prompt()`.  Valida la entrada y actualiza las variables globales `ganancia` y `acumulador`. Llama a `calcularYMostrarResultados()`.
*   **`calcularYMostrarResultados()`:** Realiza los cálculos (comisión, ganancia neta, ahorro, inversión) y muestra los resultados en la consola del navegador.
*   **`updateTimer()`:**  Actualiza el temporizador visual cada segundo.  Detecta cuándo el temporizador llega a cero y llama a `solicitarGanancia()`.  También gestiona el ajuste manual del temporizador.
*   **`adjustTimer(adjustment)`:**  Ajusta el temporizador sumando o restando milisegundos (usado por los botones de ajuste).
*   **`formatTime(milliseconds)`:**  Convierte un valor de tiempo en milisegundos a un formato de cadena HH:MM:SS.
*   **`initializeGenerators()`:** Inicializa los múltiples generadores de color.
* **`getNextRGBA()`:** genera colores rgba secuencialmente.
* **`permute(arr, l, r, result)`:** genera permutaciones de colores rgba.
* **`generatePermutations(rgbaColor)`:** controla la generacion de permutaciones.
* **`startPermutations()`:** inicializa la generacion de permutaciones.
*   **`getColor()`:** obtiene el siguiente color disponible, ya sea de los generadores, las permutaciones o el ciclo de colores existentes.
*   **`generatePalette()`:** genera la paleta de colores actual.
*   **`applyColors()`:** aplica la paleta de colores actual a los elementos HTML.
*   **`startChanging()`:** inicia el cambio de colores.
*    **`stopChanging()`:** detiene el cambio de colores y guarda la paleta actual.
*   **Event Listeners (`load`, `unload`, botones):**  Configuran las acciones que ocurren cuando la página se carga, se cierra y cuando se hace clic en los botones.

## Variables Globales

*   `ganancia`: Almacena la ganancia ingresada por el usuario (puede ser `undefined` antes de la primera entrada).
*   `acumulador`: Almacena la suma acumulada de todas las ganancias ingresadas.
*   `cycleDuration`:  Define la duración del ciclo del temporizador (3 horas en milisegundos).
*   `lastPromptTime`:  Registra el momento en que se mostró el último `prompt()`.
*   `porcentajeDeLaComision`:  Almacena el porcentaje de comisión (valor por defecto: 6.95).
*   `libres`:  Almacena la cantidad fija "libre" (valor por defecto: 1).
*   `porcentajeDelAhorro`: Almacena el porcentaje de ahorro (valor por defecto: 20).
*   `timerInterval`:  Almacena el ID del intervalo del temporizador (para poder detenerlo).
* `startButton`: HTML button to start the color changer.
* `stopButton`: HTML button to stop the color changer.
*   `intervalId`:  Almacena el ID del intervalo del color changer (para poder detenerlo).
* `currentPalette`: Paleta de colores actual.
*   `colorValues`:  Almacena todos los colores generados.
*  `colorIndex`: Indice para recorrer `colorValues`.
* `generatingColors`: Controla si se generan colores o se itera.
* `r`, `g`, `b`, `a`: variables de los colores.
* `maxA`: valor maximo de alpha.
* `numGenerators`: cantidad de generadores de colores.
* `generators`: array de generadores de colores.
* `permutationSourceIndex`: Indice de la combinacion que se esta permutando
* `permutations`: array de permutaciones.
* `permutationIndex`: indice de la permutacion actual.
* `generatingPermutations`: bandera para controlar la generacion de permutaciones.

## Uso

1.  **Abrir el archivo HTML en un navegador web.** El temporizador comenzará a contar regresivamente.
2.  **Cuando el temporizador llegue a 00:00:00, aparecerá un cuadro de diálogo (`prompt`) solicitando la ganancia.**  Ingresa un valor numérico positivo y haz clic en "Aceptar".  Si haces clic en "Cancelar" o ingresas un valor no válido, se mostrará un mensaje en la consola y se te volverá a solicitar la ganancia (recursivamente).
3.  **Los cálculos se mostrarán en la consola del navegador** (normalmente se abre presionando F12).
4.  **Puedes ajustar manualmente el temporizador** usando los botones "+1 Segundo", "-1 Segundo", "+1 Minuto" y "-1 Minuto".  El ajuste se guarda en `localStorage`.
5. **Click en el boton "Iniciar Cambio de Colores"** para empezar a cambiar los colores.
6. **Click en el boton "Detener y Guardar Paleta"** para detener el cambio de colores y generar un archivo css.

## Notas

*   El código utiliza `localStorage` para persistir los datos entre sesiones del navegador.  Si borras el almacenamiento local de tu navegador, los datos se restablecerán.
*   Los cálculos se realizan y se muestran *solo* después de que el usuario ingresa una ganancia válida.
*   El código está escrito en JavaScript puro (sin frameworks ni bibliotecas externas).
*   El código incluye comentarios explicativos en español.

## Posibles Mejoras

*   **Interfaz de Usuario (UI):**  En lugar de usar `console.log` para mostrar los resultados, se podría crear una interfaz de usuario más amigable en HTML para mostrar los cálculos, el acumulador y el estado del temporizador.
*   **Validación más estricta:** Se podría agregar validación adicional para la entrada del usuario (por ejemplo, limitar la longitud de la entrada, permitir solo números y un punto decimal, etc.).
*   **Configuración:** Permitir al usuario configurar los valores de `porcentajeDeLaComision`, `libres` y `porcentajeDelAhorro` a través de la interfaz de usuario.
*   **Historial:**  Mostrar un historial de las ganancias ingresadas, en lugar de solo el acumulador.
* **Mejor control de errores:** En lugar de usar `console.log` para errores de entrada, mostrar mensajes de error más amigables para el usuario en la interfaz.