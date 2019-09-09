const config = require('../gulp-config');
const gulp = require('gulp');
const rename = require('gulp-rename');
const zip = require('gulp-zip');
const version = require('./_version');

gulp.task('zip', function () {
	const versions = version();

	return gulp.src(config.paths.zip, {base: '.'})
		.pipe(rename(function (path) {
			path.dirname = path.dirname.replace('dist', config.names.file);
		}))
		.pipe(zip(config.names.file + '.zip'))
		.pipe(gulp.dest('.'))
		.pipe(rename(config.names.file + '-' + versions.oldVersion + '.zip'))
		.pipe(gulp.dest('.'));
});