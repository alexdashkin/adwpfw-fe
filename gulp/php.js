const config = require('../gulp-config');
const gulp = require('gulp');
const {phpMinify} = require('@cedx/gulp-php-minify');

gulp.task('php', function () {
	return gulp.src(config.paths.php.src, {base: config.paths.src})
		.pipe(phpMinify())
		.pipe(gulp.dest(config.paths.dist))
});