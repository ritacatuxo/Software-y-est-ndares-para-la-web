class Noticias {
    constructor() 
    {        
        // el navegador soporta el API File
        if (window.File && window.FileReader && window.FileList && window.Blob) 
        {
            // el navegador soporta el API file
            //document.write("<p>Este navegador soporta el API File </p>");
        }
        
        
    }
  
    readInputFile(files) 
    {
      //Solamente toma un archivo
      var archivo = files[0];

      //Solamente admite archivos de tipo texto
      var tipoTexto = /text.*/;
      if (archivo.type.match(tipoTexto)) 
      {
            var lector = new FileReader();
            lector.onload = function (evento) {
            //El evento "onload" se lleva a cabo cada vez que se completa con éxito una operación de lectura
            //La propiedad "result" es donde se almacena el contenido del archivo
            //Esta propiedad solamente es válida cuando se termina la operación de lectura


            var lineas = lector.result.split('\n');

            // si no existe, crear la sección de elementos donde van las noticias
            if (!document.querySelector("[data-element='elementos']")) {
                const sectionArchivo = $("[data-element='seleccionarArchivo']");
                sectionArchivo.after('<section data-element="elementos"></section>');

                // añadir un encabezado al elemento section con las noticias
                $("[data-element='elementos']").append("<h2>Noticias</h2>");
            }

            

            // por cada linea, sacar una noticia
            lineas.forEach(linea => {
                var noticia = linea.split("_");

                // presentación de los datos contenidos en JSON
                var infoNoticia = "<article>";
                infoNoticia += '<h3><strong>' + noticia[0] + '</strong></h3>';
                infoNoticia += "<p><strong>Subtítulo</strong>: " + noticia[1] + "</p>";
                infoNoticia += "<p><strong>Texto</strong>: " + noticia[2] + "</p>";
                infoNoticia += '<p data-element="autor"><i>' + noticia[3] + '</i></p>';
                infoNoticia += "</article>";
    
                $("[data-element='elementos']").append(infoNoticia);
            });
            }      
            lector.readAsText(archivo);
        }
        else
            errorArchivo.innerText = "Error : ¡¡¡ Archivo no válido !!!";
                 
    }


    // Método para agregar una nueva noticia
    agregarNoticia() 
    {

        
        // Obtener los valores de los inputs
        const titulo = document.querySelector("[data-element='inputTitulo']").value;
        const subtitulo = document.querySelector("[data-element='inputSubtitulo']").value;
        const texto = document.querySelector("[data-element='inputTexto']").value;
        const autor = document.querySelector("[data-element='inputAutor']").value;

        if (titulo ==="" || subtitulo === "" || texto === "" || autor === ""){
            window.alert("Por favor, introduzca todos los campos para añadir la nueva noticia");
        }
        else {

            // si no existe, crear la sección de elementos donde van las noticias
            if (!document.querySelector("[data-element='elementos']")) {
                const sectionArchivo = $("[data-element='seleccionarArchivo']");
                sectionArchivo.after('<section data-element="elementos"></section>');

                // añadir un encabezado al elemento section con las noticias
                $("[data-element='elementos']").append("<h2>Noticias</h2>");
            }
            

            // Crear HTML para la nueva noticia
            const noticia = 
                `<article>
                <h3><strong>${titulo}</strong></h3>
                <p><strong>Subtítulo</strong>: ${subtitulo}</p>
                <p><strong>Texto</strong>: ${texto}</p>
                <p data-element="autor"><i>${autor}</i></p>
                </article>`;
                

            // Agregar la nueva noticia al final del conjunto de noticias
            $("[data-element='elementos']").append(noticia);

            // Limpiar los campos de texto y textarea
            document.querySelector("[data-element='inputTitulo']").value = "";
            document.querySelector("[data-element='inputSubtitulo']").value = "";
            document.querySelector("[data-element='inputTexto']").value = "";
            document.querySelector("[data-element='inputAutor']").value = "";

        }
    }

}