class MyTerrain extends CGFobject {
    constructor(scene) {
        super(scene);

        this.minHeight = 0;
        this.maxHeight = 8;

        this.shader = new CGFshader(this.scene.gl,"shaders/terrainShader.vert", "shaders/terrainShader.frag");

        this.texture = new CGFtexture(this.scene, "images/terrain.jpg");
        this.heightMap = new CGFtexture(this.scene, "images/heightmap-flat.jpg");
        this.altimetry = new CGFtexture(this.scene, "images/altimetry.png");

        this.shader.setUniformsValues({
            textureSampler : 0,
            heightmapSampler : 1,
            altimetrySampler : 2,
            minHeight : this.minHeight,
            maxHeight : this.maxHeight            
        });

        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
		this.appearance.setDiffuse(1, 1, 1, 1);
		this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
        this.appearance.setShininess(120);
        this.appearance.setTexture(this.texture);
        this.appearance.setTextureWrap('REPEAT', 'REPEAT');

        this.planeObject = new Plane(this.scene, 128);
    }

    display() {
        this.appearance.apply();
        this.scene.setActiveShader(this.shader);
        this.heightMap.bind(1);
        this.altimetry.bind(2);

        this.planeObject.display();

        this.scene.setDefaultAppearance();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}