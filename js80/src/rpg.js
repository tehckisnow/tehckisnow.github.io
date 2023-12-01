settings.settings({
  gameCanvasSize: {x:160,y:144}
});

//import assets
//let sprite1 = new js80.assets.sprite("assets/platform/playersprite.png", 16);
let tilesheet1 = new js80.assets.sprite("assets/rpg/ww2tileset.png", 16);
let groundMapArray = [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10];
let collisionMapArray = [-1,-1,-1,-1,-1,-1,-1,-1,-1,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,40,41,42,-1,23,24,25,-1,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,20,21,22,-1,23,24,25,-1,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,23,24,25,-1,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,51,-1,-1,-1,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,43,44,45,46,-1,-1,-1,-1,-1,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,16,60,-1,-1,-1,29,47,48,49,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1,-1,-1,1,1,1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
let decorationMapArray = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,30,31,32,-1,13,14,15,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,12,-1,12,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,12,11,12,-1,12,12,12,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,12,5,12,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,33,34,35,36,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,37,38,39,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
let map1 = new js80.assets.map2d(groundMapArray, 32);
let map2 = new js80.assets.map2d(collisionMapArray, 32);
let map3 = new js80.assets.map2d(decorationMapArray, 32);
let sprite1 = new js80.assets.sprite("assets/rpg/ww2soldiersprite.png", 16);

//input
function input(){
  if(player.readyForInput){
  
    if(js80.btn("ArrowLeft") || js80.btn("a")){
      player.facing = "left";
      player.currentFrame = 0;
      player.currentAnimation = "idleLeft";
      if(!collide("left", player)){
        player.readyForInput = false;
        //animate
        player.currentAnimation = "walkLeft";
        step(player, "left");
      };
    };

    if(js80.btn("ArrowRight") || js80.btn("d")){
      player.facing = "right";
      player.currentFrame = 0;
      player.currentAnimation = "idleRight";
      if(!collide("right", player)){
        player.readyForInput = false;
        //animate
        player.currentAnimation = "walkRight";
        step(player, "right");
      };
    };

    if(js80.btn("ArrowUp") || js80.btn("w")){
      player.facing = "up";
      player.currentFrame = 0;
      player.currentAnimation = "idleUp";
      if(!collide("up", player)){
        player.readyForInput = false;
        //animate
        player.currentAnimation = "walkUp";
        step(player, "up");
      };
    };

    if(js80.btn("ArrowDown") || js80.btn("s")){
      player.facing = "down";
      player.currentFrame = 0;
      player.currentAnimation = "idleDown";
      if(!collide("down", player)){
        player.readyForInput = false;
        //animate
        player.currentAnimation = "walkDown";
        step(player, "down");
      };
    };

    if(js80.btnp(" ") || js80.btnp("Enter")){
      look(player.x, player.y, player.facing);
    }
  };

  if(js80.btnp(" ") || js80.btnp("Enter")){
    if(showDialogue){  
      if(player.readyForInput === false){
        player.readyForInput = true;
        showDialogue = false;
      };
    };
  };

  if(!js80.btn("ArrowLeft") && !js80.btn("ArrowRight") && !js80.btn("ArrowDown") && !js80.btn("ArrowUp") &&
      !js80.btn("w") && !js80.btn("a") && !js80.btn("s") && !js80.btn("d")){
    player.currentFrame = 0;
    switch(player.facing){
      case "up":
        player.currentAnimation = "idleUp";
        break;
      case "down":
        player.currentAnimation = "idleDown";
        break;
      case "left":
        player.currentAnimation = "idleLeft";
        break;
      case "right":
        player.currentAnimation = "idleRight";
        break;
    };
  };

};

function step(entity, dir){
  let x = 0;
  let y = 0;
  let action = {};
  switch(dir){
    case "up":
      action = {dir:"y", v: -1};
      break;
    case "down":
      action = {dir:"y", v: 1};
      break;
    case "left":
      action = {dir:"x", v: -1};
      break;
    case "right":
      action = {dir:"x", v: 1};
      break;
  };
  function takeStep(action){
    if(action.dir === "y"){entity.y += action.v * entity.speed};
    if(action.dir === "x"){entity.x += action.v * entity.speed};
    entity.currentStep -= entity.speed;
    if(entity.currentStep < 0){
      entity.currentStep = entity.stepDistance;
      entity.readyForInput = true;
    }else{
      js80.timer.new(entity.stepRate, function(){takeStep(action)});
    };
  };
  js80.timer.new(entity.stepRate, function(){takeStep(action)});
};

let collidableTiles = [1, 2, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 60];
let currentMap = map2;

function collide(dir, item){
  switch(dir){
    case "left":
      if(collidableTiles.includes(js80.mget(currentMap, item.x - 1, item.y + (item.height / 2)))){
        return true;
      };
      break;
    case "right":
      if(collidableTiles.includes(js80.mget(currentMap, item.x + item.width, item.y + (item.height / 2)))){
        return true;
      };
      break;
    case "up":
      if(collidableTiles.includes(js80.mget(currentMap, item.x + (item.width / 2), item.y - 1))){
        return true;
      };
      break;
    case "down":
      if(collidableTiles.includes(js80.mget(currentMap, item.x + (item.width / 2), item.y + item.height))){
        return true;
      };
      break;
  };
};

let thingsToAnimate = [];
function animate(){
  for(i in thingsToAnimate){
    let entity = thingsToAnimate[i];
    entity.animTimer--;
    if(entity.animTimer < 0){
      entity.animTimer = entity.frameRate;
      entity.currentFrame++;
      if(entity.currentFrame > entity.anims[entity.currentAnimation].length - 1){
        entity.currentFrame = 0;
      }
    }
    entity.frame = entity.anims[entity.currentAnimation][entity.currentFrame];
  }
};

//game objects
//  map
//  characters
//    player
  let player = {
    x: 3 * 16,
    y: 4 * 16,
    facing: "down",
    xV: 0,
    yV: 0,
    width: 16,
    height: 16,
    tileWidth: 1,
    tileHeight: 1,
    state: "idle",
    states: ["idle", "walking", "jumping"],
    readyForInput: true,
    onGround: false,
    speed: 2,
    stepDistance: 15,
    currentStep: 15,
    stepRate: 1,
    //animation
    frame: 0,
    currentAnimation: "idleDown",
    anims: {
      idleDown: [0],
      idleUp: [3],
      idleRight: [6],
      idleLeft: [9],
      walkDown: [0, 1, 2],
      walkUp: [3, 4, 5],
      walkRight: [6, 7, 8],
      walkLeft: [9, 10, 11]
    },
    currentFrame: 0,
    animTimer: 0,
    frameRate: 10,
  };
thingsToAnimate.push(player);

let dialogueText = "";
let showDialogue = false;
function dialogue(text){
  if(showDialogue){
    player.readyForInput = false;
    js80.rect(10, 100, 140, 40, "#0F380F");
    js80.rectb(15, 105, 130, 30, "#9bbc0f");
    js80.text(text, 50, 120, "#9bbc0f");
    //js80.rectb(10, 100, 140, 40, "#0F380F");
  }
};

let interactions = [];
function look(){
  let facing = player.facing;
  let x = player.x / 16;
  let y = player.y / 16;
  switch(facing){
    case "up":
      y -= 1;
      break;
    case "down":
      y += 1;
      break;
    case "left":
      x -= 1;
      break;
    case "right":
      x += 1;
      break;
  }
  for(i in interactions){
    if(interactions[i].x === x){
      if(interactions[i].y === y){
        if(interactions[i].condition){
          interactions[i].effect();
        }
      }
    }
  }
};

//interactions
//  building1 door
interactions.push({x: 2,y: 3,condition: true,effect: function(){dialogueText = "naw"; showDialogue = true;}});
//  building2 door
interactions.push({x: 6,y: 4,condition: true,effect: function(){dialogueText = "naw"; showDialogue = true;}});
//can
interactions.push({x: 5,y: 7,condition: true,effect: function(){dialogueText = "Just a can"; showDialogue = true;}});
//jeep
interactions.push({x: 6,y: 7,condition: true,effect: function(){dialogueText = "nice jeep!"; showDialogue = true;}});
interactions.push({x: 7,y: 7,condition: true,effect: function(){dialogueText = "nice jeep!"; showDialogue = true;}});
interactions.push({x: 8,y: 7,condition: true,effect: function(){dialogueText = "nice jeep!"; showDialogue = true;}});
//captain
interactions.push({x: 5,y: 5,condition: true,effect: function(){dialogueText = "Back to work!"; showDialogue = true;}});
//grunt
interactions.push({x: 1,y: 7,condition: true,effect: function(){dialogueText = "uhg."; showDialogue = true;}});
//truck
interactions.push({ x: 0, y: 6, condition: true, effect: function(){dialogueText = "Vroom!"; showDialogue = true;}});
interactions.push({ x: 1, y: 6, condition: true, effect: function(){dialogueText = "Vroom!"; showDialogue = true;}});
interactions.push({ x: 2, y: 6, condition: true, effect: function(){dialogueText = "Vroom!"; showDialogue = true;}});
interactions.push({ x: 3, y: 6, condition: true, effect: function(){dialogueText = "Vroom!"; showDialogue = true;}});

//init
function init(){
  engine.draw.imageSmoothingEnabled = false;
  js80.setTitle("RPG");
};

//main loop
function frame(){
  //update
  js80.timer.update();
  input();
  animate();

  //draw
  js80.cls("black");
  //  bg
  js80.map(map1, tilesheet1, 16);
  js80.map(map2, tilesheet1, 16);
  //  player
  js80.spr(sprite1, player.x, player.y, player.frame, player.tileWidth, player.tileHeight);
  js80.map(map3, tilesheet1, 16);
  //  UI
  dialogue(dialogueText);
};