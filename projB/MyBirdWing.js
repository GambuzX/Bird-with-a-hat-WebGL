class MyBirdWing extends CGFobject {

    constructor(scene) {
        super(scene);

        this.quad = new MyQuad(scene);
        this.triangle = new MyTriangleSmall(scene);

        this.birdMat = new CGFappearance(this.scene);
        this.birdMat.setAmbient(0.5, 0, 0.9, 1);
        this.birdMat.setDiffuse(0.5, 0, 0.9, 1);


        this.wingSquareLength = 1;
        this.wingTipLength = 1;
        this.wingRot = -Math.PI/6;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.wingSquareLength/2, 0, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.birdMat.apply();
        this.quad.display();
        this.scene.popMatrix();

        /* Wing tip */
        this.scene.pushMatrix();
        this.scene.translate(this.wingSquareLength, 0, 0);
        this.scene.rotate(this.wingRot, 0, 0, 1);
        this.scene.translate(Math.sqrt(2)/2, 0, 0);
        this.scene.scale(this.wingTipLength, 1, 1/Math.sqrt(2) );
        this.scene.rotate(Math.PI/4, 0, 1, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.triangle.display();
        this.scene.popMatrix();
    }
}