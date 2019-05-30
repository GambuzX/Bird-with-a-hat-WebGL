class MyLightning extends MyLSystem {
    constructor(scene) {
        super(scene);
        this.axiom = "X";
        this.productions = {
            "F":["FF"],
            "X":["F[-X][X]F[-X]+FX"]
        };
        this.angle = 25;
        this.iterations = 3;
        this.scale = 0.5;
        this.animating = false;
    }

    initGrammar() {
        this.grammar = {
            'X': new LightningSegment(this.scene),
            'F': new LightningSegment(this.scene)
        };
    }

    startAnimation(t) {
        this.axiom="X";
        this.iterate();
        this.animationInit = t;
        this.depth = 0;
        this.animating = true;
    }

    update(t) {
        let percentage = (t - this.animationInit) / 1000;

        this.depth = Math.min(this.axiom.length, Math.floor(this.axiom.length*percentage));

        if (this.depth >= this.axiom.length) {
            this.animating = false;
        }
    }

    display(){
        this.scene.pushMatrix();
        this.scene.scale(this.scale, this.scale, this.scale);

        var i;

        let pushed = false;
        // percorre a cadeia de caracteres
        for (i=0; i<this.depth; ++i){

            // verifica se sao caracteres especiais
            switch(this.axiom[i]){
                case "+":
                    // roda a esquerda
                    this.scene.rotate(this.angle, 0, 0, 1);
                    break;

                case "-":
                    // roda a direita
                    this.scene.rotate(-this.angle, 0, 0, 1);
                    break;

                case "[":
                    // push
                    this.scene.pushMatrix();
                    pushed = true;
                    break;

                case "]":
                    // pop
                    this.scene.popMatrix();
                    pushed = false;
                    break;

                case "\\":
                    this.scene.rotate(this.angle, 1, 0, 0);
                    break;

                case "/":
                    this.scene.rotate(-this.angle, 1, 0, 0);
                    break;

                case "^":
                    this.scene.rotate(this.angle, 0, 1, 0);
                    break;

                case "&":
                    this.scene.rotate(-this.angle, 0, 1, 0);
                    break;

                // processa primitiva definida na gramatica, se existir
                default:
                    var primitive=this.grammar[this.axiom[i]];

                    if ( primitive )
                    {
                        primitive.display();
                        this.scene.translate(0, 1, 0);
                    }
                    break;
            }
        }
        if (pushed) {
            this.scene.popMatrix();
        }
        this.scene.popMatrix();
    }
}