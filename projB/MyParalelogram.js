/**
 * MyParalelogram
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyParalelogram extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	initBuffers() {
		this.vertices = [
			0, 0, 0,
			2, 0, 0,
			3, 1, 0,
			1, 1, 0,
			0, 0, 0,
			2, 0, 0,
			3, 1, 0,
			1, 1, 0
		];

		this.indices = [
			0, 1, 3,
			1, 2, 3,
			0, 3, 1,
			1, 3, 2
		];

		this.normals = [];
		this.normals.push(0, 0, 1);
		this.normals.push(0, 0, 1);
		this.normals.push(0, 0, 1);
		this.normals.push(0, 0, 1);
		this.normals.push(0, 0, -1);
		this.normals.push(0, 0, -1);
		this.normals.push(0, 0, -1);
		this.normals.push(0, 0, -1);

		this.texCoords=[0.25, 0.75, 0.75, 0.75, 1, 1, 0.5, 1];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
		this.updateTexCoordsGLBuffers();
	}

	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}
