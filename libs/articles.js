var db = require("./db");

export async function list(ctx) {
	ctx.body = await db.ArticleModel.find();
}

export async function post(ctx) {
	var article = new db.ArticleModel({
		title: ctx.request.body.title,
		author: "admin",
		text: ctx.request.body.text
	});
	await article.save();
	ctx.status = 200;
}

export function get(ctx) {
	ctx.status = 501;
}

export function update(ctx) {
	ctx.status = 501;
}

export function delete_(ctx) {
	ctx.status = 501;
}
