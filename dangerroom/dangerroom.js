document.body.setAttribute("onkeypress", "trainer.keyboardStart()");

let trainer = {
  state: "default",
  rounds: 1,
  roundsCompleted: 0,
  rest: 0,
  time: 0,
  timeIncrement: 100, //100ms
  interval: {},
  restInterval: {},
  attackName: "",
  timeBetweenAttacks: 400, //200ms
  timeBetweenCombos: 2000, //1000ms?
  maxNumberInCombo: 4,
  minNumberInCombo: 1,
  currentCombo: 0,
  readyForAttack: true,
  readyForCombo: true,
  attacks: [0,0,0,0,1,1,1,2,2,3,4,5], //this tweaks attack frequency
  attackSounds: [],
  attackNames: [],
  sfx: [],
  resting: "ready",
  restTimer: 0,
  mobile: false,

  toggleMobile: function(){
    if(!trainer.mobile){
      trainer.mobile = true;
      document.getElementById("maindiv").style.width = "auto";
      document.body.style.fontSize = "5vh";
      document.getElementById("pause").style.fontSize = "5vh";
      document.getElementById("resume").style.fontSize = "5vh";
      document.getElementById("stop").style.fontSize = "5vh";
      document.getElementById("go").style.fontSize = "20vh";
    }else{
      trainer.mobile = false;
      document.getElementById("maindiv").style.width = "50%";
      document.body.style.fontSize = "2vh";
      document.getElementById("pause").style.fontSize = "2vh";
      document.getElementById("resume").style.fontSize = "2vh";
      document.getElementById("stop").style.fontSize = "2vh";
      document.getElementById("go").style.fontSize = "2vh";
    }
  },

  populateAttacks: function(){
    //sfx
    trainer.sfx[1] = new trainer.sound("assets/startbell.wav");
    //attack sounds
    trainer.attackSounds[0] = new trainer.sound("assets/jab.wav");
    trainer.attackSounds[1] = new trainer.sound("assets/cross.wav");
    trainer.attackSounds[2] = new trainer.sound("assets/leadhook.wav");
    trainer.attackSounds[3] = new trainer.sound("assets/leadelbow.wav");
    trainer.attackSounds[4] = new trainer.sound("assets/rearelbow.wav");
    trainer.attackSounds[5] = new trainer.sound("assets/leaduppercut.wav");
    //attack names (parallel array to attack sounds)
    trainer.attackNames[0] = "jab";
    trainer.attackNames[1] = "cross";
    trainer.attackNames[2] = "lead hook";
    trainer.attackNames[3] = "lead elbow";
    trainer.attackNames[4] = "rear elbow";
    trainer.attackNames[5] = "lead uppercut";},

  getRandomInt: function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  combo: function(){
    
    if(trainer.currentCombo < 0){
      if(trainer.readyForCombo){
        trainer.currentCombo = trainer.getRandomInt(trainer.minNumberInCombo, trainer.maxNumberInCombo);
        //trainer.currentCombo = Math.round(Math.random() * trainer.maxNumberInCombo) + 1;
        console.log("attacks in this combo: " + trainer.currentCombo);
        trainer.readyForCombo = false;
        function ready(){trainer.readyForCombo = true;};
        setTimeout(function(){ready()}, trainer.timeBetweenCombos);
      }
    }else{
        //call attack
        trainer.callAttack();
    }
  },

  callAttack: function(){
    if(trainer.readyForAttack){
      trainer.currentCombo--;
      trainer.readyForAttack = false;
      //choose random attack
      let num = Math.floor(Math.random() * trainer.attacks.length);
      let chosenAttack = trainer.attacks[num];
      //play sound
      trainer.attackSounds[chosenAttack].play();
      trainer.dom.attackName.innerHTML = trainer.attackNames[chosenAttack];
      console.log("attack " + chosenAttack);
      setTimeout(function(){trainer.readyForAttack = true}, trainer.timeBetweenAttacks);
    }
  },

  sound: function(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
  },

  dom: {
    //dom elements here,
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
    rounds: document.getElementById("rounds"),
    displayRounds: document.getElementById("displayrounds"),
    rest: document.getElementById("rest"),
    settings: document.getElementById("settings"),
    optionsToggle: document.getElementById("optionstoggle"),
    options: document.getElementById("options"),
    difficulty: document.getElementById("difficulty"),
    timer: document.getElementById("timer"),
    timeRemaining: document.getElementById("timeremaining"),
    attackName: document.getElementById("attackname"),
    controls: document.getElementById("controls"),
    go: document.getElementById("go"),
    pause: document.getElementById("pause"),
    resume: document.getElementById("resume"),
    stop: document.getElementById("stop"),
    //dom methods
    toggleOptions: function(){
      if(trainer.state === "default"){
        if (trainer.dom.options.hidden){
          trainer.dom.options.removeAttribute("hidden");
          trainer.dom.optionsToggle.innerHTML = 'less options';
        }else {
          trainer.dom.options.setAttribute("hidden", true);
          trainer.dom.optionsToggle.innerHTML = 'more options';
        }
      }
    }
  },

  keyboardStart: function(){
    if(trainer.state === "default"){
      trainer.setTimer();
    }else if(trainer.state === "active"){
      trainer.pause();
    }else if(trainer.state === "paused"){
      trainer.resume();
    }
  },

  //controls
  setTimer: function(){
    //get time data from settings and set time
    trainer.state = "active";
    trainer.rounds = trainer.dom.rounds.value;
    trainer.dom.displayRounds.innerHTML = "Rounds remaining: " + (trainer.rounds - trainer.roundsCompleted);
    trainer.rest = trainer.dom.rest.value;
    let minutes = trainer.dom.minutes.value;
    let seconds = trainer.dom.seconds.value;
    trainer.time = ((minutes * 60) + (seconds * 1)) * 1000;
    trainer.interval = setInterval(function(){trainer.loop()}, trainer.timeIncrement);
    //play bell sound
    trainer.sfx[1].play();
    trainer.dom.timeRemaining.style.color = "lightblue";
    if(trainer.rounds - trainer.roundsCompleted === 1){
      trainer.dom.displayRounds.style.color = "red";
    }else{
      trainer.dom.displayRounds.style.color = "lightblue";
  }
  },

  pause: function(){
    trainer.state = "paused";
  },

  stop: function(){
    trainer.state = "default";
    trainer.roundsCompleted = 0;
  },

  resume: function(){
    trainer.state = "active";
  },

  loop: function(){
    if(trainer.state === "default"){
      clearInterval(trainer.interval);
      //show settings
      trainer.dom.settings.removeAttribute("hidden");
      //hide timer
      trainer.dom.timer.setAttribute("hidden", true);
    }else if(trainer.state === "active"){
      //hide settings
      trainer.dom.settings.setAttribute("hidden", true);
      //show timer
      trainer.dom.timer.removeAttribute("hidden");
      //show pause button
      trainer.dom.pause.removeAttribute("hidden");
      //hide resume button
      trainer.dom.resume.setAttribute("hidden", true);

      //if timer has not yet run out
      if(trainer.time > 0){
        //decrement time
        trainer.time -= trainer.timeIncrement;
        //update timer element
        let displayMinutes = "00";
        if(trainer.time > 59999){
          displayMinutes = Math.floor(trainer.time / 60000);
          if(displayMinutes < 10){displayMinutes = "0" + displayMinutes};
        }
        let displaySeconds = trainer.time - (displayMinutes * 60000);
        if(displaySeconds < 10000){
          displaySeconds = "0" + (Math.floor(displaySeconds / 1000));
          trainer.dom.timeRemaining.style.color = "red";
        }else{displaySeconds = Math.floor(displaySeconds / 1000)};
        //if(displaySeconds < 10000){trainer.dom.timeRemaining.style.color = "red";};
        trainer.dom.timeRemaining.innerHTML = displayMinutes + ":" + displaySeconds;
        //check if a sound should be played
        trainer.combo();

      }else{
        //if timer has run out
        if(trainer.rounds - trainer.roundsCompleted > 1){
          //trainer.rounds--;
          trainer.roundsCompleted++;
          trainer.dom.displayRounds.innerHTML = "Rounds remaining: " + (trainer.rounds - trainer.roundsCompleted);
          trainer.state = "rest";
        }else{
          //trainer.rounds--;
          trainer.dom.timeRemaining.innerHTML = "00:00";
          trainer.dom.displayRounds.innerHTML = "Rounds remaining: 0";
          trainer.dom.displayRounds.style.color = "red";
          //play bell sound
          trainer.sfx[1].play();
          //hide pause
          trainer.dom.pause.setAttribute("hidden", true);
          trainer.state = "finished";
        }
      }
    }else if(trainer.state === "paused"){
      //hide pause button
      trainer.dom.pause.setAttribute("hidden", true);
      //show resume button
      trainer.dom.resume.removeAttribute("hidden");
    }else if(trainer.state === "rest"){

      if(trainer.resting === "ready"){
        trainer.resting = "resting";
        trainer.restTimer = trainer.rest * 1000;
        trainer.sfx[1].play();
        //setTimeout(function(){trainer.state = "active"}, trainer.rest * 1000);
        trainer.restInterval = setInterval(function(){trainer.restTimer -= trainer.timeIncrement}, trainer.timeIncrement);
      }else if(trainer.resting === "resting"){
        ////decrement resting timer
        //set timer font color
        trainer.dom.timeRemaining.style.color = "green";
        //set resting timer
        let pre = "00:";
        if(trainer.restTimer / 1000 < 10){pre = "00:0"};
        trainer.dom.timeRemaining.innerHTML = pre + Math.floor(trainer.restTimer / 1000);
        if(trainer.restTimer < 0){trainer.resting = "done"};
      }else if(trainer.resting === "done"){
        trainer.resting = "ready";
        trainer.state = "active";
        clearInterval(trainer.restInterval);
        clearInterval(trainer.interval);
        //restore font color
        //trainer.dom.timeRemaining.style.color = "lightblue";
        trainer.setTimer();
      }
    }
  },

};
trainer.populateAttacks();

