/**
 * Created by kun on 2015/1/22.
 * 路由：对于不同的URL请求，服务器进行不同的处理
 */
function route(handler, pathname, response, postData) {
    console.log("About to route a request for " + pathname);
    if (typeof handler[pathname] === 'function') {
        handler[pathname](response, postData);
    } else {
        console.log("No request handler found for " + pathname);
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not found");
        response.end();
    }
}
exports.route = route;