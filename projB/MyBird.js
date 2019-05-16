class MyBird extends CGFobject {

    constructor(scene) {
        super(scene);
        
        this.unitCube = new MyUnitCubeQuad(scene);
        this.pyramid = new MyPyramid(scene, 4, 1);
        this.quad = new MyQuad(scene);
        this.cylinder = new MyCylinder(scene, 5);

        this.initMaterials();
    }

    initMaterials() {
        this.birdMat = new CGFappearance(this.scene);
        this.birdMat.setAmbient(0.5, 0, 0.9, 1);
        this.birdMat.setDiffuse(0.5, 0, 0.9, 1);

        this.beakMat = new CGFappearance(this.scene);
        this.beakMat.setAmbient(0.95686, 0.71372, 0.25882, 1);
        this.beakMat.setDiffuse(0.95686, 0.71372, 0.25882, 1);

        this.eyesMat = new CGFappearance(this.scene);
        this.eyesMat.setAmbient(0, 0, 0, 1);
        this.eyesMat.setDiffuse(0, 0, 0, 1);
    }

    display() {

        /* Head */
        this.scene.pushMatrix();
        this.scene.translate(0, 1.5, 0.5);
        this.birdMat.apply();
        this.unitCube.display();
        this.scene.popMatrix();

        /* Body */
        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);
        this.unitCube.display();
        this.scene.popMatrix();

        /* Left Wing */
        this.scene.pushMatrix();
        this.scene.translate(0.5, 1, 0);
        this.scene.rotate(Math.PI/6, 0, 0, 1);
        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.quad.display();
        this.scene.popMatrix();

        /* Right Wing */
        this.scene.pushMatrix();
        this.scene.translate(-0.5, 1, 0);
        this.scene.rotate(-Math.PI/6, 0, 0, 1);
        this.scene.translate(-0.5, 0, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.quad.display();
        this.scene.popMatrix();

        /* Left Eye */
        this.scene.pushMatrix();
        this.scene.translate(0.5, 1.6, 0.8);
        this.scene.scale(0.2, 0.2, 0.2);
        this.eyesMat.apply();
        this.unitCube.display();
        this.scene.popMatrix();

        /* Right Eye */
        this.scene.pushMatrix();
        this.scene.translate(-0.5, 1.6, 0.8);
        this.scene.scale(0.2, 0.2, 0.2);
        this.unitCube.display();
        this.scene.popMatrix();


        /* Beak */
        this.scene.pushMatrix();
        this.scene.translate(0, 1.3, 1);
        this.scene.scale(0.3, 0.3, 0.3);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.beakMat.apply();
        this.pyramid.display();
        this.scene.popMatrix();

        this.scene.setDefaultAppearance();
    }

}