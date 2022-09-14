import gulp from 'gulp';

export default ({src, base, dest}) => gulp.src(src, {base, follow: true}).pipe(gulp.dest(dest));
