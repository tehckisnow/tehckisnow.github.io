//TODO:
//how to deal with puncuation?
//should I allow tokens that never appear adjacent to do so in output?

//return an integer between 0 and [num]
function random(num){
  return Math.floor(Math.random() * num);
};

//used as callback to filter unique array values
function unique(value, index, self){
  return self.indexOf(value) === index;
};

//generated a 2d array filled with [element]
function arr2d(height, width, element){
  let y = height;
  let x = width;
  let arr = [];
  while(y > 0){
    arr.push([]);
    while(x > 0){
      arr[arr.length - 1].push(element);
      x--; 
    };
    x = width;
    y--;
  };
  return arr;
};

//build and return an object with probabilities array and tokens array
function markov(input, seperator){
  if(!seperator){seperator = " "};
  let corpus = input;
  let tokenized = corpus.split(seperator);
  let uniqueTokens = tokenized.filter(unique);
  //build empty 2d array (holds occurances data)
  let empty = arr2d(uniqueTokens.length, uniqueTokens.length, 0);
  //increment occurances
  for(i in tokenized){
    let x = uniqueTokens.findIndex(function(e){ return e === tokenized[i]});  
    let y = uniqueTokens.findIndex(function(e){ return e === tokenized[parseInt(i) + 1]});
    if(x > -1 && y > -1){
      empty[x][y]++;
    };
  };
  //build probability array
  let probabilities = arr2d(uniqueTokens.length, uniqueTokens.length, 0);
  let lineTotals = [];
  for(u in empty){
    let lineTotal = 0;
    for(i in empty[u]){
      lineTotal += empty[u][i];
    };
    lineTotals.push(lineTotal);
  };
  //calculate and fill probabilities
  for(u in empty){
    for(i in empty[u]){
      probabilities[u][i] = empty[u][i] / lineTotals[u] || 0;
    };
  };
  //pack data
  let data = {};
  data.probabilities = probabilities;
  data.tokens = uniqueTokens;
  //return
  return data;
};

//generate a chain based on probability object passed in
//returns a string made up of [length] tokens, seperated by [seperator]s
//seperator is a space if not specified
//seed is a randomly chosen token if not specified
function generate(data, length, seed, seperator){
  if(!seperator){seperator = " "};
  if(!seed){
    seed = data.tokens[random(data.tokens.length)];
  };
  let result = [];
  result[0] = seed;
  let i = 0;
  while(i < length){
    //identify current token
    let currentIndex = data.tokens.findIndex(function(e){return e === result[i]});
    //select following token
    let currentProbs = data.probabilities[currentIndex];
    let nextIndex = currentProbs.findIndex(function(e){
      return e > Math.random();
    });
    //if nextIndex was not found(current index was at end of array), choose a random one
    if(nextIndex === -1){nextIndex = random(data.tokens.length)};
    let next = data.tokens[nextIndex];
    //append to result
    result.push(next);
    i++;
  };
  let final = result.join(seperator);
  return final;
};

function wordLength(string){
  return string.split(" ").length;
};//wordLength()

let dom = {
  input: document.getElementById("input"),
  output: document.getElementById("output"),
  gobutton: document.getElementById("gobutton"),
};

function go(){
  dom.output.innerHTML = generate(markov(dom.input.value), wordLength(dom.input.value));
};//go()

function enter(event){
  if(event.key === "Enter"){
    go();
  };
};//enter()

document.body.addEventListener("keydown", enter);