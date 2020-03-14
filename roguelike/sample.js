//TODO:
//settings object needs to replace engine settiings, and engine needs to check 
//  game settings instance instead of default settings object
//how are panel updates called in game

let game1 = engine.newGame({
  //settings
});

//global variables
game1.global.timeOfDay = 'Morning';

//map
let mapPanel = game1.newPanel('mapPanel');
game1.setMapPanel(mapPanel);

let map1 = game1.newMap(mapSettings);
game1.setMap(map1);
//mapgeneration algorithm

let player = map1.newEntity(15, 15, '@', 'white', 'You', 'it you');
player.renderOrder = 3;

let camera1 = game1.newCamera(5, 5, game1.settings.viewWidth, game1.settings.viewHeight);
game1.setCamera(camera1);
camera1.follow.set(player, -9, -7);

let uiPanel = {
  element: game1.newPanel('uiPanel', ''),
  text: '',
  nearby: {},//!
  update: function(text){
    if(text){
      uiPanel.text = text;
    };
    uiPanel.element.text.innerHTML = uiPanel.text;
  },
};//uiPanel
uiPanel.update();

game1.newCursor(player.x, player.y, 'X', 'yellow', uiPanel.nearby);
game1.lookCursor.follow(player);

game1.update();
