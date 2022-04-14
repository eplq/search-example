const selectElement = document.querySelector("select");
const tableHead = document.querySelector("thead");
const tableBody = document.querySelector("tbody");

fetch("/fields")
    .then(res => res.json())
    .then(field => {
        selectElement.innerHTML = "";
        field.forEach(fieldName => {
            const option = document.createElement("option");
            option.value = fieldName;
            option.textContent = fieldName;

            selectElement.append(option);

            const column = document.createElement("th");
            column.textContent = fieldName;

            tableHead.append(column);
        }); 
    });

function fetchQuery(ev) {
    const query = ev.target.value;

    fetch(`/search?field=${selectElement.value}&query=${query}`)
    .then(res => res.json())
    .then(data => {
        tableBody.innerHTML = "";

        data.forEach(item => {
            const tableRow = document.createElement("tr");

            item.forEach(cell => {
                const tableCell = document.createElement("td");
                tableCell.textContent = cell;

                tableRow.append(tableCell);
            });

            tableBody.append(tableRow);
        });
    });
}


let normalCounter = 0;
let throttleCounter = 0;
let debounceCounter = 0;

const normalRequests = document.querySelector("#normalRequests");
const throttleRequests = document.querySelector("#throttleRequests");
const debounceRequests = document.querySelector("#debounceRequests");

const normalInput = document.querySelector("#normal");
const throttleInput = document.querySelector("#throttle");
const debounceInput = document.querySelector("#debounce");

normalInput.addEventListener("input", ev => {
    normalCounter++;
    normalRequests.textContent = normalCounter;
    fetchQuery(ev);
});

function debounce(cb, delay=250) {
    /*
     * La idea fundamental del debouncing es retrasar la ejecución
     * del callback hasta que ya no haya eventos. Es decir, mientras
     * el usuario esté escribiendo, no se va a llamar al callback.
     * 
     * Esto se consigue predefiniendo un período en el que se esperarán
     * nuevos eventos. De no darse tras el tiempo establecido, se ejecuta
     * el callback.
     */

    /* Establecemos la variable donde guardaremos  */
    let timeout

    /*
     * No sabemos los argumentos que se le van a pasar al callback, ya
     * que la función es de uso general. Por tanto, necesitamos obtener
     * un número indeterminado de argumentos.
     * 
     * Lo conseguimos con el spread operator, u operador de propagación,
     * que hará que los argumentos pasen a tener forma de array.
     * 
     * Luego cuando lo pasamos al callback, volvemos a usar el operador,
     * para pasarle los argumentos al callback.
     * 
     * Respecto al timeout, lo reiniciamos cada vez que se da un evento,
     * retrasándo la ejecución del callback tanto tiempo como se indica
     * en la variable delay.
     */
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            cb(...args);
        }, delay);
    }
}

/*
 * ¿Por qué no lo podemos poner así? Porque no se mantiene la variable timeout entre
 * llamadas, lo que hace que solo se retrase cada una de las llamadas al callback, con
 * lo que estás consiguiendo lo mismo que haciéndolo directamente, pero retrasándolo.
 * 
 * debounceInput.addEventListener("input", ev => debounce(fetchQuery, 1000)(ev));
 * 
 * 
 * Para solucionarlo, guardaremos el valor devuelto de la llamada a debounce en una
 * constante, para que pueda mantener el estado.
 * 
 * Tambien aplica a throttle.
 */
const debounceFetchQuery = debounce(fetchQuery, 500);
debounceInput.addEventListener("input", debounceFetchQuery);


function throttle(cb, delay=1000) {
    let shouldWait = false;
    let waitingArgs; // La idea es retener los argumentos para la siguiente llamada al callback

    /*
     * Cuando no hay argumentos en espera, significa que
     * que ya no debe de esperar y se sale. Esto es porque
     * ya se ha llamado al callback y no hay más eventos.
     * 
     * Cuando hay argumentos en espera, ejecutamos el callback
     * y anulamos los argumentos con los que acabamos de ejecutar
     * el callback, porque ya no son válidos para la siguiente
     * llamada.
     * 
     * Volvemos a programar la ejecución de la función de debajo,
     * si ha habido un nuevo evento, habrá argumentos por lo que se
     * ejecutará el callback tras el delay. Si no lo ha habido, los
     * argumentos en espera seguirán siendo nulos y por tanto ya no
     * se ejecutará más hasta que vuelva a haber eventos.
     */
    const timeoutFunction = () => {
        if (waitingArgs == null) {
            shouldWait = false;
        } else {
            cb(...waitingArgs);
            waitingArgs = null;
            setTimeout(timeoutFunction, delay);
        }
    }

    return (...args) => {

        /*
         * Si ya está esperando,
         * actualizamos los argumentos que se pasarán al
         * callback para tener la información más actualizada.
         */
        if (shouldWait) {
            waitingArgs = args;
            return;
        }

        /*
         * Cuando ya no hay que esperar, llamamos al callback
         * y establecemos que hay que volver a esperar. Tras ello,
         * activamos el timeout, que hará que se ejecute la función
         * de más arriba.
         */
        cb(...args);
        shouldWait = true;
        setTimeout(timeoutFunction, delay);
    }
}

const throttleFetchQuery = throttle(fetchQuery, 500);
throttleInput.addEventListener("input", throttleFetchQuery);