/**
 * Created by kun on 2015/1/22.
 */
function route(pathname){
    console.log("About to route a request for " + pathname);
}
exports.route = route;

//program.js
var math = require("math");
exports.increment = function(val){
    return math.add(val, 1);
};