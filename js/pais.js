
class Pais {

    constructor(ciudad, capital, poblacion) 
    {
        this.nombre = ciudad
        this.capital = capital
        this.poblacion = poblacion

        this.unidades = "metric";
        this.idioma = "es";
        this.codigoPais = "PT";
    }

    /**
     * Rellena el valor del resto de atributos existentes.
     */
    completarInformacion(formaDeGobierno, latitud, longitud, religionMayoritaria)
    {
        this.formaDeGobierno = formaDeGobierno;
        this.latitud = latitud;
        this.longitud = longitud;
        this.religionMayoritaria = religionMayoritaria;
    }

    
    // getters - devueleven la infromación principal de país

    getNombre()
    {
        return this.nombre;
    }

    getCapital()
    {
        return this.capital;
    }


    // información secundaria del país (población, forma de gobierno y religión mayoritaria) 
    printInformacionSecundaria()
    {
        document.write("<p>Poblacion: " + this.poblacion + "</p>")
        document.write("<p>Forma de gobierno: " + this.formaDeGobierno + "</p>")
        document.write("<p>Religión mayoritaria: " + this.religionMayoritaria + "</p>")
    }


    // escriba en el documento la información de coordenadas de la capital del país
    escribirCoordenadas()
    {
        document.write(" Latitud = " + this.latitud);
        document.write(", Longitud = " + this.longitud);
    }

    cargarDatos()
    {
        const apikey = "02f5c452f56b01f5d8b6a72ae496a581";
        const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${this.latitud}&lon=${this.latitud}&appid=${apikey}&units=${this.unidades}&lang=${this.idioma}`;


        // si no existe, crear la sección de elementos donde van los tiempos
        if (!document.querySelector("[data-element='elementos']")) {
            $("body").append('<section data-element="elementos"></section>');
        }
        
        // añadir encabezado
        const h2 = document.createElement('h2');
        h2.textContent = `Tiempo meteorológico - ${this.nombre}`;
        $("[data-element='elementos']").append(h2);

        $.ajax({
            dataType: "json",
            url: url,
            method: 'GET',
            success: function(datos)
            {
                
                // ya que devuelve 41, de 8 en 8 para elegir 5
                for (let i = 0; i < datos.list.length; i+=8) 
                {
                    //icono
                    var icono = datos.list[i].weather[0].icon;
                    var imagen = "https://openweathermap.org/img/w/" + icono + ".png";

                    // cantidad de lluvia del dia
                    let cantidadLluvia = '';

                    if(datos.list[i].rain) // si ha llovido
                        cantidadLluvia = datos.list[i].rain["3h"];
                    else // si no ha llovido
                        cantidadLluvia = '0';

                    // presentación de los datos contenidos en JSON
                    var infoTiempo = "<article>"; // article no valida sin un encabezado antes...
                        infoTiempo += "<img data-element='img_derecha' src=\"" + imagen + "\" alt=\"Icono del tiempo\"/>";
                        infoTiempo += "<p data-element = 'descripcionTiempo'>" + datos.list[i].weather[0].description + "</p>";
                        infoTiempo += "<h3>" + new Date(datos.list[i].dt *1000).toLocaleDateString() + "</h3>";
                        infoTiempo += "<p><strong>Temperatura máxima</strong>: " + datos.list[i].main.temp_max + " grados Celsius</p>";
                        infoTiempo += "<p><strong>Temperatura mínima</strong>: " + datos.list[i].main.temp_min + " grados Celsius</p>";
                        infoTiempo += "<p><strong>Humedad</strong>: " + datos.list[i].main.humidity + " %</p>";
                        infoTiempo += "<p><strong>Velocidad del viento</strong>: " + datos.list[i].wind.speed + " metros/segundo</p>";
                        infoTiempo += "<p><strong>Cantidad de lluvia</strong>: " + cantidadLluvia + "</p>";
                        infoTiempo += "</article>";
                    
                    $("[data-element='elementos']").append(infoTiempo);
                }
            },
            error:function(){
                $("h3").html("¡Tenemos problemas! No puedo obtener JSON de <a href='http://openweathermap.org'>OpenWeatherMap</a>"); 
                $("h4").remove();
                $("pre").remove();
                $("p").remove();
            }
        });
    }

    /**
     * Muestra el archivo JSON recibido
     */
    verJSON()
    {
        this.cargarDatos();
        $("button").attr("disabled","disabled");
    }
}

