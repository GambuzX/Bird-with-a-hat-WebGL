class LightningSegment extends CGFobject {
    constructor(scene) {
        super(scene);
        this.model = new MyQuad(this.scene);

        this.mat = new CGFappearance(this.scene);
        this.mat.setAmbient(1, 1, 1, 1);
		this.mat.setDiffuse(0, 0, 0,1);
		this.mat.setSpecular(0.0, 0.0, 0.0, 1);
        this.mat.setShininess(120);
        this.mat.setTextureWrap('REPEAT', 'REPEAT');
    }

    display() {
        this.mat.apply();

        this.scene.pushMatrix();
        this.scene.scale(0.25, 2, 1);
        this.scene.translate(0,0.5,0);
        this.model.display();
        this.scene.popMatrix();

        this.scene.setDefaultAppearance();
    }
}