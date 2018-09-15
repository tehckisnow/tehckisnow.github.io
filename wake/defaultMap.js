//map is an object that holds name, description, and an array of rooms and their data
var map = {
	//name: title of game (include author optionally?)
	name: "Wake",
	//description: opening text for the game
	description: "You slowly regain consciousness to find yourself on a cold, hard, stone floor. Perhaps you should <b>examine the room</b> to find out more about where you are?",
	player: {
		name: "player",
		description: "lookin' good!",
		health: 100,
		currentRoom: 1,
		inventory: [
		{name: "corn", description: "This is a delicious piece of corn on the cob!", edible: true, heals: 20}, 
		{name: "beef", description: "This is an old rotting piece of beef.  You are unsure why you are holding on to it."}]
	},
	
	room: [
		{ //Room 0
			name: "default room",
			briefDesc: "This is a default room.",
			description: "This is a default room. If you see this, something has gone wrong.",
			exits: [],
			items: []
		},
		
		{ //Room 1
			name: "Dark room",
			briefDesc: "This is a dark stone room. There is a light coming from the south.",
			description: "Cold stone makes up what you can see of this dark room, illuminated soley by a dim orange glow from the south.",
			exits: [
				{
				name: "south",
				destination: 2
				}
			],
			items: [
				{
				name: "rock",
				description: "A small, rough stone.",
				retain: true //does the item remain in inv upon use?
				}
			]
		},
		
		{ //Room 2
			name: "Stone room", 
			briefDesc: "This stone room contains a large stone fountain. There is a light coming from the south.",
			description: "The large bricks of this room are a cold, rough stone. A large decorative water fountain emits the sound of running water. A warm light is coming from the south.",
			exits: [
				{
				name: "north",
				destination: 1
				},
				{
				name: "south",
				destination: 3
				}
			],
			items: [{
				name: "fountain",
				description: "An ornate water fountain composed of a variety of elaborately detailed statues. The sound of water trickling down it's various surfaces fills the room.",
				obtainable: false
				}]
		},
		
		{ //Room 3
			name: "Well-lit room",
			briefDesc: "This stone room is lit by torches on each of the four walls. A matching set of doors to the east and west adorn opposite walls.",
			description: "The torches in this room burn brightly, providing you with a detailed view of the ornate carvings decorating the masonry. A matching set of doors to the east and west adorn opposite walls.",
			exits: [
				{
				name: "north",
				destination: 2
				},
				{
				name: "east",
				destination: 4,
				locked: true,
				keyID: 1203
				},
				{
				name: "west",
				destination: 5
				}
			],
			items: [
				{
				name: "pen",
				description: "a small silver writing pen."
				}
			]
		}, 
		
		{//Room 4
			name: "Secret room",
			briefDesc: "This small stone room warrants closer examination.",
			description: "The sole contents of this room is a small piece of paper laying on the floor.",
			exits: [
				{
				name: "west",
				destination: 3
				}
				],
				items: [
				{
				name: "note",
				description: "A small note scrawled on a scrap of torn paper.",
				read: "Congratulations! You've found the secret room! Nothing else to see here for now."
				}]
		}, 
		
		{//Room 5
			name: "Empty room",
			briefDesc: "A simple stone room.",
			description: "This stone room contains little or no discerning features.",
			exits: [
				{
				name: "east",
				destination: 3
				}
				],
				items: [
				{
				name: "key",
				description: "a small silver key.",
				id: 1203
				}]
		}
		
	] //room list
} //map