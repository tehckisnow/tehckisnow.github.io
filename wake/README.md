# WakeJS
A text-based adventure game engine in Javascript written for practice.
<br />
I have built a very simple browser terminal emulator for displaying a text-based game in the browser. Text is outputted to an HTML paragraph element which is followed by an input element that takes user's text, changes game states and calculates a response, then appends it to the previous HTML paragraph element.  (This may likely cause problems when this element becomes too large, so consider changing output to instead add additional text elements, or remove the oldest lines from the text element)

So far a player can move around with commands like "n" or "north", and can review the room description with the "look" or "l" command.
Player can also look at, pick up, and drop items.  Exits can be locked and require a key to unlock before exiting.
<p>
Todo:<br />
-help three times triggers hint system and link to walkthrough
-triggers: function in regular loop checks for triggers when entering a room or USEing an object.
	checks trigger: property in room if triggered by room, in item if triggered by item. triggers can change states for other objects by modifying properties to change.
-enable run game and exit commands to switch games
-refactor get and drop to use query and for in loops
-add support for displaying multi-word item names
-locked doors are only locked one-way; fix this
-rewrite tokenize() to use query (will save a lot of repetitive code)
-return error if no gamefile found (do I really need to do this? maybe not)
-list function for determining grammar (commas and spaces, oxford comma and) (or modify existing one!)
-use 
	use machine checks the machine and searches for reasonable verbs (flip, use, activate, throw, turn)
-interactables (considering calling these machines; they are items with states and/or behaviors, e.g. lightswitch.)<br />
-adjective property would allow multiple objects(silver key, bronze key). tokenize would also check adjective parameter for valid keywords<br />
-typos with look (like "look cion") return the room description as if target was not there.
-build enclosures for global variables<br />
-up arrow command history<br />
-make more object-oriented? (would reduce repeated code and allow for default settings)<br />
-ensure font is displaying correctly on other machines(works locally, but not when hosted)
-review formatting of room info output<br />
-simplify code (a lot of unnecessary abstraction.  consolidate similar functions or break up into smaller?)<br />
-save<br />
-background image with scanlines<br />
-bootup animation<br />
-code for timers?<br />
-if command is not found in engine, check game's json "customCommands" (this would force using eval() and pose security problems)<br />
-organize items in their own global array and sort by itemID? (likely make sorting, finding, and managing inventory easier, may make map less readable)<br />
-command checker checks all exit names in map? (would help for doors)(that's probably unecessary, maybe stratify exits to a master list, like with items)<br />
-seperate responces ("There doesn't seem to be an exit there.") into a master response list so they can be customized for a given game
-improve onResize (especially important for mobile version!)
-upon entering a room, check it's visited property and set to true if undefined.  use description for the first time entering a room and briefDesc for each time after<br />
-lock command?
-doors in addition to exits?
	doors could be exit parameters instead of seperate objects.  this would simplify things. (think about how doors are one-way locked right now- how to fix that)
-property in gamefile to set game-specific font?
-begin documenting API for engine


 <br />
Commands so far:<br />
l<br />
look<br />
examine<br />
n<br />
north<br />
s<br />
south<br />
e<br />
east<br />
w<br />
west<br />
reset<br />
help<br />
i<br />
inventory<br />
inv<br />
g<br />
get<br />
take<br />
d<br />
drop<br />
test<br />
debug<br />
tp<br />

recognized action targets:<br />
items in inventory<br />
items in current room<br />
me<br />
self<br />
room<br />
numbers (for tp)<br />
	

Future commands:<br />
look at, get, take, drop, go, use, inv/inventory/i, 

Updates:

may 24th, 2019
-fixed articles on item lists

sep 17th, 2018
-use will now display an item's trigger.message(more functions planned later)

sep 16th, 2018
-FIXED GET ALL!!!
-split "all" check in get to it's own function, getAll()

sep 15th, 2018
-drop all returns error if inv is empty
-revised instructions/help
-eat and destroyItem() (only works in inventory for now; not sure if it should be expanded to be able to destroy items in room)
-revised list command text
-revised default map
-added x for examine
-narrowed down 'get all' bug to one line
-added read!

sep 14th, 2018
-ACTUALLY fixed inventory system this time; had left out incrementer in getItem()
-incorporated retain property which determines if an object remains in inventory or is dropped after use
-help mentions 'list' command.
-added check for obtainable so player cannot pick up things like waterfountains or elephants!
-removed jQuery dependancies

-added examine (works like look)
-checks for initial player parameters in gamefile at startup and uses defaults if not found.
-checks for custom instructions in gamefile
-drop all (began work on get all)

sep 13, 2018
-tokenize() will now accept numbers.  this allows tp command to work.
-fixed inventory(I think?) 
-the while loop in getItem() does not have an incrementor.  Why does this seem to work correctly!?!?
-implemented look at(actually just an extension of look).  if there is a look target, it first checks inventory, then room and returns description.
-added me, self, room, list, and take.
-helpCounter reminds player of help command every third invalid input.
-added unlock, which checks inventory for a keyID and changes locked status of door.
-added itemlist and exitlist to look at room results
-added briefDesc, which is used in room updates, while description is used for look()

sep 12, 2018
-added query()
-replaced checkGo() with version that uses query()

sep 11, 2018
-added debug toggle
-return focus to prompt after "instructions" is clicked (by means of out().)
-exits can now be locked
-seperated map into seperate script file

sep 9, 2018-
-inventory; get and drop; still need to fix issue
-tokenized input; split user input into an array and save only recognized commands into array

older-
-created CSS theme
-instructions link

-help command displays instructions
-