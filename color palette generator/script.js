
let colorWidth = 50;
let colorHeight = 50;

let colorType = "rgb";
let paletteType = "random";
let paletteSize = 5;
let clearAfterGen = false;
let useDominantColor = false;
let dominantColor = "rgb(0,0,0)";

let paletteContainer = document.getElementById("palettecontainer");

// setting CSS variables
let root = document.querySelector(':root');

function init()
{
  setCSSValue('---palettecontainerheight', colorHeight + "px");
}
init();

function getCSSValue(val)
{
  let rs = getComputedStyle(root);
  let result = rs.getPropertyValue(val);
  return result ? result : "";
}

function setCSSValue(prop, val)
{
  root.style.setProperty(prop, val);
}

function randomInt(min, max)
{
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

function genRandomHSLA()
{
  let h = randomInt(0,360); // main color
  let s = randomInt(0,100); // saturation, 0 is grey, 100 is full color
  let l = randomInt(0,100); // lightness, 0 is black, 50 is normal, 100 is white
  //! consider weighing l to be closer to 50?
  
  let a = Math.random();
  //! for now, always use zero alpha
  a = 1;

  let result = `hsl(${h},${s}%,${l}%,${a})`;
  return result;
}

function createColorDiv(color)
{
  let div = document.createElement("div");
  div.style.backgroundColor = color;
  div.style.width = colorWidth + "px";
  div.style.height = colorHeight + "px";
  div.setAttribute('class', 'color');
  div.setAttribute('onclick', 'getColorValue(this)');
  return div;
}

function addToPalette(div)
{
  paletteContainer.appendChild(div);
}

function clearPalette()
{
  paletteContainer.replaceChildren();
}

function newColorOnPalette()
{
  let color = genRandomHSLA();
  let d = createColorDiv(color);
  addToPalette(d);
}

function setColorType(val)
{
  colorType = val.value;
}

function getColorValue(div)
{
  let result = div.style.backgroundColor;
  // check color type and convert value if necessary

  // return result
  console.log(result);
  navigator.clipboard.writeText(result);
  //! show tooltip or some temporary message to indicate value has been copied
  snackbar();
}

function setPaletteType(val)
{
  paletteType = val.value;
  console.log(paletteType);
}

function setPaletteSize(val)
{
  paletteSize = val.value;
  console.log(paletteSize);
}

function genPalette()
{
  if(clearAfterGen)
  {
    clearPalette();
  }
  switch(paletteType)
  {
    case "random":
      genRandomPalette();
      break;
    case "monochromatic":
      //
      break;
    case "complementary":
      //
      break;
    case "splitcomplementary":
      //
      break;
    case "triadic":
      //
      break;
    case "achromatic":
      //
      break;
    case "analogous":
      //
      break;
    case "tetradic":
      //
      break;
    default:
      console.error("ERROR: paletteType not found");
  }
}

function genRandomPalette()
{
  let i = 0;
  while(i<paletteSize)
  {
    newColorOnPalette();
    i++;
  }
}

//! this is messy and bad! refactor!
function checkForDominantColor()
{
  if(useDominantColor)
  {
    let selector = document.getElementById("dominantcolorselector");
    let dominantColor = selector.value;
    return dominantColor;
  }
}

// should this take in the parameter 'dominantColor' or just find it itself?
function genMonochromaticPalette()
{
  //!let color1 = checkForDominantColor();
  //

}


function snackbar() {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
} 

function toggleClearAfterGen()
{
  clearAfterGen = !clearAfterGen;
}

function toggleUseDominantColor()
{
  useDominantColor = !useDominantColor;
}

// --------------------
// TEST
