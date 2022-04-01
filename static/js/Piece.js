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
        return this.piece;
    }

    updatePositionInArray = (newPosition) => {
        // kierunki:
        // jeśli biały:
        //      jeśli lewo-przód:
        //          w tablicy x++, y++
        //      jeśli prawo-przód:
        //          w tablicy x--, y++
        //      jeśli lewo-tył:
        //          w tablicy x++, y--
        //      jeśli prawo-tył:
        //          w tablicy x--, y--

        // jeśli czarny: 
        // x--, y--
        // x++, y--
        // x--, y++
        // x++, y++
    }
}