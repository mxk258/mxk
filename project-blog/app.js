
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');
var MongoStore = require("connect-mongo")(express);
var settings = require("./settings.js");

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);  //设置端口为process.env.PORT或3000
app.set('views', path.join(__dirname, 'views'));    //设置views文件夹为存放视图文件的目录，即存放模板文件的地方，_dirname为全局变量，存储当前正在执行的脚本所在的目录
app.set('view engine', 'ejs');  //设置视图木板引擎为ejs
app.use(express.favicon()); //connect内建的中间件，使用默认的favicon图标，如果想使用自己的图标，须改为app.use(express.favicon(_dirname + '/public/images/favicon.icon'));这里我们把自定义的favicon.ico放到/public/images文件夹下
app.use(express.logger('dev')); //connect内建的中间件，在开发环境下使用，在终端显示简单的日志
app.use(express.json());    //connect内建的中间件，用来解析请求体
app.use(express.urlencoded());
app.use(express.methodOverride());  //connect内建的中间件，可以协助处理POST请求，伪装PUT、DELETE和其他HTTP方法
app.use(app.router);    //调用路由解析的规则
app.use(express.static(path.join(__dirname, 'public')));    //connect内建的中间件，将根目录下的public文件设置为存放image\css\js等静态文件的目录

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/**
 *会话支持
 * express.cookieParser()是Cookie解析的中间件。express.session()则提供会话支持，secret用来防止篡改Cookie，
 * key的值为Cookie的名字，通过设置Cookie的maxAge值来设定Cookie的生存期，这里我们设置Cookie的生存期为30天，
 * 设置它的store参数为MongoStore实例，把会话消息存储到数据库中，以避免丢失。
 */
app.use(express.cookieParser());
app.use(express.session({
    secret:settings.cookieSecret,
    key:settings.db,//cookie name
    cookie:{maxAge:1000 * 60 * 60 *24 * 30}, //30 days
    store: new MongoStore({
        db: settings.db
    })
}));

//app.get('/', routes.index); //路由控制器，如果用户访问/(主页)，则由routes.index来处理
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

routes(app);
