const s3params = require('../s3');
const gulp = require('gulp');
const merge = require('merge-stream');

gulp.task('s3', () => {
	const streams = [];

	s3params.forEach(item => {
		const s3 = require('gulp-s3-upload')(item.credentials);
		streams.push(
			gulp.src(item.file)
				.pipe(s3({
					Bucket: item.bucket,
					ACL: item.acl
				}))
		);
	});

	return merge(streams);
});
