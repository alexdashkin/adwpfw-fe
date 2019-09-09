const config = require('../gulp-config');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');

gulp.task('html', function () {
	return gulp.src(config.paths.html.src)
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest(config.paths.html.prod))
});