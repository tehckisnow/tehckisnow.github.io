# WakeJS
A text-based adventure game engine in Javascript written for practice.

I have built a simple browser terminal emulator for displaying a text-based game in the browser. Text is outputted to an HTML paragraph element which is followed by an input element that takes user's text, changes game states and calculates a response, then appends it to the previous HTML paragraph element.  (This may likely cause problems when this element becomes too large, so consider changing output to instead add additional text elements, or remove the oldest lines from the text element)

So far a player can move around with commands like "n" or "north", and can review the room description with the "look" or "l" command.

Todo:
-make more object-oriented? (would reduce repeated code)
-out() should create new elements instead of appending, or eliminate the oldest lines after a threshold
-tokenize and parse multi-word commands
-"look at x" should return description of x
-inventory, get and drop commands
-doors, locks, keys.
-interactables (considering calling these machines; they are items with states and/or behaviors, e.g. lightswitch.)
-review formatting of room info output
-simplify code (a lot of unnecessary abstraction.  consolidate similar functions or break up into smaller?)
-import/export map data to a json file to separate game data, manage saving, and swap games.
-tutorial/help command
 
Commands so far:
l
look
n
north
s
south
e
east
w
west
reset

Future commands:
look at, get, take, drop, go, use, inv/inventory/i, 
