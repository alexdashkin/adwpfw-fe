const config = require('../../../../gulp-config');
const gulp = require('gulp');
const pug = require('gulp-pug');
const rename = require('gulp-rename');

gulp.task('pug', function () {
	return gulp.src(config.paths.pug.src)
		.pipe(pug({
			// debug: true
		}))
		.pipe(rename(function (path) {
			path.extname = ".html";
		}))
		.pipe(gulp.dest(config.paths.pug.prod))
});