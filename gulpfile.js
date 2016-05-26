const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const plumber = require('gulp-plumber');
const changed = require('gulp-changed');

gulp.task('build', ['libs']);

gulp.task('default', ['watch']);

gulp.task('libs', function() {
	gulp.src('libs/**/*.js')
		.pipe(plumber())
		.pipe(changed('build'))
		.pipe(babel({
			presets: [
				'es2015-node5',
				'stage-3'
			]
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('lint', function() {
	gulp.src('libs/**/*.js')
		.pipe(eslint())
		.pipe(eslint.formatEach('compact', process.stderr))
		.pipe(eslint.fatalAfterError());
});

gulp.task('test', function() {
  // place code for your default task here
});

gulp.task('watch', ['libs'], function() {
	gulp.watch('libs/**/*.js', ['libs']);
});
