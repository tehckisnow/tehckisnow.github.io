
function SplitString(listString, separater=" ")
{
  let list = listString.split(separater);
  //let verticalList = "";
  //list.forEach(element => verticalList += element + "<br>");
  return list;
}

// Splits a string using multiple separaters; first separater is used as final splitter
function MultiSplit(string, tokensArr)
{
  let splitter = tokensArr[0];
  let result = string;
  for(let i=0; i<tokensArr.length; i++)
  {
    result = result.split(tokensArr[i]).join(splitter);
  }
  return result.split(splitter);
}


let generate =
{
 
  // Returns a random integer between min (inc) and max (inc)
  // default usage is assumed to be to just include max (e.g. Random(10))
  // or blank for 50/50 odds
  // Examples: Random(), Random(10, 1), Random(arr.length-1);
  Random: function(max=1, minval=0)
  {
    if(max >= minval)
    {
      minval = Math.ceil(minval);
      max = Math.floor(max);
      let result = Math.floor(Math.random() * (max - minval + 1) + minval);
      return result;
    }
    else
    {
      return max;
    }
  },

  getRandomInt: function(min, max) 
  {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  },

  // Returns a random element from the passed array
  PickFrom: function(arr)
  {
    return arr[this.Random(arr.length -1, 0)];
  },

  //num is length of array
  randIndex: function(num)
  {
    return Math.floor(Math.random() * num);
  },

  Percent: function(num)
  {
    return num <= generate.Random(100, 1) ? true : false;
  },

  RandomColor: function()
  {
    let color = Math.floor(Math.random()*16777215).toString(16);
    //el.style.color = '#' + color;
    let newColor = '#' + color;
    return newColor;
  },

  Clamp: function(num, min, max)
  {
    return Math.min(Math.max(num, min), max);
  }

}



let dom_utils = {};

(function(context)
{

  context.createEl = function(o)
  {
    let type = o.type || 'div';
    let el = document.createElement(type);
    // assign properties
    for(const key of (Object.keys(o)))
    {
      if(key != 'attrs' && key != 'type')
      {
        el[key] = o[key];
      }
    }
    // assign attributes
    if(o.attrs)
    {
      for(let key of (Object.keys(o.attrs)))
      {
        let value = o.attrs[key];

        //convert attribute from camelCase to dash-syntax if necessary
        if (key != key.toLowerCase())
        {
          key = key.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
        }

        // set the attribute on the element
        el.setAttribute(key, value);
      }
    }
    return el;
  };

  context.createSVG = function(o)
  {
    let xmlns = "http://www.w3.org/2000/svg";
    let type = o.type || 'rect';
    let el = document.createElementNS(xmlns, type);
    if(o.className)
    {
      el.className.baseVal = o.className;
    }
    if(o.attrs)
    {
      Object.keys(o.attrs).forEach(function(key, idx) {
        let value = o.attrs[key];
        if(key != key.toLowerCase())
        {
          key = key.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
        }
          el.setAttributeNS(null, key, value);
      });
    }
    return el;
  };

})(dom_utils);





let svgManager =
{

  // Will use palette as strokePalette if strokePalette is left off
  NewCanvas: function(id, w, h, palette, strokePalette)
  {
    let canvas = {};
    canvas.svg = svgManager.SVGElement(id, w, h);
    let defaultParent = canvas.svg;
    canvas.nextId = 0;

    canvas.AssignID = function(shape)
    {
      shape.id = nextId++;
    }

    canvas.Build = (o) => svgManager.Build(o, defaultParent);
    canvas.Create = (type) => {svgManager.Create(type, defaultParent); canvas.AssignID(shape); };
    //! the following are removed until they support the canvas as parent and assigning ids properly
    //canvas.Rect = (x, y, w, h, fill, strokeColor, strokeWidth) => svgManager.Rect(x, y, w, h, fill, strokeColor, strokeWidth, defaultParent);
    //canvas.Circle = (x, y, radius, fill, strokeColor, strokeWidth) => svgManager.Circle(x, y, radius, fill, strokeColor, strokeWidth, defaultParent);

    canvas.defaultParameterRanges = svgManager.defaultParameterRanges();
    canvas.GenShape = (pa) => { return svgManager.GenShape(pa); };
    canvas.Random = () =>
    {
      let shapeParams = canvas.GenShape(canvas.defaultParameterRanges);
      let shape = canvas.Build(shapeParams);
      shape.SetRandomPos();
      return shape;
    };

    canvas.palette = palette != null ? palette : svgManager.defaultParameterRanges().fillColors;
    canvas.strokePalette = strokePalette != null ? strokePalette : palette;

    return canvas;
  },

  // This is being converted into an internal function (I think), use Build() below
  Create: function(type, parent)
  {
    let newShape = document.createElementNS('http://www.w3.org/2000/svg', type);
    newShape.className.baseVal = 'mysvg'; //set baseVal rather than animVal, or animation value
    newShape.man = svgManager;
    newShape.type = type;
    
    // Coordinates
    newShape.SetX = (x) => { svgManager.SetX(newShape, x); };
    newShape.SetY = (y) => { svgManager.SetY(newShape, y); };
    newShape.SetPos = (x, y) => { svgManager.SetPos(newShape, x, y); };
    newShape.SetRandomPos = () => { svgManager.SetRandomPos(newShape); };
    
    // Get attributes
    newShape.GetAttribute = (attrib) => svgManager.GetAttribute(newShape, attrib);
    newShape.SetAttribute = (attrib, value) => svgManager.SetAttribute(newShape, attrib, value);
    newShape.GetX = () => svgManager.GetX(newShape);
    newShape.GetY = () => svgManager.GetY(newShape);

    // Shape
    if(type == 'rect')
    {
      newShape.SetHeight = (h) => svgManager.SetHeight(newShape, h);
      newShape.SetWidth = (w) => svgManager.SetWidth(newShape, w);
      newShape.SetDimensions = (w, h) => svgManager.SetDimensions(newShape, w, h);
      newShape.SetRoundCornerX = (x) => svgManager.SetRoundCornerX(newShape, x);
      newShape.SetRoundCornerY = (y) => svgManager.SetRoundCornerY(newShape, y);
      newShape.SetRoundedCorners = (x, y) => svgManager.SetRoundedCorners(newShape, x, y);

      // 'circle' attributes
      newShape.SetRadius = (r) => svgManager.SetAttributeWrong(newShape, r, "circle");
    }
    if(type == 'circle')
    {
      newShape.SetRadius = (r) => { svgManager.SetRadius(newShape, r); };

      // 'rect' attributes
      newShape.SetHeight = (h) => svgManager.SetAttributeWrong(shape, h, 'rect');
      newShape.SetWidth = (w) => svgManager.SetAttributeWrong(shape, w, 'rect');
      newShape.SetDimensions = (w, h) => svgManager.SetAttributeWrong(shape, w, 'rect');
      newShape.SetRoundCornerX = (x) => svgManager.SetAttributeWrong(shape, x, 'rect');
      newShape.SetRoundCornerY = (y) => svgManager.SetAttributeWrong(shape, y, 'rect');
      newShape.SetRoundedCorners = (x, y) => svgManager.SetAttributeWrong(shape, x, 'rect');
    }

    // Style
    newShape.SetFill = (fill) => svgManager.SetFill(newShape, fill);
    newShape.SetStroke = (strokeColor, strokeWidth) => svgManager.SetStroke(newShape, strokeColor, strokeWidth);
    newShape.SetStyle = (fill, color, width) => svgManager.SetStyle(newShape, fill, color, width);

    // Transform
    newShape.Transform = (type, values) => svgManager.Transform(newShape, type, values);
    newShape.Translate = (x, y) => svgManager.Translate(newShape, x, y);
    newShape.Scale = (x, y) => svgManager.Scale(newShape, x, y);
    newShape.Rotate = (a, x, y) => svgManager.Rotate(newShape, a, x, y);
    newShape.SkewX = (a) => svgManager.SkewX(newShape, a);
    newShape.SkewY = (a) => svgManager.SkewY(newShape, a);

    if(parent)
    {
      parent.appendChild(newShape);
    }
    return newShape;
  },

  NewPalette: function(colorsArr)
  {
    let palette =
    {
      colors: [],
      Add: function(c)
      {
        this.colors.push(c);
      },
      Pick: function()
      {
        return this.colors[generate.randIndex(this.colors.length)];
      }
    };

    for(let i=0; i<colorsArr.length; i++)
    {
      palette.Add(colorsArr[i]);
    }
    
    return palette;
  },

  // To build a specific shape, pass in an object (o) with the properties desired
  Build: function(o, parent)
  {
    let type = o.type;
    //! handle case for if o or parent is left blank?

    let newSh = svgManager.Create(type, parent);
    {
      //ensure key is formatted correctly if 'circle' (e.g. 'cx' and 'cy')
      if(type == 'circle')
      {
        if(o.hasOwnProperty('x'))
        {
          svgManager.RenameProperty(o, 'x', 'cx');
        }
        if(o.hasOwnProperty('y'))
        {
          svgManager.RenameProperty(o, 'y', 'cy');
        }
      }

      // Copy key values
      Object.keys(o).forEach(function(key, idx) {
        if(o[key] != type)
        {
          newSh.SetAttribute(key, o[key]);
        }
      });
    }
    newSh.parent = parent;
    return newSh;
  },

  RenameProperty: function(obj, oldProp, newProp)
  {
    if(obj.hasOwnProperty(oldProp))
    {
      obj[newProp] = obj[oldProp];
      delete obj[oldProp];
    }
    return obj;
  },

  SVGElement: function(id, w, h)
  {
    let svg = dom_utils.createSVG({
      type:'svg',
      id:id,
      height:h,
      width:w
    });
    return svg;
  },

  Rect: function(x, y, w, h, fill, strokeColor, strokeWidth, parent)
  {
    let p = null;
    if(parent){ p = parent};
    let newRect = svgManager.Create('rect', p);
    newRect.SetDimensions(w, h);
    newRect.SetPos(x, y);
    newRect.SetStyle(fill, strokeColor, strokeWidth)
    return newRect;
  },

  Circle: function(x, y, radius, fill, strokeColor, strokeWidth, parent)
  {
    let p = null;
    if(parent){ p = parent};
    let newCirc = svgManager.Create('circle', p);
    newCirc.SetRadius(radius);
    newCirc.SetPos(x, y);
    newCirc.SetStyle(fill, strokeColor, strokeWidth);
    return newCirc;
  },

  SetAttribute: function(shape, attribute, value)
  {
    shape.setAttributeNS(null, attribute, value);
  },

  SetAttributeWrong: function(shape, attribute, intendedShape)
  {
    let msg = `ERROR: Shape of type: [${shape.type}] does not have attribute: [${attribute}] because it is not a: [${intendedShape}]`;
    console.error(msg);
  },

  GetAttribute: function(shape, attribute)
  {
    return shape.getAttribute(attribute);
  },

  SetFill: function(shape, color ='#B2BEB5')
  {
    svgManager.SetAttribute(shape, "fill", color);
  },

  SetStroke: function(shape, color='#0000ffff', width=0)
  {
    svgManager.SetAttribute(shape, "stroke", color);
    svgManager.SetAttribute(shape, "stroke-width", width);
  },

  SetStyle: function(shape, fillColor='#B3BEB5', strokeColor='#0000ffff', strokeWidth=0)
  {
    svgManager.SetFill(shape, fillColor);
    svgManager.SetStroke(shape, strokeColor, strokeWidth);
  },

  SetWidth: function(shape, width =20)
  {
    svgManager.SetAttribute(shape, "width", width);
  },

  SetHeight: function(shape, height =20)
  {
    svgManager.SetAttribute(shape, "height", height);
  },

  SetDimensions: function(shape, w =20, h =20)
  {
    svgManager.SetWidth(shape, w);
    svgManager.SetHeight(shape, h);
  },

  SetRoundCornerX: function(shape, x=0)
  {
    svgManager.SetAttribute(shape, "rx", x);
  },

  SetRoundCornerY: function(shape, y=0)
  {
    svgManager.SetAttribute(shape, "ry", y);
  },

  SetRoundedCorners: function(shape, x=0, y=0)
  {
    svgManager.SetRoundCornerX(shape, x);
    svgManager.SetRoundCornerY(shape, y);
  },

  SetRadius: function(shape, rad=20)
  {
    if(shape.tagName == 'circle')
    {
      svgManager.SetAttribute(shape, 'r', rad);
    }
  },

  SetX: function(shape, x=0)
  {
    let property = 'x';
    if(shape.tagName == 'circle')
    {
      property = 'cx';
    }
    svgManager.SetAttribute(shape, property, x);
  },

  SetY: function(shape, y =0)
  {
    let property = 'y';
    if(shape.tagName == 'circle')
    {
      property = 'cy';
    }
    svgManager.SetAttribute(shape, property, y);
  },

  SetPos: function(shape, x=0, y=0)
  {
    svgManager.SetX(shape, x);
    svgManager.SetY(shape, y);
  },

  SetRandomPos: function(shape)
  {
    let parent = shape.parent;

    let maxX = parent.width.baseVal.value;
    let maxY = parent.height.baseVal.value;
    let minX = 0;
    let minY = 0;
    
    let adjustPadding = false;
    //if(padding == -1)
    //{
      if(shape.type == 'circle')
      {
        padding = shape.GetAttribute('r');
      }
      else if(shape.type == 'rect')
      {
        padding = shape.GetAttribute('width');
        adjustPadding = true;
      }
    //}
    //if(padding > 0)
    //{
      maxX -= padding;
      minX += padding;
      if(shape.type == 'rect' && adjustPadding)
      {
        padding = shape.GetAttribute('height');
      };
      maxY -= padding;
      minY += padding;
    //}
    // gen random positions
    let nx = generate.Random(maxX, minX);
    let ny = generate.Random(maxY, minY);
    // clamp to canvas dimensions
    nx = generate.Clamp(nx, 0, maxX);
    ny = generate.Clamp(ny, 0, maxY);

    shape.SetPos(nx, ny);
  },

  GetX: function(shape)
  {
    let attrib = 'x';
    if(shape.tagName == 'circle')
    {
      attrib = 'cx';
    }
    return svgManager.GetAttribute(shape, attrib);
  },

  GetY: function(shape)
  {
    let attrib = 'y';
    if(shape.tagName == 'circle')
    {
      attrib = 'cy';
    }
    return svgManager.GetAttribute(shape, attrib);
  },

  Transform: function(shape, type, valuesAsAString)
  {
    // Get current property
    let origTval = "";
    let tran = shape.GetAttribute('transform');
    if(tran != null)
    {
      origTval = tran;
    }
    // Split into an array by ') '
    let origArr = MultiSplit(origTval, ['+', ') ', '), ', ')) ', '))', ')']);

    // Put the ")" back on the end of each element
    let newArr = [];
    for(let e=0; e<origArr.length; e++)
    {
      if(origArr[e] != "" && origArr[e] != " " && origArr[e] != '' && 
      origArr[e] != ' ' && origArr[e] != null && origArr[e] != undefined)
      {
        newArr.push(origArr[e] + ')');
      }
    }
    
    // Search for entry and modify it
    let newVal = `${type}(${valuesAsAString})`;
    let notFound = true;
    for(let i=0; i<newArr.length; i++)
    {
      if(newArr[i].includes(type))
      {
        newArr[i] = newVal;
        notFound = false;
        break;
      }
    };
    // If an entry is not found, add a new one
    if(notFound)
    {
      newArr.push(newVal);
    }

    // Revert array back to string
    let result = newArr.join(" ");
    svgManager.SetAttribute(shape, 'transform', result);
  },

  // if optional values x and y are left out, the object rotates around the origin of the user coordinate system
  Translate: function(shape, x, y)
  {
    svgManager.Transform(shape, 'translate', `${x}, ${y}`);
  },

  // If optional value y is left out, it is assumed to match x for uniform scaling
  Scale: function(shape, x, y)
  {
    if(y)
    {
      svgManager.Transform(shape, 'scale', `${x}, ${y}`);
    }
    else
    {
      svgManager.Transform(shape, 'scale', `${x}`);
    }
  },

  Rotate: function(shape, a, x, y)
  {
    if(x)
    {
      svgManager.Transform(shape, 'rotate', `${a}, ${x}, ${y}`);
    }
    else
    {
      svgManager.Transform(shape, 'rotate', `${a}`);
    }
  },

  SkewX: function(shape, a)
  {
    svgManager.Transform(shape, 'skewX', `${a}`)
  },

  SkewY: function(shape, a)
  {
    svgManager.Transform(shape, 'skewY', `${a}`)
  },

  defaultParameterRanges: function()
  {
    let defaultParameterRanges =
    {
      types: ['rect', 'circle'],
      //!min and max x and y will eventually depend on the area of the svg object.
      minWidth: 10,
      maxWidth: 50,
      minHeight: 10,
      maxHeight: 50,
      minRadius: 5,
      maxRadius: 50,

      chanceOfRoundCorners: 10,
      maxRoundCornerX: 50,
      maxRoundCornerY: 50,

      minStrokeWidth: 0,
      maxStrokeWidth: 4,
      fillColors: [
        "#ffffeaff",
        "#d8d8d8ff",
        "#ed9749ff",
        "#d3617bff",
        "#5b8c5aff",
        "#2384c5fe",
        "#5c6784ff",
        "#364958ff",
        "#444140ff",
        "#1e1e24ff"
      ],
      //strokeColors: [],
      //transform
      chanceOfTransform: 50,

      chanceOfScale: 20,
      minScale: 20,
      maxScale: 80,
      chanceOfRotate: 20,
      minRotate: 0,
      maxRotate: 360,

      chanceOfSkewX: 20,
      minSkewX: 0,
      maxSkewX: 100,
      chanceOfSkewY: 20,
      minSkewY: 0,
      maxSkewY: 100
    };
    defaultParameterRanges.fillColors = svgManager.NewPalette(defaultParameterRanges.fillColors);

    return defaultParameterRanges;
  },

  GenShape: function(parameters)
  {
    let result = {};
    
    // basics
    result.type = generate.PickFrom(parameters.types);
    result.x;
    result.y;
    //! set x/y here?

    // dimensions
    if(result.type == 'rect')
    {
      result.width = generate.Random(parameters.maxWidth, parameters.minWidth);
      result.height = generate.Random(parameters.maxHeight, parameters.minHeight);
      if(generate.Percent(parameters.chanceOfRoundCorners))
      {
        result.roundCornersX = generate.Random(parameters.maxRoundCornerX, 0);
        result.roundCornersY = generate.Random(parameters.maxRoundCornerY, 0);
      }
    }
    else if(result.type == 'circle')
    {
      result.r = generate.Random(parameters.maxRadius, parameters.minRadius);
    }

    // style
    //result.fill = parameters.fillPalette.Pick();
    result.fill = parameters.fillColors.Pick();
    if(parameters.strokePalette)
    {
      //result.strokeColor = parameters.strokeColors.Pick();
      result.strokeColor = parameters.strokeColors.Pick();
    }
    result.strokeWidth = generate.Random(parameters.maxStrokeWidth, parameters.minStrokeWidth);
    
    // transform
    //!
    if(generate.Percent(parameters.chanceOfTransform))
    {
      let transformResult = "";

      // Scale X
      this.Testparams(result, 'scale', parameters.chanceOfScale, parameters.minScale, parameters.maxScale);
      //console.log(result.scale);

      // Scale Y
      
      this.Testparams(result, 'rotate', parameters.chanceOfRotate, parameters.minRotate, parameters.maxRotate);
      console.log(result.rotate);

      // Skew X
      
      // Skew Y

      //! set transformResult here
    }

    return result;
  },

  Testparams: function(target, prop, chance, min, max)
  {
    let result = 1;
    if(generate.Percent(chance))
    {
      result = generate.Random(max, min);
    }
    if(result != 1)
    {
      target[prop] = result;
    }
  }

}


// ------------------------
// TEST

let w = 100;
let h = 100;

let root = document.querySelector('#root');
let canv = svgManager.NewCanvas('svg', w, h);
root.appendChild(canv.svg);


{
// let rect1Properties = 
// {
//   type: 'rect',
//   x: 20,
//   y: 40,
//   r: 25,
//   height: 50,
//   width: 50,
//   fill: 'red',
//   id: 'myrect1'
// };

// let circle1Properties = 
// {
//   type: 'circle',
//   x: 20,
//   y: 40,
//   r: 25,
//   fill: 'yellow',
//   id: 'mycirc1'
// };
}

let shapes = [];

function genshape()
{
  let newShape = canv.Random();
  shapes.push(newShape);
}

function clearshapes()
{
  while(shapes.length > 0)
  {
    let shape = shapes.pop();
    shape.remove();
  }
}
