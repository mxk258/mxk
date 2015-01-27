/**
 * Created by kun on 2015/1/22.
 */
var exec = require("child_process").exec;
var querystring = require("querystring");

function start(response, postData) {
    console.log("Request handler 'start' was called.");
    //exec用来执行一个shell命令

    var oBody = '<!DOCTYPE html>' +
        '<html>' +
        '<head lang="en">' +
        '<meta charset="UTF-8">' +
        '<title></title>' +
        '</head>' +
        '<body>' +
        '<form action="/upload" method="post">' +
            '<textarea name="text"rows="20" cols="60"></textarea>' +
            '<input type="submit" vlaue="Submit Text" />' +
        '</form>' +
        '</body>' +
        '</html>';
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(oBody);
    response.end();
}

function upload(response, postData) {
    console.log("Request handler 'upload' was called.");
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("You've sent: " + querystring.parse(postData).text);
    response.end();
}

exports.start = start;
exports.upload = upload;
