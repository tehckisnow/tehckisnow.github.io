console.log('success!');
var isDone = false;
var num = 0;
var str = '';
var list1 = [1, 2, 3];
var list2 = [];
list2.push(7);
var x;
x = ['hi!', 11];
var Color;
(function (Color) {
    Color[Color["red"] = 0] = "red";
    Color[Color["blue"] = 1] = "blue";
    Color[Color["green"] = 2] = "green";
})(Color || (Color = {}));
;
var c = Color.red;
var colorName = Color[2];
var notSure = 4;
notSure = "string!";
//notSure = 72;
var stringLength = notSure.length;
console.log('stringLength =', stringLength);
function warning() {
    console.log('warning!');
}
;
function newThing(alive, name, age) {
    var thing = {};
    //thing.live = alive;
}
;
function greet(person) {
    console.log(person);
}
;
greet('3');
