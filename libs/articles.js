var db = require("./db");

export async function list(ctx) {
	await db.ArticleModel.find(function(err, articles) {
		if (err) {
			console.log("Err: ", err.message);
			return;
		}
		ctx.body = JSON.stringify(articles, "", 4);
	});
}

export function post(ctx) {
	ctx.body = "Not implemented";
}

export function get(ctx, next) {
	ctx.body = "Not implemented";
}

export function update(ctx) {
	ctx.body = "Not implemented";
}

export function delete_(ctx) {
	ctx.body = "Not implemented";
}
