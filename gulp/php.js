import gulp from 'gulp';
import phpMinify from '@cedx/gulp-php-minify';

export default ({src, dest, base}) => gulp.src(src, {base, read: false}).pipe(phpMinify()).pipe(gulp.dest(dest));
