//TODO:
//get music to play at start (loading screen?)
//preloader
////draw interaction images to screen
////textbox
//more types of common interactions(obtainable, switch, closeup, ect)
//inventory
//keyboard controls?
//generate exits function?
//generate imagenames function!
//fix click() and mouseMove() (they currently are hard coded to game1)
//add method for an interaction to destroy itself
//roomIds ?
//reset cursor icon after changing room?

//common interactable templates: 
//      exit (two-way? or just one-way?)
//      closeup (static and dynamic)
//      book (like a closeup and a textbox mixed, with click controls for multiple pages) (do this as a new room?)

//Accessibility:
//    images and interactions are DOM elements so they can be made accessible using alt text (heirarchical order is likely very important here)

//settings
let settings = {
  //debug: true,
  //startScreen: "url(explore.png)",
  startScreen: "url(titlescreen.png)",
  defaultIntTemplate: {type: "template", x: 0, y: 0, width: 20, height: 20, image: "", effect: function(){}, cursor: engine.defaultSettings.defaultCursor},
  assetDirectory: "assets/",
  fontColor: "white",
};

//build game
let game1 = engine.game(settings);
game1.build();
game1.nav = game1.genNav(game1, 50, 50, 150);

//build map
let map1 = game1.map();
//build rooms
let room0 = map1.room();
let room1 = map1.room();
let room2 = map1.room();
let room3 = map1.room();
let room4 = map1.room();
let room5 = map1.room();
map1.buildMap(map1, ["north", "east", "south", "west"], ["1n.png", "1e.png", "1s.png", "1w.png", "2n.png", "2e.png", "2s.png", "2w.png", "3n.png", "3e.png", "3s.png", "3w.png", "4n.png", "4e.png", "4s.png", "4w.png", "5n.png", "5e.png", "5s.png", "5w.png", "6n.png", "6e.png", "6s.png", "6w.png"], [game1.nav.turnL, game1.nav.turnR]);
//exits
room0.north.int(game1.nav.exit, {effect: function(){game1.goto(1)}});
room1.south.int(game1.nav.exit, {effect: function(){game1.goto(0)}});

room1.north.int(game1.nav.exit, {effect: function(){game1.goto(5)}});
room5.south.int(game1.nav.exit, {effect: function(){game1.goto(1)}});

room1.west.int(game1.nav.exit, {effect: function(){game1.goto(2)}});
room2.east.int(game1.nav.exit, {effect: function(){game1.goto(1)}});

//room2.north.int(game1.nav.exit, {effect: function(){game1.goto(3)}});
room3.south.int(game1.nav.exit, {effect: function(){game1.goto(2)}});

room1.east.int(game1.nav.exit, {effect: function(){game1.goto(4)}});
room4.west.int(game1.nav.exit, {effect: function(){game1.goto(1)}});
//2-way exit constructor could be made like;
// twoWayExit(game, roomA, roomADir, roomB, roomBDir, options){
//    roomA[roomADir].int(game.nav.exit, (effect: function(){game.goto([roomB.index])})); //!how to best get roomB's index? property in constructor?
//    roomB[roomBDir].int(game.nav.exit, (effect: function(){game.goto([roomA.index])}));
//};

//audio manager
let audioManager = engine.audio.player();
let ced = audioManager.new("audio/cedellia.wav");
//audioManager.play(ced, true);

//let secretExit = room2.north.int(game1.nav.exit, {effect: function(){game1.goto(3)}});

let item = engine.intTemplate(20, 20, 40, 40, "assets/cube.png", function(){}, "url(ui/grab.png), auto");
room5.north.int(item, {x: 200, y: 170, width: 30, height: 30, effect: function(){console.log("item activated"); game1.drawTextbox(lowerThirdTextbox, "This cube gives off a mysterious aura.  You feel that you probably should leave it alone.");}});
room0.west.int(item, {x: 205, y: 85, width: 70, height: 80, image: "assets/des.png", effect: function(){game1.drawTextbox(closeup1, "")}});
let secretDoor = room2.north.int(item, {x:195, y: 80, width: 85, height: 160, image: "", effect: function(){
  //remove this int
  //secretDoor.destroy();//!hasn't been written yet
  secretDoor.x = -500;
  secretDoor.y = -500;
  room2.north.int(game1.nav.exit, {effect: function(){game1.goto(3)}});
  room2.north.image = "3nb.png";
  room2.north.int(item, {image: "", x: 270, y: 80, width: 75, height: 160, effect: function(){
    secretDoor.x = 195;
    secretDoor.y = 80;
    room2.north.image = "3n.png";
  }});
}});
//!
//the following event adds the text to it's own textbox as well as the textbox in room 5 each time it is interacted with.  Other textboxes do not do this and are unaffected.  investigate why
room3.north.int(item, {cursor: "url(ui/look.png), auto", image: "", x: 40, y: 0, width: 400, height: 200, effect: function(){game1.drawTextbox(lowerThirdTextbox, "It is extremely dark in here.")}});
//textbox
let padding = 20;//this would be better described as margin
let fullScreenTextbox = engine.textbox(game1, padding, padding, game1.settings.gameSize.x - (2 * padding), game1.settings.gameSize.y - (2 * padding), "ui/textbox.png");
let lowerHalfTextbox = engine.textbox(game1, padding, game1.settings.gameSize.y / 2, game1.settings.gameSize.x - (2 * padding), (game1.settings.gameSize.y  / 2) - padding, "ui/textbox.png");
let lowerThirdTextbox = engine.textbox(game1, padding, (game1.settings.gameSize.y / 3) * 2, game1.settings.gameSize.x - (2 * padding), (game1.settings.gameSize.y  / 3) - padding, "ui/textbox.png");

let closeup1 = engine.textbox(game1, padding, padding, game1.settings.gameSize.x - (2 * padding), game1.settings.gameSize.y - (2 * padding), "assets/des.png");

//set starting location
//game1.goto(0, "north", map1);

game1.init = function(){
  game1.goto(0, "north", map1);
  audioManager.play(ced, true);
};
