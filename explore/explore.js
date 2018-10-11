//first person pre-rendered adventure game like myst

//todo:
//change l/r controls to iterate through an array(so that SE can work)
//          choose whether turnL will look at 
//"views", click on a thing and see a closeup, read a note, ect.  disable nav?
//interactables
//interactables override forward
//inventory
//back()  [is this necessary? maybe not.]

function load() {
    document.getElementById("loading").style.display = "none";
}
var img = document.getElementById("image");
var txt = document.getElementById("text");
var menu = true;
img.addEventListener("click", start);
var navVisible = true;//don't know why it doesn't work when this is set to false, so
toggleNav();          //I run togglenav here.  seems to be working, investigate later

function start() {
    toggleNav();
    updateView();
    img.removeEventListener("click", start);
}
function pressKey(event){
    if (menu && event.keyCode == 13){
        start();
        menu = false;
    }
    if (navVisible){
        if (event.keyCode === 38 || event.keyCode === 87){
            forward();
        }else if (event.keyCode === 37 || event.keyCode === 65){
            turnLeft();
        }else if (event.keyCode === 39 || event.keyCode === 68){
            turnRight();
        }else if (event.keyCode === 40 || event.keyCode === 83){
            back();
        }
    }
}
function toggleNav() {
    if (navVisible){
        document.getElementById("left").style.display = "none";
        document.getElementById("right").style.display = "none";
        document.getElementById("forward").style.display = "none";
        navVisible = false;
    }else {
        document.getElementById("left").style.display = "initial";
        document.getElementById("right").style.display = "initial";
        document.getElementById("forward").style.display = "initial";
        navVisible = true;
    }
}
function updateView() {
    var newScene = "" + player.room + player.facing + ".png";
    img.src = newScene;
    img.onerror= function(){img.src = "err.png"};
    txt.innerHTML=newScene;//remove this
    checkInteractable();
}
function checkInteractable() {
    if(map.find(i => i.id == player.room).interactables[player.facing]){
       //do stuff
        txt.innerHTML= "interactable";//remove this
    }
}
function turnLeft() {
    //iterate through array instead
    //player.facing = map.find(i => i.id == player.room).dir[player.facing + 1];//+1 wont work because dir holds an object

    if (player.facing === "n") {
        player.facing = "w";
        updateView();
    }else if (player.facing === "w") {
        player.facing = "s";
        updateView();
    }else if (player.facing === "s") {
        player.facing = "e";
        updateView();
    }else if (player.facing === "e") {
        player.facing = "n";
        updateView();
    };
};
function turnRight() {
    if (player.facing === "n") {
        player.facing = "e";
        updateView();
    }else if (player.facing === "e") {
        player.facing = "s";
        updateView();
    }else if (player.facing === "s") {
        player.facing = "w";
        updateView();
    }else if (player.facing === "w") {
        player.facing = "n";
        updateView();
    };
}
function forward() {
    if(map.find(i => i.id == player.room).dir[player.facing]){
        if(map.find(i => i.id == player.room).dir[player.facing] != 0){
            player.room = map.find(i => i.id == player.room).dir[player.facing];
            updateView();
        }
    }else txt.innerHTML="not found";
}
function back(){
    //if(map.find(i => i.id == player.room)[reverseDir(player.facing)]){ //fix this
        //player.room = map.find(i => i.id == player.room)[reverseDir(player.facing)];
        updateView();
    //}else txt.innerHTML="not found";
}
function reverseDir(dir) {
   var rev = {"n":"s", "s":"n", "e":"w", "w":"e"}
   return rev.dir;
}
var player = {
    room:1,
    facing:"n",
    inv:{}
};
var map = [
    {id:1, dir: {n:2, s:0, e:0, w:0}, interactables: {e:"button", w:"button"}},
    {id:2, dir: {n:6, s:1, e:5, w:3}, interactables: {}},
    {id:3, dir: {n:4, s:0, e:2, w:0}, interactables: {}},
    {id:4, dir: {n:0, s:3, e:0, w:0}, interactables: {}},
    {id:5, dir: {n:0, s:0, e:0, w:2}, interactables: {}},
    {id:6, dir: {n:0, s:2, e:0, w:0}, interactables: {}}
]