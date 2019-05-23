class MyNest extends CGFobject {
    constructor(scene) {
        super(scene);

        this.branch = new MyTreeBranch(scene);
    }

    display() {
        let ang_inc = Math.PI/6;
        for (let ang = 0 ; ang < 2*Math.PI; ang += ang_inc) {
            this.scene.pushMatrix();
            this.scene.rotate(ang, 0, 1, 0);
            this.scene.rotate(Math.PI/12, -1, 0, 0);
            this.branch.display();
            this.scene.popMatrix();
        }
    }
}