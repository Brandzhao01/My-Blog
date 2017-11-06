const webpack = require('webpack');
const path = require('path');
const srcPath = path.resolve(__dirname, 'src');

var CleanWebpackPlugin = require('clean-webpack-plugin');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        'common/main': [srcPath + '/common/main.js'],
        'common/admin-lib': ['jquery', 'bootstrap', 'BOOTSTRAP_CSS'],
        'common/lib': ['jquery', 'COMMON_LESS']
    },

    output: {
        path: __dirname + '/public',
        filename: '[name].js',
        publicPath: 'http://47.96.0.91/public/',
    },
    resolve: {
        modules: [srcPath, 'node_modules'],
        alias: {
            SRC: srcPath,
            BOOTSTRAP_CSS: 'bootstrap/dist/css/bootstrap.css',
            BOOTSTRAP_TABLE_CSS: 'bootstrap-table/dist/bootstrap-table.css',
            COMMON_LESS: 'SRC/common/common.less'
        }
    },

    module: {
        rules: [{
                test: /\.(jpg|png)$/,
                use: 'url-loader?limit=8192&context=client&name=/img/[name].[ext]'
            },
            {
                test: /(\.css|\.less)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", 'less-loader'],

                })
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                use: [
                    'file-loader?limit=8192&name=/fonts/[name].[ext]'
                ]
            },

            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015'],
                        plugins: ['transform-runtime', 'syntax-dynamic-import']
                    }
                }
            }


        ]
    },
    plugins: [
        new CleanWebpackPlugin(['public'], {
            exclude: ['ueditor']
        }),
        new ExtractTextPlugin({
            filename: function(getPath) {
                console.log(getPath('css/[name].css'));
                return getPath('css/[name].css').replace('css/common', 'css');
            },
            allChunks: true
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new webpack.optimize.UglifyJsPlugin()
    ]
}