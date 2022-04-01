// warcaby:
//     problemy do pokonania:
//          1. poruszanie bierek po skosie, po opuszczeniu bierki automatyczne ustawienie jej
//             na najbliższe, sąsiednie do wyjściowego, czarne pole [jeśli znajduje się dosyć blisko],
//          2. zbijanie, czyli ruch o dwa pola nad bierką przeciwnika
//          3. przymus bicia, jeśli bicie jest możliwe
//          4. funkcje + fetch, które ogarną zmianę pozycji na planszy dla obu graczy
//          5. przemiana w hetmana na ósmej linii -> ruch hetmana

class Game { // Klasa generuje planszę do gry oraz posiada metodę tworzącą bierki.
    constructor() {
        console.log("stworzono obiekt Game");
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0xaa00ff);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("root").append(this.renderer.domElement);

        // Moment stworzenia bierek jest potrzebny do odpalenia funkcji, która rusza figury.
        this.piecesCreated = false;

        this.camera.position.set(0, 90, -180); // Punkt widzenia bierek białych
        this.camera.lookAt(this.scene.position);
        this.axes = new THREE.AxesHelper(1000);
        this.scene.add(this.axes);

        // Tablica zawiera wartości reprezentujące kolory pól szachownicy ( 1 - czarne pole, 0 - białe pole).
        this.gameTable = [
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
        ]
        this.createBoard(); // Stworzenie pól szachownicy

        // Tablica jest początkowym ułożeniem bierek, jedynki to bierki białe, dwójki to bierki czarne.
        this.pieces = [
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0]
        ]

        this.render() // Wywołanie metody render

    }

    // Metoda tworząca planszę do gry
    createBoard() {
        this.fieldsObjects = [];

        for (let i = -4; i < 4; i++) {
            for (let j = -4; j < 4; j++) {
                if (this.gameTable[i + 4][j + 4] == 1) {
                    this.field = new Field('textures/blackField.jpg');
                    // Dodanie informacji o kolorze pola 
                    this.field.userData.fieldColor = 1;
                } else {
                    this.field = new Field('textures/whiteField.png');
                    // Dodanie informacji o kolorze pola 
                    this.field.userData.fieldColor = 0;
                }

                // Ustawienia pozycji pola wg algorytmu: ilość kroków od środka osi (i lub j) * półtora szerokości (width) lub głębi (depth) pola szachownicy
                this.field.position.x = (i + 0.5) * this.field.geometry.parameters.width; // Wartość szerokości pola jest pobierana z 
                this.field.position.z = (j + 0.5) * this.field.geometry.parameters.depth;// Pola geometry obiektu stworzonego przez THREEjs

                // Dodanie elementu do sceny oraz do tablicy przechowującej kolejne pola.
                this.scene.add(this.field);
                this.fieldsObjects.push(this.field);
            }
        }
    }

    // Metoda tworząca bierki w początkowym ułożeniu
    createPieces() {
        this.piecesObjects = [];
        this.piece = '';

        for (let i = -4; i < 4; i++) {
            for (let j = -4; j < 4; j++) {
                if (this.pieces[i + 4][j + 4] === 1) this.piece = new Piece(0xffffff, 'textures/whitePiece.jpg', this.pieces[i + 4][j + 4]); // Nową bierkę tworzy klasa Piece pobierająca za parametry kolor tekstury i ścieżkę do pliku tekstury.
                else if (this.pieces[i + 4][j + 4] === 2) this.piece = new Piece(0x4455aa, 'textures/blackField.jpg', this.pieces[i + 4][j + 4]);
                else continue;

                // Dodanie elementu do sceny
                gameManager.game.scene.add(this.piece);
                // Dodanie elementu do tablicy bierek
                this.piecesObjects.push(this.piece);

                const parameters = this.fieldsObjects[this.piecesObjects.length - 1].geometry.parameters; // Pobranie wymiarów fielda
                this.piece.position.set((j + 0.5) * parameters.width, 3.5, (i + 0.5) * parameters.depth); // Bierkę należy stosownie ustawić -> obliczamy odstęp podobnie jak z polami szachownicy
            }
        }
        this.piecesCreated = true;
    }

    resizeRenderer() {
        // W przypadku zmniejszenia, zwiększenia, rozszerzenia czy zwężenia okna jest ustawiana ponownie kamera i renderer
        gameManager.game.camera.aspect = window.innerWidth / window.innerHeight;
        gameManager.game.camera.updateProjectionMatrix();
        gameManager.game.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render = () => {
        requestAnimationFrame(this.render);
        TWEEN.update();
        this.renderer.render(this.scene, this.camera);
    }
}

