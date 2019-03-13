//ecs system
let ecs = {
  nextId: 0,
  entities: [],
  components: [],
  systems: {
    manager: {
      //build components list in ecs.components
      init: function(){
        for(i in ecs.systems){
          if(ecs.systems[i].type){
            ecs.components[ecs.systems[i].type] = [];
            ecs.systems.manager.add[ecs.systems[i].type] = ecs.systems[i].create;
          }
        }
      },
      add: {},//this holds reference to each systems' create() method (ecs.systems.manager.add.render() )
      activeSystems: [],//all systems with an active component are listed here
      update: function(){//call all active systems
        //clear active systems
        ecs.systems.manager.activeSystems = [];
        //populate list of active systems
        for(i in ecs.components){
          if(ecs.components[i].length > 0){
            ecs.systems.manager.activeSystems.push(ecs.components[i][0].type);
          }
        }
        //call all active systems
        for(i in ecs.systems.manager.activeSystems){
          let toRender = false;
          if(ecs.systems.manager.activeSystems[i] === "render"){
            toRender = true;
          }else {
            ecs.systems[ecs.systems.manager.activeSystems[i]].update();
          }
          //call render last
          if(toRender){
            ecs.systems.render.update();
          }
        }
      },
      //return component
      find: function(componentType, id){
        for(i in ecs.components){
          if(ecs.components[i].type === componentType && ecs.components[i].id === id){
            return ecs.components[i];
          }
        }
      },
    },//manager

    entities: {
      type: "entities",
      init: function(){},//set up the system
      create: function(x, y, z){
        let newEntity = {};
        newEntity.id = ecs.nextId++;
        newEntity.x = x || 0;
        newEntity.y = y || 0;
        newEntity.z = z || 0;
        newEntity.components = [],
        newEntity.addComponent = ecs.systems.manager.add;
        ecs.entities.push(newEntity);
        return newEntity;
      },
      //destroy an instance of an entity
      destroy: function(id){
        //destroy entity
        let index = ecs.entities.findIndex(function(e){return e.id === id});
        ecs.entities.splice(index, 1);
        //destroy components
        function notThis(element){ //rename this you lazy schmuck
          return element.id !== id;
        };
        for(i in ecs.components){
          ecs.components[i] = ecs.components[i].filter(notThis);
        }
      },
      //return entity
      find: function(id){
        for(i in ecs.entities){
          if(ecs.entities[i].id === id){
            return ecs.entities[i];
          }
        }
      },
      //iterate over all of this system's components
      update: function(){},
    },//entities

    render: {
      type: "render", 
      init: function(){},
      //create new render component
      create: function(id, sprite, frame, width, height, flip, rotation, xOffset, yOffset, zOffset){
        let newComponent = {};
        newComponent.type = "render";
        newComponent.id = id;
        newComponent.sprite = sprite;
        newComponent.frame = frame || 0;
        newComponent.width = width || 1;
        newComponent.height = height || 1;
        newComponent.flip = flip || "none"; //what default value?
        newComponent.rotation = rotation || 0;
        newComponent.xOffset = xOffset || 0;
        newComponent.yOffset = yOffset || 0;
        newComponent.zOffset = zOffset || 0;
        ecs.components.render.push(newComponent);
        ecs.systems.entities.find(id).components.render = ecs.systems.render.find(id);
      },
      //destroy an instance of a render component
      destroy: function(id){},
      //return render component
      find: function(id){
        for(i in ecs.components.render){
          if(ecs.components.render[i].id === id){
            return ecs.components.render[i];
          }
        }
      },
      //draw all entities with render components to screen
      update: function(){
        //order components on zOffset
        ecs.components.render.sort(function(a, b){return a.zOffset-b.zOffset});
        //render entities
        for(i in ecs.components.render){
          js80.spr(
            ecs.components.render[i].sprite, 
            ecs.systems.entities.find(ecs.components.render[i].id).x + ecs.components.render[i].xOffset, 
            ecs.systems.entities.find(ecs.components.render[i].id).y + ecs.components.render[i].yOffset, 
            ecs.components.render[i].frame, 
            ecs.components.render[i].width, 
            ecs.components.render[i].height, 
            ecs.components.render[i].flip
            //add rotation support here?
          );
        }
      },
    },//render

    animation: {
      type: "animation",
      init: function(){},
      //create a new animation component
      create: function(id, anims, defaultAnim, defaultFrameRate){
        let newComponent = {};
        newComponent.type = "animation";
        newComponent.id = id;
        newComponent.anims = anims;
        newComponent.defaultAnim = defaultAnim;
        newComponent.frameRate = defaultFrameRate;
        newComponent.currentAnim = defaultAnim;
        newComponent.currentFrame = 0;
        newComponent.timerToNextFrame = defaultFrameRate;
        newComponent.loop = true;
        newComponent.setAnimation = function(anim){ //this isn't really necessary
          //this.currentAnim = anim;
          let a = ecs.systems.entities.find(id);
          a.components.animation.currentAnim = anim;
          a.components.animation.loop = true;
        },
        //immediately switch animation 
        //this can be called right after a call to setAnimation, or instead of if the new animation is passed in
        newComponent.interrupt = function(anim){
          //find component
          let a = ecs.systems.entities.find(id);
          if(anim){a.components.animation.currentAnim = anim};
          a.components.animation.currentFrame = a.components.animation.anims[a.components.animation.currentAnim][0];
          ecs.systems.entities.find(a.id).components.render.frame = a.components.animation.currentFrame;
          a.components.animation.timerToNextFrame = -1;
        };
        newComponent.setLoop = function(anim){
          let a = ecs.systems.entities.find(id);
          if(anim){a.components.animation.currentAnim = anim;
            a.components.animation.currentFrame = 0;//a.components.animation.anims[a.components.animation.currentAnim][0];
            a.components.render.frame = a.components.animation.currentFrame;
          };
          a.components.animation.loop = true;
        };
        newComponent.setNoLoop = function(anim){
          let entity = ecs.systems.entities.find(id);
          if(anim){entity.components.animation.currentAnim = anim;
            entity.components.animation.currentFrame = 0;//entity.components.animation.anims[entity.components.animation.currentAnim][0];
            entity.components.render.frame = entity.components.animation.currentFrame;
          };
          entity.components.animation.loop = false;
        };
        ecs.components.animation.push(newComponent);
        ecs.systems.entities.find(id).components.animation = ecs.systems.animation.find(id);
      },
      //remove an animation component
      destroy: function(){},
      //return animation component
      find: function(id){
        for(i in ecs.components.animation){
          if(ecs.components.animation[i].id === id){
            return ecs.components.animation[i];
          }
        }
      },
      //main animation method
      update: function(){
        for(i in ecs.components.animation){
          let a = ecs.components.animation[i];
          a.timerToNextFrame--;
          if(a.timerToNextFrame < 0){
            a.timerToNextFrame = a.frameRate;
            a.currentFrame++;
            if(a.currentFrame > a.anims[a.currentAnim].length - 1){
              a.currentFrame = 0;
              if(a.loop){
                //do nothing
              }else {
                a.currentAnim = a.defaultAnim;
              }
            }
            //set render frame to current animation frame
            ecs.systems.entities.find(a.id).components.render.frame = a.anims[a.currentAnim][a.currentFrame];
          }
        }
      },
    },//animation

    collision: {
      type: "collision", 
      init: function(){},
      //create new collision component
      create: function(id, shape, widthOrRadius, height, xOffset, yOffset, tags){
        let newComponent = {};
        newComponent.type = "collision";
        newComponent.id = id;
        newComponent.shape = shape || "rect";
        if(shape === "circ"){
          newComponent.radius = widthOrRadius;
        }else if(shape === "rect"){
          newComponent.width = widthOrRadius;
          newComponent.height = height;
        };
        newComponent.xOffset = xOffset || 0;
        newComponent.yOffset = yOffset || 0;
        newComponent.tags = tags; //these are not yet implemented
        ecs.components.collision.push(newComponent);
        ecs.systems.entities.find(id).components.collision = ecs.systems.collision.find(id);
      },
      //destroy an instance of a collision component
      destroy: function(id){},
      //return collision component
      find: function(id){
        for(i in ecs.components.collision){
          if(ecs.components.collision[i].id === id){
            return ecs.components.collision[i];
          }
        }
      },
      //holds all current collisions
      collisionEvents: [],
      //takes id and returns an array of objects colliding with it according to collision.collisionEvents
      collisionCheck: function(id){
        let collisions = [];
        for(i in ecs.systems.collision.collisionEvents){
          if(ecs.systems.collision.collisionEvents[i].a.id === id){
            collisions.push(ecs.systems.collision.collisionEvents[i].b);
          }
        }
        return collisions;
      },
      //return true if entities a and b overlap
      check: function(a, b, xM, yM){
        if(a.id !== b.id){
          let xMove = xM || 0;
          let yMove = yM || 0; 
          if (a.x + a.components.collision.xOffset + xMove < b.x + b.components.collision.xOffset + b.components.collision.width &&
            a.x + a.components.collision.xOffset + xMove + a.components.collision.width > b.x + b.components.collision.xOffset &&
            a.y + a.components.collision.yOffset + yMove < b.y + b.components.collision.yOffset + b.components.collision.height &&
            a.y + a.components.collision.yOffset + yMove + a.components.collision.height > b.y + b.components.collision.yOffset ) {
              // collision detected
              return true;
          }
        }else return false;
      },
      //returns an array of all entities currently overlapping entity of passed id
      impendingCollisionCheck: function(id){
        let collisions = [];
        let entityA = ecs.systems.entities.find(id);
        for(i in ecs.components.collision){
          let entityB = ecs.systems.entities.find(ecs.components.collision[i].id);
            if(ecs.systems.collision.check(entityA, entityB, entityA.components.physics.xForce, entityA.components.physics.yForce)){
              collisions.push(entityB);
            }
        }
        return collisions;
      },
      //compare all entities with a collision component and fill collisionEvents with reports
      update: function(){
        //clear collisionEvents
        ecs.systems.collision.collisionEvents = [];
        for(i in ecs.components.collision){
          //compare each collision component to each other one
          let objectA = ecs.systems.entities.find(ecs.components.collision[i].id);
          for(u in ecs.components.collision){
            let objectB = ecs.systems.entities.find(ecs.components.collision[u].id);
            //do not compare an object to itself
            if(objectA !== objectB){
              //detect collisions and add them to list
              if(objectA.x + objectA.components.collision.xOffset < objectB.x + objectB.components.collision.xOffset + objectB.components.collision.width &&
                objectA.x + objectA.components.collision.xOffset + objectA.components.collision.width > objectB.x + objectB.components.collision.xOffset &&
                objectA.y + objectA.components.collision.yOffset < objectB.y + objectB.components.collision.yOffset + objectB.components.collision.height &&
                objectA.y + objectA.components.collision.yOffset + objectA.components.collision.height > objectB.y + objectB.components.collision.yOffset ){
              //replace this with collision.check()? (having both is redundant)

                  //this code is not yet used.  Am considering another solution
                  //determine side(s) and append to object
                  let horizontal = "";
                  let vertical = "";
                  if(objectA.x + (objectA.width / 2) > objectB.x + (objectB.width / 2)){
                    horizontal = "right";
                  }else{
                    horizontal = "left";
                  }
                  if(objectA.y + (objectA.y / 2) > objectB.y + (objectB.height / 2)){
                    vertical = "bottom";
                  }else{
                    vertical = "top";
                  }
                  ecs.systems.collision.collisionEvents.push({a: objectA, b: objectB, horizontal: horizontal, vertical: vertical});
                }
            }
          }
        }
        //iterate over list of collisions

      }//update
    },//collision

    physics: { //acts on entities x/y/z based on forces and (potentially)collisions
      type: "physics", 
      init: function(){},
      //create new physics component
      create: function(id, forces, mass){
        let newComponent = {};
        newComponent.type = "physics";
        newComponent.id = id;
        newComponent.forces = forces || [];
        newComponent.mass = mass || 1;
        newComponent.xForce = 0;
        newComponent.yForce = 0;
        newComponent.zForce = 0;
        ecs.components.physics.push(newComponent);
        ecs.systems.entities.find(id).components.physics = ecs.systems.physics.find(id);
      },
      destroy: function(id){},
      //return physics component
      find: function(id){
        for(i in ecs.components.physics){
          if(ecs.components.physics[i].id === id){
            return ecs.components.physics[i];
          }
        }
      },
      //array for holding all active forces
      forces: [],
      //create a new force and add to the forces list to be iterated over every frame
      newForce: function(name, effect){
        let newForce = {};
        newForce.name = name;
        newForce.effect = effect;
        ecs.systems.physics.forces.push(newForce);
      },
      update: function(){
        for(i in ecs.systems.physics.forces){
          for(e in ecs.components.physics){
            if(ecs.components.physics[e].forces.includes(ecs.systems.physics.forces[i].name)){
              ecs.systems.physics.forces[i].effect(ecs.components.physics[e].id);
            }
          }
        }
      },
    },//physics 

    input: {},//input //execute tasks/events based on input
    events: {},//events //acts on entities based on queued events/triggers
    behaviors: {},//behaviors //acts on entities based on scripted behaviors (ai)
  },
};