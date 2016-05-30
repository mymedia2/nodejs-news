var http = require("http");
var ws = require("ws");
var Koa = require("koa");
var Router = require("koa-router");
var bodyParser = require("koa-bodyparser");
var jsonFormater = require("koa-json");
var logger = require("koa-logger");
var articles = require("./articles");
var auth = require("./auth");
var config = require("./config");
var hacks = require("./hacks");
var io = require("./io");

var router = new Router()
	.get("/articles", articles.list)
	.post("/articles", articles.post)
	.get("/articles/:id", articles.get)
	.put("/articles/:id", articles.update)
	.del("/articles/:id", articles.delete_)
	.post("/authorization", auth.getToken)
;

var app = new Koa()
	.use(logger())
	.use(bodyParser())
	.use(auth.bearer())
	.use(jsonFormater({ pretty: config.get("prettyJSON"), param: "debug" }))
	.use(router.routes())
;

hacks.fixKoaContext(app.context);	// TODO: make it as midleware
var httpServer = http.createServer(app.callback()).listen(config.get("port"));
io.socketServer.obj = new ws.Server({ server: httpServer });
