const config = require('../gulp-config');
const gulp = require('gulp');

gulp.task('watch:styles', function () {
	return gulp.watch(config.paths.styles.src,
		gulp.series('styles:dev'));
});

gulp.task('watch:scripts', function () {
	return gulp.watch(config.paths.scripts.src,
		gulp.series('scripts:dev'));
});

gulp.task('watch', gulp.parallel('watch:styles', 'watch:scripts'));