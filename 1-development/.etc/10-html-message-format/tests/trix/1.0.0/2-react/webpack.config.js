const path    = require('path')
const modules = path.resolve('../../../../../../3-web-app-react-frontend/02-dev/node_modules') + path.sep
const webpack = require(modules + 'webpack')

module.exports = {
   entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist', 'js'),
        filename: 'bundle.js',
        sourceMapFilename: 'bundle.map'
    },
    devtool: '#source-map',
    resolve: {
        modules: [
            path.resolve('./src'),
            modules.substring(0, modules.length-1)
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: modules + 'babel-loader',
                query: {
                    presets: [modules + 'babel-preset-' + 'env', modules + 'babel-preset-' + 'stage-0', modules + 'babel-preset-' + 'react']
                }
            },
            {
                test: /\.css$/,
                use: [
                    modules + 'style-loader',
                    modules + 'css-loader',
                    {
                        loader: modules + 'postcss-loader',
                        options: {
                            plugins: () => [require(modules + 'autoprefixer')]
                        }
                    }
                ]
            }
        ]
    },
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            warnings: false,
            mangle: true,
            cache: false
        })
    ]
}
