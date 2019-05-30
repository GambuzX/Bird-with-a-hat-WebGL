class MyBird extends CGFobject {

    constructor(scene, ID, simplify, x, y, z, ori) {
        super(scene);
        
        this.birdID = ID;
        this.simplify = simplify;
        this.initialPosition = [x || 0, y || 0, z || 0];
        this.initialOri = ori || 0;

        this.initObjects();
        this.initShaders();
        this.initBodyVariables();
        this.initAnimVariables();

        this.initMaterials();
    }

    initObjects() {
        this.unitCube = new MyUnitCubeQuad(this.scene);
        this.pyramid = new MyPyramid(this.scene, 4, 1);
        this.quad = new MyQuad(this.scene);
        this.cylinder = new MyCylinder(this.scene, 5);
        this.circle = new MyCircle(this.scene, 20);
        this.birdClaw = new MyBirdClaw(this.scene);
        this.birdWing = new MyBirdWing(this.scene);
        this.birdTail = new MyBirdTail(this.scene);
        this.birdHat = new MyBirdHat(this.scene);
        this.plane = new Plane(this.scene, 10);
        this.halfSphere = new MyHalfSphere(this.scene, 1, 50, 5);
    }

    initShaders() {
        this.chestTexture = new CGFtexture(this.scene, "images/bird/bird_chest.png");
        this.heightMap = new CGFtexture(this.scene, "images/bird/chest-heightmap.jpg");

        this.chestShader = new CGFshader(this.scene.gl,"shaders/birdChest.vert", "shaders/birdChest.frag");
        this.chestShader.setUniformsValues({
            chestTexture : 0,
            heightMap : 1        
        });
    }

    initAnimVariables() {
        /* Bird own animation */
        this.animShift = 0;
        this.wingsRot = 0;
        this.orientation = this.initialOri;
        this.speed = 0;
        this.scaleFactor = 1;
        this.position = this.initialPosition;
        
        /* Dropping state variables */
        this.currentState = 0;
        this.dropShift = 0;
        this.groundedLimit = 0.1;
        this.drop = false;
        this.birdHeight = 3;
        this.prevStartTime = 0;

        this.branches = [];
        this.branches_y_offset = this.claw_y_offset-0.5;
        this.branches_z_offset = this.claw_z_offset;
        this.catchBranchDist = 1;
        this.dropNestDist = 1.5;
    }

    initMaterials() {
        this.beakMat = new CGFappearance(this.scene);
        this.beakMat.setAmbient(0.95686, 0.71372, 0.25882, 1);
        this.beakMat.setDiffuse(0.95686, 0.71372, 0.25882, 1);

        this.eyeMat = new CGFappearance(this.scene);
        this.eyeMat.setAmbient(0, 0, 1, 1);
        this.eyeMat.setDiffuse(0, 0, 1, 1);

        this.blackMat = new CGFappearance(this.scene);
        this.blackMat.setAmbient(0, 0, 0, 1);
        this.blackMat.setDiffuse(0, 0, 0, 1);

        this.whiteMat = new CGFappearance(this.scene);
        this.whiteMat.setAmbient(1, 1, 1, 1);
        this.whiteMat.setDiffuse(1, 1, 1, 1);

        this.chestMat = new CGFappearance(this.scene);
        this.chestMat.setAmbient(1, 1, 1, 1);
        this.chestMat.setDiffuse(1, 1, 1, 1);
        this.chestMat.loadTexture('images/bird/bird_chest.png');
        this.chestMat.setTextureWrap('REPEAT', 'REPEAT');

        this.feathersMat = new CGFappearance(this.scene);
        this.feathersMat.setAmbient(1, 1, 1, 1);
        this.feathersMat.setDiffuse(1, 1, 1, 1);
        this.feathersMat.loadTexture('images/bird/purple_fur.jpg');
        this.feathersMat.setTextureWrap('REPEAT', 'REPEAT');

        this.legMat = new CGFappearance(this.scene);
        this.legMat.setAmbient(1, 1, 1, 1);
        this.legMat.setDiffuse(1, 1, 1, 1);
        this.legMat.loadTexture('images/bird/bird_feet.png');
        this.legMat.setTextureWrap('REPEAT', 'REPEAT');
    }

    initBodyVariables() {
        let ext_cyl_angle = 2*Math.PI/this.cylinder.slices; // external angle
        let int_cyl_angle = (this.cylinder.slices - 2) * ext_cyl_angle / 2; // internal angle

        this.bodyLength = 1.5;
        this.bodyRadius = 0.8;
        this.frontFeathersSide = this.bodyRadius;

        this.headHeight = -0.2;
        this.headRadius = 0.8;

        this.face_shift = this.headRadius * Math.sin( int_cyl_angle/2);

        this.eye_rotation = Math.PI/2 - int_cyl_angle/2;
        this.eye_socket_size = 0.2;
        this.eye_size = 0.1;
        this.eye_x_offset = 0.5;
        this.eye_y_offset = 0.6;
        this.eye_brow_rot = Math.PI/10;

        this.hat_size = 1;

        this.beak_size = 0.3;
        this.beak_length = 0.6;
        this.beak_y_offset = 0.2;

        this.cyl_rot_fix = Math.PI/2 - 2*Math.PI/this.cylinder.slices;

        this.leg_z_offset = -0.2;
        this.leg_x_offset = 0.3;
        this.leg_length = 2;
        this.leg_radius = 0.15;
        this.leg_rotation = Math.PI/3;

        this.claw_scale = 0.5;
        this.claw_y_offset = -this.leg_length * Math.cos(this.leg_rotation);
        this.claw_z_offset = this.leg_z_offset - this.leg_length * Math.sin(this.leg_rotation);

        this.base_wings_rot = Math.PI/5;

        this.butt_length = 0.5;
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
                this.animShift = Math.sin((t/1000 * speedFactor) * 2 * Math.PI) * 0.5;
                break;

            /* Dropping and rising*/
            case 1:
                this.dropShift = -Math.sin((t - this.prevStartTime)/4000 * 2 * Math.PI) * this.birdHeight;
                this.animShift = 0;
                
                if (this.dropShift > 0) {
                    this.currentState = 0; /* Set normal */
                    this.drop = false;
                }

                /* Grounded */
                if (Math.abs(this.birdHeight + this.dropShift) <= this.groundedLimit) {
                    /* Only allow on branch at a time */
                    if (this.branches.length == 0) 
                        this.grabNearBranches();

                    this.dropBranchesInNest();
                }
                break;
        }

        this.updatePosition();
    }

    grabNearBranches() {
        for (let i = this.scene.branches.length-1; i >= 0; i--) {
            if (this.scene.euclidianDistance(this.position, this.scene.branches[i].position) <= this.catchBranchDist*this.scaleFactor) {
                this.addBranch(this.scene.branches[i]);
                this.scene.removeBranch(i);
                break;
            }
        }
    }

    dropBranchesInNest() {
        if (this.scene.euclidianDistance(this.position, this.scene.nests[this.birdID].position) < this.dropNestDist*this.scaleFactor) {
            for (let i = this.branches.length-1; i >= 0; i--) {
                this.branches[i].position = this.scene.nests[this.birdID].position;
                this.scene.addBranch(this.branches[i]);
                this.removeBranch(i);
            }
        }
    }

    addBranch(branch) {
        this.branches.push(branch);
    }

    removeBranch(i) {
        this.branches.splice(i, 1);
    }

    removeBranches() {
        let branches = this.branches;
        this.branches = [];
        return branches;
    }

    setScaleFactor(scale) {
        this.scaleFactor = scale;
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
        this.orientation = this.initialOri;
        this.position = this.initialPosition;
    }

    draw_bird() {
        this.scene.pushMatrix();
        this.scene.translate(0, this.headHeight + this.bodyRadius, 0);
        this.draw_head();
        this.draw_eyes();
        this.draw_beak();
        if(!this.simplify)  {
            this.draw_brows();
            this.draw_eye_sockets();
            this.draw_hat();
        }
        this.scene.popMatrix();

        this.draw_body();
        this.draw_wings();
        if(!this.simplify)  {
            this.draw_chest();
            this.draw_tail();
            this.draw_butt();
            this.draw_claws();
        }
    }

    draw_head() {
        this.scene.pushMatrix();
        this.scene.rotate(this.cyl_rot_fix , 0, 1, 0);
        this.scene.scale(this.headRadius, 1, this.headRadius);
        this.feathersMat.apply();
        this.cylinder.display();
        this.scene.popMatrix();
    }
    
    draw_body() {
        this.scene.pushMatrix();
        this.scene.scale(this.bodyRadius, this.bodyRadius, this.bodyLength);
        this.scene.rotate(this.cyl_rot_fix, 0, 0, 1);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.feathersMat.apply();
        this.cylinder.display();
        this.scene.popMatrix();
    }

    draw_chest() {
        /* Set chest shader */
        this.scene.setActiveShader(this.chestShader);
        this.chestTexture.bind(0);
        this.heightMap.bind(1);

        this.scene.pushMatrix();
        this.scene.translate(0, -0.05, -0.1);
        this.scene.scale(this.frontFeathersSide*1.2, this.frontFeathersSide*1.2, 1);
        this.chestMat.apply();
        this.plane.display();
        this.scene.popMatrix();

        /* Reset shader */
        this.scene.setActiveShader(this.scene.defaultShader);
    }

    draw_wings() {
        /* Left Wing */
        this.scene.pushMatrix();
        this.scene.rotate(this.cyl_rot_fix, 0, 0, 1);
        this.scene.translate(this.bodyRadius, 0, -this.bodyLength/2);
        this.scene.rotate(this.base_wings_rot - this.wingsRot, 0, 0, 1);
        this.feathersMat.apply();
        this.birdWing.display();
        this.scene.popMatrix();

        /* Right Wing */
        this.scene.pushMatrix();
        this.scene.rotate(-this.cyl_rot_fix, 0, 0, 1);
        this.scene.translate(-this.bodyRadius, 0, -this.bodyLength/2);
        this.scene.rotate(-this.base_wings_rot + this.wingsRot, 0, 0, 1);
        this.scene.scale(-1,1,1);
        this.birdWing.display();
        this.scene.popMatrix();
    }

    draw_brows() {
        /* Left Eye Brow */
        this.scene.pushMatrix();
        this.scene.translate(this.eye_x_offset, this.eye_y_offset+0.2, this.face_shift+0.01);
        this.scene.rotate( this.eye_rotation, 0, 1, 0);
        this.scene.rotate(this.eye_brow_rot, 0, 0, 1);
        this.scene.scale(0.5, 0.2, 0.5);
        this.blackMat.apply();
        this.quad.display();
        this.scene.popMatrix();

        /* Right Eye Brow */
        this.scene.pushMatrix();
        this.scene.translate(-this.eye_x_offset, this.eye_y_offset+0.2, this.face_shift+0.01);
        this.scene.rotate( -this.eye_rotation, 0, 1, 0);
        this.scene.rotate(-this.eye_brow_rot, 0, 0, 1);
        this.scene.scale(0.5, 0.2, 0.5);
        this.quad.display();
        this.scene.popMatrix();
    }

    draw_eyes() {
        /* Left Eye */
        this.scene.pushMatrix();
        this.scene.translate(this.eye_x_offset, this.eye_y_offset, this.face_shift);
        this.scene.rotate(this.eye_rotation, 0, 1, 0);
        this.scene.translate(0, 0, 0.01);
        this.scene.scale(this.eye_size, this.eye_size, this.eye_size);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.eyeMat.apply();
        this.circle.display();
        this.scene.popMatrix();

        /* Right Eye */
        this.scene.pushMatrix();
        this.scene.translate(-this.eye_x_offset, this.eye_y_offset, this.face_shift);
        this.scene.rotate( -this.eye_rotation, 0, 1, 0);
        this.scene.translate(0, 0, 0.01);
        this.scene.scale(this.eye_size, this.eye_size, this.eye_size);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.circle.display();
        this.scene.popMatrix();
    }

    draw_eye_sockets() {
        /* Left Eye Socket*/
        this.scene.pushMatrix();
        this.scene.translate(this.eye_x_offset, this.eye_y_offset, this.face_shift);
        this.scene.rotate( this.eye_rotation, 0, 1, 0);
        this.scene.scale(this.eye_socket_size, this.eye_socket_size, this.eye_socket_size);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.whiteMat.apply();
        this.circle.display();
        this.scene.popMatrix();

        /* Right Eye Socket*/
        this.scene.pushMatrix();
        this.scene.translate(-this.eye_x_offset, this.eye_y_offset, this.face_shift);
        this.scene.rotate( -this.eye_rotation, 0, 1, 0);
        this.scene.scale(this.eye_socket_size, this.eye_socket_size, this.eye_socket_size);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.circle.display();
        this.scene.popMatrix();
    }

    draw_beak() {
        this.scene.pushMatrix();
        this.scene.translate(0, this.beak_y_offset, this.face_shift);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(this.beak_size, this.beak_length, this.beak_size);
        this.beakMat.apply();
        this.pyramid.display();
        this.scene.popMatrix();
    }

    draw_tail() {
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -this.bodyLength-this.butt_length+0.1);
        this.feathersMat.apply();
        this.birdTail.display();
        this.scene.popMatrix();
    }

    draw_butt() {
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -this.bodyLength);
        this.scene.scale(this.bodyRadius, this.bodyRadius, this.butt_length);
        this.scene.rotate(this.cyl_rot_fix, 0, 0, 1);
        this.scene.rotate(Math.PI/2, -1, 0, 0);
        this.feathersMat.apply();
        this.halfSphere.display();
        this.scene.popMatrix();
    }

    draw_claws() {
        /* Left leg */
        this.scene.pushMatrix();
        this.scene.translate(this.leg_x_offset, 0, this.leg_z_offset);
        this.scene.rotate(Math.PI + this.leg_rotation, 1, 0, 0);
        this.scene.scale(this.leg_radius, this.leg_length, this.leg_radius);
        this.legMat.apply();
        this.cylinder.display();
        this.scene.popMatrix();

        /* Left Claw */
        this.scene.pushMatrix();
        this.scene.translate(this.leg_x_offset, this.claw_y_offset, this.claw_z_offset);
        this.scene.rotate(this.leg_rotation, 1, 0, 0);
        this.scene.scale(this.claw_scale, this.claw_scale, this.claw_scale);
        this.legMat.apply();
        this.birdClaw.display();
        this.scene.popMatrix();

        /* Right leg */
        this.scene.pushMatrix();
        this.scene.translate(-this.leg_x_offset, 0, this.leg_z_offset);
        this.scene.rotate(Math.PI + this.leg_rotation, 1, 0, 0);
        this.scene.scale(this.leg_radius, this.leg_length, this.leg_radius);
        this.legMat.apply();
        this.cylinder.display();
        this.scene.popMatrix();

        /* Right Claw */
        this.scene.pushMatrix();
        this.scene.translate(-this.leg_x_offset, this.claw_y_offset, this.claw_z_offset);
        this.scene.rotate(this.leg_rotation, 1, 0, 0);
        this.scene.scale(this.claw_scale, this.claw_scale, this.claw_scale);
        this.legMat.apply();
        this.birdClaw.display();
        this.scene.popMatrix();
    }

    draw_hat() {
        this.scene.pushMatrix();
        this.scene.translate(0, 1, 0);
        this.scene.scale(this.headRadius, this.hat_size, this.headRadius);
        this.birdHat.display();
        this.scene.popMatrix();
    }

    display_branches() {
        this.scene.pushMatrix();
        for (let i = 0; i < this.branches.length; i++) {
            this.scene.pushMatrix();
            if (this.simplify)  {
                this.scene.translate(0, -this.bodyRadius*this.scaleFactor, 0);
            } else {
                this.scene.translate(0, this.branches_y_offset*this.scaleFactor, this.branches_z_offset*this.scaleFactor);
                this.scene.rotate(Math.PI/2, 0, 1, 0);
            }
            this.branches[i].display();
            this.scene.popMatrix();
        }
        this.scene.popMatrix();
    }

    display() {

        this.scene.pushMatrix();
        this.scene.translate(this.position[0], this.position[1] + this.animShift*this.scaleFactor + this.dropShift + this.birdHeight, this.position[2]);
        this.scene.rotate(this.orientation, 0, 1, 0);
        this.scene.scale(0.5, 0.5, 0.5); 

        this.scene.pushMatrix();
        this.scene.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);
        this.draw_bird();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.display_branches();
        this.scene.popMatrix();

        this.scene.popMatrix();       

        /* Reset scene appearance */
        this.scene.setDefaultAppearance();
    }

}