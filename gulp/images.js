const config = require('../gulp-config');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const webp = require('gulp-webp');

gulp.task('images', function () {
	return gulp.src(config.paths.images.src)
		.pipe(imagemin({
			optimizationLevel: 3,                        // png
			progressive: true,                     // jpg
			interlaces: true,                     // gif
			svgoPlugins: [{removeViewBox: false}], // svg
			use: [pngquant()]              // png
		}))
		.pipe(gulp.dest(config.paths.images.prod));
});

gulp.task('images2webp', function () {
	return gulp.src(config.paths.images.src)
		.pipe(webp({
			quality: 75,
			sns: 75
		}))
		.pipe(gulp.dest(config.paths.images.prod));
});