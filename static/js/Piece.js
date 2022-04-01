class Piece extends THREE.Mesh {
    xd = 1;
    constructor(color, texture, pieceColor) {
        super();
        this.pieceRadiusTop = 7;
        this.pieceRadiusBottom = 7;
        this.pieceHeight = 5;
        this.cylinderGeometry = new THREE.CylinderGeometry(this.pieceRadiusTop, this.pieceRadiusBottom, this.pieceHeight, 25);
        this.cylinderMaterial = new THREE.MeshBasicMaterial({
            color: color,
            map: new THREE.TextureLoader().load(texture)
        })
        this.piece = new THREE.Mesh(this.cylinderGeometry, this.cylinderMaterial);
        this.piece.userData.isPiece = true;
        this.piece.userData.pieceColor = pieceColor;
        return this.piece;
    }
}