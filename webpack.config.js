const path = require('path')
const HtmlwebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: './src/index.js',
    context: process.cwd(),
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'monitor.js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist')
    },
    plugins:[
        new HtmlwebpackPlugin({
            template:'./src/index.html',
            inject:'head'
        })
    ]
}