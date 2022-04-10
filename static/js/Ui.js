class Ui {
    interval;
    pieceColor;
    constructor() {
        console.log("stworzono obiekt UI");
    }

    displayLoginStatusResponse(data) {
        // element z odpowiedzią serwera
        let serverResponseStatus = document.createElement("h1");
        serverResponseStatus.id = "status";
        serverResponseStatus.innerHTML = data.status; // wyświetla komunikat, czy dodano użytkownika do gry

        // dodanie elementu do dokumentu
        document.getElementById("scene").appendChild(serverResponseStatus);
    }

    resetNickname() {
        document.getElementById("login").value = "";
    }

    welcomeUser(userName, pieceColor, color) {
        console.log(pieceColor);
        // decycja o kolorze bierek
        if (pieceColor == 1) pieceColor = "białymi";
        else {
            pieceColor = "czarnymi";
            this.setCameraOnBlackPieces();
        }

        this.pieceColor = color;

        // element z nickiem gracza
        let userNameWelcome = document.createElement("h2");
        userNameWelcome.id = "user-welcome";
        userNameWelcome.innerHTML = `Witaj <span style="color:purple">${userName}</span>, grasz ${pieceColor}`;

        // dodanie elementu do dokumentu
        document.getElementById("scene").appendChild(userNameWelcome);
    }

    displayWaitingScreen(dotsNumber) {
        const loginScene = document.getElementById("login-scene");
        loginScene.innerHTML = "";

        let waitingScreen = document.createElement("div");
        waitingScreen.id = "wait";
        waitingScreen.classList.add('wait');

        let dots = "";
        for (let i = 0; i <= dotsNumber; i++)
            dots += ".";

        waitingScreen.innerHTML = "waiting for second player" + dots;

        // dodanie elementu do dokumentu
        loginScene.appendChild(waitingScreen);
    }

    removeLoginPage = () => {
        let scene = document.getElementById("scene");
        scene.removeChild(document.getElementById("login-scene"));

        // stworzenie bierek
        gameManager.game.createPieces();

        // Stworzenie raycastera
        gameManager.raycaster = new Raycaster(gameManager.game.piecesObjects, gameManager.game.fieldsObjects, this.pieceColor);

        // Rozpoczęcie wysyłania zapytania o nową pozycję
        this.interval = setInterval(() => { gameManager.net.waitForChange() }, 1000);
    }

    setCameraOnBlackPieces() {
        gameManager.game.camera.position.set(0, 90, 180); // czarne
        gameManager.game.camera.lookAt(gameManager.game.scene.position);
        gameManager.game.camera.updateProjectionMatrix();
    }
}