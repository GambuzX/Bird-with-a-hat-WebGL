/*
*   Sphere adapted from https://bl.ocks.org/camargo/649e5903c4584a21a568972d4a2c16d3
*/

class MyHalfSphere extends CGFobject {

    constructor(scene, radius, latBands, longBands) {
        super(scene);

        this.radius = radius;
        this.latBands = latBands;
        this.longBands = longBands;

		this.initBuffers();
    }

    initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

        // Calculate sphere vertex positions, normals, and texture coordinates.
        for (let latNumber = 0; latNumber <= this.latBands/2; ++latNumber) {
            let theta = latNumber * Math.PI / this.latBands;
            let sinTheta = Math.sin(theta);
            let cosTheta = Math.cos(theta);

            for (let longNumber = 0; longNumber <= this.longBands; ++longNumber) {
                let phi = longNumber * 2 * Math.PI / this.longBands;
                let sinPhi = Math.sin(phi);
                let cosPhi = Math.cos(phi);

                let x = cosPhi * sinTheta;
                let y = cosTheta;
                let z = sinPhi * sinTheta;

                let u = 1 - (longNumber / this.longBands);
                let v = 1 - (latNumber / this.latBands);

                this.vertices.push(this.radius * x);
                this.vertices.push(this.radius * y);
                this.vertices.push(this.radius * z);

                this.normals.push(x);
                this.normals.push(y);
                this.normals.push(z);

                this.texCoords.push(u);
                this.texCoords.push(v);
            }
        }

        // Calculate sphere indices.
        for (let latNumber = 0; latNumber < this.latBands/2; ++latNumber) {
            for (let longNumber = 0; longNumber < this.longBands; ++longNumber) {
                let first = (latNumber * (this.longBands + 1)) + longNumber;
                let second = first + this.longBands + 1;

                this.indices.push(second);
                this.indices.push(first);
                this.indices.push(first + 1);

                this.indices.push(second + 1);
                this.indices.push(second);
                this.indices.push(first + 1);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

}