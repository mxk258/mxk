/**
 * Created by kun on 2015/1/27.
 */
/**
 * 处理文件上传
 * @type {exports}
 */
var formidable = require("formidable");
var http = require("http");
var sys = require("sys");

http.createServer(function(req, res){
    if(req.url == "/upload" && req.method.toLowerCase() == "post"){
        //parse a file upload
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files){
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.write("received upload:\n\n");
            res.end(sys.insect({fields:fields, files: files}));
        });
        return;
    }
    //showa file uploadform
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end(
        '<html>' +
        '<head>' +
        '<meta charset="UTF-8">' +
        '<title>Document</title>' +
        '</head>' +
        '<body>' +
        '<form action="/upload" enctype="multipart/form-data" method="post">' +
        '<input type="text" name="title" />' +
        '<input type="file" name="upload" multiple="multiple" />' +
        '<input type="submit" vlaue="Upload" />' +
        '</form>' +
        '</body>' +
        '</html>'
    );
}).listen(8889);
