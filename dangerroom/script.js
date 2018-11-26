
//load sounds
var sounds = [];
sounds[0] = new sound("assets/screenshot.wav");
sounds[1] = new sound("assets/startbell.wav");
var attacks = [];
attacks[0] = new sound("assets/jab.wav");
attacks[1] = new sound("assets/cross.wav");
attacks[2] = new sound("assets/leadhook.wav");
//to be enabled later (when timing is better)
//attacks[3] = new sound("assets/leaduppercut.wav");
//attacks[4] = new sound("assets/leadelbow.wav");
//attacks[5] = new sound("assets/rearelbow.wav");

//basic boxing attack list
//let attacks = ['jab', 'jab', 'jab', 'cross', 'cross', 'leadhook'];

//globals (move into closure?)
let running = false;
let time = 0;
let interval = 1000;
let timeRemaining = 0;
let timerCallback;
let startTime;

//DOM elements
let dom = {
    startbutton: document.getElementById("go"),
    ui: document.getElementById('ui'),
    optionsToggle: document.getElementById('optionsToggle'),
    options: document.getElementById("options"),
    minutes: document.getElementById("minutes").value,
    seconds: document.getElementById("seconds").value,
    clockRemaining: document.getElementById('clockRemaining'),
    resumeButton: document.getElementById('resume')
}

//toggles display of options menu
function toggleOptions() {
  if (dom.options.hidden){
    dom.options.removeAttribute("hidden");
    dom.optionsToggle.innerHTML = 'less options';
  }else {
    dom.options.setAttribute("hidden", true);
    dom.optionsToggle.innerHTML = 'more options';
  }
}

//calculates time based on menu input and sets callback to trigger end
function setTimer() {
  time = dom.minutes * 60;
  if(dom.seconds==30) time = time + 30;

  timerOver(function (){
    timerCallback = setTimeout(function (){running = false}, time * 1000);
  });
}
function timerOver(_callback){
  _callback();
};

//sound object to set up audio
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
}

//triggered by fight button
function start() {
  if (dom.minutes!=0 || dom.seconds!=0) {
    running = true;
    dom.ui.style.visibility = 'hidden';
    dom.resumeButton.style.visibility = 'visible';
    dom.startbutton.innerHTML = 'stop';
    dom.startbutton.setAttribute('onclick', 'stop()');
    startTime = new Date();

    setTimer();
    sounds[1].play();
    
    //wait for a sec

    loop();
  };
};

//continuously calls callAttack() at interval as long as running is active
function loop(){
  if (running){
  callAttack(function (){
    setTimeout(function (){loop()}, interval);
  });
  }else if (!running) {
    sounds[1].play();
    reset();
  };
};

//choose a random attack and play audio for it
function callAttack(_callback) {
  var y = Math.floor(Math.random() * attacks.length);
  attacks[y].play();
  showTimeRemaining();
  _callback();
}

//show time remaining
function showTimeRemaining(){
  //update timeRemaining;
  let currentSystemTime = new Date();
  let elapsedTime = currentSystemTime - startTime;
  timeRemaining = (time * 1000) - elapsedTime;
  //display timeRemaining
  dom.clockRemaining.innerHTML = timeRemaining/1000;
}

//stop timer
function stopTimer(){
  //save value of timeRemaining;
  //stop timeRemaining()
  
  //stop loop()
  running = false;
}

//when stop button is pressed
function stop(){
  reset();
  stopTimer();
  clearTimeout(timerCallback);
}

//revert go button to original state
function reset(){
  dom.startbutton.innerHTML = 'Fight!';
  dom.startbutton.setAttribute('onclick', 'start()');
  dom.ui.style.visibility = 'visible';
  dom.resumeButton.style.visibility = 'hidden';
  visible = true;
}