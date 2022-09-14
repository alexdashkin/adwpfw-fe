import gulp from 'gulp';
import rename from 'gulp-rename';

export default ({src, dest, newName}) => gulp.src(src)
    .pipe(rename(path => path.basename = newName))
    .pipe(gulp.dest(dest));