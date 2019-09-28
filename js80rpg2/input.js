let distance = 16;

function convertDirection(dir){
  let dirObject = {x: 0, y: 0};
  switch(dir){
    case "up":
      dirObject.y = -1;
      break; 
    case "down":
      dirObject.y = 1;
      break; 
    case "left":
      dirObject.x = -1;
      break; 
    case "right":
      dirObject.x = 1;
      break; 
    default:
  };
  return dirObject;
};//convertDirection()

//return an object with x/y points for the center of the tile they are facing
function getPoint(dir, tileSize){
  let unit = Math.floor(tileSize / 2);
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

function collisionTest(map, layer, entity, dir, group, tag){
  let direction = getPoint(dir, 16);
  if(engine.collision.checkPoint(entity.x + direction.x, entity.y + direction.y, group, tag)){return true};
  let position = camera.position.get(player1);
  if(engine.collision.checkCollisionLayer(map, layer, position.x + direction.x, position.y + direction.y)){return true};
  return false;
};//collision()

function step(entity, dir, distance){
  if(collisionTest(game1.scenes.current.map.current.assets[0], 4, entity, dir, game1.scenes.current.collision.entities, "physical")){return};
  inputManager.setMode(steppingMode);
  entity.justFinished = true;
  entity.distanceRemaining = distance;
  function check(){
    if(entity.distanceRemaining > 0){
      entity.distanceRemaining--;
      let direction = convertDirection(dir);
      entity.x += direction.x;
      entity.y += direction.y;
      game1.scenes.current.timer.manager.timer(1, function(){check()});
    }else if(entity.justFinished){
      entity.justFinished = false;
      inputManager.setMode(playMode);
      let center = getPoint("center", 16);
      let currentMap = game1.scenes.current.map.current;
      checkExit(game1, currentMap, 3, player1.x + center.x, player1.y + center.y, -16);
      //checkMapEvents();
    };
  };
  check();
};//step()

let inputManager = engine.input.newManager(game1);
game1.input = inputManager;
let playMode = inputManager.newMode("play");
let steppingMode = inputManager.newMode("stepping");

let introMode = inputManager.newMode("intro");
introMode.newKey("Enter", function(){skip()});
inputManager.setMode(introMode);
let startMode = inputManager.newMode("start");
startMode.newKey("Enter", function(){
  //fade to black
  introFade.start("black", 100, 1);
  game1.scenes.current.timer.manager.timer(110, function(){
    scene1.setActive();
    game1.scenes.setCurrent(scene1);
    titleScene.setInactive();
    inputManager.setMode(playMode);
    //fade from black
    scene1Fade.start("black", 100, -1);
  });

});

let readMode = inputManager.newMode("read");
readMode.newKey(" ", function(){
  //advance the textbox
  dialogue.advance(inputManager, playMode);
  //!the above line sets game to playMode when textbox closes! this will mess up cutscenes
});

playMode.newKey("a", function(){
  player1.facing = "left";
  player1.animation.setAnim("walkLeft");
  step(player1, "left", distance);
}, true);
playMode.newKey("d", function(){
  player1.facing = "right";
  player1.animation.setAnim("walkRight");
  step(player1, "right", distance);
}, true);
playMode.newKey("w", function(){
  player1.facing = "up";
  player1.animation.setAnim("walkUp");
  step(player1, "up", distance);
}, true);
playMode.newKey("s", function(){
  player1.facing = "down";
  player1.animation.setAnim("walkDown");
  step(player1, "down", distance);
}, true);
playMode.newKey(" ", function(){
  //check map for interaction
  let dir = getPoint(player1.facing, 16);
  checkMapDescription(game1.scenes.current.map.current, 3, player1.x + dir.x, player1.y + dir.y);
  checkMapEvents(game1.scenes.current.map.current, 3, player1.x + dir.x, player1.y + dir.y);  
  checkNpcs(generatedNpcs, player1.x + dir.x, player1.y + dir.y, "physical");
}, false);

playMode.noKey(function(){
  player1.behavior.idle();
});