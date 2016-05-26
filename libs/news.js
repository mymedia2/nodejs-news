var app = new (require("koa"))();
var router = require("koa-router")();
var bodyParser = require("koa-bodyparser");
var jsonFormater = require("koa-json");
var articles = require("./articles");

router
	.get("/articles", articles.list)
	.post("/articles", articles.post)
	.get("/articles/:id", articles.get)
	.put("/articles/:id", articles.update)
	.del("/articles/:id", articles.delete_)
;

app
	.use(bodyParser())
	.use(jsonFormater({ pretty: false, param: "debug" }))
	.use(router.routes())
	.listen(8080)
;
