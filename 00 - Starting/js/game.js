//create a new scene
let gameScene = new Phaser.Scene('Game');

// initisate scene params
gameScene.init = function(){
    // player speed
    this.playerSpeed = 2;

    // enemy speeds
    this.enemyMinSpeed = 1;
    this.enemyMaxSpeed = 3;


    //Boundaries
    this.enemyMinY = 80;
    this.enemyMaxY = 280;
}

// Load assets
gameScene.preload = function(){
    // load images
    this.load.image('bg','assets/background.png');
    this.load.image('player','assets/player.png');
    this.load.image('dragon','assets/dragon.png');
    this.load.image('goal','assets/treasure.png');
}

//called once after preload
gameScene.create = function() {
    //create bg sprite
   let bg = this.add.sprite(0,0, 'bg')
   //change origin to top left corner
   bg.setOrigin(0,0)

   // create the player
   this.player = this.add.sprite(50,180, 'player');
   this.player.setScale(0.5)

   //Create Goal
   this.goal = this.add.sprite(this.sys.game.config.width-80, this.sys.game.config.height/2, 'goal');
   this.goal.setScale(0.6);

     // create the enemy
     this.dragon1 = this.add.sprite(120,this.sys.game.config.height/2, 'dragon');
     this.dragon1.setScale(0.5);
     this.dragon1.flipX = true;
     //Set enemy speed
     let dir = Math.random() < 0.5? 1 : -1;
     let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed)
     this.dragon1.speed = dir * speed;

     this.dragon2 = this.add.sprite(260,180, 'dragon');
     this.dragon2.setScale(0.8);
     this.dragon2.flipX = true;

}

// this is called up to 60 times per second
gameScene.update = function(){
    if(this.input.activePointer.isDown) {
        this.player.x += this.playerSpeed;
    }

    // treasure overlap check
    let playerRect = this.player.getBounds();
    let treasureRect = this.goal.getBounds();

    if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect,treasureRect)){
        //restart game
        this.scene.restart();
    }

   //Enemy movement
    this.dragon1.y += this.dragon1.speed
   // check min Y
   let conditionUp = this.dragon1.speed < 0 && this.dragon1.y <= this.enemyMinY
   let conditionDown = this.dragon1.speed > 0 && this.dragon1.y >= this.enemyMaxY
   
   if (conditionUp || conditionDown) {
        this.dragon1.speed *= -1;
    }

   
}
//set config
let config = {
    type: Phaser.AUTO,
    width:640,
    height:360,
    scene:gameScene
};

// create a new game
let game = new Phaser.Game(config);