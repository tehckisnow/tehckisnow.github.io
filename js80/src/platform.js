settings.settings({});

//import assets
//let sprite1 = new js80.assets.sprite("assets/platform/playersprite.png", 16);
let tilesheet1 = new js80.assets.sprite("assets/platform/tilesheet.png", 16);
let mapArray = [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,1,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,1,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,1,1,1,1,1,1,1,1,1,4,4,1,1,1,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,1,1,1,1,1,1,1,1,1,4,4,1,1,1,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,1,1,1,1,1,1,1,1,1,4,4,1,1,1,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,1,1,1,1,1,1,1,1,1,4,4,1,1,1,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4];
let map1 = new js80.assets.map2d(mapArray, 32);

//input
function input(){
  if(player.readyForInput){
    if(js80.btn("ArrowLeft")){
      if(!collide("left", player)){player.xForce -= player.speed};
    };

    if(js80.btn("ArrowRight")){
      if(!collide("right", player)){player.xForce += player.speed};
    };

    if(js80.btnp("ArrowUp")){
      if(!collide("up", player)){
        //jump
        player.yForce -= player.jump;
      };
    };
  };
};

let collidableTiles = [1];
let currentMap = map1;

let objectsAffectedByVelocity = [];
function velocity(objects){
  for(i in objects){
    let object = objects[i]
    //calculate acceleration rate
    object.xAcceleration += object.xForce / object.mass;
    object.yAcceleration += object.yForce / object.mass;

    let maxVelocity = 1;
    object.xVelocity += object.xAcceleration;
    object.yVelocity += object.yAcceleration;

    let xVelocity = objects[i].xVelocity;
    let yVelocity = objects[i].yVelocity;
    
    //cap velocity at maxVelocity
    if(xVelocity > 0 && xVelocity > maxVelocity){xVelocity = maxVelocity}else if(xVelocity < 0 && xVelocity < -maxVelocity){xVelocity = -maxVelocity};
    if(yVelocity > 0 && yVelocity > maxVelocity){yVelocity = maxVelocity}else if(yVelocity < 0 && yVelocity < -maxVelocity){yVelocity = -maxVelocity};

    //apply velocity
      //collision detection
        //horizontal
    if(object.xVelocity > 0){
      if(!collide("right", object)){
        object.x += xVelocity;
      };
    }else{
      if(!collide("left", object)){
        object.x += xVelocity;
      };
    };
        //vertical
    if(object.yVelocity > 0){
      if(!collide("down", object)){
        object.y += yVelocity;
      };
    }else{
      if(!collide("up", object)){
        object.y += yVelocity;
      };
    };

    //diminish acceleration
      //horizontal
    if(object.xAcceleration > 0){
      object.xAcceleration -= 1;//object.xAcceleration;
      if(object.xAcceleration < 0){object.xAcceleration = 0};
    }else{
      object.xAcceleration += 1;//object.xAcceleration;
      if(object.xAcceleration > 0){object.xAcceleration = 0};
    };
      //vertical
    if(object.yAcceleration > 0){
      object.yAcceleration -= 1;//object.yAcceleration;
      if(object.yAcceleration < 0){object.yAcceleration = 0};
    }else{
      object.yAcceleration += 1;//object.yAcceleration;
      if(object.yAcceleration > 0){object.yAcceleration = 0};
    };

    //diminish velocity
      //horizontal
    // if(object.xVelocity > 0){
    //   object.xVelocity -= object.xAcceleration;
    //   if(object.xVelocity < 0){object.xVelocity = 0};
    // }else{
    //   object.xVelocity += object.xAcceleration;
    //   if(object.xVelocity > 0){object.xVelocity = 0};
    // };
    //   //vertical
    // if(object.yVelocity > 0){
    //   object.yVelocity -= object.yAcceleration;
    //   if(object.yVelocity < 0){object.yVelocity = 0};
    // }else{
    //   object.yVelocity += object.yAcceleration;
    //   if(object.yVelocity > 0){object.yVelocity = 0};
    // };

    object.xVelocity = 0;
    object.yVelocity = 0;
  };
};

let objectsAffectedByGravity = [];
function gravity(objects){
  let gravity = 2;
  for(i in objects){
    let thisObject = objects[i]
    thisObject.yVelocity += gravity;
  }
};

function collide(dir, item){
  switch(dir){
    case "left":
      if(collidableTiles.includes(js80.mget(currentMap, item.x - 1, item.y + item.height - 2))){
        return true;
      };
      break;
    case "right":
      if(collidableTiles.includes(js80.mget(currentMap, item.x + item.width, item.y + item.height - 2))){
        return true;
      };
      break;
    case "up":
      if(false){
        return true;
      };
      break;
    case "down":
      if(
        collidableTiles.includes(js80.mget(currentMap, item.x + (item.width / 3), item.y + item.height)) ||
        collidableTiles.includes(js80.mget(currentMap, item.x + (item.width / 3) * 2, item.y + item.height))
      ){
        return true;
      };
      break;
  };
};

//game objects
//  map
//  characters
//    player
  let player = {
    x: 100,
    y: 50,
    xVelocity: 0,
    yVelocity: 0,
    xAcceleration: 0,
    yAcceleration: 0,
    xForce: 0,
    yForce: 0,
    mass: 0.5,
    width: 16,
    height: 32,
    state: "idle",
    states: ["idle", "walking", "jumping"],
    readyForInput: true,
    onGround: false,
    speed: 10,
    jump: 20,
  };
  objectsAffectedByGravity.push(player);
  objectsAffectedByVelocity.push(player);

//init
function init(){
  engine.draw.imageSmoothingEnabled = false;
  js80.setTitle("Platform");
};

//main loop
function frame(){
  //update
  js80.timer.update();
  gravity(objectsAffectedByGravity);
  velocity(objectsAffectedByVelocity);
  input();

  //draw
  js80.cls("black");
  //  bg
  js80.map(map1, tilesheet1, 16);
  //  characters
  //  player
  js80.rect(player.x, player.y, player.width, player.height, "rgba(20,0,0,1)");
  //  UI

};