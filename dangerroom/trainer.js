//TODO:
//rest
//randomly choose attacks
//build combos and play sound
//track progress?

let attackStrings = ["jab", "cross", "leadhook", "leadelbow", "rearelbow", "leaduppercut"];

function newAudio(src){
  let audio = document.createElement("audio");
  audio.setAttribute("src", src);
  return audio;
};//newAudio();

function buildAudioAssets(srcStrings, assetFolder){
  let audioAssets = [];
  for(i in srcStrings){
    audioAssets.push({name: srcStrings[i], audio: newAudio(assetFolder + "/" + srcStrings[i] + ".wav")});
  };
  return audioAssets;
};

let attacks = buildAudioAssets(attackStrings, "assets");
let startBell = newAudio("assets/startbell.wav");

let timer = {
  state: "stopped",
  time: 0,
  roundLength: 0,
  rest: 0,
  rounds: 1,
  setInterval: 0,
  start: function(){
    startBell.play();
    DOM.attackOutput.style.color = "var(--main-color)";
    DOM.attackOutput.innerHTML = "";
    DOM.roundsRemaining.style.color = "var(--main-color)";
    timer.state = "running";
    DOM.time.innerHTML = timer.convertTime();
    DOM.roundsRemaining.innerHTML = timer.rounds;
    timer.setInterval = setInterval(timer.update, 1000);
  },
  stop: function(){
    timer.state = "stopped";
    clearInterval(timer.setInterval);
    timer.time = 0;
  },
  pause: function(){
    if(timer.state === "running"){
      clearInterval(timer.setInterval);
    };
  },
  newRound: function(){
    timer.rounds--;
    timer.time = timer.roundLength;
    timer.update();
  },
  complete: function(){
    if(timer.rounds > 0){
      DOM.roundsRemaining.style.color = "var(--title-color)";
      timer.newRound();
    }else{
      startBell.play();
      timer.stop();
      DOM.pauseButton.hidden = true;
      DOM.attackOutput.style.color = "var(--title-color)";
      DOM.attackOutput.innerHTML = "COMPLETE!";
    };
  },
  convertTime: function(){
    function prepend(num){
      if(num < 10){
        return "0" + num;
      }else{
        return num;
      };
    };
    let min = prepend(Math.floor(timer.time / 60));
    let sec = prepend(timer.time % 60);
    return min + ":" + sec;
  },
  update: function(){
    DOM.time.innerHTML = timer.convertTime();
    DOM.roundsRemaining.innerHTML = timer.rounds;
    timer.time--;
    if(timer.time < 0){timer.complete()};
  },
};//timer;

let DOM = {
  advancedSettings: document.getElementById("advancedsettings"),
  toggleSettings: document.getElementById("moreoptions"),
  rounds: document.getElementById("rounds"),
  rest: document.getElementById("rest"),
  seconds: document.getElementById("seconds"),
  minutes: document.getElementById("minutes"),
  fightButton: document.getElementById("fightbutton"),
  pauseButton: document.getElementById("pausebutton"),
  resumeButton: document.getElementById("resumebutton"),
  stopButton: document.getElementById("stopbutton"),
  roundsRemaining: document.getElementById("roundsremaining"),
  time: document.getElementById("time"),
  attackOutput: document.getElementById("attackoutput"),
  countdown: document.getElementById("countdown"),
  timerSettings: document.getElementById("timersettings"),
};//DOM

let optionsDisplayed = false;

function toggleOptions(){
  let button = DOM.toggleSettings;
  let options = DOM.advancedSettings;
  if(options.hidden){
    optionsDisplayed = true;
    options.hidden = false;
    button.innerHTML = "fewer options";
  }else{
    optionsDisplayed = false;
    options.hidden = true;
    button.innerHTML = "more options";
  };
};//toggleOptions();

function getTime(){
  let minutes = DOM.minutes.value;
  let seconds = DOM.seconds.value;
  let time = Math.abs(minutes * 60) + Math.abs(seconds);
  return time;
};//getTime();

function play(){
  let time = getTime();
  timer.time = time;
  timer.roundLength = time;
  timer.rounds = DOM.rounds.value - 1;
  timer.rest = DOM.rest.value;
  resume();

};//play();
function resume(){
  timer.start();
  DOM.fightButton.hidden = true;
  DOM.pauseButton.hidden = false;
  DOM.resumeButton.hidden = true;
  DOM.stopButton.hidden = false;
  DOM.timerSettings.hidden = true;
  DOM.countdown.hidden = false;
  if(optionsDisplayed){toggleOptions()};
};//resume();
function pause(){
  timer.pause();
  DOM.pauseButton.hidden = true;
  DOM.fightButton.hidden = true;
  DOM.resumeButton.hidden = false;
  DOM.stopButton.hidden = false;
};//pause();
function stop(){
  timer.stop();
  DOM.stopButton.hidden = true;
  DOM.pauseButton.hidden = true;
  DOM.resumeButton.hidden = true;
  DOM.fightButton.hidden = false;
  DOM.countdown.hidden = true;
  DOM.timerSettings.hidden = false;
};//stop();