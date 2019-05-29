class MyBirdHat extends CGFobject {
    constructor(scene) {
        super(scene);

        this.cylinder = new MyCylinder(scene, 10);
    }

    display() {

        this.cylinder.display();

        this.scene.pushMatrix();
        this.scene.scale(1.5, 0.4, 1.5);
        this.cylinder.display();
        this.scene.popMatrix();
    }
}