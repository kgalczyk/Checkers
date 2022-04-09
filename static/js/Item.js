class Field extends THREE.Mesh {
    fieldWidth;
    fieldHeight;
    fieldDepth;

    isPiece;
    isField;

    indexes;
    constructor(texture, fieldWidth, fieldHeight, fieldDepth, x, y) {

        const boxGeometry = new THREE.BoxGeometry(fieldWidth, fieldHeight, fieldDepth);
        const boxMaterial = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(texture)
        });
        super(boxGeometry, boxMaterial);
        this.fieldWidth = fieldWidth; // Oś x
        this.fieldDepth = fieldDepth; // Oś z
        this.fieldHeight = fieldHeight; // Oś y
        this.isPiece = false; // Pole Obiekt3D.userData jest polem obiektu dla danych użytkownika
        this.isField = true;
        this.indexes = { x: x, y: y };
    }
}