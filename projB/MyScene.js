/**
* MyScene
* @constructor
*/
class MyScene extends CGFscene {
    constructor() {
        super();
    }
    init(application) {
        super.init(application);
        this.initCameras();
        this.initLights();

        // Background color
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.enableTextures(true);
        this.setUpdatePeriod(50);

        // Minigame
        this.p1_pos = [-10, 0, 0];
        this.p2_pos = [5, 0, 0];
        this.p1_id = 1;
        this.p2_id = 2;
        this.gameMode = false;

        // Initialize scene objects
        this.axis = new CGFaxis(this);
        this.bird = new MyBird(this, 0, false);
        this.bird1 = new MyBird(this, this.p1_id, true, this.p1_pos[0], this.p1_pos[1], this.p1_pos[2], Math.PI/2);
        this.bird2 = new MyBird(this, this.p2_id, true, this.p2_pos[0], this.p2_pos[1], this.p2_pos[2], -Math.PI/2);
        this.terrain = new MyTerrain(this);        
        this.branches = [
            new MyTreeBranch(this, -8, 0, 6, 0, 3, 0.3), 
            new MyTreeBranch(this, 5, 0, 8, Math.PI/3, 3, 0.3), 
            new MyTreeBranch(this, 1, 0, -10, 2*Math.PI/3, 3, 0.3), 
            new MyTreeBranch(this, -15, 0, -7, Math.PI/2, 3, 0.3)
        ];

        this.nests = [
            new MyNest(this, 0, 0, 0, 0),
            new MyNest(this, this.p1_pos[0], this.p1_pos[1], this.p1_pos[2], this.p1_id),
            new MyNest(this, this.p2_pos[0], this.p2_pos[1], this.p2_pos[2], this.p2_id)
        ];

        this.eggs = [
            new MyEgg(this, this.p1_pos[0], this.p1_pos[1], this.p1_pos[2]),
            new MyEgg(this, this.p1_pos[0], this.p1_pos[1], this.p1_pos[2]),
            new MyEgg(this, this.p1_pos[0], this.p1_pos[1], this.p1_pos[2]),
            
            new MyEgg(this, this.p2_pos[0], this.p2_pos[1], this.p2_pos[2]),
            new MyEgg(this, this.p2_pos[0], this.p2_pos[1], this.p2_pos[2]),
            new MyEgg(this, this.p2_pos[0], this.p2_pos[1], this.p2_pos[2])
        ];

        // Objects connected to MyInterface
        this.speedFactor = 1;
        this.scaleFactor = 1;
    }
    initLights() {
        this.lights[0].setPosition(15, 2, 5, 1);
        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[0].enable();
        this.lights[0].update();
    }
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(45, 45, 45), vec3.fromValues(0, 0, 0));
    }
    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    update(t){
        if (this.gameMode) {
            this.bird1.update(t, this.speedFactor);
            this.bird2.update(t, this.speedFactor);
        }
        else {
            this.bird.update(t, this.speedFactor);
        }
        this.checkKeys();
    }

    updateBirdsScale() {
        this.bird.setScaleFactor(this.scaleFactor);
        this.bird1.setScaleFactor(this.scaleFactor);
        this.bird2.setScaleFactor(this.scaleFactor);
    }

    isGameMode() {
        return this.gameMode;
    }

    changeState() {
        /* Reset birds */
        this.bird.reset();
        this.bird1.reset();
        this.bird2.reset();

        /* Retrieve grabbed branches */
        let branches = this.bird.removeBranches();
        for (let i = 0 ; i < branches.length; i++) this.addBranch(branches[i]);

        branches = this.bird1.removeBranches();
        for (let i = 0 ; i < branches.length; i++) this.addBranch(branches[i]);

        branches = this.bird2.removeBranches();
        for (let i = 0 ; i < branches.length; i++) this.addBranch(branches[i]);

        /* Reset branches */
        for (let i = 0 ; i < this.branches.length; i++) this.branches[i].reset();
    }

    checkKeys() {

        let first_bird = this.gameMode ? this.bird1 : this.bird;
        // Check for keys codes e.g. in https://keycode.info/
        if (this.gui.isKeyPressed("KeyW")) {    
            first_bird.accelerate(this.speedFactor)
        }
        if (this.gui.isKeyPressed("KeyS")) {
            first_bird.accelerate(-this.speedFactor);
        }
        if (this.gui.isKeyPressed("KeyD")) {
            first_bird.turn((Math.PI/6) / 3 * -this.speedFactor);
        }
        if (this.gui.isKeyPressed("KeyA")) {
            first_bird.turn((Math.PI/6) / 3 * this.speedFactor);
        }
        if (this.gui.isKeyPressed("KeyR")) {
            first_bird.reset();
        }
        if (this.gui.isKeyPressed("KeyP")) {
            first_bird.dropBird();
        }

        if (!this.gameMode) return;
        
        if (this.gui.isKeyPressed("ArrowUp")) {
            this.bird2.accelerate(this.speedFactor)
        }
        if (this.gui.isKeyPressed("ArrowDown")) {
            this.bird2.accelerate(-this.speedFactor);
        }
        if (this.gui.isKeyPressed("ArrowRight")) {
            this.bird2.turn((Math.PI/6) / 3 * -this.speedFactor);
        }
        if (this.gui.isKeyPressed("ArrowLeft")) {
            this.bird2.turn((Math.PI/6) / 3 * this.speedFactor);
        }
        if (this.gui.isKeyPressed("ControlRight")) {
            this.bird2.reset();
        }
        if (this.gui.isKeyPressed("ShiftRight")) {
            this.bird2.dropBird();
        }
    }

    euclidianDistance(pos1, pos2) {
        return Math.sqrt(Math.pow(pos1[0]-pos2[0], 2) + Math.pow(pos1[1]-pos2[1], 2) + Math.pow(pos1[2]-pos2[2], 2));
    }

    addBranch(branch) {
        this.branches.push(branch);
    }

    removeBranch(i) {
        this.branches.splice(i,1);
    }

    addEgg(egg) {
        this.eggs.push(egg);
    }

    removeEgg(i) {
        this.eggs.splice(i,1);
    }

    displayBranches() {
        for (let i = 0 ; i < this.branches.length; i++) {        
            this.pushMatrix();
            this.translate( this.branches[i].position[0],  this.branches[i].position[1],  this.branches[i].position[2]);
            this.rotate( this.branches[i].rotation, 0, 1, 0);  
            this.scale(0.5, 0.5, 0.5);      
            this.branches[i].display();
            this.popMatrix();
        }
    }

    displayEggs() {
        for (let i = 0 ; i < this.eggs.length; i++) {        
            this.pushMatrix();
            this.translate( this.eggs[i].position[0] + this.eggs[i].offset[0],  this.eggs[i].position[1] + this.eggs[i].offset[1],  this.eggs[i].position[2] + this.eggs[i].offset[2]);
            this.rotate( this.eggs[i].rotation, this.eggs[i].rot_axis[0], this.eggs[i].rot_axis[1], this.eggs[i].rot_axis[2]);
            this.scale(this.eggs[i].scale, this.eggs[i].scale, this.eggs[i].scale);
            this.scale(0.5, 0.5, 0.5);      
            this.eggs[i].display();
            this.popMatrix();
        }
    }

    display() {
        // ---- BEGIN Background, camera and axis setup
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();
        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        // Draw axis
        this.axis.display();

        //Apply default appearance
        this.setDefaultAppearance();

        // ---- BEGIN Primitive drawing section
        this.pushMatrix();
        this.rotate(-0.5*Math.PI, 1, 0, 0);
        this.scale(60, 60, 1);
        this.terrain.display();
        this.popMatrix();

        /* BEGIN draw objects at ground height */
        let ground_height = 2.5;
        this.pushMatrix();
        this.translate(0, ground_height, 0);

        if (this.gameMode) {
            /* Birds */
            this.bird1.display();
            this.bird2.display();

            /* Nests */
            this.pushMatrix();
            this.translate(this.nests[1].position[0], this.nests[1].position[1], this.nests[1].position[2]);
            this.scale(0.5, 0.5, 0.5);
            this.nests[1].display();
            this.popMatrix();

            this.pushMatrix();
            this.translate(this.nests[2].position[0], this.nests[2].position[1], this.nests[2].position[2]);
            this.scale(0.5, 0.5, 0.5);
            this.nests[2].display();
            this.popMatrix();
            
            this.displayEggs();
        }
        else {
            this.bird.display();

            this.pushMatrix();
            this.translate(this.nests[0].position[0], this.nests[0].position[1], this.nests[0].position[2]);
            this.scale(0.5, 0.5, 0.5);
            this.nests[0].display();
            this.popMatrix();

            this.displayBranches();
            
        }

        
        /* END draw objects at ground height */        

        this.popMatrix();
        // ---- END Primitive drawing section
    }
}