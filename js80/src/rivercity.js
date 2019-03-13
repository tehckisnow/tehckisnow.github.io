//settings
settings.settings(
  {
    gameCanvasSize: {x:240,y:256}
  }
);

//import assets
let sprite = new js80.assets.sprite("assets/rivercity.png", 16);
let sprite2 = new js80.assets.sprite("assets/rivercity2.png", 16);
let bg = new js80.assets.sprite("assets/riverbackground.png", 16);
let healthUnit = new js80.assets.sprite("assets/river health.png", 16);

let music1 = new js80.assets.audio("assets/RCR Stage1.mp3");
let punchSound = new js80.assets.audio("assets/punch2.wav");

//create forces
function gravityForce(id){
  let grav = 2;
  let entity = ecs.systems.entities.find(id);
  if(entity.z > 0){
    entity.components.physics.zForce -= grav;
    //entity.z -= grav;
    entity.components.render.yOffset += grav;
    entity.ground = false;

  }else {
    entity.ground = true;
    entity.z = 0;
    //reset animation if player
    if(entity.id === 0 && entity.canJumpAgain){
      //playerEntity.components.animation.setAnimation("idle");
    }
  }
  entity.components.render.yOffset = -entity.z;
};
ecs.systems.physics.newForce("gravity", gravityForce);

function inputForce(id){
  let entity = ecs.systems.entities.find(id);
  if(ecs.systems.collision.impendingCollisionCheck(id).length < 1){
    //if(entity.components.physics.xForce < maxSpeed){
    entity.x += entity.components.physics.xForce;
    entity.y += entity.components.physics.yForce;
    entity.z += entity.components.physics.zForce;
  }
    //xForce
    if(entity.components.physics.xForce > 0){
      entity.components.physics.xForce -= entity.components.physics.mass;
      if(entity.components.physics.xForce < 0) entity.components.physics.xForce = 0;
    }else{
      entity.components.physics.xForce += entity.components.physics.mass;
      if(entity.components.physics.xForce > 0) entity.components.physics.xForce = 0;
    }
    //yForce
    if(entity.components.physics.yForce > 0){
      entity.components.physics.yForce -= entity.components.physics.mass;
      if(entity.components.physics.yForce < 0) entity.components.physics.yForce = 0;
    }else{
      entity.components.physics.yForce += entity.components.physics.mass;
      if(entity.components.physics.yForce > 0) entity.components.physics.yForce = 0;
    }
    //zForce
    if(entity.components.physics.zForce > 0){
      entity.components.physics.zForce -= entity.components.physics.mass;
      if(entity.components.physics.zForce < 0) entity.components.physics.zForce = 0;
    }else{
      entity.components.physics.zForce += entity.components.physics.mass;
    if(entity.components.physics.zForce > 0) entity.components.physics.zForce = 0;
    }
    //if(entity.ground){entity.components.physics.zForce = 0;}
};
ecs.systems.physics.newForce("input", inputForce);

let timeToTriggerRun = 20;
//input
function input(){
  //check for running
  if(js80.btnp("ArrowRight") || js80.btnp("d")){
    if(playerEntity.runCheck){
      playerEntity.running = true;
    }else
    playerEntity.runCheck = true;
    js80.timer.new(timeToTriggerRun, function(){
      playerEntity.runCheck = false;
    });
  }
  if(js80.btnp("ArrowLeft") || js80.btnp("a")){
    if(playerEntity.runCheck){
      playerEntity.running = true;
    }else
    playerEntity.runCheck = true;
    js80.timer.new(timeToTriggerRun, function(){
      playerEntity.runCheck = false;
    });
  }
  //right now you can trigger a run by pressing "right-left".  fix this?

  //walking
  if(js80.btn("ArrowRight") || js80.btn("d")){
      if(playerEntity.idle){
        playerEntity.components.render.flip = false;
          playerEntity.components.animation.setAnimation("walk");
          //check if running
          if(playerEntity.running){
            playerEntity.components.animation.setAnimation("run");
            playerEntity.x += playerEntity.runSpeed;
          }else
          //if not, walk
          playerEntity.components.physics.xForce += playerEntity.speed;
    }
  }
  if(js80.btn("ArrowLeft") || js80.btn("a")){
    if(playerEntity.idle){
      //if(js80.mget(map1, player.x +14, player.y + 40) < 0){ //<- reminder about using mget for collisions
      playerEntity.components.render.flip = "x";
      playerEntity.components.animation.setAnimation("walk");
      //check if running
      if(playerEntity.running){
        playerEntity.components.animation.setAnimation("run");
        playerEntity.x -= playerEntity.runSpeed;
      }else
      //if not, walk
      playerEntity.components.physics.xForce -= playerEntity.speed;
    }
  }
  if((js80.btn("ArrowUp") || js80.btn("w")) ){//&& player.data.ground){
    if(playerEntity.idle){  
      playerEntity.components.animation.setAnimation("walk");
      playerEntity.components.physics.yForce -= playerEntity.vSpeed;
    }
  }
  if(js80.btn("ArrowDown") || js80.btn("s")){
    if(playerEntity.idle){
      playerEntity.components.animation.setAnimation("walk");
      playerEntity.components.physics.yForce += playerEntity.vSpeed;
    }
  }
  //punch/kick
  if(js80.btnp("q") || js80.btnp("z")){
    if(playerEntity.idle){
      //playerEntity.components.animation.setAnimation("punch");
      js80.sfx(punchSound);
      playerEntity.components.animation.setNoLoop("punch");
      playerEntity.running = false;
      playerEntity.idle = false;
      js80.timer.new(15, function(){
        //playerEntity.components.animation.interrupt("idle");
        playerEntity.idle = true;
      });
    }
  }
  if(js80.btnp("e") || js80.btnp("x")){
    if(playerEntity.idle){
      //playerEntity.components.animation.setAnimation("kick");
      js80.sfx(punchSound);
      playerEntity.components.animation.setNoLoop("kick");
      playerEntity.running = false;
      playerEntity.idle = false;
      js80.timer.new(15, function(){
        //playerEntity.components.animation.interrupt("idle");
        playerEntity.idle = true;
      });
    }
  }
  //jump
  if(playerEntity.ground && playerEntity.canJumpAgain && ((js80.btn("z") && js80.btn("x")) || (js80.btn("q") && js80.btn("e")))){
    //if stationary jump, walking jump, and running jump
    playerEntity.components.animation.setAnimation("jump");

    //playerEntity.z += playerEntity.jump;
    playerEntity.components.physics.zForce += playerEntity.jump;
    //playerEntity.components.render.yOffset -= playerEntity.jump;
    playerEntity.canJumpAgain = false;
    js80.timer.new(30, function(){playerEntity.canJumpAgain = true;});
  };
  //pausemenu
  if(js80.btnp("Enter")){
    //toggle menu
  }
  //return to idle //build a better way in ecs.systems.animation
  if(playerEntity.idle){
    if(!(js80.btn("w")) && !(js80.btn("a")) && !(js80.btn("s")) && !(js80.btn("d")) &&!(js80.btn("ArrowUp")) && !(js80.btn("ArrowLeft")) && !(js80.btn("ArrowDown")) && !(js80.btn("ArrowRight")) && !(js80.btn("q")) && !(js80.btn("e")) && !(js80.btn("z")) && !(js80.btn("x"))){
      playerEntity.components.animation.setAnimation("idle")
      playerEntity.running = false;
  };
  }
};

//use ECS system: (must come before any calls to ecs)
ecs.systems.manager.init();

//create entities
//player
let playerEntity = ecs.systems.entities.create(32, 125);
playerEntity.addComponent.physics(playerEntity.id, ["gravity", "input"], 1);
playerEntity.addComponent.render(playerEntity.id, sprite, 1, 2, 2);
playerEntity.addComponent.animation(
  playerEntity.id, 
  {//anims
    idle: [1],
    walk: [0, 0, 1, 1, 2, 2],
    jump: [3],
    land: [4],
    block: [5],
    run: [0, 1, 2, 6],
    punch: [7, 8, 9],
    kick: [10, 11, 12],
    hit: [13, 14, 15, 16]
  },
  //default animation
  "idle",
  //default framerate
  5);
  //set up playerEntity properties
  playerEntity.z = 0;
  playerEntity.ground = true;
  playerEntity.jump = 15;
  playerEntity.speed = 1;
  playerEntity.vSpeed = 0.5;
  playerEntity.idle = true;
  playerEntity.runCheck = false;
  playerEntity.running = false;
  playerEntity.runSpeed = 3;
  playerEntity.stamina = 50;
  playerEntity.maxStamina = 50;
  playerEntity.width = 16;
  playerEntity.height = 32;
  playerEntity.canJumpAgain = true;
  playerEntity.addComponent.collision(playerEntity.id, "rect", playerEntity.width, 3, 0, playerEntity.height - 3);

  //environment collisions
  let wall = ecs.systems.entities.create(0,0);
  wall.width = 240;
  wall.height = 140;
  wall.addComponent.collision(wall.id, "rect", wall.width, wall.height);
  let floor = ecs.systems.entities.create(0,200);
  floor.width = 240;
  floor.height = 200;
  floor.addComponent.collision(floor.id, "rect", floor.width, floor.height);
  let leftWall = ecs.systems.entities.create(-10, 0);
  leftWall.addComponent.collision(leftWall.id, "rect", 10, 256);

  //enemy1
  // let enemy1 = ecs.systems.entities.create(100, 150);
  // enemy1.addComponent.physics(enemy1.id, ["gravity", "input"], 1);
  // enemy1.addComponent.render(enemy1.id, sprite2, 1, 2, 2, "none", 0, 0, 0, 0);
  // enemy1.addComponent.animation(
  //   enemy1.id, 
  //   {//anims
  //     idle: [1],
  //     walk: [0, 0, 1, 1, 2, 2],
  //     jump: [3],
  //     land: [4],
  //     block: [5],
  //     run: [0, 1, 2, 6],
  //     punch: [7, 8, 9],
  //     kick: [10, 11, 12],
  //     hit: [13, 14, 15, 16]
  //   },
  //   //default animation
  //   "idle",
  //   //default framerate
  //   5);
  //   enemy1.z = 0;
  //   enemy1.ground = true;
  //   enemy1.jump = 15;
  //   enemy1.speed = 1;
  //   enemy1.vSpeed = 0.5;
  //   enemy1.idle = true;
  //   enemy1.runCheck = false;
  //   enemy1.running = false;
  //   enemy1.runSpeed = 3;
  //   enemy1.stamina = 50;
  //   enemy1.maxStamina = 50;
  //   enemy1.width = 16;
  //   enemy1.height = 32;
  //   enemy1.canJumpAgain = true;
  //   enemy1.addComponent.collision(enemy1.id, "rect", enemy1.width, 3, 0, enemy1.height - 3);

  // this is super wrong
  // let dude = ecs.systems.entities.create(50,100);
  // dude.addComponent.render(wall.id, sprite, 1, 2, 2, "none", 0, 0, 0, 50);
  
//UI
function drawHealth(health){
  let horizontalPosition = 50;
  while(health > 0){
    js80.spr(healthUnit, horizontalPosition, 14);
    horizontalPosition += 5;
    health -= 10;
  }
};

//init
function init(){
  engine.draw.imageSmoothingEnabled = false;
  js80.setTitle("River City Ransom");
  //js80.mset(map1, 15, 8, 7);
  js80.music(music1, true);
};

//main game loop
function frame(){
  js80.timer.update();
  //handle input
  input();
  //update background
  js80.cls("black");
  js80.spr(bg, -1, 40);

  //update ECS system
  ecs.systems.manager.update();
  //UI
  js80.text("ALEX", 15, 25, "white", 14, "wintermute");
  drawHealth(playerEntity.stamina);

  // show collider highlights
  // js80.rect(0, 0, wall.width, wall.height, "rgba(0,0,100,0.5");
  // js80.rect(0, 200, floor.width, floor.height, "rgba(100,0,0,0.5");

  console.log("");
  console.log("z " + playerEntity.z);
  console.log("yOffset " + playerEntity.components.render.yOffset);
};