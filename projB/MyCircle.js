/**
 * MyCircle
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyCircle extends CGFobject {
	constructor(scene, n_vertices) {
		super(scene);
		this.n_vertices = n_vertices;
		this.radius = 1;
		this.initBuffers();
	}
	initBuffers() {

		this.vertices = [
			0,0,0
        ];
        
        this.normals = [
            0,0,1
        ];

		//Calculate vertices
		for (let i = 0; i < this.n_vertices; i++) {
			let angle = 2*Math.PI/this.n_vertices * i;

			let x = this.radius * Math.cos(angle);
			let y = this.radius * Math.sin(angle);

            this.vertices.push(x, y, 0);
            this.normals.push(0,0,1);
		}

		//Counter-clockwise reference of vertices
		this.indices = [
		];

		//Front face
		for (let i = 0; i < this.n_vertices; i++) {
			this.indices.push(0);
			this.indices.push((i % this.n_vertices) + 1);
			this.indices.push(((i+1) % this.n_vertices) + 1);
		}
		//Back face
		for (let i = 0; i < this.n_vertices; i++) {
			this.indices.push(0);
			this.indices.push(((i+1) % this.n_vertices) + 1);
			this.indices.push((i % this.n_vertices) + 1);
		}


		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}

