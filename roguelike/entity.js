
let engine = {
  defaultSettings: {
    width: 50,
    height: 50,
    default: {
      item: {game: {}, x: 0, y: 0, char: '*', color: 'white', name: 'a generic item', desc: 'this is a generic item.'},
      //item: ['{}', 0, 0, '*', 'white', 'a generic item.', 'this is a generic item.'],
    },
  },//defaultSettings
  
  newCopy: function(prop){
    return JSON.parse(JSON.stringify(prop));
  },

  newGame: function(settingsObject){
    let game = {};
    game.settings = {};
    game.items = [];
    game.nextId = 0;
    let defaults = engine.newCopy(engine.defaultSettings);
    for(s in defaults){
      game.settings[s] = defaults[s];
    };
    if(settingsObject){
      let newDefaults = engine.newCopy(settingsObject);
      for(ss in newDefaults){
        game.settings[ss] = newDefaults[ss];
      };
    };

    game.newItem = function(x, y, char, color, name, desc, otherObj){
      let item = engine.newItem(game, x, y, char, color, name, desc, otherObj);
      //!
      game.items.push(item);
      return item;
    };//game.newItem()

    return game;
  },//newGame()

  newItem: function(game){
    let item = {};
    item.game = game;
    item.components = [];
    item.newComponent = function(id, ...args){
      let component = engine.components[id](game, ...args);
      item.components.push(component);
      item[component.id] = component;
    };//item.newComponent
    return item;
  },//newItem()

  components: {
    newComponent: function(...args){
      let componentDefinition = {};
      componentDefinition.id = args[0];
      componentDefinition.properties = [];
      for(v in args){
        componentDefinition.properties.push(args[v]);
        //componentDefinition[args[v]] = undefined;
      };
      componentDefinition.constructor = function(game, ...args2){
        let component = {};
        component.id = componentDefinition.id;
        for(w in componentDefinition.properties){
          component[componentDefinition.properties[w]] = args2[w];
        };
        // for(g in args2){
        //   component[componentDefinition[g]] = args2[g];
        // };
        return component;
      };
      console.log('id', componentDefinition.id);
      if(engine.components[componentDefinition.id]){
        return "ERROR: definition already defined!";
      }else{
        engine.components[componentDefinition.id] = componentDefinition.constructor;
      };
      return componentDefinition;
    },//newComponent()

    id: function(game, name, desc){
      let component = {};
      //component.game = game;
      component.id = 'id';
      component.num = game.nextId++;
      component.name = name || game.settings.default.name;
      component.desc = desc || game.settings.default.desc;
      return component;
    },
    physical: function(game, x, y, hp){
      let component = {};
      //component.game = game;
      component.id = 'physical';
      component.x = x || game.settings.default.x;
      component.y = y || game.settings.default.y;
      component.hp = hp || game.settings.default.hp;
      return component;
    },
    visible: function(game, char, color){
      let component = {};
      //component.game = game;
      component.id = 'visible';
      component.char = char || game.settings.default.char;
      component.color = color || game.settings.default.color;
      return component;
    },
    obtainable: function(game, weight, value){
      let component = {};
      //component.game = game;
      component.id = 'obtainable';
      component.weight = weight || game.settings.default.weight;
      component.value = value || game.settings.default.value;
      return component;
    },
    mobile: function(game){
      let component = {};
      //component.game = game;
      component.id = 'mobile';
      return component;
    },
  },//components

  // newComponent: function(...args){
  //   let component = {};
  //   for(a in args){
  //     //component[a] = engine.newCopy(args[a]);
  //     component[a] = args[a];
  //   };
  //   return component;
  // },//newComponent()

  newItem2: function(game, x, y, char, color, name, desc, otherObj){
    let item = {};
    if(game){
      item.game = game;
    }else{
      //!

    };
    item.x = x || game.settings.default.item.x || engine.defaultSettings.default.item.x;
    item.y = y || game.settings.default.item.y || engine.defaultSettings.default.item.y;
    item.char = char || game.settings.default.item.char || engine.defaultSettings.default.item.char;
    item.color = color || game.settings.default.item.color || engine.defaultSettings.default.item.color;
    item.name = name || game.settings.default.item.name || engine.defaultSettings.default.item.name;
    item.desc = desc || game.settings.default.item.desc || engine.defaultSettings.default.item.desc;

    if(otherObj){
      for(t in otherObj){
        item[t] = otherObj[t];
      };
    };
    return item;
  },

};//engine

// let player = '{' +
//   '"item": {"x": 0, "y": 0, "char": "", "color": "", "name": "", "description": ""},' +
//   '"entity": {"hostile": false},' +
//   '"ai": {}' +
//   '}';

// player = JSON.parse(player);
// //player = JSON.stringify(player);

// console.log(player);
let settingsObj = {default: {item: {game: {}, x: 10, y: 10, char: '$', color: 'white', name: 'a generic item', desc: 'this is a generic item.'}}};
let game1 = engine.newGame(settingsObj);

// let player = {
//   addComponent: function(type, ...args){
//     player[type] = engine.components[type](...args);
//   },
//   components: [
//     {id: "id", num: 0, name: "player", desc: "it you."},
//     {id: "physical", x: 0, y: 0, hp: 10},
//     {id: "visible", char: "@", color: "white"},
//     {id: "obtainable", weight: 1, value: 1},
//     {id: "mobile"},
//   ],
// };
// player.id = {num: 0, name: "player", desc: "it you."}
// player.physical = {};

let p1 = game1.newItem();
p1.newComponent('id', 'warrior', 'a noble warrior');
p1.newComponent('physical', 20, 300, 10);
p1.newComponent('visible', '@', 'white');
//console.log(p1.id.num);
//console.log(p1.visible.char);

console.log(' ');

let p2 = game1.newItem();
let physCompCon = engine.components.newComponent('physCompCon', 'class', 'material');
//engine.components.physCompCon = physCompCon.constructor;
//console.log(engine.components);
p2.newComponent('physCompCon', 'first', 'metal');
p2.newComponent('physical', 200, 30, 10);
p2.newComponent('visible', '#', 'white');
console.log('p2');
console.log(p2);

