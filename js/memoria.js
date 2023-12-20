class Memoria 
{

    constructor()
    {
        this.cards = [
            { element: "HTML5", source: "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg"},
            { element: "HTML5", source: "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg"},
            { element: "CSS3", source: "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg"},
            { element: "CSS3", source: "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg"},
            { element: "JS", source:  "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg"},
            { element: "JS", source:  "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg"},
            { element: "PHP", source: "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg" },
            { element: "PHP", source: "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg" },
            { element: "SVG", source: "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg" },
            { element: "SVG", source: "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg" },
            { element: "W3C", source: "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg" },
            { element: "W3C", source: "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg" }];

        this.hasFlippedCard = false; 
        this.lockBoard = false; 
        this.firstCard = null;           
        this.secondCard = null;

        this.shuffleElements();
        this.createElements();
        this.addEventListeners();
        this.guessedPairs = 0; //contador de parejas reveladas
    }



    /**
     * Coge el objeto de JSON y utilizando el algoritmo Durstenfeld baraja los elementos
     */
    shuffleElements()
    {
        for (let i = this.cards.length - 1; i > 0; i--) // recorrer el array desde el final hasta el principio
        { 
            const j = Math.floor(Math.random() * (i + 1)); // para cada elemento se genera un índice aleatorio entre el inicio del array y el índice actual
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]; // se intercambia el elemento en la posición actual con el elemento en el índice aleatorio generado
        }
    }

    /**
     * Bloquea el tablero en primer lugar y luego voltea las cartas que estén bocarriba y resetea el tablero
     * Voltea las tarjetas cuando termina la interacción del usuario (por cada pareja que descubre, no al final del juego)
     */
    unflipCards()
    {
        // bloquear el tablero
        this.lockBoard = true;

        // voltear cartas que estén boca arriba y resestea el tablero
        setTimeout(() => {
            // eliminar el atributo data-state ya que la carta ya no va a estar flipped
            delete this.firstCard.dataset.state;
            delete this.secondCard.dataset.state;
            
            this.firstCard = null;
            this.secondCard = null;
            this.resetBoard();
          }, 1500);
    }

    resetBoard()
    {
        this.hasFlippedCard = false; 
        this.lockBoard = false; 
        this.firstCard = null;           
        this.secondCard = null; 
    }

    /**
     *  Comprueba si las cartas volteadas son iguales
     */
    checkForMatch()
    {
        const coinciden = this.firstCard.dataset.element === this.secondCard.dataset.element;
        coinciden ? this.disableCards() : this.unflipCards();
    }

    /**
     * Deshabilita las interacciones sobre las tarjetas de memoria que ya han sido emparejadas
     */
    disableCards()
    {
        this.guessedPairs++;
        //modificamos el valor del atributo data-state
        this.firstCard.dataset.state = 'revealed';
        this.secondCard.dataset.state = 'revealed';

        this.resetBoard()
        this.isGameComplete();
    }

    /**
     *  Recorre el JSON y por cada elemento crea un nodo article en el html para representar cada tarjeta deljuego de memoria
     */
    createElements()
    {
        const section = document.querySelector('section[data-element="memoria"]');
        

        this.cards.forEach(card => 
        {
            // elemento article con atributo “data-element” = el valor de la variable element del JSON
            const article = document.createElement('article');
            article.setAttribute('data-element', card.element);
      
            // h3 con el texto “Tarjeta de memoria” (se visualizara cuando la tarjeta este bocabajo)
            const heading = document.createElement('h3');
            heading.textContent = 'Tarjeta de memoria';
      
            // elemento img
            const image = document.createElement('img');
            image.src = card.source;
            image.alt = card.element;
      
            article.appendChild(heading);
            article.appendChild(image);
      
            section.appendChild(article);
        });
    }

    /**
     * Se encarga de dar la vuelta a las tarjetas cuando son pulsadas por el usuario
     */
    flipCard(instance) {
        // comprobaciones
        if(this.dataset.state === 'revealed' || instance.lockBoard || this === instance.firstCard)
            return;

        this.dataset.state = 'flip';
        
        // comprobar si ya hay una tarjeta volteada
        if(instance.hasFlippedCard)
        {
            //instance.lockBoard = true;
            instance.secondCard = this;
            instance.checkForMatch();
        }
        else
        {
            instance.hasFlippedCard = true;
            instance.firstCard = this;
        }

        
    }

    /**
     * Si todas las tarjetas están volteadas y el juego está correctamente resuelto, lo termina
     */
    isGameComplete()
    {
        
        if(this.guessedPairs === 6)
        {
            setTimeout(() => {
                alert('¡Juego resuelto!');
              }, 1000);
            //alert('¡Juego resuelto!');
            this.lockBoard = true;
        }
    }

    /**
    * Añade a todas las tarjetas el evento de que cuando el usuario las pinche se volteen
    */ 
    addEventListeners()
    {
        const articles = document.querySelectorAll('section[data-element="memoria"] article');
        
        articles.forEach(article => {
            article.addEventListener('click', this.flipCard.bind(article, this));
        });
    }

}
