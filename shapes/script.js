//TODO
// implement backgroundColor
// implement settings
// fix elipse
// tweak default settings for better results

// -------------------------------------------------------------

let backgroundColor = "black";

let canvasH = 400;
let canvasW = 600;

let minRectW = 10;
let minRectH = 10;
let maxRectW = 100;
let maxRectH = 100;

let chanceOfCircle = 30;
let minCircR = 10;
let maxCircR = 100;
let chanceOfElipse = 30;
let maxCircElipse = 100;

let chanceOfLine = 30;
let lineMinWidth = 2;
let lineMaxWidth = 10;

let chanceOfRotate = 30;
let maxRotate = 45

const palettes =
[
  // monochrome
  [
    "#FF8888",
    "#FF2222"
  ],
  // rainbow
  [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "violet"
  ]
];

let colors = palettes[1];

// -------------------------------------------

// init
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = canvasW;
canvas.height = canvasH;

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
    if(percentTest(chanceOfLine))
    {
      const line = genLine();
      drawLine(line.color, line.x, line.y, line.x2, line.y2, line.width);
    }
    // if circle
    if(percentTest(chanceOfCircle))
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
  const x = randInc(0, canvasW);
  const y = randInc(0, canvasH);
  const w = randInc(minRectW, maxRectW);
  const h = randInc(minRectH, maxRectH);
  const color = selectRandomElement(colors);
  let rotate = 0;
  if(percentTest(chanceOfRotate))
  {
    rotate = randInc(1, maxRotate);
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
  const x = randInc(0, canvasW);
  const y = randInc(0, canvasH);
  // r is radius
  const r = randInc(minCircR, maxCircR);
  const color = selectRandomElement(colors);
  let elipse = 0;
  if(percentTest(chanceOfElipse))
  {
    elipse = maxCircElipse;
  }
  let rotate = 0;
  if(percentTest(chanceOfRotate))
  {
    rotate = randInc(1, maxRotate);
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
  const x = randInc(0, canvasW);
  const y = randInc(0, canvasH);
  const x2 = randInc(0, canvasW);
  const y2 = randInc(0, canvasH);
  const width = randInc(lineMinWidth, lineMaxWidth);
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
  ctx.clearRect(0, 0, canvasW, canvasH);
}

// toggle settings visibility
function settings()
{
  const settings = document.getElementById("settings");
  const visible = settings.style.display == "none" ? false : true;
  settings.style.display = visible ? "none" : "block";
}

function setSettings()
{
  console.log("set");
}

// ------------------------------------------
// TEST

function test()
{

}
test();