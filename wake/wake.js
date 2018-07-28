
//wait for the rest of the page to load, then listen for keypress and if it is enter, send input to enter()
$(document).ready(function(){
	$(document).keypress(function(key){
		if (key.which === 13 && $('#userInput').is(':focus')) {
			enter();
		}
	})
});

var player = {
	name: "player",
	description: "lookin' good!",
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

//map is an object that holds name, description, and an array of rooms and their data
var map = {
	//name: title of game (include author optionally?)
	name: "Default Game",
	//description: opening text for the game
	description: "This is the opening text",
	room: [
		{ //Room 0
			name: "default room",
			description: "This is a default room. If you see this, something has gone wrong.",
			exits: [],
			items: []
		},
		
		{ //Room 1
			name: "first room",
			description: "This is the first room.",
			exits: [
				{
				name: "south",
				destination: 2
				}
			],
			items: [
				{
				name: "rock",
				description: "a small rock."
				}
			]
		},
		
		{ //Room 2
			name: "second room", 
			description: "This is the second room.",
			exits: [
				{
				name: "north",
				destination: 1
				},
				{
				name: "south",
				destination: 3
				}
			],
			items: []
		},
		
		{ //Room 3
			name: "third room",
			description: "This is the third room.",
			exits: [
				{
				name: "north",
				destination: 2
				}
			],
			items: [
				{
				name: "key",
				description: "a small silver key."
				},
				{
				name: "pen",
				description: "a small silver writing pen."
				}
			]
		} //Room 3
		
	] //room list
} //map

var thisRoom = map.room[player.currentRoom]; //this will change

//change output method here (console.log / innerHTML, ect.)
function out(text) {
	document.getElementById("gameText").innerHTML += "<br \>" + text;
}//out()

//return a list of names seperated by spaces from the array passed in
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
function checkItems() {
	if (thisRoom.items.length > 0) {
		return "You can see <b>" + listNames(thisRoom.items) + "</b> here. ";//space at end is intentional
	}
	return "";
}checkItems()
//return a list of names of exits in the current room if there are any
function checkExits() {
	if (thisRoom.exits.length > 0) {
		return "There are exits to the <b>" + listNames(thisRoom.exits) + "</b>.";
	}
	return "";
}//checkExits()

function returnRoomName() {
	return "<br \><b>[" + thisRoom.name + "]:</b>";
}

//takes input, converts to lowercase, passes to command interpreter, updates room info
function enter() {
	var input = $('#userInput').val().toLowerCase();
	out("&nbsp &nbsp &nbsp &nbsp" + input);
	out(command(input));
	//clear previous input
	document.getElementById("userInput").value = ""; //save this as a constant instead of searching repeatedly?
	window.scrollBy(0, 200);
}

//which array element contains an object with the given parameter(q)? return -1 if not found
function searchName(datArray, q) {
	var found = -1;
	datArray.forEach(function(element) {
		if (element.name === q) {
			found = element.destination;
		}
	});
	return found;
}

//pass a number and update the current room number
function updateCurrentRoom(newRoom) {
	player.currentRoom = newRoom;
	thisRoom = map.room[player.currentRoom];
}

function updateRoomInfo() {
	return returnRoomName() + "<br \>" + thisRoom.description + "<br \>" + checkItems() + checkExits();
}

function checkGo(exitName) {
	var potentialRoom = searchName(thisRoom.exits, exitName);
	if (!(potentialRoom === -1)) {
		updateCurrentRoom(potentialRoom);
		return "You travel " + exitName + "." + "<br \>" + updateRoomInfo();
	} else {
		return "There does not seem to be an exit there.";
	}
}

function command(input) {
	switch(input) {
		case "l":
		case "look":
			return updateRoomInfo();
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
		case "reset":
			reset();
			return updateRoomInfo();
			break;
		default:
			return "I'm not sure what you mean.";
	}
}

function checkScreen() {
	if (document.documentElement.clientWidth < screen.width) {
		document.getElementById("div").style.width = "auto";
	} else {
		document.getElementById("div").style.width = "50%";
	}
};

function start() {
	var screenWidth = screen.width;
	document.getElementById("title").innerHTML = "\"" + map.name + "\"<br \><br \>";
	out(map.description + "<br \>");
	out(updateRoomInfo());
	//document.getElementById("userInput").size = 3 / screenWidth;
	//document.getElementById("div").size = (screenWidth)/2;
}
checkScreen();
start();