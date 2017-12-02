class PreloadState extends Phaser.State {
    preload() {
        console.log('[preload] preloading assets');

        // loading bar

        this.loadingBar = this.game.add.sprite(config.CANVAS_WIDTH/2 - 300, this.game.world.centerY, 'loading-bar');
        this.load.setPreloadSprite(this.loadingBar);
        this.loadingBar.anchor.set(0, 0.5);

        // images

        this.game.load.image('logo', 'images/logo.png');
        this.game.load.image('user', 'images/user.png');
        this.game.load.image('server', 'images/server.png');
        this.game.load.image('algorithm', 'images/algorithm.png');
        this.game.load.image('file', 'images/file.png');
        this.game.load.image('wire', 'images/wire.png');



        // Sprite sheets

        this.game.load.spritesheet('btn-play', 'images/button-play.png', 320, 120);

        // Fonts

        // this.game.load.image('gelatin-font', 'images/big/gelatin-font.png');

        // audio

        // this.game.load.audio('MenuMusic', 'sounds/Songs/MainMenu_Track.mp3');
        // this.game.load.audio('AsteroidHit1'     , 'sounds/Effects/Effect_AsteroidHit1.mp3');

    }

    create() {
        this.state.start('MenuState');
    }
}

