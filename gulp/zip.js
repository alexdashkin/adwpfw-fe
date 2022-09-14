import gulp from 'gulp';
import rename from 'gulp-rename';
import gulpZip from 'gulp-zip';

export default ({src, dest, name}) => {
    return gulp.src(src, {base: '.'})
        .pipe(rename(path => path.dirname = path.dirname.replace('prod', name)))
        .pipe(gulpZip(name + '.zip'))
        .pipe(gulp.dest(dest))
};
