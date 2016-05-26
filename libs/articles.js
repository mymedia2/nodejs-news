var db = require("./db");

export async function list(ctx) {
	ctx.body = await db.ArticleModel.find();
}

export function post(ctx) {
	ctx.status = 501;
}

export function get(ctx, next) {
	ctx.status = 501;
}

export function update(ctx) {
	ctx.status = 501;
}

export function delete_(ctx) {
	ctx.status = 501;
}
