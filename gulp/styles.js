import gulp from 'gulp';
import webpack from 'webpack-stream';
import named from 'vinyl-named-with-path';
import CssExtractor from 'mini-css-extract-plugin';
import JsRemover from 'webpack-remove-empty-scripts';

export default ({src, dest}, type) => {
    let webpackConfig = {};

    switch (type) {
        case 'dev': {
            webpackConfig = {
                watch: true,
                mode: 'development',
                plugins: [new CssExtractor(), new JsRemover({})],
                devtool: 'inline-source-map',
                module: {
                    rules: [
                        {
                            test: /\.scss$/,
                            use: [
                                CssExtractor.loader,
                                'css-loader',
                                'sass-loader'
                            ]
                        },
                    ],
                },
            }

            break;
        }
        case 'prod': {
            webpackConfig = {
                mode: 'production',
                plugins: [new CssExtractor(), new JsRemover({})],
                module: {
                    rules: [
                        {
                            test: /\.scss$/,
                            use: [
                                CssExtractor.loader,
                                'css-loader',
                                {
                                    loader: 'postcss-loader',
                                    options: {
                                        postcssOptions: {
                                            plugins: [
                                                'autoprefixer',
                                                'css-mqpacker'
                                            ],
                                        }
                                    }
                                },
                                'sass-loader'
                            ]
                        },
                    ],
                },
            }
        }
    }

    return gulp.src(src)
        .pipe(named())
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(dest));
};
