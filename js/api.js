
"use strict";
class Jugador {
    constructor(nombre, apellidos, posicion) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.posicion = posicion;
    }
}


"use script";
class Equipo {

    constructor() {
        this.listaJugadores = [];
        this.listaBanquillo = [];
    }


    // Método para agregar un nuevo jugador
    agregarJugador() 
    {
        // Obtener los valores de los inputs
        const nombre = document.querySelector("[data-element='nombre']").value;
        const apellidos = document.querySelector("[data-element='apellidos']").value;
        const selector = document.querySelector("[data-element='selector']");
        const posicionSeleccionada = selector.options[selector.selectedIndex].text;

        // Eliminar la opción del select
        selector.remove(selector.selectedIndex);

        // Crear un nuevo objeto Jugador
        const nuevoJugador = new Jugador(nombre, apellidos, posicionSeleccionada);

        // Agregar el nuevo jugador a la lista del equipo
        this.listaJugadores.push(nuevoJugador);


        // Limpiar los campos de texto y textarea
        document.querySelector("[data-element='nombre']").value = "";
        document.querySelector("[data-element='apellidos']").value = "";
        

        // actualizar los jugadores
        this.añadirJugadorHtml(nuevoJugador);

        // dehabilitar el poder insertar un archivo 
        const buttonCSV = document.querySelector("[data-element='archivoCSV']");
        buttonCSV.disabled = true; 
    }


    añadirJugadorHtml(nuevoJugador) {
        // añadimos al jugador en un article
        var nuevoArticle = "<article draggable='true' ondragstart='equipo.iniciarArrastre(event)'>";
        nuevoArticle += `<h3>${nuevoJugador.nombre}</h3>`;
        nuevoArticle += `<p>Apellidos:${nuevoJugador.apellidos}</p>`;
        nuevoArticle += `<p>Posición:${nuevoJugador.posicion}</p>`;
        nuevoArticle += "</article>";
        $("[data-element='listaJugadores']").append(nuevoArticle);
    }

    añadirAlBanquillo(nuevoJugador) {
        // añadimos al jugador un article
        var nuevoArticle = "<article>";
        nuevoArticle += `<h3>${nuevoJugador.nombre}</h3>`;
        nuevoArticle += `<p>Apellidos:${nuevoJugador.apellidos}</p>`;
        nuevoArticle += `<p>Posición:${nuevoJugador.posicion}</p>`;
        nuevoArticle += "</article>";
        $("[data-element='banquillo']").append(nuevoArticle);
    }

    //  API FILE -- CARGA DE ARCHIVOS

    readInputFile(files)
    {

        // guardar la isntancia
        const self = this;
      //Solamente toma un archivo
      var archivo = files[0];

      //Solamente admite archivos de tipo texto
      var tipoTexto = /text.*/;
      if (archivo.type.match(tipoTexto)) 
      {
            var lector = new FileReader();
            lector.onload = function (evento) {

            var lineas = lector.result.split('\n');

          
            // por cada linea, sacar una noticia
            lineas.forEach(linea => {
                var jugador = linea.split(":");

                // Crear un nuevo objeto Jugador
                const nuevoJugador = new Jugador(jugador[0], jugador[1], jugador[2]);

                if(jugador[2].toLowerCase() === 'banquillo')
                {
                    self.listaBanquillo.push(nuevoJugador);
                    self.añadirAlBanquillo(nuevoJugador);
                }
                else
                {
                    self.listaJugadores.push(nuevoJugador);
                    self.añadirJugadorHtml(nuevoJugador);
                } 
            });
            }      
            lector.readAsText(archivo);
        }
        else
            errorArchivo.innerText = "Error : ¡¡¡ Archivo no válido !!!";
                 

        // como se ha leido un archivo, bloquear el formulario y el botón 
        this.bloquearFormulario();
        const buttonCSV = document.querySelector("[data-element='archivoCSV']");
        buttonCSV.disabled = true; 
    }


    bloquearFormulario()
    {
        
        // Obtener referencias a los elementos del formulario
        const nombre = document.querySelector('[data-element="nombre"]');
        const apellidos = document.querySelector('[data-element="apellidos"]');
        const posicion = document.querySelector('[data-element="selector"]');
        const addButton = document.querySelector("[data-element='añadirJugadores'] input[type='button']");

        // Deshabilitar cada campo del formulario
        nombre.disabled = true;
        apellidos.disabled = true;
        posicion.disabled = true;
        addButton.disabled = true; 
    }



    // API DRAG AND DROP
    // Método para iniciar el arrastre de un jugador
    iniciarArrastre(event) {
        const jugadorArrastrado = event.target;

        // Establecer los datos a transferir durante el arrastre
        event.dataTransfer.setData('text/plain', jugadorArrastrado.outerHTML);
    }

    // Método para permitir soltar un jugador en el banquillo
    permitirSoltar(event) {
        event.preventDefault();
    }

    // Método para soltar un jugador en el banquillo
    soltarJugadorEnBanquillo(event) {
        event.preventDefault();
        const jugadorArrastrado = event.dataTransfer.getData('text/plain');

        // Agregar el jugador arrastrado al banquillo
        const banquillo = document.querySelector("[data-element='banquillo']");
        banquillo.insertAdjacentHTML('beforeend', jugadorArrastrado);

        // eliminar el jugador de la lista
        const jugadorArrastradoHTML = event.dataTransfer.getData('text/plain');
        const tempFragment = document.createDocumentFragment();
        const tempElement = document.createElement('template');
        tempElement.innerHTML = jugadorArrastradoHTML;
        tempFragment.appendChild(tempElement.content);

        const nombreJugador = tempFragment.querySelector('h3').textContent.trim();


        const index = this.listaJugadores.findIndex(jugador => jugador.nombre === nombreJugador);

        // Si se encuentra el jugador en la lista, eliminarlo
        if (index !== -1) {
            this.listaJugadores.splice(index, 1);

            // Actualizar visualmente la lista de jugadores
            const listaJugadores = document.querySelector("[data-element='listaJugadores']");
            const jugadoresEnLista = listaJugadores.querySelectorAll('article');

            jugadoresEnLista.forEach(jugador => {
                const nombre = jugador.querySelector('h3').textContent.trim();
                if (nombre === nombreJugador) {
                    jugador.remove();
                }
            });
        }




        this.quitarDraggableDeBanquillo();
    }

    quitarDraggableDeBanquillo() {
        const banquillo = document.querySelector("[data-element='banquillo']");
        const articulosEnBanquillo = banquillo.querySelectorAll('article');
        
        const self = this;
        articulosEnBanquillo.forEach(articulo => {
            articulo.removeAttribute('draggable');
        });
    }



    // MOSTRAR LA FORMACIÓN DEL EQUIPO - Fullscreen API

    mostrarFormación()
    {
        // si no existe, crear la sección de elementos donde van las noticias
        if (!document.querySelector("[data-element='formacion']")) {
            $("body").append('<section data-element="formacion"></section>');

            // añadir un encabezado al elemento section del campo
            $("[data-element='formacion']").append("<h2>Formacion en el campo</h2>");

        }

        // si existe, eliminar su contenido para volver a crear la formación
        const formacion = document.querySelector("[data-element='formacion']");

        // Eliminar todos los elementos article dentro de la sección
        const elementos = formacion.querySelectorAll('article');
        elementos.forEach(elemento => {
            elemento.remove();
        });


        // recorrer todos los jugadores y ponerlos en la posicion que les corresponde
        this.listaJugadores.forEach(jugador => {
            const article = document.createElement('article');

            //article.textContent = `${jugador.nombre} ${jugador.apellidos} - ${jugador.posicion}`;

            // contenido del article
            const nombre = document.createElement('h3');
            nombre.textContent = jugador.nombre;
            const apellidos = document.createElement('h3');
            apellidos.textContent = jugador.apellidos;
            const posicion = document.createElement('p');
            posicion.textContent = jugador.posicion;

            article.appendChild(nombre);
            article.appendChild(apellidos);
            article.appendChild(posicion);

            article.setAttribute('data-element', this.getPosicionAttribute(jugador.posicion)); //atributo con su posicion en el campo
            formacion.appendChild(article);

        });


        // Agregar un botón para mostrar la formación en pantalla completa
        if (!document.querySelector("[data-element='fullScreen']")) {

            $("body").append('<section data-element="fullScreen"></section>');
            $("[data-element='fullScreen']").append('<h3>Formación en pantalla completa</h3>')

            const fullscreenButton = document.createElement('button');
            fullscreenButton.textContent = 'Mostrar en pantalla completa';
            fullscreenButton.setAttribute('data-element', 'fullScreen');
            fullscreenButton.addEventListener('click', () => {
                this.mostrarEnPantallaCompleta();
            });
            $("[data-element='fullScreen']").append(fullscreenButton);
        }

        
 
    }

    getPosicionAttribute(posicion) {
        posicion = posicion.replace('\r', '');
        if (posicion === 'Portero') {
            return 'portero';
        } else if (posicion === 'Delantero izquierda') {
          return 'delanteroIzq';
        } else if (posicion === 'Delantero central') {
          return 'delanteroCentral';
        } else if (posicion === 'Delantero derecha') {
          return 'delanteroDerecha';
        } else if (posicion === 'Central izquierdo') {
            return 'centralIzq';
        } else if (posicion === 'Central derecho') {
            return 'centralDerecha';
        } else if (posicion === 'Defensa central') {
            return 'defensaCentral';
        } else if (posicion === 'Defensa izquierdo') {
            return 'defensaIzq';
        } else if (posicion === 'Defensa derecho') {
            return 'defensaDerecho';
        }
    }

    mostrarEnPantallaCompleta() {
        const element = document.querySelector("[data-element='formacion']");
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) { /* Safari */
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { /* IE11 */
            element.msRequestFullscreen();
        } else {
            // el navegador no admite la API 
            console.log('La pantalla completa no es compatible con este navegador.');
        }
    }

}
const equipo = new Equipo();

