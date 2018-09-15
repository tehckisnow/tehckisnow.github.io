function pressEnter(event) {
	if (event.keyCode == 13) {
		enter();
	}
}		

//instructions link
window.onload = function() {
	var ins = document.getElementById("instructions");
	ins.onclick = function() {
		out(instructions);
		return false;
	};
};

var debugMode = false;
var helpCounter = 0;
var instructions = "<br \ >This is a text-based adventure game, also known to some as <b>Interactive Fiction</b>.  \
	After reading the prompt, type your responces into the field below.  It will not understand all sentances \
	or phrases, but it works best with sentences in the form of 'verb noun', such as <b>'go east'</b> or \
	<b>'get cup'</b>.  <br \><br \>You can navigate without a verb by typing the name of the exit you wish to take, such as <b>'north'</b>, or <b>'east'</b>. \
	These cardinal directions can also use the shortcuts, <b>'n', 's', 'e',</b> and <b>'w'</b>, respectively.  \
	<ul><li><b>'look'</b> will give you additional description of an object, or a room if used by itself. <b>[look car], [look at the statue.]</b> </li> \
	<li><b>'get'</b> and <b>'drop'</b> allow you to collect or discard items. <br \><b>&nbsp [get cup], [drop the microphone]</b> </li> \
	<li><b>'list'</b> will display a list of all basic commands. </ul> <p>You can view these instructions again by typing <b>'help'</b>.";
	
//default starting values for player if none are found in gamefile:
var player = {
	name: "player",
	description: "You look as you normally do.",
	currentRoom: 1,
	inventory: []
	};

//to be implemented later;
function reset() {
	//var map = x; //reset map
	//return to first room
	 updateCurrentRoom(1);
	//refresh text
	document.getElementById("gameText").innerHTML = "<br \>" + map.description + "<br \>";
}

//this should not be a global; 
//also; consider using const for thisRoom.
var thisRoom = map.room[player.currentRoom];

//change output method here (console.log / innerHTML, ect.)
function out(text) {
	document.getElementById("gameText").innerHTML += "<br \>" + text;
	window.scrollBy(0, 200);
	document.getElementById("userInput").focus();
}//out()

//return a list of names seperated by spaces from the array passed in
//horizontal, for things like listItems() and listExits().
function listNames(array) {
	var elementsList = "";
	x = 0;
	while (x < array.length) {
		elementsList += array[x].name;
		if (!(x === array.length - 1)) {
			elementsList += " ";
		}
		x++;
	}
	return elementsList;
}//listNames()

//return a list of the names of items in the current room if there are any
function listItems() {
	if (thisRoom.items.length > 0) {
		return "You can see <b>" + listNames(thisRoom.items) + "</b> here. ";//space at end is intentional
	}
	return "";
}//listItems()

//return a list of names of exits in the current room if there are any
function listExits() {
	if (thisRoom.exits.length > 0) {
		return "There are exits to the <b>" + listNames(thisRoom.exits) + "</b>.";
	}
	return "";
}//listExits()

function returnRoomName() {
	return "<br \><b>[" + thisRoom.name + "]:</b>";
};

//takes input, converts to lowercase, passes to command interpreter, updates room info
function enter() {
	var input = document.getElementById("userInput").value.toLowerCase();
	out("&nbsp &nbsp &nbsp &nbsp> " + input);
	out(command(input));
	//clear previous input
	document.getElementById("userInput").value = ""; //save this as a constant instead of searching repeatedly?
	window.scrollBy(0, 200); //added this to out; remove from here?
};

//pass a number and update the current room number
function updateCurrentRoom(newRoom) {
	player.currentRoom = newRoom;
	thisRoom = map.room[player.currentRoom];
};

function updateRoomInfo() {
	return returnRoomName() + "<br \>" + thisRoom.briefDesc + "<br \>" + listItems() + listExits();
};

//search an iterable (array) for an object with valueOfX: propertyX and return propertyY
//if propertyY is left out, returns the object found, or -1 if not.
function query(iterable, propertyX, valueOfX, propertyY) {			 
	if (propertyY === undefined) {
		for (let x of iterable) {		
			if (x[propertyX] == valueOfX) {
				return x;
			} 
		}
		return -1;
	}
	for (let x of iterable) {		
		if (x[propertyX] == valueOfX) {
			return x[propertyY];
		} 
	}
};

function checkGo(exitName) {
	if (query(thisRoom.exits, "name", exitName, "name")) {
		var locked = query(thisRoom.exits, "name", exitName, "locked");
		if (!locked || locked === undefined) {
			//update currentRoom
			var num = query(thisRoom.exits, "name", exitName, "destination");
			updateCurrentRoom(num);
			return "You travel " + exitName + ".<br \>" + updateRoomInfo();
		} else {
			return "This door appears to be locked.";
		}
	} else {
		return "There does not seem to be an exit there.";
	}
};

//split user input into an array and save only recognized commands into array
function tokenize(originalInput) {
	var commandsList = ["help", "l", "look", "examine", "x", "n", "north", "s", "south", "e", "east", "w", "west", "inventory", "inv", "i", "g", "get", "take", "d", "drop", "test", "reset", "debug", "tp", "me", "self", "room", "unlock", "list", "all", "eat", "read"];
	//split into array
	var tokenizedInput = originalInput.split(" ");
	//loop through array and only save recognized commands to finalizedCommand[finalCommandIndex]
	var finalizedCommand = [];
	var finalCommandIndex = 0;
	
	var i = 0;
	while (i < tokenizedInput.length) {
		//check commandsList
		if (tokenizedInput[i] !== undefined) {
			var y = 0;
			while (y < commandsList.length) {
				if (tokenizedInput[i] == commandsList[y]) {
					finalizedCommand[finalCommandIndex] = tokenizedInput[i];
					finalCommandIndex++;
					break;
				}
				y++;
			}
			//check inventory
			y = 0;
			while (y < player.inventory.length) {
				if (tokenizedInput[i] == player.inventory[y].name) {
					finalizedCommand[finalCommandIndex] = tokenizedInput[i];
					finalCommandIndex++;
					break;
				}
				y++;
			}
			//check currentRoom.items
			y = 0;
			while (y < thisRoom.items.length) {
				if (tokenizedInput[i] == thisRoom.items[y].name) {
					finalizedCommand[finalCommandIndex] = tokenizedInput[i];
					finalCommandIndex++;
					break;
				}
				y++;
			}
			
			
			//accept numbers
			if (isNumeric(tokenizedInput[i])) {
				finalizedCommand[finalCommandIndex] = Number(tokenizedInput[i]);
				finalCommandIndex++;
			}
			
			i++;
		}
		//i++;
	}

//regex check if value can be a valid number	
function isNumeric(value) {
    return /^-{0,1}\d+$/.test(value);
}
	
	//remove this after debugging!!!
	if (debugMode == true) {
		out("!tokenized command: " + finalizedCommand);
	}
	return finalizedCommand;
}

//add master list of commands here
function list() {
	return "Available commands are: <br /> ... <ul> \
	<li>help : display help/instructions</li> \
	<li>list : display this message</li> \
	<li>look, l, examine, x : display description of target, room if none</li> \
	<li>north, n : travel north</li> \
	<li>south, s : travel south</li> \
	<li>east, e : travel east</li> \
	<li>west, w : travel west</li> \
	<li>inventory, inv, i : display inventory</li> \
	<li>get, g, take : add item to inventory</li> \
	<li>drop, d : remove item from inventory</li> \
	<li>unlock : unlock target</li> \
	<li>read : read message from target</li> \
	<li>eat : eat item from inventory</li> \
	<li>[targets]</li> \
	<ul> \
	<li>me : used as a target for the look command</li> \
	<li>self : same as 'me'</li> \
	<li>room : used as target for look command</li> \
	<li>all : used as target for get and drop commands</li> \
	</ul> <li>debug tools (only display in debug mode in release version!) </li><ul> \
	<li>debug : toggle debug mode</li> \
	<li>tp : teleport to target room# (only available in debug mode)</li> \
	<li>test : run test function</li> \
	<li>reset : resets game state(not yet implemented)</li> \
	</ul>";
}

function command(input) {
	var tokens = tokenize(input);
	
	//for now, this checks for main command in tokens[0]; later convert to check if contains
	switch(tokens[0]) {
		case "help":
			return instructions;
			break;
		case "list":
			return list();
			break;
		case "l":
		case "look":
		case "examine":
		case "x":
			return look(tokens[1]);
			break;
		case "n":
		case "north":
			return checkGo("north");
			break;
		case "s":
		case "south":
			return checkGo("south");
			break;
		case "e":
		case "east":
			return checkGo("east");
			break;
		case "w":
		case "west":
			return checkGo("west");
			break;
		case "inventory":
		case "inv":
		case "i":
			if (player.inventory.length > 0) {
			return vertList(player.inventory);
			break;
			} else {
				return "You do not seem to be carrying anything.";
			}
			break;
		case "g":
		case "get":
		case "take":
			return getItem(tokens[1]);
			break;
		case "d":
		case "drop":
			return dropItem(tokens[1]);
			break;
		case "unlock":
			return unlock(tokens[1]);
			break;
		case "read":
			return read(tokens[1]);
			break;
		case "eat":
			if (query(player.inventory, "name", tokens[1]).edible === true) {
				//dropItem(tokens[1]);
				destroyItem(tokens[1]);
				return "You voraciously consume the " + tokens[1] + ".";
			} else {
				return "I don't think you really want to do that.";
			}
			break;
		case "reset":
			reset();
			return updateRoomInfo();
			break;
		case "test":
			//insert test commands here;
			return;
			break;
		case "debug":
			if (debugMode == false) {
				debugMode = true;
				return "Debug mode activated.";
			} else if (debugMode == true) {
				debugMode = false;
				return "Debug mode deactivated.";
			}
			break;
		case "tp":
			if (debugMode) {
				updateCurrentRoom(Number(tokens[1]));
				return "Teleported to room " + tokens[1];
			}
			break;
		default:
			if (helpCounter < 2) {
				helpCounter++;
				return "I'm not sure what you mean.";
			} else {
				helpCounter = 0;
				return "You can get help by typing \"help\" into the prompt below.";
			}
	}
};

function unlock(target){
		if (query(thisRoom.exits, "name", target, "locked")) {
			var unlockedBy = query(thisRoom.exits, "name", target, "keyID");
			var itemID = query(player.inventory, "id", unlockedBy);
			if (itemID.id == unlockedBy) {
				query(thisRoom.exits, "name", target).locked = false;
				//check item.retain, if true:
				if (itemID.retain === true) {
					return "Unlocked.";
				}
				//when destroy() is implemented, consider adding destroyOnUse check here
				dropItem(itemID.name);
				return "Unlocked.";
			}	
			return "You don't appear to be holding the key.";
		}
		else {
			return "Unlock what?";
		}	
}

function look(target) {
	//if used alone, resend room info. (change this later to return longDesc)
	if (target === undefined || target === "room") {
		return thisRoom.description + "<br \>" + listItems() + listExits();
	} else if (target === "self" || target === "me"){
		return player.description;
	} else {
		//first check inventory
		if (query(player.inventory, "name", target, "name")) {
			return query(player.inventory, "name", target, "description");
		}
		//then check room
		else if (query(thisRoom.items, "name", target, "name")) {
			return query(thisRoom.items, "name", target, "description");
		}
	
	}
}

function read(item) {
	if (query(player.inventory, "name", item, "read") !== undefined) {
		return query(player.inventory, "name", item, "read");
	} 
	return "You can't read that.";
}

function getItem(item) {
	if (item == undefined) {
		return "Get what?";
	}
	//check for "all" target
	if (item == "all") {
		var got = "";
		var i = 0;
		while (i < thisRoom.items.length) { //<-- this is where 'get all' is failing
			//check if obtainable
			if (thisRoom.items[i].obtainable === false) {
				i++;
				out(i); //remove after debugging
				continue;
			}
			//got += thisRoom.items[i][name] + " ";
			//out("got " + i); //remove after debugging
			//getItem(thisRoom.items[i][name]);
			}
		return "Got " + got;
	}
	
	//if item is in current room
	i = 0;
	while (i < thisRoom.items.length) {
		if (thisRoom.items[i] && thisRoom.items[i].name == item) {
			//check if obtainable
			if (thisRoom.items[i].obtainable == false) {
				return "You can't pick that up.";
			}
			//add to inventory
			player.inventory[player.inventory.length] = thisRoom.items[i];
			//remove from room
			thisRoom.items.splice(i, 1); //this works, but should it be splice(items[i], 1); ???
			return "Got " + item + ".";
		} 
		i++;
	}
	return "You don't see that here";
	
};

//consider refactoring to use if(item == undefined && player.inventory[i].name == item) like getItem()
function dropItem(item) {
	if (item == undefined) {
		return "Drop what?";
	}
	//check for "all" target
	if (item == "all") {
		if (player.inventory.length < 1) {
			return "You are not carrying anything.";
		}
		while (player.inventory.length > 0) {
			dropItem(player.inventory[0].name);
		}
		return "Dropped everything.";
	}
	//check if target is in inventory
	var i = 0;
	while (i < player.inventory.length) {
		
		if (player.inventory[i].name == item) {
			//add to current room
			thisRoom.items[thisRoom.items.length] = player.inventory[i];
			//remove from inv
			player.inventory.splice(i, 1);
			return "Dropped " + item + ".";
		}
		i++;
	}
	return "You don't seem to be carrying one of those.";
	//the above command will only be triggered if the player attempts to drop something
	//that is already in the current room.  consider replacing if(item == undefined) above?
}

function destroyItem(item) {
		var i = 0;
	while (i < player.inventory.length) {
		
		if (player.inventory[i].name == item) {
			//remove from inv
			player.inventory.splice(i, 1);
			return "Dropped " + item + ".";
		}
		i++;
	}
}

//use to create a vertical list (like in inventory)
function vertList(array) {
	var result = "";
	for (x = 0; x < array.length; x++) {
		result += array[x].name + "<br \>";
	}
	return result;
};

function checkScreen() {
	if (document.documentElement.clientWidth < screen.width) {
		document.getElementById("div").style.width = "auto";
	} else {
		document.getElementById("div").style.width = "50%";
	}
};

function start() {
	var screenWidth = screen.width;
	//check for custom player data
	if (map.player !== undefined) {
		player = map.player;
	}
	//check for custom instructions
	if (map.instructions !== undefined) {
		instructions = map.instructions;
	}
	document.getElementById("title").innerHTML = "\"" + map.name + "\"<br \><br \>";
	out(map.description + "<br \>");
	out(updateRoomInfo());
	//document.getElementById("userInput").size = 3 / screenWidth;
	//document.getElementById("div").size = (screenWidth)/2;
};
checkScreen();
start();