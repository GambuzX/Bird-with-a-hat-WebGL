class MyBirdClaw extends CGFobject {

    constructor(scene) {
        super(scene);
        
        this.unitCube = new MyUnitCubeQuad(scene);
        this.pyramid = new MyPyramid(scene, 4, 1);
        
        this.base_length = 4;

        this.finger_x_size = 1;
        this.finger_y_size = 1;

        this.finger_length = 1.5;

        this.clawMat = new CGFappearance(this.scene);
        this.clawMat.setAmbient(0.95686, 0.71372, 0.25882, 1);
        this.clawMat.setDiffuse(0.95686, 0.71372, 0.25882, 1);

        this.talonMat = new CGFappearance(this.scene);
        this.talonMat.setAmbient(0.3, 0.3, 0.3, 1);
        this.talonMat.setDiffuse(0.3, 0.3, 0.3, 1);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(0.2, 0.2, 0.2);


        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.base_length/2);
        this.scene.scale(5, 1, this.base_length);
        this.clawMat.apply();
        this.unitCube.display();
        this.scene.popMatrix();


        /* Middle finger */
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.base_length + this.finger_length/2);
        this.scene.scale(this.finger_x_size, this.finger_y_size, this.finger_length);
        this.clawMat.apply();
        this.unitCube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.base_length + this.finger_length);
        this.scene.scale(this.finger_x_size/2 * Math.sqrt(2), this.finger_y_size/2 * Math.sqrt(2), 1);
        this.scene.rotate(Math.PI/4, 0, 0, 1);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.talonMat.apply();
        this.pyramid.display();
        this.scene.popMatrix();

        /* Left finger */
        this.scene.pushMatrix();
        this.scene.translate(-2, 0, this.base_length + this.finger_length/2);
        this.scene.scale(this.finger_x_size, this.finger_y_size, this.finger_length);
        this.clawMat.apply();
        this.unitCube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-2, 0, this.base_length + this.finger_length);
        this.scene.scale(this.finger_x_size/2 * Math.sqrt(2), this.finger_y_size/2 * Math.sqrt(2), 1);
        this.scene.rotate(Math.PI/4, 0, 0, 1);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.talonMat.apply();
        this.pyramid.display();
        this.scene.popMatrix();

        /* Right finger */
        this.scene.pushMatrix();
        this.scene.translate(2, 0, this.base_length + this.finger_length/2);
        this.scene.scale(this.finger_x_size, this.finger_y_size, this.finger_length);
        this.clawMat.apply();
        this.unitCube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2, 0, this.base_length + this.finger_length);
        this.scene.scale(this.finger_x_size/2 * Math.sqrt(2), this.finger_y_size/2 * Math.sqrt(2), 1);
        this.scene.rotate(Math.PI/4, 0, 0, 1);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.talonMat.apply();
        this.pyramid.display();
        this.scene.popMatrix();
        

        this.scene.popMatrix();
        this.scene.setDefaultAppearance();
    }
}