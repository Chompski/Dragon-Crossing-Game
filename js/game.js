//create a new scene
let gameScene = new Phaser.Scene('Game');

// initisate scene params
gameScene.init = function () {
    // player speed
    this.playerSpeed = 2;

    // enemy speeds
    this.enemyMinSpeed = 1;
    this.enemyMaxSpeed = 2.5;

    this.repeat = 4;

    //Boundaries
    this.enemyMinY = 80;
    this.enemyMaxY = 280;

    // not terminating
    this.isTerminating = false;
}

// Load assets
gameScene.preload = function () {
    // load images
    this.load.image('bg', 'assets/background.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('dragon', 'assets/dragon.png');
    this.load.image('goal', 'assets/treasure.png');
}

//called once after preload
gameScene.create = function () {
    //create bg sprite
    let bg = this.add.sprite(0, 0, 'bg')
    //change origin to top left corner
    bg.setOrigin(0, 0)

    // create the player
    this.player = this.add.sprite(50, 180, 'player');
    this.player.setScale(0.5)

    //Create Goal
    this.goal = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'goal');
    this.goal.setScale(0.6);

    // create the enemy
    this.enemies = this.add.group({
        key: 'dragon',
        repeat: this.repeat,
        setXY: {
            x: 110,
            y: 100,
            stepX: 80,
            stepY: 20
        }
    });
    // set scale of all group elements
    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5);

    //flip and Set enemy speed
    Phaser.Actions.Call(this.enemies.getChildren(), function (dragon) {
        //flip
        dragon.flipX = true;

        //set speed

        let dir = Math.random() < 0.5 ? 1 : -1;
        let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed)
        dragon.speed = dir * speed;

    }, this);




}

// this is called up to 60 times per second
gameScene.update = function () {

    //dont execute if term
    if (this.isTerminating) return;

    if (this.input.activePointer.isDown) {
        this.player.x += this.playerSpeed;
    }


    // treasure overlap check
    let playerRect = this.player.getBounds();
    let treasureRect = this.goal.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
        //restart game
        return this.gameOver();
    }



    //get enemies
    let enemies = this.enemies.getChildren();
    let numEnemies = enemies.length;

    for (let i = 0; i < numEnemies; i++) {

        //Enemy movement
        enemies[i].y += enemies[i].speed;
        // check min Y
        let conditionUp = enemies[i].speed < 0 && enemies[i].y <= this.enemyMinY
        let conditionDown = enemies[i].speed > 0 && enemies[i].y >= this.enemyMaxY

        if (conditionUp || conditionDown) {
            enemies[i].speed *= -1;
        }
        // enemy overlap check
        let enemyRect = enemies[i].getBounds();

        if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
            return this.gameOver();
        }
    }
}

gameScene.gameOver = function () {
    // ini game over
    this.isTerminating = true
    // shake
    this.cameras.main.shake(500);
    //listen
    this.cameras.main.on('camerashakecomplete', function (camera, effect) {
        //fade out
        this.cameras.main.fade(500)
    
    }, this);
    this.cameras.main.on('camerafadeoutcomplete', function (camera, effect) {
        this.scene.restart();
    }, this);
};
//set config
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: gameScene
};

// create a new game
let game = new Phaser.Game(config);