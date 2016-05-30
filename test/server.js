var fs = require("fs");
var request = require("supertest");

describe("Server API", () => {
	var testData = JSON.parse(fs.readFileSync(__dirname + "/../../test/data.json", "utf-8"));
	before(async () => {
		var config = require("../libs/config");
		var app = require("../libs/news.js");
		request = await request("http://localhost:" + config.get("port"));
		var db = await require("mongodb").MongoClient.connect(config.get("db:uri"));
		await db.collection("articles").remove();
		await db.collection("articles").insertMany(testData.articles.map(el => Object.assign(new Object(), el)));
		await db.collection("users").remove();
//		await db.collection("users").insertMany(testData.users.map(el => Object.assign(new Object(), el)));
		await db.close();
	});

	describe("on request GET /articles", () => {
		it("respond with json", done => {
			request
				.get("/articles")
				.expect("Content-Type", /json/)
				.expect(200)
				.end(done)
			;
		});

		describe("with public access", () => {
			var articles = testData.articles
				.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
				.filter(el => !el.invisible)
				.map(el => new Object({
					id: el._id,
					title: el.title,
					text: el.text,
					author: el.author,
					createdAt: el.createdAt,
					modifiedAt: el.modifiedAt,
					modifiedCounter: el.modifiedCounter
				}))
			;
			it("returns 10 first visible articles", done => {
				request
					.get("/articles")
					.expect(200)
					.expect({
						skiped: 0,
						total: articles.length,
						articles: articles.slice(0, 10)
					})
					.end(done)
				;
			});
			for (var i = 0; i < articles.length; i++) {
				it("skips "+i+" articles from beginning if passed the parameter skip="+i, (i => {
					return done => {
						request
							.get("/articles?skip="+i)
							.expect(200)
							.expect({
								skiped: i,
								total: articles.length,
								articles: articles.slice(i, i + 10)
							})
							.end(done)
						;
					}
				})(i));
			}
			for (var i = 0; i < articles.length; i++) {
				it("returns only "+i+" articles if passed the parameter limit="+i, (i => {
					return done => {
						request
							.get("/articles?limit="+i)
							.expect(200)
							.expect({
								skiped: 0,
								total: articles.length,
								articles: articles.slice(0, i)
							})
							.end(done)
						;
					}
				})(i));
			}
		});
	});
});
