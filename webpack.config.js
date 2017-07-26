/**
 * Created by GIISO on 2017/5/8.
 */
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports={
    entry:{
        main:'./src/main.js'
    },
    output:{
        path:path.resolve(__dirname, './dist'),
        filename:'[name].bundle.js'
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                loader:'babel-loader?{presets:["latest"]}',
                exclude: /node_modules/
            },
            {
                test:/\.html$/,
                loader:'html-loader'
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                loader: [
                    'url-loader?limit=10000&name=images/[name].[ext]',
                    'image-webpack-loader'
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    name: 'font/[name].[ext]'
                }
            },
            {
                test:/\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins:[
                                    require('autoprefixer')(),
                                    require('cssnano')()
                                ]
                            }
                        }
                    ]
                })
            },
            {
                test:/\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins:[
                                    require('autoprefixer')(),
                                    require('cssnano')()
                                ]
                            }
                        },
                        'less-loader'
                    ]
                })
            }
      ]
    },
    devtool: '#source-map',
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.js'
        }
    },
    plugins:[

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),

        new ExtractTextPlugin("[name].bundle.css")
    ]
};
