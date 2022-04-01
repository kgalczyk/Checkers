class Ui {
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

    welcomeUser(userName, pieceColor) {
        console.log(pieceColor);
        // decycja o kolorze bierek
        if (pieceColor == 1) pieceColor = "białymi";
        else {
            pieceColor = "czarnymi";
            this.setCameraOnBlackPieces();
        }

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

    removeLoginPage() {
        let scene = document.getElementById("scene");
        scene.removeChild(document.getElementById("login-scene"));

        // stworzenie bierek
        gameManager.game.createPieces();
        gameManager.raycaster = new Raycaster();
    }

    setCameraOnBlackPieces() {
        gameManager.game.camera.position.set(0, 90, 180); // czarne
        gameManager.game.camera.lookAt(gameManager.game.scene.position);
        gameManager.game.camera.updateProjectionMatrix();
    }
}