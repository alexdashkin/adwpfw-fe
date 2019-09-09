const config = require('../gulp-config');
const gulp = require('gulp');
const del = require('del');

gulp.task('clean', function () {
	return del([config.paths.dist]);
});