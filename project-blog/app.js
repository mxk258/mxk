var path = require("path"); //本模块包含一套用于处理和转换文件路径的工具集。几乎所有的方法仅对字符串进行转换， 文件系统是不会检查路径是否真实有效的。
var express = require("express");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");    //解析 Cookie头和填充 req.cookies对象键控的cookie的名称
var bodyParser = require("body-parser");    //js身体解析中间件
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var flash = require("connect-flash");
var multer = require("multer");
var routes = require("./routes/index");
var settings = require("./settings");
var fs = require("fs");
var accessLog = fs.createWriteStream("access.log", {flags: "a"});
var errorLog = fs.createWriteStream("error.log", {flags: "a"});
var app = express();

app.set("port", process.env.PORT || 3000);  //设置端口
app.set("views", path.join(__dirname, "views"));    //设置views文件夹为存放视图文件的目录，即存放模板文件的地方，_dirname为全局变量，存储当前正在执行的脚本所在的目录
app.set("view engine", "ejs");  //设置视图模板引擎为ejs
app.use(favicon(__dirname + "/public/images/favicon.ico")); //connect内建的中间件，使用默认的favicon图标，如果想使用自己的图标，须改为app.use(express.favicon(_dirname + '/public/images/favicon.icon'));这里我们把自定义的favicon.ico放到/public/images文件夹下
app.use(logger("dev")); //connect内建的中间件，在开发环境下使用，在终端显示简单的日志
app.use(logger({stream: accessLog}));
app.use(bodyParser.urlencoded({ extend: false}));
app.use(multer({
    dest: "./public/images",
    rename: function(fieldname, filename){
        return filename;
    }
}));

/*会话支持
 * cookieParser()是Cookie解析的中间件。session()则提供会话支持，secret用来防止篡改Cookie，
 * key的值为Cookie的名字，通过设置Cookie的maxAge值来设定Cookie的生存期，这里我们设置Cookie的生存期为30天，
 * 设置它的store参数为MongoStore实例，把会话消息存储到数据库中，以避免丢失。*/
app.use(cookieParser());
app.use(session({
    secret: settings.cookieSecret,
    key: settings.db,
    cookie:{maxAge: 1000 * 60 * 60 * 24 * 30},
    store: new MongoStore({
        db: settings.db,
        host: settings.host,
        port: settings.port
    })
}));
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
routes(app);
app.use(function(err, req, res, next){
    var meta = "[" + new Date() + "]" + req.url + "\n";
    errorLog.write(meta + err.stack + "\n");
    next();
});
app.listen(app.get("port"), function(){
    console.log("Express server listening on port " + app.get("port"));
});
