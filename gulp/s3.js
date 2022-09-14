import gulp from 'gulp';
import uploader from 'gulp-s3-upload';

export default ({file, bucket, credentials}) => {
    const s3 = uploader(credentials);

    return gulp.src(file)
        .pipe(s3({
            Bucket: bucket,
            ACL: 'public-read'
        }));
};
