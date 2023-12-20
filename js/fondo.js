
class Fondo 
{

    constructor(pais, capital, longitud, latitud)
    {
        this.pais = pais;
        this.capital = capital;
        this.longitud = longitud;
        this.latitud = latitud;
    }

    /**
     * Realiza una consulta AJAX a la API de Flickr (de talforma que contestes enformato JSON) para 
     * obtener una imagen del país
     */
    consultaAJAX()
    {
        const apiKey = "240c95cb141fb9211e90adab62c6e993";
        //const secreto = "7409560e376c9c12";
        // URL de la solicitud a la API de Flickr
        var flickrAPIUrl = "https://www.flickr.com/services/rest/";


        $.getJSON(flickrAPIUrl, 
            // parametros que necesita la url
            {
                method: 'flickr.photos.search',
                api_key: apiKey,
                lat: this.latitud,
                lon: this.longitud,
                tags: this.capital,
                tagmode: "any",
                format: "json",
                nojsoncallback: 1
            })
        .done(function(data) {
            // verificar si se encontraron fotos
            if (data.photos && data.photos.photo.length > 0) {
                //cojer una imagen random entre la primera y la numero 25
                const num = Math.floor(Math.random() * 25) + 1

                // SErver, ID y secret de la primera foto
                const photoServer = data.photos.photo[num].server;
                const photoId = data.photos.photo[num].id;
                const photoSecret = data.photos.photo[num].secret;

                // Construir la URL de la imagen utilizando el ID de la foto
                const photoURL = `https://live.staticflickr.com/${photoServer}/${photoId}_${photoSecret}_b.jpg`;

                // Aplicar la imagen como fondo de pantalla
                $('body').css({
                    'background-image': `url('${photoURL}')`,
                    'background-size': 'cover'
                });
            } else {
                console.log('No se encontraron fotos para la capital.');
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
                console.log('Error al realizar la solicitud:', textStatus, errorThrown);
        });

    }

}