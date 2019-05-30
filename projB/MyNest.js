class MyNest extends CGFobject {
    constructor(scene, x, y, z) {
        super(scene);

        this.circle = new MyCircle(scene, 8);
        this.branch = new MyTreeBranch(scene, 0, 0, 0, 0, 2, 0.2);

        this.position = [x, y, z];

        this.ang_inc = Math.PI/48;
        this.randomizeValues();

        this.leavesMat = new CGFappearance(this.scene);
        this.leavesMat.setAmbient(1, 1, 1, 1);
        this.leavesMat.setDiffuse(1, 1, 1, 1);
        this.leavesMat.loadTexture('images/leaves.jpg');
        this.leavesMat.setTextureWrap('REPEAT', 'REPEAT');
    }

    randomizeValues() {        
        this.rand_rotations = [];
        this.rand_sizes = [];

        for (let i = 0; i < 2*Math.PI/this.ang_inc; i++) {
            this.rand_rotations.push(Math.random());
            this.rand_sizes.push(Math.random());
        }
    }

    display() {
        let i = 0;
        for (let ang = 0 ; ang < 2*Math.PI; ang += this.ang_inc) {
            this.scene.pushMatrix();
            this.scene.translate(0, -0.3, 0);
            this.scene.rotate(ang, 0, 1, 0);
            this.scene.rotate(Math.PI/6 * this.rand_rotations[i] + 5 * Math.PI/6, -1, 0, 0);
            this.scene.scale(this.rand_sizes[i]+0.1,this.rand_sizes[i]+0.1, 1);
            this.scene.translate(0, 0, this.branch.branch_length/2 + 1.5);
            this.branch.display();
            this.scene.popMatrix();
            i++;
        }
        
        this.scene.pushMatrix();
        this.scene.scale(2, 1, 2);
        this.leavesMat.apply();
        this.circle.display();
        this.scene.popMatrix();
    }
}