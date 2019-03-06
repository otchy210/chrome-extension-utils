const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        background: path.resolve('src/js/background.js'),
        popup: path.resolve('src/js/popup.js'),
        options: path.resolve('src/js/options.js'),
        page: path.resolve('src/js/page.js'),
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js']
    },
    output: {
        path: path.resolve('build/js'),
        filename: '[name].js',
    }
};
