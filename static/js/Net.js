class Net {
    pieceColor; // biały - 1 lub czarny - 2
    color; // biały - true lub czarny - false
    whoseTurn = true;
    constructor() {
        console.log("stworzono obiekt Net");
        this.player = "";
        this.dotsCounter = 0;
    }

    // Metoda wysyła login użytkownika do serwera w celu zweryfikowania jego poprawności
    sendUserData = async () => {
        // Przygotowanie danych do fetcha
        const data = { "login": document.getElementById("login").value }
        const options = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }

        // Fetch 
        let json = await gameManager.net.fetchAsync(options, "/addUser");

        // Wyświetlenie statusu uzyskanego z serwera
        gameManager.ui.displayLoginStatusResponse(json);

        // Return jeśli nick gracza nie został podany
        if (json.player === undefined) return;

        this.checkUserCount(json.player);

        // Przypisanie nazwy użytkownika
        gameManager.net.player = data.login;

        // Zapisanie koloru bierek gracza
        this.pieceColor = json.pieceColor;
        this.color = json.color;

        // I wyświetlamy powitanie gracza na stronie
        gameManager.ui.welcomeUser(json.player, json.color, json.pieceColor);
    }

    // Metoda, która wysyła zapytanie o liczbę graczy w grze do serwera
    checkUserCount = async (player) => {
        gameManager.interval = setInterval(async function () {
            // kropki w innerHTML-u waiting screen-u
            gameManager.net.dotsCounter++;
            let dots = gameManager.net.dotsCounter % 3;

            // Jeśli serwer nie odeśle nicku z powodu pustego nicku, powielonego nicku bądź trzeciego wprowadzonego gracza do rozgrywki, wychodzimy z funkcji :)
            if (player === undefined) return;

            const options = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ player: gameManager.net.player })
            }

            // Fetch zwracający liczbę graczy na serwerze
            let json = await gameManager.net.fetchAsync(options, "/playerCount");
            console.log(json);

            //
            gameManager.playerCount = json.playersInGame;
            if (gameManager.playerCount === 1) gameManager.ui.displayWaitingScreen(dots);
            else if (gameManager.playerCount === 2) {
                clearInterval(gameManager.interval);
                gameManager.ui.removeLoginPage();
            }
        }, 500);
    }

    sendNewPosition = async (oldPosition, newPosition, piecePosition, fieldPosition) => {
        const body = {
            old: oldPosition,
            new: newPosition,
            start: piecePosition,
            target: fieldPosition,
            who: this.color
        }

        const options = {
            method: 'POST',
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body)
        }

        // wysłanie pozycji sprzed i po ruchu
        // w odpowiedzi to samo, żeby uaktualnić planszę u obu graczy 
        let json = await gameManager.net.fetchAsync(options, "/position");

        // klient w sumie nie potrzebuje tych danych z powrotem :(
        console.log(json);
    }

    waitForChange = async () => {
        const options = {
            method: 'POST',
            headers: { "content-type": "application/json" },
        }
        let json = await this.fetchAsync(options, "/change");

        console.log(this.color, json.whoseTurn);
        if (this.color !== json.whoseTurn) gameManager.ui.displayOpponentTurnScreen();

        // aktualizacja tury
        this.whoseTurn = json.whoseTurn;
        gameManager.net.whoseTurn = json.whoseTurn;
        gameManager.raycaster.whoseTurn = json.whoseTurn;

        // wykonanie ruchu
        if (json.target !== 0) {
            gameManager.game.handleNewMove(json.start, json.target);
            gameManager.game.swap(json.old, json.new);
            if (gameManager.ui.infoShowed) gameManager.ui.displayGameTable();
        }
    }

    lose = () => {
        console.log("lose");
    }

    // fetch asynchroniczny 
    async fetchAsync(options, url) {
        let response = await fetch(url, options);
        if (!response.ok) return response.status;
        else return await response.json(); // response.json
    }

} 