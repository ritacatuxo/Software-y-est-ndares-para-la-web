class Libreria {

    // metodo para que todos los botones de cargar datos a la base de datos se deshabiliten cuando se hayan metido los datos
    deshabilitarBotonesAutores()
    {
        const button1 = document.querySelector('[name="autores_csv"]');
        button1.disabled = true; 
        const button2 = document.querySelector('[name="cargarAutores"]');
        button2.disabled = true; 

    }
}

let libreria = new Libreria();