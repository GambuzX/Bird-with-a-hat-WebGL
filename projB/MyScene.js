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

        // Initialize scene objects
        this.axis = new CGFaxis(this);
        this.bird = new MyBird(this);
        this.terrain = new MyTerrain(this);        
        this.branches = [
            new MyTreeBranch(this, -8, 0, 6, 0), 
            new MyTreeBranch(this, 3, 0, 4, Math.PI/3), 
            new MyTreeBranch(this, 1, 0, -10, 2*Math.PI/3), 
            new MyTreeBranch(this, -15, 0, -7, Math.PI/2)
        ];
        this.nest = new MyNest(this);

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
        this.bird.update(t, this.speedFactor);
        this.checkKeys();
    }

    checkKeys() {
        // Check for keys codes e.g. in https://keycode.info/
        if (this.gui.isKeyPressed("KeyW")) {
            this.bird.accelerate(this.speedFactor)
        }
        if (this.gui.isKeyPressed("KeyS")) {
            this.bird.accelerate(-this.speedFactor);
        }
        if (this.gui.isKeyPressed("KeyD")) {
            this.bird.turn((Math.PI/6) / 3 * -this.speedFactor);
        }
        if (this.gui.isKeyPressed("KeyA")) {
            this.bird.turn((Math.PI/6) / 3 * this.speedFactor);
        }
        if (this.gui.isKeyPressed("KeyR")) {
            this.bird.reset();
        }
        if (this.gui.isKeyPressed("KeyP")) {
            this.bird.dropBird();
        }
    }

    branchesNear(position, compDistance) {
        let near = [];
        for (let i = this.branches.length-1; i >= 0; i--) {
            if (this.euclidianDistance(position, this.branches[i].position) <= compDistance) {
                near.push(this.branches[i]);
                this.branches.splice(i, 1);
            }
        }
        return near;
    }

    euclidianDistance(pos1, pos2) {
        return Math.sqrt(Math.pow(pos1[0]-pos2[0], 2) + Math.pow(pos1[1]-pos2[1], 2) + Math.pow(pos1[2]-pos2[2], 2));
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
        let ground_height = 3;
        this.pushMatrix();
        this.translate(0, ground_height, 0);

        this.pushMatrix();
        this.translate(0, this.bird.birdHeight, 0);
        this.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);
        this.bird.display();
        this.popMatrix();

        /* Draw branches */
        for (let i = 0 ; i < this.branches.length; i++) {
            this.branches[i].displayInPosition();
        }
        /* END draw objects at ground height */

        this.pushMatrix();
        this.nest.display();
        this.popMatrix();

        this.popMatrix();
        // ---- END Primitive drawing section
    }
}