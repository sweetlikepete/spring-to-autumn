/*
    eslint
    import/unambiguous: 0,
    import/no-commonjs: 0,
    node/exports-style: 0,
    @typescript-eslint/no-var-requires: 0,
    max-lines-per-function: 0,
    require-unicode-regexp: 0
*/


const path = require("path");

const AssetsPlugin = require("assets-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const autoPrefixer = require("autoprefixer");
const fontSmoothing = require("postcss-font-smoothing");
const fontVariant = require("postcss-font-variant");
const imageSet = require("postcss-image-set-polyfill");


const browsers = [
    "last 2 chrome versions",
    "last 2 edge versions",
    "last 2 firefox versions",
    "last 2 safari versions",
    "last 2 ios_saf versions",
    "last 1 android versions",
    "last 2 and_chr versions",
    "last 2 and_ff versions",
    "last 2 opera versions"
];


const config = function(env){

    const base = process.cwd();
    const platform = env.platform === "web" ? "web" : "node";

    return {
        cache: true,
        devtool: !env.production && platform === "web" ? "source-maps" : "none",
        entry: platform === "web" ? "./src/app" : "./src/server",
        externals: [
            nodeExternals({
                whitelist: [/^babel-plugin-universal-import/]
            })
        ],
        mode: env.production ? "production" : "development",
        module: {
            rules: [
                {
                    test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                    use : [
                        {
                            loader : "file-loader",
                            options : {
                                name : "[name].[hash].[ext]",
                                outputPath: "../client",
                                publicPath: "/static/"
                            }
                        }
                    ]
                },
                {
                    test: /\.(gif|png|jpe?g|svg)$/i,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name : "[name].[hash].[ext]",
                                outputPath: "../client",
                                publicPath: "/static/"
                            }
                        },
                        {
                            loader: "image-webpack-loader"
                        }
                    ]
                },
                {
                    test: /\.(html)$/,
                    use: {
                        loader: "html-loader",
                        options: {
                            attrs: [":data-src"],
                            interpolate: true,
                            minimize: true
                        }
                    }
                },
                {
                    test : /\.scss$/,
                    use : [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: "/static/"
                            }
                        },
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: false
                            }
                        },
                        {
                            loader : "clean-css-loader",
                            options : {
                                compatibility : "ie11",
                                level : {
                                    1 : {
                                        specialComments : 0
                                    }
                                }
                            }
                        },
                        {
                            loader : "postcss-loader",
                            options : {
                                plugins : [
                                    autoPrefixer({
                                        browsers : browsers,
                                        flexbox : "no-2009"
                                    }),
                                    fontSmoothing,
                                    fontVariant,
                                    imageSet
                                ]
                            }
                        },
                        {
                            loader : "sass-loader",
                            options : {
                                includePaths : [
                                    "src",
                                    "node_modules"
                                ]
                            }
                        }
                    ]
                },
                {
                    exclude: /node_modules/,
                    test: /\.js$/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            babelrc: false,
                            comments: false,
                            plugins: [
                                "@babel/plugin-syntax-dynamic-import",
                                "@babel/plugin-proposal-class-properties"
                            ],
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        targets: {
                                            esmodules: true
                                        }
                                    }
                                ]
                            ]
                        }
                    }
                }
            ]
        },
        output: {
            chunkFilename: platform === "web" ? "[chunkhash:8].js" : "[name].js",
            filename: platform === "web" ? "[chunkhash:8].js" : "[name].js",
            hashDigest: "base64",
            path: path.resolve(base, platform === "web" ? "build/client" : "build/server"),
            publicPath: "/static/"
        },
        plugins: platform === "web" ? [
            new AssetsPlugin({
                filename: "build/assets.json",
                fullpath: true
            }),
            new webpack.optimize.ModuleConcatenationPlugin(),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.HashedModuleIdsPlugin(),
            new MiniCssExtractPlugin({
                chunkFilename: "[chunkhash:8].css",
                filename: "[chunkhash:8].css"
            })
        ] : [],
        resolve: {
            extensions: [".js"],
            modules: [
                "node_modules",
                "src"
            ],
            symlinks: false
        },
        target: platform
    };

};

module.exports = config;
