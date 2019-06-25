class MyEgg extends CGFobject {
    constructor(scene, x, y, z, birdID) {
        super(scene);

        this.rotation = Math.PI/6 * Math.random() + Math.PI/6;
        this.scale = 1 + (Math.random()*0.4 - 0.2);
        this.rot_axis = [Math.round(Math.random()), Math.round(Math.random()), Math.round(Math.random())];
        this.offset = [(Math.random()*2 - 1)*0.5, 0, (Math.random()*2 - 1)*0.5];
        this.initialPosition = [x,y,z];
        this.position = this.initialPosition;

        this.birdID = birdID;
        this.initialBirdID = this.birdID;

        this.sphere = new MySphere(scene, 1, 10, 10);

        this.egg_height = 0.7;

        this.eggMat = new CGFappearance(this.scene);
        this.eggMat.setAmbient(1, 1, 1, 1);
        this.eggMat.setDiffuse(1, 1, 1, 1);
        this.eggMat.loadTexture('images/egg.jpg');
        this.eggMat.setTextureWrap('REPEAT', 'REPEAT');
    }

    reset() {
        this.position = this.initialPosition;
        this.birdID = this.initialBirdID;
    }

    getBirdID() {
        return this.birdID;
    }

    setBirdID(birdID) {
        this.birdID = birdID;
    }

    setPosition(pos) {
        this.position = pos;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(0, this.egg_height, 0);
        this.scene.scale(0.5, this.egg_height, 0.5);
        this.eggMat.apply();
        this.sphere.display();
        this.scene.popMatrix();
    }
}