class Sudoku {

    constructor(boardString)
    {
        this.boardString = boardString;
        this.rows = 9;
        this.columns = 9;
        this.board = [];
        this.start(); //inicializar el tablero
    }

    start()
    {
        let index = 0;
        for (let i = 0; i < this.rows; i++) {
            const row = [];
            for (let j = 0; j < this.columns; j++) {
                if (this.boardString[index] === '.') {
                    row.push(0); // Introduce 0 en celdas vacías
                } else {
                    row.push(parseInt(this.boardString[index]));
                }
                index++;
            }
            this.board.push(row);
        }

    }

    /**
     * Crea en el documento html los párrados que representan las celdas del sudoku 
     * dentro del elemento section
     */
    createStructure()
    {
        const sectionElement = document.querySelector('[data-element="sudoku"]');

        // añadir un encabezado al elemento section con las noticias, en la primera fila
        // el titulo va de la fila 1 a la 1, y la columna de la 1 a la -1 -->

        const h2 = document.createElement('h2');
        h2.textContent = 'Sudoku';
        h2.dataset.row = 0;
        $("[data-element='sudoku']").append(h2);

        // en el resto de filas añadirlos elementos del sudoku
        // sumo 1 a las this.rows y this.columns porque el encabezado 'h2' ocupa una fila entera
        for (let i = 1; i < this.rows+1; i++) {
            for (let j = 1; j < this.columns+1; j++) {
                const paragraph = document.createElement('p');
                paragraph.dataset.row = String(i); // Convertir a cadena y establecer el atributo data-row
                paragraph.dataset.col = String(j); // Convertir a cadena y establecer el atributo data-col
                sectionElement.appendChild(paragraph);
            }
        }
    }

    /**
     * Pone dentro de cada párrafo el valor que corresponda (data-state y el número que toca)
     */
    paintSudoku()
    {
        // si no existe, crear la sección de elementos donde van las noticias
        if (!document.querySelector("[data-element='sudoku']")) {
            $("main").append('<section data-element="sudoku"></section>');
        }

        this.createStructure();
        const sectionElement = document.querySelector('[data-element="sudoku"]');
        const paragraphs = sectionElement.querySelectorAll('p');


        paragraphs.forEach((paragraph, index) => {
            const rowIndex = Math.floor(index / this.columns);
            const colIndex = index % this.columns;
            const cellValue = this.board[rowIndex][colIndex];
    
            
            if (cellValue === 0) {
                //el parrafo no tiene contenido
                this.setupEmptyCell(paragraph);
            } else {
                this.setupBlockedCell(paragraph, this.boardString[index]);
            }
        });

    }


    /**
     * Configura un párrafo cuando la celda está vacía
     * @param {HTMLElement} paragraph - El elemento <p> que representa la celda vacía
     */
    setupEmptyCell(paragraph) {
        
        paragraph.contentEditable = true; // permite editar el contenido del párrafo y que el usuario pnga el número que quiera

        // agrega un evento clic que activa la edición del contenido del párrafo
        paragraph.addEventListener('click', () => { 
            paragraph.dataset.state = 'clicked'; // estado del párrafo como "clicked"
            
            // al presionar una tecla válida, la celda pierde el foco
            paragraph.addEventListener('keydown', (event) => {
                if (!isNaN(parseInt(event.key)) && parseInt(event.key) >= 1 && parseInt(event.key) <= 9) {
                    event.preventDefault(); // Evita la inserción del número directamente en la celda editable
                    paragraph.blur(); // Pierde el foco después de escribir el número
                }
            });



        });
    }
    
    
    /**
     * Configura un párrafo para una celda bloqueada (celda no editable).
     * @param {HTMLElement} paragraph - El elemento <p> que representa una celda bloqueada
     * @param {string} value - El valor que se mostrará en la celda bloqueada
    */
    setupBlockedCell(paragraph, value) {
        paragraph.textContent = value;
        paragraph.dataset.state = 'blocked';
        paragraph.contentEditable = false;
    }





    /**
     * Método para introducir un número en la celda seleccionada. Comprueba si el número es
     * válido para la casilla que está seleccionada
     */
    introduceNumber(number) 
    {
        const selectedCell = document.querySelector('p[data-state="clicked"]');
        
        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);

        // verificar si el número es válido para la casilla seleccionada
        if (this.isValidMove(row, col, number))
        {
            this.board[row][col] = number;
            selectedCell.textContent = number; // escribe el número en la celda
            selectedCell.dataset.state = 'correct';
            selectedCell.removeEventListener('click', this.cellClickHandler);
            
            // verificar si se completó el Sudoku
            if (this.isSudokuComplete()) 
            {
                alert('¡Sudoku completado!');
            }
        } 
        else 
            alert('Número no válido para esta casilla. Intente con otro número.');
        
        selectedCell.blur() // pierde el foco después de escribir el número
        
    }

    /**
     * Verifica si el número es válido para la casilla seleccionada
     */
    isValidMove(row, col, num) {
        let a = !this.checkRow(row, num);
        let b = !this.checkColumn(col, num);
        let c = !this.checkSubgrid(row - (row % 3), col - (col % 3), num);
        return (a && b && c);
        
    }

    /** 
     * Verifica si el número ya existe en la fila
     */
    checkRow(row, num) {
        return this.board[row].includes(num);
    }

    /** 
     * Verifica si el número ya existe en la columna
     */
    checkColumn(col, num) {
        return this.board.map(row => row[col]).includes(num);
    }

    /** 
     * Verifica si el número ya existe en la sub-cuadricula 3x3
     */
    checkSubgrid(startRow, startCol, num) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[startRow + i][startCol + j] === num) {
                    return true;
                }
            }
        }
        return false;
    }

    /** 
     * Verifica si se completó el sudoku
     */
    isSudokuComplete() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] === 0) {
                    return false;
                }
            }
        }
        return true;
    }

}