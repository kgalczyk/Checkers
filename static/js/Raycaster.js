class Raycaster {
    raycaster;
    mouseVector;
    mouseMove;
    intersects;

    piece; // pole na obecnie podniesioną bierkę
    pieces; // tablica obiektów bierek rodem z Game'a
    fields; // tablica obiektów pól rodem z Game'a

    // kolory figur
    heldPiecesColor; // żółty bądź czerwony w hexie
    originalPieceColor; // biały bądź czarny w hexie

    // kolor pola (1 - biały lub 2 - czarny)
    piecesColor;
    whoseTurn = true;
    color;

    constructor(pieces, fields, piecesColor) {
        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2();
        this.mouseMove = new THREE.Vector2();
        this.intersects = [];
        this.piece = null;
        this.pieces = pieces;
        this.fields = fields;
        this.heldPiecesColor = piecesColor === 1 ? 0xffff00 : 0xff00ff;
        this.originalPieceColor = piecesColor === 1 ? 0xffffff : 0x4455aa;
        this.color = piecesColor === 1 ? true : false;

        this.piecesColor = piecesColor;
        console.log("stworzono Raycaster");
        window.onclick = this.clickOnBoard;
        window.onmousemove = this.moveMouse;
    }

    clickOnBoard = (event) => {
        let ray = this.raycaster;
        let intersects = ray.intersects;

        this.mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;

        ray.setFromCamera(this.mouseVector, gameManager.game.camera);
        intersects = ray.intersectObjects(gameManager.game.scene.children);

        if (this.piece) {
            if (intersects.length > 0 && intersects[0].object.isField) {
                console.log(this.whoseTurn, this.color);
                if (this.piece.pieceColor !== this.piecesColor) return;
                if (this.whoseTurn !== this.color) return;

                let field = this.findSquareForThePiece(intersects[0].point);
                if (field === undefined) return;

                // zmiana pozycji bierki
                let oldPiecePositionInArray = this.piece.positionInPiecesArray; // Przed ruchem pobieranie pozycji bierki w tablicy
                let newPiecePositionInArray = field.indexes;// Przekazanie nowej pozycji do konwersji na współrzędne w tablicy bierek
                this.piece.updatePositionInArray(newPiecePositionInArray);

                // Wysłanie do serwera nowej pozycji
                gameManager.net.sendNewPosition(oldPiecePositionInArray, newPiecePositionInArray, this.piece.position, field.position);

                // wykonanie ruchu -> TWEEN
                const move = new MovementAnimation(this.piece, field.position.x, field.position.z);
                move.startMove();
            }

            this.piece.material.color.set(this.originalPieceColor);

            this.piece = null;
        }

        if (intersects.length > 0 && intersects[0].object.isPiece) {
            this.piece = intersects[0].object;
            if (this.piece.pieceColor !== this.piecesColor) {
                this.piece = null;
                return;
            }
            this.piece.material.color.set(this.heldPiecesColor);
            return;
        }
    }

    moveMouse = (event) => {
        this.mouseMove.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseMove.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    findSquareForThePiece = (point) => {
        return this.fields.find((field) => {
            // Wyznaczenie odległosci miejsca kliknięcia od pozycji pola
            const DISTANCE_FROM_MOUSE_X_TO_THE_MIDDLE_POINT = Math.abs(point.x - field.position.x);
            const DISTANCE_FROM_MOUSE_Y_TO_THE_MIDDLE_POINT = Math.abs(point.z - field.position.z);
            let halfOfWidth = field.fieldWidth / 2;
            let halfOfDepth = field.fieldDepth / 2;

            // Zwrot fielda, jest który koloru czarnego i jest w odległości mniejszej niż połowa szerokości/głębi pola
            if (DISTANCE_FROM_MOUSE_X_TO_THE_MIDDLE_POINT <= halfOfWidth && DISTANCE_FROM_MOUSE_Y_TO_THE_MIDDLE_POINT <= halfOfDepth)
                if (field.fieldColor === 1)
                    return field;
        });
    }
}