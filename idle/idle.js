let main = document.getElementById("main");
let resourcesDisplay = document.getElementById("resources"); //number
let button = document.getElementById("button");
let inv = document.getElementById("inv");
let output = document.getElementById("output");
let autoClick;
let autoClickFrequency = 5;

let resources = 0;
let unitName = "r";
let increasePerClick = 1; //starts at 1!
let inventory = [];
let resourcesToUnlockShop = 10;

function button1(){
  resources += increasePerClick;
  button.innerHTML = "+" + increasePerClick + unitName;
  update();
  output.innerHTML = "added " + increasePerClick + unitName;
};

function update(){
  resourcesDisplay.innerHTML = resources + unitName;
  shop.update();
};

function purchase(item){
  if(shop.shopInventory.includes(item)){  
    if(item.cost <= resources){
      inventory.push(item);
      resources -= item.cost;
      output.innerHTML = "purchased " + item.name;
      item.effect();
      button.innerHTML = "+" + increasePerClick + unitName;
      if(item.remove){shop.removeItemFromShop(item);};
      update();
    }else{
      output.innerHTML = "not enough resources.";
      console.log("Not enough resources");//not enough funds
    }//not in shop yet
  };
}

function increaseAutoClickFrequency(amount){
  autoClickFrequency -= amount;
  clearInterval(autoClick);
  autoClick = setInterval(function(){button1();}, autoClickFrequency * 1000);
  inv.innerHTML = "Auto-Click: every " + (autoClickFrequency.toFixed(2)) + " seconds.";
  output.innerHTML = "Auto-Click rate decreased by " + amount;
};

let shop = {
  div: document.getElementById("shop"),
  shopCatalogue: [], //all possible items, not all start out visible
  shopInventory: [], //currently visible items
  show: function(){
    shop.div.style.display = "block";
    output.innerHTML = "unlocked shop.";
    shop.show = function(){};
  },
  hide: function(){
    shop.div.style.display = "none";
  },
  update: function(){
    for(i in shop.shopCatalogue){
      if(shop.shopCatalogue[i].condition() === true){
        //add to shop element
        shop.addItemToShop(shop.shopCatalogue[i]);
        shop.shopCatalogue.splice(i, 1);
      }
    }
    if(resources >= resourcesToUnlockShop){shop.show()}
  },
  addItemToShop: function(item){
    let newElement = document.createElement("div");
    newElement.setAttribute("id", "item-" + item.name);
    let newElementText = document.createTextNode(item.name);
    newElement.appendChild(newElementText);
    let newElementButton = document.createElement("button");
    newElementButton.innerHTML = item.cost + unitName;
    newElementButton.addEventListener("click", function(){purchase(item); });
    newElement.appendChild(newElementButton);
    newElementButton.setAttribute("class", "label");
    output.innerHTML = "unlocked " + shop.shopCatalogue[i].name;

    //place in shop
    shop.div.appendChild(newElement);
    //add to shop.shopInventory
    shop.shopInventory.push(item);
  },
  removeItemFromShop: function(item){
    let itemToRemove = document.getElementById("item-" + item.name);
    shop.div.removeChild(itemToRemove);
  },
};

shop.hide();

//items
let item1 = {
  name: "+1 resource per click",
  cost: 10,
  condition: function(){if(resources >= 15){return true}},
  effect: function(){increasePerClick++;},
  remove: true,
};
let item2 = {
  name: "+1 resource per click",
  cost: 20,
  condition: function(){if(resources >= 25){return true}},
  effect: function(){increasePerClick++;},
  remove: true,
};
let item3 = {
  name: "+1 resource per click",
  cost: 30,
  condition: function(){if(resources >= 35){return true}},
  effect: function(){increasePerClick++;},
  remove: true,
};
let item4 = {
  name: "+2 resource per click",
  cost: 40,
  condition: function(){if(resources >= 55){return true}},
  effect: function(){increasePerClick += 2;},
  remove: true,
};
let item5 = {
  name: "+4 resource per click",
  cost: 50,
  condition: function(){if(resources >= 75){return true}},
  effect: function(){increasePerClick += 4;},
  remove: true,
};
let item6 = {
  name: "activate auto-click",
  cost: 100,
  condition: function(){if(resources >= 100){return true}},
  effect: function(){
    autoClick = setInterval(function(){button1();}, autoClickFrequency * 1000);
    inv.style.display = "block";
    let autoClickDisplay = document.createTextNode("Auto-Click: every " + autoClickFrequency + " seconds.");
    inv.appendChild(autoClickDisplay);
  },
  remove: true,
};
let item7 = {
  name: "reduce auto-click time by 1 second",
  cost: 150,
  condition: function(){if(resources >= 200){return true}},
  effect: function(){increaseAutoClickFrequency(1)},
  remove: true,
};
let item8 = {
  name: "reduce auto-click time by 1 second",
  cost: 300,
  condition: function(){if(resources >= 250){return true}},
  effect: function(){increaseAutoClickFrequency(1)},
  remove: true,
};
let item9 = {
  name: "reduce auto-click time by 2 second",
  cost: 500,
  condition: function(){if(resources >= 400){return true}},
  effect: function(){increaseAutoClickFrequency(2)},
  remove: true,
};
let item9b = {
  name: "reduce auto-click time by 0.1 second",
  cost: 1000,
  condition: function(){if(resources >= 1000){return true}},
  effect: function(){
    increaseAutoClickFrequency(0.1);
    item9b.cost *= 2;
    document.getElementById("item-" + item9b.name).childNodes[1].innerHTML = item9b.cost + unitName;
    item9b.removeCounter--;
    if(item9b.removeCounter <= 0){item9b.remove = true};
  },
  remove: false,
  removeCounter: 9,
};
let item10 = {
  name: "+10 resource per click",
  cost: 100,
  condition: function(){if(resources >= 700){return true}},
  effect: function(){
    increasePerClick += 10;
    item10.cost *= 2;
    document.getElementById("item-" + item10.name).childNodes[1].innerHTML = item10.cost + unitName;
  },
  remove: false,
};
let item11 = {
  name: "+100 resource per click",
  cost: 10000,
  condition: function(){if(resources >= 10000){return true}},
  effect: function(){
    increasePerClick += 100;
    item11.cost *= 2;
    document.getElementById("item-" + item11.name).childNodes[1].innerHTML = item11.cost + unitName;
  },
  remove: false,
};
let item12 = {
  name: "+1000 resource per click",
  cost: 100000,
  condition: function(){if(resources >= 200000){return true}},
  effect: function(){
    increasePerClick += 1000;
    item12.cost *= 2;
    document.getElementById("item-" + item12.name).childNodes[1].innerHTML = item12.cost + unitName;
  },
  remove: false,
};

let lastItem = {
  name: "This is the last item.  There is nothing else to do here.  Please stop playing.",
  cost: 9999999,
  condition: function(){if(resources > 1000000){return true}},
  effect: function(){inv.innerHTML += "<br>You have acquired the final item! Please stop playing, seriously."},
  remove: true,
};

//add items to shop
shop.shopCatalogue.push(item1);
shop.shopCatalogue.push(item2);
shop.shopCatalogue.push(item3);
shop.shopCatalogue.push(item4);
shop.shopCatalogue.push(item5);
shop.shopCatalogue.push(item6);
shop.shopCatalogue.push(item7);
shop.shopCatalogue.push(item8);
shop.shopCatalogue.push(item9);
shop.shopCatalogue.push(item10);
shop.shopCatalogue.push(item11);
shop.shopCatalogue.push(item12);
shop.shopCatalogue.push(lastItem);
shop.shopCatalogue.push(item9b);