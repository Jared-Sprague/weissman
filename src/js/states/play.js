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

        this.beginPhrase('ludum dare');

        this.phraseSpeed = 2;
    }

    drawScene() {
        // draw user sprite
        this.sprites.user = this.game.add.sprite(config.CANVAS_WIDTH - 200, config.CANVAS_HEIGHT / 2 - 100, 'server');

        // draw server sprite
        this.sprites.server = this.game.add.sprite(20, config.CANVAS_HEIGHT / 2 - 100, 'user');

        // draw algorithm bar
        this.sprites.algBarSprite = this.game.add.sprite(150, config.CANVAS_HEIGHT / 2, 'algorithm');

        // Alg bar group that will hold the phrase
        this.algBarGroup = this.game.add.group();
        this.algBarGroup.x = 150;
        this.algBarGroup.y = config.CANVAS_HEIGHT / 2;

        // mask on the edges
        this.drawAlgMask();

    }

    drawAlgMask() {
        //  A mask is a Graphics object
        let mask = game.add.graphics(0, 0);

        //  Shapes drawn to the Graphics object must be filled.
        mask.beginFill(0xffffff, 1);

        //  Here we'll draw a rectangle for each group sprite
        mask.drawRect(150 + 10, config.CANVAS_HEIGHT / 2, config.ALG_BAR_WIDTH - 20, config.ALG_BAR_HEIGHT);

        //  And apply it to the Group itself
        this.algBarGroup.mask = mask;
    }

    addKeyListener() {
        let keyListener = this.typing.bind(this);
        window.addEventListener('keydown', keyListener, false);
    }

    typing(e) {
        let char = String.fromCharCode(e.which).toLowerCase();
        console.log('char [' + char + ']');

        // See if the active word contains one of the letters
        for (let i = 0; i < this.phrase.children.length; i++) {
            let letter = this.phrase.children[i];
            let xPositionOffset = ((i + 1) * config.LETTER_BLOCK_WIDTH) - config.LETTER_BLOCK_WIDTH / 2;

            let letterSprite = letter.children[1];
            if (char === letterSprite.key && !letterSprite.data.compressed) {
                console.log('matched!', char);

                // Shrink the letter out if it is a red letter
                let letterPos = letter.position;
                this.game.add.tween(letter)
                    .to({width: 0, height: 0},
                        100,
                        Phaser.Easing.Linear.None,
                        true
                    );
                this.game.add.tween(letter.position)
                    .to({
                            x: letterPos.x + (config.LETTER_BLOCK_WIDTH / 2) - this.phraseSpeed * 3,
                            y: letterPos.y + (config.LETTER_BLOCK_HEIGHT / 2),
                        },
                        100,
                        Phaser.Easing.Linear.None,
                        true
                    );

                letterSprite.data.compressed = true;
                break;
            }
        }

    }

    update() {
        let i = this.phrase.children.length;

        while(i--) {
            let letter = this.phrase.children[i];
            let char = letter.children[1].key;

            letter.x -= this.phraseSpeed;

            if (letter.x < -config.LETTER_BLOCK_WIDTH) {
                // letter block is off the screen lets record it

                if (i === this.phrase.children.length - 1) {
                    // the is the last block off screen, lets destroy this phrase
                    console.log('[play] last letter off screen', char);
                    console.log('[play] destroying phrase');
                    this.phrase.destroy();
                    break;
                }
            }
        }
    }

    beginPhrase(str) {
        this.phrase   = this.game.add.group();
        this.phrase.x = 0;
        this.phrase.y = config.LETTER_BLOCK_HEIGHT / 2;

        for (let i = 0; i < str.length; i++) {
            let xOffset = config.ALG_BAR_WIDTH + (i * config.LETTER_BLOCK_WIDTH);

            let tint = 0x384088;
            if (this.between(1, 3) < 3) {
                tint = 0xff0000;
            }

            let letter = new Letter(str[i], xOffset, 0, tint, this.game);
            this.phrase.add(letter.group);
        }

        this.algBarGroup.add(this.phrase);
    }
}
