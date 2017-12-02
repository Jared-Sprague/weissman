/**
 * This is the main game code
 */
class PlayState extends Phaser.State {


    create() {
        console.log('[play] entering play state');

        // for easy access to this state for debugging in browser console
        window.play = this;
        this.between = this.game.rnd.between.bind(this.game.rnd);

        this.sprites = {};
        this.tweens = {};

        this.drawScene();

        this.addKeyListener();

        this.zoomAlgWindow();
    }

    drawScene() {
        // draw user sprite
        this.sprites.user = this.game.add.sprite(config.CANVAS_WIDTH - 200, config.CANVAS_HEIGHT / 2 - 100, 'user');

        // draw wire sprite
        this.sprites.wire = this.game.add.sprite(config.CANVAS_WIDTH / 2 - 100, config.CANVAS_HEIGHT / 2 + 50, 'wire');

        // draw server sprite
        this.sprites.server = this.game.add.sprite(20, config.CANVAS_HEIGHT / 2 - 100, 'server');

        // draw algorithm sprite
        this.sprites.algorithm = this.game.add.sprite(300, config.CANVAS_HEIGHT / 2 + 30, 'algorithm');
        this.sprites.algorithm.scale.set(0.1, 0.3);
    }

    addKeyListener() {
        let keyListener = this.typing.bind(this);
        window.addEventListener('keydown', keyListener, false);
    }

    typing(e) {
        let char = String.fromCharCode(e.which).toLowerCase();
        console.log('char', char);

        // See if the active word contains one of the letters
        for (let i = 0; i < this.word.children.length; i++) {
            let letter = this.word.children[i];
            let xPositionOffset = ((i + 1) * 50) - 25;

            let letterSprite = letter.children[1];
            if (char === letterSprite.key && !letterSprite.data.compressed) {
                console.log('matched!', char);

                this.game.add.tween(letter)
                    .to({width: 0, height: 0},
                        100,
                        Phaser.Easing.Linear.None,
                        true
                    );

                this.game.add.tween(letter)
                    .to({x: xPositionOffset, y: 25},
                        100,
                        Phaser.Easing.Linear.None,
                        true
                    );

                letterSprite.data.compressed = true;
                break;
            }
        }

    }

    zoomAlgWindow() {

        this.tweens.zoomAlg = this.game.add.tween(this.sprites.algorithm.scale)
            .to({x: 1, y: 1},
                1000,
                Phaser.Easing.Linear.None,
                true
            );
        this.tweens.zoomAlg.onComplete.add(() => {
            this.drawWord('hello');
        }, );

        this.tweens.zoomPosAlg = this.game.add.tween(this.sprites.algorithm.position)
            .to({x: 150, y: config.CANVAS_HEIGHT / 2 - 200},
                1000,
                Phaser.Easing.Linear.None,
                true
            );
    }

    drawWord(str) {
        this.word   = this.game.add.group();
        this.word.x = 175;
        this.word.y = config.CANVAS_HEIGHT / 2 - 175;

        for (let i = 0; i < str.length; i++) {
            let xOffset = i * 50;
            let letter = new Letter(str[i], xOffset, 0, 0xff0000, this.game);
            this.word.add(letter.group);
        }

        this.game.add.tween(this.word)
            .to({x: 950},
                2000,
                Phaser.Easing.Linear.None,
                true
            );
    }
}
