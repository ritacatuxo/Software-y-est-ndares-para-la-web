class Agenda {

    constructor()
    {
        this.url = "http://ergast.com/api/f1/2023";
        this.last_api_call = null; //momento de la última petición a la API
        this.last_api_result = null; // última respuesta de la API
    }

 
    cargarDatosCarreras()
    {
        // si no existe, crear la sección de elementos donde van las carreras
        if (!document.querySelector("[data-element='elementos']")) {
            $("body").append('<section data-element="elementos"></section>');
        }
        
        // añadir encabezado
        const h3 = document.createElement('h3');
        h3.textContent = 'Carreras Fórmula 1 - 2023';
        $("[data-element='elementos']").append(h3);



        $.ajax({
            dataType: "xml",
            url: this.url,
            method: 'GET',
            success: function(datos){
                
                const races = $(datos).find('Race'); // todas las carreras
                races.each(function (index) 
                {

                    //Extracción de los datos contenidos en el XML
                    var carrera = $(this).find('RaceName').text(); // Nombre de la carrera
                    var p_circuito = $(this).find('CircuitName').text(); // Nombre del circuito donde se celebra
                    var longitud = $(this).find('Location').attr("long"); // Coordenadas del circuito
                    var latitud= $(this).find('Location').attr("lat"); // Coordenadas del circuito
                    var fecha = $(this).find('Date').first().text(); // fecha del circuito
                    var hora = $(this).find('Time').first().text(); // hora del circuito
                    hora = hora.replace(":00Z", "")

                    var article = $("<article>");
                    var p_nombreCarrera = $("<h3>").html("<strong>" + carrera + "</strong>");
                    var p_circuito = $("<p>").html("<strong>Circuito</strong>: " + p_circuito);
                    var p_localizacion = $("<p>").html("<strong>Localización:</strong> (longitud, latitud) (" + longitud + ", " + latitud + ")");
                    var p_fecha = $("<p>").html("<strong>" + fecha + "</strong>");
                    var p_hora = $("<p>").html("<strong>" + hora + "</strong>");

                    article.append(p_fecha);
                    article.append(p_hora);
                    article.append(p_nombreCarrera);
                    article.append(p_circuito);
                    article.append(p_localizacion);

                    $("[data-element='elementos']").append(article);
                    
                    // línea separadora
                    if (index !== races.length - 1)
                    {
                        var hrElement = $("<hr>");
                        $("[data-element='elementos']").append(hrElement);
                    }
                });            
                
            },
            error:function(){
                $("h3").html("¡Tenemos problemas! No puedo obtener XML de <a href='http://ergast.com/api/f1/2023'>Ergast</a>");
            }
        });
    }

    borrarDatosCarreras()
    {
        const sectionCarreras = $("[data-element='elementos']");
        sectionCarreras.remove();
    }

    /**
     * @returns true si puedo llamar a la api, false en el caso contrario
     */
    puedoLlamarApi()
    {
        // si es null (primera llamada) puedo llamar
        if(this.last_api_call === null)
            return true;
        
        let ahora = new Date();
        const diferenciaMilis = Math.abs(ahora.getTime() - this.last_api_call.getTime()); // diferencia en milisegundos
        const diferenciaMins = Math.floor(diferenciaMilis / (1000 * 60)); // diferencia en minutos

        // si han pasado más de 10 minutos, puedo llamar
        if(diferenciaMins > 10)
            return true;
        else
            return false;
    }


    /**
     * Muestra el archivo JSON recibido
     */
    verJSON()
    {
        // si es la primera vez o han pasado 10mi desde la ultima llamada, llamo a la API
        if(this.puedoLlamarApi())
        {
            // guardar el momento temporal
            this.last_api_call = new Date();
            this.cargarDatosCarreras();
        }
        // sino, muestro la información que ya tengo guardada
        else
            this.last_api_result = $("[data-element='elementos']").html();
        
    }

}