//TODO
//// implement backgroundColor
//// implement settings (mostly done)
// fix elipse
// refactor code; 
//    see "settingsObj" comment below 
// tweak default settings for better results
// add support for random palettes (almost finished)
//// improve UI (settings looks bad and should be reorganized/straightened)
// consider implementing gradients (especially subtle radial gradients) and shadows
// chance of tone fuzzing, hue fuzzing
//// textbox to replace selector
//// bug: sometimes single gen generates multiple shapes (I think this has to do with lines)

// -------------------------------------------------------------

// this is an example format to use for the settings object
// let settingsObj = 
// {
//   list:
//   [
//     {
//       id: "backgroundColorSetting",
//       label: "background color: ",
//       value: "black"
//     },
//     {}
//   ],
//   search: function(){},
//   build: function(){},
//   setDefaultSettingsHTML: function(){},
//   applySettings: function(){}
// };
// iterate through list to search for setting
//      (I would rather have a direct reference to each property, but I am not sure how to design this)
// dynamically build html table from settings list instead of hardcoded html
// assign default values for html textareas
// apply settings from html textareas

let auto = false;
let useRandomPalette = false;

let settingsObj =
{
  backgroundColorSetting: "black",
  canvasWidthSetting: 400,
  canvasHeightSetting: 600,

  autoSpeedSetting: 1000,

  minRectWidthSetting: 10,
  minRectHeightSetting: 10,
  maxRectWidthSetting: 100,
  maxRectHeightSetting: 100,

  chanceOfCircleSetting: 30,
  minCircleRadiusSetting: 10,
  maxCircleRadiusSetting: 100,
  chanceOfElipseSetting: 30,
  maxCircleElipseSetting: 100,

  chanceOfLineSetting: 30,
  minLineWidthSetting: 2,
  maxLineWidthSetting: 10,

  rotateSetting: 30,
  maxRotationSetting: 45
}

const settingsIds =
  [
    "backgroundColorSetting",
    "canvasWidthSetting",
    "canvasHeightSetting",
    "autoSpeedSetting",
    "rotateSetting",
    "maxRotationSetting",
    "minRectWidthSetting",
    "minRectHeightSetting",
    "maxRectWidthSetting",
    "maxRectHeightSetting",
    "chanceOfCircleSetting",
    "minCircleRadiusSetting",
    "maxCircleRadiusSetting",
    "chanceOfElipseSetting",
    "maxCircleElipseSetting",
    "chanceOfLineSetting",
    "minLineWidthSetting",
    "maxLineWidthSetting"
  ];

// -------------------------------------------

// init
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function setCanvasSize()
{
  canvas.width = settingsObj.canvasHeightSetting;
  canvas.height = settingsObj.canvasWidthSetting;
}
setCanvasSize();

function fillPaletteSelector()
{
  const paletteSelection = document.getElementById("paletteselection");
  let i=0;
  palettes.forEach((palette) => {
    let opt = document.createElement("option");
    opt.value = i++;
    opt.innerHTML = palette.id;
    paletteSelection.appendChild(opt);
  });
}
fillPaletteSelector();

function setPaletteFromSelector()
{
  console.log("setting palette");
  const paletteSelection = document.getElementById("paletteselection");
  const i = paletteSelection.value;
  colors = palettes[i].data;
}
setPaletteFromSelector(); // there should be a better way of setting default palette?

function randInc(min, max)
{
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  const result = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
  //console.log("randInc: " + result);
  return result;
}

function percentTest(percent)
{
  const result = randInc(1, 100);
  if(result < percent)
  {
    return true;
  }
  else return false;
}

function selectRandomElement(arr)
{
  const num = randInc(0, arr.length - 1);
  return arr[num];
}

function generate()
{
  console.log("generating");
  const num = getNum();
  let i = 0;
  while(i < num)
  {
    // if line
    if(percentTest(settingsObj.chanceOfLineSetting))
    {
      const line = genLine();
      drawLine(line.color, line.x, line.y, line.x2, line.y2, line.width);
    }
    else
    // if circle
    if(percentTest(settingsObj.chanceOfCircleSetting))
    {
      const circ = genCirc();
      if(circ.rotate > 0);
      {
        ctx.rotate((circ.rotate * Math.PI) / 180);
      }
      drawCirc(circ.color, circ.x, circ.y, circ.r);
    }
    // if rect
    else
    {
     const rect = genRect();
     if(rect.rotate > 0)
     {
       ctx.rotate((rect.rotate * Math.PI) / 180);
     }
     drawRect(rect.color, rect.x, rect.y, rect.w, rect.h);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    i++;
  }
}

// get number of elements to gen from DOM dropdown
function getNum()
{
  const num = document.getElementById("numGen");
  return num.value;
}

function genRect()
{
  const x = randInc(0, settingsObj.canvasHeightSetting);
  const y = randInc(0, settingsObj.canvasWidthSetting);
  const w = randInc(settingsObj.minRectWidthSetting, settingsObj.maxRectWidthSetting);
  const h = randInc(settingsObj.minRectHeightSetting, settingsObj.maxRectHeightSetting);
  const color = selectRandomElement(colors);
  let rotate = 0;
  if(percentTest(settingsObj.rotateSetting))
  {
    rotate = randInc(1, settingsObj.maxRotationSetting);
  }
  return {
    color: color,
    x: x,
    y: y,
    w: w, 
    h: h,
    rotate: rotate
  }
}

function drawRect(color, x, y, w, h)
{
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function genCirc()
{
  const x = randInc(0, settingsObj.canvasHeightSetting);
  const y = randInc(0, settingsObj.canvasWidthSetting);
  // r is radius
  const r = randInc(settingsObj.minCircleRadiusSetting, settingsObj.maxCircleRadiusSetting);
  const color = selectRandomElement(colors);
  let elipse = 0;
  if(percentTest(settingsObj.chanceOfElipseSetting))
  {
    elipse = settingsObj.maxCircElipseSetting;
  }
  let rotate = 0;
  if(percentTest(settingsObj.rotateSetting))
  {
    rotate = randInc(1, settingsObj.maxRotationSetting);
  }
  return {
    color: color,
    x: x,
    y: y,
    r: r,
    rotate: rotate
  }
}

function drawCirc(color, x, y, r, elipse)
{
  ctx.save(); // save state in case of elipse
  ctx.beginPath();
  ctx.fillStyle = color;
  if(elipse > 0)
  {
    //ctx.translate(x, y);
    ctx.scale(1, elipse);
  }
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  if(elipse > 0) ctx.restore(); // restore state
  //ctx.stroke();
  ctx.fill();
}

function genLine()
{
  const x = randInc(0, settingsObj.canvasHeightSetting);
  const y = randInc(0, settingsObj.canvasWidthSetting);
  const x2 = randInc(0, settingsObj.canvasHeightSetting);
  const y2 = randInc(0, settingsObj.canvasWidthSetting);
  const width = randInc(settingsObj.minLineWidthSetting, settingsObj.maxLineWidthSetting);
  const color = selectRandomElement(colors);
  return {
    color: color,
    x: x,
    y: y,
    x2: x2,
    y2: y2,
    width: width
  }

}

function drawLine(color, x, y, x2, y2, width)
{
  const origStrokeStyle = ctx.strokeStyle;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // reset stroke style
  ctx.strokeStyle = origStrokeStyle;
}

function clearCanvas()
{
  console.log("clearing");
  //ctx.clearRect(0, 0, settingsObj.canvasHeightSetting, settingsObj.canvasWidthSetting);

  ctx.fillStyle = settingsObj.backgroundColorSetting;
  //ctx.fillRect(0,0,settingsObj.canvasWidthSetting, settingsObj.canvasHeightSetting);
  ctx.fillRect(0,0, settingsObj.canvasHeightSetting, settingsObj.canvasWidthSetting);
}
clearCanvas();


// excerpt from site that draws a box that looks like a palette
// adapt to create palettes, then remove
function drawB() {
  const ctx = document.getElementById("canvas").getContext("2d");
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      ctx.fillStyle = `rgb(${Math.floor(255 - 42.5 * i)} ${Math.floor(
        255 - 42.5 * j,
      )} 0)`;
      ctx.fillRect(j * 25, i * 25, 25, 25);
    }
  }
}

function genRandomColor()
{
  const num1 = randInc(0, 255);
  const num2 = randInc(0, 255);
  const num3 = randInc(0, 255);
  const color = `rgb(${num1}, ${num2}, ${num3})`;
  console.log(color);
  return color;
}

function genPalette(num)
{
  let result = [];
  for(let i=0; i<num; i++)
  {
    result.push(genRandomColor());
  }
  console.log("palette: " + result);
  return result;
}

function toggleRandomPalette()
{
  const element = document.getElementById("randomPalette");
  useRandomPalette = !useRandomPalette;
  if(useRandomPalette)
  {
    setRandomPalette();
  }
}

function setRandomPalette()
{
  colors = genPalette();
}

// toggle settings visibility
function toggleSettings()
{
  const settings = document.getElementById("settings");
  const visible = settings.style.display == "none" ? false : true;
  settings.style.display = visible ? "none" : "block";
}

// Apply settings
function applySettings()
{
  console.log("applying settings");
  settingsIds.forEach((settingId)=>{
    settingsObj[settingId] = document.getElementById(settingId).value;
  });
  setCanvasSize();
  clearCanvas();
}

function fillSettingsUIWithDefaults()
{
  settingsIds.forEach((settingId)=>{
    document.getElementById(settingId).value = settingsObj[settingId];
  });
}
fillSettingsUIWithDefaults();

function toggleAuto()
{
  auto = !auto;
  console.log("auto: " + auto);
}

function autoGen()
{
  if(auto)
  {
    generate();
  }
  setTimeout(autoGen, settingsObj.autoSpeedSetting);
}
autoGen();

// ------------------------------------------
// TEST

function test()
{
  colors = genPalette(2);
}
test();