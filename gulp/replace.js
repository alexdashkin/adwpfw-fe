import gulp from 'gulp';
import replace from 'gulp-replace';

export default ({src, dest, from, to}) => gulp.src(src).pipe(replace(from, to)).pipe(gulp.dest(dest));
