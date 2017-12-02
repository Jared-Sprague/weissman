class Letter {

    /**
     * Create a new letter sprite
     * @param letter
     * @param x
     * @param y
     * @param bgTint
     * @param game
     */
    constructor(letter, x, y, bgTint, game) {
        this.letter = letter;
        this.x      = x;
        this.y      = y;
        this.bgTint = bgTint;
        this.game = game;

        this.bgSprite = this.game.add.sprite(x, y, 'letter-bg');
        this.bgSprite.tint = bgTint;

        this.letterSprite = this.game.add.sprite(x, y, letter);

        this.group = this.game.add.group();

        this.group.add(this.bgSprite);
        this.group.add(this.letterSprite);
    }
}
