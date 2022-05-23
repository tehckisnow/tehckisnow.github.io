//?Definitions:
//  These are definitions as according to Bionic Reading.
//  My eventual implementation will likely change some of these because
//  for example, it will be font agnostic (most likely)

//Fixation:
//Strong:
// Bion-ic Readi-ng i-s -a- ne-w meth-od facilitati-ng
//Low:
// Bi-onic Re-ading i-s -a- n-ew me-thod fac-ilitating

//Saccade: define the visual jumps from fixation to fixation
//Much Saccades:
// Bio-nic Read-ing i-s -a- n-ew met-thod facili-tating
//Few Saccades:
// Bio-nic Reading is -a- new method facili-tating

//Opacity: define the visibility of your fixation
//High opacity: (very dark font color used on fixation)
//Low opacity: (medium grey font color used on fixation)
//(light grey font color used on the rest of text regardless of option)

//Other settings:
//Font, Font Size, Line Height, Letter Spacing, Column Width

//--------------------------------------------------

//TODO:
//revise fixation algorithm
//implement adjustable saccades
//on page load, put cursor focus on input? (maybe)
//redesign page layout / css rearrange/cleanup/reorganize
//css toggleswitch for switching emphasis mode? (maybe)
//get bold to look right (wtf is the problem? the font? the font-weight? God?)
//slider to be able to adjust width of column would be cool 
//			(should there be multiple columns?  and adjustment for number of columns?)
//more separaters (hypens, those-weird-long-hyphens—, ) 
//			(At this time I do NOT think that puncuation marks [., ,, !, ?, ", ', etc.] 
//					need to be represented as dividers, but this should be continuously watched)
//			(research more special characters that might need to be used as separaters.)
//add init function for 'bottom-to-top' button so it's default can be adjusted
//add font selector?
//       font size slider?(or numerical text input?)(or both?)

//----
//ideas:
//-first-and-last-letter coloring option
//-color picker for color emphasis mode
//-color picker for both halves of word(emphasized and not) regardless of mode
//-consider algorithm with saccade style option that skips fixations on words under a certain length threshold
//-"opacity" would make text less readable, so instead of lowering alpha channel of text color,
//    color hex will be calculated based on an arbitrarily-selected "background" color.
//    heirarchy: first select- text highlight color-> text background color-> text parent background color-> 
//        keep going until a color is discovered.  document.body background-color is default.
//        background colors with an alpha value above a threshold of X should be- ignored?
//        background images will fubar this process up.  could do javascript pixelsampling to get a color,
//        or instead just pray.


//----
//plugin: dealing with various elements; (<p>, <h1>, <h2>, <h6>, <b> etc.)

//  The below attempt at categorization is too complex and granular.
//  Perhaps a categorical approach would be more appropriate?

//  reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element

//  (<b> in particular; should it be skipped?) (probably)
//  (should headings and titles be skipped?)
//		(things to definitely skip: <head>, alt text, table cells, captions, urls(<a>, <link>, <base>, <meta>, <style>), <address>, <abbr>, <b>, <br>, <cite>, <code>, <data>, )
//		(maybe: <title>, <article>, <aside>, <footer>, <header>, !!<nav>!!, <section>, <figcaption>, <figure>, <menu>, <dfn>, )

//		(not sure what to do with; <div>, lists(these could take various forms, such as <li>, <ol>, <ul>, ), <dd>, <dl>, <dt>, <hr>, <bdi>, <bdo>, )
//		(<pre> preformatted text: could go either way; test and research it's use)
//		(<em> emphasis: not only this must be considered, but also nested emphasis must be considered.)
//		(<i> idiomatic: historically italic. Probably best to avoid like with bold?)
//		(<span> huhboy.)

//		(things that likely will benefit from having this applied:
//				untagged text, <body>, <p>, <blockquote>, <main>,


//------
//Document converter:
//select output
//    font, fontsize, font-color(or rather, base color before methods above are applied)
//document preview (oh damn holy shit what the fuck, not in the first version, dog!)
//    (could just preview one line of text for adjusting the font?)
//Output:
//    .txt
//    other options?
//        .pdf is likely doable
//        .epub .mobi  <-- research
//    TTS incorporated?  or just leave that to external software? (probable stick to text)



const mainText = document.getElementById("mainText");
const style = document.getElementById("style");
const togOrdBtn = document.getElementById("order");
const inputElement = document.getElementById("input");
const fixationInputElement = document.getElementById("fixationinput");
const mode = document.getElementById("mode");

const colorRed = '<span style="color:red !important">';
//colorSpan + [color] + important

const boldSpan = '<span class="emfix">';
const colorSpan = '<span style="color:';
const important = '!important">';
const endSpan = "</span>";
const br = "<br>";
const bold = "<b>";
const endBold = "</b>";
//html 5 specification says to use bold as a last resort
// could alternatively use emphasized <em>, important <strong>, or marked <mark> ?

var emphasisFontWeight = 700;
var emphasisMode = 0;
var modeNames = ["Bold", "Color"];

//var emphasizers = [bold, colorRed];
//var endEmphasizers = [endBold, endSpan];
var emphasizers = [boldSpan, colorRed];
var endEmphasizers = [endSpan, endSpan];

var demoOdd = true;
var demoText = "allcay emay ishmaelyay . omesay earsyay ago—never indmay owhay onglay precisely—having ittlelay oryay onay oneymay inyay ymay ursepay , andyay othingnay articularpay otay interestyay emay onyay oreshay , iyay oughtthay iyay ouldway ailsay aboutyay ayay ittlelay andyay eesay ethay ateryway artpay ofyay ethay orldway . ityay isyay ayay ayway iyay avehay ofyay ivingdray offyay ethay eensplay , andyay egulatingray ethay irculationcay . eneverwhay iyay indfay elfmysay owinggray imgray aboutyay ethay mouth; eneverwhay ityay isyay ayay ampday , izzlydray ovembernay inyay ymay soul; eneverwhay iyay indfay elfmysay involuntarilyyay ausingpay eforebay offincay arehousesway , andyay ingingbray upyay ethay earray ofyay everyyay uneralfay iyay meet; andyay especiallyyay eneverwhay ymay oshypay etgay uchsay anyay upperyay andhay ofyay emay , atthay ityay equiresray ayay ongstray oralmay inciplepray otay eventpray emay omfray eliberatelyday eppingstay intoyay ethay eetstray , andyay ethodicallymay ockingknay people’s atshay off—then , iyay accountyay ityay ighhay imetay otay etgay otay easay asyay oonsay asyay iyay ancay . isthay isyay ymay ubstitutesay orfay istolpay andyay allbay . ithway ayay ilosophicalphay ourishflay atocay owsthray imselfhay uponyay ishay sword; iyay uietlyqay aketay otay ethay ipshay . erethay isyay othingnay urprisingsay inyay isthay . ifyay eythay utbay ewknay ityay , almostyay allyay enmay inyay eirthay egreeday , omesay imetay oryay otheryay , erishchay eryvay earlynay ethay amesay eelingsfay owardstay ethay oceanyay ithway emay .";
var demoText2 = "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to sea as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the ship. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the ocean with me.";

var fixation = 2; // range = 1-3 for short, medium or long?
var fixationMin = 1;
var fixationMax = 3;

var addToBottom = false; //bool that determines direction of text flow

//var wordSeparators = " ";
var wordSeparators = /\—|\s/;

initFixationElement();
updateEmphasisModeElement();
initEmfixStyle(emphasisFontWeight);

function initFixationElement()
{
	fixationInputElement.setAttribute("min", fixationMin);
	fixationInputElement.setAttribute("max", fixationMax);
	fixationInputElement.value = fixation;
}

function addText(newt)
{
	if(addToBottom)
	{
		addTextBottom(newt);
	}
	else
	{
		addTextTop(newt);
	}
}

function addTextBottom(newText) {
  mainText.innerHTML += newText + br;
}

function addTextTop(newText)
{
	setText(newText + br + mainText.innerHTML);
}

function setText(newText)
{
	mainText.innerHTML = newText + br;
}

function createStyle(classname, stylePropertyAndValue, stylesheet="style")
{
	var cssStyle = document.createElement('style');
	cssStyle.type = 'text/css';
	var rules = document.createTextNode("." + classname + " {" + stylePropertyAndValue + "}");
	cssStyle.appendChild(rules);
	document.getElementById(stylesheet).appendChild(cssStyle);
}

function initEmfixStyle(fontWeight)
{
	var stylename = "emfix";
	var fontWeightPrefix = "font-weight: ";
	var important = " !important";

	createStyle(stylename, fontWeightPrefix + fontWeight + important);
}
//createStyle("emfix", "font-weight: 900 !important");

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

function clearButton()
{
	setText("");
}


function tokenize(str, divider)
{
	var arr = str.split(divider);
	return arr;
}

//splits a string into an array of 2 at num
function splitWord(str, num)
{
	var arr = [str.substr(0, num), str.substr(num)];
	return arr;
}

//tages an array and a tag(string) and inserts it between the two elements and concatonates them
function addTag(arr, tag)
{
	str = arr[0] + tag + arr[1];
	return str;
}

function getFixationIndex(length)
{
	var result = length / 2;
	//! deal with global fixation modifier here
	var fixQuotient = 3 - fixation;
	result -= fixQuotient;   //! this might be dumb
	result = clamp(result, 1, length);
	return result;
}

function clamp(num, min, max)
{
	var result = Math.min(max, Math.max(min, num));
	return result;
}

function fixWord(word)
{
	var splitIndex = getFixationIndex(word.length);
	var splitArr = splitWord(word, splitIndex);
	var boldWord = addTag(splitArr, endEmphasizers[emphasisMode]);
	var result = emphasizers[emphasisMode] + boldWord;
	return result;
}

function process(string)
{
	var arr = tokenize(string, wordSeparators);
	var newArr = [];
	arr.forEach((element, index) => 
	{
		var newEl = fixWord(element);
		//!
		newEl += " ";
		//!

		newArr[index] = newEl;
	});
	var result = "";
	newArr.forEach(element => result += element);
	return result;
}

function submitButton()
{
	if(inputElement.value == ""){return;}

	var txt = inputElement.value;
	addText(process(txt));
	inputElement.value = "";
	addText(br);
}

function demoButton()
{
	demoOdd ? addText(process(demoText2)) : addText(process(demoText));
	demoOdd = !demoOdd;
	addText(br);
}

function fixationInputChange()
{
	fixation = fixationInputElement.value;
}

function setEmphasisMode(num)
{
	emphasisMode = num;
	updateEmphasisModeElement();
}

function updateEmphasisModeElement()
{
	mode.innerHTML = modeNames[emphasisMode];
}

function switchEmphasisMode()
{
	if(emphasisMode++ >= modeNames.length - 1){emphasisMode = 0;};
	updateEmphasisModeElement();
}
