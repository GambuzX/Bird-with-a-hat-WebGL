class MyEgg extends CGFobject {
    constructor(scene, x, y, z, rot) {
        super(scene);

        this.rotation = rot;
        this.position = [x,y,z];

        this.sphere = new MySphere(scene, 1, 50, 50);

        this.egg_height = 0.7;

        this.eggMat = new CGFappearance(this.scene);
        this.eggMat.setAmbient(1, 1, 1, 1);
        this.eggMat.setDiffuse(1, 1, 1, 1);
        this.eggMat.loadTexture('images/egg.jpg');
        this.eggMat.setTextureWrap('REPEAT', 'REPEAT');
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