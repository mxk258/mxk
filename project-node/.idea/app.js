/**
 * Created by kun on 2015/1/22.
 */
var server = require("./server.js");
var router = require("./router.js");
server.start(router.route);