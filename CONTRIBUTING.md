# `datachile/datachile` contribution guidelines

<small>Nota: Este archivo contiene información de contribución para el repositorio `datachile/datachile`, que contiene el sitio web de DataChile. Para información general sobre contribución en ésta y otras áreas el proyecto, consulte el archivo [docs/contributing.md](docs/contributing.md).</small>

<small>Note: This file contains information on the contribution guidelines for the `datachile/datachile` repository, which contains the DataChile front-end website. For general info on contributions on this and other repos, check the [docs/contributing.md](docs/contributing.md) file.</small>

## Entorno de desarrollo / Development environment

El sitio web de DataChile funciona sobre un framework creado por la empresa Datawheel, llamado [canon](https://github.com/Datawheel/canon). Este framework se encarga de compilar los componentes React en el servidor y servir el sitio web al cliente. Este framework se encarga además de manejar las peticiones a la API de DataChile, para incluir los datos iniciales en el sitio rendereado.

Para correr una versión local de desarrollo del sitio web de DataChile, clona el repositorio e instala los módulos requeridos con `npm install`. Carga las variables del entorno necesarias para que el sitio web funciones, estas variables están definidas en el archivo `.env.example`. Luego usa el comando `npm run dev` para iniciar un entorno de desarrollo, lo que hará que el sitio esté disponible en http://localhost:3300. Desde aquí, canon irá monitoreando los cambios que hagas en el código, recompilará los componentes y recargará la página. Usa este entorno para probar los cambios que quieras sugerir para el sitio web.

DataChile's website works on a web framework, created by Datawheel, called [canon](https://github.com/Datawheel/canon). This framework is on charge of compiling the React components in the server, and serve the website to the client browser. This framework also handles the DataChile API queries in the components, to include the data in the server-side rendered components.

To run a local development version of the DataChile website, clone the repository and install the required modules with `npm install`. Load the environment variables needed to run the site, defined in the `.env.example` file. Then use the `npm run dev` command to start the development environment, which will run the website at http://localhost:3300. From here, canon will watch the changes in the repository files, recompile the components, and reload the page if needed. Use this environment to test the changes you plan to suggest to the website.

## Pull requests

Para enviarnos un pull request, haz un fork de este repositorio en tu cuenta, y realiza allí los cambios que quieras sugerir. Cuando tengas una propuesta funcional, abre un pull request desde Github hacia el repositorio `datachile/datachile`, explicando el problema que viste y los beneficios de incluir tus modificaciones. Revisaremos tu código lo antes posible, y de ser necesario te sugeriremos algunos cambios (ya que nosotros no podemos editar el código en tu pull request).

To send us over a pull request, fork this repository to your github account, and make the changes you want to suggest there. When you feel the changes are good enough, open a pull request from Github to the `datachile/datachile` repository. We will review your code as soon as possible, and if needed we will suggest some changes (as we can't edit the code in your pull request).
