const path = require('path');
const webpack = require('webpack');

const node_modules_dir = path.resolve(__dirname, 'node_modules');

const javascript = {
    test: /\.(js)$/,
    exclude: [node_modules_dir],
    use: [
        {
            loader: 'babel-loader',
            query: {
                presets: ['react', 'es2015']
            }
        }
    ]
};

const images = {
    test: /\.(png|jpg)$/,
    loader: 'url-loader?limit=8192'
}

const styles = {
    test: /\.(scss)$/,
    loaders: ['style-loader', 'css-loader', 'sass-loader']
};

const config = {
    entry: {
        App: './src/index'
    },
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'public', 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [javascript, styles, images]
    }
}

process.noDeprecation = true;

module.exports = config;