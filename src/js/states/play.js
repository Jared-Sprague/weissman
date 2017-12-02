/**
 * This is the main game code
 */
class PlayState extends Phaser.State {


    create() {
        console.log('[play] entering play state');

        // for easy access to this state for debugging in browser console
        window.play = this;
        this.between = this.game.rnd.between.bind(this.game.rnd);

        this.drawScene();

        this.zoomAlgWindow();

        this.tweens = {};
    }

    drawScene() {
        this.sprites = {};

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

    zoomAlgWindow() {

        this.tweens.zoomAlg = this.game.add.tween(this.sprites.algorithm.scale)
            .to({x: 1, y: 1},
                1000,
                Phaser.Easing.Linear.None,
                true
            );

        this.tweens.zoomPosAlg = this.game.add.tween(this.sprites.algorithm.position)
            .to({x: 150, y: config.CANVAS_HEIGHT / 2 - 200},
                1000,
                Phaser.Easing.Linear.None,
                true
            );
    }

}
