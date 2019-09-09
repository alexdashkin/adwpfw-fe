const config = require('../gulp-config');
const gulp = require('gulp');

gulp.task('copy', function () {
	return gulp.src(config.paths.copy.src, {base: config.paths.src, follow: true})
		.pipe(gulp.dest(config.paths.dist))
});