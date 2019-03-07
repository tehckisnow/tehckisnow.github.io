let settingsProfile = {
  //gameSize: {x: "480px", y: "300px"},
  //gameMode: "start",
  //startScreen: "url(0.png)",
  assetDirectory: "testgame/assets/",
  defaultWindowTitle: "Test Game!",
};

let player = {
  room: 1,
  facing: "n",
  inv: [],
};

let map = [
  {id: 0,
    directions: [],
  },
  {id: 1,
    directions: [
      //these should always be listed in clockwise order, starting with north(or closest to north)
      {dir: "n", img: "1n.png", interactions: [], forwardDestination: 2, forwardFacing: "n"},
			{dir: "e", img: "1e.png", interactions: []},
			{dir: "s", img: "1s.png", interactions: []},
			{dir: "w", img: "1w.png", interactions: []},
    ],
  },
  {id: 2,
    directions: [
      {dir: "n", img: "2n.png", interactions: [], forwardDestination: 6, forwardFacing: "n"},
			{dir: "e", img: "2e.png", interactions: [], forwardDestination: 5},
			{dir: "s", img: "2s.png", interactions: [], forwardDestination: 1, forwardFacing: "s"},
			{dir: "w", img: "2w.png", interactions: [], forwardDestination: 3},
    ],
  },
  {id: 3,
    directions: [
      {dir: "n", img: "3n.png", interactions: [{id: "i003", type: "exit", img: "", x: 100, y: 100, width: 100, height: 100, effect: ""}]},
			{dir: "e", img: "3e.png", interactions: [], forwardDestination: 2},
			{dir: "s", img: "3s.png", interactions: []},
			{dir: "w", img: "3w.png", interactions: []},
    ],
  },
  {id: 4,
    directions: [
      {dir: "n", img: "4n.png", interactions: []},
			{dir: "e", img: "4e.png", interactions: []},
			{dir: "s", img: "4s.png", interactions: [], forwardDestination: 3, forwardFacing: "s"},
			{dir: "w", img: "4w.png", interactions: []},
    ],
  },
  {id: 5,
    directions: [
      {dir: "n", img: "5n.png", interactions: []},
			{dir: "e", img: "5e.png", interactions: []},
			{dir: "s", img: "5s.png", interactions: []},
			{dir: "w", img: "5w.png", interactions: [], forwardDestination: 2},
    ],
  },
  {id: 6,
    directions: [
      {dir: "n", img: "6n.png", interactions: []},
			{dir: "e", img: "6e.png", interactions: []},
			{dir: "s", img: "6s.png", interactions: [], forwardDestination: 2, forwardFacing: "s"},
			{dir: "w", img: "6w.png", interactions: []},
    ],
  },
];