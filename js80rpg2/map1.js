(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }
 if(typeof module === 'object' && module && module.exports) {
  module.exports = data;
 }})("map1",
{ "height":20,
 "infinite":false,
 "layers":[
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":20,
         "id":1,
         "name":"ground",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":20,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 79, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 79, 0, 0, 0, 79, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 79, 0, 0, 0, 0, 0, 0, 0, 0, 79, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":20,
         "id":5,
         "name":"underchar",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":20,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 61, 61, 62, 61, 61, 62, 61, 0, 61, 74, 73, 61, 61, 61, 62, 61, 74, 0, 0, 85, 91, 92, 92, 92, 93, 0, 0, 0, 0, 86, 85, 0, 0, 0, 0, 66, 86, 0, 0, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 85, 67, 0, 0, 0, 78, 86, 0, 0, 85, 66, 0, 0, 0, 0, 0, 0, 0, 67, 86, 85, 0, 0, 0, 0, 78, 86, 0, 0, 85, 78, 0, 0, 0, 0, 0, 0, 0, 0, 86, 85, 0, 0, 0, 0, 78, 86, 0, 0, 85, 90, 0, 0, 0, 0, 0, 0, 0, 0, 86, 85, 29, 0, 0, 29, 29, 86, 0, 0, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 0, 0, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 0, 0, 85, 0, 0, 0, 63, 64, 65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 0, 0, 85, 0, 0, 0, 75, 76, 77, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 86, 0, 0, 85, 0, 0, 0, 87, 88, 89, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 0, 0, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 0, 0, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 0, 0, 85, 0, 0, 99, 0, 99, 0, 0, 0, 0, 0, 0, 0, 99, 99, 0, 0, 86, 0, 0, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 0, 0, 85, 0, 0, 0, 0, 0, 0, 0, 121, 122, 123, 0, 0, 0, 0, 0, 0, 86, 0, 0, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 0, 0, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":20,
         "id":2,
         "name":"collisions",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":20,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 26, 26, 26, 26, 26, 26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 26, 26, 0, 0, 26, 26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 109, 110, 111, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":20,
         "id":3,
         "name":"decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":20,
         "x":0,
         "y":0
        }, 
        {
         "draworder":"topdown",
         "id":4,
         "name":"interactions",
         "objects":[
                {
                 "gid":100,
                 "height":16,
                 "id":13,
                 "name":"",
                 "properties":[
                        {
                         "name":"desc",
                         "type":"string",
                         "value":"\"Nice barrel.\""
                        }],
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":16,
                 "x":208,
                 "y":176
                }, 
                {
                 "gid":122,
                 "height":16,
                 "id":14,
                 "name":"",
                 "properties":[
                        {
                         "name":"desc",
                         "type":"string",
                         "value":"\"Vroom!\""
                        }],
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":16,
                 "x":160,
                 "y":272
                }, 
                {
                 "gid":122,
                 "height":16,
                 "id":15,
                 "name":"",
                 "properties":[
                        {
                         "name":"desc",
                         "type":"string",
                         "value":"\"Vroom!\""
                        }],
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":16,
                 "x":176,
                 "y":272
                }, 
                {
                 "gid":121,
                 "height":16,
                 "id":16,
                 "name":"",
                 "properties":[
                        {
                         "name":"desc",
                         "type":"string",
                         "value":"\"There's something back here...\""
                        }, 
                        {
                         "name":"effect",
                         "type":"int",
                         "value":1
                        }],
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":16,
                 "x":144,
                 "y":272
                }, 
                {
                 "gid":99,
                 "height":16,
                 "id":17,
                 "name":"",
                 "properties":[
                        {
                         "name":"desc",
                         "type":"string",
                         "value":"\"Just a crate.\""
                        }],
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":16,
                 "x":224,
                 "y":240
                }, 
                {
                 "gid":99,
                 "height":16,
                 "id":18,
                 "name":"",
                 "properties":[
                        {
                         "name":"desc",
                         "type":"string",
                         "value":"\"Just a crate.\""
                        }],
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":16,
                 "x":240,
                 "y":240
                }, 
                {
                 "gid":99,
                 "height":16,
                 "id":19,
                 "name":"crate",
                 "properties":[
                        {
                         "name":"desc",
                         "type":"string",
                         "value":"\"Just a crate.\""
                        }, 
                        {
                         "name":"effect",
                         "type":"int",
                         "value":2
                        }],
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":16,
                 "x":96,
                 "y":240
                }, 
                {
                 "gid":99,
                 "height":16,
                 "id":20,
                 "name":"",
                 "properties":[
                        {
                         "name":"desc",
                         "type":"string",
                         "value":"\"Just a crate.\""
                        }],
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":16,
                 "x":64,
                 "y":240
                }, 
                {
                 "gid":42,
                 "height":16,
                 "id":21,
                 "name":"",
                 "properties":[
                        {
                         "name":"desc",
                         "type":"string",
                         "value":"\"Hello!\""
                        }, 
                        {
                         "name":"entity",
                         "type":"int",
                         "value":1
                        }],
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":16,
                 "x":160,
                 "y":160
                }, 
                {
                 "gid":41,
                 "height":16,
                 "id":22,
                 "name":"",
                 "properties":[
                        {
                         "name":"desc",
                         "type":"string",
                         "value":"\"Hi!\""
                        }, 
                        {
                         "name":"entity",
                         "type":"int",
                         "value":2
                        }],
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":16,
                 "x":64,
                 "y":64
                }, 
                {
                 "gid":98,
                 "height":16,
                 "id":23,
                 "name":"",
                 "properties":[
                        {
                         "name":"destinationX",
                         "type":"int",
                         "value":64
                        }, 
                        {
                         "name":"destinationY",
                         "type":"int",
                         "value":112
                        }, 
                        {
                         "name":"exit",
                         "type":"int",
                         "value":1
                        }, 
                        {
                         "name":"facing",
                         "type":"string",
                         "value":"up"
                        }],
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":16,
                 "x":144,
                 "y":32
                }],
         "opacity":1,
         "type":"objectgroup",
         "visible":true,
         "x":0,
         "y":0
        }],
 "nextlayerid":6,
 "nextobjectid":30,
 "orientation":"orthogonal",
 "properties":[
        {
         "name":"mapEvents",
         "type":"int",
         "value":0
        }],
 "renderorder":"right-down",
 "tiledversion":"1.2.4",
 "tileheight":16,
 "tilesets":[
        {
         "columns":12,
         "firstgid":1,
         "image":"..\/assets\/rpg\/ww2tileset.png",
         "imageheight":176,
         "imagewidth":192,
         "margin":0,
         "name":"tileset1",
         "spacing":0,
         "tilecount":132,
         "tileheight":16,
         "tilewidth":16,
         "transparentcolor":"#003039"
        }],
 "tilewidth":16,
 "type":"map",
 "version":1.2,
 "width":20
});