class MyTreeBranch extends CGFobject {

    constructor(scene, x, y, z, rot) {
        super(scene);
        
        this.cylinder = new MyCylinder(scene, 6);

        this.position = [x,y,z];
        this.rotation = rot;

        this.woodTex = new CGFappearance(this.scene);
        this.woodTex.setAmbient(1, 1, 1, 1);
        this.woodTex.setDiffuse(1, 1, 1, 1);
        this.woodTex.setSpecular(0.1, 0.1, 0.1, 1);
        this.woodTex.setShininess(1);
        this.woodTex.loadTexture('images/tree_bark.png');
        this.woodTex.setTextureWrap('REPEAT', 'REPEAT');
    }

    setPosition(x,y,z) {
        this.position = [x,y,z];
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(0.3, 0.3, 3);
        this.scene.translate(0, 0, -0.5);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.woodTex.apply();
        this.cylinder.display();
        this.scene.popMatrix();
    }

    displayInPosition() {        
        this.scene.pushMatrix();
        this.scene.translate(this.position[0], this.position[1], this.position[2]);
        this.scene.rotate(this.rotation, 0, 1, 0);        
        this.display();
        this.scene.popMatrix();
    }
}