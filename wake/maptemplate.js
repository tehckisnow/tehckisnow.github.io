
let map = {
  //name: title of game
  name: "",
  //description: opening text for game
  description: "",
  //overwrite any default player info here
  player: {
		name: "player",
		description: "lookin' good!",
		health: 100,
		currentRoom: 1,
		inventory: [
		{name: "corn", description: "This is a delicious piece of corn on the cob!", edible: true, heals: 20}, 
		{name: "beef", description: "This is an old rotting piece of beef.  You are unsure why you are holding on to it."}]
	},
  //room data goes here
  room: [
    {//Room 0
      name: "default room",
      briefDesc: "This is a default room.",
      description: "This is a default room. If you see this, something has gone wrong.",
			exits: [],
			items: [],
    },

    {//Room 0b
      name: "default room",
      briefDesc: "This is a default room.",
      description: "This is a default room. If you see this, something has gone wrong.",
			exits: [
        {
          name: "east",
          destination: 4,
          doorName: "wooden",
          description: "an old wooden door covered in scratches",
          state: "open",
          keyID: -1
        },

      ],
			items: [
        {
          name: "pen",
          description: "a small silver writing pen.",
          trigger:{message: "You click the pen, cycling the mechanism revealing and hiding the writing tip."}
        },
      ],
    },
  ]
};