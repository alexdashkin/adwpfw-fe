const gulp = require('gulp');

require('./gulp/clean');
require('./gulp/styles');
require('./gulp/scripts');
require('./gulp/copy');
require('./gulp/replace');
require('./gulp/version');
require('./gulp/zip');
require('./gulp/s3');

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
