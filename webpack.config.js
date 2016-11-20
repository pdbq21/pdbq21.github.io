
const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');

module.exports = {


    entry: "./coming_soon/coming_soon.js",
    output: {
        filename: "build.js"
    },

    watch: true,

    watchOptions: {
        aggregateTimeout: 100
    },

    devtool: NODE_ENV == "development" ? "cheap-module-inline-source-map" : null,

    plugins: [
        /*new webpack.optimize.UglifyJsPlugin({
         compress: {
         warnings: false,
         drop_console: true
         }
         })*/
    ],

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: ['babel'],
                /* include: [
                 path.resolve(__dirname, "src"),
                 ],*/
                exclude: /node_modules/,
                query: {
                    plugins: ['transform-runtime']
                }
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }

        ]
    }

};


