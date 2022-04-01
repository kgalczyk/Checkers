class Piece extends THREE.Mesh {
    constructor(color, texture, pieceColor) {
        super();
        // wymiary cylindra
        this.pieceRadiusTop = 7;
        this.pieceRadiusBottom = 7;
        this.pieceHeight = 5;
        // geometria, materiał
        this.cylinderGeometry = new THREE.CylinderGeometry(this.pieceRadiusTop, this.pieceRadiusBottom, this.pieceHeight, 25);
        this.cylinderMaterial = new THREE.MeshBasicMaterial({
            color: color,
            map: new THREE.TextureLoader().load(texture)
        })

        // stworzenie bierki
        this.piece = new THREE.Mesh(this.cylinderGeometry, this.cylinderMaterial);

        // dodane pola definiującego obiekt jako bierka
        this.piece.userData.isPiece = true;

        // dodanie pola definiującego kolor bierki (1 lub 2);
        this.piece.userData.pieceColor = pieceColor;

        this.piece.userData.updatePositionInArray = (newPosition) => {
            const WIDTH_STEP = gameManager.game.BOARD_WIDTH / gameManager.game.pieces.length;
            const DEPTH_STEP = gameManager.game.BOARD_DEPTH / gameManager.game.pieces[0].length;

            for (let i = -30, x = 0; i < 40; i += WIDTH_STEP, x++) {
                for (let j = -30, y = 0; j < 40; j += DEPTH_STEP, y++) {
                    if (newPosition.x === i && newPosition.z === j) {
                        this.piece.userData.positionInPiecesArray = {
                            x: x,
                            y: y
                        }
                        return { x: x, y: y };
                    }
                }
            }
            return null;
        }
        return this.piece;
    }
}