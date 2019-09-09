const gulp = require('gulp');

const path = './node_modules/@alexdashkin/adwpfw/gulp/';

require(path + 'clean');
require(path + 'styles');
require(path + 'scripts');
require(path + 'copy');
require(path + 'adwpfw-tpl');
require(path + 'replace');
require(path + 'version');
require(path + 'zip');
require(path + 's3');

gulp.task('prod',
	gulp.series(
		'clean',
		gulp.parallel(
			'styles:prod',
			'scripts:prod',
			'copy',
			'replace',
		),
		'zip'
	)
);

gulp.task('prod-full',
	gulp.series(
		'prod',
		's3',
	)
);
