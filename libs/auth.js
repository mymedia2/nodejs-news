var crypto = require("crypto");
var db = require("./db");

export function bearer() {
	return async function(ctx, next) {
		ctx.user = await db.UserModel.findOne({ token: ctx.request.header.bearer });
		await next();
	};
}

export async function getToken(ctx) {
	ctx
		.assert(ctx.args.grant_type == "password", 400)
		.assert(ctx.args.username, 400, "Username is required")
		.assert(ctx.args.password, 400, "Password is required")
	;
	var user = await db.UserModel.findOne({ login: ctx.args.username });
	if (!user || !user.checkPassword(ctx.args.password)) {
		ctx.throw(403, "Not found user or invalid password");
	}
	if (!user.token) {
		user.token = await crypto.randomBytes(16).toString('hex');
		await user.save();
	}
	ctx.body = {
		access_token: user.token,
		token_type: "bearer"
	};
}
