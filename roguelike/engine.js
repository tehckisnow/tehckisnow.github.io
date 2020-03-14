//TODO:
//inventory
//g for get
//basic combat
//field of view

//create map from array (2d or 1d) or string
//vertical flexbox and horizontal flexbox css classes
//colors: dark wall, dark floor, light wall, light floor
//tileset: must match font size to align correctly
//OUTPUT text/log
//implement spacebar interact command (close/open doors, get items, examine)
//mapgen algorithm methods could use a function to take a tile as a parameter
//should engine.update() iterate through all panels?
//character info/status/abilities?

let controls = '<br>Controls:<br>---------<br>directions:<br>y - k - u<br>&nbsp;&nbsp;\\ | /<br>h - . - l<br>&nbsp;&nbsp;/ | \\</br>b - j - n<br>---------<br><br>spacebar - interact<br>; - look mode<br>Escape - back/cancel<br>'

let settings = {
  mapWidth: 50,
  mapHeight: 50,
  viewWidth: 19,
  viewHeight: 15,
  logLength: 5,
  emptyTile: '&nbsp;',
  characterSeperator: '',
  newlineChar: '<br>',
  defaultCharacterColor: 'white',
  defaultCorpseChar: '%',
  defaultHPValue: 10,
  defaultCombatRollAmount: 10,
  fillNewMap: false,
  defaultTiles: {
    empty: ['&nbsp;', 'white', false, false],
    wall: ['#', 'darkgrey', true, true, {desc: 'a stone wall.'}],
    floor: ['.', 'darkgrey', false, false, {desc: 'a stone floor.'}],
    door: ['+', 'darkgrey', true, true, {door: true, locked: false, desc: 'a wooden door.'}],
  },
  colors: {
    w1: 'white',
    r1: 'red',
    b1: 'blue',
    g1: 'green',
  },
};//settings

let engine = {
  colorPallette: function(colorArray){
    let pallette = [];
    for(i in colorArray){
      pallette[i] = colorArray[i];
    };
    return pallette;
  },//colorPallette()
  //call to create a new game and store game data in
  newGame: function(){
    let game = {};
    game.global = {};
    game.div = document.createElement("div");
    game.div.setAttribute('id', 'main');
    game.panels = [];
    game.currentMap = {};
    game.camera = {};
    game.mapPanel = {};
    game.lookCursor = {};
    game.setMap = function(map){game.currentMap = map};
    game.setCamera = function(camera){
      game.camera = camera;
      game.camera.game = game;
    };
    game.setMapPanel = function(mapPanel){game.mapPanel = mapPanel};
    game.newPanel = function(name, text){
      let panel = engine.newPanel(game, name, text);
      game.panels.push(panel);
      //! should this be done manually instead?
      game.div.appendChild(panel.div);
      return panel;
    };//game.newPanel()
    game.newMap = function(...args){
      return engine.newMap(...args);
    };//game.newMap()
    game.input = engine.input;
    game.newCursor = function(...args){
      game.lookCursor = engine.look.newCursor(game, ...args);
      game.lookCursor.game = game;
    };
    game.log = {
      text: [],
      append: function(string){
        game.log.text.push(string);
      },//game.log.append()
      showLast: function(lines){
        
        // if(game.log.text.length > lines){
        //   let result = game.log.text.slice(-lines, lines);
        //   return result.join(settings.newlineChar);
        // }else{
        //   return game.log.text.join(settings.newlineChar);
        // };

        let text = '';
        nextLine = 1;
        while(nextLine <= lines){
          if(game.log.text[game.log.text.length - nextLine]){
            text += game.log.text[game.log.text.length - nextLine];
            text += settings.newlineChar;
          };
          nextLine++;
        };
        return text;
      },
      showAll: function(){
        let text = '';
        for(i in game.log.text){
          text += game.log.text[i] + settings.newlineChar;
        };
        return text;
      },
    };
    game.update = function(){engine.update(game)};
    return game;
  },//newGame()

  newPanel: function(game, name, text){
    let panel = {};
    panel.game = game;
    //a panel is an html <div> with css id [name] that 
    // contains a <p> with css id [name]text
    panel.div = document.createElement("div");
    panel.text = document.createElement("p");
    panel.div.appendChild(panel.text);
    panel.div.setAttribute('id', name);
    panel.text.setAttribute('id', [name + 'text']);
    panel.text.innerHTML = text;
    //replace panel text
    panel.setText = function(text){
      panel.text.innerHTML = text;
    };//setText()
    //append to panel text
    panel.appendText = function(text){
      panel.text.innerHTML += text;
    };//appendText()
    panel.update = function(){};
    return panel;
  },//newPanel()

  newMap: function(game, settings, entities){
    let map = {};
    //!settings and entities should be copies instead of references
    map.settings = settings || {};
    map.entities = entities || [];
    map.game = game;
    map.data = engine.fillMap(settings);
    map.start = {};
    map.setTile = function(x, y, value){
      map.data[y][x] = value;
    };
    map.getTile = function(x, y){
      return map.data[y][x];
    };
    map.newItem = function(x, y, char, color, name, desc){
      let item = engine.newItem(game, x, y, char, color, name, desc);
      map.entities.push(item);
      return item;
    },//map.newItem()
    map.newEntity = function(x, y, char, color, name, desc, level, hostile, other){
      let entity = engine.newEntity(game, x, y, char, color, name, desc, level, hostile, other);
      map.entities.push(entity);
      return entity;
    };//map.newEntity()
    //if using additive mapgen, add map borders
    if(!settings.fillNewMap){
      engine.mapgen.alg2.buildBorders(map);
    };
    map.getEntities = function(x, y){
      let entitiesList = [];
      for(i in map.entities){
        if(map.entities[i].x === x && map.entities[i].y === y){
          entitiesList.push(map.entities[i]);
        };
      };
      return entitiesList;
    };//map.getEntities();

    map.checkSight = function(x, y, distance){
      let visibleTiles = [];
      
    };//map.checkSight()

    return map;
  },//engine.newMap()

  fillMap(settings){
    let data = [];
    let x = 0;
    let y = 0;
    let w = settings.mapWidth;
    let h = settings.mapHeight;
    let row = [];
    let newTile = {};
    if(settings.fillNewMap){
      newTile = engine.newTile(...settings.defaultTiles.wall);
    }else{
      newTile = engine.newTile(...settings.defaultTiles.floor);
    };
    //!the following could be made more efficient by pushing y copies of first row instead of recreating the row y times
    while(y < h){
      while(x < w){
        row.push(engine.newTile(newTile.char, newTile.color, newTile.blocked, newTile.blockSight));
        x++;
      };
      x = 0;
      y++;
      data.push(row);
      row = [];
    };
    return data;
  },//fillMap()

  mapgen: {
    //alg1 is a subtractive map generation algorithm that creates
    // rooms by carving them out of a map filled with solid walls
    alg1: {
      settings: {
        roomMaxSize: 10,
        roomMinSize: 6,
        maxRooms: 30,
      },//settings
      genRooms: function(map, settings){
        let start = {};        
        let rooms = [];
        let numberOfRooms = engine.rand(settings.maxRooms);
        for(z = numberOfRooms; z > 0; z--){
          let room = {};
          room.w = engine.randRange(settings.roomMinSize, settings.roomMaxSize);
          room.h = engine.randRange(settings.roomMinSize, settings.roomMaxSize);
          room.x = engine.rand(map.settings.mapWidth - room.w - 1);
          room.y = engine.rand(map.settings.mapHeight - room.h - 1);
          
          if(rooms.length > 0){
            for(e in rooms){
              if(!engine.mapgen.alg1.checkIntersect(room, rooms[e])){
                room.center = engine.mapgen.alg1.getCenter(room);
                rooms.push(room);
                engine.mapgen.alg1.carveRoom(map, room.x, room.y, room.w, room.h, engine.newTile(...settings.defaultTiles.floor));
              };
            };
          }else{
            rooms.push(room);
          };

          //if first room, place player
          if(rooms.length == 1){
            start = engine.mapgen.alg1.getCenter(rooms[0]);
          }else{ //in all proceeding rooms, generate tunnel
            //let prev = rooms[rooms.length - 1].center;
            let prev = engine.mapgen.alg1.getCenter(rooms[rooms.length - 1]);
            //50/50 flip of horizontal before vertical
            if(engine.rand(2) == 1){
              engine.mapgen.alg1.newHTunnel(map, prev.x, room.x, prev.y);
              engine.mapgen.alg1.newVTunnel(map, prev.y, room.y, prev.x);
            }else{
              engine.mapgen.alg1.newVTunnel(map, prev.y, room.y, prev.x);
              engine.mapgen.alg1.newHTunnel(map, prev.x, room.x, prev.y);
            };
          };
        };
        return start;
      },//genRooms()
      //carve new room
      carveRoom: function(map, x, y, w, h, tile){
        for(n = x; n < x + w; n++){
          for(m = y; m < y + h; m++){
            map.data[m][n] = tile || engine.newTile(...settings.defaultTiles.floor);
          };
        };
      },//map.newRoom()
      newHTunnel: function(map, x1, x2, y2, tile){
        let start = Math.min(x1, x2);
        let end = Math.max(x1, x2);
        for(x = start; x < end; x++){
          map.data[y][x] = tile || engine.newTile(...settings.defaultTiles.floor);
        };
      },//map.newHTunnel()
      newVTunnel: function(map, y1, y2, x, tile){
        let start = Math.min(y1, y2);
        let end = Math.max(y1, y2);
        for(y = start; y < end; y++){
          map.data[y][x] = tile || engine.newTile(...settings.defaultTiles.floor);
        };
      },//map.newVTunnel()
      getCenter: function(room){
        x = (room.x + room.x + room.w) / 2;
        y = (room.y + room.y + room.h) / 2;
        return {x: x, y: y};
      },//getCenter()
      checkIntersect: function(room, other){
        return room.x <= other.x + other.w && room.x + room.w >= other.x && room.y <= other.y + other.w && room.y + room.h >= other.y;
      },//checkIntersect():
    },//alg1
    //alg2 is an additive map generation algorithm that builds rooms by adding
    // them to an empty map
    alg2: {
      buildBorders(map){
        let newWall = engine.newTile(...map.settings.defaultTiles.wall);
        for(i in map.data){
          if(i == 0){
            for(a in map.data[0]){
              map.data[0][a] = engine.newTile(newWall.char, newWall.color, newWall.blocked, newWall.blockSight);
            };
          }else if(i == map.data.length - 1){
            for(a in map.data[i]){
              map.data[i][a] = engine.newTile(newWall.char, newWall.color, newWall.blocked, newWall.blockSight);
            };
          }else{
            map.data[i][0] = engine.newTile(newWall.char, newWall.color, newWall.blocked, newWall.blockSight);
            map.data[i][map.data[0].length - 1] = engine.newTile(newWall.char, newWall.color, newWall.blocked, newWall.blockSight);
          };
        };
      },//buildBorders()
      //!this buildRoom() algorithm is inefficient and suboptimal(could remove wanted data)
      buildRoom: function(map, x, y, w, h, dx, dy){
        let wall = engine.newTile(...settings.defaultTiles.wall);
        let floor = engine.newTile(...settings.defaultTiles.floor);
        engine.fillRect(map, wall, x, y, w, h);
        engine.fillRect(map, floor, x + 1, y + 1, w - 2, h - 2);
        map.data[y + dy][x + dx] = engine.newTile(...settings.defaultTiles.door);
      },//buildRoom()
    },//alg2
  },//mapgen;

  fillRect: function(map, tile, x, y, w, h){
    let currentX = 0;
    let currentY = 0;
    while(currentY <= h){
      while(currentX <= w){
        map.data[y + currentY][x + currentX] = engine.newTile(tile.char, tile.color, tile.blocked, tile.blockSight);
        currentX++;
      };
      currentY++;
      currentX = 0;
    };
  },//fillRect()
  
  newItem: function(game, x, y, char, color, name, desc, other){
    let item = {};
    item.type = 'item';
    item.game = game;
    item.x = x || 0;
    item.y = y || 0;
    item.char = char || '@'; 
    item.color = color || settings.defaultCharacterColor;
    item.name = name || 'item';
    item.desc = desc || 'a generic item';
    item.hp = settings.defaultHPValue;
    item.maxHp = settings.defaultHPValue;
    item.visible = true;
    item.renderOrder = 1;
    if(other){
      for(h in other){
        item[h] = other[h];
      };
    };
    return item;
  },//newItem()

  newEntity: function(game, x, y, char, color, name, desc, level, hostile, other){
    let rollAmount = settings.defaultCombatRollAmount;
    let entity = engine.newItem(game, x, y, char, color, name, desc);
    entity.type = 'entity';
    entity.renderOrder = 2;
    entity.level = level || 1;
    entity.hostile = hostile || false;
    entity.stats = {
      acc: level,
      evd: level,
      str: level,
      def: level,
      attacks: [
        {name: 'hit', acc: 0, damage: 0},
      ],
    };
    entity.stats.defaultAttack = entity.stats.attacks[0];
    entity.hp = entity.level * 10;
    entity.maxHp = entity.level * 10;
    entity.move = function(dir, callback){
      engine.move(entity, dir, callback);
    };
    entity.attack = function(target, attack){
      let attackRoll = engine.rand(rollAmount);
      let attackResult = entity.stats.acc + attack.acc + attackRoll;
      //let defenseRoll = engine.rand(rollAmount);
      let defenseResult = target.stats.evd + 5; //defenseRoll;
      if(attackResult > defenseResult){
        //hit
        game.log.append(entity.name + ' attacks ' + target.name + ' [' + attackRoll + ']' + attackResult);
        let damageRoll = engine.rand(rollAmount);
        let damage = damageRoll + entity.stats.str - target.stats.def;
        if(damage > 0){

          target.takeDamage(damage);
        }else{
          game.log.append(entity.name + ' attacks ' + target.name + ' but fails to penetrate their armor. [' + damageRoll + ']' + damage);
        };
      }else{
        //miss
        game.log.append(entity.name + ' attacks ' + target.name + ' but misses. ' +  '[' + attackRoll + ']' + attackResult);
      };
    };//entity.attack()
    entity.takeDamage = function(amount, type){
      entity.hp -= amount;
      game.log.append(entity.name + ' takes ' + amount + ' damage!');
      if(entity.hp < 0){
        entity.die();
      };
    };//entity.takeDamage()
    entity.die = function(){
      entity.char = settings.defaultCorpseChar;
      game.log.append(entity.name + ' has fallen!');
      entity.name += "\'s corpse";
      //remove entityAI
      //drop entity's inventory

      entity.blocked = false;
      entity.hostile = false;
      entity.type = 'item';
    };//entity.die()
    if(other){
      for(h in other){
        item[h] = other[h];
      };
    };
    return entity;
  },//newEntity()

  newCamera: function(x, y, w, h, map){
    let camera = {};
    camera.x = x || 0;
    camera.y = y || 0;
    camera.width = w;
    camera.height = h;
    camera.map = map;
    camera.game = {};
    camera.follow = {
      following: false,
      target: {},
      xOffset: 0,
      yOffset: 0,
      set: function(target, xOffset, yOffset){
        camera.follow.target = target;
        camera.follow.following = true;
        camera.follow.xOffset = xOffset;
        camera.follow.yOffset = yOffset;
      },//camera.follow.set()
    };//camera.follow
    camera.render = function(){
      let view = [];
      let distance = 6;
      engine.calcFieldOfView(map, camera.follow.target.x, camera.follow.target.y, distance);
      //basic map view
      let currentRow = 0;
      for(row in map.data){
        view[currentRow] = [];
        if(row >= camera.y && row < camera.y + camera.height){
          let currentTile = camera.x;
          while(currentTile < camera.x + camera.width){
            //check for horizontal difference (edge of map)
            if(map.data[row][currentTile] && map.data[row][currentTile].seen){

              view[currentRow].push(map.data[row][currentTile++].char);

            }else{
              view[currentRow].push(settings.emptyTile);
              currentTile++;
            };
          };
          currentRow++;
        };
      };
      //check for vertical difference (edge of map)
      function genBlankRow(char, width){
        let blankRow = [];
        for(n = width; n > 0; n--){
          blankRow.push(char);
        };
        return blankRow;
      };
      if(camera.y < 0){
        let blankRow = genBlankRow(settings.emptyTile, camera.width);
        for(g = camera.y; g < 0; g++){
          view.unshift(blankRow);
        };
      }else if(camera.y + camera.height > map.settings.mapHeight){
        let blankRow = genBlankRow(settings.emptyTile, camera.width);
        for(g = camera.y + camera.height; g > map.settings.mapHeight; g--){
          view.push(blankRow);
        };
      };

      //visibility
      //!

      // entity view
      camera.map.entities.sort(function(a, b){
        return a.renderOrder - b.renderOrder;
      });
      for(i in camera.map.entities){
        let cur = camera.map.entities[i];
        //if(!cur.visible){continue};
        if(cur.x > camera.x &&
          cur.x < camera.x + camera.width &&
          cur.y > camera.y &&
          cur.y < camera.y + camera.height){
            //entity is in camera view
            view[cur.y - camera.y][cur.x - camera.x] = "<span class=\'" + "color" + [cur.color] + "\'>" + cur.char + "</span>";
        };
      };
      if(camera.game.lookCursor){
        if(camera.game.lookCursor.visible){
          let cursor = camera.game.lookCursor;
          view[cursor.y - camera.y][cursor.x - camera.x] = "<span class=\'" + "color" + cursor.color + "\'>" + cursor.char + "</span>";
        };
      };
      return view;
    };//camera.render()

    camera.update = function(){
      if(camera.follow.following){
        camera.x = camera.follow.target.x + camera.follow.xOffset;
        camera.y = camera.follow.target.y + camera.follow.yOffset; 
      };
      camera.game.mapPanel.setText(engine.arrayToString(camera.render(), settings.characterSeperator, settings.newlineChar));
    };//camera.update()

    return camera;
  },//newCamera

  calcFieldOfView: function(map, x, y, distance){
    
    //concentric rings

    let diameter = 1;
    let blocked = {
      top: [],
      right: [],
      bottom: [],
      left: [],
    };
    
    function ring(diameter){
      let x2 = x;
      let y2 = y;
      //top
      x2 -= diameter;
      y2 -= diameter;
      while(x2 < x + diameter){
        map.data[y2][x2].seen = true;
        x2++;
        if(map.data[y2][x2].blockSight){
          blocked.top.push({x: x2, y: y2});
        };
      };
      //right
      while(y2 < y + diameter){
        map.data[y2][x2].seen = true;
        y2++;
        if(map.data[y2][x2].blockSight){
          blocked.right.push({x: x2, y: y2});
        };
      };
      //bottom
      while(x2 > x - diameter){
        map.data[y2][x2].seen = true;
        x2--;
        if(map.data[y2][x2].blockSight){
          blocked.bottom.push({x: x2, y: y2});
        };
      };
      //left
      while(y2 > y - diameter){
        map.data[y2][x2].seen = true;
        y2--;
        if(map.data[y2][x2].blockSight){
          blocked.left.push({x: x2, y: y2});
        };
      };
    };//ring()

    while(diameter < distance){
      ring(diameter);
      diameter++;
    };

  },//calcFieldOfView()

  deepCopy: function(obj){
    //copy properties
    let copy = JSON.parse(JSON.stringify(obj));
    //copy methods
    for(m in obj){
      if(typeof obj[m] == 'function'){
        //something with object.assign() ?

      };
    };
    return copy;
  },//deepCopy()

  newTile: function(char, color, blocked, blockSight, otherObj){
    let tile = {};
    tile.blocked = blocked;
    tile.blockSight = blockSight || false;
    tile.char = char || '.';
    tile.color = color || settings.defaultCharacterColor;
    tile.desc = 'nothing.';
    for(i in otherObj){
      tile[i] = otherObj[i];
    };
    //tile.seen = false;
    tile.seen = false;
    
    return tile;
  },//newTile()

  input: function(game){
    let inputManager = {};
    inputManager.game = game;
    inputManager.modes = [];
    inputManager.currentMode = 0;
    inputManager.newMode = function(){
      let mode = {};
      mode.keys = [];
      mode.mode = inputManager.modes.length;
      mode.newKey = function(key, effect){
        let command = {};
        command.key = key;
        command.effect = effect;
        command.mode = mode.mode;
        addEventListener('keydown', function(event){
          if(event.key === command.key && command.mode === inputManager.currentMode){
            command.effect();
          };
        });
        mode.keys.push(command);
      };//mode.newKey()
      inputManager.modes.push(mode);
      return mode;
    };
    inputManager.setMode = function(mode){;
      let result = inputManager.modes.findIndex(function(element){return element.mode === mode.mode});
      if(result > -1){
        inputManager.currentMode = result;
      };
    };//inputManager.setMode()
    return inputManager;
  },//input

  getDir: function(dir){
    let result = {
      x: 0,
      y: 0,
    };
    switch(dir){
      case 'up':
        result.y--;
        break;
      case 'down':
        result.y++;
        break;
      case 'left':
        result.x--;
        break;
      case 'right':
        result.x++;
        break;
      case 'upleft':
        result.y--;
        result.x--;
        break;
      case 'upright':
        result.y--;
        result.x++;
        break;
      case 'downleft':
        result.y++;
        result.x--;
        break;
      case 'downright':
        result.y++;
        result.x++;
        break;
      default:
    };
    return result;
  },//getDir()

  door: {
    open: function(door){
      if(door.locked){
        //error message: door locked

      }else{
        door.char = '\'';
        door.blocked = false;
        door.blockSight = false;
      }
    },//open()
    close: function(door){
      door.char = '+';
      door.blocked = true;
      door.blockSight = true;
      door.locked = false;
    },
  },//door()

  move: function(entity, direction, callback){
    let dir = engine.getDir(direction);
    //collision check
    let nextTile = entity.game.currentMap.getTile(entity.x + dir.x, entity.y + dir.y)
    if(nextTile.blocked){
      if(nextTile.door){
        engine.door.open(nextTile);
        //!return message?
        entity.game.log.append('You open the door.');
      }else{
      //error message: collision detected
      entity.game.log.append('you cannot seem to go that way.');
      };
    }else{
      //Check for blocking entities
      let ents = entity.game.currentMap.getEntities(entity.x + dir.x, entity.y + dir.y);
      let hostile = ents.find(function(e){return e.hostile == true});
      if(hostile !== undefined){
        entity.attack(hostile, entity.stats.attacks[0]);
      }else{
        entity.x += dir.x;
        entity.y += dir.y;
      };
    };
    if(callback){
      callback();
    };
  },//move

  look: {
    newCursor: function(game, x, y, char, color, output){
      let cursor = {};
      cursor.x = x;
      cursor.y = y;
      cursor.char = char;
      cursor.color = color;
      cursor.renderOrder = 4;
      cursor.output = output || {text: '', update: function(){console.log(this.text)}};
      cursor.visible = false;
      cursor.target = '';
      cursor.follow = function(target){
        cursor.target = target;
      };//cursor.follow()
      cursor.update = function(){
        if(cursor.target !== ''){
          cursor.x = cursor.target.x;
          cursor.y = cursor.target.y;
          cursor.getDesc();
        };
      };
      cursor.move = function(direction, callback){
        let dir = engine.getDir(direction);
        cursor.x += dir.x;
        cursor.y += dir.y;
        cursor.getDesc();
        if(callback){
          callback();
        };
        cursor.game.camera.update();
      };//cursor.move()
      cursor.getDesc = function(){
        let output = '';
        //list items/entities
        let entitiesList = game.currentMap.getEntities(cursor.x, cursor.y);
        if(entitiesList.length > 0){
          for(e in entitiesList){
            if(entitiesList[e].visible){
              //! (should this be entity.name? or entity.desc?)
              output += entitiesList[e].name + settings.newlineChar;
            };
          };
        };
        output += game.currentMap.getTile(cursor.x, cursor.y).desc;
        cursor.output.text = output;
        cursor.output.update();
      };//cursor.getDesc()
      return cursor;
    },
    
  },//engine.look

  ai: {
    newAiComponent: function(){},
    update: function(){},
  },//ai

  update: function(game){
    //game.input.update();

    game.camera.update();
  },//engine.update()

  //misc utility methods

  arrayToString: function(array, seperator, newlineChar){
    let string = '';
    let y = 0;
    while(y < array.length){
      string += array[y].join(seperator || '');
      string += newlineChar || '<br';
      y++;
    };
    return string;
  },//arrayToString()

  //returns true if any of the tags in the tags array come up true for the give tile
  checkTile: function(tileCollection, x, y, tagsArr){
    for(i in tagsArr){
      if(tileCollection.getTile(x, y)[tagsArr[i]]){
        return true;
      };
    };
    return false;
  },//checkTileCollision

  //return random number between 1 and num (will not return zero)
  rand: function(num){
    return Math.floor(Math.random() * num) + 1;
  },//rand()
  //return random number between min and max (both inclusive)
  randRange: function(min, max){
    return engine.rand(max - min + 1) + min - 1;
  },//randRange()

};//engine
