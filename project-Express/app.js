
/**
 * Module dependencies.
 */

var express = require('express');
var session =require("express-session");    //如果要使用session，需要单数包含这个模块
var cookieParser = require("cookie-parser");    //如果要使用cookie，需要显示包含这个模块
var RedisStore = require("connect-redis")(session);
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//设置Cookie
app.use(cookieParser("xiaocc_"));
//设置session
app.use(session({
    store: new RedisStore({
        host: "127.0.0.1",
        port: 3001,
        db: "blog"
    }),
    resave: false,
    saveUninitialized: false,
    secret: "keyboard cat"
}));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
