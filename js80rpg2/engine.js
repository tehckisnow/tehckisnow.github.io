const engine = {
  defaultSettings: {
    debug: false,
    canvas: {},
    ctx: {},
    canvasName: "gameCanvas",
    width: 300,
    height: 200,
    unit: "px",
    marginTop: 40,
    defaultColor: "gray",
    defaultBgColor: "black",
    defaultFont: "Arial",
    defaultFontColor: "white",
    defaultFontSize: "12px",
    frameRate: 60,
    defaultTileSize: 16,
    renderScale: 1,
    //systemOrder: ["input", "entities", "assets", "collisions", "events", "save", "animations", "render"],
    systemOrder: ["input", "collision", "events", "animation", "render"],
  },//defaultSettings

  log: function(message){console.log('[ENGINE] ' + message)},

  random: function(num){
    return Math.floor(Math.random() * num) + 1;
  },//random()

  start: function(game){
    setInterval(game.frame, 1000 / game.settings.frameRate);
  },//start()

  DOM: {
    create: function(type){
      return document.createElement(type);
    },
    append: function(element, parent){
      parent ? parent.appendChild(element) : document.body.appendChild(element);
    },
    buildCanvas: function(game){
      let newCanvas = engine.DOM.create("canvas");
      engine.DOM.append(newCanvas);
      newCanvas.style.width = game.settings.width + game.settings.unit;
      newCanvas.style.height = game.settings.height + game.settings.unit;
      newCanvas.width = game.settings.width;
      newCanvas.height = game.settings.height;
      newCanvas.style.border = "solid black";
      newCanvas.style.margin = "auto";
      newCanvas.style.marginTop = game.settings.marginTop + game.settings.unit;
      newCanvas.style.display = "block";
      game.settings.canvas = newCanvas;
      newCanvas.ctx = newCanvas.getContext("2d");
      newCanvas.ctx.fillStyle = game.settings.defaultBgColor;
      return newCanvas;
    },
  },//DOM

  newGame: function(settings){
    let game = {
      canvas: {},
      frame: function(){console.log("GAME.frame() has not yet been defined.")},
      start: function(){engine.start(game)},
      settings: {},
      scenes: {
        new: function(){
          return engine.scenes.new(game);
        },
        current: {},
        setCurrent: function(scene){game.scenes.current = scene},
        active: [],
        inactive: [],
      },
      save: {
        //!

      },
      input: {update: function(){}},
      update: function(){
        game.input.update();
        engine.update(game.scenes.active);
      },
    };
    for(i in engine.defaultSettings){
      game.settings[i] = engine.defaultSettings[i];
    };
    if(settings){
      for(i in settings){
        game.settings[i] = settings[i];
      };
    };
    game.canvas = engine.DOM.buildCanvas(game);
    return game;
  },//newGame()
  update: function(scenes){
    for(i in scenes){
      scenes[i].update();
    };
  },//update()

  //systems

  //scene constructor
  scenes: {
    new: function(game){
      let newScene = {
        nextId: 0,
        parent: game,
        active: false,
        setActive: function(){
          console.log("setting scene active.");
          if(newScene.parent.scenes.active.indexOf(newScene) < 0){
            newScene.parent.scenes.active.push(newScene);
            newScene.active = true;
            let index = newScene.parent.scenes.inactive.indexOf(newScene);
            index > -1 ? newScene.parent.scenes.inactive.splice(index, 1) : 1;
          };
        },
        setInactive: function(){
          if(newScene.parent.scenes.inactive.indexOf(newScene) < 0){
            newScene.parent.scenes.inactive.push(newScene);
            newScene.audio.manager.stop();
            newScene.active = false;
            let index = newScene.parent.scenes.active.indexOf(newScene);
            index > -1 ? newScene.parent.scenes.active.splice(index, 1) : 1;
          };
        },
        entities: [],
        newEntity: function(...args){
          let entity = engine.entities.new(newScene, ...args);
          entity.id = newScene.nextId++;
          newScene.entities.push(entity);
          return entity;
        },
        //events
        events: {
          events: [],
          expired: [],
          triggers: [],
          new: function(trigger, effect){
            let event = {};
            event.trigger = trigger;
            event.effect = effect;
            newScene.events.events.push(event);
            return event;
          },
          pullTrigger: function(trigger){
            newScene.events.triggers.push(trigger);
          },
          check: function(trigger){
            for(i in newScene.events.events){
              if(newScene.events.events[i].trigger === trigger){
                newScene.events.events[i].effect();
                newScene.events.expired.push(i);
              };
            };
            for(u in newScene.events.expired){
              newScene.events.events.splice(newScene.events.expired[u], 1);
            };
            newScene.events.expired = [];
          },
        },
        //animation
        animation: {
          entities: [],
          update: function(){
            engine.animation.update(newScene.animation.entities);
          },
        },
        //render
        render: {
          entities: [],
          update: function(){
            engine.render.update(newScene.parent, newScene.render.entities);
          },
        },
        //collision
        collision: {
          entities: [],
          update: function(){},//!is there any need for this?
        },
        //timer
        timer: {
          manager: engine.timer.newManager(),
        },
        //map
        map: {
          current: {},
          setCurrent: function(map){newScene.map.current = map},
          getCurrent: function(){return newScene.map.current},
        },
        audio: {
          manager: engine.audio.newController(),
        },
        ui: {
          manager: engine.ui.newManager(game),
        },
        //update scene
        update: function(){
          //events
          for(i in newScene.events.triggers){
            newScene.events.check(newScene.events.triggers[i]);
          };
          newScene.events.triggers = [];
          //timers
          newScene.timer.manager.update();
          //map?
          //collision?
          newScene.animation.update();
          newScene.frame();
          if(newScene.camera){
            newScene.camera.update();
            //!this may allow possibility of wrong scene updating camera
          }else{
            engine.render.update(newScene.parent, newScene.render.entities);
          };
          //newScene.effects.manager.update();
          newScene.ui.manager.update();
          //newScene.effects.fade.update();
          //engine.render.update(newScene.parent, newScene.render.entities);
        },
        //called every frame; used for developer input
        frame: function(){},
      };
      game.scenes.inactive.push(newScene);
      return newScene;
    },
  },//scenes

  //entity constructor
  entities: {
    new: function(scene, x, y, z){
      let newEntity = {
        assets: [],
        // render: [],
        // animation: [],
        // collision: [],
        // ui: [],
        // input: [],
        // save: [],
        destroy: function(){
          scene.entities.splice(scene.entity.iterable.findIndex(newEntity), 1);
        },
        add: {
          assets: function(scene, assetType, ...args){
            let asset = engine.assets.new(scene, assetType, ...args);
            asset.parent = newEntity;
            newEntity.assets.push(asset);//!
            //! the above line allows multiple assets to be attached to an entity
            //! is this good?  it deviates from the pattern
            return asset;
          },
          render: function(scene, type, ...args){
            let render = engine.render.new(scene, type, ...args);
            render.parent = newEntity;
            newEntity.render = render;
            scene.render.entities.push(newEntity);
            engine.render.sort(scene.render.entities);
            return render;
          },
          camera: function(scene, ...args){},
          animation: function(...args){
            let animation = engine.animation.new(...args);
            animation.parent = newEntity;
            scene.animation.entities.push(newEntity);
            newEntity.animation = animation;
            return animation;
          },
          collision: function(scene, ...args){
            let collision = engine.collision.new(...args);
            collision.parent = newEntity;
            scene.collision.entities.push(newEntity);
            newEntity.collision = collision;
            return collision;
          },
          ui: function(scene, ...args){},
          input: function(scene, ...args){},
          save: function(scene, ...args){},
        },
      };
      newEntity.x = x || 0;
      newEntity.y = y || 0;
      newEntity.z = z || 0;
      return newEntity;
    },
  },//entities

  //assets manager
  assets: {
    new: function(scene, assetType, ...args){
      let newAsset = engine.assets[assetType](scene, ...args);
      newAsset.type = assetType;
      //
      return newAsset;
    },
    image: function(scene, file){
      let newAsset = engine.DOM.create("img");
      newAsset.setAttribute("src", file);
      return newAsset;
    },
    sound: function(){},
    tileSet: function(scene, file, tileSize){
      let newTileSet = engine.DOM.create("img");
      newTileSet.setAttribute("src", file);
      newTileSet.tileSize = tileSize;
      return newTileSet;
    },
    sprite: function(x, y, width, height){
      let newSprite = {x: x, y: y, width: width, height: height,};
      return newSprite;
    },
    genSprites: function(asset){
      let sprites = [];
      let currentX = 0; 
      let currentY = 0;
      while(currentY < asset.height){
        let newSprite = engine.assets.sprite(currentX, currentY, asset.spriteWidth, asset.spriteHeight);
        sprites.push(newSprite);
        currentX += asset.spriteWidth;
        if(currentX >= asset.width){
          currentX = 0;
          currentY += asset.spriteHeight;
        };
      };
      return sprites;
    },
    spriteSheet: function(scene, file, width, height){
      let newSpriteSheet = engine.DOM.create("img");
      newSpriteSheet.setAttribute("src", file);
      newSpriteSheet.spriteWidth = width || scene.parent.settings.defaultTileSize;
      newSpriteSheet.spriteHeight = height || scene.parent.settings.defaultTileSize;

      //! SHOULD NOT HAVE TO declare these dimensions!!! why are they 0?
      newSpriteSheet.height = 160;
      newSpriteSheet.width = 256;
      
      newSpriteSheet.sprites = engine.assets.genSprites(newSpriteSheet);
      return newSpriteSheet;
    },
    //consolidates map object properties that are in Tiled map format into a simple object
    getMapProperties: function(mapObject){
      let properties = {};
      for(i in mapObject.properties){
        properties[mapObject.properties[i].name] = mapObject.properties[i].value;
      };
      properties.x = mapObject.x; 
      properties.y = mapObject.y;      
      properties.width = mapObject.width; properties.height = mapObject.height;
      return properties;
    },
    //pass a mapEntity, layer index, and x/y coordinates and it will return the first object
    //if property has a value, an entity will only be returned if that value is defined
    //if value has a value, an entity will only be returned if it's property's value matches this value
    checkMapObject: function(map, layer, x, y, property, value){
      let obj = map.assets[0].layers[layer].mget(x, y);
      if(value !== undefined){
        if(obj[property] === value){
          return obj;
        }else {return false};
      }else if(property !== undefined){
        if(obj[property] !== undefined){
          return obj;
        }else {return false};
      };
      return obj;
    },
    map: function(scene, mapData, width, tileSet, collideLayer, TiledOffset){
      let newMap = {
        type: "map",
        layers: [],
      };
      newMap.collideLayer = collideLayer;
      newMap.TiledOffset = 0;
      if(TiledOffset){newMap.TiledOffset = TiledOffset};
      newMap.tileset = tileSet;
      newMap.properties = mapData.properties;
      newMap.tileheight = tileSet.tileSize;
      newMap.tilewidth = tileSet.tileSize;
      newMap.width = width; //width in tiles
      newMap.checkMapObject = function(layer, x, y, property, value){
        return newMap.layers[layer].checkMapObject(x, y, property, value);
      },
      newMap.mget = function(x, y, layer){
        return newMap.layers[layer].mget(x, y);
      };//mget()
      for(i in mapData.layers){
        if(mapData.layers[i].type === "objectgroup"){
          let nextLayer = engine.assets.mapObjectLayer(mapData.layers[i].name, mapData.layers[i].objects);
          nextLayer.parent = newMap;
          nextLayer.layer = newMap.layers.length || 0;
          newMap.layers.push(nextLayer);
        }else{
          let nextLayer = engine.assets.mapTileLayer(mapData.layers[i].name, mapData.layers[i].data, newMap.width, mapData.layers[i].visible, "tilelayer", newMap.tileset);
          nextLayer.parent = newMap;
          nextLayer.layer = newMap.layers.length || 0;
          newMap.layers.push(nextLayer);          
        };
      };
      return newMap;
    },
    mapObjectLayer: function(name, objects){
      let newLayer = {};
      newLayer.name = name;
      newLayer.type = "objectgroup";
      //objects
      newLayer.objects = [];
      for(i in objects){
        newLayer.objects.push(engine.assets.getMapProperties(objects[i]));
      };
      newLayer.checkMapObject = function(x, y, property, value){
        return engine.assets.checkMapObject(newLayer.parent.parent, newLayer.layer, x, y, property, value);
      },
      newLayer.mget = function(x, y){
        //!
        y = y + 16; //!!!!!!!!!!!!!!!!!!!!!!!!
        for(g in newLayer.objects){
          if(newLayer.objects[g].x < x && newLayer.objects[g].x + newLayer.objects[g].width > x && newLayer.objects[g].y < y && newLayer.objects[g].y + newLayer.objects[g].height > y){
            return newLayer.objects[g];
          };//else {return false};
        };
        return false;
      };
      //search layer for first object with property = value
      //returns first object with property if value is not specified
      newLayer.findProperty = function(property, value){
        for(f in newLayer.objects){
          if(value){
            if(newLayer.objects[f][property] === value){
              return newLayer.objects[f];
            };
          }else{
            if(newLayer.objects[f][property]){
              return newLayer.objects[f];
            };
          };
        };
      };
      return newLayer;
    },
    //!remove type; it is unneeded
    mapTileLayer: function(name, data, width, visible, type, tileSet){
      let newLayer = {};
      if(type === "tilelayer"){
        newLayer.name = name;
        newLayer.data = data;
        newLayer.width = width;
        newLayer.visible = visible;
        newLayer.type = "tilelayer";
        newLayer.tileSet = tileSet;

        newLayer.mget = function(x, y){
          let x2 = Math.floor(x / newLayer.tileSet.tileSize);//tilewidth);
          let y2 = Math.floor(y / newLayer.tileSet.tileSize);//tileheight);
          let result = -1;
          let cell = (newLayer.width * y2) + x2;
          if(cell > 0 && newLayer.data[cell]){
            result = newLayer.data[cell]
          };
          return result;
        };//mget()
      };
      
      return newLayer;
    },
    update: function(){},
  },//assets

  //render system
  render: {
    //create a new render component and attach it to an entity
    new: function(scene, type, asset, sprite, xOffset, yOffset, zOffset){
      let newComponent = {};
      newComponent.type = type;
      newComponent.asset = asset;
      newComponent.sprite = sprite || 0;
      newComponent.xOffset = xOffset || 0;
      newComponent.yOffset = yOffset || 0;
      newComponent.zOffset = zOffset || 0;
      newComponent.flipH = 1;
      newComponent.flipV = 1;
      newComponent.visible = true;
      return newComponent;
    },
    //manually draw an image to the screen
    image: function(game, image, x, y){
      game.settings.canvas.ctx.drawImage(image, x || 0, y || 0);
    },
    //manually draw a sprite from a spritesheet to the screen
    spr: function(game, spriteSheet, spr, x, y, flipH, flipV){
      //if(flipH !== undefined){game.settings.canvas.ctx.scale(flipH, flipV)};
      game.settings.canvas.ctx.drawImage(
        spriteSheet,
        spriteSheet.sprites[spr].x,
        spriteSheet.sprites[spr].y,
        spriteSheet.sprites[spr].width,
        spriteSheet.sprites[spr].height,
        x || 0,
        y || 0,
        spriteSheet.sprites[spr].width * game.settings.renderScale,
        spriteSheet.sprites[spr].height * game.settings.renderScale
      );
    },
    //render a map entity
    map: function(game, mapEntity, xOff, yOff, zOff){
      let xOffset = mapEntity.render.xOffset;
      let yOffset = mapEntity.render.yOffset;
      let zOffset = mapEntity.render.zOffset;
      let x = mapEntity.x + (xOff || 0);
      let y = mapEntity.y + (yOff || 0);
      let z = mapEntity.z + (zOff || 0);

      //! the following will find first map asset.  this could cause problems if there are multiple.
      let map;
      for(i in mapEntity.assets){
        if(mapEntity.assets[i].type === "map"){
          map = mapEntity.assets[i];
        };
      };

      TiledOffset = map.TiledOffset;
      let tileSize = map.tilewidth;
      game.canvas.ctx.beginPath();
      for(i in map.layers){
        if(map.layers[i].type === "tilelayer" && map.layers[i].visible){
          function drawTile(cell){
            let tileSetWidth = map.tileset.naturalWidth / tileSize;
            let tileY = Math.floor(cell / tileSetWidth);
            let tileX = cell - (tileY * tileSetWidth);
            game.canvas.ctx.drawImage(map.tileset, tileX * map.tilewidth, tileY * map.tileheight, tileSize, tileSize, (column * tileSize) + xOffset + x, (row * tileSize) + yOffset + y, tileSize, tileSize);
          };
          let currentLayer = map.layers[i];
          //let width = currentLayer.width; //width of map layer in tiles
          let width = map.width;
          let column = 0;
          let row = 0;
          for(cell in currentLayer.data){
            if(column < width - 1){
              //add next tile
              drawTile(currentLayer.data[cell] + (TiledOffset || 0));
              column++;
            }else{
              //new line
              drawTile(currentLayer.data[cell] + (TiledOffset || 0));
              column = 0;
              row++;
            };
          };
        };
      };      
    },
    //basic drawing methods
    //draw a filled rectangle to the screen
    rect: function(game, x, y, x2, y2, color){
      game.canvas.ctx.beginPath();
      game.canvas.ctx.fillStyle = color || game.settings.defaultColor;
      game.canvas.ctx.fillRect(x, y, x2, y2);
    },
    //draw a rectangular outline to the screen
    rectb: function(game, x, y, x2, y2, color){
      game.canvas.ctx.beginPath();
      game.canvas.ctx.strokeStyle = color || game.settings.defaultColor;
      game.canvas.ctx.strokeRect(x, y, x2, y2);
    },
    //fill the screen with a color; defaults to settings.defaultBgColor
    cls: function(game, color){
      let colorUsed;
      if(color){
        colorUsed = color;
      }else{
        colorUsed = game.settings.defaultBgColor;
      };
      engine.render.rect(game, 0, 0, game.settings.width, game.settings.height, colorUsed);
    },
    //draw a line to the screen
    line: function(game, x, y, x2, y2, color){
      game.canvas.ctx.beginPath();
      game.canvas.ctx.strokeStyle = color || game.settings.defaultColor;
      game.canvas.ctx.moveTo(x, y);
      game.canvas.ctx.lineTo(x2, y2);
      game.canvas.ctx.stroke();
    },
    //draw a filled circle to the screen
    circ: function(game, x, y, radius, color, startAngle, endAngle, counterClockwise){
      game.canvas.ctx.beginPath();
      game.canvas.ctx.fillStyle = color || game.settings.defaultColor;
      game.canvas.ctx.arc(x, y, radius, startAngle || 0, endAngle || 2 * Math.PI);
      game.canvas.ctx.fill();
    },
    //draw a circular outline to the screen
    circb: function(game, x, y, radius, color, startAngle, endAngle, counterClockwise){
      game.canvas.ctx.beginPath();
      game.canvas.ctx.strokeStyle = color || game.settings.defaultColor;
      game.canvas.ctx.arc(x, y, radius, startAngle || 0, endAngle || 2 * Math.PI);
      game.canvas.ctx.stroke();
    },
    //draw text to the screen
    text: function(game, text, x, y, color, font, fontSize){
      game.canvas.ctx.beginPath();
      //game.canvas.ctx.textAlign = "center";
      game.canvas.ctx.font = (fontSize || game.settings.defaultFontSize) + " " + (font || game.settings.defaultFont);
      game.canvas.ctx.fillStyle = color || game.settings.defaultFontColor;
      game.canvas.ctx.fillText(text || "", x || 0, y || 0);
    },
    //draw outline text to the screen
    textb: function(game, text, x, y, color, font, fontSize){
      game.canvas.ctx.beginPath();
      game.canvas.ctx.font = (fontSize || game.settings.defaultFontSize) + " " + (font || game.settings.defaultFont);
      game.canvas.ctx.strokeStyle = color || game.settings.defaultFontColor;
      game.canvas.ctx.strokeText(text || "", x || 0, y || 0);
    },

    camera: {
      new: function(scene){
        let camera = {
          scene: scene,
          game: scene.parent,
          x: 0,
          y: 0,
          z: 0,
          following: "none",
          xOffset: 0, yOffset: 0, zOffset: 0,//used for following
          position: {
            //translate between screen and map coordinates
            get: function(entity){
              let map = scene.map.current;
              return {x: -map.x + entity.x, y: -map.y + entity.y};
            },
            set: function(entity, x, y){
              entity.x = -x + entity.x;
              entity.y = -y + entity.y;
            },
          },
          pan: function(x, y, speed, duration){},
          follow: function(target, xOffset, yOffset, zOffset){
            if(!target){
              camera.x = 0; camera.y = 0; camera.z = 100;
            }else{
              camera.following = target;
              camera.xOffset = xOffset;
              camera.yOffset = yOffset;
              camera.zOffset = zOffset;
              camera.x = target.x + (xOffset || 0);
              camera.y = target.y + (yOffset || 0);
              camera.z = target.z + (zOffset || 0);
            };
          },
          //if you want to use camera controls, call this instead of engine.render.all()
          update: function(){
            if(camera.following !== "none"){
              camera.follow(camera.following, camera.xOffset, camera.yOffset, camera.zOffset);
            };
            engine.render.update(camera.game, camera.scene.render.entities, -camera.x, -camera.y);
          },
        };
        camera.scene.camera = camera;
        return camera;
      },
    },//camera

    sort: function(collection){
      //sort by z-axis
      collection.sort(function(a, b){return a.z - b.z});

    },
    //pass an array of entities with render components to draw all of them to the screen
    update: function(game, collection, xOffset, yOffset){
      engine.render.cls(game, game.settings.defaultBgColor);
      for(i in collection){
        let current = collection[i];
        if(!current.render.visible){continue};
        switch(current.render.type){
          case "image":
            engine.render.image(game, current.render.asset, current.x + (xOffset || 0), current.y + (yOffset || 0));
            break;
          case "sprite":
            engine.render.spr(game, current.render.asset, current.render.sprite, current.x + (xOffset || 0), current.y + (yOffset || 0), current.render.flipH, current.render.flipV);
            break;
          case "map":
            engine.render.map(game, current, current.x + (xOffset || 0), current.y + (yOffset || 0));
            break;
          default:
            console.log("render.type not found for ", collection[i]);
        };
      };
    },
  },//render

  //animation system
  animation: {
    new: function(anims, frameRate, defaultAnim, startingAnim){
      let newComponent = {};
      newComponent.anims = anims;
      newComponent.default = defaultAnim || "default";
      newComponent.anims.default = [newComponent.anims[newComponent.default]] || "default";
      newComponent.currentAnim = startingAnim || defaultAnim || "default";
      newComponent.frame = 0;
      newComponent.frameRate = frameRate || 20;
      newComponent.animTimer = frameRate || 20;
      newComponent.setAnim = function(anim){
        if(newComponent.currentAnim !== anim){
          newComponent.currentAnim = anim;
          newComponent.frame = 0;
          newComponent.parent.render.sprite = newComponent.anims[newComponent.currentAnim][newComponent.frame];
        };
      };
      newComponent.animate = function(){
        newComponent.animTimer--;
        if(newComponent.animTimer < 0){
          newComponent.animTimer = newComponent.frameRate;
          newComponent.frame++;
          if(newComponent.frame > newComponent.anims[newComponent.currentAnim].length - 1){
            newComponent.frame = 0;
          };
          newComponent.parent.render.sprite = newComponent.anims[newComponent.currentAnim][newComponent.frame];
        };
      };
      return newComponent;
    },
    update: function(collection){
      for(i in collection){
        collection[i].animation.animate();
      };
    },
  },//animation

  //collision system
  collision: {
    new: function(width, height, xOffset, yOffset, tags){
      let newComponent = {};
      newComponent.width = width;
      newComponent.height = height;
      newComponent.xOffset = xOffset;
      newComponent.yOffset = yOffset;
      newComponent.tags = tags || [];
      return newComponent;
    },
    collideEntity: function(group, entity, xMove, yMove, tags){
      for(i in group){
        let ent = group[i];
        if(ent.id == entity.id){continue};
        for(u in tags){
          if(ent.collision.tags.includes(tags[u])){
            //check for collision

            if(engine.collision.checkOverlap(entity, ent, xMove, yMove)){
              return true;
            };
          };
        };
      };
      return false;
    },
    //!do collideTile(), collideLayer(), (and maybe others) need to check entity's render.xOffset/yOffset?
    collideTile: function(map, layerIndex, collidableTiles, entity, xMove, yMove){
      let tile = map.mget(entity.x + (xMove || 0) - map.parent.render.xOffset, entity.y + (yMove || 0) - map.parent.render.yOffset, layerIndex);
      if(collidableTiles.includes(tile)){
        return true;
      }else{
        return false;
      };
    },
    checkCollisionLayer: function(map, layer, x, y, threshold){
      let tileThreshold = threshold || 0;
      let tile = map.mget(x, y, layer);
      return tile > tileThreshold ? true : false;
    },
    collideLayer: function(map, layerIndex, entity, xMove, yMove, collisionThreshold){
      //! the following line does not take collisionWidth into account
      let tile = map.mget(entity.x + entity.collision.xOffset + (xMove || 0) - map.parent.render.xOffset, entity.y + entity.collision.yOffset + (yMove || 0) - map.parent.render.yOffset, layerIndex);
      collisionThreshold = collisionThreshold || -1;
      if(tile > collisionThreshold){
        return true;
      }else{
        return false;
      };
    },
    //return an entity if the coordinate is inside their hitbox
    checkPoint: function(x, y, entities, tag){
      for(i in entities){
        //for(u in entities[i].collision.tags){
          //if(entities[i].collision.tags[u] === tag){
            if(x > entities[i].x + entities[i].collision.xOffset &&
              x < entities[i].x + entities[i].collision.xOffset + entities[i].collision.width &&
              y > entities[i].y + entities[i].collision.yOffset &&
              y < entities[i].y + entities[i].collision.yOffset + entities[i].collision.height){
                return entities[i];
            };
          //};
        //};
      };
      return false;
    },
    checkOverlap: function(a, b, xMove, yMove){
      let xm = xMove || 0;
      let ym = yMove || 0;
      if(a.x + a.collision.xOffset + xm <= b.x + b.collision.xOffset + b.collision.width &&
        a.x + a.collision.xOffset + xm + a.collision.width >= b.x + b.collision.xOffset &&
        a.y + a.collision.yOffset + ym <= b.y + b.collision.yOffset + b.collision.height &&
        a.y + a.collision.yOffset + ym + a.collision.height >= b.y + b.collision.yOffset){
          return true;
        };
      return false;
    },
    //!collideAny is dumb.  revise this
    collideAny: function(map, layerIndex, group, entity, xMove, yMove, tags, collidableTiles, collisionThreshold){
      if(engine.collision.collideTile(map, layerIndex, collidableTiles, entity, xMove, yMove)){
        return true;
      };
      if(engine.collision.collideLayer(map, layerIndex, entity, xMove, yMove, collisionThreshold)){
        return true;
      };
      if(engine.collision.collideEntity(group, entity, xMove, yMove, tags)){
        return true;
      };
      return false;
    },
    update: function(){},
  },//collision

  //timer system
  timer: {
    newManager: function(){
      let clock = {
        timers: [],
        expired: [],
        update: function(){
          for(i in clock.timers){
            if(!clock.timers[i].expired){
              clock.timers[i].time--;
                if(clock.timers[i].time < 0){
                  clock.timers[i].effect();
                  clock.timers[i].expired = true;
                  clock.expired.push(clock.timers[i]);
              };
            };
          };
          function remove(element){
            return element.expired === false;
          };
          clock.timers = clock.timers.filter(remove);
          clock.expired = [];
        },
        timer: function(time, effect){
          let timer = {};
          timer.expired = false;
          timer.time = time;
          timer.effect = effect || function(){};
          clock.timers.push(timer);
          return timer;
        },
      };
      return clock;
    },
  },//timer

  //event system
  events: {
    newEventManager: function(){
      let eventManager = {
        events: [],
        expired: [],
        newEvent: function(condition, effect){
          let event = {};
          event.expired = false;
          event.condition = condition;
          event.effect = effect;
          eventManager.events.push(event);
          return event;
        },
        update: function(){
          for(i in eventManager.events){
            if(eventManager.events[i].expired === false){
              if(eventManager.events[i].condition()){
                eventManager.events[i].effect();
                eventManager.events[i].expired = true;
                eventManager.expired.push(eventManager.events[i]);
              };
            };
          };
          //expired
          function remove(element){
            return element.expired === false;
          };
          eventManager.events = eventManager.events.filter(remove);
          eventManager.expired = [];
        },
      };
      return eventManager;
    },
  },//events

  //sequence system: call a series of commands
  sequence: {
    //holds and updates one or more sequences
    newManager: function(){
      let manager = {
        sequences: [],
        expired: [],
        update: function(){
          for(i in manager.sequences){
            if(manager.sequences[i].expired === false){
              manager.sequences[i].update();
            }else{
              manager.expired.push(sequences[i]);
            };
          };
          function remove(element){
            return element.expired === false;
          };
          manager.sequences = manager.sequences.filter(remove);
          manager.expired = [];
        },
        new: function(commands){
          manager.sequences.push(engine.sequence.new(commands));
        },
      };
      return manager;
    },
    //new sequence
    new: function(commands){
      let sequence = {
        expired: false,
      };
      sequence.commands = commands;
      sequence.update = function(){
        if(sequence.commands.length < 1){
          sequence.expired = true;
        }else{
          //if(sequence.commands[0] === ?){sequence.commands[0].time--}else
          sequence.commands[0]();
          sequence.commands.shift();
        };
      };
      return sequence;
    },
    //wait: function(){},
    //!
    wait: function(num){return {time: num}},
  },//sequence

  //input system
  input: {
    newManager: function(game){
      let inputManager = {
        type: "inputManager",
        modes: [],
        currentMode: "",
        enabled: true,
        disable: function(){for(i in modes){modes[i].disable()}},
        enable: function(){for(i in modes){modes[i].enable()}},
        keyDown: function(event){
          let key = inputManager.currentMode.keys.findIndex(function(element){return element.key === event.key})
          if(key !== -1) inputManager.currentMode.keys[key].state = true;
        },
        keyUp: function(event){
          for(i in inputManager.modes){
          let key = inputManager.modes[i].keys.findIndex(function(element){return element.key === event.key})
          if(key !== -1) inputManager.modes[i].keys[key].state = false;
            if(inputManager.modes[i].pressed.includes(event.key)){
              let pressedKey = inputManager.modes[i].pressed.indexOf(event.key);
              inputManager.modes[i].pressed.splice(pressedKey, 1);
            };
          };//for(i in inputManager.modes){};
        },
        newMode: function(name){
          let newMode = {
            enabled: true,
            disable: function(){newMode.enabled = false},
            enable: function(){newMode.enabled = true},
            keys: [],
            pressed: [],
            noKeyEffect: function(){},
            newKey: function(key, effect, exclusive){
              let newKey = {
                state: false,
              };
              newKey.key = key;
              newKey.effect = effect || function(){};
              newKey.exclusive = exclusive || false;
              newMode.keys.push(newKey);
            },
            noKey: function(effect){
              newMode.noKeyEffect = effect;
            },
            noKeyTest: function(){
              let nokeys = true;
              if(newMode.keys.length > 0){
                for(i in newMode.keys){
                  if(newMode.keys[i].state){
                    nokeys = false;
                  };
                };
              };
              if(nokeys){
                newMode.noKeyEffect();
              };
            },
            btn: function(inp){
              let key = newMode.keys.findIndex(function(element){return element.key === inp});
              if(key != -1) return newMode.keys[key].state;
            },
            btnp: function(inp){
              let key = newMode.keys.findIndex(function(element){return element.key === inp});
              if(key != -1 && newMode.keys[key].state){
                if(!(newMode.pressed.includes(inp))){
                  newMode.pressed.push(inp);
                  return true;
                };
              }else return false;
            },
          };
          newMode.name = name;
          inputManager.modes.push(newMode);
          //if no currentMode has yet been specified, this one is set
          if(inputManager.currentMode === ""){
            inputManager.setMode(newMode);
            inputManager.currentMode = newMode;
          };
          return newMode;
        },
        setMode: function(mode){
          inputManager.modeToSet = mode;
        },
        update: function(){engine.input.update(inputManager)},
      };
      document.body.setAttribute("onkeydown", "inputManager.keyDown(event)");
      document.body.setAttribute("onkeyup", "inputManager.keyUp(event)");
      return inputManager;
    },

    update: function(inputManager){
      if(inputManager.currentMode.enabled){
        for(z in inputManager.currentMode.keys){
          if(inputManager.currentMode.keys[z].state){
            //!when an effect changes the mode, things can break; created inputManager.setMode to fix
            inputManager.currentMode.keys[z].effect();

            if(inputManager.currentMode.keys[z].exclusive){
              break;
            };

          };
        };
      };
      inputManager.currentMode.noKeyTest();
      inputManager.currentMode = inputManager.modeToSet;
    },
  },//input

  //ui system
  ui: {
    newManager: function(game){
      let manager = {
        game: game,
        themes: [],
        defaultTheme: {},
        setDefaultTheme: function(theme){manager.defaultTheme = theme},
        newTheme: function(settingsObject){},
        elements: [],
        textbox: {
          new: function(text, theme, mods){
            let textbox = engine.ui.textbox.new(text, theme, mods);
            textbox.manager = manager;
            manager.elements.push(textbox);
            return textbox;
          },
        },
        menu: {
          new: function(text, options, theme){
            let menu = engine.ui.menu.new(text, options, theme);
            menu.manager = manager;
            manager.elements.push(menu);
            return menu;
          },
        },
        effect: {
          new: function(type, game, ...args){
            let effect = engine.ui.effects[type](game, ...args);
            effect.manager = manager;
            manager.elements.push(effect);
            return effect;
          },
        },
        update: function(){
          for(i in manager.elements){
            manager.elements[i].update(manager.game, manager.elements[i]);
          };
        },
      };
      return manager;
    },//newManager
    textbox: {
      defaultTheme: {
        name: "default",
        x: 0, y: 0,
        width: 200, height: 200,
        bgColor: "blue", bgImage: "",
        border: true, borderColor: "white",
        font: "ariel", fontSize: "14", fontColor: "white", lines: 4,
        text: "", charLength: 30, //!SET THIS!
        vertOffset: 10, horOffset: 20,
        handleOverflow: true, overflowIcon: "", overflowIconOffset: {x: 20, y: 15}, overflowIconColor: "white",
        overflowIcon: function(game, textbox){engine.ui.textbox.overflowIcon(game, textbox.x + textbox.width - textbox.overflowIconOffset.x, textbox.y + textbox.height - textbox.overflowIconOffset.y, textbox.overflowIconColor, 1)},
        render: false,
      },
      newTheme: function(argsObject){
        let newTheme = {};
        for(i in engine.ui.textbox.defaultTheme){
          newTheme[i] = engine.ui.textbox.defaultTheme[i];
        };
        for(i in argsObject){
          newTheme[i] = argsObject[i];
        };
        return newTheme;
      },
      //new textbox
      new: function(text, theme, mods){
        let textBox = {};
        textBox.type = "textbox";
        if(theme){
          for(i in theme){
            textBox[i] = theme[i];
          };
          //textBox.theme = theme;
        }else{
          for(i in engine.ui.textbox.defaultTheme){
            textBox[i] = engine.ui.textbox.defaultTheme[i];
          };
          //textBox.theme = engine.ui.textbox.defaultTheme;
        };
        if(mods){
          for(i in mods){
            textBox[i] = mods[i];
          };
        };
        textBox.text = text;
        textBox.currentLine = 0;
        textBox.textArray = engine.ui.textbox.createLines(text, textBox.charLength);
        textBox.advance = function(inputManager, mode){engine.ui.textbox.advance(textBox, inputManager, mode)};
        textBox.close = function(){engine.ui.textbox.close(textBox)};
        textBox.open = function(optionalText){engine.ui.textbox.open(textBox, optionalText)};
        textBox.destroy = function(){engine.ui.textbox.destroy(textBox.controller, textBox);};
        textBox.update = function(){engine.ui.textbox.update(textBox.manager.game, textBox)};

        return textBox;
      },
      destroy: function(controller, textbox){
        controller.textboxes = controller.textboxes.filter(function(element){return element !== textbox});
      },
      createLines: function(text, charLength){
        let tokens = text.split(" ");
        
        //!
        //check for single token longer than line length
        //for(i in tokens){
        //  if(tokens[i].length > charLength){
            //! ???

        //  };
        //};

        let charsInLine = 0;
        let textArray = [];
        function newLine(){
          charsInLine = 0;
          currentLine++;
          charsInLine += tokens[i].length + 1;
          textArray[currentLine] = "";
        };
        let currentLine = 0;
        textArray[currentLine] = "";
        for(i in tokens){
          //check for newline; "/n"
          if(tokens[i] === "/n"){
            newLine();
          }else{
            if(charsInLine + tokens[i].length <= charLength){
              charsInLine += tokens[i].length +1;
              textArray[currentLine] += tokens[i] + " ";
            }else{
              newLine();
              textArray[currentLine] += tokens[i] + " ";
            };
          };
        };

        return textArray;
      },
      //draw textbox to gamescreen
      draw: function(game, textbox){
        //if visible?
        if(textbox.render){
          //!if bgImage === ""

          engine.render.rect(game, textbox.x, textbox.y, textbox.width, textbox.height, textbox.bgColor);
          if(textbox.border){
            engine.render.rectb(game, textbox.x, textbox.y, textbox.width, textbox.height, textbox.borderColor);
          };
          //draw text
          let currentText = [];
          for(i in textbox.textArray){
            if(i >= textbox.currentLine && i < textbox.currentLine + textbox.lines){
              currentText.push(textbox.textArray[i]);
            };
          };

          let lines = textbox.lines;
          let vertOffset = textbox.height / textbox.lines;
          let textPosition;
          //for(i in textbox.textArray){
          for(i in currentText){
            //!textbox.currentLine
            if(i < textbox.lines){
              //engine.render.text(game, textbox.textArray[i], textbox.x + textbox.horOffset, textbox.y + (i * vertOffset) + textbox.vertOffset, textbox.fontColor, textbox.fontSize, textbox.font);
              engine.render.text(game, currentText[i], textbox.x + textbox.horOffset, textbox.y + (i * vertOffset) + textbox.vertOffset, textbox.fontColor, textbox.fontSize, textbox.font);
            };
          };
          if(textbox.handleOverflow && textbox.currentLine + textbox.lines < textbox.textArray.length){
            textbox.overflowIcon(game, textbox);
          };
        };
      },
      //default overflow icon
      overflowIcon: function(game, x, y, color, scale){
        scale = scale || 1;
        engine.render.line(game, x, y, x + 10 * scale, y, color);
        engine.render.line(game, x + 10 * scale, y, x + 5 * scale, y + 7 * scale, color);
        engine.render.line(game, x + 5 * scale, y + 7 * scale, x, y, color);
      },
      open: function(textbox, optionalText, optionalFunction){
        //!this isn't working?!
        //used for things like changing the input mode
        if(optionalFunction !== undefined){optionalFunction()};

        textbox.currentLine = 0;//!is this the best place for this?
        if(optionalText){
          textbox.text = optionalText;
          textbox.textArray = engine.ui.textbox.createLines(textbox.text, textbox.charLength);
        };
        textbox.render = true;
      },
      close: function(textbox){
        textbox.render = false;
      },
      advance: function(textbox, inputManager, mode){
        if(textbox.currentLine + textbox.lines < textbox.textArray.length){
          textbox.currentLine++;
        }else{
          textbox.close();
          if(mode){
            inputManager.setMode(mode);
          }
        };
      },
      update: function(game, textbox){
        engine.ui.textbox.draw(game, textbox);
      },
    },//textbox
    menu: {
      new: function(text, options, theme){
        let newMenu = {};
        newMenu.type = "menu";
        newMenu.text = text || "";
        newMenu.options = [];
        for(i in options){
          newMenu.options.push(options[i]);
        };
        newMenu.theme = theme;
        newMenu.currentOption = 0;
        newMenu.loop = true;
        newMenu.active = false;
        //! new options (this isn't right)
        newMenu.new = function(text, effect, active){engine.ui.menu,newOption(text, effect, active)};
        newMenu.open = function(){
          newMenu.active = true;
        };
        newMenu.close = function(){
          newMenu.active = false;
        };
        newMenu.up = function(){
          newMenu.currentOption--;
          if(newMenu.currentOption < 0){
            if(newMenu.loop){
              newMenu.currentOption = newMenu.options.length - 1;
            }else{
              newMenu.currentOption = 0;
            };
          };
        };
        newMenu.down = function(){
          newMenu.currentOption++;
          if(newMenu.currentOption > newMenu.options.length - 1){
            if(newMenu.loop){
              newMenu.currentOption = 0;
            }else{
              newMenu.currentOption = newMenu.options.length - 1;
            };
          };
        };
        newMenu.select = function(){
          newMenu.options[newMenu.currentOption].effect();
        };
        newMenu.update = function(){
          if(newMenu.active){
            newMenu.draw();
          };
        };
        newMenu.draw = function(){
          engine.ui.menu.draw(newMenu, newMenu.theme);
        };
        return newMenu;
      },
      newOption: function(text, effect, active){
        console.log("newoption");
        let option = {};
        option.text = text || "";
        option.effect = effect || function(){};
        option.active = active || true;
        return option;
      },
      draw: function(menu, theme, mods){
        let text = menu.text;
        for(i in menu.options){
          text += " /n " + menu.options[i].text;
        };
        //create textbox
        let textbox = engine.ui.textbox.new(text, theme, mods);
        //draw textbox
        textbox.open();
        //draw indicator
        engine.ui.menu.drawIndicator(menu);
      },
      drawIndicator: function(menu){
        //find currentOption and calculate position of indicator

        //draw indicator

      },
      open: function(){},
      close: function(){},
      up: function(){},
      down: function(){},
      select: function(){},
      newOption: function(){},
      removeOption: function(){},
      update: function(){},
    },//menu
    effects: {
      //example: fade to black, or tint screen
      fade: function(game, color, time, direction){
        let newFade = {};
        newFade.game = game;
        newFade.active = false;
        newFade.visible = false;
        newFade.init = function(color, time, direction){
          if(color === "black"){color = "0, 0, 0"};
          if(color === "white"){color = "255, 255, 255"};
          newFade.color = color;
          newFade.time = time;
          newFade.rate = 0.01;
          newFade.opacity = 0;
          if(direction < 0){newFade.opacity = 1};
        };
        newFade.draw = function(){
          let finalColor = "rgba(" + newFade.color + "," + newFade.opacity;
          
          engine.render.rect(game, 0, 0, game.settings.width, game.settings.height, finalColor);
        };
        newFade.start = function(color, time, direction){
          newFade.init(color, time, direction);
          newFade.active = true;
          newFade.visible = true;
          newFade.startingOpacity = newFade.opacity;
        };
        newFade.update = function(){
          if(newFade.active){
            if(newFade.startingOpacity > 0){
              newFade.opacity -= newFade.rate;
              if(newFade.opacity < 0){
                newFade.active = false;
              }
            }else{
              newFade.opacity += newFade.rate;
              if(newFade.opacity >= 1){
                newFade.active = false;
              };
            };
          };
          if(newFade.visible){
            newFade.draw();
          };
        };
        return newFade;
      },//fade()
      //schedules two fades and a wait between them 
      //!consider naming flash?
      transition: function(game, color, time1, time2, time3, callback){
        //begin fade to color for time1
        //schedule timer for 
        //    callback
        //    wait for time2
        //schedule timer for fade from color for time3
      },//transition
      update: function(arrayOfEffects){
        for(i in arrayOfEffects){
          arrayOfEffects[i].update();
        };
      },
    },
    update: function(uiArray){
      for(i in uiArray){
        uiArray[i].update();
      };
    },
  },//ui

  //save system
  save: {
    new: function(){},
    update: function(){},
  },//save

  //audio
  audio: {
    newController: function(){
      let controller = {
        mute: false,
        state: "stopped", //["stopped", "playing", "paused"]
        tracks: [],
        newTrack: function(name, file){
          let newTrack = engine.DOM.create("audio");
          newTrack.name = name;
          newTrack.setAttribute("src", file);
          controller.tracks.push(newTrack);
          return newTrack;
        },
        musicCurrentlyPlaying: [],
        play: async function(track, loop){
          try {
            track.load();
            await track.play();
            controller.musicCurrentlyPlaying.push(track);
            controller.state = "playing";
          } catch(err) {engine.log("error: " + err)};
          if(loop){track.loop = true};
        },
        stop: function(){
          for(i in controller.musicCurrentlyPlaying){
            controller.pause(controller.musicCurrentlyPlaying[i]);
          };
          controller.state = "stopped";
        },
        pause: function(track){
          track.pause();
          controller.musicCurrentlyPlaying.splice(controller.musicCurrentlyPlaying.indexOf(track), 1);
          controller.state = "paused";
        },
        sfx: async function(sound){
          try {
            sound.load();
            await sound.play();
          } catch(err) {
            engine.log("error: " + err);
          };
        },
      };
      return controller;
    },
  },//audio

};//engine