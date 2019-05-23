class MyNest extends CGFobject {
    constructor(scene, x, y, z) {
        super(scene);

        this.branch = new MyTreeBranch(scene);

        this.position = [x, y, z];

        this.ang_inc = Math.PI/12;
        this.randomizeValues();
    }

    randomizeValues() {        
        this.rand_rotations = [];
        this.rand_sizes = [];
        this.rand_translatios = [];

        for (let i = 0; i < 2*Math.PI/this.ang_inc; i++) {
            this.rand_rotations.push(Math.random());
            this.rand_sizes.push(Math.random());
            this.rand_translatios.push(Math.random());
        }
    }

    display() {
        let ang_inc = Math.PI/12;
        let i = 0;
        for (let ang = 0 ; ang < 2*Math.PI; ang += ang_inc) {
            this.scene.pushMatrix();
            this.scene.rotate(ang, 0, 1, 0);
            this.scene.rotate(Math.PI/12 * this.rand_rotations[i], -1, 0, 0);
            this.scene.scale(this.rand_sizes[i]*0.4+0.1,this.rand_sizes[i]*0.4+0.1,1);
            this.scene.translate(0,0,0.5*this.rand_translatios[i]);
            this.branch.display();
            this.scene.popMatrix();
            i++;
        }
    }
}