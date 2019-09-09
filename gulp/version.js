const config = require('../gulp-config');
const gulp = require('gulp');
const replace = require('gulp-replace');
const version = require('./_version');

gulp.task('version', function () {
	const versions = version();
	return gulp.src(config.paths.version, {base: config.paths.src})
		.pipe(replace(versions.oldVersion, versions.newVersion))
		.pipe(gulp.dest(config.paths.src));
});
