const config = require('../../../../gulp-config');
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const mqpacker = require('css-mqpacker');
const notify = require('gulp-notify');
const tildeImporter = require('node-sass-tilde-importer');

const sassOptions = {
	errLogToConsole: true,
	outputStyle: 'expanded',
	importer: tildeImporter
};

const postCssOpts = [
	autoprefixer(),
	mqpacker
];

['admin', 'front'].forEach(type => {
	gulp.task('styles:dev:' + type, function () {
		return gulp.src(config.paths.styles[type].src)
			.pipe(sourcemaps.init())
			.pipe(sass(sassOptions).on('error', notify.onError(function (error) {
				return 'Problem file : ' + error.message;
			})))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(config.paths.styles[type].dev));
	});

	gulp.task('styles:prod:' + type, function () {
		return gulp.src(config.paths.styles[type].src)
			.pipe(sass(sassOptions).on('error', notify.onError(function (error) {
				return 'Problem file : ' + error.message;
			})))
			.pipe(postcss(postCssOpts))
			.pipe(cssnano({outputStyle: 'compressed', discardComments: {removeAll: true}}))
			.pipe(gulp.dest(config.paths.styles[type].prod));
	});
});

gulp.task('styles:dev',
	gulp.parallel(
		'styles:dev:admin',
		'styles:dev:front',
	),
);

gulp.task('styles:prod',
	gulp.parallel(
		'styles:prod:admin',
		'styles:prod:front',
	),
);
