const config = require('../gulp-config');
const gulp = require('gulp');
const rename = require('gulp-rename');

gulp.task('config', function () {
	return gulp.src(config.paths.config.prod)
		.pipe(rename(function (path) {
			path.basename = path.basename.replace('-prod', '');
		}))
		.pipe(gulp.dest(config.paths.dist));
});
