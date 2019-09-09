const config = require('../../../../gulp-config');
const gulp = require('gulp');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const rename = require('gulp-rename');
const path = require('path');

gulp.task('svg', function () {
	return gulp.src(config.paths.svg.src)
		.pipe(svgmin(function (file) {
			const prefix = path.basename(file.relative, path.extname(file.relative));
			return {
				plugins: [{
					cleanupIDs: {
						prefix: prefix + '-ico',
						minify: true
					}
				}]
			};
		})) // 1
		.pipe(gulp.dest(config.paths.svg.prod)) // 2
		.pipe(svgstore()) // 3
		.pipe(rename(config.names.svgSprite))
		.pipe(gulp.dest(config.paths.svg.prod)); // 4
});