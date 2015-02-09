/*
 * GET home page.
 */

/*exports.index = function(req, res){
 res.render('index', { title: 'Express' });
 };*/

module.exports = function (app) {
    app.get("/", function (req, res) {
        res.render("index", {title: "Express"});
    });
    app.get("/reg", function (req, res) {
        res.render("reg", {title: "注册"});
    });
    app.post("/reg", function (reg, res) {
        //...
    });
    app.get("login", function (req, res) {
        res.render("login", {title: "登录"});
    });
    app.post("login", function (res, req) {

    });
    app.get("/post", function (res, req) {
        res.render("post", {title: "发表"});
    });
    app.post("/post", function (res, req) {

    });
    app.get("/logout", function (res, req) {

    });
};