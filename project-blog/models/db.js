/**
 * Created by kun on 2015/2/5.
 * 设置数据库名、数据库地址和数据库端口，创建了一个数据库连接实例，并通过module.exports导出该实例
 */
var settings = require("../settings.js");
var Db = require("mongodb").Db;
var Connection = require("mongodb").Connection;
var Server = require("mongodb").Server;
module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT), {safe: true});
