var gulp = require("gulp");
var babel = require("gulp-babel");
var changed = require("gulp-changed");
var mocha = require("gulp-mocha");
var eslint = require("gulp-eslint");

gulp.task("build", ["libs"]);

gulp.task("default", ["watch"]);

gulp.task("libs", function() {
	return gulp.src("libs/**/*.js")
		.pipe(changed("build/libs"))
		.pipe(babel({ presets: [ "es2015-node5", "stage-3" ] }))
		.pipe(gulp.dest("build/libs"))
	;
});

gulp.task("lint", function() {
	return gulp.src("libs/**/*.js")
		.pipe(eslint())
		.pipe(eslint.formatEach("compact", process.stderr))
		.pipe(eslint.fatalAfterError())
	;
});

gulp.task("build-tests", function() {
	return gulp.src("test/**/*.js")
		.pipe(changed("build/test"))
		.pipe(babel({ presets: [ "es2015-node5", "stage-3" ] }))
		.pipe(gulp.dest("build/test"))
	;
});

gulp.task("test", ["libs", "build-tests"], function() {
	var options = process.env.MOCHA_REPORTER != "disable" ? { reporter: "nyan" } : new Object();
	process.env.NODE_ENV = "test";
	return gulp.src("build/test/**/*.js", { read: false })
		.pipe(mocha(options))
		.once("end", process.exit)
	;
});

gulp.task("watch", ["libs"], function() {
	return gulp.watch("libs/**/*.js", ["libs"]);
});
