class MyPrism extends CGFobject {

	constructor(scene, slices) {
		super(scene);
		this.slices = slices;
		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		let ang = 0;
		let ang_inc = 2*Math.PI/this.slices;

		for (var i = 0; i < this.slices; i++) {

			var sa=Math.sin(ang);
            var saa=Math.sin(ang+ang_inc);
            var ca=Math.cos(ang);
            var caa=Math.cos(ang+ang_inc);

			/* VERTICES */            
            this.vertices.push(ca, 0, -sa);
            this.vertices.push(caa, 0, -saa);
            this.vertices.push(ca, 1, -sa);

            this.vertices.push(caa, 0, -saa);
            this.vertices.push(caa, 1, -saa);
            this.vertices.push(ca, 1, -sa);

            /* TEXTURE COORDS */
            this.texCoords.push(0, 1, 1, 1, 0, 0);
            this.texCoords.push(1, 1, 1, 0, 0, 0);

            /* NORMALS */
            var normal = [
            	saa-sa,
            	0,
            	caa-ca
			];
            // normalization
            var nsize=Math.sqrt(
                normal[0]*normal[0]+
                normal[1]*normal[1]+
                normal[2]*normal[2]
                );
            normal[0]/=nsize;
            normal[1]/=nsize;
            normal[2]/=nsize;            

            // push normal once for each vertex of this square
            this.normals.push(...normal);
            this.normals.push(...normal);
            this.normals.push(...normal);
            this.normals.push(...normal);
            this.normals.push(...normal);
            this.normals.push(...normal);

            /* INDICES */
            this.indices.push(6*i, (6*i+1) , (6*i+2) );
            this.indices.push((6*i+3), (6*i+4) , (6*i+5) );

            ang += ang_inc;
		}

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
	}



}