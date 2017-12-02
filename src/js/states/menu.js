class MenuState extends Phaser.State {

    create() {
        console.log('[menu] showing main menu');

        window.menu = this;

        // Start the menu music
        // this.music = this.game.add.audio('MenuMusic', 0.7, true);
        // this.music.play();

        // Draw the background
        // const bg = this.game.add.sprite(0, 0, 'background');
        // bg.tint = 0x3f3f3f;

        // Add the game logo
        const logo = this.game.add.sprite(this.game.world.centerX, 120, 'logo');
        logo.anchor.set(0.5, 0);
        logo.scale.set(0.96, 0.96);


        // Play button
        // const btnHum = this.game.add.button(
        //     this.game.world.centerX,
        //     this.game.world.height - 130,
        //     'btn-play',
        //     this.next,
        //     this,
        //     1, // over
        //     0, // out
        //     2  // down
        // );
        // btnHum.anchor.set(0.5, 1);
        // btnHum.onDownSound = this.game.add.audio('ButtonTap');
        // btnHum.onOverSound = this.game.add.audio('Barrier');
        // btnHum.input.useHandCursor = false;


        if (config.SKIP_MENU) {
            this.next();
        }



        // this.drawMissileHelp();
        // this.drawBarrierHelp();

    }

    update() {
    }

    next() {
        this.game.stateTransition.to('PlayState');
    }

    shutdown() {
        this.music.stop();
    }

    // drawBarrierHelp() {
    //     const x = -370;
    //     const y = 68;
    //     const barrier = this.game.add.sprite(this.game.world.centerX + x - 100, this.game.world.height - 670 + y, 'barrier');
    //     const font = this.game.add.retroFont('gelatin-font', 70, 110, this.fontSet, 18, 0, 0);
    //     const text = this.game.add.image(80, 80, font);
    //     text.scale.set(0.5,0.5);
    //     font.text = 'Barrier';
    //     text.tint = 0x777777;
    //     text.position.x = this.game.world.centerX + x;
    //     text.position.y = this.game.world.height - 608 + y;
    // }
    //
    // drawMissileHelp() {
    //     const x = 140;
    //     const y = 40;
    //     const mouse = this.game.add.sprite(this.game.world.centerX - 44 + x, this.game.world.height - 600 + y, 'mouse');
    //     mouse.anchor.set(0.5, 0.5);
    //
    //     const font = this.game.add.retroFont('gelatin-font', 70, 110, this.fontSet, 18, 0, 0);
    //     const text = this.game.add.image(80, 80, font);
    //     text.scale.set(0.5,0.5);
    //     font.text = 'Missile';
    //     text.tint = 0x777777;
    //     text.position.x = this.game.world.centerX + x;
    //     text.position.y = this.game.world.height - 608 + y;
    //
    // }

}
