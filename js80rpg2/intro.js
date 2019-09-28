//titleScene
let titleScene = game1.scenes.new();
titleScene.setActive();
game1.scenes.setCurrent(titleScene);
let title1 = engine.assets.image(titleScene, "title/adventure1.png");
let title2 = engine.assets.image(titleScene, "title/adventure2.png");
let title3 = engine.assets.image(titleScene, "title/adventure3.png");
let title4 = engine.assets.image(titleScene, "title/adventure4.png");
let title5 = engine.assets.image(titleScene, "title/adventure5.png");
let title = engine.assets.image(titleScene, "title/adventure.png");
let titleEntity = titleScene.newEntity(0, 0);
titleEntity.add.render(titleScene, "image", title1, 0, 0, 0);
titleEntity.render.visible = false;
let titleEntity2 = titleScene.newEntity(game1.settings.width, 0);
titleEntity2.add.render(titleScene, "image", title, 0, 0, 0);

let introFade = titleScene.ui.manager.effect.new("fade", game1, "0,0,0", 100, 1);

let introAnimationTimers;
let ready = false;
function titleAnimation(){
  function moveTitle(){
    if(titleEntity2.x > 0){
      titleEntity2.x--;
    };
  };
  let t1 = titleScene.timer.manager.timer(100, function(){
    titleEntity.render.visible = true;
  });
  let t2 = titleScene.timer.manager.timer(200, function(){
    titleEntity.render.asset = title2;
  });
  let t3 = titleScene.timer.manager.timer(300, function(){
    titleEntity.render.asset = title3;
    ready = true;
  });
  let t4 = titleScene.timer.manager.timer(610, function(){
    titleEntity.render.asset = title4;
  });
  let t5 = titleScene.timer.manager.timer(700, function(){
    titleEntity.render.asset = title5;
    inputManager.setMode(startMode);
  });
  let timers = [t1, t2, t3, t4, t5];
  introAnimationTimers = timers;
};//title()

function skip(){
  for(i in introAnimationTimers){
    introAnimationTimers[i].expired = true;
  };
  titleEntity.render.asset = title5;
  ready = false;
  titleEntity2.x = 400;
  titleEntity.render.visible = true;
  inputManager.setMode(startMode);
};

titleScene.events.new("start", function(){titleAnimation()});
titleScene.events.pullTrigger("start");

function testCheck(test, ifTrue, ifFalse){
  if(test()){ifTrue()}else{ifFalse()};
  //test() ? ifTrue() : ifFalse(); //!why won't this work?
};

//replace makeEvent with
// function eventCheck(eventManager, trigger, test, ifTrue, ifFalse){
//   eventManager.events.new(trigger, function(){testCheck(test, ifTrue, ifFalse)});
// };
//eventCheck(titleScene.events.manager, "step", function(){return titleEntity2.x > 0}, function(){titleEntity2.x--}, function(){console.log("done")});

function makeEvent(){
  titleScene.events.new("step", function(){
    testCheck(function(){return titleEntity2.x > 0}, function(){titleEntity2.x--; makeEvent()}, function(){console.log("done")});
  });
};

titleScene.events.pullTrigger("step");

titleScene.frame = function(){
  if(ready){titleScene.events.pullTrigger("step")};
};
makeEvent();