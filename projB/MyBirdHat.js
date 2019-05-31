class MyBirdHat extends CGFobject {
    constructor(scene) {
        super(scene);

        this.halfSphere = new MyHalfSphere(scene, 1, 50, 50);
        this.cylinder = new MyCylinder(scene, 10);
        
        this.stripe_height = 0.2;
        this.base_height = 0.1;
        this.base_radius = 2;

        this.stripeMat = new CGFappearance(this.scene);
        this.stripeMat.setAmbient(1, 0, 0, 1);
        this.stripeMat.setDiffuse(1, 0, 0, 1);

        this.hatMat = new CGFappearance(this.scene);
        this.hatMat.setAmbient(1, 1, 1, 1);
        this.hatMat.setDiffuse(1, 1, 1, 1);
        this.hatMat.loadTexture('images/bird/straw.png');
        this.hatMat.setTextureWrap('REPEAT', 'REPEAT');
    }

    display() {

        this.scene.pushMatrix();
        this.scene.translate(0, this.base_height + this.stripe_height, 0);
        this.scene.scale(1, 0.8, 1);
        this.hatMat.apply();
        this.halfSphere.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(this.base_radius, this.base_height, this.base_radius);
        this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, this.base_height, 0);
        this.scene.scale(1, this.stripe_height, 1);
        this.stripeMat.apply();
        this.cylinder.display();
        this.scene.popMatrix();
    }
}