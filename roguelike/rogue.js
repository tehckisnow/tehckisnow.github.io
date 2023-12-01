
//test
let game1 = engine.newGame();
let wrapper = document.createElement('div');
document.body.appendChild(wrapper);
wrapper.setAttribute('id', 'wrapper');
wrapper.appendChild(game1.div);
titlePanel = game1.newPanel('titlePanel', 'TITLE');
mapPanel = game1.newPanel('mapPanel', "this is the map");

//global game variables
game1.vars = {};
game1.vars.timeOfDay = "Morning";

let map1 = engine.newMap(game1, settings);

let player = map1.newEntity(15, 15, '@', 'white', 'Player', 'it you.', 2, false);
player.renderOrder = 3;

map1.newEntity(10, 14, 'o', 'green', 'Orc', 'an orcish warrior.', 1, true);
map1.newEntity(20, 18, 'o', 'green', 'Orc', 'an orcish warrior.', 1, true);
map1.newEntity(25, 11, 'o', 'green', 'Orc', 'an orcish warrior.', 1, true);
map1.newEntity(20, 18, 'T', 'darkgreen', 'Troll', 'an giant, brutish troll.', 2, true);
map1.newItem(11, 15, '|', 'grey', 'sword', 'an iron sword.', {att: 1});
map1.newItem(15, 18, '|', 'grey', 'sword', 'an iron sword.', {att: 1});

game1.setMap(map1);
let camera1 = engine.newCamera(5, 5, settings.viewWidth, settings.viewHeight, map1);
game1.setMapPanel(mapPanel);
game1.setCamera(camera1);

engine.mapgen.alg2.buildRoom(map1, 20, 20, 20, 20, 10, 20);
let ted = map1.newEntity(2, 2, '@', 'red', 'Ted', 'a dude');

camera1.follow.set(player, -9, -7);
game1.update();

let uiPanel = {
  element: game1.newPanel('uiPanel', "ui panel"),
  target: player,
  text: '',
  nearby: {
    text: '',
    update: function(){uiPanel.update()},
  },
  update: function(){
    uiPanel.text = uiPanel.target.name + '<br>HP: ' + uiPanel.target.hp + '/' + uiPanel.target.maxHp + '<br><br>' + game1.vars.timeOfDay + '<br><br>nearby:<br>' + uiPanel.nearby.text + '<br><br>' + game1.log.showLast(5);
    uiPanel.element.text.innerHTML = uiPanel.text;
  },//uiPanel.update();
};//uiPanel
uiPanel.update();

//cursor
game1.newCursor(player.x, player.y, 'X', 'yellow', uiPanel.nearby);
game1.lookCursor.follow(player);

//input
let inputManager = engine.input(game1);
let playMode = inputManager.newMode();

//wasd
playMode.newKey('w', function(){player.move('up'); gameLoop()});
playMode.newKey('s', function(){player.move('down'); gameLoop()});
playMode.newKey('a', function(){player.move('left'); gameLoop()});
playMode.newKey('d', function(){player.move('right'); gameLoop()});
//vim
playMode.newKey('k', function(){player.move('up'); gameLoop()});
playMode.newKey('j', function(){player.move('down'); gameLoop()});
playMode.newKey('h', function(){player.move('left'); gameLoop()});
playMode.newKey('l', function(){player.move('right'); gameLoop()});
//diagonals
playMode.newKey('y', function(){player.move('upleft'); gameLoop()});
playMode.newKey('u', function(){player.move('upright'); gameLoop()});
playMode.newKey('b', function(){player.move('downleft'); gameLoop()});
playMode.newKey('n', function(){player.move('downright'); gameLoop()});
//other commands
playMode.newKey(';', function(){
  gameModes.setLook();
});

//lookMode
let lookMode = inputManager.newMode();
lookMode.newKey('k', function(){game1.lookCursor.move('up')});
lookMode.newKey('j', function(){game1.lookCursor.move('down')});
lookMode.newKey('h', function(){game1.lookCursor.move('left')});
lookMode.newKey('l', function(){game1.lookCursor.move('right')});
lookMode.newKey('y', function(){game1.lookCursor.move('upleft')});
lookMode.newKey('u', function(){game1.lookCursor.move('upright')});
lookMode.newKey('b', function(){game1.lookCursor.move('downleft')});
lookMode.newKey('n', function(){game1.lookCursor.move('downright')});
lookMode.newKey(';', function(){
  //gameModes.setPlay();
});
lookMode.newKey('Escape', function(){
  gameModes.setPlay();
});
lookMode.newKey('r', function(){camera1.update()});

//gameLoop : currently called by input keys
function gameLoop(){
  game1.lookCursor.update();
  game1.update();
  
  //camera1.update();
};//gameLoop

let gameModes = {
  setLook: function(){
    console.log('look mode');
    inputManager.setMode(lookMode);
    game1.lookCursor.visible = true;
    game1.lookCursor.update();
    camera1.update();
  },
  setPlay: function(){
    console.log('play mode');
    game1.lookCursor.visible = false;
    inputManager.setMode(playMode);
    game1.lookCursor.update();
    camera1.update();
  },
};//gameModes

let controlsText = document.createElement('p');
controlsText.innerHTML = controls;
controlsText.style.textAlign = 'left';
document.body.appendChild(controlsText);