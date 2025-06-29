const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: './dist',
    },
    host: '0.0.0.0',
    port: 9000,
    open: true,
    hot: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  // HAPUS BAGIAN 'module.rules' INI SEPENUHNYA DARI webpack.dev.js
  // Karena aturan CSS sudah ada di webpack.common.js dan akan diwarisi
  /*
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
        type: 'javascript/auto',
      },
    ],
  },
  */
});