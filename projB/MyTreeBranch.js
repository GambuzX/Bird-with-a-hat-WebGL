class MyTreeBranch extends CGFobject {

    constructor(scene) {
        super(scene);
        
        this.cylinder = new MyCylinder(scene, 6);

        this.woodTex = new CGFappearance(this.scene);
        this.woodTex.setAmbient(1, 1, 1, 1);
        this.woodTex.setDiffuse(1, 1, 1, 1);
        this.woodTex.setSpecular(0.1, 0.1, 0.1, 1);
        this.woodTex.setShininess(1);
        this.woodTex.loadTexture('images/tree_bark.png');
        this.woodTex.setTextureWrap('REPEAT', 'REPEAT');
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(0.3, 0.3, 3);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.woodTex.apply();
        this.cylinder.display();
        this.scene.popMatrix();
    }
}