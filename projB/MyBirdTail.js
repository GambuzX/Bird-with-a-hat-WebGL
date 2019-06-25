class MyBirdTail extends CGFobject {
    constructor(scene) {
        super(scene);

        this.quad = new MyQuad(scene);
        this.paralelogram = new MyParalelogram(scene);
        this.triangle = new MyTriangleSmall(scene);
    }

    display() {

        // center quad
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/6, 1, 0, 0);
        this.scene.translate(0, 0.5, 0);
        this.quad.display();
        this.scene.popMatrix();

        // left paralelogram
        this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(-Math.PI/6, 1, 0, 0);
        this.scene.scale(0.6, 1/Math.sqrt(2), 1);
        this.scene.rotate(Math.PI/4, 0, 0, 1);
        this.paralelogram.display();
        this.scene.popMatrix();

        // right paralelogram
        this.scene.pushMatrix();
        this.scene.translate(-0.5, 0, 0);
        this.scene.rotate(-Math.PI/6, 1, 0, 0);
        this.scene.scale(0.6, 1/Math.sqrt(2), 1);
        this.scene.rotate(-Math.PI/4, 0, 0, 1);
        this.scene.scale(-1, 1, 1);
        this.paralelogram.display();
        this.scene.popMatrix();        

        // center triangle
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/6, 1, 0, 0);
        this.scene.translate(0, 1, 0);
        this.scene.scale(0.5, 1.5, 1);
        this.triangle.display();
        this.scene.popMatrix();
    }
}