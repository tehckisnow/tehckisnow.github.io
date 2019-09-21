//game data
//  this game's color reference;
let colors = [ //darkest to lightest
  "#0f380f",
  "#306230",
  "#8bac0f",
  "#9bbc0f"
];
//  default animations
let defaultAnims = {default: [0], idle: [0,0,1,1,0,0,2,2], idleDown: [0], idleRight: [3], idleLeft: [6], idleUp: [9], walkLeft: [6,7,6,8], walkRight: [3,4,3,5], walkUp: [9,10,9,11], walkDown: [0,1,0,2]};

let game1 = engine.newGame();
let scene1 = game1.scenes.new();
scene1.setActive();

let spriteSheetEntity = scene1.newEntity();
let spriteSheet1 = spriteSheetEntity.add.assets(scene1, "spriteSheet", "sheet1.png", 16, 16);

let mapEntity1 = scene1.newEntity();

let tileSetEntity1 = scene1.newEntity();
let tileSet1 = tileSetEntity1.add.assets(scene1, "tileSet", "tileset1.png", 16);

let mapData = [TileMaps.testMap1, TileMaps.map1, TileMaps.map2];
let mapAsset = mapEntity1.add.assets(scene1, "map", mapData[0], mapData[0].width, tileSet1, 2, -1);
mapEntity1.add.render(scene1, "map", mapAsset, 0, 0, 0);
mapAsset.layers[1].visible = false;

//find player starting position
function getStart(layer){
  for(obj in mapAsset.layers[layer].objects){
    for(prop in mapAsset.layers[layer].objects[obj].properties){
      if(mapAsset.layers[layer].objects[obj].properties[prop].name === "start"){
        return {
          x: mapAsset.layers[layer].objects[obj].x,
          y: mapAsset.layers[layer].objects[obj].y,
          facing: mapAsset.layers[layer].objects[obj].properties[prop].value,
        };
      };
    };
  };
};//getStart()
let startingPosition = getStart(2);

let centerPosition = {x: 8 * 16, y: 6 * 16};

let player1 = npc.new(scene1, centerPosition.x, centerPosition.y, 1, ["woah"], spriteSheet1, 0, defaultAnims, 16, 16, 0, 0, []);

//!generalize getPosition and setPosition!

let position = {
  get: function(map, entity){
    return {x: -map.x + entity.x, y: -map.y + entity.y};
  },
  set: function(map, entity, x, y){
    entity.x = -x + entity.x;
    entity.y = -y + entity.y;
  },
};

player1.getPosition = function(){
  return {x: -currentMap.x + centerPosition.x, y: -currentMap.y + centerPosition.y};
};
player1.setPosition = function(entity, x, y){
  entity.x = -x + centerPosition.x;
  entity.y = -y + centerPosition.y;
};

let mapNpcs = [{x: 6 * 16, y: 4 * 16, text: ["holla!"]}, {x: 16 * 16, y: 4 * 16, text: ["hiya!", "later!"]}];
function genNpcs(list){
  let npcs = [];
  for(i in mapNpcs){
    npcs.push(npc.new(scene1, mapNpcs[i].x, mapNpcs[i].y, 1, mapNpcs[i].text, spriteSheet1, 0, defaultAnims, 16, 16, 0, 0, []));
  };
  return npcs;
};

//!
//create iterable arrays for
let animatedEntities = [player1];
let renderedEntities = [player1];
let collidableEntities = [player1];
let entitiesToMove = [];

//!NPCs
let generatedNpcs = genNpcs(mapNpcs);
for(i in generatedNpcs){
  renderedEntities.push(generatedNpcs[i]);
  entitiesToMove.push(generatedNpcs[i]);
  collidableEntities.push(generatedNpcs[i]);
  animatedEntities.push(generatedNpcs[i]);
};

//!
//current map
let currentMap = mapEntity1;

player1.setPosition(currentMap, startingPosition.x, startingPosition.y);

//!
//map effects (events?)
let mapEffects = [
  function(){},
  function(){
  uiController.write("You have found the treasure!", dialogue);
  mapEffects[1] = function(){};
},
function(){},function(){},
];

function talk(x, y, npcs){
  for(g in npcs){
    if(npcs[g].x < x && npcs[g].x + npcs[g].width > x && npcs[g].y < y && npcs[g].y + npcs[g].height > y){
      npcs[g].behavior.turn(npcs[g].behavior.find(player1));
      uiController.write(npcs[g].dialogue[npcs[g].dialogueLine], dialogue);
      inputManager.setMode(readMode);
      if(npcs[g].dialogueLine < npcs[g].dialogue.length - 1){npcs[g].dialogueLine++};
    };
  };
};//talk()

function inspectMapObject(x, y, map, layer){
  //Tiled Offset
  y = y + 16;
  let mapObjects =  map.layers[layer].objects;
  for(g in mapObjects){
    if(mapObjects[g].x < x && mapObjects[g].x + mapObjects[g].width > x && mapObjects[g].y < y && mapObjects[g].y + mapObjects[g].height > y){
      if(mapObjects[g].properties){
        for(u in mapObjects[g].properties){
          if(mapObjects[g].properties[u].name === "effect"){
            mapEffects[mapObjects[g].properties[u].value](mapObjects[g].properties[u].value);
          };
          if(mapObjects[g].properties[u].name === "desc"){
            uiController.write(mapObjects[g].properties[u].value, dialogue);
            inputManager.setMode(readMode);
          };
        };
      };
    };
  };
};//inspectMapObjects()


let timerManager = engine.timer.newManager();

let dialogueTheme = engine.ui.textbox.newTheme({
  x: 10, y: 150, height: game1.settings.height - 160, width: game1.settings.width - 20,
  bgColor: colors[3], borderColor: colors[1], fontColor: colors[1],
  charLength: 50, vertOffset: 10, lines: 2,
  overflowIconColor: colors[0],
});

let uiController = engine.ui.textbox.newController(game1, dialogueTheme);
let dialogue = uiController.new("", dialogueTheme);

//!
//get a properties object from a mapObject
function getProperties(mapObject){
  let properties = {};
  for(i in mapObject.properties){
    properties[mapObject.properties[i].name] = mapObject.properties[i].value;
  };
  return properties;
};
//checkExit
function checkExit(map, layer, x, y){
  //Tiled Offset
  y = y + 16;
  let mapObjects = map.assets[0].layers[layer].objects;
  for(g in mapObjects){
    if(mapObjects[g].x < x && mapObjects[g].x + mapObjects[g].width > x && mapObjects[g].y < y && mapObjects[g].y + mapObjects[g].height > y){
      //!move this to asset creation!
      let properties = getProperties(mapObjects[g]);
      if(properties.exit !== undefined){
        let setMap = maps[properties.exit];
        let setX = properties.destinationX;
        let setY = properties.destinationY;
        let setFacing = properties.facing;
        exit(setMap, setX, setY, setFacing);
      };
    };
  };
};//checkExit()

//!
let fade = engine.ui.effects.fade(game1, "0,0,0", 100, "to");
let maps = [mapEntity1];
let mapEvents = [
  function(){console.log("map event 1 triggered!")},
];
//!
function exit(map, x, y, facing){
  //set mode to disable input
  //inputManager.currentMode.disable();
  playMode.disable();
  //fade to black
  fade = engine.ui.effects.fade(game1, "0,0,0", 100, "to");
  fade.start();
  //sound effect
  audioController.play(sfx);
 
  timerManager.timer(100, function(){
    player1.setPosition(currentMap, 0, 0);
    //set map
    currentMap = map;
    //set x/y //!y axis is offset by tileSize because of Tiled
    player1.setPosition(currentMap, x, y - 16);
    //set facing
    player1.facing = facing || "down";
    //fade back
    fade = engine.ui.effects.fade(game1, "0,0,0", 100, "from");
    fade.start();
    //check map events
    for(prop in currentMap.assets[0].properties){
      if(currentMap.assets[0].properties[prop].name === "event"){
        //!check value of expired here?
        mapEvents[currentMap.assets[0].properties[prop].value]();
        //!set value of expired to 1 here?
      };
    };
  });

  //set mode to reenable input
  timerManager.timer(200, function(){
    inputManager.currentMode.enable();
  });

};//exit()

let audioController = engine.audio.newController();
let music = audioController.newTrack("music", "music.mp3");
let sfx = audioController.newTrack("sfx", "punch.wav");
//audioController.play(music);

game1.frame = function(){
  timerManager.update();
  engine.render.cls(game1, "black");
  engine.input.update(inputManager);
  engine.animation.update(animatedEntities);
  engine.render.map(game1, currentMap);
  engine.render.update(game1, renderedEntities);
  fade.update();
  uiController.update();

};//game1.frame()

game1.start();