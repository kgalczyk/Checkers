class Net {
    constructor() {
        console.log("stworzono obiekt Net");
        this.player = "";
        this.dotsCounter = 0;
    }

    // Metoda wysyła login użytkownika do serwera w celu zweryfikowania jego poprawności
    async sendUserData() {
        // Przygotowanie danych do fetcha
        const data = { "login": document.getElementById("login").value }

        // Przypisanie nazwy użytkownika
        gameManager.net.player = data.login;
        const options = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }

        // Fetch 
        let json = await gameManager.net.fetchAsync(options, "/addUser");
        console.log(json);

        gameManager.net.checkUserCount(json.player);
        // Wyświetlenie statusu uzyskanego z serwera
        gameManager.ui.displayLoginStatusResponse(json);

        // Return jeśli nick gracza nie został podany
        if (json.player === undefined) return;

        // I wyświetlamy powitanie gracza na stronie
        gameManager.ui.welcomeUser(json.player, json.pieceColor);
    }

    // Metoda, która wysyła zapytanie o liczbę graczy w grze do serwera
    async checkUserCount(player) {
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

    async sendNewPosition(oldPosition, newPosition) {

    }

    // fetch asynchroniczny 
    async fetchAsync(options, url) {
        let response = await fetch(url, options);
        if (!response.ok) return response.status;
        else return await response.json(); // response.json
    }

}