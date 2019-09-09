const config = require('../../../../gulp-config');
const gulp = require('gulp');
const replace = require('gulp-replace');

gulp.task('replace', function () {
	return gulp.src(config.paths.replace)
		.pipe(replace(config.names.replace.from, config.names.replace.to))
		.pipe(gulp.dest(config.paths.dist));
});