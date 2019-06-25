/**
 * MyTriangleSmall
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTriangleSmall extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	initBuffers() {
		this.vertices = [
			-1, 0, 0,
			1, 0, 0,
			0, 1, 0,
			-1, 0, 0,
			1, 0, 0,
			0, 1, 0
		];

		this.indices = [
			0, 1, 2,
			0, 2, 1
		];

		this.normals = [];
		this.normals.push(0, 0, 1);
		this.normals.push(0, 0, 1);
		this.normals.push(0, 0, 1);
		this.normals.push(0, 0, -1);
		this.normals.push(0, 0, -1);
		this.normals.push(0, 0, -1);

		this.texCoords=[0, 0, 0.25, 0.25, 0, 0.5];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
		this.updateTexCoordsGLBuffers();
	}

	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}

