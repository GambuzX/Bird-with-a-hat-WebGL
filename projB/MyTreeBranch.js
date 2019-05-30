class MyTreeBranch extends CGFobject {

    constructor(scene, x, y, z, rot, length, radius) {
        super(scene);
        
        this.cylinder = new MyCylinder(scene, 6);

        this.position = [x,y,z];
        this.rotation = rot;

        this.branch_length = length;
        this.radius = radius;

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
        this.scene.translate(0, 0, -this.branch_length/2);
        this.scene.scale(this.radius, this.radius, this.branch_length);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.woodTex.apply();
        this.cylinder.display();
        this.scene.popMatrix();
    }
}