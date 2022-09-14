import gulp from 'gulp';
import copy from './copy.js';

export default config => gulp.watch(config.src, () => copy(config));

