class MyUnitCubeQuad extends CGFobject {

	constructor(scene) {
		super(scene);
		this.initBuffers();

		this.myQuad = new MyQuad(scene);
	}

	display() {
		
		// Front
		this.scene.pushMatrix();
		this.scene.translate(0,0,0.5);
		this.myQuad.display();
		this.scene.popMatrix();

		// Back
		this.scene.pushMatrix();
		let angle = Math.PI;
		this.scene.translate(0,0,-0.5);
		this.scene.rotate(angle, 0, 1, 0);
		this.myQuad.display();
		this.scene.popMatrix();

		//Right
		this.scene.pushMatrix();
		angle = Math.PI / 2;
		this.scene.translate(0.5, 0, 0);
		this.scene.rotate(angle, 0, 1, 0);
		this.myQuad.display();
		this.scene.popMatrix();

		//Left
		this.scene.pushMatrix();
		angle = 3 * Math.PI / 2;
		this.scene.translate(-0.5, 0, 0);
		this.scene.rotate(angle, 0, 1, 0);
		this.myQuad.display();
		this.scene.popMatrix();

		//Top
		this.scene.pushMatrix();
		angle = -Math.PI / 2;
		this.scene.translate(0, 0.5, 0);
		this.scene.rotate(angle, 1, 0, 0);
		this.myQuad.display();
		this.scene.popMatrix();

		//Bottom
		this.scene.pushMatrix();
		angle = Math.PI / 2;
		this.scene.translate(0, -0.5, 0);
		this.scene.rotate(angle, 1, 0, 0);
		this.myQuad.display();
		this.scene.popMatrix();
	}

    enableNormalViz() {
        this.myQuad.enableNormalViz();
    }

}
