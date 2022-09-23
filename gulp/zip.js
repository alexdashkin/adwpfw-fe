import gulp from 'gulp';
import rename from 'gulp-rename';
import gulpZip from 'gulp-zip';

export default ({src, dest, root, name}) => {
    return gulp.src(src, {base: '.'})
        .pipe(rename(path => path.dirname = path.dirname.replace(root, name)))
        .pipe(gulpZip(name + '.zip'))
        .pipe(gulp.dest(dest));
};
