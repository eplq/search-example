# Búsqueda con Throttle y Debounce

La idea surge de ver el vídeo [Learn Debounce And Throttle In 16 Minutes](https://www.youtube.com/watch?v=cjIswDCKgu0) de Kyle Cook y de cómo implementa estas dos funcionalidades para aumentar el rendimiento.

Si bien en el vídeo está explicado, no hay mejor manera de aprender que la de intentar entender el código y las ideas, e implementarlas combinándolas con otras cosas que ya uno conozca previamente.

Por todo esto, esta es una combinación de esos conceptos con una API sencilla que busca en una base de datos SQLite3 y sirve los datos en JSON gracias a Flask.

Es importante resaltar que en el archivo *static/main.js* hay numerosos comentarios junto con el código que tratan de explicar y hacer entender el funcionamiento de estos mecanismos.

## Cómo hacerlo funcionar

Para hacerlo funcionar, primero clonamos el repositorio:

```bash
git clone https://github.com/eplq/search-example.git
cd search-example
```

Una vez clonado, instalamos las dependencias. Para ello, es muy recomendable utilizar virtualenv o similar. En este caso, usaremos virtualenv:

```bash
py -m venv env # windows
python3 -m venv env # linux
```

Ahora activamos el entorno virtual:

Windows (PowerShell)

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
.\env\Scripts\Activate.ps1
```

Linux

```bash
source env/Scripts/activate
```

Instalamos las dependencias:

```bash
python -m pip install -r requirements.txt # Windows y Linux
```

Construimos la base de datos:

```bash
python create_database.py
```

Dar las gracias a [Jovansonlee Cesar](https://github.com/ivanceras) porque es de quien he obtenido los scripts SQL de Sakila para SQLite. [Repositorio](https://github.com/ivanceras/sakila).

Y ejecutamos el servidor:

```bash
python server.py
```

El servicio estará accesible en [http://localhost:8101](http://localhost:8101).

## Desarrollo

Para continuar con el desarrollo, es muy recomendable utilizar [Browser Sync](https://browsersync.io/).

Lo activamos con el siguiente comando, en otro terminal, mientras está abierto el servidor:

```bash
browser-sync start --config bs-config.js
```

Se asume que está todo bien instalado y disponible en el PATH.

Esto hará un proxy al que nos conectaremos, y recargará la página cada vez que se produce un cambio en el código.

## Throttle

Consiste en realizar acciones en períodos regulares mientras haya eventos.

El código comentado, disponible en *static/main.js* es el siguiente:

```javascript
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

            // estadísticas
            throttleCounter++;
            throttleRequests.textContent = throttleCounter;
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

        // estadísticas
        throttleCounter++;
        throttleRequests.textContent = throttleCounter;
    }
}
```

## Debounce

Consiste en retrasar las acciones que se deban llevar a cabo mientras haya eventos.

El código, de nuevo disponible en *static/main.js*, es el siguiente:

```javascript
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

            // estadísticas
            debounceCounter++;
            debounceRequests.textContent = debounceCounter;

        }, delay);
    }
}
```