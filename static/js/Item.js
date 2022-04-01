class Field extends THREE.Mesh {
    constructor(texture) {
        super();
        this.fieldWidth = 20; // Oś x
        this.fieldDepth = 20; // Oś z
        this.fieldHeight = 5; // Oś y
        this.boxGeometry = new THREE.BoxGeometry(this.fieldWidth, this.fieldHeight, this.fieldDepth);
        this.boxMaterial = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(texture)
        });
        this.box = new THREE.Mesh(this.boxGeometry, this.boxMaterial);
        this.box.userData.isPiece = false; // Pole Obiekt3D.userData jest polem obiektu dla danych użytkownika
        return this.box; // Konstruktor zwraca gotowy obiekt3D pola szachownicy
    }
}