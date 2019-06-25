class MyLightning extends MyLSystem {
    constructor(scene) {
        super(scene);
        this.axiom = "X";
        this.ruleX = "F[-X][X]F[-X]+FX";
        this.ruleX2 = "FX+[-X]F[X][-X]F";
        this.productions = {
            "F":["FF"],
            "X":[
                this.ruleX,
                this.ruleX2
            ]
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
        if (this.animating) return;
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
        this.scene.setGlobalAmbientLight(1, 1, 1, 1);
        this.scene.pushMatrix();
        this.scene.scale(this.scale, this.scale, this.scale);

        var i;

        let pushCounter = 0;
        // percorre a cadeia de caracteres
        let limit = Math.min(this.depth, this.axiom.length);
        for (i=0; i<limit; ++i){

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
                    pushCounter++;
                    break;

                case "]":
                    // pop
                    this.scene.popMatrix();
                    pushCounter--;
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

        for (let i = 0; i < pushCounter; i++) {
            this.scene.popMatrix();
        }

        if (limit == this.axiom.length) {
            this.depth = 0;
        }
        this.scene.popMatrix();
        this.scene.setGlobalAmbientLight(0.1,0.1,0.1,1);
    }
}