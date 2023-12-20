class Crucigrama {

  // los atributos
  facil;
  medio;
  dificil;
  nivel;
  board;
  rows;
  columns;
  init_time;
  end_time;
  time;
  tablero;
  

  constructor()
  {
      this.facil = "4,*,.,=,12,#,#,#,5,#,#,*,#,/,#,#,#,*,4,-,.,=,.,#,15,#,.,*,#,=,#,=,#,/,#,=,.,#,3,#,4,*,.,=,20,=,#,#,#,#,#,=,#,#,8,#,9,-,.,=,3,#,.,#,#,-,#,+,#,#,#,*,6,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,6,#,8,*,.,=,16";
      this.medio = "12,*,.,=,36,#,#,#,15,#,#,*,#,/,#,#,#,*,.,-,.,=,.,#,55,#,.,*,#,=,#,=,#,/,#,=,.,#,15,#,9,*,.,=,45,=,#,#,#,#,#,=,#,#,72,#,20,-,.,=,11,#,.,#,#,-,#,+,#,#,#,*,56,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,12,#,16,*,.,=,32";
      this.dificil = "4,.,.,=,36,#,#,#,25,#,#,*,#,.,#,#,#,.,.,-,.,=,.,#,15,#,.,*,#,=,#,=,#,.,#,=,.,#,18,#,6,*,.,=,30,=,#,#,#,#,#,=,#,#,56,#,9,-,.,=,3,#,.,#,#,*,#,+,#,#,#,*,20,.,.,=,18,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,18,#,24,.,.,=,72";

      this.nivel = "facil";
      this.board = this.facil;
      this.rows = 11;
      this.columns = 9;
      this.init_time = null;
      this.end_time = null;
      this.time = null;
      // inicializar el tablero
      this.tablero = [];
      for (let i = 0; i < this.rows; i++) {
        this.tablero[i] = [];
      }
      this.start();
  }

  /**
   * Inicializa el array bidimensional a partir de las variables con el número de filas y el número de columnas del crucigrama
   * 
   * Si el valor en dicha cadena es numérico se vuelca el mismo número al array 
   * Si el valor en la cadena es un “.” se debe introducir el valor 0 (cero) en dicha posición del array.
   * Si el valor en la cadena es un “#” se debe introducir el valor -1 (menos uno) en dicha posición del array.
   */
  start()
  {
    // cojer los valores entre las comas
    let valores = this.board.split(',');

    let index = 0;
    for (let i = 0; i < this.rows; i++) 
    {
        for (let j = 0; j < this.columns; j++) 
        {

          const valor = valores[index];

          // valor numérico - que pasa si es *, +, -, =...????              
          if (!isNaN(valor)) {
            this.tablero[i][j] = parseInt(valor);
          }
          // celdas vacias
          else if (valor === '.') 
          {
            this.tablero[i][j] = 0;
          } 
          // celdas que no se utilizan - deshabilitadas
          else if (valor === '#') 
          {
            this.tablero[i][j] = -1;
          }
          else // * + - =
          {
            this.tablero[i][j] = valor;
          }
          index++;

        }
    }
  }

  /**
   * Crea en el documento HTML, a través de jQuery, los párrafos que representarán las celdas del crucigrama
   */
  paintMathword()
  {
    const sectionElement = $('[data-element="crucigrama"]'); // obtener el elemento <section data-element="crucigrama"> del HTML

    for (let i = 0; i < this.rows; i++) 
    {
      for (let j = 0; j < this.columns; j++) 
      {
        const cellValue = this.tablero[i][j];

        const paragraph = $('<p>'); // Crear un párrafo para representar la celda

        if (cellValue === 0) 
        {
          this.setupEmptyCell(paragraph);
          // Manejar el evento click usando jQuery
          paragraph.on('click', function () {
              $(this).attr('data-state', 'clicked');
              //$(this).attr('row', String(i));
              //$(this).attr('column', String(j));
          });
        } 
        else 
        {
          if (cellValue === -1) 
            paragraph.attr('data-state', 'empty');
          else // si el valor es un número positivo, mostrarlo y establecer el atributo data-state a blocked
            paragraph.text(cellValue).attr('data-state', 'blocked');
        }

        

        sectionElement.append(paragraph); // Agregar el párrafo al elemento <data-element="crucigrama">
      }
    }

    this.init_time = new Date(); // Inicializar init_time con la fecha actual
  }



  setupEmptyCell(paragraph) {
        
    paragraph.contentEditable = true; // permite editar el contenido del párrafo y que el usuario pnga el número que quiera


    // Manejar el evento click usando jQuery
    paragraph.on('click', function () {
      $(this).attr('data-state', 'clicked');
    });
    
}

  
  
  check_win_condition() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.tablero[i][j] === 0) {
          return false; 
        }
      }
    }
    
    return true; 
  }

 

calculate_date_difference() 
{
    if (this.init_time && this.end_time) 
    {
        const timeDifference = this.end_time - this.init_time; // Calcula la diferencia en milisegundos
        const hours = Math.floor(timeDifference / 3600000); // Calcula las horas
        const minutes = Math.floor((timeDifference % 3600000) / 60000); // Calcula los minutos
        const seconds = Math.floor((timeDifference % 60000) / 1000); // Calcula los segundos

        // Formatea el tiempo en el formato "horas:minutos:segundos"
        const formattedTime = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
        this.time = formattedTime;
    } else {
        this.time = '00:00:00'; // Devuelve 0 si no hay tiempos inicial o final establecidos
}
}

  // Método para rellenar con cero si el tiempo es menor que 10 (para formato hh:mm:ss)
  pad(value) 
  {
    return value < 10 ? `0${value}` : value;
  }
    
    
  introduceElement(value) 
  {
    // AÑADE ESTO
    // selectedCell.removeEventListener('click', this.cellClickHandler);

    // Variables para comprobar la expresión horizontal y vertical
    let expressionRow = true;
    let expressionCol = true;

    // posición de la celda seleccionada
    const selectedCell = document.querySelector('p[data-state="clicked"]');
    //const row = parseInt($(selectedCell).attr('row'));
    //const column = parseInt($(selectedCell).attr('column'));


    const selectedCellIndex = $('[data-element="crucigrama"] p').index(selectedCell);
    const row = Math.floor(selectedCellIndex / this.columns);
    const column = selectedCellIndex % this.columns;

    const cellValue = this.tablero[row][column];

    // original and new value
    const originalValue = this.tablero[row][column];
    this.tablero[row][column] = value;

    // comprobar si hay expresión horizontal
    let foundHorizontalExpression = false;

    // EXPRESIÓN HORIZONTAL
    if (this.tablero[row][column + 1] !== -1)  // celda negra
    {
        // vamos avanzando celda a celda para encontrar el primer "="
        for (let i = column + 1; i < this.columns; i++) {
          if (this.tablero[row][i] === '=') 
          {
            foundHorizontalExpression = true;

            // valores de la expresión horizontal
            const firstNumber = parseInt(this.tablero[row][i - 3]); // primer operando
            const expression = this.tablero[row][i - 2]; // operador aritmético
            const secondNumber = parseInt(this.tablero[row][i - 1]); // segundo operando
            const result = parseInt(this.tablero[row][i + 1]); //resultado de la expresión

            // las variables son distintas de 0
            if(firstNumber !== 0 && expression !== 0 && secondNumber !== 0 && result !== 0)
            {
              // evaluar la expresión horizontal
              const expressionToEvaluate = [firstNumber, expression, secondNumber].join('');
              const evaluatedExpression = eval(expressionToEvaluate);
              if (result !== evaluatedExpression)
                expressionRow = false;
            }
            break;
          }
        }
    }
    
    // EXPRESIÓN VERTICAL
    let foundVerticalExpression = false;

    if (this.tablero[row + 1] && this.tablero[row + 1][column] !== -1) 
    {
      // vamos avanzando celda a celda para encontrar el primer "="
      for (let i = row + 1; i < this.rows; i++) {
        if (this.tablero[i][column] === '=') 
        {
          foundVerticalExpression = true;

          // valores de la expresión vertical
          const firstNumber = parseInt(this.tablero[i - 3][column]); // primer operando
          const expression = this.tablero[i - 2][column]; // expresion
          const secondNumber = parseInt(this.tablero[i - 1][column]); // segundo operando
          const result = parseInt(this.tablero[i + 1][column]); // resultado de la expresión

          // las variables son distintas de 0
          if(firstNumber !== 0 && expression !== 0 && secondNumber !== 0 && result !== 0)
          {
            // evaluar la expresión vertical
            const expressionToEvaluate = [firstNumber, expression, secondNumber].join('');
            const evaluatedExpression = eval(expressionToEvaluate);
            if (result !== evaluatedExpression)
              expressionCol = false;
          }
          break;
        }
      }
    }

    // Verificar si las variables expression_row y expression_col son true (ambas variables)
    
    const cellToUpdate = $('[data-element="crucigrama"] p').eq(row * this.columns + column);
    if (expressionRow && expressionCol) 
    {      
      cellToUpdate.text(value);
      cellToUpdate.attr('data-state', 'correct');

      // verificar si se ha completado el crucigrama
      if (this.check_win_condition()) {
        this.end_time = new Date();
        this.calculate_date_difference();
        const timeTaken = this.time;
        
        this.bloquearTablero(); //bloquear el crucigrama

        // mostrar la alerta y el formulario después de medio segundo
        setTimeout(() => {
          alert(`¡Has completado el crucigrama en ${timeTaken}!`);
          this.createRecordForm(); // mostrar el formulario
        }, 500); 

        
    }
    } else {
      this.tablero[row][column] = 0;
      cellToUpdate.text('');
      cellToUpdate.attr('data-state', 'blocked');
      alert('El elemento introducido no es correcto para la casilla seleccionada.');
    }

    
  }

  /**
   * BLoquea el tablero cuando el usuario completa el crucigrama
   */
  bloquearTablero()
  {
    const sectionElement = $('[data-element="crucigrama"]');
    sectionElement.find('p').off('click'); // deshabilitar eventos clic
  }


  // FORMULARIO PHP (cuando acaba el crucigrama)
  createRecordForm()
  {

    let formHTML = 
      `<section data-element='formulario'>
      <form action='#' method='post' name='record'>
        <h2>Formulario</h2>
        <label for="nombre">Nombre:</label>
        <input id="nombre" required type='text' name='nombre'/>
        
        <label for="apellidos">Apellidos:</label>
        <input id="apellidos" required type='text' name='apellidos'/>
        
        <label for="nivel">Nivel:</label>
        <input id="nivel" type='text' name='nivel' value='${this.nivel}' readonly/>
        
        <label for="tiempo">Tiempo:</label>
        <input id="tiempo" type='text' name='tiempo' value='${this.time}' readonly/>
        
        <input type='submit' name="enviar" value='Enviar'/>
      </form>
      </section>`;


    $("[data-element='crucigrama']").after(formHTML);
    
  }







}

