class MyBird extends CGFobject {

    constructor(scene) {
        super(scene);
        
        /* Objects */
        this.unitCube = new MyUnitCubeQuad(scene);
        this.pyramid = new MyPyramid(scene, 4, 1);
        this.quad = new MyQuad(scene);
        this.cylinder = new MyCylinder(scene, 5);

        /* Animations variables */
        this.animShift = 0;
        this.wingsRot = 0;
        this.orientation = 0;
        this.speed = 0;
        this.position = [0, 0, 0];

        this.initMaterials();
        
        /* Init dropping state variables */
        this.currentState = 0;
        this.dropShift = 0;
        this.groundedLimit = 0.1;
        this.drop = false;
        this.birdHeight = 10;
        this.prevStartTime = 0;

        this.branches = [];
        this.branchesOffset = -1;
        this.catchBranchDist = 1;
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

    update(t, speedFactor) {
        this.wingsRot = (Math.sin((t/500 * speedFactor) * 2 * Math.PI) + 1) / 2 * Math.PI/2; // angle between 0 and 90

        switch(this.currentState) {
            /* Normal */
            case 0:
                if (this.drop) {
                    this.drop = false;
                    this.currentState = 1; /* Set dropping */
                    this.prevStartTime = t;
                }
                this.animShift = Math.sin((t/1000 * speedFactor) * 2 * Math.PI);
                break;

            /* Dropping and rising*/
            case 1:
                this.dropShift = -Math.sin((t - this.prevStartTime)/4000 * 2 * Math.PI) * this.birdHeight;
                this.animShift = 0;
                
                if (this.dropShift > 0) {
                    this.currentState = 0; /* Set normal */
                    this.drop = false;
                }

                if (Math.abs(this.birdHeight + this.dropShift) <= this.groundedLimit) {
                    let caught = this.scene.branchesNear(this.position, this.catchBranchDist);
                    for (let i = 0; i < caught.length; i++) {
                        this.branches.push(caught[i]);
                    }
                }
                break;
        }

        this.updatePosition();
    }

    updatePosition() {
        let orientation_v = [ Math.sin(this.orientation), 0, Math.cos(this.orientation)];

        // normalization
        let ori_v_size=Math.sqrt(
            orientation_v[0]*orientation_v[0]+
            orientation_v[2]*orientation_v[2]
            );
        orientation_v[0]/=ori_v_size;
        orientation_v[2]/=ori_v_size;
        
        let speed = this.speed/5;
        this.position = this.position.map(function(coord, index) {
            return coord + orientation_v[index] * speed;
        });
    }

    turn(v) {
        this.orientation += v;
    }

    accelerate(v) {
        this.speed += v;
    }

    dropBird() {
        this.drop = true;
    }

    reset() {
        this.speed = 0;
        this.orientation = 0;
        this.position = [0,0,0];
    }

    display() {
        /* Oscillation animation */
        this.scene.pushMatrix();
        this.scene.translate(this.position[0], this.position[1] + this.animShift + this.dropShift, this.position[2]);
        this.scene.rotate(this.orientation, 0, 1, 0);

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
        this.scene.rotate(Math.PI/6 - this.wingsRot, 0, 0, 1);
        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.quad.display();
        this.scene.popMatrix();

        /* Right Wing */
        this.scene.pushMatrix();
        this.scene.translate(-0.5, 1, 0);
        this.scene.rotate(-Math.PI/6 + this.wingsRot, 0, 0, 1);
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

        /* Grabbed Branches */
        this.scene.pushMatrix();
        for (let i = 0; i < this.branches.length; i++) {
            this.scene.pushMatrix();
            this.scene.translate(0, this.branchesOffset, 0);
            this.scene.rotate(this.branches[i].rotation, 0, 1, 0);
            this.branches[i].display();
            this.scene.popMatrix();
        }
        this.scene.popMatrix();

        this.scene.popMatrix();

        this.scene.setDefaultAppearance();
    }

}