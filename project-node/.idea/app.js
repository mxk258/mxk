/**
 * Created by kun on 2015/1/22.
 */
var server = require("./server");//http服务
var router = require("./router");//路由
var requestHandlers = require("./requestHandlers");
var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;

server.start(router.route, handle);