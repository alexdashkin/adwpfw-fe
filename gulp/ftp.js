const params = require('../../../../ftp');
const gulp = require('gulp');
const merge = require('merge-stream');

gulp.task('ftp', () => {
	const streams = [];

	params.forEach(item => {
		const ftp = require('vinyl-ftp');
		const conn = ftp.create(item.credentials);

		streams.push(
			gulp.src(item.file)
				.pipe(conn.dest(item.dest))
		);
	});

	return merge(streams);
});
