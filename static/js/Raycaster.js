class Raycaster {
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2();
        this.mouseMove = new THREE.Vector2();
        this.intersects = [];
        this.piece = null;
        console.log("stworzono Raycaster");
        window.onclick = this.clickOnBoard;
        window.onmousemove = this.moveMouse;
    }

    clickOnBoard(event) {
        let ray = gameManager.raycaster.raycaster;
        let intersects = gameManager.raycaster.intersects;

        gameManager.raycaster.mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
        gameManager.raycaster.mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;

        ray.setFromCamera(gameManager.raycaster.mouseVector, gameManager.game.camera);
        intersects = ray.intersectObjects(gameManager.game.scene.children);

        if (gameManager.raycaster.piece) {
            if (intersects.length > 0 && !intersects[0].object.userData.isPiece) {
                const point = intersects[0].point;
                console.log(intersects[0].face);
                let position = gameManager.raycaster.findSquareForThePiece(point);

                // Jeśli nie znaleziono bierki, wychodzimy z funkcji
                if (position === undefined) return;

                // Przed ruchem pobieranie pozycji bierki w tablicy
                let oldPiecePositionInArray = gameManager.raycaster.piece.userData.positionInPiecesArray;

                // Przekazanie nowej pozycji do konwersji na współrzędne w tablicy bierek
                let newPiecePositionInArray = gameManager.raycaster.piece.userData.updatePositionInArray(position);

                // wykonanie ruchu -> TWEEN
                const move = new MovementAnimation(gameManager.raycaster.piece, position.x, position.z);
                move.startMove();

                // Wysłanie do serwera nowej pozycji
                gameManager.net.sendNewPosition(oldPiecePositionInArray, newPiecePositionInArray);
            }
            console.log("opuszczanie");
            if (gameManager.raycaster.piece.userData.pieceColor === 1) gameManager.raycaster.piece.material.color.set(0xffffff);
            else gameManager.raycaster.piece.material.color.set(0x4455aa);
            gameManager.raycaster.piece = null;
        }

        console.log("podnoszenie");
        if (intersects.length > 0 && intersects[0].object.userData.isPiece) {
            gameManager.raycaster.piece = intersects[0].object;
            console.log(gameManager.raycaster.piece);

            if (gameManager.raycaster.piece.userData.pieceColor === 1) gameManager.raycaster.piece.material.color.set(0xffff00);
            else gameManager.raycaster.piece.material.color.set(0xff00ff);
            return;
        }
    }

    moveMouse(event) {
        gameManager.raycaster.mouseMove.x = (event.clientX / window.innerWidth) * 2 - 1;
        gameManager.raycaster.mouseMove.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    findSquareForThePiece(point) {
        const foundField = gameManager.game.fieldsObjects.find((field) => {
            // Wyznaczenie odległosci miejsca kliknięcia od pozycji pola
            const DISTANCE_FROM_MOUSE_X_TO_THE_MIDDLE_POINT = Math.abs(point.x - field.position.x);
            const DISTANCE_FROM_MOUSE_Y_TO_THE_MIDDLE_POINT = Math.abs(point.z - field.position.z);
            let halfOfWidth = field.geometry.parameters.width / 2;
            let halfOfDepth = field.geometry.parameters.depth / 2;

            // Zwrot fielda który koloru czarnego i jest w odległości mniejszej niż połowa szerokości/głębi pola
            if (DISTANCE_FROM_MOUSE_X_TO_THE_MIDDLE_POINT <= halfOfWidth && DISTANCE_FROM_MOUSE_Y_TO_THE_MIDDLE_POINT <= halfOfDepth)
                if (field.userData.fieldColor === 1)
                    return field;
        })

        if (foundField) return foundField.position;
        return;
    }
}