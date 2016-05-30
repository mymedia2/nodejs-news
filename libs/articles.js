var db = require("./db");
var io = require("./io");

export async function list(ctx) {
	ctx
		.defaultArgs({ show_all: false, skip: 0, limit: 10 })
		.assert(!ctx.args.show_all || ctx.user, 403)
		.assert(ctx.args.skip >= 0, 400, "Parameter skip must be non-negative")
		.assert(ctx.args.limit >= 0, 400, "Parameter limit must be non-negative")
	;
	var condition = ctx.args.show_all ? new Object() : { invisible: false };
	var result = ctx.args.limit == 0 ? new Array() : await db.ArticleModel
		.find(condition)
		.select("id title author text createdAt modifiedAt modifiedCounter"
		        + (ctx.args.show_all ? " invisible" : ""))
		.sort("-createdAt")
		.skip(ctx.args.skip)
		.limit(ctx.args.limit)
	;
	ctx.body = {
		skiped: Number(ctx.args.skip),
		total: await db.ArticleModel.count(condition),
		articles: result
	};
}

export async function post(ctx) {
	ctx
		.assert(ctx.user, 403)
		.assert(ctx.args.title, 400, "Field title is required")
		.assert(ctx.args.text, 400, "Field text is required")
	;
	var article = new db.ArticleModel({
		title: ctx.args.title,
		author: ctx.user.login,
		text: ctx.args.text
	});
	var result = await article.save();
	ctx.status = 201;
	ctx.body = result.id;
	io.broadcast({ event: "new", article: result });
}

export async function get(ctx) {
	try {
		ctx.body = await db.ArticleModel.findById(ctx.args.id);
	} catch (CastError) {
		ctx.throw(404);
	}
	ctx
		.assert(ctx.body, 404)
		.assert(!ctx.body.invisible || user, 404)
	;
}

export async function update(ctx) {
	ctx
		.assert(ctx.user, 403)
		.assert(ctx.args.id, 400, "Field id is required")
		.assert(ctx.args.title != "", 400, "Field title cant be empty")
	;
	var updater = new Object();
	if (ctx.args.title) {
		updater.title = ctx.args.title;
	}
	if (ctx.args.text) {
		updater.text = ctx.args.text;
	}
	try {
		ctx.body = await db.ArticleModel.findByIdAndUpdate(ctx.args.id, updater);
	} catch (CastError) {
		ctx.throw(404);
	}
	ctx.assert(ctx.body, 404);
	Object.assign(ctx.body, updater);
	io.broadcast({ event: "update", article: ctx.body });
}

export async function delete_(ctx) {
	ctx
		.assert(ctx.user, 403)
		.assert(ctx.args.id, 400, "Field id is required")
	;
	try {
		var result = await db.ArticleModel.findByIdAndUpdate(ctx.args.id, { invisible: true });
	} catch (CastError) {
		ctx.throw(404);
	}
	ctx.assert(result, 404);
	ctx.status = 200;
	io.broadcast({ event: "remove", article: { id: result.id } });
}
