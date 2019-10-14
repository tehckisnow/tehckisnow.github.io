
let engine = {
  defaultSettings: {
    debug: false,
    gameSize: {x: 480, y: 300},
    sizeUnits: "px",
    startScreen: "url(0.png)",
    assetDirectory: "",
    uiDirectory: "ui/",
    defaultCursor: "url(ui/select.png), auto",
    windowTitle: "Explore",
    uiColor: "rgba(200,200,200,0.8)",
    font: "'Oswald', sans-serif",
    fontRef: "Oswald",
    fontColor: "black",
    textboxPadding: 10,
    defaultIntTemplate: {type: "template", x: 0, y: 0, width: 20, height: 20, image: "", effect: function(){}},
  },
  game: function(settings){
    let game = {
      build: function(){engine.buildGame(game)},
      nextId: {
        map: 0,
        room: 0,
        direction: 0,
        interaction: 0,
      },
      settings: {},
    };
    for(i in engine.defaultSettings){
      game.settings[i] = engine.defaultSettings[i];
    };
    for(i in settings){
      game.settings[i] = settings[i];
    };
    game.current = {
      map: {},
      room: {},
      roomIndex: 0,
      direction: {},
      facing: "north",
    };
    game.goto = function(roomIndex, dirString, map){
      engine.wipeInteractions(game);
      if(map){
        game.current.map = map;
      };
      if(roomIndex !== undefined){
        game.current.roomIndex = roomIndex;
        game.current.room = game.current.map.rooms[roomIndex];
      };
      if(dirString !== undefined){
        game.current.facing = dirString;
        game.current.direction = game.current.room[dirString];
      }else{
        game.current.direction = game.current.room[game.current.facing];
      };
      game.update();
    };
    game.turn = function(dir){ //!move this to engine?
      let directions = game.current.room.directions;
      let current = directions.indexOf(game.current.direction.name);
      let turn = 0;
      if(dir === "left"){
        turn--;
      }else if(dir === "right"){
        turn++;
      };
      let result = current + turn;
      if(result > directions.length - 1){
        result = 0;
      };
      if(result < 0){
        result = directions.length - 1;
      };
      //game.click = function(){engine.click(game)};
      game.goto(game.current.room.index, directions[result]);
    };
    game.click = function(){engine.click(event, game)};
    game.moveMouse = function(){engine.moveMouse(event, game)};
    //shortcut for common interaction templates (//! consider renaming!)
    game.genNav = function(game, turnWidth, exitWidth, exitHeight){
      let nav = {};
      nav.game = game;
      nav.exit = engine.intTemplate((game.settings.gameSize.x / 2) - (exitWidth / 2), (game.settings.gameSize.y / 2) - (exitHeight / 2), exitWidth, exitHeight, "", function(){console.log("exit not defined")}, "url(ui/uparrow.png), auto");
      nav.turnL = engine.intTemplate(0, 0, turnWidth, game.settings.gameSize.y, "", function(){game1.turn("left")}, "url(ui/leftarrow.png), auto");
      nav.turnR = engine.intTemplate(game.settings.gameSize.x - turnWidth, 0, turnWidth, game.settings.gameSize.y, "", function(){game.turn("right")}, "url(ui/rightarrow.png), auto");
      nav.closeup = engine.intTemplate((game.settings.gameSize.x / 2) - (exitWidth / 2), (game.settings.gameSize.y / 2) - (exitHeight / 2), exitWidth, exitHeight, "", function(){console.log("closeup not defined")}, "url(ui/look.png), auto");
      nav.obtainable = engine.intTemplate((game.settings.gameSize.x / 2) - (exitWidth / 2), (game.settings.gameSize.y / 2) - (exitHeight / 2), exitWidth, exitHeight, "", function(){console.log("obtainable not defined")}, "url(ui/grab.png), auto");
      return nav;
    };
    game.drawTextbox = function(textBox, text){engine.drawTextbox(game, textBox, text)};
    game.map = function(){return engine.map(game)};
    game.update = function(){engine.update(game)};
    game.start = function(){engine.start(game)};
    game.init = function(){};
    return game;
  },
  buildGame: function(game){
    let gameDiv = document.createElement("div");
    gameDiv.setAttribute("id", "game");
    document.body.appendChild(gameDiv);
    game.gameDiv = gameDiv;

    // gameDiv.addEventListener("click", function(){game.click(event, game)});
    // gameDiv.onmousemove = function(){game.moveMouse(event, game)};
    gameDiv.addEventListener("click", game.start);

    gameDiv.style = "margin: auto; border: 4px solid black; position: relative";
    gameDiv.style.backgroundImage = game.settings.startScreen;
    gameDiv.style.width = game.settings.gameSize.x + game.settings.sizeUnits;
    gameDiv.style.height = game.settings.gameSize.y + game.settings.sizeUnits;
    gameDiv.style.backgroundSize = game.settings.gameSize.x + game.settings.sizeUnits + " " + game.settings.gameSize.y + game.settings.sizeUnits;
    let title = document.createElement("title");
    title.setAttribute("id", "title");
    document.head.appendChild(title);
    title.text = game.settings.windowTitle;

    let font = document.createElement("link");
    font.setAttribute("href", "https://fonts.googleapis.com/css?family=" + game.settings.fontRef);
    document.head.appendChild(font);
    
    return gameDiv;
  },
  start: function(game){
    game.init();
    game.gameDiv.removeEventListener("click", game.start);
    game.gameDiv.addEventListener("click", function(){game.click(event, game)});
    game.gameDiv.onmousemove = function(){game.moveMouse(event, game)};
  },
  click: function(event, game){
    for(i in game.current.direction.interactions){
      let cur = game.current.direction.interactions[i];
      if(cur.x < event.layerX && cur.x + cur.width > event.layerX && cur.y < event.layerY && cur.y + cur.height > event.layerY){
        if(cur.visible){
          cur.effect();
          break;
        };
      };
    };
    game.update();
  },
  moveMouse: function(event, game){
    
    if(game.settings.debug){console.log(event.layerX, event.layerY)};
    game.gameDiv.style.cursor = game.settings.defaultCursor;
    for(i in game.current.direction.interactions){
      if(game.current.direction.interactions[i].visible){
        let cur = game.current.direction.interactions[i];
        //!
        if(cur.x < event.layerX && cur.x + cur.width > event.layerX && cur.y < event.layerY && cur.y + cur.height > event.layerY){
        //if(cur.x < event.x && cur.x + cur.width > event.x && cur.y < event.y && cur.y + cur.height > event.y){
          game.gameDiv.style.cursor = cur.cursor;
        };
      };
    };
  },
  map: function(game){
    let map = {};
    map.type = "map";
    map.game = game;
    map.id = game.nextId.map++;
    map.rooms = [];
    map.room = function(){
      let newRoom = engine.room(game);
      newRoom.index = map.rooms.push(newRoom) - 1;
      return newRoom;
    };
    map.addDirections = function(map, directionsArray, imagesArray){
      let image = 0;
      for(y in map.rooms){
        for(p in directionsArray){
          map.rooms[y].dir(directionsArray[p], imagesArray[image]);
          image++;
        };
      };
    };
    map.addInteractions = function(map, directionsArray, interactionsArray){
      for(u in map.rooms){
        for(j in directionsArray){
          for(d in interactionsArray){
            map.rooms[u][directionsArray[j]].int(interactionsArray[d]);
          };
        };
      };
    };
    map.buildMap = function(map, directionsArray, imagesArray, interactionsArray){
      map.addDirections(map, directionsArray, imagesArray);
      map.addInteractions(map, directionsArray, interactionsArray);
    };
    return map;
  },
  room: function(game){
    let room = {};
    room.game = game;
    room.type = "room";
    room.id = game.nextId.room++;
    room.directions = [];
    //create a new direction
    room.dir = function(name, image){
      room[name] = {type: "dir"};
      room[name].name = name;
      room[name].room = room;
      room[name].image = image || "";
      room[name].interactions = [];
      room[name].int = function(optionsOrTemplate, mods){
        let int = {};
        for(i in game.settings.defaultIntTemplate){
          int[i] = game.settings.defaultIntTemplate[i];
        };
        for(i in optionsOrTemplate){
          int[i] = optionsOrTemplate[i];
        };
        for(i in mods){
          int[i] = mods[i];
        };
        if(int.image !== ""){
          int.imageAsset = engine.createImage(int, int.image);
        };
        //!
        int.destroy = function(){};
        room[name].interactions.push(int);
        return int;
      };
      room.directions.push(name);
    };
    return room;
  },
  //set image visible
  displayInteractions: function(game){
    for(i in game.current.direction.interactions){
      game.current.direction.interactions[i].visible = true;
      if(game.current.direction.interactions[i].image !== ""){
        game.gameDiv.appendChild(game.current.direction.interactions[i].imageAsset);
      };
    };
  },
  //wipe int
  wipeInteractions: function(game){
    for(i in game.current.direction.interactions){
      game.current.direction.interactions[i].visible = false;
      if(game.current.direction.interactions[i].image !== ""){
        game.gameDiv.removeChild(game.current.direction.interactions[i].imageAsset);
      }
    }
  },
  createImage: function(interaction, file){
    let imageAsset = document.createElement("img");
    imageAsset.setAttribute("src", file);
    imageAsset.addEventListener("click", interaction.effect);
    //set properties from interaction
    imageAsset.width = interaction.width;
    imageAsset.height = interaction.height;
    imageAsset.style.display = "block";
    imageAsset.style.position = "absolute";
    imageAsset.style.top = interaction.y;
    imageAsset.style.left = interaction.x;
    return imageAsset;
  },
  intTemplate: function(x, y, width, height, image, effect, cursorStyle){
    let template = {type: "template", x: x, y: y, width: width, height: height, image: image, effect: effect, cursor: cursorStyle, visible: false};
    return template;
  },
  audio: {
    player: function(){
      let audioPlayer = {};
      audioPlayer.playing = [];
      audioPlayer.play = async function(track, loop){
        try{
          track.load();
          await track.play();
          audioPlayer.playing.push(track);
        }catch(err){
          console.log("error: " + err);
        };
        if(loop){track.loop = true};
      };
      audioPlayer.pause = function(track){
        if(track){
          track.pause();
        }else{
          for(k in audioPlayer.playing){
            audioPlayer.playing[k].pause();
          };
        };
      };
      audioPlayer.stop = function(track){
        if(track){
          track.pause();
          audioPlayer.playing.splice(audioPlayer.playing.indexOf(track),1);
        }else{
          for(d in audioPlayer.playing){
            audioPlayer.playing[d].pause();
          };
          audioPlayer.playing = [];
        };
      };
      audioPlayer.new = function(file){
        let audio = document.createElement("audio");
        audio.setAttribute("src", file);
        return audio;
      };
      return audioPlayer;
    },
  },
  textbox: function(game, x, y, width, height, background){
    let textbox = {};
    textbox.game = game;
    textbox.visible = false;
    textbox.text = "";
    textbox.overflow = "";
    textbox.x = x;
    textbox.y = y;
    textbox.width = width;
    textbox.height = height;
    textbox.background = background;
    // textbox.bgElement = document.createElement("img");
    // textbox.bgElement.setAttribute("src", background);
    //! consider supporting background-color as an alternative to image?
    textbox.bgElement = document.createElement("div");
    textbox.bgElement.style.zIndex = 100;
    //textbox.bgElement.style.backgroundImage = "url(" + background + ")";
    textbox.bgElement.style.background = "url(" + background + ")";
    textbox.bgElement.style.backgroundSize = width + "px " + height + "px";

    textbox.bgElement.style.height = height;
    textbox.bgElement.style.width = width;
    textbox.bgElement.style.position = "absolute";
    textbox.bgElement.style.top = y; 
    textbox.bgElement.style.left = x;

    textbox.close = function(){
      textbox.bgElement.removeChild(textbox.text);
      game.gameDiv.removeChild(textbox.bgElement);
      game.gameDiv.removeEventListener("click", textbox.advance);
    };
    textbox.enterKey = function(event){
      if(event.code === "Enter"){
        //document.body.removeAttribute(onkeydown);
        textbox.advance();
      };
    };
    textbox.advance = function(){
      if(textbox.overflow === ""){
        textbox.visible = false;
        textbox.close();
      }else{
        //!advance text overflow

      };
    };

    return textbox;
  },
  drawTextbox: function(game, textbox, text){
    engine.wipeInteractions(game);
    textbox.visible = true;
    game.gameDiv.appendChild(textbox.bgElement);
    let textNode = document.createTextNode(text);
    textbox.textNode = textNode;
    textbox.text = document.createElement("div");
    textbox.bgElement.appendChild(textbox.text);
    //style textbox font here!
    //textbox.text.style.margin = game.settings.textboxPadding;
    textbox.text.style.textShadow = "2px 2px 1px black";
    textbox.text.style.padding = game.settings.textboxPadding;
    textbox.text.style.color = game.settings.fontColor;
    textbox.text.style.fontFamily = game.settings.font;
    textbox.text.appendChild(textNode);
    game.gameDiv.addEventListener("click", textbox.advance);
    
    //document.body.setAttribute("onkeydown", "lowerThirdTextbox.enterKey");
    //!check for and create text overflow

  },
  keyDown: function(event){
    console.log(event);
  },
  update: function(game){
    //find current map/room/direction
    let current = game.current.direction;
    //draw direction's image
    game.gameDiv.style.backgroundImage = "url(" + game.settings.assetDirectory + current.image + ")";
    //draw interactions
    engine.displayInteractions(game);
  },
};//engine

//map
//  room
//    direction
//      bgimage
//      interaction
//        image
//        x
//        y
//        width
//        height
//        effect
//  inventory
//    item
//      image
//      height/width
//      effect

//standard assets
//  turn left
//  turn right
//  go forward
//  show closeup
//  obtainable item
//  inventory item