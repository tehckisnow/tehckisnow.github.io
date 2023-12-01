

//TODO:
// dropdown for selecting from default lists?
//

var gameText = document.getElementById("mainText");
const togOrdBtn = document.getElementById("order");

var defaultList = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10";
//var defaultList = "The Fool\nThe Magician\nThe High Priestess\nThe Empress\nThe Emperor";

var majorArcana = "0 The Fool\n1 The Magician\n2 The High Priestess\n3 The Empress\n4 The Emperor\n5 The Hierophant\n6 The Lovers\n7 The Chariot\n8 Justice† or Strength‡\n9 The Hermit\n10 Wheel of Fortune\n11 Strength or Justice‡\n12 The Hanged Man\n13 Death\n14 Temperance\n15 The Devil\n16 The Tower\n17 The Star\n18 The Moon\n19 The Sun\n20 Judgement\n21 The World";

var addToBottom = true; //bool that determines direction of text flow

var listString = "";
var verticalListString = ""; // divided by <br>
var list;  //array

splitList(defaultList);

function arcanaButton()
{
	splitList(majorArcana);
}

function addText(newText) {
  gameText.innerHTML += newText + "<br>";
}

function addTextTop(newText)
{
	setText(newText + "<br>" + gameText.innerHTML);
}

function setText(newText)
{
	gameText.innerHTML = newText + "<br>";
}

function toggleOrderButton()
{
	var defaultName = "Top to bottom";
	var reverseName = "Bottom to top";
	var name = "";

	if(addToBottom)
	{
		addToBottom = false;
		name = reverseName;
	}
	else
	{
		addToBottom = true;
		name = defaultName;
	}
	togOrdBtn.textContent = name;
}

function LoadFile()
{
	console.log("File loaded");
	const [file] = document.querySelector('input[type=file]').files;
	const reader = new FileReader();

	reader.addEventListener("load", () => {
		
		listString = reader.result;

		splitList(listString);
	}, false);

	if(file) {
		reader.readAsText(file);
	}

}

//! modify this to use a return statement instead of a side effect
function splitList(listString)
{
	list = listString.split("\n");
	verticalListString = "";
	list.forEach(element => verticalListString += element + "<br>");
}

//num is length of array
function randIndex(num)
{
	return Math.floor(Math.random() * num);
}

function chooseButton()
{
	var listToUse = list;
	if(!list)
	{
		listToUse = defaultList;
		splitList(listToUse);
	}
	var newt = listToUse[randIndex(listToUse.length)];
	var newt = sayOne(newt);
	
	if(addToBottom)
	{
		addText(newt);
	}
	else
	{
		addTextTop(newt);
	}
}

function showList()
{
	setText(verticalListString);
	addText("");
	addTextTop("");
}

function clearButton()
{
	setText("");
}

function sayOne(choices){
	var arr = choices.split("|");
	//var arr = choices.split(/\||,/);
	var str = arr[Math.floor(Math.random()*arr.length)];
	return str;
}



