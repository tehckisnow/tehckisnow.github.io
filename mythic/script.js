//TODO:
//get module stretch/shrink and resize slider to work together
//redesign Locations
//get menu items to line up (inline)
//create custom dice
  //type in roll
  //2D6
//character name generator (or alphabet?)
//import/export data
//alternate themes/stylings
//create custom modules
//toggling modules also remove them from navbar
//lastThread (press "up" to see last input)
//fix "clear threads" button
//move or resize menu?  maybe make it fixed at top?

let focus=["remote event", "remote event", "remote event", "remote event", "remote event", "remote event", "remote event", "NPC action", "NPC action", "NPC action", "NPC action", "NPC action", "NPC action", "NPC action", "NPC action", "NPC action", "NPC action", "NPC action", "NPC action", "NPC action", "NPC action", "NPC action", "NPC action", "NPC action", "NPC action", "NPC action", "NPC action", "NPC action", "New NPC", "New NPC", "New NPC", "New NPC", "New NPC", "New NPC", "New NPC", "Move toward a thread", "Move toward a thread", "Move toward a thread", "Move toward a thread", "Move toward a thread", "Move toward a thread", "Move toward a thread", "Move toward a thread", "Move toward a thread", "Move toward a thread", "Move away from a thread", "Move away from a thread", "Move away from a thread", "Move away from a thread", "Move away from a thread", "Move away from a thread", "Move away from a thread", "Close a thread", "Close a thread", "Close a thread", "PC negative", "PC negative", "PC negative", "PC negative", "PC negative", "PC negative", "PC negative", "PC negative", "PC negative", "PC negative", "PC negative", "PC negative", "PC Positive", "PC Positive", "PC Positive", "PC Positive", "PC Positive", "PC Positive", "PC Positive", "PC Positive", "Ambiguous event", "Ambiguous event", "Ambiguous event", "Ambiguous event", "Ambiguous event", "Ambiguous event", "Ambiguous event", "Ambiguous event", "NPC negative", "NPC negative", "NPC negative", "NPC negative", "NPC negative", "NPC negative", "NPC negative", "NPC negative", "NPC negative", "NPC positive", "NPC positive", "NPC positive", "NPC positive", "NPC positive", "NPC positive", "NPC positive", "NPC positive"];
let action=["attainment", "starting", "neglect", "fight", "recruit", "triumph", "violate", "oppose", "malice", "communicate", "persecute", "increase", "decrease", "abandon", "gratify", "inquire", "antagonize", "move", "waste", "truce", "release", "befriend", "judge", "desert", "dominate", "procrastinate", "praise", "separate", "take", "break", "heal", "delay", "stop", "lie", "return", "imitate", "struggle", "inform", "bestow", "postpone", "expose", "haggle", "imprison", "release", "celebrate", "develop", "travel", "block", "harm", "debase", "overindulge", "adjourn", "adversity", "kill", "disrupt", "usurp", "create", "betray", "agree", "abuse", "oppress", "inspect", "ambush", "spy", "attach", "carry", "open", "carelessness", "ruin", "extravagance", "trick", "arrive", "propose", "divide", "refuse", "mistrust", "deceive", "cruelty", "intolerance", "trust", "excitement", "activity", "assist", "care", "negligence", "passion", "work hard", "control", "attract", "failure", "pursue", "vengeance", "proceedings", "dispute", "punish", "guide", "transform", "overthrow", "oppress", "change"];
let subject=["goals", "dreams", "environment", "outside", "inside", "reality", "allies", "enemies", "evil", "good", "emotions", "opposition", "war", "peace", "the innocent", "love", "the spiritual", "the intellectual", "new ideas", "joy", "messages", "energy", "balance", "tension", "friendship", "the physical", "a project", "pleasures", "pain", "possessions", "benefits", "plans", "lies", "expectations", "legal matters", "bureaucracy", "business", "a path", "news", "exterior factors", "advice", "a plot", "competition", "prison", "illness", "food", "attention", "success", "failure", "travel", "jealousy", "dispute", "home", "investment", "suffering", "wishes", "tactics", "stalemate", "randomness", "misfortune", "death", "disruption", "power", "a burden", "intrigues", "fears", "ambush", "rumor", "wounds", "extravagance", "a representative", "adversities", "opulence", "liberty", "military", "the mundane", "trials", "masses", "vehicle", "art", "victory", "dispute", "riches", "status quo", "technology", "hope", "magic", "illusions", "portals", "danger", "weapons", "animals", "weather", "elements", "nature", "the public", "leadership", "fame", "anger", "information"];
let full = false;

function toggle(obj) {
  var el = document.getElementById(obj);
  if ( el.style.display != 'none' ) {
    el.style.display = 'none';
  }
  else {
    el.style.display = '';
  }
}

function resize(){
  let slider = document.getElementById("widthslider");
  let modules = document.getElementsByClassName("module")
  for(i in modules){
    modules[i].style.width = slider.value + "%";
  }
};

function fullscreen(){
  if(!full){
    let elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
    full = true;
    document.getElementById("fullbutton").innerHTML = "exit fullscreen";
  }else if(full){
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
      document.msExitFullscreen();
    }
    full = false;
    document.getElementById("fullbutton").innerHTML = "fullscreen";
  }
}

function roll(sides){
  result = "> [1d" + sides + "]: " + Math.floor(Math.random() * sides);
  document.getElementById("diceoutput").innerHTML = result;
};

function mroll(num){
  let prompt = document.getElementById("question").value;
  let roll = Math.floor(Math.random() * 100);
  let answer;
  if(roll<num) answer = ": Yes.";
  if(roll>=num) answer = ": No.";
  document.getElementById("oracleoutput").innerHTML = "[" + prompt + " [" + roll + "]" + answer + "]";
  document.getElementById("question").value = "";
}
function complex(){
  let prompt = document.getElementById("question").value;
  if(prompt !== "")prompt += ": ";
  let f = focus[Math.floor(Math.random() * focus.length)];
  let a = action[Math.floor(Math.random() * action.length)];
  let s = subject[Math.floor(Math.random() * subject.length)];
  document.getElementById("oracleoutput").innerHTML = "[" + prompt + f + ": " + a + " " + s + "]";
  document.getElementById("question").value = "";
};
function send(output){
  let journal = document.getElementById("journaltextarea").value;
  let newOut = document.getElementById(output).innerHTML;
  document.getElementById("journaltextarea").value = journal + String.fromCharCode(13, 10) + newOut;
};
function newCharacter(){
  let trait = ["individual", "organization", "object", "connected to this plotline", "not connected to this plotline", "assists resolving this plotline", "hinders resolving this plotline", "connected to an existing character"];
  let identity = ["Mediator", "Thief", "Scientist", "Warrior", "Entertainer", "Radical", "Gatherer", "Healer", "Socialite", "Executive", "Foreigner", "Protector", "Athlete", "Thug", "Survivor", "Assistant", "Performer", "Guard", "Gambler", "Dependent", "Representative", "Guardian", "Rogue", "Ruler", "Merchant", "Explorer", "Farmer", "Administrator", "Trader", "Hero", "Killer", "Victim", "Creator", "Villain", "Professional", "Scholar", "Artist", "Deceiver", "Driver/Pilot", "Expert", "Servant", "Engineer", "Student", "Elite", "Laborer", "Scout", "Organizer", "Investigator", "Religious", "Fixer", "Deliverer", "Criminal", "Hunter", "Wanderer", "Lackey", "Supporter", "Leader", "Subverter", "Teacher", "Helpless", "Fighter", "Soldier", "Exotic", "Outsider", "Crafter", "Law Enforcement"];
  let descriptor = ["Small", "Armed", "Naive", "Ugly", "Large", "Different", "Confdent", "Beautiful", "Quiet", "Young", "Surprising", "Foul", "Loud", "Old", "Passive", "Sweet", "Fast", "Diffcult", "Bold", "Unusual", "Slow", "Helpful", "Careless", "Common", "Exotic", "Harmful", "Cautious", "Intelligent", "Uniformed", "Disciplined", "Sneaky", "Ignorant", "Interesting", "Erratic", "Intimidating", "Educated", "Colorful", "Wild", "Powerful", "Skilled", "Informative", "Crazy", "Powerless", "Trained", "Dangerous", "Commanding", "Hurt", "Rude", "Inept", "Meek", "Rough", "Polite", "Clumsy", "Humorous", "Gentle", "Fancy", "Capable", "Frightened", "Caring", "Rough", "Intrusive", "Brave", "Principled", "Dirty", "Respectful", "Strong", "Arrogant", "Clean", "Primitive", "Weak", "Curious", "Wealthy", "Sophisticated", "Impulsive", "Supportive", "Poor", "Elegant", "Strategic", "Heroic"];
  
  let t = Math.floor(Math.random() * trait.length);
  let i = Math.floor(Math.random() * identity.length);
  let d = Math.floor(Math.random() * descriptor.length);

  let newChar = trait[t] + ": " + descriptor[d] + " " + identity[i];
  document.getElementById("characterstextarea").value += String.fromCharCode(13, 10) + "- " + newChar;
};
function locationFunction(){
  let typelst=["custom", "expected", "none", "special", "random", "complete"];
  let speciallst=["supersize", "barely there", "remove element", "add element", "this is bad", "this is good", "multi-element", "exit here", "return", "going deeper", "common ground", "random element"];
};
function newCreature(){
  let typelst=["alien", "animal", "animated", "elemental", "humanoid", "supernatural beast", "amorphous", "plant", "undead", "insect"];
  let potencylst=["minimum(-75%)", "weak(-50%)", "less(-10%)", "baseline average", "more(+10%)", "stronger(+50%)", "maximum(+100)"];
  let sizelst=["tiny", "small", "human-sized", "large", "very large", "gm decision", "gigantic"];
  let numberoflst=["1", "2", "3", "4", "5", "6 or more"];
  let abilitylst=["no special ability", "gaze attack", "resist damage", "burst of speed", "flight", "swim", "enhanced sense", "concealment", "paralysis", "natural weaponry", "climber", "poison", "charge", "distraction", "entangle", "specific vulnerability", "unusual sense", "extra defense", "telepathy", "limited use", "grievous attack", "summon", "immunity", "tunnelling", "targeted attack", "meta power", "ranged attack", "alternate form of travel", "frightening", "life force drain", "fast healing", "attribute damage", "dual classification", "defensive perimeter", "incorporeal", "animate", "multi-enironment", "tranformation"];
  let alienlst=["fishlike", "stinky", "tentacled", "roll on animal table", "extra limbs", "clothed", "nightmarish", "multi-eyed", "dripping", "roll on beast table", "levitating", "insectlike", "roll on insect table", "wormlike", "humanoid looking", "bony", "odd colored", "serpent-like", "aquatic", "gm decision"];
  let animallst=["furry", "clawed", "sharp teeth", "tail", "long haired", "ugly", "bird-like", "odd color", "growling", "hopping", "tusks", "hooves", "mammalian", "spotted", "reptilian", "aquatic", "amphibious", "winged", "horns/antlers", "gm decision"];
  let animatedlst=["humanoid", "roll on humanoid table", "made of wood", "made of stone", "inscribed with symbols", "exudes steam or smoke", "made of common item(s)", "looks like an animal", "roll on animal table", "roll on insect table", "made of unusual substance", "wields a weapon", "glowing eyes", "noisy", "made of metal", "falling apart, in ill repair", "shape changing", "levitating", "robotic", "gm decision"];
  let elementallst=["air-based", "roll on alien table", "roll on human table", "fire based", "roll on amorphous table", "cloud like", "water-based", "levitating/flying", "roll on animated table", "earth-based", "earth-based", "unusual substance", "humanoid", "flowing shape", "olid", "clawed", "water-based", "liquid", "composed of small items", "gm decision"];
  let humanoidlst=["very ugly", "roll on animal table", "roll on sup. beast table", "toothy", "primitive", "tusks", "pointed ears", "fine features", "crude clothing", "wielding a weapon", "wearing armor", "horned", "roll on alien table", "odd skin color", "very intelligent", "dumb", "reptillian", "tall", "beautiful", "gm decision"];
  let beastlst=["roll on animal table", "roll on alien table", "roll on elemental table", "roll on insect table", "sharp teeth", "glowing eyes", "combo of animals", "winged", "horned", "bird-like", "mammalian", "reptillian", "aquatic", "tall", "multiple eyes", "tentacles", "odd colored", "extra limbs", "furry", "gm decision"];
  let amorphouslst=["liquid", "roll on elemental table", "amorphous", "multiple eyes", "clingy/sticky", "tentacles", "bubbling", "cloud-like", "transparent", "floating/levitating", "inky black", "green", "purple", "brown", "blob-like", "shape shifts", "forms a simple shape", "pulsating", "wall-crawling", "gm decision"];
  let plantlst=["tree-like", "vines/tentacles", "roll on amorphous table", "mushroom-like", "covered in needles", "colorful", "aquatic", "toothy maw", "flowered", "rooted in the ground", "an fly/float", "humanoid shape", "collection of smaller plants", "covered wth leaves", "stinks", "ambulatory legs", "moving roots", "coated in bark", "fungus", "gm decision"];
  let undeadlst=["decayed", "skeletal", "insubstantial", "shadowy", "cold", "roll on humanoid table", "foul smelling", "silent", "filthy", "looks alive", "roll on animal table", "twisted human", "mummified", "glowing eyes", "howling/growling", "claws", "fangs", "ghoulish", "gaunt", "gm decision"];
  let insectlst=["insect-like", "roll on alien table", "carapace", "bug-like", "furry", "mandibles", "multiple legs", "worm-like", "humanoid", "pincers/claws", "wall-crawling", "eyes on stalks", "multiple eyes", "aquatic", "spider-like", "agile", "winged", "odd-colored", "has a stinger", "gm decision"];

  function ran(list){
    let result = list[Math.floor(Math.random() * list.length)];
    if(list === typelst){
      switch(result){
        case "alien":
          result += ": " + ran(alienlst);
          break;
        case "animal":
          result += ": " + ran(animallst);
          break;
        case "animated":
          result += ": " + ran(animatedlst);
          break;
        case "elemental":
          result += ": " + ran(elementallst);
          break;
        case "humanoid":
          result += ": " + ran(humanoidlst);
          break;
        case "supernatural beast":
          result += ": " + ran(beastlst);
          break;
        case "amorphous":
          result += ": " + ran(amorphouslst);
          break;
        case "plant":
          result += ": " + ran(plantlst);
          break;
        case "undead":
          result += ": " + ran(undeadlst);
          break;
        case "insect":
          result += ": " + ran(insectlst);
          break;
      };
    };
    return result;
  };

  let newCre = ran(numberoflst) + ", " + ran(sizelst) +  ", " + ran(potencylst) + ", " +  ran(typelst) + ".  Ability: " + ran(abilitylst);
  document.getElementById("creaturestextarea").value += String.fromCharCode(13, 10) + String.fromCharCode(13, 10) + "- " + newCre;
};

//threads

function enter(event, area){
  if(event.key == "Enter"){
      let input = document.getElementById(area + "_input").value;
      let result;
      console.log(input[0]);
      switch(input){
          case "#d20":
              result = "> [1d20]:" + Math.floor(Math.random() * 20)
              newThread(area, result);
              console.log("dtwunny");
              break;
          case input[0] == "#":
              let sides = input.splice(0, 1);
              console.log(sides);
              result = "> " + Math.floor(Math.random() * sides);
              newThread(area, result);
              console.log("random");
              break;
          default:
              newThread(area);
      }
  }
}

function newThread(area, alt){
  //create new paragraph element in threads
  let newP = document.createElement("p");
  alt ? newP.innerHTML = alt : newP.innerHTML = document.getElementById(area + "_input").value + " ";
  let element = document.getElementById(area + "s");
  element.appendChild(newP);
  //add highlight event
  newP.addEventListener("mouseover", function(){newP.style.backgroundColor = "rgba(40, 40, 40, 0.1)"});
  newP.addEventListener("mouseout", function(){newP.style.backgroundColor = null});
  //create new delete button adjacent to new paragraph element
  let button = document.createElement("button");
  button.innerHTML = "x";
  newP.appendChild(button);
  button.style.float = "right";
  button.addEventListener ("click", function() {
      button.parentNode.remove();
  });
  //reset input field
  document.getElementById(area + "_input").value = "";
  document.getElementById(area + "_input").focus();
}

function clearAllThreads(area){
  let threads = document.getElementById(area + "s");
  let children = threads.childNodes;
  for (let i in children){
      if(children[i].nodeType == 1){
          children[i].remove();
      }
      //removes about half of the children and then logs error
      //uncaught type error: children[i].remove is not a function
  }
}