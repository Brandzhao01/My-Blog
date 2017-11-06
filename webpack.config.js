const webpack = require('webpack');
const path = require('path');
const srcPath = path.resolve(__dirname, 'src');

module.exports = {
    entry: {
        'common/main': [srcPath + '/common/main.js', 'webpack-hot-middleware/client?reload=ture'],
        'common/admin-lib': ['jquery', 'bootstrap', 'BOOTSTRAP_CSS'],
        'common/lib': ['jquery', 'COMMON_LESS']
    },

    output: {
        path: __dirname + '/public',
        filename: '[name].js',
        publicPath: 'http://localhost:8080/public'
            //publicPath: 'http://localhost:3000/public'
    },
    devtool: 'eval-source-map',

    //取别名
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
                use: 'url-loader?limit=8192&context=client&name=[name].[ext]'
            },
            {
                test: /(\.css|\.less)$/,
                use: [
                    'style-loader',
                    'css-loader?sourceMap',
                    'less-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                use: [
                    'file-loader'
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
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ]
}