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

        // Minigame variables
        this.p1_pos = [-10, 0, 0];
        this.p2_pos = [5, 0, 0];
        this.p1_id = 1;
        this.p2_id = 2;
        this.gameMode = false;

        // Minigame interface
		this.minigameDiv = document.getElementById("minigame");
		this.p1Div = document.getElementById("player1_score");
		this.p2Div = document.getElementById("player2_score");

        // Initialize scene objects
        this.axis = new CGFaxis(this);
        this.terrain = new MyTerrain(this);        

        this.main_bird_id = 0;
        this.main_nest_pos = [0, 0, 0];

        this.birds = [
            new MyBird(this, this.main_bird_id, false, this.main_nest_pos[0], this.main_nest_pos[1], this.main_nest_pos[2], false),
            new MyBird(this, this.p1_id, true, this.p1_pos[0], this.p1_pos[1], this.p1_pos[2], Math.PI/2, false),
            new MyBird(this, this.p2_id, true, this.p2_pos[0], this.p2_pos[1], this.p2_pos[2], -Math.PI/2, true)
        ];
        this.branches = [
            new MyTreeBranch(this, -8, 0, 6, 0, 3, 0.3), 
            new MyTreeBranch(this, 5, 0, 8, Math.PI/3, 3, 0.3), 
            new MyTreeBranch(this, 1, 0, -10, 2*Math.PI/3, 3, 0.3), 
            new MyTreeBranch(this, -15, 0, -7, Math.PI/2, 3, 0.3)
        ];
        this.nests = [
            new MyNest(this, 60, this.main_nest_pos[0], this.main_nest_pos[1], this.main_nest_pos[2], this.main_bird_id),
            new MyNest(this, 30, this.p1_pos[0], this.p1_pos[1], this.p1_pos[2], this.p1_id),
            new MyNest(this, 30, this.p2_pos[0], this.p2_pos[1], this.p2_pos[2], this.p2_id)
        ];

        this.eggs = [];
        let eggs_per_nest = 3;

        for (let i = 0; i < eggs_per_nest; i++) {
            this.eggs.push(new MyEgg(this, this.main_nest_pos[0], this.main_nest_pos[1], this.main_nest_pos[2], this.main_bird_id));
            this.eggs.push(new MyEgg(this, this.p1_pos[0], this.p1_pos[1], this.p1_pos[2], this.p1_id));
            this.eggs.push(new MyEgg(this, this.p2_pos[0], this.p2_pos[1], this.p2_pos[2], this.p2_id));
        }
        this.total_game_eggs = this.eggs.length - eggs_per_nest;

        // Objects connected to MyInterface
        this.speedFactor = 1;
        this.scaleFactor = 1;

        this.updateGameScore();
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
            this.birds[1].update(t, this.speedFactor);
            this.birds[2].update(t, this.speedFactor);
        }
        else {
            this.birds[0].update(t, this.speedFactor);
        }
        this.checkKeys();
    }

    updateBirdsScale() {
        for (let i = 0; i < this.birds.length; i++) 
            this.birds[i].setScaleFactor(this.scaleFactor);
    }

    isGameMode() {
        return this.gameMode;
    }

    updateGameScore() {
        let scores = [0, 0, 0];
        for (let i = 0; i < this.eggs.length; i++) {
            scores[this.eggs[i].getBirdID()] += 1;
        }

        this.p1Div.innerHTML = scores[1];
        this.p2Div.innerHTML = scores[2];

        if (scores[1] == this.total_game_eggs){
            this.endGame("Player 1 won!!!");
        }
        else if (scores[2] == this.total_game_eggs) {
            this.endGame("Player 2 won!!!");
        }
    }

    endGame(message) {
        alert(message);
        this.changeState();
    }

    changeState() {

        if(this.gameMode)
            this.minigameDiv.style.display = "block";
        else
            this.minigameDiv.style.display = "none";

        for (let i = 0; i < this.birds.length; i++) {
            /* Reset position */
            this.birds[i].reset();

            /* Retrieve branches */
            let branches = this.birds[i].removeBranches();
            for (let j = 0 ; j < branches.length; j++) 
                this.addBranch(branches[j]);

            /* Retrieve egg */
            let egg = this.birds[i].removeEgg();
            if (egg) this.addEgg(egg);
        }

        /* Reset positions */
        for (let i = 0 ; i < this.branches.length; i++) this.branches[i].reset();
        for (let i = 0 ; i < this.eggs.length; i++) this.eggs[i].reset();
        
        this.updateGameScore();
    }

    checkKeys() {

        let first_bird = this.gameMode ? this.birds[1] : this.birds[0];
        
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
            if (this.gameMode)
                this.changeState();
            else
                first_bird.reset();
        }
        if (this.gui.isKeyPressed("KeyP")) {
            first_bird.dropBird();
        }

        if (!this.gameMode) return;
        
        if (this.gui.isKeyPressed("ArrowUp")) {
            this.birds[2].accelerate(this.speedFactor)
        }
        if (this.gui.isKeyPressed("ArrowDown")) {
            this.birds[2].accelerate(-this.speedFactor);
        }
        if (this.gui.isKeyPressed("ArrowRight")) {
            this.birds[2].turn((Math.PI/6) / 3 * -this.speedFactor);
        }
        if (this.gui.isKeyPressed("ArrowLeft")) {
            this.birds[2].turn((Math.PI/6) / 3 * this.speedFactor);
        }
        if (this.gui.isKeyPressed("ShiftRight")) {
            this.birds[2].dropBird();
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
            if (this.gameMode && this.eggs[i].birdID == this.main_bird_id) continue;
            if (!this.gameMode && this.eggs[i].birdID != this.main_bird_id) continue;
                   
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
            this.birds[1].display();
            this.birds[2].display();

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
        }
        else {
            this.birds[0].display();

            this.pushMatrix();
            this.translate(this.nests[0].position[0], this.nests[0].position[1], this.nests[0].position[2]);
            this.scale(0.5, 0.5, 0.5);
            this.nests[0].display();
            this.popMatrix();

            this.displayBranches();            
        }
            
        this.displayEggs();

        
        /* END draw objects at ground height */        

        this.popMatrix();
        // ---- END Primitive drawing section
    }
}