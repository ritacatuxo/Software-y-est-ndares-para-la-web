class Viajes {

    constructor (){
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this));
        this.setUpCarrusel();
    }

    setUpCarrusel()
    {
        const slides = document.querySelectorAll("img");

        // select next slide button
        const nextSlide = document.querySelector("button[data-action='next']");

        // current slide counter
        let curSlide = 3;
        // maximum number of slides
        let maxSlide = slides.length - 1;

        // add event listener and navigation functionality
        nextSlide.addEventListener("click", function () {
        // check if current slide is the last and reset current slide
            if (curSlide === maxSlide) {
                curSlide = 0;
            } else {
                curSlide++;
            }

            //   move slide by -100%
            slides.forEach((slide, indx) => {
                var trans = 100 * (indx - curSlide);
                $(slide).css('transform', 'translateX(' + trans + '%)')
            });
        });

        // select next slide button
        const prevSlide = document.querySelector("button[data-action='prev']");

        // add event listener and navigation functionality
        prevSlide.addEventListener("click", function () {
            // check if current slide is the first and reset current slide to last
            if (curSlide === 0) {
                curSlide = maxSlide;
            } else {
                curSlide--;
            }

            //   move slide by 100%
            slides.forEach((slide, indx) => {
                var trans = 100 * (indx - curSlide);
                $(slide).css('transform', 'translateX(' + trans + '%)')
            });
        });
    }

    /**
     * Obtiene la posición geográfica del usuario y la almacene en 
     * diferentes atributos dentro de la clase
     */
    getPosicion(posicion){
        this.longitud         = posicion.coords.longitude; 
        this.latitud          = posicion.coords.latitude;  
        this.precision        = posicion.coords.accuracy;
        this.altitud          = posicion.coords.altitude;
        this.precisionAltitud = posicion.coords.altitudeAccuracy;
        this.rumbo            = posicion.coords.heading;
        this.velocidad        = posicion.coords.speed;       
    }

    /**
     * Manejo de errores relacionados con la geolocalización del usuario
     */
    verErrores(error){
        switch(error.code) {
        case error.PERMISSION_DENIED:
            this.mensaje = "El usuario no permite la petición de geolocalización"
            break;
        case error.POSITION_UNAVAILABLE:
            this.mensaje = "Información de geolocalización no disponible"
            break;
        case error.TIMEOUT:
            this.mensaje = "La petición de geolocalización ha caducado"
            break;
        case error.UNKNOWN_ERROR:
            this.mensaje = "Se ha producido un error desconocido"
            break;
        default:
            mensaje = "Error de geolocalización desconocido";
        }
    }

    /**
     * Obtener un mapa estático que representa la posición del usuario utilizando google maps
     */
    getMapaEstaticoGoogle(){
        var ubicacion = document.getElementById("mapaEstatico");
        
        var apiKey = "&key=AIzaSyAGpSrJz0xB7AF3L79HNXDaHSvKY11Bm4o";
        //URL: obligatoriamente https
        var url = "https://maps.googleapis.com/maps/api/staticmap?";
        //Parámetros
        // centro del mapa (obligatorio si no hay marcadores)
        var centro = "center=" + this.latitud + "," + this.longitud;
        //zoom (obligatorio si no hay marcadores)
        //zoom: 1 (el mundo), 5 (continentes), 10 (ciudad), 15 (calles), 20 (edificios)
        var zoom ="&zoom=15";
        //Tamaño del mapa en pixeles (obligatorio)
        var tamaño= "&size=800x600";
        //Escala (opcional)
        //Formato (opcional): PNG,JPEG,GIF
        //Tipo de mapa (opcional)
        //Idioma (opcional)
        //region (opcional)
        //marcadores (opcional)
        var marcador = "&markers=color:red%7Clabel:S%7C" + this.latitud + "," + this.longitud;
        //rutas. path (opcional)
        //visible (optional)
        //style (opcional)
        var sensor = "&sensor=false"; 
        
        const imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey;
        ubicacion.innerHTML = "<img src='"+imagenMapa+"' alt='mapa estático google' />";
    }


    initMap() {
        this.getMapaDinamicoGoogle();
    }

    getMapaDinamicoGoogle()
    {  
        
        var centro = {lat: 43.3672702, lng: -5.8502461};
        var mapaGeoposicionado = new google.maps.Map(document.getElementById("mapaDinamico"),{
            zoom: 8,
            center:centro,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        
        let infoWindow = new google.maps.InfoWindow;
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
  
              infoWindow.setPosition(pos);
              infoWindow.setContent('Localización actual');
              infoWindow.open(mapaGeoposicionado);
              mapaGeoposicionado.setCenter(pos);
            }, function() {
              handleLocationError(true, infoWindow, mapaGeoposicionado.getCenter());
            });
          } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, mapaGeoposicionado.getCenter());
          } 
                
    }


    handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: Ha fallado la geolocalización' :
                              'Error: Su navegador no soporta geolocalización');
        infoWindow.open(mapaGeoposicionado);
    }


    readXmlFile(files) 
    {
        let self = this; // guarda el contexto actual de 'this' en 'self'

        // solo toma un archivo
        var archivo = files[0];
        // solo admite archivos de tipo texto
        var tipoXml = /xml.*/;
        if (archivo.type.match(tipoXml)) 
        {
            var lector = new FileReader();
            lector.onload = function (evento) {
                self.mostrarXml(evento.target.result);
            }      
            lector.readAsText(archivo);
        }    
    }

    mostrarXml(xml)
    {
        // Parsear el XML
        var xmlDoc = $.parseXML(xml);
        var $xml = $(xmlDoc);



        // Crear la sección del xml
        if (!document.querySelector("[data-element='xml']")) {
            // Crear la sección XML
            var xmlSection = document.createElement('section');
            xmlSection.setAttribute('data-element', 'xml');

            $("[data-element='xmlInput']").after(xmlSection);
        }

        //añadir encabezado a la sección con el xml
        const h3 = document.createElement('h3');
        h3.textContent = 'Rutas';
        $("[data-element='xml']").append(h3);

        // Iterar sobre cada ruta
        $xml.find('ruta').each(function () {
            var nombreRuta = $(this).find('nombre').first().text();
            var tipoRuta = $(this).find('tipo').text();
            var transporteRuta = $(this).find('transporte').text();
            var duracionRuta = $(this).find('duracion').text();
            var agenciaRuta = $(this).find('agencia').text();
            var descripcionRuta = $(this).find('descripcion').text();
            var personasRuta = $(this).find('personas').text();
            var lugarRuta = $(this).find('lugar').text();
            var direccionRuta = $(this).find('direccion').text();
            var coordenadaLongitud = $(this).find('coordenada > longitud').text();
            var coordenadaLatitud = $(this).find('coordenada > latitud').text();
            var coordenadaAltitud = $(this).find('coordenada > altitud').text();
            var referenciasRuta = [];
            $(this).find('referencia').each(function () {
                referenciasRuta.push($(this).text());
            });
            var recomendacionRuta = $(this).find('recomendacion').text();

            // construir el HTML
            var html = 
                `<article>
                <h4><strong>${nombreRuta}</strong></h4>
                <p><strong>Tipo:</strong> ${tipoRuta}</p>
                <p><strong>Transporte:</strong> ${transporteRuta}</p>
                <p><strong>Duración:</strong> ${duracionRuta}</p>
                <p><strong>Agencia:</strong> ${agenciaRuta}</p>
                <p><strong>Descripción:</strong> ${descripcionRuta}</p>
                <p><strong>Personas:</strong> ${personasRuta}</p>
                <p><strong>Lugar:</strong> ${lugarRuta}</p>
                <p><strong>Dirección:</strong> ${direccionRuta}</p>
                <p><strong>Coordenadas:</strong> Longitud: ${coordenadaLongitud}, Latitud: ${coordenadaLatitud}, Altitud: ${coordenadaAltitud}</p>
                <p><strong>Referencias:</strong></p>
                <ul>
                ${referenciasRuta.map(ref => `<li><a href="${ref}" target="_blank">${ref}</a></li>`).join('')}
                </ul>
                <p><strong>Recomendación:</strong> ${recomendacionRuta}</p>`;

            // hitos
            var hitos = '<h5>Hitos:</h5><ul>';
            $(this).find('hito').each(function () {
                var nombreHito = $(this).find('nombre').text();
                var descripcionHito = $(this).find('descripcion').text();
                var coordenadaLongitudHito = $(this).find('coordenada > longitud').text();
                var coordenadaLatitudHito = $(this).find('coordenada > latitud').text();
                var coordenadaAltitudHito = $(this).find('coordenada > altitud').text();
                var distanciaAnteriorHito = $(this).find('distanciaAnterior').text(); // Nueva línea para obtener la distancia anterior
                
                var hito = 
                    `<li>
                        <h6>${nombreHito}</h6>
                        <p><strong>Descripción:</strong> ${descripcionHito}</p>
                        <p><strong>Coordenadas:</strong> Longitud: ${coordenadaLongitudHito}, Latitud: ${coordenadaLatitudHito}, Altitud: ${coordenadaAltitudHito}</p>
                        <p><strong>Distancia Anterior:</strong> ${distanciaAnteriorHito}</p>
                    </li>`;
                
                hitos += hito;
            });

            hitos += '</ul></article>';
            html += hitos;

            // Mostrar el HTML generado
            $('[data-element="xml"]').append(html);
        });
    }


    getMapaDinamicoKml(files) {

        // crear el mapa dinamico  para el kml
        if (!document.getElementById("mapaDinamicoKml")) {

            var figure = document.createElement('figure');
            figure.setAttribute('id', 'mapaDinamicoKml');
            figure.setAttribute('data-element', 'mapaDinamicoKml');
            $('[data-element="kml"]').append(figure)
        }

        // Crear límites del mapa para ajustar la vista
        var limites = new google.maps.LatLngBounds();
        var centro = {lat: 43.3672702, lng: -5.8502461};
        var map = new google.maps.Map(document.getElementById("mapaDinamicoKml"), {
            center: centro,
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        

        // recorre cada archivo seleccionado
        for (let i = 0; i < files.length; i++) {
            let archivo = files[i];
            
            // Verifica si es un archivo KML
            //var tipoKML = new RegExp(".*\.kml");
            //if (archivo.type.match(tipoKML)) 
            if(archivo.name.toLowerCase().endsWith('.kml'))
            {            
                let lector = new FileReader();
                
                lector.onload = function () {
                    var datos = lector.result;
                    
                    var coordenadas = [];

                    $('Placemark',datos).each(function(){
                        var punto = $('Point',this);
                        var coordinates = $('coordinates', punto).text().split(',');
                        var latitud = Number(coordinates[1]);
                        var longitud = Number(coordinates[0]);
                        
                        var coord = { lat: latitud, lng: longitud };

                        coordenadas.push(coord); // almacenar las coordenadas
                        var marcador = new google.maps.Marker({
                            position: coord,
                            map: map,
                            title: $('name', this).text(),
                            icon: {
                                url: "https://maps.google.com/mapfiles/ms/icons/pink-dot.png"
                            }
                        });

                        
                        limites.extend(coord);
                    });

                    // Crear una polilínea con las coordenadas almacenadas
                    var polyline = new google.maps.Polyline({
                        path: coordenadas,
                        geodesic: true,
                        strokeColor: '#FF0000',
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                    });
                    polyline.setMap(map); // Mostrar la polilínea en el mapa

                    // ajustar la vista del mapa para mostrar todos los puntos
                    map.fitBounds(limites);
                    
                };
                lector.readAsText(archivo);
            }
        }
    }


    mostrarSVG(files) {

        // recorre cada archivo seleccionado
        for (let i = 0; i < files.length; i++) {
            let archivo = files[i];

            
            // Verifica si es un archivo SVG
            //var tipoSVG = new RegExp(".*\.svg");
            //if (archivo.type.match(tipoSVG)) 
            if(archivo.name.toLowerCase().endsWith('.svg'))
            {            
                let lector = new FileReader();
                
                lector.onload = function () {
                    var datos = lector.result;
                    var img = new Image();
                    img.src = datos;
                    img.alt = "Imagen SVG " + i; // Aquí puedes definir tu descripción específica
                    $('[data-element="contenedorSVGs"]').append(img);
                };

                lector.readAsDataURL(archivo);
            }
        }
    }



}
