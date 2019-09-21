let distance = 16;

function convertDirection(dir){
  let x = 0;
  let y = 0;
  switch(dir){
    case "up":
      y = -1;
      break; 
    case "down":
      y = 1;//!
      break; 
    case "left":
      x = -1;
      break; 
    case "right":
      x = 1;//!
      break; 
    default:
  };
  let dirObject = {};
  dirObject.x = x;
  dirObject.y = y;
  return dirObject;
};//convertDirection()

//return an object with x/y points for the center of the tile they are facing
function getPoint(dir, tileSize){
  let unit = tileSize / 2;
  switch(dir){
    case "up":
      return {x: unit, y: -unit};
    case "down":
      return {x: unit, y: unit * 3};
    case "left":
      return {x: -unit, y: unit};
    case "right":
      return {x: unit * 3, y: unit};
    case "center":
    default:
      return {x: unit, y: unit};
  };
};//getPoint()

function collisionTest(map, layer, entity, dir, group){
  let direction = getPoint(dir, 16);
  if(engine.collision.checkPoint(entity.x + direction.x, entity.y + direction.y, group, "physical")){return true};
  let position = player1.getPosition();
  if(engine.collision.checkCollisionLayer(map, layer, position.x + direction.x, position.y + direction.y)){return true};
  return false;
};//collision()

function step(entity, dir, distance){
  if(collisionTest(currentMap.assets[0], 1, entity, dir, collidableEntities)){return};

  //if(runModifier = 1){distance = distance / 2}

  inputManager.setMode(steppingMode);
  entity.justFinished = true;
  entity.distanceRemaining = distance;
  function check(){
    if(entity.distanceRemaining > 0){
      entity.distanceRemaining--;
      move(entity, dir);
      timerManager.timer(1, function(){check()});
    }else if(entity.justFinished){
      entity.justFinished = false;
      inputManager.setMode(playMode);
      let center = getPoint("center", 16);
      checkExit(currentMap, 2, -currentMap.x + player1.x + center.x, -currentMap.y + player1.y + center.y);
    };
  };
  check();
};//step()

function move(entity, dir, distance){
    let direction = convertDirection(dir);
    let x = direction.x;
    let y = direction.y;
    moveWorld(x, y, entitiesToMove);
  //};
};//move()

function moveWorld(x, y, entities){
  //!replace this later!
  let things = [currentMap];
  for(i in entities){
    things.push(entities[i]);
  };
  for(buh in things){
    //! changed these to negative for tile-based movement
    things[buh].x += -x + runModifier;
    things[buh].y += -y + runModifier;
  };
};

let inputManager = engine.input.newManager(game1);
let playMode = inputManager.newMode("play");
let steppingMode = inputManager.newMode("stepping");

let readMode = inputManager.newMode("read");
readMode.newKey(" ", function(){
  //advance the textbox
  dialogue.advance(inputManager, playMode);
});

playMode.newKey("Shift", function(){}, false);

playMode.newKey("a", function(){
  player1.facing = "left";
  player1.animation.setAnim("walkLeft");
  //movement
  step(player1, "left", distance);
  //move(player1, "left", distance);
}, true);
playMode.newKey("d", function(){
  player1.facing = "right";
  player1.animation.setAnim("walkRight");
  //movement
  step(player1, "right", distance);
  //move(player1, "right", distance);
}, true);
playMode.newKey("w", function(){
  player1.facing = "up";
  player1.animation.setAnim("walkUp");
  //movement
  step(player1, "up", distance);
  //move(player1, "up", distance);
}, true);
playMode.newKey("s", function(){
  player1.facing = "down";
  player1.animation.setAnim("walkDown");
  //movement
  step(player1, "down", distance);
  //move(player1, "down", distance);
}, true);
playMode.newKey(" ", function(){
  //check map for interaction
  let dir = getPoint(player1.facing, 16);
  let pos = player1.getPosition();
  talk(player1.x + dir.x, player1.y + dir.y, generatedNpcs);
  inspectMapObject(pos.x + dir.x, pos.y + dir.y, mapAsset, 2);
}, false);

playMode.noKey(function(){
  
  runModifier = 0;

  let anim = "";
  switch(player1.facing){
    case "up":
      anim = "idleUp";
      break;
    case "left":
      anim = "idleLeft";
      break;
    case "right":
      anim = "idleRight";
      break;
    default:
      anim = "idleDown";
  };
  player1.animation.setAnim(anim);
});