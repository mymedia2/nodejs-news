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

export function get(ctx) {
	ctx.status = 501;
}

export function update(ctx) {
	ctx.status = 501;
}

export async function delete_(ctx) {
	await db.ArticleModel.findByIdAndUpdate(ctx.params.id, { invisible: true });
	ctx.status = 200;
}
