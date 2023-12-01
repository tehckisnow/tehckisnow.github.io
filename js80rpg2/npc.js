let npcEventTimer = engine.timer.newManager();

let npc = {
  //nextId: 0,
  new: function(scene, x, y, z, dialogueArray, asset, spriteIndex, anims, collisionWidth, collisionHeight, collisionXOffset, collisionYOffset, tags){
    let npc = scene.newEntity(x, y, z);
    npc.add.render(scene, "sprite", asset, spriteIndex);
    npc.add.animation(anims, 10, "idleDown", "idleDown");
    npc.add.collision(scene, collisionWidth, collisionHeight, collisionXOffset, collisionYOffset, tags);
    npc.collision.tags.push("physical");
    //npc.npcId = npc.nextId++;
    npc.dialogue = dialogueArray;
    npc.dialogueLine = 0;
    npc.interaction = function(){console.log("npc interaction")};
    npc.width = 16;
    npc.height = 16;
    npc.facing = "down";
    npc.state = "idle";
    //npc.interaction
    npc.behavior = {
      find: function(target){
        let x = npc.x - target.x;
        let y = npc.y - target.y;
        if(Math.abs(x) > Math.abs(y)){
          if(x < 0){
            return "Right";
          }else{
            return "Left";
          };
        }else{
          if(y < 0){
            return "Down";
          }else{
            return "Up";
          };
        };
      },
      turn: function(dir){
        npc.facing = dir;
        npc.animation.setAnim("idle" + dir); //! dir capitalization
      },
      idle: function(){
          let anim = "";
          switch(npc.facing){
            case "up":
              anim = "idleUp";
              break;
            case "left":
              anim = "idleLeft";
              break;
            case "right":
              anim = "idleRight";
              break;
            default:
              anim = "idleDown";
          };
          npc.animation.setAnim(anim);
      },
      step: function(){},
      follow: function(){},
      wander: function(){},
      speak: function(){},
      update: function(){},
    };

    return npc;
  },//new()

  npcManager: function(){
    let newNpcManager = {
    npcs: [],
    new: function(){},
    update: function(){},
    };
    //!
    //create instance's own timerManager here? (and call it in the update function)
    return newNpcManager;
  },

};//npc