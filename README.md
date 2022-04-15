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