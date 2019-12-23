const config = require('../../../../gulp-config');
const gulp = require('gulp');
const jshint = require('gulp-jshint');
const stylish = require('jshint-stylish');
const named = require('vinyl-named');
const TerserPlugin = require('terser-webpack-plugin');
const webpackStream = require('webpack-stream');

['admin', 'front'].forEach(type => {
	gulp.task('scripts:dev:' + type, () => {
		return gulp.src(config.paths.scripts[type].src)
			.pipe(named())
			.pipe(webpackStream({
				mode: 'development',
				devtool: 'inline-source-map',
				externals: {
					jquery: 'jQuery'
				}
			}))
			.pipe(gulp.dest(config.paths.scripts[type].dev));
	});

	gulp.task('scripts:prod:' + type, function () {
		return gulp.src(config.paths.scripts[type].src)
			.pipe(named())
			.pipe(webpackStream({
				mode: 'production',
				optimization: {
					minimizer: [
						new TerserPlugin({
							terserOptions: {
								output: {
									comments: false,
								},
							},
						}),
					],
				},
				externals: {
					jquery: 'jQuery'
				}
			}))
			.pipe(gulp.dest(config.paths.scripts[type].prod));
	});

	gulp.task('scripts:test:' + type, function () {
		return gulp.src(config.paths.scripts[type].src)
			.pipe(jshint({
				esversion: 6
			}))
			.pipe(jshint.reporter(stylish));
	});
});

gulp.task('scripts:dev',
	gulp.series(
		'scripts:dev:admin',
		'scripts:dev:front',
	),
);

gulp.task('scripts:prod',
	gulp.series(
		'scripts:prod:admin',
		'scripts:prod:front',
	),
);
