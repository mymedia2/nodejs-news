var mongoose = require("mongoose");
var config = require("./config");

mongoose.connect(config.get("db:uri"));

mongoose.connection.on("error", err => console.log("Db error: ", err.message));
mongoose.connection.once("open", () => console.log("Connected to db"));

var User = new mongoose.Schema({
	login: { type: String, required: true, unique: true },
	passw: { type: String, required: true }
});

var Article = new mongoose.Schema({
	title: { type: String, required: true },
	author: { type: String, required: true },
	text: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	modifiedAt: { type: Date, default: Date.now },
	modifiedCounter: { type: Number, default: 0 },
	invisible: {type: Boolean, default: false }
});
Article.set("toJSON", {
	transform: function(doc, ret, options) {
		ret.id = ret._id;
		delete ret._id;
		delete ret.__v;
	}
});

export var ArticleModel = mongoose.model("Article", Article);
