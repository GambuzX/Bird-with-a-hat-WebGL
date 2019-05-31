class MyLSPlant extends MyLSystem {
    constructor(scene) {
        super(scene);
        this.axiom = "X";
        this.productions = {
            "F": [ "FF" ],
            "X": [ 
                "F[-X][X]F[-X]+X",
                "F[-X][X]+X",
                "F[+X]-X",
                "F[/X][X]F[\\\\X]+X",
                "F[\\X][X]/X",
                "F[/X]\\X",
                "F[^X][X]F[&X]^X",
                "F[^X]&X",
                "F[&X]^X",
            ]
        };
        this.angle = 30;
        this.iterations = 2;
        this.scaleFactor = 1;            
    }

    initGrammar(){
        this.grammar = {
            "F": new MyBranch(this.scene),
            "X": new MyLeaf(this.scene)
        };
    }
}