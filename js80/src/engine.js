//automatically start engine on load
document.body.setAttribute("onload", "engine.buildGame()");

//settings:
let settings = {
  //default canvas size
  gameCanvasSize: {x:480,y:240},
  //framerate
  frameInterval: 20, //50 frames per second
  //defaults
  defaultColor: "black",
  //default font
  defaultFont: "Ariel",
  defaultFontSize: 12,
  //build UI frame?
  renderBezel: true,
  //game title
  defaultWindowTitle: "JS-80 Engine",
  //default tilesize in pixels
  defaultTileSize: 16,
  bootText: ["booting hdd 03gf...", "js80 OS version 3.02b (14.69.234)", "login: su (automatic login)", "last login: not recorded", "#938. ggr [38vcn3k] spark 3kn8c4mds.4g", " ", "Sun Oct 29th 07:23:23 GMT 2019", "js80 OS comes with ABSOLUTELY NO GUARENTEE that you will not be swallowed by a gru", "...", "READY", "CLICK OR PRESS A KEY TO CONTINUE", ">_",],
  //this should be called in game file BEFORE init() to adjust game settings
  settings: function(settingsObject){
    for(i in settingsObject){
      settings[i] = settingsObject[i];
    }
  },
}

//these objects and methods are generally only called by the engine itself
let engine = {
  gameCanvas: {},
  draw: {},
  title: {},
  bezel: {},
  bezel2: {},
  buildGame: function(){
    engine.gameCanvas = document.createElement("canvas");
    engine.gameCanvas.setAttribute("width", settings.gameCanvasSize.x);
    engine.gameCanvas.setAttribute("height", settings.gameCanvasSize.y);
    engine.gameCanvas.style.height = settings.gameCanvasSize.y + "px";
    engine.gameCanvas.style.width = settings.gameCanvasSize.x + "px";
    engine.gameCanvas.style.border = "solid black";
    document.body.insertBefore(engine.gameCanvas, document.body.childNodes[0]);
    engine.draw = engine.gameCanvas.getContext("2d");
    if(settings.renderBezel) engine.buildBezel();
    engine.title = document.createElement("title");
    document.head.appendChild(engine.title);
    engine.title.text = settings.defaultWindowTitle;
    document.body.setAttribute("onkeypress", "engine.start()");//this lets you press a key at boot screen
    document.body.setAttribute("onclick", "engine.start()");
    document.body.setAttribute("onload", "defaultTitle()");
    engine.bootScreen();
  },
  buildBezel: function(){
    engine.bezel = document.createElement("div");
    document.body.replaceChild(engine.bezel, engine.gameCanvas);
    engine.bezel2 = document.createElement("div");
    engine.bezel.appendChild(engine.bezel2);
    engine.bezel2.appendChild(engine.gameCanvas);
    engine.bezel2.style.padding = "5px";
    engine.bezel2.style.backgroundColor = "rgb(56, 56, 56)";
    engine.bezel.style.margin = "auto";
    engine.bezel.style.backgroundColor = "rgb(82, 82, 82";
    engine.bezel.style.padding = "15px";
    engine.bezel.style.display = "inline-block";
    engine.bezel.style.borderRadius = "10px";
    engine.bezel.style.boxShadow = "5px 5px 20px 10px rgba(0,0,0,0.7";
    engine.bezel.setAttribute("id", "bezel");
    document.body.style.textAlign = "center";
  },
  //this is primarily here to prevent "play() failed because the user didn't interact with the document first." error
  //player must click to start game
  bootScreen: function(){
    js80.cls("black");
    //js80.text("Click to start", (engine.gameCanvas.width/2) - 30, (engine.gameCanvas.height/2), "white");
    let font = 10 || settings.defaultFontSize;
    let verticalSpacing = font;
    for(i in settings.bootText){
      js80.text(settings.bootText[i], 5, verticalSpacing, "white", font);
      verticalSpacing += font + (font / 2);
    }
  },
  //begin game loop designated in game file (init() and frame())
  start: function(){
    engine.log("start()");
    js80.keyboard.setup();
    document.body.removeAttribute("onkeypress"); //this lets you press a key at boot
    init();
    setInterval(frame, settings.frameInterval);
    document.body.removeAttribute("onclick");
    engine.gameCanvas.setAttribute("onclick", "click(event)");
  },
  //log reports from engine (to be used within this document only)
  log: function(message){
    //Style: "[js-80 Engine] ERROR: this is an error message"
    console.log("[js-80 Engine] " + message);
  },
};

//main engine functions to use for development
let js80 = {
  //log reports from game file (to be used by developer in game file for testing)
  log: function(message){
    console.log("[GameFile] " + message);
  },

  //sets window title
  setTitle: function(newTitle){
    engine.title.text = newTitle;
  },

  //sets canvas size
  canvasSize: function(x, y){
    engine.gameCanvas.style.height = y;
    engine.gameCanvas.style.width = x;
  },

  //reset to initial game state
  reset: function(){},

  //asset manager (create asset references)
  assets: {
    //create 2d asset
    sprite: function(file, tilesize){
      let newSprite = document.createElement("img");
      newSprite.setAttribute("src", file);
      newSprite.tileSize = tilesize || settings.defaultTileSize;
      return newSprite;
    },
    //create audio asset
    audio: function(file){
      let newAudio = document.createElement("audio");
      newAudio.setAttribute("src", file);
      return newAudio;
    },
    //takes an array and returns a 2d array
    map2d: function(array, rowLength){
        let newArray = [];
        let row = [];
        let cell= 0;
        for(i in array){
          //if in current row
          if(cell < rowLength){
            //row[cell] = array[i];
            row.push(array[i]);
            cell++;
          //if in new row
          }else {
            newArray.push(row);
            cell = 0;
            row = [];
            row.push(array[i]);
            cell++;
          }
        }
        newArray.push(row);
        return newArray;
    },
    animation: function(name, sprite, framesArray){},
  },

  //generic timer service (must call js80.timer.update() in game loop for these to work)
  timer: {
    timers: [],
    //increment all timers (this should be called in main loop)
    update: function(){
      let expiredTimers = [];
      for(i in js80.timer.timers){
        js80.timer.timers[i].time--;
        if(js80.timer.timers[i].time < 0){
          js80.timer.timers[i].event();
          expiredTimers.push(js80.timer.timers[i]);
        }
      }//get rid of any timers that have expired
      for(i in expiredTimers){
        js80.timer.terminate(expiredTimers[i]);
      }
    },
    //create a new timer
    new: function(time, event, terminate){
      let newTimer = {};
      newTimer.time = time;
      newTimer.event = event;
      //newTimer.terminate = terminate;
      js80.timer.timers.push(newTimer);
      //return newTimer;
      return js80.timer.timers[js80.timer.timers.length];
    },
    //terminate an existing timer
    terminate: function(timer){
      function toRemove(element){
        return element !== timer;
      }
      js80.timer.timers = js80.timer.timers.filter(toRemove);
    },
  },

  //audio

  //play/stop music()
  musicCurrentlyPlaying: [],
  music: async function(track, loop, stop){
    //let track = track.toLowerCase();
    if((track === "stopall" || track === "stop all") && js80.musicCurrentlyPlaying.length > 0){
      for(i in js80.musicCurrentlyPlaying){
        js80.music(js80.musicCurrentlyPlaying[i], false, true);
      }
    }else if(stop){
      track.pause()
      js80.musicCurrentlyPlaying.splice(js80.musicCurrentlyPlaying.indexOf(track), 1);
    }else{
      try {
        track.load(); //this causes track to start over instead of resume from pause if called again
        await track.play();
        js80.musicCurrentlyPlaying.push(track);
      } catch(err) {
        engine.log("error: " + err);
      }
      if(loop) track.loop = true;
    }
  },

  //play a sound effect
  sfx: async function(sound){
    try {
      await sound.play();
    } catch(err) {
      engine.log("error: " + err);
    }
  },

  //drawing

  //draw rotated sprite (this is a test only and will be removed)
  rSpr: function(image, x, y, angle){
    //add support for cropping
    //merge into spr() tree with additional flag
      engine.draw.save();
      engine.draw.beginPath();
      engine.draw.translate(x + (image.width / 2), y + (image.height / 2));
      engine.draw.rotate(angle * Math.PI / 180);
      engine.draw.drawImage(image, 0, 0, image.width, image.height, -(image.width / 2), -(image.height / 2), image.width, image.height);
      engine.draw.restore();
  },

  testSpr: function(id, x, y, optional){
    let frame, w, h, rot;
    if(optional.frame){frame = frame;}else frame = 0;
    if(optional.w){w = w;}else w = id.width / id.tileSize;
    if(optional.h){h = h;}else h = id.height / id.tileSize;
    if(optional.rot){rot = rot;}else rot = 0;
    let sprite = frame * id.tileSize;

    if(rot !== 0){
      engine.draw.save();
      engine.draw.beginPath();
      engine.draw.translate(x + (id.width / 2), y + (id.height / 2));
      engine.draw.rotate(rot * Math.PI / 180);
    }
    engine.draw.drawImage(id, sprite * w, 0, w * id.tileSize, h * id.tileSize, x, y, w * id.tileSize, h * id.tileSize);
    if(rot !== 0) engine.draw.restore();
  },

  //draw a sprite to the screen
  spr: function(id, x, y, frame, w, h, flip){
    //spr(id, x, y); //spr(id, x, y, frame); //spr(id, x, y, frame, w, h);
    //flip takes "x" or "y" to indicate axis to flip
    if(frame === undefined){
      engine.draw.drawImage(id, x, y);
    }else{
      let sprite = frame * id.tileSize;
      if(w === undefined){w = 1; h = 1};

      function flipSprite(){
        if(flip === "x"){
          engine.draw.scale(-1, 1);
          x = -x - ((id.tileSize * w) / w);
        }else if(flip === "y"){
          engine.draw.scale(1, -1);
          y = -y - ((id.tileSize * h) / h); //this isn't quite right
        }
      }
      //flip if necessary
      if(flip){flipSprite()};

      engine.draw.drawImage(id, sprite * w, 0, w * id.tileSize, h * id.tileSize, x, y, w * id.tileSize, h * id.tileSize);
      //this assumes single-row sprite sheet for now - change that later
      
      //revert if flipped
      if(flip){flipSprite()};
    }
  },

  //draw a line
  line: function(x1, y1, x2, y2, color, width){
    //if color is left off, defaults to settings.defaultColor
    //if width is left off, defaults to 1
    engine.draw.beginPath();
    engine.draw.moveTo(x1, y1);
    engine.draw.lineTo(x2, y2);
    engine.draw.lineWidth = width || 1;
    let stroke = color || settings.defaultColor;
    engine.draw.strokeStyle = stroke;
    engine.draw.stroke();
  },

  //draw a filled rectangle
  rect: function(x, y, width, height, color){
    engine.draw.beginPath();
    engine.draw.fillStyle = color || settings.defaultColor;
    engine.draw.fillRect(x, y, width, height);
  },

  //draw the outline of a rectangle
  rectb: function(x, y, width, height, color){
    engine.draw.beginPath();
    engine.draw.strokeStyle = color || settings.defaultColor;
    engine.draw.strokeRect(x, y, width, height);
  },

  //draw a filled circle
  circ: function(x, y, radius, color){
    engine.draw.beginPath();
    engine.draw.fillStyle = color || settings.defaultColor;
    engine.draw.arc(x, y, radius, 0, 2 * Math.PI);
    engine.draw.fill();
  },

  //draw the outline of a circle
  circb: function(x, y, radius, color){
    engine.draw.beginPath();
    engine.draw.strokeStyle = color || settings.defaultColor;
    engine.draw.arc(x, y, radius, 0, 2 * Math.PI);
    engine.draw.stroke();
  },

  //draw text
  text: function(text, x, y, fontColor, fontSize, nfont){
    //if color, size, and font type are left off, uses defaults
    engine.draw.beginPath();
    let size = fontSize || settings.defaultFontSize;
    let color = fontColor || settings.defaultColor;
    let font = nfont || settings.defaultFont;
    engine.draw.font = size + "px " + font;
    engine.draw.fillStyle = color;
    engine.draw.fillText(text, x, y);
  },

  //clear screen
  cls: function(color){
    //if color is left off, reverts to original background
    if(color){
      engine.draw.beginPath();
      engine.draw.clearRect(0, 0, engine.draw.canvas.width, engine.draw.canvas.height);
      engine.draw.fillStyle = color;
      engine.draw.fillRect(-5, -5, engine.gameCanvas.width + 5, engine.gameCanvas.height + 5);
    } else engine.draw.clearRect(0, 0, engine.draw.canvas.width, engine.draw.canvas.height);
  },

  //draw tilesheet to screen based on tilemap
  map: function(map, tilesheet, tilesize, xOffset, yOffset){
    engine.draw.beginPath();
    x = xOffset || 0;
    y = yOffset || 0;
    let numberOfRows = tilesheet.naturalWidth / tilesize || tilesheet.tilesize;
    let currentRow;
    let currentTile;
    for(row in map){
      for(tile in map[row]){
        currentTile = map[row][tile];
        currentRow = Math.floor(currentTile / numberOfRows);
        currentTile -= currentRow * numberOfRows;
        engine.draw.drawImage(tilesheet, currentTile * tilesize, currentRow * tilesize, tilesize, tilesize, x * tilesize, y * tilesize, tilesize, tilesize);
        x++;
      }
      x = xOffset;
      y++;
    }
  },

  //returns tile id of given x,y map coordinate
  mget: function(map, x, y, tileSize){
    tileSize = map.tileSize;
    if(tileSize === undefined) tileSize = settings.defaultTileSize;
    let x2 = Math.floor(x / tileSize);
    let y2 = Math.floor(y / tileSize);
    //check if on map:
    let result;
    if(map[y2] && map[y2][x2]){
      result = map[y2][x2];
    }else result = -1  
    return result;
  },

  //set tile in tilemap
  mset: function(map, x, y, tileId){
    //x,y are tile coordinates, not pixel coordinates
    map[y][x] = tileId;
  },

  //input

  //keyboard manager object
  keyboard: {
    setup: function(){
      document.body.setAttribute("onkeydown", "js80.keyboard.keyDown(event)");
      //document.body.setAttribute("onkeypress", "keyboard.keyDown(event)");
      document.body.setAttribute("onkeyup", "js80.keyboard.keyUp(event)");
    },
    //array of keys this game will intend to watch:
    keys: [
      {id: "ArrowLeft", state: false},
      {id: "ArrowRight", state: false},
      {id: "ArrowUp", state: false},
      {id: "ArrowDown", state: false},
      {id: "Enter", state: false},
      {id: " ", state: false},
      {id: "Control", state: false},
      {id: "Alt", state: false},
      {id: "Shift", state: false},
      {id: "z", state: false},
      {id: "x", state: false},
      {id: "w", state: false},
      {id: "a", state: false},
      {id: "s", state: false},
      {id: "d", state: false},
      {id: "q", state: false},
      {id: "e", state: false},
      {id: "c", state: false},
    ],
    //sets key state in keyboard.keys to true
    keyDown: function(event){
      let key = js80.keyboard.keys.findIndex(function(element){return element.id === event.key});
      if(key !== -1) js80.keyboard.keys[key].state = true;
    },
    //sets key state in keyboard.keys to false
    keyUp: function(event){
      let key = js80.keyboard.keys.findIndex(function(element){return element.id === event.key});
      if(key !== -1) js80.keyboard.keys[key].state = false;

      //remove from pressed (for btnp)
      if(js80.keyboard.pressed.includes(event.key)){
        //remove from pressed
        let pressedKey = js80.keyboard.pressed.indexOf(event.key);
        js80.keyboard.pressed.splice(pressedKey, 1);
      };
    },
    //adds a new key to keyboard.keys to be monitored
    addKey: function(id){
      js80.keyboard.keys.push({id: id, state: false});
    },

    //add a key when pressed (for testing btnp())
    //btnp() adds to this list
    //keyup() removes from this list
    pressed: [],

  },

  //returns true if button "inp" is currently pressed
  btn: function(inp){
    let key = js80.keyboard.keys.findIndex(function(element){return element.id === inp});
    if(key !== -1) return js80.keyboard.keys[key].state;
  },

  //returns true the moment button "inp" is pressed
  btnp: function(inp, hold, period){
    //returns true the moment button "id" is pressed
    let key = js80.keyboard.keys.findIndex(function(element){return element.id === inp});
    //if inp is a valid key being watched and is currently being held
    if(key !== -1 && js80.keyboard.keys[key].state){
      //return js80.keyboard.keys[key].state;

      //check if inp is in pressed, if not, add it and return true
      if(!(js80.keyboard.pressed.includes(inp))){
        js80.keyboard.pressed.push(inp);
        return true;
      }else return false;
    }
  },

  //triggered on mouseclick
  click: function(event){
    let clickX = event.clientX;
    let clickY = event.clientY;
  },

  //returns mouse coordinates
  mouse: function(){
    //let clickX = event.clientX;
    //let clickY = event.clientY;
    return {x:clickX, y:clickY};
  },
}