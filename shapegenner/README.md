# shapegenner

Notes go here...

See Demo here:

- [Link](https://tehckisnow.github.io/shapegenner/index.html)


TODO:

-This code is ridiculously messy and overcomplicated. Refactor everything!

-set up configuration file to be able to easily set all parameters  
-support typing in color codes for custom palettes  
-consider accessing coolors API if it is accessible, or webscraping?  
  or write a script for generating pleasing palettes (this might be tough)  
-Accept "current" as an acceptable value  
-Support more shapes: Ellipse, Star, Polygon, Line  
-Support transformations to objects  
-replace objects with <g> ?  
-finish shape.Transform so that multiple transforms do not override one another  
-convert individual transform functions to use the new shape.Transform so they do not override one another  
-set max number of shapes? (Array.shift() shape from shapes list and remove when above threshold)

-- -- COMPLETED -- --

-simple functions to create each basic primitive  
-simple functions to EDIT each basic primitive  
-link reference to these edit functions for easy utility and auto reference to this  
-set up all params that will be used  
-set up randomizer and link to params  
-Each new shape is a different color  
-colors are pulled from a palette   
