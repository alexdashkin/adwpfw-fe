const config = require('../../../../gulp-config');
const credentials = require('../ftp');
const gulp = require('gulp');
const ftp = require('vinyl-ftp');

gulp.task('ftp', function () {
	const conn = ftp.create(credentials.credentials);
	return gulp.src(config.names.file + '.zip')
		.pipe(conn.dest(credentials.dest))
});
