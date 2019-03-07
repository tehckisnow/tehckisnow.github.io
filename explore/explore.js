//settings function call in test game is not being called
//music
//only show forward cursor if a forwardDestination exists
//move gameMode out of settings
//organize functions
//more arrow icons
  //interact
  //use exit
  //look?
//interactables
  //exits
  //closeups/images
  //switches
  //doors
  //?
//make responsive
//inventory
//updateMap (replace one or more image references in map with others)
  //also update exits?
//settings can specify UI directory

//example interactables:

//{type: "exit", destination: 4, x: 100, y: 100, width: 100, height: 100}

//--------------------------------------------------------------------------

let game;
let settings = {
  gameSize: {x: "480px", y: "300px"},
  gameMode: "start",
  startScreen: "url(0.png)",
  assetDirectory: "",
  defaultWindowTitle: "Explore",
  settings: function(settingsObject){
    for(i in settingsObject){
      settings[i] = settingsObject[i];
    }
  },
};

function load(){
  if(settingsProfile){
    settings.settings(settingsProfile);
    };
  document.body.setAttribute("onkeydown", "pressKey(event)");
  document.getElementById("loading").innerHTML = "";
  game = document.createElement("div");  
  document.body.appendChild(game);
  game.style = "margin: auto; border: 4px solid black; ";
  game.style.backgroundImage = settings.startScreen;
  game.style.width = settings.gameSize.x;
  game.style.height = settings.gameSize.y;
  game.style.backgroundSize = settings.gameSize.x + " " + settings.gameSize.y;
  game.setAttribute("id", "game");
  game.addEventListener("click", click);
  title = document.createElement("title");
  document.head.appendChild(title);
  title.text = settings.defaultWindowTitle;
};

function buildNav(){
  let nav = document.createElement("div");
  nav.setAttribute("id", "nav");
  let left = document.createElement("div");
  left.setAttribute("id", "left");
  let right = document.createElement("div");
  right.setAttribute("id", "right");
  let forward = document.createElement("div");
  forward.setAttribute("id", "forward");
  nav.appendChild(left);
  nav.appendChild(forward);
  nav.appendChild(right);
  nav.style = "display: flex; flex-direction: row; height: inherit; ";
  left.style = "flex: 0.1; height: inherit; ";
  right.style = "flex: 0.1; height: inherit; ";
  //left.style.backgroundColor = "rgba(100,0,0,0.7)";
  //right.style.backgroundColor = "rgba(100,0,0,0.7)";
  forward.style = "flex: 1; height: inherit; ";
  game.appendChild(nav);
  left.addEventListener("click", turnL);
  right.addEventListener("click", turnR);
  forward.addEventListener("click", goForward);
  left.style.cursor = "url('ui/leftarrow.png'), auto";
  right.style.cursor = "url('ui/rightarrow.png'), auto";
  //check if current direction has a forwardDestination.  if so, set cursor style
  forward.style.cursor = "url('ui/uparrow.png'), auto";
};

function pressKey(event){
  switch(settings.gameMode){
    case "start":
      start();
      break;
    case "explore":
      if(event.key === "ArrowLeft" || event.key === "a"){
        turnL();
      }else if(event.key === "ArrowRight" || event.key === "d"){
        turnR();
      }else if(event.key === "ArrowUp" || event.key === "w"){
        goForward();
      }
      break;
  }
};

function click(){
  switch(settings.gameMode){
    case "start":
      start();
      break;
    case "explore": //might not need this switch
      break;
  }
};

function start(){
  buildNav();
  settings.gameMode = "explore";
  game.removeEventListener("click", click);
  //document.body.removeAttribute("onkeydown", "pressKey(event)");
  updateView();
};

function turnL(){
    let currentRoom = map.find(function(e){return e.id === player.room});
    let directionIndex = currentRoom.directions.findIndex(function(e){return e.dir === player.facing});
    directionIndex--;
    if(directionIndex < 0){
      directionIndex = currentRoom.directions.length - 1;
    }    
    player.facing = currentRoom.directions[directionIndex].dir;
    updateView();
};
function turnR(){
  let currentRoom = map.find(function(e){return e.id === player.room});
  let directionIndex = currentRoom.directions.findIndex(function(e){return e.dir === player.facing});
  directionIndex++;
  if(directionIndex > currentRoom.directions.length - 1){
    directionIndex = 0;
  }
  player.facing = currentRoom.directions[directionIndex].dir;
  updateView();
};

function goForward(){
  //if current room has forward exit
  let room = map[player.room];//.directions.find(function(i){return i.dir === player.facing});
  let direction = room.directions.find(function(e){return e.dir === player.facing});
  if(direction.forwardDestination){
    //move to next room
    player.room = direction.forwardDestination;
    if(direction.forwardFacing){
      //set facing
      player.facing = direction.forwardFacing;
    }
  }
  updateView();
};

function updateView(){
  wipeInteractables();
  let roomIndex = map.findIndex(function(e){return e.id === player.room});
  let viewIndex = map[roomIndex].directions.findIndex(function(e){return e.dir === player.facing});
  let view = map[roomIndex].directions[viewIndex].img;
  game.style.backgroundImage = "url(" + settings.assetDirectory + view + ")";
  //handle error here?
  //display exits/interactables here
  showInteractables(view);
};


let interactionsContainer = [];

function showInteractables(view){
  let unit = "px";
  for(i in view.interactions){
    //build each interaction
    let newInteraction = document.createElement("div");
    game.appendChild(newInteraction);
    newInteraction.style = "position: absolute";
    newInteraction.style.left = view.interactions[i].x + unit;
    newInteraction.style.top = view.interactions[i].y + unit;
    newInteraction.style.width = view.interactions[i].width + unit;
    newInteraction.style.height = view.interactions[i].height + unit;
    newInteraction.style.backgroundImage = view.interactions[i].img || "";
    newInteraction.setAttribute("onclick", "view.interactions[i].effect");
    newInteraction.style.cursor = "url('ui/select.png'), auto";
    newInteraction.style.backgroundColor = "rgba(100, 0, 0, 0.7)";
    interactionsContainer.push(newInteraction);
  }
};

function wipeInteractables(){
  if(interactionsContainer.length > 0){ //might not need this
    for(i in interactionsContainer){
      game.removeChild(interactionsContainer[i]);
    }
    interactionsContainer = [];
  }
};

function changeRoom(room){
  player.room = room;
  updateView();
};