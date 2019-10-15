
let game = document.createElement("canvas");
game.width = 300;
game.height = 200;
let ctx = game.getContext("2d");
document.body.appendChild(game);
game.style.display = "block";
game.style.margin = "auto";
game.ctx = ctx;

ctx.beginPath();
ctx.fillRect(0,0,game.width, game.height);

let menu = {
  newManager: function(game){
    let manager = {};
    manager.game = game;
    manager.menuThemes = [];
    manager.newMenuTheme = function(x, y, width, height, background, options){
      let theme = {x: x, y: y, width: width, height: height, background: background, options: options};
      return theme;
    };
    manager.menus = [];
    manager.currentMenu = {};
    manager.newMenu = function(theme, mods){
      let menu = {};
      menu.text = "";
      menu.currentOption = 0;
      menu.visible = false;
      menu.options = [];
      menu.setCurrent = function(){manager.currentMenu = menu};
      menu.addOption = function(text, effect){
        let option = {};
        option.text = text || "";
        option.effect = effect || function(){};
        return option;
      };
      menu.removeOption = function(optionIndex){
        menu.options.splice(optionIndex, 1);
      };
      menu.up = function(){
        menu.currentOption--;
        if(menu.currentOption < 0){
          menu.currentOption = menu.options.length - 1;
        };
      };
      menu.down = function(){
        menu.currentOption++;
        if(menu.currentOption > menu.options.length - 1){
          menu.currentOption = 0;
        };
      };
      menu.select = function(){
        menu.options[menu.currentOption].effect();
      };
      menu.close = function(){
        menu.visible = false;
      };
      menu.open = function(){
        menu.visible = true;
      };
      for(i in theme){
        menu[i] = theme[i];
      };
      for(i in mods){
        menu[i] = mods[i];
      };
      manager.menus.push(menu);
      manager.currentMenu = menu;
      return menu;
    };
    manager.drawMenu = function(game, menu){
      game.ctx.beginPath();
      game.ctx.fillStyle = menu.background;
      game.ctx.rectFill(menu.x, menu.y, menu.width, menu.height);        
      //if menu.text draw menu text
      //for(i in menu.options){menu.text += "/n" + menu.options[i]}
      //calculate positions
      //draw text at positions
      //draw indicator
    };
    manager.update = function(){
      for(i in manager.menus){
        if(manager.menus[i].visible){
          manager.drawMenu(manager.game, manager.menus[i]);
        };
      };
    };
    return manager;
  },

};

let manager = menu.newManager();
let padding = 20;
let menuTheme1 = manager.newMenuTheme(padding, padding, game.width - (padding * 2), game.height - (padding * 2), "blue", []);
let menu1 = manager.newMenu(menuTheme1, {text: "Menu"});
menu1.addOption("status", function(){console.log("status")});
menu1.addOption("items", function(){console.log("items")});

function click(){
  menu1.open();
};

document.body.addEventListener("click", click);

