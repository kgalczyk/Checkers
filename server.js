var express = require("express");
const PORT = 3000;
var app = express();
app.use(express.static('static'));
app.use(express.json());


app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

app.post("/addUser", function (req, res) {
    let user = req.body;
    const STATUS = playerManager.checkUserValidity(user);
    res.end(JSON.stringify(STATUS));
})

app.post("/playerCount", function (req, res) {
    console.log("ilu:", playerManager.users.length);
    console.log(req.body);
    const data = { "playersInGame": playerManager.users.length };
    res.end(JSON.stringify(data));
})

app.post("/position", function (req, res) {
    console.log(req.body);
    const json = req.body;
    console.log(json);
    res.end(JSON.stringify(json));
})

// Obiekt do zarządzania logowaniem, użytkownikami
let playerManager = {
    users: [],

    checkUserValidity: function (newUser) {
        if (newUser.login === "") return { status: "INVALID_NICKNAME" };
        if (this.users.length === 2) return { status: "MAX_AMOUNT_OF_PLAYERS_REACHED" };
        if (this.users.length === 1 && newUser.login == this.users[0].login) return { status: "LOGIN_ALREADY_USED" };

        this.users.push(newUser);
        console.log("obecni użytkownicy:", playerManager.users);
        console.log("ilu:", playerManager.users.length);
        return { status: "PLAYER_ADDED", player: newUser.login, pieceColor: playerManager.users.length };
    },

    findUserNameIndex: function (user) {
        for (let i in this.users)
            if (user === this.users[i]) return i;
    },
}

// Obiekt do zarządzania pozycją na planszy i przebiegiem gry
let positionManager = {
    currentPositionTable: [
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0]
    ],

    swapFields: function (x1, y1, x2, y2) {
        const temp = this.currentPositionTable[x1][y1];
        this.currentPositionTable[x1][y1] = this.currentPositionTable[x2][y2];
        this.currentPositionTable[x2][y2] = temp;
    }
}



