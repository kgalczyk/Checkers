let gameManager = {
    game: '',
    net: '',
    ui: '',
    raycaster: '',
    playerCount: 0,
    interval: "",
}

window.onload = () => {
    gameManager.game = new Game();
    gameManager.net = new Net();
    gameManager.ui = new Ui();
    document.getElementById("login-button").onclick = gameManager.net.sendUserData;
    document.getElementById("reset").onclick = gameManager.ui.resetNickname;
    window.onresize = gameManager.game.resizeRenderer;
}
