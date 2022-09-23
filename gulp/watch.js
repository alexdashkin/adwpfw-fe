import gulp from 'gulp';

export default ({src, dest, base}) => gulp.watch(src).on('change', path => gulp.src(path, {base, follow: true}).pipe(gulp.dest(dest)));
