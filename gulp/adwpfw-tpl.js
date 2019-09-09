const config = require('../../../../gulp-config');
const gulp = require('gulp');

gulp.task('adwpfw-tpl', function () {
	return gulp.src(config.paths.adwpfwTpl.src)
		.pipe(gulp.dest(config.paths.adwpfwTpl.dev))
});