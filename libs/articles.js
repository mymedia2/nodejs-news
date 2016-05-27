var db = require("./db");

export async function list(ctx) {
	var params = Object.assign({ showAll: false, skip: 0, limit: 10 }, ctx.query);
	ctx.assert(params.skip >= 0, 400, "Parameter skip must be non-negative");
	ctx.assert(params.limit >= 0, 400, "Parameter limit must be non-negative");
	ctx.body = await db.ArticleModel
		.find(params.showAll ? new Object() : { invisible: false })
		.sort("-createdAt")
		.skip(params.skip)
		.limit(params.limit)
		.select(params.showAll ? "" : "-invisible")
	;
}

export async function post(ctx) {
	var article = new db.ArticleModel({
		title: ctx.request.body.title,
		author: "admin",
		text: ctx.request.body.text
	});
	await article.save();
	ctx.status = 201;
}

export async function get(ctx) {
	var result = await db.ArticleModel.findById(ctx.params.id);
	ctx.assert(result, 404);
	ctx.body = result;
}

export async function update(ctx) {
	var result = await db.ArticleModel.findByIdAndUpdate(ctx.params.id,
	                                                     ctx.request.body);
	ctx.assert(result, 404);
	ctx.body = result;
}

export async function delete_(ctx) {
	var result = await db.ArticleModel.findByIdAndUpdate(ctx.params.id,
	                                                     { invisible: true });
	ctx.assert(result, 404);
	ctx.status = 200;
}
