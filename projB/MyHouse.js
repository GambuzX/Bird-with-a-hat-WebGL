class MyHouse extends CGFobject {

	constructor(scene) {
		super(scene);

		this.unitCube = new MyUnitCubeQuad(scene);
		this.pyramid = new MyPyramid(scene, 4, 1);
		this.tower_pyramid = new MyPyramid(scene, 10, 1);
		this.prism = new MyPrism(scene, 10);

		this.initHouseMaterials();
	}

    initHouseMaterials() {
        this.wallMat = new CGFappearance(this.scene);
        this.wallMat.setAmbient(this.scene.ambientLight, this.scene.ambientLight, this.scene.ambientLight, 1);
        this.wallMat.setDiffuse(1, 1, 1, 1);
        this.wallMat.setSpecular(0.1, 0.1, 0.1, 1);
        this.wallMat.setShininess(1);
        this.wallMat.loadTexture('textures/house/brick_wall.jpg');
        this.wallMat.setTextureWrap('REPEAT', 'REPEAT');

        this.roofMaterial = new CGFappearance(this.scene);
        this.roofMaterial.setAmbient(this.scene.ambientLight, this.scene.ambientLight, this.scene.ambientLight, 1);
        this.roofMaterial.setDiffuse(1, 1, 1, 1);
        this.roofMaterial.setSpecular(0.5, 0.5, 0.5, 1);
        this.roofMaterial.setShininess(5);
        this.roofMaterial.loadTexture('textures/house/rooftiles.png');
        this.roofMaterial.setTextureWrap('REPEAT', 'REPEAT');
    }


	display() {

		this.wallMat.apply();

		/* Main building */
		let main_b_size = 1;
		this.scene.pushMatrix();
		this.scene.translate(0, main_b_size/2, 0);
		this.unitCube.display();
		this.scene.popMatrix();
		
		/* Main building roof */
		this.scene.pushMatrix();
		this.scene.translate(0,1,0);
		this.scene.rotate(Math.PI/4, 0, 1, 0);
		this.scene.scale(1/Math.sqrt(2), 1, 1/Math.sqrt(2));
        this.roofMaterial.apply();
		this.pyramid.display();
		this.scene.popMatrix();
		
        this.wallMat.apply();

		/* Front cover */
		let cover_y_size = 0.1;
		let cover_z_size = 0.7;
		let cover_y
		this.scene.pushMatrix();
		this.scene.translate(0, 0.5 + cover_y_size/2, main_b_size/2 + cover_z_size/2);
		this.scene.scale(1, cover_y_size, cover_z_size);
		this.unitCube.display();
		this.scene.popMatrix();

		/* Pillar 1 */
		let pillar_radius = 0.1;
		let pillar_y_size = 0.5;
		this.scene.pushMatrix();
		this.scene.translate(1/2 - pillar_radius, 0, main_b_size/2 + cover_z_size - pillar_radius);
		this.scene.scale(pillar_radius, pillar_y_size, pillar_radius);
		this.prism.display();
		this.scene.popMatrix();

		/* Pillar 2 */
		this.scene.pushMatrix();
		this.scene.translate(-1/2 + pillar_radius, 0, main_b_size/2 + cover_z_size - pillar_radius);
		this.scene.scale(pillar_radius, pillar_y_size, pillar_radius);
		this.prism.display();
		this.scene.popMatrix();

		/* Right side house */
		let side_b_x_size = 1.5;
		let side_b_y_size = 0.6;
		this.scene.pushMatrix();
		this.scene.translate(main_b_size/2 + side_b_x_size/2, side_b_y_size/2, 0);
		this.scene.scale(side_b_x_size, side_b_y_size, 1);
		this.unitCube.display();
		this.scene.popMatrix();

		/* Left side house */
		this.scene.pushMatrix();
		this.scene.translate(-main_b_size/2 - side_b_x_size/2, side_b_y_size/2, 0);
		this.scene.scale(side_b_x_size, side_b_y_size, 1);
		this.unitCube.display();
		this.scene.popMatrix();

		/* Right side tower */
		let tower_radius = 0.5;
		let tower_y_size = 1;
		this.scene.pushMatrix();
		this.scene.translate(main_b_size/2 + side_b_x_size - tower_radius, side_b_y_size, 0);
		this.scene.scale(tower_radius, tower_y_size, tower_radius);
		this.prism.display();
		this.scene.popMatrix();

		/* Left side tower */
		this.scene.pushMatrix();
		this.scene.translate(-(main_b_size/2 + side_b_x_size - tower_radius), side_b_y_size, 0);
		this.scene.scale(tower_radius, 1, tower_radius);
		this.prism.display();
		this.scene.popMatrix();

		/* Right side tower top */
		let tower_top_radius = 0.5;
		this.scene.pushMatrix();
		this.scene.translate(main_b_size/2 + side_b_x_size - tower_radius, side_b_y_size + tower_y_size, 0);
		this.scene.scale(tower_top_radius, 1, tower_top_radius);
        this.roofMaterial.apply();
		this.tower_pyramid.display();
		this.scene.popMatrix();

		/* Left side tower top */
		this.scene.pushMatrix();
		this.scene.translate(-(main_b_size/2 + side_b_x_size - tower_radius), side_b_y_size + tower_y_size, 0);
		this.scene.scale(tower_top_radius, 1, tower_top_radius);
        this.roofMaterial.apply();
		this.tower_pyramid.display();
		this.scene.popMatrix();

        this.scene.setDefaultAppearance();
	}

	enableNormalViz() {
		this.cube.enableNormalViz();
		this.unitCube.enableNormalViz();
		this.pyramid.enableNormalViz();
		this.tower_pyramid.enableNormalViz();
		this.prism.enableNormalViz();
	}
}
