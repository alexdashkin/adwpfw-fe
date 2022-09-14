import gulp from 'gulp';
import ftp from 'vinyl-ftp';

export default ({file, dest, credentials}) => {
    const conn = ftp.create(credentials);

    return gulp.src(file)
        .pipe(conn.dest(dest))
};
