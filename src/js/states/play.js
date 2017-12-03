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
        this.text = {};

        this.currentStage = 1;
        this.stageFileLabels = {
            1: 'text/plain',
            2: 'application/json',
            3: '3D Video File'
        };

        this.overallScore = this.initScore();

        this.phraseStr = 'it is a long established fact that a reader';
        // this.phraseStr = 'abcde';
        this.phraseSpeed = config.INITIAL_PHRASE_SPEED;

        this.createSounds();

        this.drawScene();

        this.addKeyListener();

        this.drawIncomingFile('file');
    }

    drawScene() {
        // draw user sprite
        this.sprites.server = this.game.add.sprite(config.CANVAS_WIDTH - 200, config.CANVAS_HEIGHT / 2 - 100, 'server');

        // draw server sprite
        this.sprites.user = this.game.add.sprite(20, config.CANVAS_HEIGHT / 2 - 100, 'user');

        // draw algorithm bar
        this.sprites.algBarSprite = this.game.add.sprite(150, config.CANVAS_HEIGHT / 2, 'algorithm');

        // Alg bar group that will hold the phrase
        this.algBarGroup = this.game.add.group();
        this.algBarGroup.x = 150;
        this.algBarGroup.y = config.CANVAS_HEIGHT / 2;

        // mask on the edges
        this.drawAlgMask();

        this.drawFileProgressText();

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
        if (!this.phrase || this.phrase.length === 0) return;

        let char = String.fromCharCode(e.which).toLowerCase();
        let foundMatch = false;

        // See if there are any visible uncompressed letters
        for (let i = 0; i < this.uncompressedLetters.length; i++) {
            let letter       = this.uncompressedLetters[i];
            let letterSprite = letter.children[1];

            if (this.isLetterVisible(letter) && char === letterSprite.key && !letterSprite.data.compressed) {
                console.log('matched!', char);

                this.sounds.compress.play();

                // Shrink the letter out if it is a red letter
                let letterPos = letter.position;
                let shrinkTween = this.game.add.tween(letter)
                    .to({width: 0, height: 0},
                        100,
                        Phaser.Easing.Linear.None,
                        true
                    );
                shrinkTween.onComplete.add(() => {
                   letter.children[0].tint = config.COMPRESSED_TINT;
                });
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
                foundMatch = true;
                break;
            }
        }

        // If no matches found see if there are any matching compressed characters to corrupt
        if (!foundMatch) {
            for (let i = 0; i < this.compressedLetters.length; i++) {
                let letter       = this.compressedLetters[i];
                let letterSprite = letter.children[1];

                if (this.isLetterVisible(letter) && char === letterSprite.key && !letterSprite.data.lossed) {
                    console.log('matched compressed!', char);

                    this.sounds.lost.play();

                    // Draw the red 'x' sprite over the character
                    letter.create(0, 0, 'lost');

                    // Change tint to lost
                    letter.children[0].tint = config.LOST_TINT;

                    letterSprite.data.lossed = true;
                    break;
                }
            }
        }
    }

    isLetterVisible(letter) {
        return letter.x + config.LETTER_BLOCK_WIDTH > 0 &&
            letter.x < config.ALG_BAR_WIDTH;
    }

    update() {
        if (!this.phrase || this.phrase.children.length === 0) return;

        let i = this.phrase.children.length;

        while(i--) {
            let letter = this.phrase.children[i];
            let char = letter.children[1].key;

            letter.x -= this.phraseSpeed;

            if (letter.x < -config.LETTER_BLOCK_WIDTH) {
                // letter block is off the screen lets record it
                let letterTint = letter.children[0].tint;
                if (letterTint === config.COMPRESSED_TINT) {
                    this.phraseScore.totalCompressed++;
                }
                else if (letterTint === config.UNCOMPRESSED_TINT) {
                    this.phraseScore.totalUncompressed++;
                }
                else if (letterTint === config.LOST_TINT) {
                    this.phraseScore.totalLost++;
                }

                if (i === this.phrase.children.length - 1) {
                    // the is the last block off screen, lets destroy this phrase
                    console.log('[play] last letter off screen', char);
                    console.log('[play] destroying phrase');
                    this.uncompressedLetters = [];
                    this.compressedLetters = [];
                    this.phrase.destroy();

                    this.sounds.typingSong.fadeOut(500);

                    // handle end phase, perform user reaction and save score
                    this.handleEndStage();

                    break;
                }

                letter.destroy(); // we are done with this letter
            }
        }
    }

    beginPhrase(str) {
        this.phrase               = this.game.add.group();
        this.phrase.x             = 0;
        this.phrase.y             = config.LETTER_BLOCK_HEIGHT / 2;
        this.uncompressedLetters  = [];
        this.compressedLetters    = [];
        this.phraseScore          = this.initScore();
        this.phraseScore.numChars = str.length;

        for (let i = 0; i < str.length; i++) {
            let letter  = null;
            let xOffset = config.ALG_BAR_WIDTH + (i * config.LETTER_BLOCK_WIDTH);
            let char    = str[i];

            if (char === ' ' || this.between(1, 3) < 3) {
                letter = new Letter(char, xOffset, 0, config.UNCOMPRESSED_TINT, this.game);
                this.uncompressedLetters.push(letter.group);
            }
            else {
                letter = new Letter(char, xOffset, 0, config.COMPRESSED_TINT, this.game);
                this.compressedLetters.push(letter.group);
            }

            this.phrase.add(letter.group);
        }

        this.algBarGroup.add(this.phrase);

        this.sounds.typingSong.play();
    }

    initScore() {
        return {
            totalCompressed  : 0,
            totalUncompressed: 0,
            totalLost        : 0,
            numChars         : 0,
        };
    }

    addOverallScore(score) {
        this.overallScore.totalCompressed += score.totalCompressed;
        this.overallScore.totalUncompressed += score.totalUncompressed;
        this.overallScore.totalLost += score.totalLost;
        this.overallScore.numChars += score.numChars;
    }

    drawFileProgressText() {
        let style = { font: "bold 40px Monospace", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

        this.text.fileProgress = this.game.add.text(0, 0, `File ${this.currentStage} of ${config.NUM_STAGES}`, style);
        this.text.fileProgress.setTextBounds(0, this.sprites.algBarSprite.y - 100, config.CANVAS_WIDTH, 80);
    }

    drawIncomingFile() {
        let startPosition = this.sprites.user.position;
        let endPosition   = this.sprites.server.position;
        let time          = 4000;
        let arcPeakY      = 10;
        let fileGroup     = this.game.add.group();
        let fileSprite    = this.game.add.sprite(0, 0, 'file');

        fileGroup.position.set(startPosition.x, startPosition.y);
        fileGroup.add(fileSprite);


        // Draw file label
        let style = { font: "24px Monospace", fill: "#fff", align: "left"};
        let fileLabel = this.game.add.text(0, fileSprite.height + 2, `Request: ${this.stageFileLabels[this.currentStage]}`, style);
        fileLabel.x -= fileLabel.width / 4;
        fileGroup.add(fileLabel);

        this.sounds.fileRequest.play();

        // tween the object from left to right in a linear fashion
        this.game.add.tween(fileGroup.position)
            .to({x: endPosition.x},
                time,
                Phaser.Easing.Linear.None,
                true
            );

        // chain tween the object up to the Y value with a sinusoidal ease out, then back down with an ease in
        let fileTween = this.game.add.tween(fileGroup.position)
            .to({y: arcPeakY}, time * 0.5, Phaser.Easing.Sinusoidal.Out)
            .to({y: endPosition.y}, time * 0.5, Phaser.Easing.Sinusoidal.In)
            .start();

        fileTween.onComplete.add(() => {
            this.beginPhrase(this.phraseStr);
            fileGroup.destroy();
        }, this)
    }

    handleEndStage() {
        console.log('[play] Stage complete, score:', this.phraseScore);
        this.addOverallScore(this.phraseScore);


        if (this.currentStage === config.NUM_STAGES) {
            // Handle game complete and go to score state
            console.log('[play] Game Complete!');
        }

        this.currentStage++;

        // Draw the speech bubble and save a reference to it
        let speechBubble = this.drawSpeechBubble('man that was the slowest download EVER!');

        // schedule event to remove speech bubble
        this.game.time.events.add(3000, () => {
            let tween = this.game.add.tween(speechBubble)
                .to({alpha: 0},
                    500,
                    Phaser.Easing.Linear.None,
                    true
                );
            tween.onComplete.add(() => {
                console.log('[play] destroying speech bubble');
                speechBubble.destroy();

                if (this.currentStage <= config.NUM_STAGES) {
                    console.log('[play] starting next stage');
                    this.text.fileProgress.setText(`File ${this.currentStage} of ${config.NUM_STAGES}`);
                    this.drawIncomingFile('file');
                }

            });
        });

    }

    drawSpeechBubble(text) {
        let group = this.game.add.group();

        // Draw Speech Bubble
        let style = { font: "30px Monospace", fill: "#fff", align: "left", wordWrap: true, wordWrapWidth: 300 };
        let speechBubble = this.game.add.text(200, 70, text, style);
        let user = this.sprites.user;
        let g = this.game.add.graphics(0,0);

        // Draw the line to the speech bubble
        g.lineStyle(1, 0xFFFFFF, 1);
        g.moveTo(user.position.x + user.width - 15, user.position.y + 15);
        g.lineTo(speechBubble.position.x + speechBubble.width / 2, speechBubble.position.y + speechBubble.height);

        group.add(speechBubble);
        group.add(g);

        return group;
    }


    createSounds() {
        this.sounds = {
            compress: this.game.add.audio('compress'),
            lost: this.game.add.audio('lost'),
            typingSong: this.game.add.audio('typingSong'),
            fileRequest: this.game.add.audio('fileRequest'),
        };

        this.sounds.compress.allowMultiple = true;
        this.sounds.lost.allowMultiple = true;

        this.sounds.typingSong.onFadeComplete.add(() => {
            console.log('[play] Stopping typing song');
            this.sounds.typingSong.stop();
            this.sounds.typingSong.volume = 1;
        });
    }
}
