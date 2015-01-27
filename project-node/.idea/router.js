/**
 * Created by kun on 2015/1/22.
 * 路由：对于不同的URL请求，服务器进行不同的处理
 */
function route(handler, pathname){
    console.log("About to route a request for " + pathname);
    if(typeof handler[pathname] === 'function'){
        handler[pathname]();
    }else{
        console.log("No request handler found for " + pathname);
    }
}
exports.route = route;