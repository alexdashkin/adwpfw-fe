import gulp from 'gulp';
import webpack from 'webpack-stream';
import named from 'vinyl-named-with-path';
import TerserPlugin from 'terser-webpack-plugin';

export default ({src, dest}, type) => {
    let webpackConfig = {};

    switch (type) {
        case 'dev': {
            webpackConfig = {
                watch: true,
                mode: 'development',
                devtool: 'inline-source-map',
                externals: {
                    jquery: 'jQuery'
                }
            }

            break;
        }
        case 'prod': {
            webpackConfig = {
                mode: 'production',
                optimization: {
                    minimizer: [
                        new TerserPlugin({
                            terserOptions: {
                                output: {
                                    comments: false,
                                },
                            },
                        }),
                    ],
                },
                externals: {
                    jquery: 'jQuery'
                }
            }
        }
    }

    return gulp.src(src)
        .pipe(named())
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(dest));
};
