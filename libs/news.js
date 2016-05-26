var app = new (require("koa"))();
var router = require("koa-router")();
var articles = require("./articles");

router
	.get("/articles", articles.list)
	.post("/articles", articles.post)
	.get("/articles/:id", articles.get)
	.put("/articles/:id", articles.update)
	.del("/articles/:id", articles.delete_)
;

app
	.use(router.routes())
//	.use(router.allowedMethods())
	.listen(8080)
;
