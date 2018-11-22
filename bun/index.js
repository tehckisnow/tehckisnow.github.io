//@ts-check

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelart: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

var map;
var player;
let facing = 'right';
var cursors;
var ground, bg, carrots;
var text;
var moveMode = 'ground';
var keyW;
var keyA;
var keyS;
var keyD;
var score = 0;
var text;

function preload(){
  this.load.spritesheet('bunno', 
    'assets/bunno.png', 
    {frameWidth: 32, frameHeight: 46});

  this.load.image("tiles", "assets/bun tileset.png");
  this.load.tilemapTiledJSON("map", "assets/bunno map.json");
}

function create(){
const map = this.make.tilemap({ key: "map"});

const tileset = map.addTilesetImage("bun tileset", "tiles");

bg = map.createStaticLayer("bg", tileset, 0, 0);
ground = map.createStaticLayer("ground", tileset, 0, 0);
ground.setCollisionByExclusion([-1]);

//var carrots = map.addTilesetImage('tiles');
carrots = map.createDynamicLayer("carrots", tileset, 0, 0);
//when collision with carrot, call collectCarrot()

//create player
player = this.physics.add.sprite(100, 450, 'bunno');
//player.setBounce(0.2);
player.setCollideWorldBounds(true);
//resize hitbox
player.setSize(17, 39, true);
//animations
this.anims.create({
  key: 'left',
  frames: this.anims.generateFrameNumbers('bunno', {
    start: 4, end: 7}),
    frameRate: 10,
    repeat: -1
});
this.anims.create({
  key: 'idleRight',
  frames: [ {key: 'bunno', frame: 0 } ],
  frameRate: 20
});
this.anims.create({
  key: 'fallLeft',
  frames: [ {key: 'bunno', frame: 6 } ],
  frameRate: 20
});
this.anims.create({
  key: 'fallRight',
  frames: [ {key: 'bunno', frame: 2 } ],
  frameRate: 20
});
this.anims.create({
  key: 'idleLeft',
  frames: [ {key: 'bunno', frame: 4 } ],
  frameRate: 20
});
this.anims.create({
  key: 'right',
  frames: this.anims.generateFrameNumbers('bunno', {
    start: 0, end: 3
  }),
  frameRate: 10,
  repeat: -1
});

function collectCarrot(sprite, tile){
  carrots.removeTileAt(tile.x, tile.y);
  score ++;
  text.setText('score: ' + score);
  return false;
}

//physics collider
this.physics.add.collider(player, ground);

carrots.setTileIndexCallback(14, collectCarrot, this);
this.physics.add.overlap(player, carrots);

//controls
cursors = this.input.keyboard.createCursorKeys();

//main camera
  //set camera bounds to map
  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  //make camera follow player
  this.cameras.main.startFollow(player);
  //set a background color
  this.cameras.main.setBackgroundColor('#ccccff');

  //wasd
  keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

  text = this.add.text(20, 570, '0', {
    fontSize: '20px',
    fill: '#ffffff'
  });
  text.setScrollFactor(0);

}

function update(){

//controls/animation
  //if player is on the ground:
  if (player.body.blocked.down){
    if (cursors.left.isDown || keyA.isDown){
      player.setVelocityX(-160); //move character left
      player.anims.play('left', true); //play animation 'left'
      facing = 'left';
    }else if (cursors.right.isDown || keyD.isDown){
      player.setVelocityX(160);
      player.anims.play('right', true);
      facing = 'right';
    }else {
      player.setVelocityX(0); //stop movement
      if (facing == 'right'){
        player.anims.play('idleRight', true);
      }else if (facing == 'left'){
        player.anims.play('idleLeft', true);
      }
    }
    //jump
    if ((cursors.up.isDown || keyW.isDown) && player.body.blocked.down){
      player.setVelocityY(-230);
    }
  }else {
    if (facing == 'right'){
      player.anims.play('fallRight', true);
    }else if (facing == 'left'){
      player.anims.play('fallLeft', true);
    }

    if (cursors.left.isDown || keyA.isDown){
      player.setVelocityX(-100); //move character left
      
      facing = 'left';
    }else if (cursors.right.isDown || keyD.isDown){
      player.setVelocityX(100);
      
      facing = 'right';
    }
  }

}